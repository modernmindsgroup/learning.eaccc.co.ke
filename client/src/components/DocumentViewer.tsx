import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, FileText, Download } from "lucide-react";

interface DocumentViewerProps {
  fileUrl: string;
  contentType: "pdf" | "pptx" | "docx";
  totalPages: number;
  viewedPages?: number[];
  onPageChange?: (currentPage: number) => void;
  onAllPagesViewed?: () => void;
  initialPage?: number;
}

export function DocumentViewer({
  fileUrl,
  contentType,
  totalPages,
  viewedPages: initialViewedPages = [],
  onPageChange,
  onAllPagesViewed,
  initialPage = 1,
}: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [viewedPages, setViewedPages] = useState<Set<number>>(
    new Set(initialViewedPages.length > 0 ? initialViewedPages : [initialPage])
  );
  const [isLoading, setIsLoading] = useState(true);

  // Update viewed pages when initial data changes
  useEffect(() => {
    if (initialViewedPages.length > 0) {
      setViewedPages(new Set(initialViewedPages));
    }
  }, [initialViewedPages]);

  const progress = (viewedPages.size / totalPages) * 100;

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setViewedPages(prev => new Set(prev).add(nextPage));
      onPageChange?.(nextPage);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      setViewedPages(prev => new Set(prev).add(prevPage));
      onPageChange?.(prevPage);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setViewedPages(prev => new Set(prev).add(page));
      onPageChange?.(page);
    }
  };

  // Check if all pages have been viewed
  useEffect(() => {
    if (viewedPages.size === totalPages && onAllPagesViewed) {
      onAllPagesViewed();
    }
  }, [viewedPages.size, totalPages, onAllPagesViewed]);

  const renderDocumentViewer = () => {
    if (contentType === "pdf") {
      return (
        <iframe
          src={`${fileUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0`}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          title="PDF Document"
        />
      );
    }

    // For PowerPoint and Word documents, we'll show them as embedded objects
    // Note: These may not display perfectly in all browsers, but will work for most cases
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {contentType.toUpperCase()} Document
            </h3>
            <p className="text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => window.open(fileUrl, '_blank')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download to View
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Progress Bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress: {Math.round(progress)}%
          </span>
          <span className="text-sm text-gray-600">
            {viewedPages.size} of {totalPages} pages viewed
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Document Viewer */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading document...</p>
            </div>
          </div>
        )}
        {renderDocumentViewer()}
      </div>

      {/* Navigation Controls */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2"
            data-testid="button-prev-page"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Page</span>
              <select
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
                data-testid="select-page"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <option key={page} value={page}>
                    {page}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600">of {totalPages}</span>
            </div>

            {/* Page indicator dots */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                const page = Math.floor((i / 10) * totalPages) + 1;
                return (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      viewedPages.has(page)
                        ? "bg-green-500"
                        : page === currentPage
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                    title={`Page ${page} ${viewedPages.has(page) ? "(viewed)" : ""}`}
                  />
                );
              })}
            </div>
          </div>

          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2"
            data-testid="button-next-page"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Completion Status */}
        {viewedPages.size === totalPages && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800 font-medium">
              ✓ All pages viewed! You can now complete this lesson.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}