
export const getPdfStyles = () => `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 10px;
    line-height: 1.4;
    color: #333333;
    background: white;
    padding: 20mm;
  }

  .invoice-page {
    width: 100%;
    max-width: 210mm;
    min-height: 257mm;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* Header Section - Fixed at top */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0;
    border-bottom: 2px solid #2c5aa0;
    padding-bottom: 12px;
    flex-shrink: 0;
  }

  .company-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .logo-placeholder {
    width: 45px;
    height: 30px;
    border: 1px solid #2c5aa0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    font-weight: bold;
    color: #2c5aa0;
    background-color: #f8f9fa;
    margin-bottom: 8px;
  }

  .company-name {
    font-size: 18px;
    font-weight: bold;
    color: #2c5aa0;
    margin: 4px 0 8px 0;
  }

  .company-details {
    font-size: 10px;
    color: #666;
    line-height: 1.4;
  }

  .invoice-section {
    text-align: right;
    flex: 1;
  }

  .invoice-title {
    font-size: 16px;
    font-weight: bold;
    margin: 0 0 12px 0;
    color: #2c5aa0;
    background-color: #f0f4f8;
    padding: 8px 12px;
    border-radius: 4px;
  }

  .invoice-details {
    font-size: 10px;
  }

  .detail-row {
    display: flex;
    justify-content: flex-end;
    margin: 4px 0;
    gap: 12px;
  }

  .label {
    font-weight: bold;
    color: #555;
  }

  .value {
    min-width: 80px;
    color: #333;
  }

  /* Main Content Area - Flexible distribution */
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 25px;
    margin-bottom: 25px;
  }

  /* Info Section */
  .info-section {
    margin-bottom: 0;
  }

  .info-columns {
    display: flex;
    gap: 20px;
  }

  .info-column {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 12px;
    background-color: #fafbfc;
  }

  .info-title {
    font-size: 11px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #2c5aa0;
    border-bottom: 1px solid #eee;
    padding-bottom: 3px;
  }

  .info-content {
    font-size: 10px;
  }

  .info-line {
    display: flex;
    margin: 4px 0;
  }

  .info-label {
    font-weight: bold;
    min-width: 70px;
    color: #555;
  }

  .info-value {
    color: #333;
  }

  /* Table Section */
  .table-section {
    margin-bottom: 0;
  }

  .table-title {
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #2c5aa0;
  }

  .items-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #333;
    font-size: 9px;
    margin-bottom: 15px;
  }

  .items-table th,
  .items-table td {
    border: 1px solid #333;
    padding: 6px 4px;
    text-align: left;
  }

  .items-table th {
    background-color: #f5f5f5;
    font-weight: bold;
    font-size: 8px;
    text-align: center;
  }

  .center { text-align: center; }
  .right { text-align: right; }

  /* Summary Section */
  .summary-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0;
  }

  .summary-box {
    width: 220px;
    border: 1px solid #2c5aa0;
    border-radius: 4px;
    padding: 12px;
    background-color: #f8f9fa;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin: 4px 0;
    font-size: 10px;
  }

  .total-row {
    border-top: 2px solid #2c5aa0;
    padding-top: 6px;
    margin-top: 8px;
    font-size: 11px;
    font-weight: bold;
    background-color: #e8f4f8;
    padding: 8px 0 4px 0;
    border-radius: 3px;
  }

  .summary-label {
    font-weight: normal;
  }

  .summary-value {
    font-weight: normal;
    min-width: 70px;
    text-align: right;
  }

  /* Thank You Note - Part of flexible content */
  .thank-you-note {
    text-align: center;
    font-size: 11px;
    color: #666;
    margin-bottom: 0;
    padding: 10px 0;
  }

  /* Footer - Absolute positioning */
  .footer {
    position: absolute;
    bottom: 20mm;
    left: 20mm;
    right: 20mm;
    border-top: 1px solid #ddd;
    padding-top: 8px;
    font-size: 9px;
    color: #888;
    text-align: center;
    flex-shrink: 0;
  }

  @media print { 
    button { display: none; }
    body { padding: 20mm; }
    .invoice-page {
      max-height: none;
    }
    
    @page {
      size: A4;
      margin: 0;
    }
  }
`;
