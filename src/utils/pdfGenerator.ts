
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Service } from '@/types/service';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

export const generateServiceInvoicePDF = (service: Service): void => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Company header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('CARFY OTOSERVIS', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Carfy Plaza No:123, Istanbul', pageWidth / 2, 28, { align: 'center' });
    doc.text('0212 123 45 67', pageWidth / 2, 33, { align: 'center' });
    doc.text('info@carfy.com', pageWidth / 2, 38, { align: 'center' });
    
    // FATURA header on right side
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('FATURA', pageWidth - 20, 30, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fatura No: ${service.id.substring(0, 8)}`, pageWidth - 20, 38, { align: 'right' });
    const currentDate = new Date().toLocaleDateString('tr-TR');
    doc.text(`Düzenlenme Tarihi: ${currentDate}`, pageWidth - 20, 43, { align: 'right' });
    
    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 50, pageWidth - 20, 50);
    
    // Customer section - ALICI BİLGİLERİ
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ALICI BİLGİLERİ', 20, 65);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(service.customerName, 20, 73);
    doc.text(`${service.plateNumber} - ${service.make} ${service.model}`, 20, 78);
    doc.text(`Geliş KM: ${service.mileage.toLocaleString('tr-TR')}`, 20, 83);
    
    const arrivalDate = service.arrivalDate ? new Date(service.arrivalDate).toLocaleDateString('tr-TR') : '-';
    doc.text(`Geliş Tarihi: ${arrivalDate}`, 20, 88);
    
    // Parts table - with KDV column
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PARÇA VE İŞÇİLİK BİLGİLERİ', 20, 100);
    
    // Prepare table data
    const tableColumns = ['AÇIKLAMA', 'MIKTAR', 'KDV', 'BİRİM FİYATI', 'TOPLAM'];
    
    // Parts rows
    const tableRows = service.parts.map(part => [
      part.name,
      part.quantity.toString(),
      '%18',
      `${part.unitPrice.toFixed(2)} TL`,
      `${(part.quantity * part.unitPrice).toFixed(2)} TL`
    ]);
    
    // Add labor row if labor cost exists
    if (service.laborCost > 0) {
      tableRows.push([
        'İşçilik',
        '1',
        '%18',
        `${service.laborCost.toFixed(2)} TL`,
        `${service.laborCost.toFixed(2)} TL`
      ]);
    }
    
    // If no parts or labor, add a placeholder row
    if (tableRows.length === 0) {
      tableRows.push(['Parça veya işçilik bulunmamaktadır', '-', '-', '-', '-']);
    }
    
    // Add the table with borders
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 105,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [80, 80, 80],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 30, halign: 'center' },
        3: { cellWidth: 40, halign: 'right' },
        4: { cellWidth: 40, halign: 'right' }
      },
      margin: { left: 20, right: 20 }
    });
    
    // Get the final Y position after the table is drawn
    const finalY = doc.lastAutoTable.finalY + 10;
    
    // Summary section
    const summaryX = pageWidth - 80;
    const summaryValueX = pageWidth - 20;
    
    doc.setFont('helvetica', 'normal');
    doc.text('ARA TOPLAM :', summaryX, finalY);
    doc.text(`${service.totalCost.toFixed(2)} TL`, summaryValueX, finalY, { align: 'right' });
    
    doc.text('VERGİLER :', summaryX, finalY + 7);
    const taxAmount = service.totalCost * 0.18;
    doc.text(`${taxAmount.toFixed(2)} TL`, summaryValueX, finalY + 7, { align: 'right' });
    
    // Draw line before total
    doc.setLineWidth(0.5);
    doc.line(summaryX - 10, finalY + 10, summaryValueX, finalY + 10);
    
    // Total amount in bold
    doc.setFont('helvetica', 'bold');
    doc.text('TOPLAM FİYAT :', summaryX, finalY + 18);
    const totalWithTax = service.totalCost * 1.18;
    doc.text(`${totalWithTax.toFixed(2)} TL`, summaryValueX, finalY + 18, { align: 'right' });
    
    // Payment information section
    const paymentY = finalY + 35;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ÖDEME BİLGİSİ', 20, paymentY);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Hesap Adı: CARFY OTOSERVIS', 20, paymentY + 10);
    doc.text('Hesap No: 123 456 7890', 20, paymentY + 15);
    doc.text('Ödeme Vadesi: Araç tesliminde', 20, paymentY + 20);
    
    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Bu belge bilgi amaçlıdır ve yasal fatura yerine geçmez.', pageWidth / 2, footerY, { align: 'center' });
    doc.text('CARFY Oto Servis Yönetim Sistemi ile oluşturulmuştur.', pageWidth / 2, footerY + 5, { align: 'center' });
    
    // Save the PDF with service plate number as filename
    doc.save(`servis_fatura_${service.plateNumber.replace(/\s+/g, '')}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
