import React from 'react';

interface Country {
  name: string;
  population: number;
  gdp_per_capita: number;
  freedom_index: number;
}

interface DataAnalysisProps {
  data: Country[];
}

const DataAnalysis: React.FC<DataAnalysisProps> = ({ data }) => {
  const sortedByGdp = [...data].sort((a, b) => b.gdp_per_capita - a.gdp_per_capita).slice(0, 5);
  const sortedByFreedom = [...data].sort((a, b) => b.freedom_index - a.freedom_index).slice(0, 5);
  const sortedByPopulation = [...data].sort((a, b) => b.population - a.population).slice(0, 5);

  return (
    <>
      <section className="section">
        <div className="data-analysis-grid">
          <div className="analysis-card">
            <h3>Richest Countries (GDP p.c.)</h3>
            <ul className="analysis-list">
              {sortedByGdp.map((country, index) => (
                <li key={country.name}>
                  <span className="list-rank">#{index + 1}</span>
                  <span className="list-name">{country.name}</span>
                  <span className="list-value">${country.gdp_per_capita.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="analysis-card">
            <h3>Most Free Economies</h3>
            <ul className="analysis-list">
              {sortedByFreedom.map((country, index) => (
                <li key={country.name}>
                  <span className="list-rank">#{index + 1}</span>
                  <span className="list-name">{country.name}</span>
                  <span className="list-value">{country.freedom_index.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="analysis-card">
            <h3>Most Populous Nations</h3>
            <ul className="analysis-list">
              {sortedByPopulation.map((country, index) => (
                <li key={country.name}>
                  <span className="list-rank">#{index + 1}</span>
                  <span className="list-name">{country.name}</span>
                  <span className="list-value">{(country.population / 1_000_000).toFixed(1)}M</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section insights-section">
        <h2>Key Insights & Conclusions</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h3>Economic Patterns</h3>
            <ul>
              <li>Strong positive correlation between economic freedom and GDP per capita.</li>
              <li>Wealth Concentration: Top-tier economies show significant wealth gaps.</li>
            </ul>
          </div>
          <div className="insight-card">
            <h3>Political Governance</h3>
            <ul>
              <li>Republican Dominance: Republics represent the majority of political systems globally.</li>
              <li>Monarchical Performance: Monarchies, though fewer, often rank high in wealth.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default DataAnalysis; 