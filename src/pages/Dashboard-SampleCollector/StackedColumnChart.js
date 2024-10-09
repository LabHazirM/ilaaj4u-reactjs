import React, { Component } from "react"
import PropTypes from 'prop-types';
import ReactApexChart from "react-apexcharts"

class StackedColumnChart extends Component {
  constructor(props) {
    super(props)

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
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },
        colors: ["#556ee6", "#f1b44c", "#34c38f"],
        legend: {
          position: "bottom",
        },
        fill: {
          opacity: 1,
        },
      },
      series: [{
        name: 'Appointments',
        data: []
      }],
      selectedPeriod: 'monthly', // default period
    };
  }

  componentDidMount() {
    // Pass the user_id to fetchData if needed
    this.fetchData(this.state.selectedPeriod, this.props.user_id);
  }

  fetchData = (period, labId) => {
    fetch('https://labhazirapi.com/api/patient/ForSampleCollectorChartCalculation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: labId }), // Use the provided lab ID
    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);

        // Check if the period exists in the response
        const categories = data[period]?.categories || [];
        const seriesData = data[period]?.data || [];

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
        }, () => {
          console.log('Updated state:', this.state);
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  handlePeriodChange = (newPeriod) => {
    this.setState({ selectedPeriod: newPeriod }, () => {
      this.fetchData(newPeriod, this.props.user_id); // Fetch data for the newly selected period
    });
  };

  render() {
    return (
      <React.Fragment>
        <ReactApexChart
          options={this.state.options}
          series={this.props.chartSeries || []}
          type="bar"
          height="360"
          className="apex-charts"
        />
      </React.Fragment>
    )
  }
}

StackedColumnChart.propTypes = {
  chartSeries: PropTypes.any,
  periodData: PropTypes.any
}
export default StackedColumnChart
