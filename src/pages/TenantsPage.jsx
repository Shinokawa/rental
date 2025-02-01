import React, { useEffect, useState } from 'react';

const TenantsPage = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTenant, setNewTenant] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: ''
  });

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
  
  const handleAddTenant = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/tenants/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        body: JSON.stringify(newTenant)
      });
      if (response.ok) {
        const data = await response.json();
        setTenants([...tenants, data]);
        setShowAddForm(false);
        setNewTenant({ first_name: '', last_name: '', email: '', phone_number: '' });
      }
    } catch (error) {
      console.error('添加租户失败:', error);
    }
  };

  const handleDeleteTenant = async (id) => {
    if (window.confirm('确定要删除该租户吗?')) {
      try {
        await fetch(`http://localhost:8000/api/tenants/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
          }
        });
        setTenants(tenants.filter(tenant => tenant.id !== id));
      } catch (error) {
        console.error('删除租户失败:', error);
      }
    }
  };

  if (loading) return <div>加载中...</div>;
  
  return (
    <div>
      <h2>客户管理</h2>
      <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? '取消添加' : '添加租户'}
      </button>
      
      {showAddForm && (
        <form onSubmit={handleAddTenant}>
          <div>
            <label>名字</label>
            <input
              type="text"
              value={newTenant.first_name}
              onChange={(e) => setNewTenant({ ...newTenant, first_name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>姓氏</label>
            <input
              type="text"
              value={newTenant.last_name}
              onChange={(e) => setNewTenant({ ...newTenant, last_name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>邮箱</label>
            <input
              type="email"
              value={newTenant.email}
              onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label>电话</label>
            <input
              type="tel"
              value={newTenant.phone_number}
              onChange={(e) => setNewTenant({ ...newTenant, phone_number: e.target.value })}
              required
            />
          </div>
          <button type="submit">添加</button>
        </form>
      )}
      
      <table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>邮箱</th>
            <th>电话</th>
            <th>合同</th>
            <th>操作</th>
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
              <td>
                <button onClick={() => handleDeleteTenant(tenant.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TenantsPage;