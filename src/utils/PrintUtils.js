export const printReceipt = (payment) => {
  const receiptContent = `
    收据编号: ${payment.id}
    日期: ${new Date().toLocaleDateString()}
    租户: ${payment.fee.contract.tenant.first_name} ${payment.fee.contract.tenant.last_name}
    房号: ${payment.fee.contract.properties.map(p => p.house_number).join(', ')}
    费用类型: ${payment.fee.category}
    金额: ¥${payment.amount}
    支付方式: ${payment.payment_method}
    经办人: ${localStorage.getItem('username')}
  `;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head><title>收据</title></head>
      <body>
        <pre>${receiptContent}</pre>
        <script>
          window.onload = () => {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `);
};

export const exportToExcel = (data, filename) => {
  const csvContent = "data:text/csv;charset=utf-8," 
    + data.map(row => Object.values(row).join(",")).join("\n");
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
