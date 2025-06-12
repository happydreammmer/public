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
  const [height, setHeight] = useState(500); // Reduced height for compactness
  const [isMobile, setIsMobile] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [minGdpFilter, setMinGdpFilter] = useState(0);
  const [maxGdpFilter, setMaxGdpFilter] = useState(Infinity);
  
  // Fixed opacity at 85%
  const opacityValue = 0.85;
  
  // Extract unique political systems for filtering
  const politicalSystems = ['All', ...new Set(data.map(d => d.political_system))];
  
  // Event-hunter style color palette
  const accessibleColors = [
    '#38bdf8', // Blue
    '#f59e0b', // Amber
    '#22c55e', // Green
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#f97316', // Orange
    '#8b5cf6', // Violet
    '#10b981', // Emerald
    '#ef4444', // Red
    '#6366f1', // Indigo
    '#14b8a6', // Teal
    '#f59e0b', // Yellow
    '#9333ea'  // Purple variant
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
    const margin = { top: 20, right: isMobile ? 20 : 160, bottom: isMobile ? 60 : 50, left: isMobile ? 60 : 80 };
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
      .attr('stop-color', '#1e293b')
      .attr('stop-opacity', 0.5);
    
    bgGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#0f172a')
      .attr('stop-opacity', 0.3);
    
    // Add background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#bgGradient)')
      .attr('rx', 12);
    
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
      .range([3, isMobile ? 15 : 25]);
    
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
      .attr('stroke', 'rgba(255, 255, 255, 0.1)')
      .attr('stroke-width', 1);
    
    chartGroup.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.1)')
      .attr('stroke-width', 1);
    
    // Style axis text
    svg.selectAll('.x-axis text, .y-axis text')
      .attr('fill', '#cbd5e1')
      .attr('font-size', '11px')
      .attr('font-weight', '500');
    
    svg.selectAll('.x-axis path, .y-axis path')
      .attr('stroke', 'rgba(255, 255, 255, 0.2)')
      .attr('stroke-width', 2);
    
    // Add enhanced axis labels
    chartGroup.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .attr('fill', '#cbd5e1')
      .text('Economic Freedom Index');
    
    chartGroup.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .attr('fill', '#cbd5e1')
      .text('GDP Per Capita (USD)');
    
    // Enhanced tooltip with proper event-hunter styling
    const tooltip = d3.select(tooltipRef.current)
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(30, 41, 59, 0.98)')
      .style('border', 'none')
      .style('padding', '16px')
      .style('border-radius', '12px')
      .style('box-shadow', '0 16px 48px rgba(0, 0, 0, 0.3)')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '13px')
      .style('max-width', '280px')
      .style('backdrop-filter', 'blur(32px)')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('border', '1px solid rgba(255, 255, 255, 0.1)');
    
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
      .style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))')
      .on('mouseover', (event, d) => {
        d3.select(event.target)
          .transition()
          .duration(200)
          .attr('stroke-width', 3)
          .attr('opacity', 1)
          .style('filter', 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))');
        
        tooltip
          .style('visibility', 'visible')
          .html(`
            <div style="border-bottom: 2px solid ${colorScale(d.political_system)}; padding-bottom: 10px; margin-bottom: 12px;">
              <strong style="font-size: 16px; color: #f8fafc; font-weight: 700;">${d.country}</strong>
            </div>
            <div style="display: grid; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #94a3b8; font-weight: 500;">GDP per capita:</span>
                <strong style="color: #22c55e; font-weight: 700;">$${d.gdp_per_capita.toLocaleString()}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #94a3b8; font-weight: 500;">Population:</span>
                <strong style="color: #38bdf8; font-weight: 700;">${d.population.toLocaleString()}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #94a3b8; font-weight: 500;">Economic Freedom:</span>
                <strong style="color: #f59e0b; font-weight: 700;">${d.economic_freedom.toFixed(1)}</strong>
              </div>
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <span style="color: #94a3b8; font-weight: 500;">Political System:</span><br>
                <strong style="color: ${colorScale(d.political_system)}; font-weight: 600; margin-top: 4px; display: block;">${d.political_system}</strong>
              </div>
            </div>
          `);
      })
      .on('mousemove', (event) => {
        const rect = event.target.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        tooltip
          .style('top', (rect.top + scrollTop - 10) + 'px')
          .style('left', (rect.right + scrollLeft + 15) + 'px');
      })
      .on('mouseout', (event) => {
        d3.select(event.target)
          .transition()
          .duration(200)
          .attr('stroke-width', 2)
          .attr('opacity', opacityValue)
          .style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))');
          
        tooltip.style('visibility', 'hidden');
      });
    
    // Animate circles
    circles
      .transition()
      .duration(800)
      .delay((d, i) => i * 3)
      .attr('r', d => radiusScale(d.population));
    
    // Add country labels for small datasets or search results
    if (!isMobile && (searchTerm || filteredData.length < 15)) {
      chartGroup.selectAll('text.country-label')
        .data(filteredData)
        .enter()
        .append('text')
        .attr('class', 'country-label')
        .attr('x', d => xScale(d.economic_freedom))
        .attr('y', d => yScale(d.gdp_per_capita) - radiusScale(d.population) - 6)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .attr('fill', '#f8fafc')
        .style('pointer-events', 'none')
        .text(d => d.country.length > 12 ? d.country.substring(0, 9) + '...' : d.country)
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .delay(500)
        .style('opacity', 0.9);
    }
    
    // Compact legend for desktop
    if (!isMobile) {
      const legendWidth = 140;
      const legendGroup = svg.append('g')
        .attr('transform', `translate(${width - legendWidth - 15}, 40)`);
      
      legendGroup.append('rect')
        .attr('x', -12)
        .attr('y', -20)
        .attr('width', legendWidth)
        .attr('height', Math.min(politicalSystems.length * 20 + 40, 280))
        .attr('fill', 'rgba(30, 41, 59, 0.95)')
        .attr('stroke', 'rgba(255, 255, 255, 0.1)')
        .attr('stroke-width', 1)
        .attr('rx', 8)
        .style('backdrop-filter', 'blur(20px)');
      
      legendGroup.append('text')
        .attr('x', 0)
        .attr('y', -5)
        .attr('font-weight', '700')
        .attr('font-size', '12px')
        .attr('fill', '#f8fafc')
        .text('Political Systems');
      
      const uniqueSystems = [...new Set(data.map(d => d.political_system))].slice(0, 10);
      
      uniqueSystems.forEach((system, i) => {
        const legendRow = legendGroup.append('g')
          .attr('transform', `translate(0, ${i * 18 + 12})`);
        
        legendRow.append('circle')
          .attr('cx', 8)
          .attr('cy', 0)
          .attr('r', 5)
          .attr('fill', colorScale(system))
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1)
          .style('filter', 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))');
        
        legendRow.append('text')
          .attr('x', 18)
          .attr('y', 3)
          .attr('text-anchor', 'start')
          .style('font-size', '10px')
          .style('font-weight', '500')
          .attr('fill', '#cbd5e1')
          .text(system.length > 16 ? system.substring(0, 13) + '...' : system);
      });
    }
    
    // Compact stats at bottom
    const statsGroup = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${height - 15})`);
    
    statsGroup.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('fill', '#94a3b8')
      .text(`${filteredData.length} of ${data.length} countries shown`);
    
    if (filteredData.length > 0) {
      const avgGdp = d3.mean(filteredData, d => d.gdp_per_capita);
      
      statsGroup.append('text')
        .attr('x', 180)
        .attr('y', 0)
        .attr('font-size', '11px')
        .attr('fill', '#94a3b8')
        .text(`Avg GDP: $${avgGdp.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
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
        const newHeight = mobile ? Math.max(newWidth * 0.7, 350) : Math.max(newWidth * 0.45, 450);
        
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
      {/* Compact Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              border: '1px solid rgba(56, 189, 248, 0.2)',
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
              }
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 1, 
                  backgroundColor: 'rgba(56, 189, 248, 0.2)',
                  mr: 2 
                }}>
                  <PublicIcon sx={{ color: '#38bdf8', fontSize: 20 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#38bdf8', lineHeight: 1 }}>
                    {totalCountries}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                    Countries
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              border: '1px solid rgba(34, 197, 94, 0.2)',
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
              }
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 1, 
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  mr: 2 
                }}>
                  <TrendingUpIcon sx={{ color: '#22c55e', fontSize: 20 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#22c55e', lineHeight: 1 }}>
                    {uniqueSystems}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                    Political Systems
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              border: '1px solid rgba(245, 158, 11, 0.2)',
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
              }
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 1, 
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  mr: 2 
                }}>
                  <PeopleIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#f59e0b', lineHeight: 1 }}>
                    {(totalPopulation / 1e9).toFixed(1)}B
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                    Total Population
                  </Typography>
                </Box>
              </Box>
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
        elevation={0} 
        sx={{ 
          position: 'relative', 
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          background: 'rgba(30, 41, 59, 0.4)',
          backdropFilter: 'blur(20px)',
          mb: 3,
          '&:hover': {
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <svg ref={svgRef} style={{ width: '100%', height: 'auto', display: 'block' }}></svg>
        <div ref={tooltipRef}></div>
        
        {/* Mobile Legend */}
        {isMobile && (
          <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.6)' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#f8fafc' }}>
              Political Systems
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[...new Set(data.map(d => d.political_system))].slice(0, 6).map((system, i) => (
                <Chip
                  key={system}
                  label={system.length > 12 ? system.substring(0, 9) + '...' : system}
                  size="small"
                  sx={{
                    backgroundColor: colorScale(system),
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
      
      {/* Compact Instructions */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          borderRadius: 2,
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#38bdf8' }}>
          How to Read This Visualization
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.8rem', mb: 0.5 }}>
              <strong>Circle Size:</strong> Population (larger = more people)
            </Typography>
            <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.8rem' }}>
              <strong>Y-Axis:</strong> GDP Per Capita (higher = wealthier)
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.8rem', mb: 0.5 }}>
              <strong>X-Axis:</strong> Economic Freedom (higher = more freedom)
            </Typography>
            <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.8rem' }}>
              <strong>Colors:</strong> Different political systems
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CountryVisualization;
