import React, { useEffect, useState } from 'react';

const DataAnalysisPage = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('http://localhost:8000/api/data-analysis/', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      },
    })
      .then(response => response.json())
      .then(data => {
        setAnalysis(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('获取数据分析失败：', error);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>加载中...</div>;
  
  return (
    <div>
      <h2>数据分析</h2>
      <h3>财务数据</h3>
      <ul>
        <li>应收金额: {analysis.financial.receivable_amount}</li>
        <li>已收金额: {analysis.financial.received_amount}</li>
        <li>逾期金额: {analysis.financial.overdue_amount}</li>
        <li>收款率: {analysis.financial.collection_rate}%</li>
      </ul>
      <h3>房产数据</h3>
      <ul>
        <li>总面积: {analysis.property.total_area} 平方米</li>
        <li>已租面积: {analysis.property.rented_area} 平方米</li>
        <li>可用房源: {analysis.property.available_properties}</li>
        <li>出租率: {analysis.property.rental_rate}%</li>
      </ul>
    </div>
  );
};

export default DataAnalysisPage;