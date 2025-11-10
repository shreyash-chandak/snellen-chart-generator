import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadChart = async (
  element: HTMLElement,
  fileType: 'png' | 'pdf' | 'svg' | 'jpg'
): Promise<void> => {
  const timestamp = new Date().getTime();
  const filename = `snellen-chart-${timestamp}`;

  // For raster image exports (PNG/JPG/PDF), generate a canvas first
  if (fileType === 'png' || fileType === 'jpg' || fileType === 'pdf') {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
    });

    // Convert to base64-encoded image
    const mimeType = fileType === 'jpg' ? 'image/jpeg' : 'image/png';
    const imgData = canvas.toDataURL(mimeType);

    if (fileType === 'pdf') {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${filename}.pdf`);
    } else {
      // Handle PNG or JPG download
      const link = document.createElement('a');
      link.download = `${filename}.${fileType}`;
      link.href = imgData;
      link.click();
    }

    return;
  }

  // For vector SVG export
  if (fileType === 'svg') {
    const svgContent = convertToSVG(element);
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = `${filename}.svg`;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  }
};

const convertToSVG = (element: HTMLElement): string => {
  const letters = element.querySelectorAll('div[style*="fontSize"]');
  let yPosition = 50;
  const svgElements: string[] = [];

  letters.forEach((letterDiv) => {
    const text = letterDiv.textContent || '';
    const fontSize = parseInt(window.getComputedStyle(letterDiv).fontSize || '16');

    svgElements.push(
      `<text x="50%" y="${yPosition}" font-size="${fontSize}" font-family="serif" font-weight="bold" text-anchor="middle" fill="#1e293b">${text}</text>`
    );

    yPosition += fontSize * 1.5;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="${yPosition + 50}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white"/>
  ${svgElements.join('\n  ')}
</svg>`;
};
