
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

// Optimized single-page professional PDF layout
const openPrintModal = async (service: Service) => {
  const currentDate = new Date().toLocaleDateString('tr-TR');
  const arrivalDate = service.arrivalDate ? new Date(service.arrivalDate).toLocaleDateString('tr-TR') : '-';
  const taxRate = 0.18;
  const subtotal = service.totalCost / (1 + taxRate);
  const taxAmount = service.totalCost - subtotal;

  // Get tenant information
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
          font-size: 10px;
          line-height: 1.2;
          color: #333333;
          background: white;
          padding: 15mm;
        }

        .invoice-page {
          width: 100%;
          max-width: 210mm;
          min-height: 277mm;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        /* Header Section - Compact */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          border-bottom: 2px solid #2c5aa0;
          padding-bottom: 8px;
        }

        .company-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .logo-placeholder {
          width: 40px;
          height: 26px;
          border: 1px solid #2c5aa0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: bold;
          color: #2c5aa0;
          background-color: #f8f9fa;
          margin-bottom: 4px;
        }

        .company-name {
          font-size: 16px;
          font-weight: bold;
          color: #2c5aa0;
          margin: 2px 0;
        }

        .company-details {
          font-size: 9px;
          color: #666;
          line-height: 1.3;
        }

        .invoice-section {
          text-align: right;
          flex: 1;
        }

        .invoice-title {
          font-size: 14px;
          font-weight: bold;
          margin: 0 0 8px 0;
          color: #2c5aa0;
          background-color: #f0f4f8;
          padding: 4px 8px;
          border-radius: 3px;
        }

        .invoice-details {
          font-size: 9px;
        }

        .detail-row {
          display: flex;
          justify-content: flex-end;
          margin: 3px 0;
          gap: 10px;
        }

        .label {
          font-weight: bold;
          color: #555;
        }

        .value {
          min-width: 70px;
          color: #333;
        }

        /* Info Section - Very Compact */
        .info-section {
          margin-bottom: 10px;
        }

        .info-columns {
          display: flex;
          gap: 15px;
        }

        .info-column {
          flex: 1;
          border: 1px solid #ddd;
          border-radius: 3px;
          padding: 8px;
          background-color: #fafbfc;
        }

        .info-title {
          font-size: 10px;
          font-weight: bold;
          margin-bottom: 6px;
          color: #2c5aa0;
          border-bottom: 1px solid #eee;
          padding-bottom: 2px;
        }

        .info-content {
          font-size: 9px;
        }

        .info-line {
          display: flex;
          margin: 3px 0;
        }

        .info-label {
          font-weight: bold;
          min-width: 60px;
          color: #555;
        }

        .info-value {
          color: #333;
        }

        /* Table Section - Maximized space usage */
        .table-section {
          flex: 1;
          margin-bottom: 10px;
        }

        .table-title {
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 6px;
          color: #2c5aa0;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #333;
          font-size: 8px;
          margin-bottom: 8px;
        }

        .items-table th,
        .items-table td {
          border: 1px solid #333;
          padding: 4px 3px;
          text-align: left;
        }

        .items-table th {
          background-color: #f5f5f5;
          font-weight: bold;
          font-size: 7px;
          text-align: center;
        }

        .center { text-align: center; }
        .right { text-align: right; }

        /* Summary Box - Compact and positioned */
        .summary-container {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 15px;
        }

        .summary-box {
          width: 200px;
          border: 1px solid #2c5aa0;
          border-radius: 3px;
          padding: 8px;
          background-color: #f8f9fa;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin: 3px 0;
          font-size: 9px;
        }

        .total-row {
          border-top: 1px solid #2c5aa0;
          padding-top: 4px;
          margin-top: 6px;
          font-size: 10px;
          font-weight: bold;
          background-color: #e8f4f8;
          padding: 6px 0 3px 0;
          border-radius: 2px;
        }

        .summary-label {
          font-weight: normal;
        }

        .summary-value {
          font-weight: normal;
          min-width: 60px;
          text-align: right;
        }

        /* Footer - Absolute positioning */
        .footer {
          position: absolute;
          bottom: 15mm;
          left: 15mm;
          right: 15mm;
          border-top: 1px solid #ddd;
          padding-top: 6px;
          font-size: 8px;
          color: #666;
          text-align: center;
        }

        @media print { 
          button { display: none; }
          body { padding: 15mm; }
          .invoice-page {
            max-height: none;
          }
          
          @page {
            size: A4;
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-page">
        <!-- Header Section -->
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
        
        <!-- Customer and Vehicle Info Section -->
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

        <!-- Parts and Services Table -->
        <div class="table-section">
          <h3 class="table-title">DETAYLI DÖKÜM (PARÇA VE İŞÇİLİK TABLOSU)</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 40%; text-align: left;">AÇIKLAMA</th>
                <th style="width: 12%; text-align: center;">MIKTAR</th>
                <th style="width: 18%; text-align: right;">BİRİM FİYAT</th>
                <th style="width: 15%; text-align: center;">KDV ORANI</th>
                <th style="width: 15%; text-align: right;">TOPLAM TUTAR</th>
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
          
          <!-- Summary Box -->
          <div class="summary-container">
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

        <!-- Footer Section - Absolutely positioned -->
        <div class="footer">
          <div>Bizi tercih ettiğiniz için teşekkür ederiz.</div>
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()" style="padding: 6px 12px; margin: 3px; background: #2c5aa0; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 9px;">Yazdır</button>
          <button onclick="window.close()" style="padding: 6px 12px; margin: 3px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 9px;">Kapat</button>
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
