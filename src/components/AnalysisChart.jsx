import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';

const AnalysisChart = ({ type, data, options }) => {
  const charts = {
    line: Line,
    bar: Bar,
    pie: Pie
  };

  const ChartComponent = charts[type];

  return (
    <div className="chart-container">
      <ChartComponent data={data} options={options} />
    </div>
  );
};

export default AnalysisChart;
