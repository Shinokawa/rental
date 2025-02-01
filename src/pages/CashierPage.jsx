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

  // 修改获取未付费用的函数
  const fetchUnpaidFees = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/fees/?is_collected=false', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
      });
      const data = await response.json();
      // 添加前端过滤，确保只显示未收取的费用
      const trulyUnpaidFees = data.filter(fee => !fee.is_collected);
      setUnpaidFees(trulyUnpaidFees);
    } catch (error) {
      console.error('获取未付费用失败:', error);
    }
  };

  // 修改搜索处理函数
  const handleSearch = async () => {
    try {
      let url = 'http://localhost:8000/api/fees/?is_collected=false';  // 确保只获取未收取的费用
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      const response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
      });
      const data = await response.json();
      // 搜索结果也需要过滤
      const filteredFees = data.filter(fee => !fee.is_collected);
      setUnpaidFees(filteredFees);
    } catch (error) {
      console.error('搜索失败:', error);
    }
  };

  // 添加数据检查的辅助函数
  const isValidFeeForPayment = (fee) => {
    return fee && 
           !fee.is_collected && 
           fee.overdue_status === 'on_time' &&
           Number(fee.amount) > 0;
  };

  // 修改处理点击收款按钮的逻辑
  const handleSelectFee = (fee) => {
    if (!isValidFeeForPayment(fee)) {
      alert('该费用不可收取（已收取、金额为0或已逾期）');
      return;
    }
    setSelectedFee(fee);
    setPaymentInfo({
      ...paymentInfo,
      amount: fee.amount
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedFee) return;

    try {
      // 1. 再次检查该费用是否已收取
      const checkResponse = await fetch(`http://localhost:8000/api/fees/${selectedFee.id}/`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
      });
      const feeData = await checkResponse.json();
      
      if (feeData.is_collected) {
        alert('该费用已收取，请勿重复支付！');
        await fetchUnpaidFees(); // 刷新列表
        setSelectedFee(null);
        return;
      }

      // 2. 创建支付记录
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

      // 3. 下载收据
      try {
        await printReceipt(data);
        alert('收款成功！收据已开始下载');
      } catch (printError) {
        console.error('下载收据失败:', printError);
        alert('收款成功，但下载收据失败，请从收银管理页面重新下载');
      }

      // 4. 重置表单和刷新数据
      setSelectedFee(null);
      setPaymentInfo({
        amount: '',
        payment_method: '',
        remarks: ''
      });

      // 5. 立即从列表中移除已支付的费用
      setUnpaidFees(prevFees => prevFees.filter(fee => fee.id !== selectedFee.id));
      setSortedFees(prevFees => prevFees.filter(fee => fee.id !== selectedFee.id));

      // 6. 可选：完全刷新数据
      await fetchUnpaidFees();

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

  // 添加按金额排序函数
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortedFees, setSortedFees] = useState([]);

  useEffect(() => {
    const sorted = [...unpaidFees].sort((a, b) => {
      return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    });
    setSortedFees(sorted);
  }, [unpaidFees, sortOrder]);

  // 修改处理收款表单的默认值
  useEffect(() => {
    if (selectedFee) {
      setPaymentInfo({
        ...paymentInfo,
        amount: selectedFee.amount // 自动填充费用金额
      });
    }
  }, [selectedFee]);

  return (
    <div className="cashier-page">
      <h2>收银台</h2>
      
      <div className="search-section">
        <input
          type="text"
          placeholder="输入房号/租户名..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>搜索</button>
        <button onClick={fetchUnpaidFees}>显示全部未付费用</button>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">金额从高到低</option>
          <option value="asc">金额从低到高</option>
        </select>
      </div>

      <div className="unpaid-fees">
        {sortedFees.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>租户</th>
                <th>房号</th>
                <th>费用类型</th>
                <th>金额</th>
                <th>所属期限</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {sortedFees.map(fee => (
                <tr key={fee.id} className={fee.overdue_status === 'overdue' ? 'overdue' : ''}>
                  <td>{fee.contract.tenant.first_name} {fee.contract.tenant.last_name}</td>
                  <td>{fee.contract.properties.map(p => p.house_number).join(', ')}</td>
                  <td>{formatFeeCategory(fee.category)}</td>
                  <td>¥{fee.amount}</td>
                  <td>{fee.term}</td>
                  <td>
                    <button 
                      onClick={() => handleSelectFee(fee)}
                      className="collect-button"
                      disabled={!isValidFeeForPayment(fee)}
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
          <h3>收款信息 - {formatFeeCategory(selectedFee.category)}</h3>
          <div className="fee-info">
            <p>租户：{selectedFee.contract.tenant.first_name} {selectedFee.contract.tenant.last_name}</p>
            <p>房号：{selectedFee.contract.properties.map(p => p.house_number).join(', ')}</p>
            <p>所属期限：{selectedFee.term}</p>
          </div>
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
                required
              >
                <option value="">请选择支付方式</option>
                {Object.entries(PAYMENT_METHODS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
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
