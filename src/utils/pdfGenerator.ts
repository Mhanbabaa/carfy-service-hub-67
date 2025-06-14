
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
  const taxRate = 0.18;
  const subtotal = service.totalCost / (1 + taxRate);
  const taxAmount = service.totalCost - subtotal;

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Servis Formu / Fatura</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          padding: 20px; 
          color: #333;
        }
        .header { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #ddd;
          padding-bottom: 20px;
        }
        .company-section h1 { 
          color: #2c3e50; 
          margin: 10px 0;
        }
        .logo-placeholder {
          width: 60px;
          height: 40px;
          border: 2px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          color: #999;
          background-color: #f9f9f9;
          margin-bottom: 10px;
        }
        .invoice-section { 
          text-align: right; 
        }
        .invoice-title {
          font-size: 18px;
          font-weight: bold;
          color: #2c3e50;
          background-color: #f8f9fa;
          padding: 8px 12px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        .info-columns {
          display: flex;
          gap: 30px;
          margin: 20px 0;
        }
        .info-column {
          flex: 1;
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 6px;
          background-color: #fdfdfd;
        }
        .info-title {
          font-weight: bold;
          margin-bottom: 10px;
          color: #2c3e50;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        .service-box {
          margin: 15px 0;
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 6px;
          background-color: #fdfdfd;
        }
        .service-title {
          font-weight: bold;
          margin-bottom: 10px;
          color: #2c3e50;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0; 
          border: 1px solid #000;
        }
        th, td { 
          border: 1px solid #000; 
          padding: 10px 8px; 
          text-align: left; 
        }
        th { 
          background-color: #f5f5f5; 
          font-weight: bold;
        }
        .summary-box {
          width: 280px;
          border: 1px solid #333;
          padding: 15px;
          margin: 20px 0 0 auto;
          background-color: #f9f9f9;
          border-radius: 6px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
        }
        .total-row {
          border-top: 2px solid #333;
          padding-top: 8px;
          margin-top: 15px;
          font-weight: bold;
          background-color: #e8f4f8;
          padding: 10px;
          border-radius: 4px;
        }
        .footer {
          margin-top: 40px;
          border-top: 1px solid #ddd;
          padding-top: 15px;
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #666;
        }
        .center { text-align: center; }
        .right { text-align: right; }
        @media print { 
          button { display: none; }
          body { padding: 15mm; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-section">
          <div class="logo-placeholder">LOGO</div>
          <h1>CARFY OTOSERVİS</h1>
          <div>Carfy Plaza No:123, İstanbul</div>
          <div>Tel: 0212 123 45 67</div>
          <div>E-posta: info@carfy.com</div>
        </div>
        <div class="invoice-section">
          <div class="invoice-title">SERVİS FORMU / FATURA</div>
          <div><strong>Fatura No:</strong> ${service.id.substring(0, 8)}</div>
          <div><strong>Düzenleme Tarihi:</strong> ${currentDate}</div>
          <div><strong>Servis Kayıt Tarihi:</strong> ${arrivalDate}</div>
        </div>
      </div>
      
      <div class="info-columns">
        <div class="info-column">
          <div class="info-title">MÜŞTERİ BİLGİLERİ</div>
          <div><strong>Müşteri:</strong> ${service.customerName}</div>
          <div><strong>İletişim:</strong> -</div>
        </div>
        <div class="info-column">
          <div class="info-title">ARAÇ BİLGİLERİ</div>
          <div><strong>Plaka:</strong> ${service.plateNumber}</div>
          <div><strong>Marka/Model:</strong> ${service.make} ${service.model}</div>
          <div><strong>Yıl:</strong> ${service.year}</div>
          <div><strong>Kilometre:</strong> ${service.mileage.toLocaleString('tr-TR')} km</div>
        </div>
      </div>

      <div class="service-box">
        <div class="service-title">MÜŞTERİ ŞİKAYET / TALEPLERİ</div>
        <div>${service.complaint === 'Belirtilmemiş' ? 'Müşteri tarafından özel bir talep belirtilmemiştir.' : service.complaint}</div>
      </div>

      <div class="service-box">
        <div class="service-title">YAPILAN İŞLEMLER VE TEKNİSYEN NOTLARI</div>
        <div>${service.servicePerformed === 'Belirtilmemiş' ? 'Yapılan işlemler servis dökümünde listelenmiştir.' : service.servicePerformed}</div>
        ${service.technician ? `<div style="margin-top: 10px;"><strong>Teknisyen:</strong> ${service.technician}</div>` : ''}
      </div>

      <h3>DETAYLI DÖKÜM (PARÇA VE İŞÇİLİK TABLOSU)</h3>
      <table>
        <thead>
          <tr>
            <th>AÇIKLAMA</th>
            <th class="center">MIKTAR</th>
            <th class="right">BİRİM FİYAT</th>
            <th class="center">KDV ORANI</th>
            <th class="right">TOPLAM TUTAR</th>
          </tr>
        </thead>
        <tbody>
          ${service.parts.map(part => `
            <tr>
              <td>${part.name}</td>
              <td class="center">${part.quantity}</td>
              <td class="right">₺${part.unitPrice.toFixed(2)}</td>
              <td class="center">%18</td>
              <td class="right">₺${(part.quantity * part.unitPrice).toFixed(2)}</td>
            </tr>
          `).join('')}
          ${service.laborCost > 0 ? `
            <tr>
              <td>İşçilik</td>
              <td class="center">1</td>
              <td class="right">₺${service.laborCost.toFixed(2)}</td>
              <td class="center">%18</td>
              <td class="right">₺${service.laborCost.toFixed(2)}</td>
            </tr>
          ` : ''}
        </tbody>
      </table>

      <div class="summary-box">
        <div class="summary-row">
          <span>Ara Toplam:</span>
          <span>₺${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Toplam KDV (%18):</span>
          <span>₺${taxAmount.toFixed(2)}</span>
        </div>
        <div class="summary-row total-row">
          <span><strong>GENEL TOPLAM:</strong></span>
          <span><strong>₺${service.totalCost.toFixed(2)}</strong></span>
        </div>
      </div>

      <div class="footer">
        <div>Bizi tercih ettiğiniz için teşekkür ederiz.</div>
        <div>Ödeme Bilgileri: IBAN: TR00 0000 0000 0000 0000 0000 00</div>
        <div>Vergi No: 123456789 - Vergi Dairesi: İstanbul</div>
      </div>

      <div style="margin-top: 30px; text-align: center;">
        <button onclick="window.print()" style="padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Yazdır</button>
        <button onclick="window.close()" style="padding: 10px 20px; margin: 5px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Kapat</button>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
  }
};
