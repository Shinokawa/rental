import React, { useEffect, useState } from 'react';

const TenantsPage = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('http://localhost:8000/api/tenants/', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      },
    })
      .then(response => response.json())
      .then(data => {
        setTenants(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('获取客户数据失败：', error);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>加载中...</div>;
  
  return (
    <div>
      <h2>客户管理</h2>
      <table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>邮箱</th>
            <th>电话</th>
            <th>合同</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map(tenant => (
            <tr key={tenant.id}>
              <td>{tenant.first_name} {tenant.last_name}</td>
              <td>{tenant.email}</td>
              <td>{tenant.phone_number}</td>
              <td>
                {tenant.contracts && tenant.contracts.length > 0
                  ? tenant.contracts.map(contract => (
                      <div key={contract.id}>合同 #{contract.id}</div>
                    ))
                  : '无'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TenantsPage;