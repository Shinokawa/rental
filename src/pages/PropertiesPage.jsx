import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PropertiesPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    rental_status: '',
    search: ''
  });

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
  
  const handleDelete = async (id) => {
    if(!window.confirm('确定要删除该房源?')) return;
    
    try {
      await fetch(`http://localhost:8000/api/properties/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
      });
      setProperties(properties.filter(p => p.id !== id));
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const filteredProperties = properties.filter(property => {
    if (filters.rental_status && property.rental_status !== filters.rental_status) {
      return false;
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        property.house_number.toLowerCase().includes(searchTerm) ||
        property.address.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  if (loading) return <div>加载中...</div>;
  
  return (
    <div>
      <h2>房源管理</h2>
      <div>
        <button onClick={() => navigate('/properties/new')}>添加房源</button>
        <select
          value={filters.rental_status}
          onChange={e => setFilters({...filters, rental_status: e.target.value})}
        >
          <option value="">全部状态</option>
          <option value="available">未租赁</option>
          <option value="rented">已租赁</option>
          <option value="maintenance">维护中</option>
        </select>
        <input
          type="text"
          placeholder="搜索房号或地址..."
          value={filters.search}
          onChange={e => setFilters({...filters, search: e.target.value})}
        />
      </div>

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
          {filteredProperties.map((property) => (
            <tr key={property.id}>
              <td>{property.house_number}</td>
              <td>{property.area} 平方米</td>
              <td>{property.address}</td>
              <td>{property.rental_status}</td>
              <td>{property.maintenance_status || '正常'}</td>
              <td>{property.current_value}</td>
              <td>
                <button onClick={() => navigate(`/properties/${property.id}/edit`)}>
                  编辑
                </button>
                <button onClick={() => handleDelete(property.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertiesPage;