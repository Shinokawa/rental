import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import { printReceipt, exportToExcel } from '../utils/PrintUtils';

const PaymentManagementPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    tenant: ''
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/payments/', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      },
    })
      .then(response => response.json())
      .then(data => {
        setPayments(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('获取支付记录失败：', error);
        setLoading(false);
      });
  }, []);
  
  const handleFileUpload = async (paymentId, fileUrl, type) => {
    try {
      await fetch(`http://localhost:8000/api/payments/${paymentId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        body: JSON.stringify({
          [type === 'receipt' ? 'receipt_file' : 'bank_slip']: fileUrl
        })
      });
      // 更新支付列表
      setPayments(payments.map(p => 
        p.id === paymentId 
          ? {...p, [type === 'receipt' ? 'receipt_file' : 'bank_slip']: fileUrl}
          : p
      ));
    } catch (error) {
      console.error('更新文件失败:', error);
    }
  };

  const handlePrintReceipt = async (payment) => {
    try {
      await printReceipt(payment);
    } catch (error) {
      alert('下载收据失败，请重试');
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filters.startDate && new Date(payment.payment_date) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(payment.payment_date) > new Date(filters.endDate)) {
      return false;
    }
    if (filters.status && payment.status !== filters.status) {
      return false;
    }
    if (filters.tenant && !payment.fee.contract.tenant.email.includes(filters.tenant)) {
      return false;
    }
    return true;
  });

  // 添加格式化支付方式的函数
  const formatPaymentMethod = (method) => {
    const methods = {
      'POS': 'POS',
      'wechat': '微信',
      'alipay': '支付宝',
      'bank_transfer': '银行转账',
      'other': '其他'
    };
    return methods[method] || method;
  };

  if (loading) return <div>加载中...</div>;
  
  return (
    <div>
      <h2>收银管理</h2>
      
      {/* 筛选器 */}
      <div className="filters">
        <input
          type="date"
          value={filters.startDate}
          onChange={e => setFilters({...filters, startDate: e.target.value})}
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={e => setFilters({...filters, endDate: e.target.value})}
        />
        <input
          type="text"
          placeholder="租户邮箱搜索..."
          value={filters.tenant}
          onChange={e => setFilters({...filters, tenant: e.target.value})}
        />
        <button onClick={() => exportToExcel(filteredPayments, '支付记录')}>
          导出Excel
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>支付ID</th>
            <th>费用信息</th>
            <th>支付日期</th>
            <th>金额</th>
            <th>支付方式</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>
                {payment.fee ? (
                  <div>
                    <div>合同ID: {payment.fee.contract?.id}</div>
                    <div>费用类型: {payment.fee.category}</div>
                    <div>所属期限: {payment.fee.term}</div>
                  </div>
                ) : '未关联费用'}
              </td>
              <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
              <td>¥{payment.amount}</td>
              <td>{formatPaymentMethod(payment.payment_method)}</td>
              <td>
                <div className="action-buttons">
                  {!payment.receipt && (
                    <FileUpload 
                      onUpload={(url) => handleFileUpload(payment.id, url, 'receipt')}
                      label="上传收据"
                      acceptTypes=".pdf,.jpg,.png"
                    />
                  )}
                  {!payment.bank_slip && (
                    <FileUpload 
                      onUpload={(url) => handleFileUpload(payment.id, url, 'bankSlip')}
                      label="上传银行回单"
                      acceptTypes=".pdf,.jpg,.png"
                    />
                  )}
                  <button onClick={() => handlePrintReceipt(payment)}>
                    下载收据
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentManagementPage;