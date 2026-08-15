import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportToPdf(
  filename: string,
  title: string,
  headers: string[],
  rows: unknown[][]
): void {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(title, 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generated ${new Date().toLocaleDateString()}`, 14, 24);

  autoTable(doc, {
    startY: 30,
    head: [headers],
    body: rows.map((row) => row.map((cell) => (cell === null || cell === undefined ? '' : String(cell)))),
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 9 },
  });

  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}
