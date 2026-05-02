import React, { useEffect, useState } from 'react';
import { COLORS } from '../constants/colors';
import { trackChartViewed } from '../firebase';

const ElectionCharts = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadCharts = () => {
      if (window.google) {
        window.google.charts.load('current', { packages: ['corechart', 'bar', 'geochart'] });
        window.google.charts.setOnLoadCallback(() => {
          setIsLoaded(true);
          drawCharts();
        });
      }
    };

    const drawCharts = () => {
      if (!window.google || !window.google.visualization) return;

      // CHART 1 — Donut Chart
      const drawSeats = () => {
        const data = window.google.visualization.arrayToDataTable([
          ['Alliance', 'Seats'],
          ['BJP Alliance (NDA)', 293],
          ['Congress Alliance (INDIA)', 234],
          ['Others', 16]
        ]);

        const options = {
          title: '2024 Lok Sabha Seat Distribution',
          pieHole: 0.4,
          colors: ['#FF6B00', '#0047AB', '#138808'],
          chartArea: { width: '90%', height: '80%' },
          legend: { position: 'bottom' },
          backgroundColor: 'transparent',
          titleTextStyle: { fontSize: 16, fontFamily: COLORS.fonts.heading }
        };

        const chart = new window.google.visualization.PieChart(document.getElementById('chart_seats'));
        chart.draw(data, options);
        trackChartViewed('seat_distribution');
      };

      // CHART 2 — Column Chart
      const drawTurnout = () => {
        const data = window.google.visualization.arrayToDataTable([
          ['Phase', 'Turnout %', { role: 'style' }],
          ['Phase 1', 66.14, '#FF6B00'],
          ['Phase 2', 66.71, '#FF6B00'],
          ['Phase 3', 65.68, '#FF6B00'],
          ['Phase 4', 69.16, '#FF6B00'],
          ['Phase 5', 62.20, '#FF6B00'],
          ['Phase 6', 63.37, '#FF6B00'],
          ['Phase 7', 57.48, '#FF6B00']
        ]);

        const options = {
          title: 'Voter Turnout by Phase — 2024 Elections',
          vAxis: { title: 'Turnout %', minValue: 0 },
          hAxis: { title: 'Election Phase' },
          legend: { position: 'none' },
          backgroundColor: 'transparent',
          titleTextStyle: { fontSize: 16, fontFamily: COLORS.fonts.heading }
        };

        const chart = new window.google.visualization.ColumnChart(document.getElementById('chart_turnout'));
        chart.draw(data, options);
        trackChartViewed('voter_turnout_2024');
      };

      // CHART 3 — Line Chart
      const drawHistory = () => {
        const data = window.google.visualization.arrayToDataTable([
          ['Year', 'Turnout %'],
          ['2004', 58.07],
          ['2009', 58.19],
          ['2014', 66.44],
          ['2019', 67.40],
          ['2024', 65.79]
        ]);

        const options = {
          title: 'Historical Voter Turnout 2004–2024',
          colors: ['#FF6B00'],
          pointSize: 6,
          vAxis: { title: 'Turnout %' },
          hAxis: { title: 'Year', format: '####' },
          legend: { position: 'none' },
          backgroundColor: 'transparent',
          titleTextStyle: { fontSize: 16, fontFamily: COLORS.fonts.heading }
        };

        const chart = new window.google.visualization.LineChart(document.getElementById('chart_history'));
        chart.draw(data, options);
        trackChartViewed('historical_turnout');
      };

      // CHART 4 — Bar Chart
      const drawStates = () => {
        const data = window.google.visualization.arrayToDataTable([
          ['State', 'Seats', { role: 'style' }],
          ['Uttar Pradesh', 80, COLORS.saffron],
          ['Maharashtra', 48, COLORS.navy],
          ['West Bengal', 42, COLORS.saffron],
          ['Bihar', 40, COLORS.navy],
          ['Tamil Nadu', 39, COLORS.saffron],
          ['Madhya Pradesh', 29, COLORS.navy],
          ['Rajasthan', 25, COLORS.saffron],
          ['Karnataka', 28, COLORS.navy],
          ['Gujarat', 26, COLORS.saffron],
          ['Andhra Pradesh', 25, COLORS.navy]
        ]);

        const options = {
          title: 'Lok Sabha Seats by Top 10 States',
          chartArea: { width: '50%' },
          hAxis: { title: 'Total Seats', minValue: 0 },
          vAxis: { title: 'State' },
          legend: { position: 'none' },
          backgroundColor: 'transparent',
          titleTextStyle: { fontSize: 16, fontFamily: COLORS.fonts.heading }
        };

        const chart = new window.google.visualization.BarChart(document.getElementById('chart_states'));
        chart.draw(data, options);
        trackChartViewed('seats_by_state');
      };

      drawSeats();
      drawTurnout();
      drawHistory();
      drawStates();
    };

    if (window.google) {
      loadCharts();
    }

    const handleResize = () => {
      drawCharts();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  const titleStyle = {
    fontFamily: COLORS.fonts.heading,
    fontSize: '20px',
    color: COLORS.navy,
    margin: 0
  };

  const subStyle = {
    fontSize: '14px',
    color: COLORS.textMuted,
    margin: 0
  };

  return (
    <section style={{ marginTop: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontFamily: COLORS.fonts.heading, fontSize: '32px', color: COLORS.navy, margin: '0 0 8px 0' }}>
          📊 Indian Election Statistics
        </h2>
        <p style={{ color: COLORS.textMuted, fontSize: '18px', margin: 0 }}>
          Data Visualization powered by Google Charts 🔵
        </p>
      </div>

      {!isLoaded && (
        <div style={{ textAlign: 'center', padding: '40px', color: COLORS.navyLight }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>📊</div>
          Loading charts...
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: window.innerWidth > 900 ? '1fr 1fr' : '1fr', 
        gap: '24px',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.5s'
      }}>
        <div style={cardStyle}>
          <div id="chart_seats" style={{ width: '100%', height: '300px' }}></div>
          <p style={subStyle}>Distribution of the 543 elected seats in the 2024 general election.</p>
        </div>

        <div style={cardStyle}>
          <div id="chart_turnout" style={{ width: '100%', height: '300px' }}></div>
          <p style={subStyle}>Voter turnout percentage across all seven phases of the 2024 elections.</p>
        </div>

        <div style={cardStyle}>
          <div id="chart_history" style={{ width: '100%', height: '300px' }}></div>
          <p style={subStyle}>Comparison of voter turnout percentages over the last two decades.</p>
        </div>

        <div style={cardStyle}>
          <div id="chart_states" style={{ width: '100%', height: '350px' }}></div>
          <p style={subStyle}>Representation of states with the highest number of Lok Sabha seats.</p>
        </div>
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '24px', 
        padding: '16px', 
        fontSize: '12px', 
        color: COLORS.textMuted,
        borderTop: `1px solid ${COLORS.border}`
      }}>
        📊 All charts powered by Google Charts API · No API key required — 100% free service
      </div>
    </section>
  );
};

export default ElectionCharts;
