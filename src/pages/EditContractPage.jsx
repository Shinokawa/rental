import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditContractPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState({
    tenant: '',
    properties: [],
    start_date: '',
    end_date: '',
    monthly_rent: '',
    yearly_rent: '',
    total_rent: '',
    rental_area: '',
    rental_unit_price: '',
    rent_collection_time: '',
    status: 'active',
    deposit_amount: '',
    management_fee: '',
    business_type: '',
    rental_purpose: '',
    decoration_period: 0,
    rent_free_period: 0,
    utilities_payment: '',
    promotion_fee: ''
  });

  const [tenants, setTenants] = useState([]);
  const [availableProperties, setAvailableProperties] = useState([]);

  useEffect(() => {
    // 获取可选租户
    fetch('http://localhost:8000/api/tenants/', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }
    })
      .then(res => res.json())
      .then(data => setTenants(data));

    // 获取可用房源
    fetch('http://localhost:8000/api/properties/available/', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }
    })
      .then(res => res.json())
      .then(data => setAvailableProperties(data));

    // 如果是编辑模式，获取合同详情
    if (id) {
      fetch(`http://localhost:8000/api/contracts/${id}/`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
      })
        .then(res => res.json())
        .then(data => setContract(data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = id 
      ? `http://localhost:8000/api/contracts/${id}/`
      : 'http://localhost:8000/api/contracts/';
    const method = id ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        body: JSON.stringify(contract)
      });
      navigate('/contracts');
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  return (
    <div>
      <h2>{id ? '编辑合同' : '新增合同'}</h2>
      <form onSubmit={handleSubmit}>
        {/* 租户选择 */}
        <div>
          <label>租户:</label>
          <select 
            value={contract.tenant}
            onChange={e => setContract({...contract, tenant: e.target.value})}
            required
          >
            <option value="">请选择租户</option>
            {tenants.map(tenant => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.first_name} {tenant.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* 房源选择（多选） */}
        <div>
          <label>房源:</label>
          <select 
            multiple
            value={contract.properties}
            onChange={e => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              setContract({...contract, properties: selected});
            }}
            required
          >
            {availableProperties.map(property => (
              <option key={property.id} value={property.id}>
                {property.house_number}
              </option>
            ))}
          </select>
        </div>

        {/* 其他合同字段 */}
        <div>
          <label>开始日期:</label>
          <input
            type="date"
            value={contract.start_date}
            onChange={e => setContract({...contract, start_date: e.target.value})}
            required
          />
        </div>
        {/* ...其他字段... */}
        <button type="submit">保存</button>
        <button type="button" onClick={() => navigate('/contracts')}>取消</button>
      </form>
    </div>
  );
};

export default EditContractPage;
