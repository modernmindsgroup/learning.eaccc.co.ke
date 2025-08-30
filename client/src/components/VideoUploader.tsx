import { useState } from "react";
import type { ReactNode } from "react";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import AwsS3 from "@uppy/aws-s3";
import type { UploadResult } from "@uppy/core";
import { Button } from "@/components/ui/button";

interface VideoUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (
    result: UploadResult<Record<string, unknown>, Record<string, unknown>>
  ) => void;
  buttonClassName?: string;
  children: ReactNode;
}

/**
 * A video upload component that renders as a button and provides a modal interface for
 * video file management.
 * 
 * Features:
 * - Renders as a customizable button that opens a video upload modal
 * - Provides a modal interface for:
 *   - Video file selection
 *   - File preview
 *   - Upload progress tracking
 *   - Upload status display
 * - Accepts common video formats (mp4, mov, avi, etc.)
 * 
 * The component uses Uppy under the hood to handle all video upload functionality.
 */
export function VideoUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 104857600, // 100MB default for videos
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
}: VideoUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles,
        maxFileSize,
        allowedFileTypes: ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'],
      },
      autoProceed: false,
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: onGetUploadParameters,
      })
      .on("complete", (result) => {
        onComplete?.(result);
      })
  );

  return (
    <div>
      <Button onClick={() => setShowModal(true)} className={buttonClassName}>
        {children}
      </Button>

      <DashboardModal
        uppy={uppy}
        open={showModal}
        onRequestClose={() => setShowModal(false)}
        proudlyDisplayPoweredByUppy={false}
        note="Videos only, up to 100 MB"
      />
    </div>
  );
}