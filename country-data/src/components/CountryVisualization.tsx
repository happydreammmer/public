import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { 
  Box, 
  Typography, 
  Paper
} from '@mui/material';
import FilterPanel from './FilterPanel';

interface CountryData {
  country: string;
  gdp_per_capita: number;
  population: number;
  economic_freedom: number;
  political_system: string;
}

interface ProcessedCountryData extends CountryData {
  simplified_political_system: string;
  original_political_system: string;
}

interface CountryVisualizationProps {
  data: CountryData[];
}

const CountryVisualization: React.FC<CountryVisualizationProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(700); // was 900
  const [height, setHeight] = useState<number>(380); // was 500
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedSystem, setSelectedSystem] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minGdpFilter, setMinGdpFilter] = useState<number>(0);
  const [maxGdpFilter, setMaxGdpFilter] = useState<number>(Infinity);
  const [activeTooltip, setActiveTooltip] = useState<ProcessedCountryData | null>(null);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [lastInteractionTime, setLastInteractionTime] = useState<number>(0);
  
  // Enhanced opacity for better visibility
  const opacityValue = 0.9;
  
  // Function to categorize political systems into simplified categories
  const categorizePoliticalSystem = (system: string): string => {
    const systemLower = system.toLowerCase();
    
    // One Party Communism
    if (systemLower.includes('one party communism')) {
      return 'One Party Communism';
    }
    
    // Theocracy
    if (systemLower.includes('theocracy')) {
      return 'Theocracy';
    }
    
    // No Government
    if (systemLower.includes('no government')) {
      return 'No Government';
    }
    
    // Monarchies (all types of monarchies)
    if (systemLower.includes('monarchy') || 
        systemLower.includes('monarch') ||
        systemLower.includes('kingdom') ||
        systemLower.includes('co-principality')) {
      return 'Monarchies';
    }
    
    // Republics (all types of republics, democracies, and other democratic systems)
    // Note: Be specific to avoid catching monarchies that also have these terms
    if (systemLower.includes('republic') ||
        systemLower.includes('democracy')) {
      return 'Republics';
    }
    
    // Default fallback - should not be reached with proper categorization
    return 'Republics';
  };
  
  // Process data with simplified political systems
  const processedData: ProcessedCountryData[] = data.map(d => ({
    ...d,
    simplified_political_system: categorizePoliticalSystem(d.political_system),
    original_political_system: d.political_system
  }));
  
  // Extract simplified political systems for filtering
  const politicalSystems = ['All', 'Monarchies', 'Republics', 'One Party Communism', 'Theocracy', 'No Government'];
  
  // Refined color palette with better contrast and accessibility
  const colorScale = d3.scaleOrdinal<string>()
    .domain(['Monarchies', 'Republics', 'One Party Communism', 'Theocracy', 'No Government'])
    .range(['#8b5cf6', '#22c55e', '#dc2626', '#f59e0b', '#6b7280']);
  
  const showTooltip = useCallback((event: MouseEvent, d: ProcessedCountryData, tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>, colorScale: d3.ScaleOrdinal<string, unknown>) => {
    const pinIndicator = isPinned && isMobile ? 
      `<div style="display: flex; align-items: center; justify-content: center; background: rgba(34, 197, 94, 0.2); color: #22c55e; padding: 4px 8px; border-radius: 12px; font-size: 10px; margin-bottom: 8px; border: 1px solid rgba(34, 197, 94, 0.3);">
        📌 Pinned - Tap again to unpin
      </div>` : '';
    
    tooltip
      .style('visibility', 'visible')
      .style('opacity', 1)
      .html(`
        <div style="padding: 12px; font-family: 'Inter', sans-serif;">
          ${pinIndicator}
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${colorScale(d.simplified_political_system)}; margin-right: 8px;"></div>
            <strong style="font-size: 1.1rem; color: #f8fafc;">${d.country}</strong>
          </div>
          <p style="margin: 4px 0; color: #cbd5e1;"><strong style="color: #94a3b8;">GDP/Capita:</strong> $${d.gdp_per_capita.toLocaleString()}</p>
          <p style="margin: 4px 0; color: #cbd5e1;"><strong style="color: #94a3b8;">Population:</strong> ${d.population.toLocaleString()}</p>
          <p style="margin: 4px 0; color: #cbd5e1;"><strong style="color: #94a3b8;">Freedom Index:</strong> ${d.economic_freedom.toFixed(1)}</p>
          <p style="margin: 4px 0; color: #cbd5e1;"><strong style="color: #94a3b8;">Political System:</strong> ${d.original_political_system}</p>
          ${isMobile && !isPinned ? '<p style="margin: 8px 0 0 0; color: #64748b; font-size: 11px; text-align: center;">💡 Tap to pin this tooltip</p>' : ''}
        </div>
      `);
    updateTooltipPosition(event, tooltip);
  }, [isPinned, isMobile]);
  
  useEffect(() => {
    if (!svgRef.current) return;
    // Filter data based on selected political system and search term
    let filteredData: ProcessedCountryData[] = processedData;
    
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
      d.gdp_per_capita <= (maxGdpFilter === Infinity ? d3.max(processedData, d => d.gdp_per_capita)! : maxGdpFilter)
    );
    
    // Clear previous visualization with smooth transition
    d3.select(svgRef.current).selectAll('*')
      .transition()
      .duration(300)
      .style('opacity', 0)
      .remove();
    
    // Create SVG with optimized margins and proper spacing
    const margin = { top: 25, right: isMobile ? 25 : 60, bottom: isMobile ? 90 : 80, left: isMobile ? 70 : 90 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .on('click', (event) => {
        // Only handle clicks outside the chart area
        const [clickX, clickY] = d3.pointer(event, svg.node());
        if (clickX < margin.left || clickX > width - margin.right || 
            clickY < margin.top || clickY > height - margin.bottom) {
          // Click outside chart area - reset everything
          setIsPinned(false);
          setActiveTooltip(null);
          hideTooltipGlobal();
          resetHighlightingGlobal();
        }
      });
    
    // Global helper functions for SVG click handler
    function hideTooltipGlobal() {
      if (tooltipRef.current) {
        d3.select(tooltipRef.current).transition()
          .duration(200)
          .style('opacity', 0)
          .style('visibility', 'hidden');
      }
    }
    
    function resetHighlightingGlobal() {
      d3.selectAll('circle')
        .transition()
        .duration(300)
        .delay((_d, i) => i * 5)
        .attr('stroke-width', 2)
        .attr('opacity', opacityValue)
        .style('filter', 'drop-shadow(0 3px 8px rgba(0,0,0,0.25))');
    }
    
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
    
    // Enhanced scales with domain starting from 0
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.economic_freedom)! * 1.02])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.gdp_per_capita)! * 1.05])
      .range([innerHeight, 0]);
    
    // Enhanced radius scale with better handling of edge cases
    const maxPopulation = d3.max(processedData, d => d.population) || 1000000;
    const minPopulation = d3.min(processedData, d => d.population) || 1000;
    
    const radiusScale = d3.scaleSqrt()
      .domain([minPopulation, maxPopulation])
      .range([isMobile ? 6 : 8, isMobile ? 18 : 28])
      .clamp(true); // Ensure values stay within range
    
    // Enhanced axes with better styling
    const xAxis = d3.axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickFormat(d3.format('.0f'))
      .ticks(8);
    
    const yAxis = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat(d => {
        if (d === 0) return '$0';
        if (Number(d) >= 1000000) return `$${(Number(d) / 1000000).toFixed(Number(d) % 1000000 === 0 ? 0 : 1)}M`;
        if (Number(d) >= 1000) return `$${(Number(d) / 1000).toFixed(Number(d) % 1000 === 0 ? 0 : 1)}k`;
        return `$${d.toLocaleString()}`;
      })
      .ticks(6);
    
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
    
    // Y-axis label only (X-axis label is handled separately below)
    const yLabel = chartGroup.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', '#e2e8f0')
      .style('opacity', 0)
      .text('GDP per Capita (USD)');
    
    // Animate Y label
    yLabel.transition().duration(800).delay(500).style('opacity', 1);
    
    // Create a clipping path to prevent circles from overflowing
    chartGroup.append('clipPath')
        .attr('id', 'chart-area')
        .append('rect')
        .attr('width', innerWidth)
        .attr('height', innerHeight);

    // Main data visualization group
    const circlesGroup = chartGroup.append('g')
        .attr('clip-path', 'url(#chart-area)');
    
    // Enhanced interaction overlay with comprehensive touch and mouse support
    const hoverOverlay = chartGroup.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('pointer-events', 'all')
      .style('touch-action', 'none') // Prevent default touch behaviors
      .on('mousemove', handleInteraction)
      .on('touchmove', handleInteraction)
      .on('click', handleClickTap)
      .on('touchstart', handleClickTap)
      .on('mouseleave', handleLeave)
      .on('touchend', function(event) {
        // For touch devices, delay hiding to allow for tap interactions
        if (!isPinned) {
          setTimeout(() => handleLeave(event), 100);
        }
      });
    
    // Debounced interaction handler
    function handleInteraction(event: any) {
      const currentTime = Date.now();
      
      // Debounce rapid interactions (16ms = ~60fps)
      if (currentTime - lastInteractionTime < 16) return;
      setLastInteractionTime(currentTime);
      
      // Skip if tooltip is pinned (mobile)
      if (isPinned && isMobile) return;
      
      const [mouseX, mouseY] = d3.pointer(event, hoverOverlay.node());
      const closestCountry = findClosestCountry(mouseX, mouseY);
      
      if (closestCountry) {
        showCountryTooltip(event, closestCountry);
        highlightCountry(closestCountry);
        setActiveTooltip(closestCountry);
      } else {
        hideTooltip();
        resetHighlighting();
        setActiveTooltip(null);
      }
    }
    
    // Click/Tap handler for mobile and desktop
    function handleClickTap(event: any) {
      event.preventDefault();
      event.stopPropagation();
      
      const [mouseX, mouseY] = d3.pointer(event, hoverOverlay.node());
      const closestCountry = findClosestCountry(mouseX, mouseY);
      
      if (closestCountry) {
        if (isMobile) {
          // On mobile, toggle pin state
          if (isPinned && activeTooltip?.country === closestCountry.country) {
            // Unpin if clicking same country
            setIsPinned(false);
            hideTooltip();
            resetHighlighting();
            setActiveTooltip(null);
          } else {
            // Pin new country
            setIsPinned(true);
            showCountryTooltip(event, closestCountry);
            highlightCountry(closestCountry);
            setActiveTooltip(closestCountry);
          }
        } else {
          // On desktop, just show tooltip
          showCountryTooltip(event, closestCountry);
          highlightCountry(closestCountry);
          setActiveTooltip(closestCountry);
        }
      } else if (isMobile && isPinned) {
        // Clicking empty space on mobile unpins tooltip
        setIsPinned(false);
        hideTooltip();
        resetHighlighting();
        setActiveTooltip(null);
      }
    }
    
    // Leave handler
    function handleLeave(event: any) {
      // Don't hide if pinned on mobile
      if (isPinned && isMobile) return;
      
      hideTooltip();
      resetHighlighting();
      setActiveTooltip(null);
    }
    
    // Helper function to find closest country
    function findClosestCountry(mouseX: number, mouseY: number): ProcessedCountryData | null {
      let closestCountry: ProcessedCountryData | null = null;
      let minDistance = Infinity;
      const hoverRadius = isMobile ? 35 : 25; // Larger radius on mobile for better touch targets
      
      filteredData.forEach(d => {
        const x = xScale(d.economic_freedom);
        const y = yScale(d.gdp_per_capita);
        const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2));
        
        if (distance < hoverRadius && distance < minDistance) {
          minDistance = distance;
          closestCountry = d;
        }
      });
      
      return closestCountry;
    }
    
    // Helper function to show tooltip
    function showCountryTooltip(event: any, country: ProcessedCountryData) {
      if (tooltipRef.current) {
        showTooltip(event, country, d3.select(tooltipRef.current), colorScale);
      }
    }
    
    // Helper function to hide tooltip
    function hideTooltip() {
      if (tooltipRef.current) {
        d3.select(tooltipRef.current)
          .transition()
          .duration(200)
          .style('opacity', 0)
          .style('visibility', 'hidden');
      }
    }
    
    // Helper function to highlight country
    function highlightCountry(country: ProcessedCountryData) {
      // Cancel any existing transitions to prevent stacking
      circlesGroup.selectAll('circle').interrupt();
      
      circlesGroup.selectAll('circle')
        .transition()
        .duration(100)
        .attr('stroke-width', (d: ProcessedCountryData) => d.country === country.country ? 4 : 2)
        .attr('opacity', (d: ProcessedCountryData) => d.country === country.country ? 1 : opacityValue * 0.7)
        .style('filter', (d: ProcessedCountryData) => 
          d.country === country.country ? 
          'drop-shadow(0 5px 15px rgba(0,0,0,0.4))' : 
          'drop-shadow(0 3px 8px rgba(0,0,0,0.25))'
        );
    }
    
    // Helper function to reset highlighting
    function resetHighlighting() {
      // Cancel any existing transitions to prevent stacking
      circlesGroup.selectAll('circle').interrupt();
      
      circlesGroup.selectAll('circle')
        .transition()
        .duration(200)
        .attr('stroke-width', 2)
        .attr('opacity', opacityValue)
        .style('filter', 'drop-shadow(0 3px 8px rgba(0,0,0,0.25))');
    }
    
    // Draw circles with enhanced styling and enter/exit animations
    circlesGroup.selectAll<SVGCircleElement, ProcessedCountryData>('circle')
      .data(filteredData, d => d.country)
      .join(
        enter => enter.append('circle')
          .attr('cx', d => xScale(d.economic_freedom))
          .attr('cy', d => yScale(d.gdp_per_capita))
          .attr('r', 0)
          .style('opacity', 0)
          .attr('fill', d => colorScale(d.simplified_political_system) as string)
          .attr('stroke', 'rgba(255,255,255,0.4)')
          .attr('stroke-width', 2)
          .style('filter', 'drop-shadow(0 3px 8px rgba(0,0,0,0.25))')
          .call(enter => enter.transition()
            .duration(800)
            .delay((_d, i) => i * 8)
            .attr('r', d => radiusScale(d.population))
            .style('opacity', opacityValue)
          ),
        update => update
          .call(update => update.transition()
            .duration(600)
            .attr('cx', d => xScale(d.economic_freedom))
            .attr('cy', d => yScale(d.gdp_per_capita))
            .attr('r', d => radiusScale(d.population))
            .attr('fill', d => colorScale(d.simplified_political_system) as string)
          ),
        exit => exit
          .call(exit => exit.transition()
            .duration(400)
            .attr('r', 0)
            .style('opacity', 0)
            .remove()
          )
      )
      .style('pointer-events', 'none'); // Disable pointer events on individual circles

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
    
    // No legend - chart takes full width
    
    // Enhanced axis label - Economic Freedom Index with better positioning
    const axisLabelGroup = svg.append('g')
      .attr('transform', `translate(${margin.left + innerWidth / 2}, ${height - (isMobile ? 65 : 55)})`)
      .style('opacity', 0);
    
    axisLabelGroup.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? '12px' : '14px')
      .attr('font-weight', '600')
      .attr('fill', '#e2e8f0')
      .text('Economic Freedom Index');
    
    // Enhanced stats with better positioning and spacing
    const statsGroup = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${height - (isMobile ? 40 : 30)})`)
      .style('opacity', 0);
    
    // Country count text
    statsGroup.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('font-size', isMobile ? '11px' : '12px')
      .attr('font-weight', '600')
      .attr('fill', '#94a3b8')
      .text(`${filteredData.length} of ${processedData.length} countries shown`);
    
    if (filteredData.length > 0) {
      const avgGdp = d3.mean(filteredData, d => d.gdp_per_capita);
      
      if (typeof avgGdp === 'number') {
        // Responsive positioning for average GDP text with proper spacing
        const avgGdpText = `Avg GDP: $${avgGdp.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
        
        if (isMobile) {
          // On mobile, place on next line
          statsGroup.append('text')
            .attr('x', 0)
            .attr('y', 16)
            .attr('font-size', '11px')
            .attr('font-weight', '600')
            .attr('fill', '#94a3b8')
            .text(avgGdpText);
        } else {
          // On desktop, place side by side with more spacing
          statsGroup.append('text')
            .attr('x', Math.min(350, innerWidth - 120)) // More spacing from left text
            .attr('y', 0)
            .attr('font-size', '12px')
            .attr('font-weight', '600')
            .attr('fill', '#94a3b8')
            .text(avgGdpText);
        }
      }
    }
    
    // Animate axis label and stats
    axisLabelGroup.transition()
      .duration(600)
      .delay(1000)
      .style('opacity', 1);
      
    statsGroup.transition()
      .duration(600)
      .delay(1100)
      .style('opacity', 1);
    
  }, [processedData, width, height, isMobile, selectedSystem, searchTerm, minGdpFilter, maxGdpFilter, activeTooltip, isPinned, lastInteractionTime, colorScale, showTooltip]);
  
  // Helper functions for tooltip management
  
  const updateTooltipPosition = (event: MouseEvent, tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>) => {
    const tooltipNode = tooltip.node();
    const containerNode = containerRef.current;

    if (tooltipNode && containerNode) {
      const containerRect = containerNode.getBoundingClientRect();
      const mouseX = event.clientX - containerRect.left;
      const mouseY = event.clientY - containerRect.top;
      
      const tooltipWidth = tooltipNode.offsetWidth;
      const tooltipHeight = tooltipNode.offsetHeight;
      
      // Smart positioning to keep tooltip within container bounds
      let xOffset = 15;
      let yOffset = -tooltipHeight - 15;
      
      if (mouseX + tooltipWidth + 15 > containerRect.width) {
        xOffset = -tooltipWidth - 15;
      }
      
      if (mouseY - tooltipHeight - 15 < 0) {
        yOffset = 15;
      }

      tooltip
        .style('left', `${mouseX + xOffset}px`)
        .style('top', `${mouseY + yOffset}px`);
    }
  };
  
  // Handle window resize with debouncing
  useEffect(() => {
    // Debounce function
    const debounce = (func: () => void, wait: number) => {
      let timeout: NodeJS.Timeout;
      return function executedFunction(...args: []) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setWidth(container.clientWidth);
        setHeight(container.clientWidth * 0.6); // Maintain aspect ratio
        setIsMobile(container.clientWidth < 768);
      }
    };

    const debouncedResize = debounce(handleResize, 200);

    window.addEventListener('resize', debouncedResize);
    handleResize(); // Initial size

    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  return (
    <Paper 
      elevation={3} 
      ref={containerRef}
      sx={{ 
        p: { xs: 1, sm: 2, md: 3 },
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(30, 41, 59, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        mb: 3
      }}
    >
      <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, pt: { xs: 1, sm: 2, md: 3 }, pb: 0 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Country Data Visualization
        </Typography>
      </Box>
      <FilterPanel 
        politicalSystems={politicalSystems}
        selectedSystem={selectedSystem}
        setSelectedSystem={setSelectedSystem}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        minGdpFilter={minGdpFilter}
        maxGdpFilter={maxGdpFilter}
        setMinGdpFilter={setMinGdpFilter}
        setMaxGdpFilter={setMaxGdpFilter}
      />
      <svg ref={svgRef}></svg>
      
      {/* Custom tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          visibility: 'hidden',
          opacity: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          border: isPinned ? '2px solid rgba(34, 197, 94, 0.7)' : '1px solid rgba(56, 189, 248, 0.5)',
          borderRadius: '8px',
          backdropFilter: 'blur(12px)',
          boxShadow: isPinned ? '0 12px 40px rgba(34, 197, 94, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.4)',
          fontSize: '14px',
          fontWeight: 500,
          zIndex: 1000,
          maxWidth: '280px',
          transition: 'all 0.15s ease-out'
        }}
      />
      
      {/* Mobile instruction overlay */}
      {isMobile && !isPinned && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.9)',
          color: '#cbd5e1',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 999,
          pointerEvents: 'none',
          opacity: activeTooltip ? 0 : 0.7,
          transition: 'opacity 0.3s ease'
        }}>
          💡 Tap a country dot to pin tooltip
        </div>
      )}
    </Paper>
  );
};

export default CountryVisualization;
