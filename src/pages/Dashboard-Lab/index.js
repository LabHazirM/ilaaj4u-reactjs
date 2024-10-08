import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Input,
} from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

//import Charts
import StackedColumnChart from "./StackedColumnChart";

//import action
import { getChartsData } from "../../store/actions";

// Pages Components
import LabSummary from "./LabSummary";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//i18n
import { withTranslation } from "react-i18next";
import classNames from "classnames";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: [
        { title: "Week", linkto: "#", isActive: false },
        { title: "Month", linkto: "#", isActive: false },
        { title: "Year", linkto: "#", isActive: true },
      ],
      modal: false,
      subscribemodal: false,
      chartSeries: [],
      periodType: "yearly",
    };

    this.togglemodal.bind(this);
  }

  componentDidMount() {
    const { onGetChartsData } = this.props;
    setTimeout(() => this.setState({ subscribemodal: true }), 2000);
    onGetChartsData("yearly");
  }

  togglemodal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  togglesubscribemodal = () => {
    this.setState(prevState => ({
      subscribemodal: !prevState.subscribemodal,
    }));
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ ...this.state, chartSeries: this.props.chartsData });
    }
  }

  render() {
    const userId = localStorage.getItem("authUser")
    ? JSON.parse(localStorage.getItem("authUser")).user_id
    : "";
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Dashboard | Lab</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs
              title={this.props.t("Dashboards")}
              breadcrumbItem={this.props.t("Dashboard")}
            />
            <Row>
              <LabSummary />

              <Col xl="12">
                <Card>
                  <CardBody>
                    <div className="d-sm-flex flex-wrap">
                      {/* <CardTitle className="card-title mb-4 h4">
                        Email Sent
                      </CardTitle> */}
                    </div>
                    <div className="clearfix" />
                    <StackedColumnChart user_id={userId} />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

const mapStateToProps = ({ Dashboard }) => ({
  chartsData: Dashboard.chartsData,
});

const mapDispatchToProps = dispatch => ({
  onGetChartsData: periodType => dispatch(getChartsData(periodType)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Dashboard));
