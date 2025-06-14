
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types/service';
import { getTenantName } from './pdf/tenantUtils';
import { generateInvoiceContent } from './pdf/pdfContent';
import { createPdfTemplate } from './pdf/pdfTemplate';

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
      await openPrintModal(service);
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
    await openPrintModal(service);
  }
};

const openPrintModal = async (service: Service) => {
  const currentDate = new Date().toLocaleDateString('tr-TR');
  const arrivalDate = service.arrivalDate ? new Date(service.arrivalDate).toLocaleDateString('tr-TR') : '-';
  const taxRate = 0.18;
  const subtotal = service.totalCost / (1 + taxRate);
  const taxAmount = service.totalCost - subtotal;

  // Get tenant information
  const tenantName = await getTenantName();

  // Generate content
  const content = generateInvoiceContent(
    service,
    tenantName,
    currentDate,
    arrivalDate,
    taxRate,
    subtotal,
    taxAmount
  );

  // Create complete HTML template
  const printContent = createPdfTemplate(content);

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
  }
};
