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

import {
  getMsgs,
  addNewMsg,
} from "store/chat-box/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class MsgsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      msgs: [],
      msg: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.toggle = this.toggle.bind(this);
    this.handleMsgClicks =
      this.handleMsgClicks.bind(this);
  }

  componentDidMount() {
    const { msgs, onGetMsgs } = this.props;
    onGetMsgs(this.props.match.params.id);
    this.setState({ msgs });
    console.log("helllloooo",this.state.msgs)
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleMsgClicks = () => {
    this.setState({
      msg: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { msgs } = this.props;
    if (
      !isEmpty(msgs) &&
      size(prevProps.msgs) !== size(msgs)
    ) {
      this.setState({ msgs: {}, isEdit: false });
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

    const { msgs } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onAddNewMsg,
      onGetMsgs,
    } = this.props;
    const msg = this.state.msg;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: msgs.length, // replace later with size(msgs),
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
                  
                {!isEmpty(this.props.msgs) &&
                  this.props.msgs.map((msg, key) => (
                    <Col xl="3" md="3" sm="6" key={"_col_" + key}>
                      <Card className="mb-2" style={{ backgroundColor: "#f2f2f2" }}>
                        <CardBody className="p-3">
                        {msg.chat &&(
                          <div >
                            <p>
                              <b>{msg.name}</b>{" "}{msg.chat} at {" "} {moment(msg.added_at).format("DD MMM YYYY, h:mm A")}
                            </p>
                          </div> 
                        )}
                        {msg.field_name == "request_status" &&(
                          <div >
                          <p>
                            <b>{msg.name}</b>{" "} changes advertisement status to {msg.new_value} at {" "} {moment(msg.added_at).format("DD MMM YYYY, h:mm A")}.
                          </p>
                        </div>
                        )}
                        {msg.actions == "Added" &&(
                          <div >
                          <p>
                            <b>{msg.name}</b>{" "} submitted advertisement for approval on {" "} {moment(msg.added_at).format("DD MMM YYYY, h:mm A")}
                          </p>
                        </div>
                        )}
                  {msg.actions === "Updated" && msg.field_name === null && (
  <div>
    <p>
      <b>{msg.name}</b>{" "} {msg.actions} advertisement payment status on {" "} {moment(msg.added_at).format("DD MMM YYYY, h:mm A")}
    </p>
  </div>
)}
                        
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                     <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            msg:
                                              (this.state &&
                                                this.state.msg) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            msg: Yup.string().required(
                                              "Please enter your comment"
                                            ),
                                          })}
                                          onSubmit={values => {
                                            {
                                              const newMsg = {
                                                msg:
                                                  values.msg,
                                                advertisement_id:
                                                  this.props.match.params.id,
                                              };

                                              // save new Msg
                                              onAddNewMsg(
                                                newMsg,
                                                this.state.user_id
                                              );
                                              setTimeout(() => {
                                                this.setState({
                                                  msg: "",
                                                });
                                              }, 1000);
                                              setTimeout(() => {
                                                onGetMsgs(
                                                  this.props.match.params.id
                                                );
                                              }, 2000);
                                            }
                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <Field
                                                    type="hidden"
                                                    className="form-control"
                                                    name="hiddenEditFlag"
                                                    value={isEdit}
                                                  />
                                                   <div className="mb-3">
                                                      <Label className="form-label">
                                                        <b>Comment</b>
                                                      </Label>
                                                      <Field
                                                        name="msg"
                                                        as="textarea"
                                                        rows="2"
                                                        cols="20"
                                                        className={
                                                          "form-control" +
                                                          (errors.msg &&
                                                          touched.msg
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                        value={
                                                          this.state.msg
                                                        }
                                                        onChange={e =>
                                                          this.setState({
                                                            msg:
                                                              e.target.value,
                                                          })
                                                        }
                                                      />
                                                      <ErrorMessage
                                                        name="msg"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col>
                                                  <div className="text-end">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-success save-user"
                                                    >
                                                      <i className="fas fa-paper-plane"></i>
                                                    </button>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </Form>
                                          )}
                                        </Formik>
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
  msgs: PropTypes.array,
  className: PropTypes.any,
  onGetMsgs: PropTypes.func,
  onAddNewMsg: PropTypes.func,
};

const mapStateToProps = ({ msgs }) => ({
  msgs: msgs.msgs,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetMsgs: id => dispatch(getMsgs(id)),
  onAddNewMsg: (msg, id) =>
    dispatch(addNewMsg(msg, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MsgsList));
