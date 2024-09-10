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

import { getActivityLogAuditor } from "store/activtylogAuditor/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class AuditHistory extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      activitylogauditor: [],
      activitylogauditor: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { activitylogauditor, onGetActivityLogAuditor } = this.props;
    onGetActivityLogAuditor(this.props.match.params.id);
    this.setState({ activitylogauditor });
    console.log("helllloooo",this.state.activitylogauditor)
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }


  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { activitylogauditor } = this.props;
    if (
      !isEmpty(activitylogauditor) &&
      size(prevProps.activitylogauditor) !== size(activitylogauditor)
    ) {
      this.setState({ activitylogauditor: {}, isEdit: false });
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

    const { activitylogauditor } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onGetActivityLogAuditor,
    } = this.props;
    const pageOptions = {
      sizePerPage: 10,
      totalSize: activitylogauditor.length, // replace later with size(activitylogauditor),
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
                  
                {!isEmpty(this.props.activitylogauditor) &&
                  this.props.activitylogauditor.map((activitylogauditor, key) => (
                    <Col xl="3" md="3" sm="6" key={"_col_" + key}>
                      <Card className="mb-2" style={{ backgroundColor: "#f2f2f2" }}>
                        <CardBody className="p-3">
                          {activitylogauditor.actions === "Request" &&(
                            <div>
                              <b>{`${activitylogauditor.added_by}`}</b> Requested for reaudit at {" "}
                              {moment(activitylogauditor.updated_at).format("DD MMM YYYY, h:mm A")}
                                                            .
                            </div>
                          )}
                           {activitylogauditor.actions === "Added" &&(
                            <div>
                              <b>{`${activitylogauditor.added_by}`}</b> Generated a new Audit {" "}
                              {moment(activitylogauditor.generated_at).format("DD MMM YYYY, h:mm A")}
                                                            .
                            </div>
                          )}
                          
{activitylogauditor.actions === "Updated" && (
  <div>
    <b>{`${activitylogauditor.added_by}`}</b> Updated{" "}

    {/* Filter out "None" values from old_value */}
      {activitylogauditor.old_value
        .split(", ") // Split the old_value into individual key-value pairs
        .filter((pair) => !pair.includes("None")) // Filter out pairs with "None"
        .join(", ")} {/* Join the filtered pairs back */}
    {" "}
    to{" "}
    <b>{activitylogauditor.new_value}</b>
    {" "}
    at{" "}
    {moment(activitylogauditor.updated_at).format("DD MMM YYYY, h:mm A")}
    .
  </div>
)}

                        
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                  {isEmpty(this.props.activitylogauditor) && (
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

AuditHistory.propTypes = {
  match: PropTypes.object,
  activitylogauditor: PropTypes.array,
  className: PropTypes.any,
  onGetActivityLogAuditor: PropTypes.func,
};

const mapStateToProps = ({ activitylogauditor }) => ({
  activitylogauditor: activitylogauditor.activitylogauditor,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetActivityLogAuditor: id => dispatch(getActivityLogAuditor(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AuditHistory));
