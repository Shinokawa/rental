import React, { useState, useEffect } from 'react';
import { printReceipt } from '../utils/PrintUtils';

const CashierPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [unpaidFees, setUnpaidFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    amount: '',
    payment_method: 'cash',
    remarks: ''
  });

  // 添加支付方式常量
  const PAYMENT_METHODS = {
    POS: 'POS',
    wechat: '微信',
    alipay: '支付宝',
    bank_transfer: '银行转账',
    other: '其他'
  };

  // 添加初始数据加载
  useEffect(() => {
    fetchUnpaidFees();
  }, []);

  // 获取未付费用的函数
  const fetchUnpaidFees = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/fees/?is_collected=false', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
      });
      const data = await response.json();
      setUnpaidFees(data);
    } catch (error) {
      console.error('获取未付费用失败:', error);
    }
  };

  // 修改搜索处理函数
  const handleSearch = async () => {
    try {
      let url = 'http://localhost:8000/api/fees/?is_collected=false';
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      const response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
      });
      const data = await response.json();
      setUnpaidFees(data);
    } catch (error) {
      console.error('搜索失败:', error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedFee) return;
    
    try {
      // 1. 先尝试创建支付记录
      const response = await fetch('http://localhost:8000/api/payments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        body: JSON.stringify({
          fee_id: selectedFee.id,
          amount: Number(paymentInfo.amount),     
          payment_method: paymentInfo.payment_method,
          payment_date: new Date().toISOString().split('T')[0]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '收款失败');
      }

      const data = await response.json();

      // 2. 更新费用状态
      await fetch(`http://localhost:8000/api/fees/${selectedFee.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        body: JSON.stringify({
          is_collected: true,
          payment_method: paymentInfo.payment_method
        })
      });

      // 3. 尝试打印收据（如果失败不影响主流程）
      try {
        await printReceipt(data);
      } catch (printError) {
        console.error('打印收据失败:', printError);
        alert('收款成功，但打印收据失败，请从收银管理页面重新打印');
      }

      setSelectedFee(null);
      setPaymentInfo({
        amount: '',
        payment_method: '',
        remarks: ''
      });
      fetchUnpaidFees();
      alert('收款成功！');

    } catch (error) {
      console.error('收款失败:', error);
      alert(error.message || '收款失败，请重试');
    }
  };

  // 添加根据类型格式化显示的函数
  const formatFeeCategory = (category) => {
    const categories = {
      'deposit': '保证金',
      'rent': '租金',
      'management_fee': '物业管理费'
    };
    return categories[category] || category;
  };

  return (
    <div className="cashier-page">
      <h2>收银台</h2>
      
      <div className="search-section">
        <input
          type="text"
          placeholder="输入房号/租户名/合同号..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>搜索</button>
        <button onClick={fetchUnpaidFees}>显示全部未付费用</button>
      </div>

      <div className="unpaid-fees">
        {unpaidFees.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>费用ID</th>
                <th>合同ID</th>
                <th>租户</th>
                <th>房号</th>
                <th>费用类型</th>
                <th>金额</th>
                <th>所属期限</th>
                <th>逾期状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {unpaidFees.map(fee => (
                <tr key={fee.id}>
                  <td>{fee.id}</td>
                  <td>{fee.contract.id}</td>
                  <td>{fee.contract.tenant.first_name} {fee.contract.tenant.last_name}</td>
                  <td>{fee.contract.properties.map(p => p.house_number).join(', ')}</td>
                  <td>{formatFeeCategory(fee.category)}</td>
                  <td>¥{fee.amount}</td>
                  <td>{fee.term}</td>
                  <td>{fee.overdue_status === 'on_time' ? '正常' : '逾期'}</td>
                  <td>
                    <button 
                      onClick={() => setSelectedFee(fee)}
                      className="collect-button"
                    >
                      收款
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">没有找到未付费用</p>
        )}
      </div>

      {selectedFee && (
        <div className="payment-form">
          <h3>收款信息</h3>
          <form onSubmit={handlePayment}>
            <div>
              <label>收款金额:</label>
              <input
                type="number"
                value={paymentInfo.amount}
                onChange={e => setPaymentInfo({...paymentInfo, amount: e.target.value})}
                required
              />
            </div>
            <div>
              <label>支付方式:</label>
              <select
                value={paymentInfo.payment_method}
                onChange={e => setPaymentInfo({...paymentInfo, payment_method: e.target.value})}
              >
                <option value="">请选择支付方式</option>
                {Object.entries(PAYMENT_METHODS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>备注:</label>
              <textarea
                value={paymentInfo.remarks}
                onChange={e => setPaymentInfo({...paymentInfo, remarks: e.target.value})}
              />
            </div>
            <div className="button-group">
              <button type="submit">确认收款</button>
              <button type="button" onClick={() => setSelectedFee(null)}>取消</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CashierPage;
