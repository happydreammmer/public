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
  const [opacityValue, setOpacityValue] = useState(0.7);
  const [minGdpFilter, setMinGdpFilter] = useState(0);
  const [maxGdpFilter, setMaxGdpFilter] = useState(Infinity);
  
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
    const margin = { top: 40, right: isMobile ? 20 : 180, bottom: 80, left: isMobile ? 60 : 80 };
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
    
    // Enhanced legends positioning
    if (!isMobile) {
      // Political Systems Legend
      const legendGroup = svg.append('g')
        .attr('transform', `translate(${width - 160}, 60)`);
      
      legendGroup.append('rect')
        .attr('x', -10)
        .attr('y', -20)
        .attr('width', 150)
        .attr('height', Math.min(politicalSystems.length * 25 + 40, 300))
        .attr('fill', 'rgba(255, 255, 255, 0.95)')
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1)
        .attr('rx', 8)
        .style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))');
      
      legendGroup.append('text')
        .attr('x', 0)
        .attr('y', -5)
        .attr('font-weight', '600')
        .attr('font-size', '13px')
        .attr('fill', '#374151')
        .text('Political Systems');
      
      const uniqueSystems = [...new Set(data.map(d => d.political_system))].slice(0, 10);
      
      uniqueSystems.forEach((system, i) => {
        const legendRow = legendGroup.append('g')
          .attr('transform', `translate(0, ${i * 25 + 15})`);
        
        legendRow.append('circle')
          .attr('cx', 8)
          .attr('cy', 0)
          .attr('r', 8)
          .attr('fill', colorScale(system))
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1.5);
        
        legendRow.append('text')
          .attr('x', 22)
          .attr('y', 4)
          .attr('text-anchor', 'start')
          .style('font-size', '11px')
          .attr('fill', '#4b5563')
          .text(system.length > 18 ? system.substring(0, 15) + '...' : system);
      });
      
      // Population Scale Legend
      const populationLegend = svg.append('g')
        .attr('transform', `translate(80, ${height - 120})`);
      
      populationLegend.append('rect')
        .attr('x', -15)
        .attr('y', -25)
        .attr('width', 130)
        .attr('height', 110)
        .attr('fill', 'rgba(255, 255, 255, 0.95)')
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1)
        .attr('rx', 8)
        .style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))');
      
      populationLegend.append('text')
        .attr('x', 0)
        .attr('y', -10)
        .attr('font-weight', '600')
        .attr('font-size', '13px')
        .attr('fill', '#374151')
        .text('Population Scale');
      
      const populationSizes = [1000000, 50000000, 500000000];
      const populationLabels = ['1M', '50M', '500M'];
      
      populationSizes.forEach((size, i) => {
        const cy = i * 25 + 10;
        
        populationLegend.append('circle')
          .attr('cx', 15)
          .attr('cy', cy)
          .attr('r', radiusScale(size))
          .attr('fill', 'none')
          .attr('stroke', '#6b7280')
          .attr('stroke-width', 1.5);
        
        populationLegend.append('text')
          .attr('x', 35)
          .attr('y', cy + 4)
          .attr('text-anchor', 'start')
          .style('font-size', '11px')
          .attr('fill', '#4b5563')
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
    
  }, [data, width, height, selectedSystem, searchTerm, opacityValue, minGdpFilter, maxGdpFilter, colorScale, isMobile]);
  
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
        const newHeight = mobile ? newWidth * 0.75 : Math.max(newWidth * 0.6, 500);
        
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
      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card elevation={1} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: '16px !important' }}>
              <PublicIcon sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {totalCountries}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Countries
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={1} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: '16px !important' }}>
              <TrendingUpIcon sx={{ color: 'success.main', mr: 2, fontSize: 28 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {uniqueSystems}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Political Systems
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={1} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: '16px !important' }}>
              <PeopleIcon sx={{ color: 'warning.main', mr: 2, fontSize: 28 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {(totalPopulation / 1e9).toFixed(1)}B
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Population
                </Typography>
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
        opacityValue={opacityValue}
        setOpacityValue={setOpacityValue}
        minGdpFilter={minGdpFilter}
        maxGdpFilter={maxGdpFilter}
        setMinGdpFilter={setMinGdpFilter}
        setMaxGdpFilter={setMaxGdpFilter}
        maxGdp={maxGdp}
        isMobile={isMobile}
      />
      
      <Paper 
        elevation={2} 
        sx={{ 
          position: 'relative', 
          borderRadius: 2,
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
        <svg ref={svgRef} style={{ width: '100%', height: 'auto', display: 'block' }}></svg>
        <div ref={tooltipRef}></div>
      </Paper>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          <strong>How to read this visualization:</strong> Each circle represents a country. 
          Circle size indicates population, position on X-axis shows Economic Freedom Index, 
          Y-axis shows GDP Per Capita, and colors represent different political systems. 
          Hover over any circle for detailed information.
        </Typography>
      </Box>
    </Box>
  );
};

export default CountryVisualization;
