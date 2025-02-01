import React, { useEffect, useState } from 'react';

const FeesPage = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('http://localhost:8000/api/fees/', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      },
    })
      .then(response => response.json())
      .then(data => {
        setFees(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('获取费用数据失败：', error);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>加载中...</div>;
  
  return (
    <div>
      <h2>费用管理</h2>
      <table>
        <thead>
          <tr>
            <th>合同ID</th>
            <th>费用类别</th>
            <th>金额</th>
            <th>所属期限</th>
            <th>是否收取</th>
            <th>逾期状态</th>
            <th>收款方式</th>
          </tr>
        </thead>
        <tbody>
          {fees.map(fee => (
            <tr key={fee.id}>
              <td>{fee.contract}</td>
              <td>{fee.category}</td>
              <td>{fee.amount}</td>
              <td>{fee.term}</td>
              <td>{fee.is_collected ? '已收' : '未收'}</td>
              <td>{fee.overdue_status}</td>
              <td>{fee.payment_method || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeesPage;