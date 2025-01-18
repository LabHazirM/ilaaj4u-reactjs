import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
  Input,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";
import moment from 'moment';
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import { getActivityLogFinance } from "store/activtylogfinance/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class MsgsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      activitylogfinance: [],
      activitylogfinance: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { activitylogfinance, onGetActivityLogFinance } = this.props;
    onGetActivityLogFinance(this.props.match.params.id);
    this.setState({ activitylogfinance });
    console.log("helllloooo",this.state.activitylogfinance)
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }


  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { activitylogfinance } = this.props;
    if (
      !isEmpty(activitylogfinance) &&
      size(prevProps.activitylogfinance) !== size(activitylogfinance)
    ) {
      this.setState({ activitylogfinance: {}, isEdit: false });
    }
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

    const { activitylogfinance } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onGetActivityLogFinance,
    } = this.props;
    const pageOptions = {
      sizePerPage: 10,
      totalSize: activitylogfinance.length, // replace later with size(activitylogfinance),
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
            <title>Comments List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Comments"
              breadcrumbItem="Comments List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                  
                {!isEmpty(this.props.activitylogfinance) &&
                  this.props.activitylogfinance.map((activitylogfinance, key) => (
                    <Col xl="3" md="3" sm="6" key={"_col_" + key}>
                      <Card className="mb-2" style={{ backgroundColor: "#f2f2f2" }}>
                        <CardBody className="p-3">
                        {activitylogfinance.actions === "Added" && activitylogfinance.type !== "Bank Transfer Detail" && (
                            <div>
                              <b>{`${activitylogfinance.name}`}</b> Created a {" "}
                              <b>{activitylogfinance.type}</b> form for{" "}
                              <b>
                                {activitylogfinance.payment_for}{" "}
                                {activitylogfinance.payment_for ===
                                "Advertisement"
                                  ? activitylogfinance.adv_lab_name
                                  : activitylogfinance.lab_name ||
                                    activitylogfinance.donor_name ||
                                    activitylogfinance.b2b_name}
                              </b>{" "}
                              {/* on{" "}
                              {moment(activitylogfinance.payment_at).format("DD MMM YYYY, h:mm A")}
                              {" "} */}
                              at{" "}
                              {moment(activitylogfinance.created_at).format("DD MMM YYYY, h:mm A")}{" "}
                              with ID{" "}
                              <b>
                                {activitylogfinance.payment_in_id ||
                                  activitylogfinance.payment_out_id}
                                  {/* // activitylogfinance.btd_id */}
                              </b>
                              .
                            </div>
                          )}
                           {activitylogfinance.actions === "Added" && activitylogfinance.type === "Bank Transfer Detail" && (
                            <div>
                              <b>{`${activitylogfinance.name}`}</b> Created a {" "}
                              <b>{activitylogfinance.type}</b> 
                              {/* form on{" "}
                              {moment(activitylogfinance.payment_at).format("DD MMM YYYY, h:mm A")}{" "} */}
                              at{" "}
                              {moment(activitylogfinance.created_at).format("DD MMM YYYY, h:mm A")}{" "}
                              with ID{" "}
                              <b>
                                {activitylogfinance.btd_id}
                              </b>
                              .
                            </div>
                          )}

                          {activitylogfinance.actions === "Updated" && activitylogfinance.type !== "Bank Transfer Detail" && (
                            <div>
                              <b>{`${activitylogfinance.name}`}</b> Changed Status of{" "}
                              <b>{activitylogfinance.type}</b> with ID{" "}
                              <b>{activitylogfinance.payment_in_id ||
                                activitylogfinance.payment_out_id}</b>{" "}
                              for <b>{activitylogfinance.payment_for}</b>{" "}
                              <b>
                                {" "}
                                {activitylogfinance.payment_for ===
                                "Advertisement"
                                  ? activitylogfinance.adv_lab_name
                                  : activitylogfinance.payment_for === "Donor"
                                  ? activitylogfinance.donor_name
                                  : activitylogfinance.lab_name ||
                                    activitylogfinance.b2b_name}
                              </b>{" "}
                              from <b>{activitylogfinance.old_value}</b> to{" "}
                              <b>{activitylogfinance.new_value}</b> 
                              {/* on{" "}
                              {moment(activitylogfinance.created_at).format("DD MMM YYYY, h:mm A")}{" "} */}
                              {" "}
                              at{" "}
                              {moment(activitylogfinance.created_at).format("DD MMM YYYY, h:mm A")}

                              .
                            </div>
                          )}
                          {activitylogfinance.actions === "Updated" && activitylogfinance.type === "Bank Transfer Detail" && (
                            <div>
                              <b>{`${activitylogfinance.name}`}</b> Changed Status of{" "}
                              <b>{activitylogfinance.type}</b> with ID{" "}
                              <b>{activitylogfinance.btd_id}</b>{" "}
                              from <b>{activitylogfinance.old_value}</b> to{" "}
                              <b>{activitylogfinance.new_value}</b>
                              {" "}
                              {/* {moment(activitylogfinance.created_at).format("DD MMM YYYY, h:mm A")}{" "} */}
                              at{" "}
                              {moment(activitylogfinance.created_at).format("DD MMM YYYY, h:mm A")}
                              .
                            </div>
                          )}

                          {activitylogfinance.actions == "Synchronize" && (
                            <div>
                              {activitylogfinance.lab_name} Synchronizes its
                              main lab tests on{" "}
                              {moment(activitylogfinance.created_at).format("DD MMM YYYY, h:mm A")}{" "}
                              at{" "}
                              {moment(activitylogfinance.created_at).format("DD MMM YYYY, h:mm A")}
                              .
                            </div>
                          )}
                      
                        
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                  {isEmpty(this.props.activitylogfinance) && (
                  <Row>
                    <Col lg="12">
                      <div className=" mb-5">
                        <h5 className="text-uppercase">
                          No Comments exists.....
                        </h5>
                      </div>
                    </Col>
                  </Row>
                )}
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

MsgsList.propTypes = {
  match: PropTypes.object,
  activitylogfinance: PropTypes.array,
  className: PropTypes.any,
  onGetActivityLogFinance: PropTypes.func,
};

const mapStateToProps = ({ activitylogfinance }) => ({
  activitylogfinance: activitylogfinance.activitylogfinance,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetActivityLogFinance: id => dispatch(getActivityLogFinance(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MsgsList));
