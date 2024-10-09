import React, { Component } from "react";
import PropTypes from 'prop-types';
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom"; // Import Link for navigation
import classNames from "classnames"; // Import classNames for conditional classNames

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
          categories: [],
        },
        yaxis: {
          title: {
            text: 'Number of Appointments',
          }
        },
        colors: ["#556ee6", "#f1b44c", "#34c38f", "#ff0000", "#00ff00"],
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
    console.log('Rendering data:', this.state.series);

    return (
      <React.Fragment>
        <div className="d-flex justify-content-end">
          <ul className="nav nav-pills">
            <li className="nav-item">
              <Link
                to="#"
                className={classNames(
                  { active: this.state.selectedPeriod === "weekly" },
                  "nav-link"
                )}
                onClick={() => this.handlePeriodChange('weekly')}
                id="one_month"
              >
                Week
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="#"
                className={classNames(
                  { active: this.state.selectedPeriod === "monthly" },
                  "nav-link"
                )}
                onClick={() => this.handlePeriodChange('monthly')}
                id="one_month"
              >
                Month
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="#"
                className={classNames(
                  { active: this.state.selectedPeriod === "yearly" },
                  "nav-link"
                )}
                onClick={() => this.handlePeriodChange('yearly')}
                id="one_month"
              >
                Year
              </Link>
            </li>
          </ul>
        </div>

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
  user_id: PropTypes.string.isRequired, // Add this line to validate user_id prop
  chartSeries: PropTypes.any,
  periodData: PropTypes.any
};

export default StackedColumnChart;
