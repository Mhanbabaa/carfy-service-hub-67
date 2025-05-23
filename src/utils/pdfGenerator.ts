
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Service } from '@/types/service';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateServiceInvoicePDF = (service: Service): void => {
  // Create a new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Company header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CARFY OTO SERVİS', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Servis Faturası', pageWidth / 2, 28, { align: 'center' });
  
  // Date and invoice info
  doc.setFontSize(9);
  const currentDate = new Date().toLocaleDateString('tr-TR');
  doc.text(`Tarih: ${currentDate}`, 20, 40);
  doc.text(`Fatura No: INV-${service.id.substring(0, 8)}`, 20, 45);
  
  // Line separator
  doc.setDrawColor(220, 220, 220);
  doc.line(20, 50, pageWidth - 20, 50);
  
  // Customer and Vehicle info section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Müşteri ve Araç Bilgileri', 20, 60);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Müşteri:', 20, 70);
  doc.setFont('helvetica', 'bold');
  doc.text(service.customerName, 50, 70);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Plaka:', 20, 75);
  doc.setFont('helvetica', 'bold');
  doc.text(service.plateNumber, 50, 75);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Araç:', 20, 80);
  doc.setFont('helvetica', 'bold');
  doc.text(`${service.make} ${service.model} (${service.year})`, 50, 80);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Kilometre:', 20, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(`${service.mileage.toLocaleString('tr-TR')} km`, 50, 85);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Servis Giriş:', 20, 90);
  doc.setFont('helvetica', 'bold');
  doc.text(service.arrivalDate ? new Date(service.arrivalDate).toLocaleDateString('tr-TR') : '-', 50, 90);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Servis Çıkış:', 20, 95);
  doc.setFont('helvetica', 'bold');
  doc.text(service.deliveryDate ? new Date(service.deliveryDate).toLocaleDateString('tr-TR') : '-', 50, 95);
  
  // Service description section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Servis Bilgileri', 20, 110);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Şikayet/Talep:', 20, 120);
  
  // Wrap complaint text
  const complaintText = service.complaint || 'Belirtilmemiş';
  const complaintLines = doc.splitTextToSize(complaintText, 170);
  doc.text(complaintLines, 20, 125);
  
  // Calculate position for work done section based on complaint text length
  const workDoneY = 125 + (complaintLines.length * 5);
  
  doc.text('Yapılan İşlem:', 20, workDoneY);
  const workDoneText = service.servicePerformed || 'Belirtilmemiş';
  const workDoneLines = doc.splitTextToSize(workDoneText, 170);
  doc.text(workDoneLines, 20, workDoneY + 5);
  
  // Parts table
  const partsY = workDoneY + (workDoneLines.length * 5) + 15;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Kullanılan Parçalar', 20, partsY);
  
  const tableColumns = ['Parça Adı', 'Parça Kodu', 'Adet', 'Birim Fiyat', 'Toplam'];
  
  const tableRows = service.parts.map(part => [
    part.name,
    part.code || '-',
    part.quantity.toString(),
    `₺${part.unitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
    `₺${(part.quantity * part.unitPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
  ]);
  
  // If no parts, add a row indicating no parts
  if (tableRows.length === 0) {
    tableRows.push(['Parça kullanılmamıştır', '-', '-', '-', '-']);
  }
  
  // Add the table
  (doc as any).autoTable({
    startY: partsY + 5,
    head: [tableColumns],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [90, 90, 90], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 20, right: 20 },
  });
  
  // Total costs section
  // Get the finalY position after the table is drawn
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  // Summary of costs
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const costX = pageWidth - 60;
  
  doc.text('İşçilik Ücreti:', costX, finalY);
  doc.text(`₺${service.laborCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, pageWidth - 20, finalY, { align: 'right' });
  
  doc.text('Parça Ücreti:', costX, finalY + 6);
  doc.text(`₺${service.partsCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, pageWidth - 20, finalY + 6, { align: 'right' });
  
  doc.text('Ara Toplam:', costX, finalY + 12);
  doc.text(`₺${service.totalCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, pageWidth - 20, finalY + 12, { align: 'right' });
  
  doc.text('KDV (%18):', costX, finalY + 18);
  doc.text(`₺${(service.totalCost * 0.18).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, pageWidth - 20, finalY + 18, { align: 'right' });
  
  doc.setDrawColor(100, 100, 100);
  doc.line(costX, finalY + 20, pageWidth - 20, finalY + 20);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Genel Toplam:', costX, finalY + 26);
  doc.text(`₺${(service.totalCost * 1.18).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, pageWidth - 20, finalY + 26, { align: 'right' });
  
  // Footer
  const footerY = finalY + 40;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Bu belge bilgi amaçlıdır ve yasal fatura yerine geçmez.', pageWidth / 2, footerY, { align: 'center' });
  doc.text('CARFY Oto Servis Yönetim Sistemi ile oluşturulmuştur.', pageWidth / 2, footerY + 4, { align: 'center' });
  
  // Save the PDF
  doc.save(`servis_${service.plateNumber}.pdf`);
};
