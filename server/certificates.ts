import PDFDocument from "pdfkit";
import { storage } from "./storage";
import type { Certificate, Course, User } from "@shared/schema";

export class CertificateGenerator {
  async generateCertificatePDF(certificateId: number): Promise<Buffer> {
    const certificate = await storage.getCertificate(certificateId);
    if (!certificate) {
      throw new Error("Certificate not found");
    }

    const course = await storage.getCourse(certificate.courseId);
    const user = await storage.getUser(certificate.userId);

    if (!course || !user) {
      throw new Error("Course or user not found");
    }

    return this.createPDF(certificate, course, user);
  }

  private async createPDF(certificate: Certificate, course: Course, user: User): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        const chunks: Buffer[] = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Background color
        doc.rect(0, 0, doc.page.width, doc.page.height)
           .fill('#f8f9fa');

        // Main certificate border
        doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
           .stroke('#0097D7', 3);

        // Inner decorative border
        doc.rect(50, 50, doc.page.width - 100, doc.page.height - 100)
           .stroke('#F7941D', 1);

        // Header
        doc.fillColor('#0097D7')
           .fontSize(32)
           .font('Helvetica-Bold')
           .text('CERTIFICATE OF COMPLETION', 0, 100, { align: 'center' });

        // EACCC Logo area (text placeholder)
        doc.fillColor('#0097D7')
           .fontSize(16)
           .font('Helvetica-Bold')
           .text('EAST AFRICAN CUSTOMER CARE CENTER', 0, 150, { align: 'center' });

        doc.fillColor('#F7941D')
           .fontSize(14)
           .font('Helvetica')
           .text('Learning Platform', 0, 175, { align: 'center' });

        // Certificate content
        doc.fillColor('#000000')
           .fontSize(18)
           .font('Helvetica')
           .text('This is to certify that', 0, 230, { align: 'center' });

        // Student name
        doc.fillColor('#0097D7')
           .fontSize(28)
           .font('Helvetica-Bold')
           .text(`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Student', 0, 270, { align: 'center' });

        // Course completion text
        doc.fillColor('#000000')
           .fontSize(18)
           .font('Helvetica')
           .text('has successfully completed the course', 0, 320, { align: 'center' });

        // Course title
        doc.fillColor('#F7941D')
           .fontSize(24)
           .font('Helvetica-Bold')
           .text(course.title, 0, 360, { align: 'center' });

        // Course details
        if (course.duration) {
          doc.fillColor('#666666')
             .fontSize(14)
             .font('Helvetica')
             .text(`Course Duration: ${course.duration}`, 0, 400, { align: 'center' });
        }

        // Completion date
        const completionDate = certificate.issuedAt ? new Date(certificate.issuedAt) : new Date();
        doc.fillColor('#000000')
           .fontSize(16)
           .font('Helvetica')
           .text(`Completed on: ${completionDate.toLocaleDateString('en-US', { 
             year: 'numeric', 
             month: 'long', 
             day: 'numeric' 
           })}`, 0, 440, { align: 'center' });

        // Instructor signature area
        if (course.instructor?.name) {
          doc.fillColor('#000000')
             .fontSize(14)
             .font('Helvetica-Bold')
             .text('Instructor:', 120, 500);

          doc.fontSize(14)
             .font('Helvetica')
             .text(course.instructor.name, 120, 520);

          // Signature line
          doc.moveTo(120, 550)
             .lineTo(280, 550)
             .stroke('#000000', 1);
        }

        // Platform signature area
        doc.fillColor('#000000')
           .fontSize(14)
           .font('Helvetica-Bold')
           .text('EACCC Learning Platform', doc.page.width - 280, 500);

        doc.fontSize(12)
           .font('Helvetica')
           .text('Authorized Representative', doc.page.width - 280, 520);

        // Signature line
        doc.moveTo(doc.page.width - 280, 550)
           .lineTo(doc.page.width - 120, 550)
           .stroke('#000000', 1);

        // Certificate ID
        doc.fillColor('#666666')
           .fontSize(10)
           .font('Helvetica')
           .text(`Certificate ID: EACCC-${certificate.id}-${completionDate.getFullYear()}`, 50, doc.page.height - 80);

        // QR code placeholder (text)
        doc.fontSize(8)
           .text('Verify at: https://eaccc-learning.com/verify', doc.page.width - 200, doc.page.height - 80);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const certificateGenerator = new CertificateGenerator();