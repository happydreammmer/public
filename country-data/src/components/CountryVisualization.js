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
  const [height, setHeight] = useState(500);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [minGdpFilter, setMinGdpFilter] = useState(0);
  const [maxGdpFilter, setMaxGdpFilter] = useState(Infinity);
  const [activeTooltip, setActiveTooltip] = useState(null);
  
  // Enhanced opacity for better visibility
  const opacityValue = 0.9;
  
  // Function to categorize political systems into simplified categories
  const categorizePoliticalSystem = (system) => {
    const systemLower = system.toLowerCase();
    
    // Monarchies (all types of monarchies)
    if (systemLower.includes('monarchy') || 
        systemLower.includes('monarch') ||
        systemLower.includes('kingdom')) {
      return 'Monarchies';
    }
    
    // Republics (all types of republics)
    if (systemLower.includes('republic')) {
      return 'Republics';
    }
    
    // Others (everything else)
    return 'Others';
  };
  
  // Process data with simplified political systems
  const processedData = data.map(d => ({
    ...d,
    simplified_political_system: categorizePoliticalSystem(d.political_system),
    original_political_system: d.political_system
  }));
  
  // Extract simplified political systems for filtering
  const politicalSystems = ['All', 'Monarchies', 'Republics', 'Others'];
  
  // Refined color palette with better contrast and accessibility
  const enhancedColors = {
    'Monarchies': '#8b5cf6',    // Purple - royal color
    'Republics': '#22c55e',     // Green - democratic color  
    'Others': '#f59e0b'         // Amber - neutral color
  };

  // Color scale for simplified political systems
  const colorScale = d3.scaleOrdinal()
    .domain(['Monarchies', 'Republics', 'Others'])
    .range(['#8b5cf6', '#22c55e', '#f59e0b']);
  
  useEffect(() => {
    // Filter data based on selected political system and search term
    let filteredData = processedData;
    
    // Filter by simplified political system
    if (selectedSystem !== 'All') {
      filteredData = filteredData.filter(d => d.simplified_political_system === selectedSystem);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredData = filteredData.filter(d => d.country.toLowerCase().includes(term));
    }
    
    // Filter by GDP range
    filteredData = filteredData.filter(d => 
      d.gdp_per_capita >= minGdpFilter && 
      d.gdp_per_capita <= (maxGdpFilter === Infinity ? d3.max(processedData, d => d.gdp_per_capita) : maxGdpFilter)
    );
    
    // Clear previous visualization with smooth transition
    d3.select(svgRef.current).selectAll('*')
      .transition()
      .duration(300)
      .style('opacity', 0)
      .remove();
    
    // Create SVG with optimized margins
    const margin = { top: 25, right: isMobile ? 25 : 190, bottom: isMobile ? 70 : 60, left: isMobile ? 70 : 90 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .on('click', () => {
        // Hide tooltip when clicking on empty space with smooth transition
        if (activeTooltip) {
          tooltip.transition()
            .duration(200)
            .style('opacity', 0)
            .style('visibility', 'hidden');
          setActiveTooltip(null);
          
          // Reset all circles with staggered animation
          d3.selectAll('circle')
            .transition()
            .duration(300)
            .delay((d, i) => i * 5)
            .attr('stroke-width', 2)
            .attr('opacity', opacityValue)
            .style('filter', 'drop-shadow(0 3px 8px rgba(0,0,0,0.25))');
        }
      });
    
    // Enhanced gradient definitions
    const defs = svg.append('defs');
    
    // Create multiple gradients for enhanced visual appeal
    const bgGradient = defs.append('linearGradient')
      .attr('id', 'bgGradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '100%');
    
    bgGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#1e293b')
      .attr('stop-opacity', 0.6);
    
    bgGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#0f172a')
      .attr('stop-opacity', 0.4);
    
    // Add enhanced background with animation
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#bgGradient)')
      .attr('rx', 12)
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1);
    
    // Create main chart group
    const chartGroup = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Enhanced scales with improved domain starting from 25
    const xScale = d3.scaleLinear()
      .domain([25, d3.max(processedData, d => d.economic_freedom) * 1.02])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.gdp_per_capita) * 1.05])
      .range([innerHeight, 0]);
    
    const radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(processedData, d => d.population)])
      .range([4, isMobile ? 18 : 28]);
    
    // Enhanced axes with better styling
    const xAxis = d3.axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickFormat(d3.format('.0f'))
      .ticks(8);
    
    const yAxis = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat(d => `$${d3.format('.0s')(d)}`)
      .ticks(8);
    
    // Add grid lines and axes with staggered animation
    const xAxisGroup = chartGroup.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .style('opacity', 0)
      .call(xAxis);
    
    const yAxisGroup = chartGroup.append('g')
      .attr('class', 'y-axis')
      .style('opacity', 0)
      .call(yAxis);
    
    // Animate axes
    xAxisGroup.transition()
      .duration(800)
      .delay(200)
      .style('opacity', 1);
    
    yAxisGroup.transition()
      .duration(800)
      .delay(300)
      .style('opacity', 1);
    
    // Enhanced grid styling
    svg.selectAll('.x-axis line, .y-axis line')
      .attr('stroke', 'rgba(255, 255, 255, 0.08)')
      .attr('stroke-width', 1);
    
    svg.selectAll('.x-axis text, .y-axis text')
      .attr('fill', '#cbd5e1')
      .attr('font-size', '12px')
      .attr('font-weight', '500');
    
    svg.selectAll('.x-axis path, .y-axis path')
      .attr('stroke', 'rgba(255, 255, 255, 0.2)')
      .attr('stroke-width', 2);
    
    // Enhanced axis labels with animation
    const xLabel = chartGroup.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 45)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', '#e2e8f0')
      .style('opacity', 0)
      .text('Economic Freedom Index');
    
    const yLabel = chartGroup.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', '#e2e8f0')
      .style('opacity', 0)
      .text('GDP Per Capita (USD)');
    
    // Animate labels
    xLabel.transition().duration(800).delay(400).style('opacity', 1);
    yLabel.transition().duration(800).delay(500).style('opacity', 1);
    
    // Enhanced tooltip with improved styling and positioning
    const tooltip = d3.select(tooltipRef.current)
      .style('position', 'fixed')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(30, 41, 59, 0.98)')
      .style('border', 'none')
      .style('padding', '18px')
      .style('border-radius', '16px')
      .style('box-shadow', '0 20px 60px rgba(0, 0, 0, 0.5)')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '13px')
      .style('max-width', '320px')
      .style('backdrop-filter', 'blur(40px)')
      .style('pointer-events', 'none')
      .style('z-index', '9999')
      .style('border', '1px solid rgba(255, 255, 255, 0.15)')
      .style('transform', 'translateZ(0)')
      .style('will-change', 'transform, opacity')
      .style('opacity', 0);
    
    // Enhanced circles with improved animations
    const circles = chartGroup.selectAll('circle')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.economic_freedom))
      .attr('cy', d => yScale(d.gdp_per_capita))
      .attr('r', 0)
      .attr('fill', d => colorScale(d.simplified_political_system))
      .attr('opacity', 0)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2.5)
      .style('cursor', 'pointer')
      .style('filter', 'drop-shadow(0 3px 8px rgba(0,0,0,0.25))')
      .style('touch-action', 'manipulation')
      .on('mouseover', (event, d) => {
        if (!isMobile) {
          d3.select(event.target)
            .transition()
            .duration(200)
            .attr('stroke-width', 4)
            .attr('opacity', 1)
            .style('filter', 'drop-shadow(0 6px 20px rgba(0,0,0,0.4))')
            .attr('r', radiusScale(d.population) * 1.1);
          
          showTooltip(event, d, tooltip, colorScale);
        }
      })
      .on('mousemove', (event, d) => {
        if (!isMobile) {
          updateTooltipPosition(event, tooltip);
        }
      })
      .on('mouseout', (event) => {
        if (!isMobile || activeTooltip === null) {
          d3.select(event.target)
            .transition()
            .duration(300)
            .attr('stroke-width', 2.5)
            .attr('opacity', opacityValue)
            .style('filter', 'drop-shadow(0 3px 8px rgba(0,0,0,0.25))')
            .attr('r', d => radiusScale(d.population));
            
          hideTooltip(tooltip);
          setActiveTooltip(null);
        }
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        
        if (activeTooltip && activeTooltip.country === d.country) {
          hideTooltip(tooltip);
          setActiveTooltip(null);
          
          d3.select(event.target)
            .transition()
            .duration(300)
            .attr('stroke-width', 2.5)
            .attr('opacity', opacityValue)
            .style('filter', 'drop-shadow(0 3px 8px rgba(0,0,0,0.25))')
            .attr('r', radiusScale(d.population));
        } else {
          setActiveTooltip(d);
          
          // Reset all circles
          d3.selectAll('circle')
            .transition()
            .duration(250)
            .attr('stroke-width', 2.5)
            .attr('opacity', opacityValue * 0.7)
            .style('filter', 'drop-shadow(0 3px 8px rgba(0,0,0,0.25))')
            .attr('r', d => radiusScale(d.population));
          
          // Highlight clicked circle
          d3.select(event.target)
            .transition()
            .duration(250)
            .attr('stroke-width', 4)
            .attr('opacity', 1)
            .style('filter', 'drop-shadow(0 6px 20px rgba(0,0,0,0.4))')
            .attr('r', radiusScale(d.population) * 1.1);
          
          showTooltip(event, d, tooltip, colorScale, true);
          updateTooltipPosition(event, tooltip);
        }
      });
    
    // Enhanced circle animation with staggered entrance
    circles
      .transition()
      .duration(600)
      .delay((d, i) => i * 8)
      .ease(d3.easeBackOut.overshoot(0.1))
      .attr('r', d => radiusScale(d.population))
      .attr('opacity', opacityValue);
    
    // Enhanced country labels with better positioning
    if (!isMobile && (searchTerm || filteredData.length < 12)) {
      const labels = chartGroup.selectAll('text.country-label')
        .data(filteredData)
        .enter()
        .append('text')
        .attr('class', 'country-label')
        .attr('x', d => xScale(d.economic_freedom))
        .attr('y', d => yScale(d.gdp_per_capita) - radiusScale(d.population) - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('fill', '#f8fafc')
        .style('pointer-events', 'none')
        .style('text-shadow', '0 1px 3px rgba(0,0,0,0.8)')
        .text(d => d.country.length > 12 ? d.country.substring(0, 9) + '...' : d.country)
        .style('opacity', 0);
      
      labels.transition()
        .duration(800)
        .delay((d, i) => 800 + i * 50)
        .style('opacity', 0.9);
    }
    
    // Enhanced legend with simplified categories
    if (!isMobile) {
      const legendWidth = 170;
      const legendGroup = svg.append('g')
        .attr('transform', `translate(${width - legendWidth - 15}, 45)`)
        .style('opacity', 0);
      
      legendGroup.append('rect')
        .attr('x', -15)
        .attr('y', -25)
        .attr('width', legendWidth)
        .attr('height', 140)
        .attr('fill', 'rgba(30, 41, 59, 0.95)')
        .attr('stroke', 'rgba(255, 255, 255, 0.15)')
        .attr('stroke-width', 1.5)
        .attr('rx', 12)
        .style('backdrop-filter', 'blur(20px)');
      
      legendGroup.append('text')
        .attr('x', 0)
        .attr('y', -5)
        .attr('font-weight', '700')
        .attr('font-size', '14px')
        .attr('fill', '#f8fafc')
        .text('Political Systems');
      
      const simplifiedSystems = ['Monarchies', 'Republics', 'Others'];
      
      simplifiedSystems.forEach((system, i) => {
        const legendRow = legendGroup.append('g')
          .attr('transform', `translate(0, ${i * 25 + 20})`);
        
        legendRow.append('circle')
          .attr('cx', 10)
          .attr('cy', 0)
          .attr('r', 7)
          .attr('fill', colorScale(system))
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2)
          .style('filter', 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))');
        
        legendRow.append('text')
          .attr('x', 25)
          .attr('y', 4)
          .attr('text-anchor', 'start')
          .style('font-size', '12px')
          .style('font-weight', '600')
          .attr('fill', '#e2e8f0')
          .text(system);
      });
      
      // Animate legend
      legendGroup.transition()
        .duration(800)
        .delay(1200)
        .style('opacity', 1);
    }
    
    // Enhanced stats with animation
    const statsGroup = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${height - 20})`)
      .style('opacity', 0);
    
    statsGroup.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', '#94a3b8')
      .text(`${filteredData.length} of ${processedData.length} countries shown`);
    
    if (filteredData.length > 0) {
      const avgGdp = d3.mean(filteredData, d => d.gdp_per_capita);
      
      statsGroup.append('text')
        .attr('x', 200)
        .attr('y', 0)
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .attr('fill', '#94a3b8')
        .text(`Avg GDP: $${avgGdp.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
    }
    
    // Animate stats
    statsGroup.transition()
      .duration(600)
      .delay(1000)
      .style('opacity', 1);
    
  }, [processedData, width, height, selectedSystem, searchTerm, minGdpFilter, maxGdpFilter, colorScale, isMobile, activeTooltip]);
  
  // Helper functions for tooltip management
  const showTooltip = (event, d, tooltip, colorScale, isMobile = false) => {
    tooltip
      .style('visibility', 'visible')
      .transition()
      .duration(200)
      .style('opacity', 1)
      .tween('html', function() {
        return function(t) {
          this.innerHTML = `
            <div style="border-bottom: 2px solid ${colorScale(d.simplified_political_system)}; padding-bottom: 12px; margin-bottom: 14px;">
              <strong style="font-size: 17px; color: #f8fafc; font-weight: 700;">${d.country}</strong>
            </div>
            <div style="display: grid; gap: 10px;">
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
              <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <div style="margin-bottom: 8px;">
                  <span style="color: #94a3b8; font-weight: 500;">Political System:</span><br>
                  <strong style="color: ${colorScale(d.simplified_political_system)}; font-weight: 600; margin-top: 4px; display: block;">${d.simplified_political_system}</strong>
                </div>
                <div style="font-size: 11px; color: #64748b; font-style: italic;">
                  ${d.original_political_system}
                </div>
              </div>
              ${isMobile ? '<div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center;"><small style="color: #64748b; font-style: italic;">Tap elsewhere to close</small></div>' : ''}
            </div>
          `;
        };
      });
  };
  
  const hideTooltip = (tooltip) => {
    tooltip.transition()
      .duration(200)
      .style('opacity', 0)
      .style('visibility', 'hidden');
  };
  
  const updateTooltipPosition = (event, tooltip) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const offset = 20;
    
    let tooltipX = mouseX + offset;
    let tooltipY = mouseY - offset;
    
    if (tooltipX + tooltipWidth > window.innerWidth) {
      tooltipX = mouseX - tooltipWidth - offset;
    }
    
    if (tooltipY + tooltipHeight > window.innerHeight) {
      tooltipY = mouseY - tooltipHeight - offset;
    }
    
    tooltipX = Math.max(15, tooltipX);
    tooltipY = Math.max(15, tooltipY);
    
    tooltip
      .style('top', tooltipY + 'px')
      .style('left', tooltipX + 'px');
  };
  
  // Enhanced resize handling
  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        const containerWidth = container.clientWidth;
        const mobile = containerWidth < 768;
        setIsMobile(mobile);
        
        const newWidth = Math.min(containerWidth, 1200);
        const newHeight = mobile ? Math.max(newWidth * 0.75, 400) : Math.max(newWidth * 0.5, 500);
        
        setWidth(newWidth);
        setHeight(newHeight);
      }
    };
    
    handleResize();
    const debouncedResize = debounce(handleResize, 150);
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);
  
  // Utility function for debouncing
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  // Calculate enhanced statistics
  const maxGdp = Math.ceil(d3.max(processedData, d => d.gdp_per_capita) / 10000) * 10000;
  const totalCountries = processedData.length;
  const totalPopulation = d3.sum(processedData, d => d.population);
  
  return (
    <Box>
      {/* Enhanced Statistics Cards with animations */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 3, 
              border: '1px solid rgba(56, 189, 248, 0.2)',
              background: 'rgba(30, 41, 59, 0.7)',
              backdropFilter: 'blur(24px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px) scale(1.02)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                boxShadow: '0 20px 40px rgba(56, 189, 248, 0.1)',
              }
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(56, 189, 248, 0.2)',
                  mr: 2 
                }}>
                  <PublicIcon sx={{ color: '#38bdf8', fontSize: 22 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#38bdf8', lineHeight: 1 }}>
                    {totalCountries}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
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
              borderRadius: 3, 
              border: '1px solid rgba(139, 92, 246, 0.2)',
              background: 'rgba(30, 41, 59, 0.7)',
              backdropFilter: 'blur(24px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px) scale(1.02)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.1)',
              }
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  mr: 2 
                }}>
                  <TrendingUpIcon sx={{ color: '#8b5cf6', fontSize: 22 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#8b5cf6', lineHeight: 1 }}>
                    3
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
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
              borderRadius: 3, 
              border: '1px solid rgba(245, 158, 11, 0.2)',
              background: 'rgba(30, 41, 59, 0.7)',
              backdropFilter: 'blur(24px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px) scale(1.02)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                boxShadow: '0 20px 40px rgba(245, 158, 11, 0.1)',
              }
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  mr: 2 
                }}>
                  <PeopleIcon sx={{ color: '#f59e0b', fontSize: 22 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>
                    {(totalPopulation / 1e9).toFixed(1)}B
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
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
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(24px)',
          mb: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <svg ref={svgRef} style={{ width: '100%', height: 'auto', display: 'block' }}></svg>
        <div ref={tooltipRef}></div>
        
        {/* Enhanced Mobile Legend */}
        {isMobile && (
          <Box sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.7)' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#f8fafc' }}>
              Political Systems
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {['Monarchies', 'Republics', 'Others'].map((system) => (
                <Chip
                  key={system}
                  label={system}
                  size="medium"
                  sx={{
                    backgroundColor: colorScale(system),
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
      
      {/* Enhanced Instructions */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 3,
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          backdropFilter: 'blur(24px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            border: '1px solid rgba(56, 189, 248, 0.3)',
          }
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#38bdf8' }}>
          📊 How to Read This Visualization
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem', mb: 1, fontWeight: 500 }}>
              <strong>Circle Size:</strong> Population (larger = more people)
            </Typography>
            <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem', mb: 1, fontWeight: 500 }}>
              <strong>Y-Axis:</strong> GDP Per Capita (higher = wealthier)
            </Typography>
            {isMobile && (
              <Typography variant="body2" sx={{ color: '#38bdf8', fontSize: '0.85rem', fontStyle: 'italic', fontWeight: 600 }}>
                <strong>📱 Tap any dot</strong> to see country details
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem', mb: 1, fontWeight: 500 }}>
              <strong>X-Axis:</strong> Economic Freedom (higher = more freedom)
            </Typography>
            <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem', mb: 1, fontWeight: 500 }}>
              <strong>Colors:</strong> Political system categories
            </Typography>
            {!isMobile && (
              <Typography variant="body2" sx={{ color: '#38bdf8', fontSize: '0.85rem', fontStyle: 'italic', fontWeight: 600 }}>
                <strong>🖱️ Hover any dot</strong> to see country details
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CountryVisualization;
