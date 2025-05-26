
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types/service';

export const generateServiceInvoicePDF = async (service: Service): Promise<void> => {
  try {
    console.log('PDF oluşturma başlatılıyor...', service.id);
    
    // Supabase Edge Function'ı çağır
    const { data, error } = await supabase.functions.invoke('generate-invoice-pdf', {
      body: { serviceId: service.id }
    });

    if (error) {
      console.error('Edge Function hatası:', error);
      // Fallback: basit yazdırma modalı aç
      openPrintModal(service);
      return;
    }

    // Edge Function başarılı ise PDF'i indir
    if (data instanceof ArrayBuffer) {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fatura_${service.plateNumber.replace(/\s+/g, '')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else if (typeof data === 'string') {
      // HTML fallback
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(data);
        printWindow.document.close();
        printWindow.print();
      }
    }
  } catch (error) {
    console.error('PDF oluşturma hatası:', error);
    // Fallback: basit yazdırma modalı aç
    openPrintModal(service);
  }
};

// Fallback yazdırma modalı
const openPrintModal = (service: Service) => {
  const currentDate = new Date().toLocaleDateString('tr-TR');
  const arrivalDate = service.arrivalDate ? new Date(service.arrivalDate).toLocaleDateString('tr-TR') : '-';
  const taxAmount = service.totalCost * 0.18;
  const totalWithTax = service.totalCost * 1.18;

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Servis Faturası</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .info { margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
        .total { text-align: right; margin: 20px 0; }
        @media print { button { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>CARFY OTOSERVIS</h1>
        <p>Carfy Plaza No:123, Istanbul<br>0212 123 45 67<br>info@carfy.com</p>
        <h2>FATURA</h2>
        <p>Fatura No: ${service.id.substring(0, 8)}<br>Düzenlenme Tarihi: ${currentDate}</p>
      </div>
      
      <div class="info">
        <h3>ALICI BİLGİLERİ</h3>
        <p><strong>${service.customerName}</strong><br>
        ${service.plateNumber} - ${service.make} ${service.model}<br>
        Geliş KM: ${service.mileage.toLocaleString('tr-TR')}<br>
        Geliş Tarihi: ${arrivalDate}</p>
      </div>

      <h3>PARÇA VE İŞÇİLİK BİLGİLERİ</h3>
      <table>
        <thead>
          <tr>
            <th>AÇIKLAMA</th>
            <th>MIKTAR</th>
            <th>KDV</th>
            <th>BİRİM FİYATI</th>
            <th>TOPLAM</th>
          </tr>
        </thead>
        <tbody>
          ${service.parts.map(part => `
            <tr>
              <td>${part.name}</td>
              <td>${part.quantity}</td>
              <td>%18</td>
              <td>${part.unitPrice.toFixed(2)} TL</td>
              <td>${(part.quantity * part.unitPrice).toFixed(2)} TL</td>
            </tr>
          `).join('')}
          ${service.laborCost > 0 ? `
            <tr>
              <td>İşçilik</td>
              <td>1</td>
              <td>%18</td>
              <td>${service.laborCost.toFixed(2)} TL</td>
              <td>${service.laborCost.toFixed(2)} TL</td>
            </tr>
          ` : ''}
        </tbody>
      </table>

      <div class="total">
        <p>ARA TOPLAM: ${service.totalCost.toFixed(2)} TL</p>
        <p>VERGİLER: ${taxAmount.toFixed(2)} TL</p>
        <p><strong>TOPLAM FİYAT: ${totalWithTax.toFixed(2)} TL</strong></p>
      </div>

      <button onclick="window.print()">Yazdır</button>
      <button onclick="window.close()">Kapat</button>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
  }
};
