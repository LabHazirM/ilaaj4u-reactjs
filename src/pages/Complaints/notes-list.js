import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import moment from 'moment';


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

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getNotes,
  addNewNote,
} from "store/csr-comments/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";
import { Tooltip } from "@material-ui/core";

class NotesList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      notes: [],
      note: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.toggle = this.toggle.bind(this);
    this.handleNoteClicks =
      this.handleNoteClicks.bind(this);
  }

  componentDidMount() {
    const { notes, onGetNotes } = this.props;
    onGetNotes(this.props.match.params.id);
    this.setState({ notes });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleNoteClicks = () => {
    this.setState({
      note: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { notes } = this.props;
    if (
      !isEmpty(notes) &&
      size(prevProps.notes) !== size(notes)
    ) {
      this.setState({ notes: {}, isEdit: false });
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

    const { notes } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onAddNewNote,
      onGetNotes,
    } = this.props;
    const note = this.state.note;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: notes.length, // replace later with size(notes),
      custom: true,
    };
    const sortedNotes = this.props.notes.sort((a, b) => {
      return new Date(a.added_at) - new Date(b.added_at);
    });
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

                  {!isEmpty(sortedNotes) && sortedNotes.map((note, key) => (
                        <Col xl="3" md="3" sm="6" key={"_col_" + key}>
                          <Card className="mb-2" style={{ backgroundColor: "#f2f2f2" }}>
                            <CardBody className="p-3">
                              {note.note && (
                                <div >
                                  <p>
                                    <b>{note.staff_name}</b>{" "}{note.note} at {" "} {moment(note.added_at).format("DD MMM YYYY, h:mm A")}
                                  </p>
                                </div>
                              )}
                              {note.field_name === "status" && note.old_value !== "Not Paid" && (
                                <div>
                                  <p>
                                    <b>{note.staff_name}</b>{" "} changes status of appointment to{" "}
                                    {note.new_value === "Rescheduled" && note.payment_status === "Paid" ? (
                                      <span>
                                        <b>{note.new_value}</b>{" "} Invoice status is already{" "}
                                        <span className="text-danger">Paid</span>{" "} Rs. <b>{note.amount}</b> {" "}
                                        <span>
                                          so the sample will be collected{" "}
                                          <span className="text-danger">without amount</span>
                                        </span>{" "}
                                        at {" "}
                                        {moment(note.added_at).format("DD MMM YYYY, h:mm A")}
                                      </span>
                                    ) : (
                                      <span>
                                        <b>{note.new_value}</b> at {" "}
                                        {moment(note.added_at).format("DD MMM YYYY, h:mm A")}
                                      </span>
                                    )}
                                  </p>
                                </div>
                              )}

                              {note.field_name == "appointment_requested_at" && (
                                <div >
                                  <p>
                                    <b>{note.staff_name}</b>{" "} changes Appointment Request Time by Patient <b>{moment(note.old_value).format("DD MMM YYYY, h:mm A")}</b> <span className="text-danger">to</span>  <b>{moment(note.new_value).format("DD MMM YYYY, h:mm A")}</b> at {" "} {moment(note.added_at).format("DD MMM YYYY, h:mm A")}
                                  </p>
                                </div>
                              )}
                              {note.field_name === "collection_status" && (
                                <div>
                                  <p>
                                    <b>{note.staff_name}</b> changes collection status to <b>{note.new_value}</b>{" "}
                                    {note.amount ? (
                                      <spam>
                                        <span className="text-danger">Amount is</span> {" "} Rs. <b>{note.amount}</b></spam>
                                    ) : null} at {moment(note.added_at).format("DD MMM YYYY, h:mm A")}
                                  </p>
                                </div>
                              )}

                              {note.field_name == "assigned_to" && (
                                <div >
                                  <p>
                                    <b>{note.staff_name}</b>{" "} assigned appointment to sample collector <b>{note.collector_name}</b> at {" "} {moment(note.added_at).format("DD MMM YYYY, h:mm A")}
                                  </p>
                                </div>
                              )}
                              {note.old_value == "Not Paid" && (
                                <div >
                                  <p>
                                    <b>{note.staff_name}</b>{" "} changes payment status to <b>{note.new_value}</b> at {" "} {moment(note.added_at).format("DD MMM YYYY, h:mm A")}
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
                        note:
                          (this.state &&
                            this.state.note) ||
                          "",
                      }}
                      validationSchema={Yup.object().shape({
                        hiddentEditFlag: Yup.boolean(),
                        note: Yup.string().required(
                          "Please enter your comment"
                        ),
                      })}
                      onSubmit={values => {
                        {
                          const newNote = {
                            note:
                              values.note,
                            appointment_id:
                              this.props.match.params.id,
                          };

                          // save new Note
                          onAddNewNote(
                            newNote,
                            this.state.user_id
                          );
                          setTimeout(() => {
                            this.setState({
                              note: "",
                            });
                          }, 1000);
                          setTimeout(() => {
                            onGetNotes(
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
                                  name="note"
                                  as="textarea"
                                  rows="2"
                                  cols="20"
                                  className={
                                    "form-control" +
                                    (errors.note &&
                                      touched.note
                                      ? " is-invalid"
                                      : "")
                                  }
                                  value={
                                    this.state.note
                                  }
                                  onChange={e =>
                                    this.setState({
                                      note:
                                        e.target.value,
                                    })
                                  }
                                />
                                <ErrorMessage
                                  name="note"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <div className="text-end">
                                <Tooltip title="Send">
                                  <button
                                    type="submit"
                                    className="btn btn-success save-user"
                                  >
                                    <i className="fas fa-paper-plane"></i>
                                  </button>
                                </Tooltip>
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

NotesList.propTypes = {
  match: PropTypes.object,
  notes: PropTypes.array,
  className: PropTypes.any,
  onGetNotes: PropTypes.func,
  onAddNewNote: PropTypes.func,
};

const mapStateToProps = ({ notes }) => ({
  notes: notes.notes,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetNotes: id => dispatch(getNotes(id)),
  onAddNewNote: (note, id) =>
    dispatch(addNewNote(note, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NotesList));
