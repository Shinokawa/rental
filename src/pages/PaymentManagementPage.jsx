import React, { useEffect, useState } from 'react';

const PaymentManagementPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
  
  if (loading) return <div>加载中...</div>;
  
  return (
    <div>
      <h2>收银管理</h2>
      <table>
        <thead>
          <tr>
            <th>支付ID</th>
            <th>费用ID</th>
            <th>支付日期</th>
            <th>金额</th>
            <th>支付方式</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.fee}</td>
              <td>{payment.payment_date}</td>
              <td>{payment.amount}</td>
              <td>{payment.payment_method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentManagementPage;