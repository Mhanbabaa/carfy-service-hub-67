
import { getPdfStyles } from './pdfStyles';

export const createPdfTemplate = (content: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Servis Formu / Fatura</title>
    <style>
      ${getPdfStyles()}
    </style>
  </head>
  <body>
    <div class="invoice-page">
      ${content}

      <div style="margin-top: 20px; text-align: center;">
        <button onclick="window.print()" style="padding: 6px 12px; margin: 3px; background: #2c5aa0; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 9px;">Yazdır</button>
        <button onclick="window.close()" style="padding: 6px 12px; margin: 3px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 9px;">Kapat</button>
      </div>
    </div>
  </body>
  </html>
`;
