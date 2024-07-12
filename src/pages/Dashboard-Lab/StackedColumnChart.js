import React, { Component } from "react";
import PropTypes from 'prop-types';
import ReactApexChart from "react-apexcharts";

class StackedColumnChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          stacked: true,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: true,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "15%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [], // This will be updated with the statuses
        },
        yaxis: {
          title: {
            text: 'Number of Appointments',
          }
        },
        colors: ["#556ee6", "#f1b44c", "#34c38f", "#ff0000", "#00ff00"], // Add more colors as needed
        legend: {
          position: "bottom",
        },
        fill: {
          opacity: 1,
        },
      },
      series: [{
        name: 'Appointments',
        data: [] // This will be updated with the count of appointments
      }],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetch('http://127.0.0.1:8000/api/patient/ForChartCalculation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test_id: '54' }), // Use the provided test ID
    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data); // Log the fetched data

        // Ensure the data is in the correct format
        const categories = data.categories || [];
        const seriesData = data.data || [];

        // Update state
        this.setState({
          options: {
            ...this.state.options,
            xaxis: {
              ...this.state.options.xaxis,
              categories: categories,
            },
          },
          series: [{
            name: 'Appointments',
            data: seriesData,
          }],
        });

        console.log('Updated state:', this.state); // Log the updated state
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  render() {
    return (
      <React.Fragment>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height="360"
          className="apex-charts"
        />
      </React.Fragment>
    );
  }
}

StackedColumnChart.propTypes = {
  chartSeries: PropTypes.any,
  periodData: PropTypes.any
}

export default StackedColumnChart;
