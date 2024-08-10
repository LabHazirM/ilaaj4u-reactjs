import React, { Component, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { any } from "prop-types";
import { withRouter, Link } from "react-router-dom";
import {
  Alert,
  Card,
  CardBody,
  Col,
  Table,
  Container,
  Input,
  Label,
  Modal,
  Row,
  Button,
  ModalBody,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { isEmpty, map } from "lodash";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
//Import Breadcrumb
import "assets/scss/table.scss";
import Breadcrumbs from "components/Common/Breadcrumb";
import { getLabActivityLogMarketer } from "store/activtylogmarketer/actions";

class ActivityLogMarketer extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      activitylogmarketer: [],
      activitylogmarketer: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    const { match, onGetActivityLogMarketer } = this.props;
    const id = match.params.id; // Extracting ID from URL
    onGetActivityLogMarketer(id);
}
  onPaginationPageChange = page => {
    if (
      this.node &&
      this.node.current &&
      this.node.current.props &&
      this.node.current.props.pagination &&
      this.node.current.props.pagination.options
    ) {
      this.node.current.props.pagination.options.onPageChange(page);
    }
  };

  render() {
    const { SearchBar } = Search;

    const { activitylogmarketer } = this.props;
    const { onGetActivityLogMarketer } = this.props;

   const pageOptions = {
  sizePerPage: 10,
  totalSize: activitylogmarketer ? activitylogmarketer.length : 0,
  custom: true,
};


    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Activity Log | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Card>
            <CardBody>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Offered Tests" breadcrumbItem="Activity Log" />
            
                {!isEmpty(this.props.activitylogmarketer) &&
                  this.props.activitylogmarketer.map((activitylogmarketer, key) => (
                     <Col  key={"_col_" + key}>
                     
                     <div className="mt-3">
                          {(activitylogmarketer.actions === "Updated") && (
                              <div>
                                      <div>
                                          <i className="fas fa-exchange-alt font-size-18"></i>{" "}
                                          {activitylogmarketer.field_name} <b>{activitylogmarketer.test_name} </b> {activitylogmarketer.lab_name} Changed from {activitylogmarketer.old_value} to {activitylogmarketer.new_value}
                                          <br />
                                          Start Date: {new Date(activitylogmarketer.start_date_by_labhazir).toLocaleDateString("en-US")} to End Date: {new Date(activitylogmarketer.end_date_by_labhazir).toLocaleDateString("en-US")} on {new Date(activitylogmarketer.created_at).toLocaleDateString("en-US")} at {new Date(activitylogmarketer.created_at).toLocaleTimeString("en-US")}.
                                      </div>
                              </div>
                          )}
                      </div>
                        
                     </Col>
                  ))}
                  

                {isEmpty(this.props.activitylogmarketer) && (
                  <Row>
                    <Col lg="12">
                      <div className=" mb-5">
                        <h5 className="text-uppercase">No activity log exists.....</h5>
                      </div>
                    </Col>
                  </Row>
                )}
                </CardBody>
            </Card>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

ActivityLogMarketer.propTypes = {
  match: PropTypes.object, 
  activitylogmarketer: PropTypes.array,
  className: PropTypes.any,
  onGetActivityLogMarketer: PropTypes.func,
  history: any,
  success: PropTypes.any,
  error: PropTypes.any,
};
const mapStateToProps = ({ activitylogmarketer }) => ({
  activitylogmarketer: activitylogmarketer.activitylogmarketer,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetActivityLogMarketer: id => dispatch(getLabActivityLogMarketer(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ActivityLogMarketer));
