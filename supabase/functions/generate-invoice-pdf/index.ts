
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ServiceData {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  customerName: string;
  totalCost: number;
  laborCost: number;
  partsCost: number;
  arrivalDate: string;
  complaint: string;
  servicePerformed: string;
  technician: string;
  parts: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { serviceId } = await req.json()
    
    // Get service details from database
    const { data: serviceData, error } = await supabaseClient
      .from('service_details')
      .select('*')
      .eq('id', serviceId)
      .single()

    if (error || !serviceData) {
      return new Response(
        JSON.stringify({ error: 'Service not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get service parts
    const { data: partsData } = await supabaseClient
      .from('service_parts')
      .select('*')
      .eq('service_id', serviceId)

    // Generate HTML for PDF
    const html = generateInvoiceHTML({
      id: serviceData.id,
      plateNumber: serviceData.plate_number || 'Bilinmiyor',
      make: serviceData.brand_name || 'Bilinmiyor',
      model: serviceData.model_name || 'Bilinmiyor',
      year: serviceData.year || 0,
      mileage: serviceData.mileage || 0,
      customerName: serviceData.customer_name || 'Bilinmiyor',
      totalCost: Number(serviceData.total_cost) || 0,
      laborCost: Number(serviceData.labor_cost) || 0,
      partsCost: Number(serviceData.parts_cost) || 0,
      arrivalDate: serviceData.arrival_date || new Date().toISOString(),
      complaint: serviceData.complaint || 'Belirtilmemiş',
      servicePerformed: serviceData.work_done || 'Belirtilmemiş',
      technician: serviceData.technician_name || '',
      parts: (partsData || []).map(part => ({
        name: part.part_name,
        quantity: part.quantity,
        unitPrice: Number(part.unit_price)
      }))
    })

    // Return HTML content for browser printing
    return new Response(html, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/html; charset=utf-8' 
      }
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    return new Response(
      JSON.stringify({ error: 'PDF generation failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function generateInvoiceHTML(service: ServiceData): string {
  const currentDate = new Date().toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
  const arrivalDate = new Date(service.arrivalDate).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
  
  // KDV %18 olarak hesaplama
  const taxRate = 0.18;
  const subtotal = service.totalCost / (1 + taxRate);
  const taxAmount = service.totalCost - subtotal;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Servis Formu / Fatura</title>
      <style>
        ${getInvoiceCSS()}
      </style>
    </head>
    <body>
      <div class="invoice-page">
        <!-- Header Section -->
        <div class="header">
          <div class="company-section">
            <div class="logo-placeholder">
              <div class="logo-box">LOGO</div>
            </div>
            <h1 class="company-name">CARFY OTOSERVİS</h1>
            <div class="company-details">
              <div>Carfy Plaza No:123, İstanbul</div>
              <div>Tel: 0212 123 45 67</div>
              <div>E-posta: info@carfy.com</div>
            </div>
          </div>
          <div class="invoice-section">
            <h2 class="invoice-title">SERVİS FORMU / FATURA</h2>
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
              <h3 class="info-title">MÜŞTERİ BİLGİLERİ</h3>
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
              <h3 class="info-title">ARAÇ BİLGİLERİ</h3>
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

        <!-- Service Details Section -->
        <div class="service-details">
          <div class="service-box">
            <h3 class="service-title">MÜŞTERİ ŞİKAYET / TALEPLERİ</h3>
            <div class="service-content">
              ${service.complaint === 'Belirtilmemiş' ? 
                'Müşteri tarafından özel bir talep belirtilmemiştir.' : 
                service.complaint}
            </div>
          </div>
          <div class="service-box">
            <h3 class="service-title">YAPILAN İŞLEMLER VE TEKNİSYEN NOTLARI</h3>
            <div class="service-content">
              ${service.servicePerformed === 'Belirtilmemiş' ? 
                'Yapılan işlemler servis dökümünde listelenmiştir.' : 
                service.servicePerformed}
            </div>
            ${service.technician ? `
              <div class="technician-info">
                <strong>Teknisyen:</strong> ${service.technician}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Parts and Services Table -->
        <div class="table-section">
          <h3 class="table-title">DETAYLI DÖKÜM (PARÇA VE İŞÇİLİK TABLOSU)</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th class="desc-col">AÇIKLAMA</th>
                <th class="qty-col">MIKTAR</th>
                <th class="price-col">BİRİM FİYAT</th>
                <th class="tax-col">KDV ORANI</th>
                <th class="total-col">TOPLAM TUTAR</th>
              </tr>
            </thead>
            <tbody>
              ${service.parts.map(part => {
                return `
                <tr>
                  <td>${part.name}</td>
                  <td class="center">${part.quantity}</td>
                  <td class="right">₺${part.unitPrice.toFixed(2)}</td>
                  <td class="center">%18</td>
                  <td class="right">₺${(part.quantity * part.unitPrice).toFixed(2)}</td>
                </tr>
                `;
              }).join('')}
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
        </div>

        <!-- Summary Section -->
        <div class="summary-section">
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

        <!-- Footer Section -->
        <div class="footer">
          <div class="footer-left">
            <p>Bizi tercih ettiğiniz için teşekkür ederiz.</p>
          </div>
          <div class="footer-center">
            <p>Ödeme Bilgileri: IBAN: TR00 0000 0000 0000 0000 0000 00</p>
          </div>
          <div class="footer-right">
            <p>Vergi No: 123456789 - Vergi Dairesi: İstanbul</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

function getInvoiceCSS(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #333;
      background: white;
      padding: 0;
    }

    .invoice-page {
      width: 210mm;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20mm;
      background: white;
      box-sizing: border-box;
    }

    /* Header Section */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      border-bottom: 2px solid #ddd;
      padding-bottom: 20px;
    }

    .company-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .logo-placeholder {
      margin-bottom: 10px;
    }

    .logo-box {
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
    }

    .company-name {
      font-size: 20px;
      font-weight: bold;
      color: #2c3e50;
      margin: 5px 0;
    }

    .company-details {
      font-size: 11px;
      color: #666;
      line-height: 1.6;
    }

    .invoice-section {
      text-align: right;
      flex: 1;
    }

    .invoice-title {
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 15px 0;
      color: #2c3e50;
      background-color: #f8f9fa;
      padding: 8px 12px;
      border-radius: 4px;
    }

    .invoice-details {
      font-size: 11px;
    }

    .detail-row {
      display: flex;
      justify-content: flex-end;
      margin: 6px 0;
      gap: 15px;
    }

    .label {
      font-weight: bold;
      color: #555;
    }

    .value {
      min-width: 100px;
      color: #333;
    }

    /* Info Section */
    .info-section {
      margin-bottom: 25px;
    }

    .info-columns {
      display: flex;
      gap: 30px;
    }

    .info-column {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 15px;
      background-color: #fdfdfd;
    }

    .info-title {
      font-size: 13px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #2c3e50;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
    }

    .info-content {
      font-size: 11px;
    }

    .info-line {
      display: flex;
      margin: 8px 0;
    }

    .info-label {
      font-weight: bold;
      min-width: 80px;
      color: #555;
    }

    .info-value {
      color: #333;
    }

    /* Service Details */
    .service-details {
      margin-bottom: 25px;
    }

    .service-box {
      margin-bottom: 15px;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 15px;
      background-color: #fdfdfd;
    }

    .service-title {
      font-size: 13px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #2c3e50;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
    }

    .service-content {
      font-size: 11px;
      line-height: 1.6;
      color: #333;
    }

    .technician-info {
      margin-top: 10px;
      font-size: 11px;
      color: #666;
    }

    /* Table Section */
    .table-section {
      margin-bottom: 25px;
    }

    .table-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #2c3e50;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000;
      font-size: 10px;
    }

    .items-table th,
    .items-table td {
      border: 1px solid #000;
      padding: 10px 8px;
      text-align: left;
    }

    .items-table th {
      background-color: #f5f5f5;
      font-weight: bold;
      font-size: 9px;
      text-align: center;
    }

    .desc-col { width: 35%; text-align: left; }
    .qty-col { width: 12%; text-align: center; }
    .price-col { width: 18%; text-align: right; }
    .tax-col { width: 15%; text-align: center; }
    .total-col { width: 20%; text-align: right; }

    .center { text-align: center; }
    .right { text-align: right; }

    /* Summary Section */
    .summary-section {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }

    .summary-box {
      width: 280px;
      border: 1px solid #333;
      border-radius: 6px;
      padding: 15px;
      background-color: #f9f9f9;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
      font-size: 12px;
    }

    .total-row {
      border-top: 2px solid #333;
      padding-top: 8px;
      margin-top: 15px;
      font-size: 14px;
      background-color: #e8f4f8;
      padding: 10px 0;
      border-radius: 4px;
    }

    .summary-label {
      font-weight: normal;
    }

    .summary-value {
      font-weight: normal;
      min-width: 80px;
      text-align: right;
    }

    /* Footer Section */
    .footer {
      margin-top: 40px;
      border-top: 1px solid #ddd;
      padding-top: 15px;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #666;
    }

    .footer-left,
    .footer-center,
    .footer-right {
      flex: 1;
      text-align: center;
    }

    .footer-left {
      text-align: left;
    }

    .footer-right {
      text-align: right;
    }

    @media print {
      body {
        padding: 0;
        margin: 0;
      }
      
      .invoice-page {
        width: 100%;
        max-width: none;
        margin: 0;
        padding: 15mm;
        box-shadow: none;
      }
      
      @page {
        size: A4;
        margin: 0;
      }
    }
  `
}
