import React, { useEffect, useState } from 'react';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('http://localhost:8000/api/properties/', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      },
    })
      .then(response => response.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('获取房源数据失败：', error);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>加载中...</div>;
  
  return (
    <div>
      <h2>房源管理</h2>
      <table>
        <thead>
          <tr>
            <th>房号</th>
            <th>面积</th>
            <th>地址</th>
            <th>租赁状态</th>
            <th>当前状态</th>
            <th>当前价值</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
              <td>{property.house_number}</td>
              <td>{property.area} 平方米</td>
              <td>{property.address}</td>
              <td>{property.rental_status}</td>
              <td>{property.maintenance_status || '正常'}</td>
              <td>{property.current_value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertiesPage;