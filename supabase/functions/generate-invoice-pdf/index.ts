
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

    // Fallback: return HTML content for browser printing
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
    month: 'long',
    year: 'numeric'
  })
  const arrivalDate = new Date(service.arrivalDate).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
  
  // KDV %20 olarak hesaplama
  const taxRate = 0.20;
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
      <div class="invoice">
        <!-- Header -->
        <div class="header">
          <div class="company-info">
            <h1>${service.customerName}</h1>
          </div>
          <div class="invoice-info">
            <h2>FATURA</h2>
            <p><strong>Fatura No:</strong> ${service.id.substring(0, 3).padStart(3, '0')}</p>
            <p><strong>Düzenlenme Tarihi:</strong> ${currentDate}</p>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="customer-section">
          <h3>ALICI BİLGİLERİ</h3>
          <p><strong>${service.customerName}</strong></p>
          <p>${service.plateNumber} - ${service.make} ${service.model}</p>
          <p>Geliş KM: ${service.mileage.toLocaleString('tr-TR')}</p>
          <p>Geliş Tarihi: ${arrivalDate}</p>
        </div>

        <!-- Parts Table -->
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
            ${service.parts.map(part => {
              const partSubtotal = (part.quantity * part.unitPrice) / (1 + taxRate);
              return `
              <tr>
                <td>${part.name}</td>
                <td>${part.quantity}</td>
                <td>%20</td>
                <td>${partSubtotal.toFixed(2)} TL</td>
                <td>${(part.quantity * part.unitPrice).toFixed(2)} TL</td>
              </tr>
              `;
            }).join('')}
            ${service.laborCost > 0 ? `
              <tr>
                <td>Yağ</td>
                <td>1</td>
                <td>%20</td>
                <td>${(service.laborCost / (1 + taxRate)).toFixed(2)} TL</td>
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

        <!-- Summary -->
        <div class="summary">
          <div class="summary-row">
            <span>ARA TOPLAM :</span>
            <span>${subtotal.toFixed(2)} TL</span>
          </div>
          <div class="summary-row">
            <span>VERGİLER :</span>
            <span>${taxAmount.toFixed(2)} TL</span>
          </div>
          <div class="summary-row total">
            <span><strong>TOPLAM FİYAT :</strong></span>
            <span><strong>${service.totalCost.toFixed(2)} TL</strong></span>
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
      padding: 20px;
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
      margin-bottom: 40px;
    }

    .company-info h1 {
      font-size: 24px;
      font-weight: bold;
      color: #000;
      margin: 0;
    }

    .invoice-info {
      text-align: right;
    }

    .invoice-info h2 {
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 10px 0;
    }

    .invoice-info p {
      margin: 5px 0;
      font-size: 12px;
    }

    .customer-section {
      margin-bottom: 30px;
    }

    .customer-section h3 {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .customer-section p {
      margin: 5px 0;
      font-size: 12px;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }

    .items-table th,
    .items-table td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
      font-size: 11px;
    }

    .items-table th {
      background-color: #f0f0f0;
      font-weight: bold;
      text-align: center;
    }

    .items-table td:nth-child(2),
    .items-table td:nth-child(3) {
      text-align: center;
    }

    .items-table td:nth-child(4),
    .items-table td:nth-child(5) {
      text-align: right;
    }

    .summary {
      float: right;
      width: 300px;
      margin-top: 20px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
      font-size: 12px;
    }

    .summary-row.total {
      font-weight: bold;
      border-top: 1px solid #000;
      padding-top: 8px;
      margin-top: 15px;
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
