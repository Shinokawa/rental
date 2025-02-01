export const printReceipt = async (payment) => {
  try {
    // 请求后端生成的PDF
    const response = await fetch(
      `http://localhost:8000/api/payments/${payment.id}/print_receipt/`,
      {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('获取收据失败');
    }

    // 处理文件下载
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${payment.id}.pdf`;  // 简化文件名处理
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('下载收据失败:', error);
    throw error;
  }
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
