import React from 'react';
import Charts from '../../components/Charts';

export default function Analytics() {
  return (
    <div>
      <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Model Performance & Screening Analytics</h2>
      <Charts title="Monthly Risk Screening Trends" />
    </div>
  );
}
