
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
  tenantName: string;
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
    
    // Get service details from database with tenant info
    const { data: serviceData, error } = await supabaseClient
      .from('service_details')
      .select('*, tenant:tenants(name)')
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
    const html = generateOptimizedInvoiceHTML({
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
      tenantName: serviceData.tenant?.name || 'CARFY OTOSERVİS',
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

function generateOptimizedInvoiceHTML(service: ServiceData): string {
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
        ${getCompactInvoiceCSS()}
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
            <h1 class="company-name">${service.tenantName}</h1>
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

        <!-- Parts and Services Table -->
        <div class="table-section">
          <h3 class="table-title">DETAYLI DÖKÜM (PARÇA VE İŞÇİLİK TABLOSU)</h3>
          <div class="table-container">
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
        </div>

        <!-- Footer Section - Absolutely positioned -->
        <div class="footer">
          <div class="footer-content">
            <p>Bizi tercih ettiğiniz için teşekkür ederiz.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

function getCompactInvoiceCSS(): string {
  return `
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
      padding: 0;
    }

    .invoice-page {
      width: 210mm;
      max-width: 210mm;
      height: 297mm;
      max-height: 297mm;
      margin: 0 auto;
      padding: 15mm;
      background: white;
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    /* Header Section - Ultra Compact */
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
      margin-bottom: 4px;
    }

    .logo-box {
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

    /* Info Section - Minimal padding */
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

    /* Table Section - Maximized */
    .table-section {
      flex: 1;
      margin-bottom: 40px;
    }

    .table-title {
      font-size: 11px;
      font-weight: bold;
      margin-bottom: 6px;
      color: #2c5aa0;
    }

    .table-container {
      position: relative;
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

    .desc-col { width: 40%; text-align: left; }
    .qty-col { width: 12%; text-align: center; }
    .price-col { width: 18%; text-align: right; }
    .tax-col { width: 15%; text-align: center; }
    .total-col { width: 15%; text-align: right; }

    .center { text-align: center; }
    .right { text-align: right; }

    /* Summary Section */
    .summary-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
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
    }

    .footer-content {
      text-align: center;
    }

    @media print {
      body {
        padding: 0;
        margin: 0;
      }
      
      .invoice-page {
        width: 100%;
        max-width: none;
        height: 100vh;
        max-height: 100vh;
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
