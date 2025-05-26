
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
      <title>Fatura</title>
      <style>
        ${getInvoiceCSS()}
      </style>
    </head>
    <body>
      <div class="invoice-page">
        <!-- Header with company name on left and invoice details on right -->
        <div class="header">
          <div class="company-section">
            <h1 class="company-name">${service.customerName}</h1>
          </div>
          <div class="invoice-section">
            <h2 class="invoice-title">FATURA</h2>
            <div class="invoice-details">
              <div class="detail-row">
                <span class="label">Fatura No:</span>
                <span class="value">${service.id.substring(0, 8)}</span>
              </div>
              <div class="detail-row">
                <span class="label">Düzenlenme Tarihi:</span>
                <span class="value">${currentDate}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Info Section -->
        <div class="section">
          <h3 class="section-title">ALICI BİLGİLERİ</h3>
          <div class="customer-info">
            <div class="info-line"><strong>${service.customerName}</strong></div>
            <div class="info-line">${service.plateNumber} - ${service.make} ${service.model}</div>
            <div class="info-line">Geliş KM: ${service.mileage.toLocaleString('tr-TR')}</div>
            <div class="info-line">Geliş Tarihi: ${arrivalDate}</div>
          </div>
        </div>

        <!-- Parts and Services Section -->
        <div class="section">
          <h3 class="section-title">PARÇA VE İŞÇİLİK BİLGİLERİ</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th class="desc-col">AÇIKLAMA</th>
                <th class="qty-col">MIKTAR</th>
                <th class="tax-col">KDV</th>
                <th class="price-col">BİRİM FİYATI</th>
                <th class="total-col">TOPLAM</th>
              </tr>
            </thead>
            <tbody>
              ${service.parts.map(part => {
                const partSubtotal = (part.quantity * part.unitPrice) / (1 + taxRate);
                return `
                <tr>
                  <td>${part.name}</td>
                  <td class="center">${part.quantity}</td>
                  <td class="center">%18</td>
                  <td class="right">${partSubtotal.toFixed(2)} TL</td>
                  <td class="right">${(part.quantity * part.unitPrice).toFixed(2)} TL</td>
                </tr>
                `;
              }).join('')}
              ${service.laborCost > 0 ? `
                <tr>
                  <td>İşçilik</td>
                  <td class="center">1</td>
                  <td class="center">%18</td>
                  <td class="right">${(service.laborCost / (1 + taxRate)).toFixed(2)} TL</td>
                  <td class="right">${service.laborCost.toFixed(2)} TL</td>
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
              <span class="summary-label">ARA TOPLAM:</span>
              <span class="summary-value">${subtotal.toFixed(2)} TL</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">VERGİLER:</span>
              <span class="summary-value">${taxAmount.toFixed(2)} TL</span>
            </div>
            <div class="summary-row total-row">
              <span class="summary-label"><strong>TOPLAM FİYAT:</strong></span>
              <span class="summary-value"><strong>${service.totalCost.toFixed(2)} TL</strong></span>
            </div>
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
      font-family: Arial, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #000;
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

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 20px;
    }

    .company-section {
      flex: 1;
    }

    .company-name {
      font-size: 18px;
      font-weight: bold;
      color: #000;
      margin: 0;
    }

    .invoice-section {
      text-align: right;
      flex: 1;
    }

    .invoice-title {
      font-size: 20px;
      font-weight: bold;
      margin: 0 0 15px 0;
      color: #000;
    }

    .invoice-details {
      font-size: 12px;
    }

    .detail-row {
      display: flex;
      justify-content: flex-end;
      margin: 5px 0;
      gap: 10px;
    }

    .label {
      font-weight: bold;
    }

    .value {
      min-width: 100px;
    }

    .section {
      margin-bottom: 25px;
    }

    .section-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #000;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }

    .customer-info {
      font-size: 12px;
    }

    .info-line {
      margin: 8px 0;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 11px;
    }

    .items-table th,
    .items-table td {
      border: 1px solid #000;
      padding: 8px 5px;
      text-align: left;
    }

    .items-table th {
      background-color: #f8f8f8;
      font-weight: bold;
      font-size: 10px;
    }

    .desc-col { width: 40%; }
    .qty-col { width: 12%; text-align: center; }
    .tax-col { width: 12%; text-align: center; }
    .price-col { width: 18%; text-align: right; }
    .total-col { width: 18%; text-align: right; }

    .center { text-align: center; }
    .right { text-align: right; }

    .summary-section {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
    }

    .summary-box {
      width: 250px;
      border: 1px solid #ddd;
      padding: 15px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
      font-size: 12px;
    }

    .total-row {
      border-top: 1px solid #000;
      padding-top: 8px;
      margin-top: 15px;
      font-size: 13px;
    }

    .summary-label {
      font-weight: normal;
    }

    .summary-value {
      font-weight: normal;
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
