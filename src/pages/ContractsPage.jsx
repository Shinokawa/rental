import React, { useEffect, useState } from 'react';

const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('http://localhost:8000/api/contracts/', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      },
    })
      .then(response => response.json())
      .then(data => {
        setContracts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('获取合同数据失败：', error);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>加载中...</div>;
  
  return (
    <div>
      <h2>合同管理</h2>
      <table>
        <thead>
          <tr>
            <th>租户</th>
            <th>租期</th>
            <th>月租金</th>
            <th>年租金</th>
            <th>总租金</th>
            <th>租赁面积</th>
            <th>租赁单价</th>
            <th>收租时间</th>
            <th>合同状态</th>
            <th>应收租金</th>
            <th>欠收租金</th>
            <th>累计欠费</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(contract => (
            <tr key={contract.id}>
              <td>{contract.tenant.email}</td>
              <td>{contract.start_date} ~ {contract.end_date}</td>
              <td>{contract.monthly_rent}</td>
              <td>{contract.yearly_rent}</td>
              <td>{contract.total_rent}</td>
              <td>{contract.rental_area}</td>
              <td>{contract.rental_unit_price}</td>
              <td>{contract.rent_collection_time}</td>
              <td>{contract.status}</td>
              <td>{contract.current_receivable}</td>
              <td>{contract.current_outstanding}</td>
              <td>{contract.total_overdue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractsPage;