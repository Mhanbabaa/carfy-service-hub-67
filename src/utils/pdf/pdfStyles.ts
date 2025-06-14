
export const getPdfStyles = () => `
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
`;
