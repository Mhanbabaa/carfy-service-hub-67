
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

// Fallback yazdırma modalı - optimize edilmiş tek sayfa tasarım
const openPrintModal = async (service: Service) => {
  const currentDate = new Date().toLocaleDateString('tr-TR');
  const arrivalDate = service.arrivalDate ? new Date(service.arrivalDate).toLocaleDateString('tr-TR') : '-';
  const taxRate = 0.18;
  const subtotal = service.totalCost / (1 + taxRate);
  const taxAmount = service.totalCost - subtotal;

  // Tenant bilgisini al
  let tenantName = 'CARFY OTOSERVİS';
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      const { data: userProfile } = await supabase
        .from('users')
        .select('tenant:tenants(name)')
        .eq('id', userData.user.id)
        .single();
      
      if (userProfile?.tenant?.name) {
        tenantName = userProfile.tenant.name;
      }
    }
  } catch (error) {
    console.error('Tenant bilgisi alınamadı:', error);
  }

  // Dinamik yükseklik için kontroller
  const hasComplaint = service.complaint && service.complaint !== 'Belirtilmemiş';
  const hasServicePerformed = service.servicePerformed && service.servicePerformed !== 'Belirtilmemiş';
  const hasTechnician = service.technician && service.technician.trim() !== '';

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Servis Formu / Fatura</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 11px;
          line-height: 1.3;
          color: #333;
          background: white;
          padding: 12mm 15mm;
        }

        .invoice-page {
          width: 100%;
          max-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          border-bottom: 2px solid #2c5aa0;
          padding-bottom: 12px;
        }

        .company-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .logo-placeholder {
          width: 50px;
          height: 32px;
          border: 2px solid #2c5aa0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: bold;
          color: #2c5aa0;
          background-color: #f8f9fa;
          margin-bottom: 6px;
        }

        .company-name {
          font-size: 18px;
          font-weight: bold;
          color: #2c5aa0;
          margin: 3px 0;
        }

        .company-details {
          font-size: 10px;
          color: #666;
          line-height: 1.4;
        }

        .invoice-section {
          text-align: right;
          flex: 1;
        }

        .invoice-title {
          font-size: 16px;
          font-weight: bold;
          margin: 0 0 10px 0;
          color: #2c5aa0;
          background-color: #f0f4f8;
          padding: 6px 10px;
          border-radius: 3px;
        }

        .invoice-details {
          font-size: 10px;
        }

        .detail-row {
          display: flex;
          justify-content: flex-end;
          margin: 4px 0;
          gap: 12px;
        }

        .label {
          font-weight: bold;
          color: #555;
        }

        .value {
          min-width: 80px;
          color: #333;
        }

        .info-section {
          margin-bottom: 12px;
        }

        .info-columns {
          display: flex;
          gap: 20px;
        }

        .info-column {
          flex: 1;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 10px;
          background-color: #fafbfc;
        }

        .info-title {
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #2c5aa0;
          border-bottom: 1px solid #eee;
          padding-bottom: 3px;
        }

        .info-content {
          font-size: 10px;
        }

        .info-line {
          display: flex;
          margin: 5px 0;
        }

        .info-label {
          font-weight: bold;
          min-width: 70px;
          color: #555;
        }

        .info-value {
          color: #333;
        }

        .service-details {
          margin-bottom: 12px;
        }

        .service-box {
          margin-bottom: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 8px;
          background-color: #fafbfc;
        }

        .service-box.single-box {
          margin-bottom: 12px;
        }

        .service-title {
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 6px;
          color: #2c5aa0;
          border-bottom: 1px solid #eee;
          padding-bottom: 3px;
        }

        .service-content {
          font-size: 10px;
          line-height: 1.4;
          color: #333;
        }

        .technician-info {
          margin-top: 6px;
          font-size: 10px;
          color: #666;
        }

        .table-summary-section {
          flex: 1;
          margin-bottom: 12px;
        }

        .table-title {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #2c5aa0;
        }

        .table-container {
          position: relative;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #333;
          font-size: 9px;
          margin-bottom: 10px;
        }

        .items-table th,
        .items-table td {
          border: 1px solid #333;
          padding: 6px 5px;
          text-align: left;
        }

        .items-table th {
          background-color: #f5f5f5;
          font-weight: bold;
          font-size: 8px;
          text-align: center;
        }

        .center { text-align: center; }
        .right { text-align: right; }

        .summary-box {
          width: 240px;
          border: 1px solid #2c5aa0;
          border-radius: 4px;
          padding: 10px;
          background-color: #f8f9fa;
          margin-left: auto;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin: 5px 0;
          font-size: 10px;
        }

        .total-row {
          border-top: 2px solid #2c5aa0;
          padding-top: 6px;
          margin-top: 8px;
          font-size: 12px;
          background-color: #e8f4f8;
          padding: 8px 0 4px 0;
          border-radius: 2px;
        }

        .summary-label {
          font-weight: normal;
        }

        .summary-value {
          font-weight: normal;
          min-width: 70px;
          text-align: right;
        }

        .footer {
          margin-top: auto;
          border-top: 1px solid #ddd;
          padding-top: 8px;
          font-size: 9px;
          color: #666;
          text-align: center;
        }

        @media print { 
          button { display: none; }
          body { padding: 12mm 15mm; }
          .invoice-page {
            max-height: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-page">
        <div class="header">
          <div class="company-section">
            <div class="logo-placeholder">LOGO</div>
            <h1 class="company-name">${tenantName}</h1>
            <div class="company-details">
              <div>Carfy Plaza No:123, İstanbul</div>
              <div>Tel: 0212 123 45 67</div>
              <div>E-posta: info@carfy.com</div>
            </div>
          </div>
          <div class="invoice-section">
            <div class="invoice-title">SERVİS FORMU / FATURA</div>
            <div class="invoice-details">
              <div class="detail-row">
                <span class="label">Fatura No:</span>
                <span class="value">${service.id.substring(0, 8)}</span>
              </div>
              <div class="detail-row">
                <span class="label">Düzenleme Tarihi:</span>
                <span class="value">${currentDate}</span>
              </div>
              <div class="detail-row">
                <span class="label">Servis Kayıt Tarihi:</span>
                <span class="value">${arrivalDate}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <div class="info-columns">
            <div class="info-column">
              <div class="info-title">MÜŞTERİ BİLGİLERİ</div>
              <div class="info-content">
                <div class="info-line">
                  <span class="info-label">Müşteri:</span>
                  <span class="info-value">${service.customerName}</span>
                </div>
                <div class="info-line">
                  <span class="info-label">İletişim:</span>
                  <span class="info-value">-</span>
                </div>
              </div>
            </div>
            <div class="info-column">
              <div class="info-title">ARAÇ BİLGİLERİ</div>
              <div class="info-content">
                <div class="info-line">
                  <span class="info-label">Plaka:</span>
                  <span class="info-value">${service.plateNumber}</span>
                </div>
                <div class="info-line">
                  <span class="info-label">Marka/Model:</span>
                  <span class="info-value">${service.make} ${service.model}</span>
                </div>
                <div class="info-line">
                  <span class="info-label">Yıl:</span>
                  <span class="info-value">${service.year}</span>
                </div>
                <div class="info-line">
                  <span class="info-label">Kilometre:</span>
                  <span class="info-value">${service.mileage.toLocaleString('tr-TR')} km</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        ${hasComplaint || hasServicePerformed ? `
        <div class="service-details">
          ${hasComplaint ? `
          <div class="service-box ${!hasServicePerformed ? 'single-box' : ''}">
            <div class="service-title">MÜŞTERİ ŞİKAYET / TALEPLERİ</div>
            <div class="service-content">${service.complaint}</div>
          </div>
          ` : ''}
          
          ${hasServicePerformed ? `
          <div class="service-box ${!hasComplaint ? 'single-box' : ''}">
            <div class="service-title">YAPILAN İŞLEMLER VE TEKNİSYEN NOTLARI</div>
            <div class="service-content">${service.servicePerformed}</div>
            ${hasTechnician ? `
              <div class="technician-info">
                <strong>Teknisyen:</strong> ${service.technician}
              </div>
            ` : ''}
          </div>
          ` : ''}
        </div>
        ` : ''}

        <div class="table-summary-section">
          <h3 class="table-title">DETAYLI DÖKÜM (PARÇA VE İŞÇİLİK TABLOSU)</h3>
          <div class="table-container">
            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 35%; text-align: left;">AÇIKLAMA</th>
                  <th style="width: 12%; text-align: center;">MIKTAR</th>
                  <th style="width: 18%; text-align: right;">BİRİM FİYAT</th>
                  <th style="width: 15%; text-align: center;">KDV ORANI</th>
                  <th style="width: 20%; text-align: right;">TOPLAM TUTAR</th>
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
                ${service.parts.length === 0 && service.laborCost === 0 ? `
                  <tr>
                    <td colspan="5" class="center">Parça veya işçilik bulunmamaktadır</td>
                  </tr>
                ` : ''}
              </tbody>
            </table>
            
            <div class="summary-box">
              <div class="summary-row">
                <span class="summary-label">Ara Toplam:</span>
                <span class="summary-value">₺${subtotal.toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Toplam KDV (%18):</span>
                <span class="summary-value">₺${taxAmount.toFixed(2)}</span>
              </div>
              <div class="summary-row total-row">
                <span class="summary-label"><strong>GENEL TOPLAM:</strong></span>
                <span class="summary-value"><strong>₺${service.totalCost.toFixed(2)}</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <div>Bizi tercih ettiğiniz için teşekkür ederiz.</div>
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()" style="padding: 8px 16px; margin: 5px; background: #2c5aa0; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Yazdır</button>
          <button onclick="window.close()" style="padding: 8px 16px; margin: 5px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Kapat</button>
        </div>
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
