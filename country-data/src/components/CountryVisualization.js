import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { 
  Box, 
  Typography, 
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Public as PublicIcon
} from '@mui/icons-material';
import FilterPanel from './FilterPanel';

const CountryVisualization = ({ data }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [width, setWidth] = useState(900);
  const [height, setHeight] = useState(600);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [minGdpFilter, setMinGdpFilter] = useState(0);
  const [maxGdpFilter, setMaxGdpFilter] = useState(Infinity);
  
  // Fixed opacity at 85%
  const opacityValue = 0.85;
  
  // Extract unique political systems for filtering
  const politicalSystems = ['All', ...new Set(data.map(d => d.political_system))];
  
  // Enhanced colorblind-friendly color palette with better contrast
  const accessibleColors = [
    '#2563eb', // Modern blue
    '#dc2626', // Modern red
    '#16a34a', // Modern green
    '#ca8a04', // Modern yellow/gold
    '#7c3aed', // Modern purple
    '#ea580c', // Modern orange
    '#db2777', // Modern pink
    '#059669', // Modern teal
    '#4338ca', // Modern indigo
    '#be123c', // Modern rose
    '#0891b2', // Modern cyan
    '#65a30d', // Modern lime
    '#c2410c', // Modern amber
    '#9333ea', // Modern violet
    '#0d9488'  // Modern emerald
  ];

  // Color scale for political systems
  const colorScale = d3.scaleOrdinal()
    .domain(politicalSystems.filter(d => d !== 'All'))
    .range(accessibleColors);
  
  useEffect(() => {
    // Filter data based on selected political system and search term
    let filteredData = data;
    
    // Filter by political system
    if (selectedSystem !== 'All') {
      filteredData = filteredData.filter(d => d.political_system === selectedSystem);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredData = filteredData.filter(d => d.country.toLowerCase().includes(term));
    }
    
    // Filter by GDP range
    filteredData = filteredData.filter(d => 
      d.gdp_per_capita >= minGdpFilter && 
      d.gdp_per_capita <= (maxGdpFilter === Infinity ? d3.max(data, d => d.gdp_per_capita) : maxGdpFilter)
    );
    
    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Create SVG with responsive margins
    const margin = { top: 40, right: isMobile ? 30 : 200, bottom: isMobile ? 100 : 80, left: isMobile ? 70 : 90 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    // Add gradient definitions
    const defs = svg.append('defs');
    
    // Create a gradient for the background
    const bgGradient = defs.append('linearGradient')
      .attr('id', 'bgGradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '100%');
    
    bgGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#f8fafc')
      .attr('stop-opacity', 0.8);
    
    bgGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#e2e8f0')
      .attr('stop-opacity', 0.3);
    
    // Add background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#bgGradient)')
      .attr('rx', 8);
    
    // Create main chart group
    const chartGroup = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.economic_freedom) * 1.05])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.gdp_per_capita) * 1.05])
      .range([innerHeight, 0]);
    
    const radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d.population)])
      .range([4, isMobile ? 20 : 30]);
    
    // Create enhanced axes
    const xAxis = d3.axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickFormat(d3.format('.1f'));
    
    const yAxis = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat(d => `$${d3.format('.0s')(d)}`);
    
    // Add grid lines and axes
    chartGroup.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll('line')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1);
    
    chartGroup.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('line')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1);
    
    // Style axis text
    svg.selectAll('.x-axis text, .y-axis text')
      .attr('fill', '#64748b')
      .attr('font-size', '12px');
    
    svg.selectAll('.x-axis path, .y-axis path')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 2);
    
    // Add enhanced axis labels
    chartGroup.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 50)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', '#374151')
      .text('Economic Freedom Index');
    
    chartGroup.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', '#374151')
      .text('GDP Per Capita (USD)');
    
    // Enhanced tooltip
    const tooltip = d3.select(tooltipRef.current)
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(255, 255, 255, 0.98)')
      .style('border', 'none')
      .style('padding', '16px')
      .style('border-radius', '12px')
      .style('box-shadow', '0 10px 25px rgba(0, 0, 0, 0.15)')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '13px')
      .style('max-width', '250px')
      .style('backdrop-filter', 'blur(10px)')
      .style('pointer-events', 'none')
      .style('z-index', '1000');
    
    // Add circles for each country with enhanced styling
    const circles = chartGroup.selectAll('circle')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.economic_freedom))
      .attr('cy', d => yScale(d.gdp_per_capita))
      .attr('r', 0) // Start with 0 for animation
      .attr('fill', d => colorScale(d.political_system))
      .attr('opacity', opacityValue)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')
      .on('mouseover', (event, d) => {
        // Highlight the hovered circle
        d3.select(event.target)
          .transition()
          .duration(200)
          .attr('stroke-width', 3)
          .attr('opacity', 1)
          .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))');
        
        tooltip
          .style('visibility', 'visible')
          .html(`
            <div style="border-bottom: 2px solid ${colorScale(d.political_system)}; padding-bottom: 8px; margin-bottom: 8px;">
              <strong style="font-size: 15px; color: #1f2937;">${d.country}</strong>
            </div>
            <div style="display: grid; gap: 6px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">GDP per capita:</span>
                <strong style="color: #059669;">$${d.gdp_per_capita.toLocaleString()}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Population:</span>
                <strong style="color: #2563eb;">${d.population.toLocaleString()}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Economic Freedom:</span>
                <strong style="color: #dc2626;">${d.economic_freedom.toFixed(1)}</strong>
              </div>
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                <span style="color: #6b7280;">Political System:</span><br>
                <strong style="color: ${colorScale(d.political_system)};">${d.political_system}</strong>
              </div>
            </div>
          `);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 15) + 'px');
      })
      .on('mouseout', (event) => {
        d3.select(event.target)
          .transition()
          .duration(200)
          .attr('stroke-width', 2)
          .attr('opacity', opacityValue)
          .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');
          
        tooltip.style('visibility', 'hidden');
      });
    
    // Animate circles
    circles
      .transition()
      .duration(800)
      .delay((d, i) => i * 5)
      .attr('r', d => radiusScale(d.population));
    
    // Add country labels for small datasets or search results
    if (searchTerm || filteredData.length < 15) {
      chartGroup.selectAll('text.country-label')
        .data(filteredData)
        .enter()
        .append('text')
        .attr('class', 'country-label')
        .attr('x', d => xScale(d.economic_freedom))
        .attr('y', d => yScale(d.gdp_per_capita) - radiusScale(d.population) - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .attr('fill', '#374151')
        .style('pointer-events', 'none')
        .text(d => d.country)
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .delay(500)
        .style('opacity', 0.8);
    }
    
    // Enhanced legends positioning with better responsiveness
    if (!isMobile) {
      // Political Systems Legend
      const legendWidth = 170;
      const legendGroup = svg.append('g')
        .attr('transform', `translate(${width - legendWidth - 20}, 60)`);
      
      legendGroup.append('rect')
        .attr('x', -15)
        .attr('y', -25)
        .attr('width', legendWidth)
        .attr('height', Math.min(politicalSystems.length * 25 + 50, 320))
        .attr('fill', 'rgba(255, 255, 255, 0.98)')
        .attr('stroke', 'rgba(37, 99, 235, 0.1)')
        .attr('stroke-width', 2)
        .attr('rx', 12)
        .style('filter', 'drop-shadow(0 4px 16px rgba(0,0,0,0.1))')
        .style('backdrop-filter', 'blur(10px)');
      
      legendGroup.append('text')
        .attr('x', 0)
        .attr('y', -10)
        .attr('font-weight', '700')
        .attr('font-size', '14px')
        .attr('fill', '#1f2937')
        .text('Political Systems');
      
      const uniqueSystems = [...new Set(data.map(d => d.political_system))].slice(0, 12);
      
      uniqueSystems.forEach((system, i) => {
        const legendRow = legendGroup.append('g')
          .attr('transform', `translate(0, ${i * 22 + 15})`)
          .style('cursor', 'pointer')
          .on('mouseover', function() {
            d3.select(this).select('rect')
              .attr('fill', 'rgba(37, 99, 235, 0.08)');
          })
          .on('mouseout', function() {
            d3.select(this).select('rect')
              .attr('fill', 'transparent');
          });
        
        legendRow.append('rect')
          .attr('x', -10)
          .attr('y', -8)
          .attr('width', legendWidth - 20)
          .attr('height', 18)
          .attr('fill', 'transparent')
          .attr('rx', 4);
        
        legendRow.append('circle')
          .attr('cx', 10)
          .attr('cy', 0)
          .attr('r', 7)
          .attr('fill', colorScale(system))
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2)
          .style('filter', 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))');
        
        legendRow.append('text')
          .attr('x', 24)
          .attr('y', 4)
          .attr('text-anchor', 'start')
          .style('font-size', '12px')
          .style('font-weight', '500')
          .attr('fill', '#374151')
          .text(system.length > 20 ? system.substring(0, 17) + '...' : system);
      });
      
      // Population Scale Legend
      const populationLegend = svg.append('g')
        .attr('transform', `translate(90, ${height - 140})`);
      
      populationLegend.append('rect')
        .attr('x', -20)
        .attr('y', -30)
        .attr('width', 140)
        .attr('height', 120)
        .attr('fill', 'rgba(255, 255, 255, 0.98)')
        .attr('stroke', 'rgba(245, 158, 11, 0.1)')
        .attr('stroke-width', 2)
        .attr('rx', 12)
        .style('filter', 'drop-shadow(0 4px 16px rgba(0,0,0,0.1))')
        .style('backdrop-filter', 'blur(10px)');
      
      populationLegend.append('text')
        .attr('x', 0)
        .attr('y', -15)
        .attr('font-weight', '700')
        .attr('font-size', '14px')
        .attr('fill', '#1f2937')
        .text('Population Scale');
      
      const populationSizes = [1000000, 50000000, 500000000];
      const populationLabels = ['1M', '50M', '500M'];
      
      populationSizes.forEach((size, i) => {
        const cy = i * 28 + 10;
        
        populationLegend.append('circle')
          .attr('cx', 18)
          .attr('cy', cy)
          .attr('r', radiusScale(size))
          .attr('fill', 'none')
          .attr('stroke', '#f59e0b')
          .attr('stroke-width', 2)
          .style('opacity', 0.8);
        
        populationLegend.append('text')
          .attr('x', 40)
          .attr('y', cy + 4)
          .attr('text-anchor', 'start')
          .style('font-size', '12px')
          .style('font-weight', '500')
          .attr('fill', '#374151')
          .text(populationLabels[i]);
      });
    }
    
    // Add count and statistics
    const statsGroup = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${height - 30})`);
    
    statsGroup.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('fill', '#6b7280')
      .text(`Showing ${filteredData.length} of ${data.length} countries`);
    
    if (filteredData.length > 0) {
      const avgGdp = d3.mean(filteredData, d => d.gdp_per_capita);
      const avgFreedom = d3.mean(filteredData, d => d.economic_freedom);
      
      statsGroup.append('text')
        .attr('x', 200)
        .attr('y', 0)
        .attr('font-size', '12px')
        .attr('fill', '#6b7280')
        .text(`Avg GDP: $${avgGdp.toLocaleString('en-US', { maximumFractionDigits: 0 })} | Avg Freedom: ${avgFreedom.toFixed(1)}`);
    }
    
  }, [data, width, height, selectedSystem, searchTerm, minGdpFilter, maxGdpFilter, colorScale, isMobile]);
  
  // Handle window resize and mobile detection
  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        const containerWidth = container.clientWidth;
        const mobile = containerWidth < 768;
        setIsMobile(mobile);
        
        // Responsive dimensions
        const newWidth = Math.min(containerWidth, 1200);
        const newHeight = mobile ? Math.max(newWidth * 0.8, 400) : Math.max(newWidth * 0.6, 500);
        
        setWidth(newWidth);
        setHeight(newHeight);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Calculate statistics
  const maxGdp = Math.ceil(d3.max(data, d => d.gdp_per_capita) / 10000) * 10000;
  const totalCountries = data.length;
  const uniqueSystems = new Set(data.map(d => d.political_system)).size;
  const totalPopulation = d3.sum(data, d => d.population);
  
  return (
    <Box>
      {/* Enhanced Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card 
            elevation={3} 
            sx={{ 
              borderRadius: 3, 
              border: '1px solid rgba(37, 99, 235, 0.1)',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.02) 0%, rgba(37, 99, 235, 0.08) 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(37, 99, 235, 0.15)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  mr: 2 
                }}>
                  <PublicIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                    {totalCountries}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Countries
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Represented in dataset
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card 
            elevation={3} 
            sx={{ 
              borderRadius: 3, 
              border: '1px solid rgba(22, 163, 74, 0.1)',
              background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.02) 0%, rgba(22, 163, 74, 0.08) 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(22, 163, 74, 0.15)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  mr: 2 
                }}>
                  <TrendingUpIcon sx={{ color: 'success.main', fontSize: 28 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 0.5 }}>
                    {uniqueSystems}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Political Systems
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Unique governance types
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card 
            elevation={3} 
            sx={{ 
              borderRadius: 3, 
              border: '1px solid rgba(245, 158, 11, 0.1)',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.02) 0%, rgba(245, 158, 11, 0.08) 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(245, 158, 11, 0.15)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  mr: 2 
                }}>
                  <PeopleIcon sx={{ color: 'warning.main', fontSize: 28 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main', mb: 0.5 }}>
                    {(totalPopulation / 1e9).toFixed(1)}B
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Total Population
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Combined population
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <FilterPanel
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSystem={selectedSystem}
        setSelectedSystem={setSelectedSystem}
        politicalSystems={politicalSystems}
        minGdpFilter={minGdpFilter}
        maxGdpFilter={maxGdpFilter}
        setMinGdpFilter={setMinGdpFilter}
        setMaxGdpFilter={setMaxGdpFilter}
        maxGdp={maxGdp}
        isMobile={isMobile}
      />
      
      <Paper 
        elevation={4} 
        sx={{ 
          position: 'relative', 
          borderRadius: 3,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <svg ref={svgRef} style={{ width: '100%', height: 'auto', display: 'block' }}></svg>
        <div ref={tooltipRef}></div>
        
        {/* Mobile Legend */}
        {isMobile && (
          <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
              🎨 Political Systems
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[...new Set(data.map(d => d.political_system))].slice(0, 8).map((system, i) => (
                <Chip
                  key={system}
                  label={system.length > 15 ? system.substring(0, 12) + '...' : system}
                  size="small"
                  sx={{
                    backgroundColor: colorScale(system),
                    color: 'white',
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
      
      <Box sx={{ mt: 4 }}>
        <Paper 
          elevation={1} 
          sx={{ 
            p: 3, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.02) 0%, rgba(37, 99, 235, 0.06) 100%)',
            border: '1px solid rgba(37, 99, 235, 0.1)'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
            📊 How to Read This Visualization
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 1 }}>
                <strong>🔵 Circle Size:</strong> Represents population size (larger = more people)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                <strong>📈 X-Axis:</strong> Economic Freedom Index (higher = more economic freedom)
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 1 }}>
                <strong>💰 Y-Axis:</strong> GDP Per Capita in USD (higher = wealthier)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                <strong>🎨 Colors:</strong> Different political systems and governance types
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mt: 2, fontStyle: 'italic' }}>
            💡 <strong>Tip:</strong> Hover over any circle for detailed country information, use filters above to explore specific regions or systems.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default CountryVisualization;
