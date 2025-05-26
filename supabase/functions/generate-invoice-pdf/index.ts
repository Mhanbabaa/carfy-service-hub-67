
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

    // Convert HTML to PDF using Puppeteer
    const response = await fetch('https://api.htmlcsstoimage.com/v1/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(Deno.env.get('HTMLCSS_API_KEY') + ':')
      },
      body: JSON.stringify({
        html: html,
        css: getInvoiceCSS(),
        format: 'pdf',
        width: 794,
        height: 1123
      })
    })

    if (!response.ok) {
      // Fallback: return HTML content for browser printing
      return new Response(html, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/html; charset=utf-8' 
        }
      })
    }

    const pdfBuffer = await response.arrayBuffer()

    return new Response(pdfBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="fatura_${serviceData.plate_number?.replace(/\s+/g, '') || 'servis'}.pdf"`
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
  const currentDate = new Date().toLocaleDateString('tr-TR')
  const arrivalDate = new Date(service.arrivalDate).toLocaleDateString('tr-TR')
  const taxAmount = service.totalCost * 0.18
  const totalWithTax = service.totalCost * 1.18

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Servis Faturası</title>
    </head>
    <body>
      <div class="invoice">
        <!-- Header -->
        <div class="header">
          <div class="company-info">
            <h1>CARFY OTOSERVIS</h1>
            <div class="company-details">
              <p>Carfy Plaza No:123, Istanbul</p>
              <p>0212 123 45 67</p>
              <p>info@carfy.com</p>
            </div>
          </div>
          <div class="invoice-info">
            <h2>FATURA</h2>
            <p><strong>Fatura No:</strong> ${service.id.substring(0, 8)}</p>
            <p><strong>Düzenlenme Tarihi:</strong> ${currentDate}</p>
          </div>
        </div>

        <div class="separator"></div>

        <!-- Customer Info -->
        <div class="section">
          <h3>ALICI BİLGİLERİ</h3>
          <p><strong>${service.customerName}</strong></p>
          <p>${service.plateNumber} - ${service.make} ${service.model}</p>
          <p>Geliş KM: ${service.mileage.toLocaleString('tr-TR')}</p>
          <p>Geliş Tarihi: ${arrivalDate}</p>
        </div>

        <!-- Parts and Labor -->
        <div class="section">
          <h3>PARÇA VE İŞÇİLİK BİLGİLERİ</h3>
          <table class="items-table">
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
              ${service.parts.length === 0 && service.laborCost === 0 ? `
                <tr>
                  <td colspan="5" style="text-align: center;">Parça veya işçilik bulunmamaktadır</td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </div>

        <!-- Summary -->
        <div class="summary">
          <div class="summary-row">
            <span>ARA TOPLAM :</span>
            <span>${service.totalCost.toFixed(2)} TL</span>
          </div>
          <div class="summary-row">
            <span>VERGİLER :</span>
            <span>${taxAmount.toFixed(2)} TL</span>
          </div>
          <div class="summary-separator"></div>
          <div class="summary-row total">
            <span><strong>TOPLAM FİYAT :</strong></span>
            <span><strong>${totalWithTax.toFixed(2)} TL</strong></span>
          </div>
        </div>

        <!-- Payment Info -->
        <div class="section">
          <h3>ÖDEME BİLGİSİ</h3>
          <p>Hesap Adı: CARFY OTOSERVIS</p>
          <p>Hesap No: 123 456 7890</p>
          <p>Ödeme Vadesi: Araç tesliminde</p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>Bu belge bilgi amaçlıdır ve yasal fatura yerine geçmez.</p>
          <p>CARFY Oto Servis Yönetim Sistemi ile oluşturulmuştur.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function getInvoiceCSS(): string {
  return `
    body {
      margin: 0;
      padding: 20px;
      font-family: Arial, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #333;
    }

    .invoice {
      max-width: 800px;
      margin: 0 auto;
      background: white;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .company-info h1 {
      margin: 0 0 10px 0;
      font-size: 20px;
      font-weight: bold;
    }

    .company-details p {
      margin: 2px 0;
    }

    .invoice-info {
      text-align: right;
    }

    .invoice-info h2 {
      margin: 0 0 10px 0;
      font-size: 16px;
      font-weight: bold;
    }

    .invoice-info p {
      margin: 2px 0;
    }

    .separator {
      height: 1px;
      background-color: #ccc;
      margin: 20px 0;
    }

    .section {
      margin-bottom: 25px;
    }

    .section h3 {
      margin: 0 0 15px 0;
      font-size: 12px;
      font-weight: bold;
    }

    .section p {
      margin: 3px 0;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    .items-table th,
    .items-table td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: left;
    }

    .items-table th {
      background-color: #505050;
      color: white;
      font-weight: bold;
      font-size: 9px;
    }

    .items-table td {
      font-size: 9px;
    }

    .items-table th:nth-child(2),
    .items-table td:nth-child(2),
    .items-table th:nth-child(3),
    .items-table td:nth-child(3) {
      text-align: center;
      width: 80px;
    }

    .items-table th:nth-child(4),
    .items-table td:nth-child(4),
    .items-table th:nth-child(5),
    .items-table td:nth-child(5) {
      text-align: right;
      width: 100px;
    }

    .summary {
      margin: 20px 0;
      text-align: right;
    }

    .summary-row {
      display: flex;
      justify-content: flex-end;
      margin: 5px 0;
      width: 300px;
      margin-left: auto;
    }

    .summary-row span:first-child {
      flex: 1;
      text-align: left;
    }

    .summary-row span:last-child {
      width: 100px;
      text-align: right;
    }

    .summary-separator {
      height: 1px;
      background-color: #333;
      margin: 8px 0;
      width: 300px;
      margin-left: auto;
    }

    .summary-row.total {
      font-weight: bold;
      margin-top: 10px;
    }

    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 8px;
      font-style: italic;
      color: #666;
    }

    .footer p {
      margin: 2px 0;
    }

    @media print {
      body {
        padding: 0;
      }
      
      .invoice {
        max-width: none;
      }
    }
  `
}
