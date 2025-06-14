
import { Service } from '@/types/service';

export const generateInvoiceContent = (
  service: Service,
  tenantName: string,
  currentDate: string,
  arrivalDate: string,
  taxRate: number,
  subtotal: number,
  taxAmount: number
) => {
  const partsRows = service.parts.map(part => `
    <tr>
      <td>${part.name}</td>
      <td class="center">${part.quantity}</td>
      <td class="right">₺${part.unitPrice.toFixed(2)}</td>
      <td class="center">%18</td>
      <td class="right">₺${(part.quantity * part.unitPrice).toFixed(2)}</td>
    </tr>
  `).join('');

  const laborRow = service.laborCost > 0 ? `
    <tr>
      <td>İşçilik</td>
      <td class="center">1</td>
      <td class="right">₺${service.laborCost.toFixed(2)}</td>
      <td class="center">%18</td>
      <td class="right">₺${service.laborCost.toFixed(2)}</td>
    </tr>
  ` : '';

  const emptyRow = service.parts.length === 0 && service.laborCost === 0 ? `
    <tr>
      <td colspan="5" class="center">Parça veya işçilik bulunmamaktadır</td>
    </tr>
  ` : '';

  return `
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
          ${partsRows}
          ${laborRow}
          ${emptyRow}
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
  `;
};
