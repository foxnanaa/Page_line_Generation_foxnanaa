
import { jsPDF } from 'jspdf';
import { GridConfig } from '../types';

export const generateA4GridPDF = (config: GridConfig) => {
  const { orientation, spacing, lineColor, lineWidth, showCenterLine, margin, pageCount } = config;

  // A4 dimensions in mm
  const width = orientation === 'landscape' ? 297 : 210;
  const height = orientation === 'landscape' ? 210 : 297;

  const doc = new jsPDF({
    orientation: orientation,
    unit: 'mm',
    format: 'a4'
  });

  for (let page = 0; page < pageCount; page++) {
    if (page > 0) {
      doc.addPage('a4', orientation);
    }

    doc.setDrawColor(lineColor);
    // Set line width (jsPDF uses mm because unit is 'mm')
    doc.setLineWidth(lineWidth);

    // Draw Horizontal Lines
    for (let y = margin; y <= height - margin; y += spacing) {
      // Left side lines
      doc.line(margin, y, (width / 2), y);
      // Right side lines
      doc.line((width / 2), y, width - margin, y);
    }

    // Draw Center Vertical Divider
    if (showCenterLine) {
      // Make center line slightly more prominent or keep same
      doc.setLineWidth(lineWidth * 1.5);
      doc.line(width / 2, margin, width / 2, height - margin);
    }
  }

  // Save the PDF
  doc.save(`A4_${orientation}_${spacing}mm_${pageCount}pages.pdf`);
};
