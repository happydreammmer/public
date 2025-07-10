import React from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface CountryData {
  name: string;
  gdp_per_capita: number;
  population: number;
  freedom_index: number;
  political_system: string;
}

interface Payload {
  payload: CountryData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Payload[];
}

interface CountryVisualizationProps {
  data: CountryData[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{data.name}</p>
        <p>GDP per Capita: ${data.gdp_per_capita.toLocaleString()}</p>
        <p>Freedom Index: {data.freedom_index}</p>
        <p>Population: {(data.population / 1_000_000).toFixed(1)}M</p>
        <p>Political System: {data.political_system}</p>
      </div>
    );
  }
  return null;
};

const CountryVisualization: React.FC<CountryVisualizationProps> = ({ data }) => {
  const politicalSystems = [...new Set(data.map(item => item.political_system))];
  const colorScale = (system: string) => {
    switch (system) {
      case 'Monarchy': return '#8884d8';
      case 'Republic': return '#82ca9d';
      default: return '#ffc658';
    }
  };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <ResponsiveContainer>
        <ScatterChart
          margin={{
            top: 20, right: 20, bottom: 20, left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
          <XAxis 
            dataKey="freedom_index" 
            type="number" 
            name="Freedom Index" 
            label={{ value: 'Economic Freedom Index', position: 'insideBottom', offset: -10 }}
            stroke="#8b949e"
          />
          <YAxis 
            dataKey="gdp_per_capita" 
            type="number" 
            name="GDP per Capita" 
            tickFormatter={(value: number) => `$${Number(value).toLocaleString()}`}
            label={{ value: 'GDP per Capita (USD)', angle: -90, position: 'insideLeft' }}
            stroke="#8b949e"
          />
          <ZAxis dataKey="population" type="number" range={[20, 400]} name="Population" />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          {politicalSystems.map(system => (
            <Scatter 
              key={system} 
              name={system} 
              data={data.filter(d => d.political_system === system)} 
              fill={colorScale(system)} 
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CountryVisualization;
