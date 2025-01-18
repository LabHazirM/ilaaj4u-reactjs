import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Label, Input } from "reactstrap";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { addNewSampleCollector } from "store/sample-collectors/actions";

class SampleCollectorsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      sampleCollectors: [],
      sampleCollector: "",
      collectorImg: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {}

  render() {
    const { onAddNewSampleCollector } = this.props;
    const sampleCollector = this.state.sampleCollector;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Home Sample Collectors List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Home Sample Collector"
              breadcrumbItem="Register - Step 2"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        name: (sampleCollector && sampleCollector.name) || "",
                        gender:
                          (sampleCollector && sampleCollector.gender) || "Male",
                        cnic: (sampleCollector && sampleCollector.cnic) || "",
                        phone: (sampleCollector && sampleCollector.phone) || "",
                        photo: (this.state && this.state.collectorImg) || "",
                      }}
                      validationSchema={Yup.object().shape({
                        hiddentEditFlag: Yup.boolean(),
                        name: Yup.string()
                          .trim()
                          .required("Please enter name"),
                        cnic: Yup.string()
                          .required("Please enter your CNIC")
                          .matches(
                            /^[0-9]{5}-[0-9]{7}-[0-9]$/,
                            "Please enter a valid CNIC e.g. 37106-8234782-3"
                          ),
                        phone: Yup.string()
                          .required("Please enter phone")
                          .matches(
                            /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                            "Please enter a valid Pakistani phone number e.g. 03123456789"
                          ),
                        photo: Yup.string().required("Please upload photo"),
                      })}
                      onSubmit={values => {
                        const newSampleCollector = {
                          id: Math.floor(Math.random() * (30 - 20)) + 20,
                          name: values.name,
                          gender: values.gender,
                          cnic: values.cnic,
                          phone: values.phone,
                          photo: this.state.collectorImg,
                          account_id: this.props.match.params.id,
                        };

                        // save new SampleCollector
                        onAddNewSampleCollector(
                          newSampleCollector,
                          this.state.user_id
                        );

                        setTimeout(() => {
                          this.props.history.push("/sample-collectors");
                        }, 1000);

                        this.setState({
                          selectedSampleCollector: null,
                        });
                        this.toggle();
                      }}
                    >
                      {({ errors, status, touched }) => (
                        <Form>
                          <Row>
                            <Col className="col-12">
                              <div className="mb-3">
                                <Label className="form-label">Name</Label>
                                <Field
                                  name="name"
                                  type="text"
                                  placeholder="Enter name"
                                  value={this.state.sampleCollector.name}
                                  onChange={e => {
                                    this.setState({
                                      sampleCollector: {
                                        name: e.target.value,
                                        gender: sampleCollector.gender,
                                        cnic: sampleCollector.cnic,
                                        phone: sampleCollector.phone,
                                      },
                                    });
                                  }}
                                  className={
                                    "form-control" +
                                    (errors.name && touched.name
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="name"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="mb-3">
                                <Label className="form-label">Gender</Label>
                                <Field
                                  name="gender"
                                  as="select"
                                  className="form-control"
                                  onChange={e => {
                                    this.setState({
                                      sampleCollector: {
                                        name: sampleCollector.name,
                                        gender: e.target.value,
                                        cnic: sampleCollector.cnic,
                                        phone: sampleCollector.phone,
                                      },
                                    });
                                  }}
                                  multiple={false}
                                >
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </Field>
                              </div>

                              <div className="mb-3">
                                <Label className="form-label">CNIC</Label>
                                <Field
                                  name="cnic"
                                  type="text"
                                  placeholder="Enter CNIC"
                                  value={this.state.sampleCollector.cnic}
                                  onChange={e => {
                                    this.setState({
                                      sampleCollector: {
                                        name: sampleCollector.name,
                                        gender: sampleCollector.gender,
                                        cnic: e.target.value,
                                        phone: sampleCollector.phone,
                                      },
                                    });
                                  }}
                                  className={
                                    "form-control" +
                                    (errors.cnic && touched.cnic
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="cnic"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="mb-3">
                                <Label className="form-label">Mobile No.</Label>
                                <Field
                                  name="phone"
                                  type="text"
                                  placeholder="Enter mobile no."
                                  value={this.state.sampleCollector.phone}
                                  onChange={e => {
                                    this.setState({
                                      sampleCollector: {
                                        name: sampleCollector.name,
                                        gender: sampleCollector.gender,
                                        cnic: sampleCollector.cnic,
                                        phone: e.target.value,
                                      },
                                    });
                                  }}
                                  className={
                                    "form-control" +
                                    (errors.phone && touched.phone
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="phone"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>

                              {/* Photo field */}
                              <div className="mb-3">
                                <Label for="name" className="form-label">
                                  Photo
                                </Label>
                                <Input
                                  id="formFile"
                                  name="photo"
                                  placeholder="Choose image"
                                  type="file"
                                  multiple={false}
                                  accept=".jpg,.jpeg,.png"
                                  onChange={e =>
                                    this.setState({
                                      collectorImg: e.target.files[0],
                                    })
                                  }
                                  className={
                                    "form-control" +
                                    (errors.photo && touched.photo
                                      ? " is-invalid"
                                      : "")
                                  }
                                />

                                <ErrorMessage
                                  name="photo"
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
                                  Save
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

SampleCollectorsList.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  sampleCollectors: PropTypes.array,
  className: PropTypes.any,
  onAddNewSampleCollector: PropTypes.func,
};

const mapStateToProps = ({ sampleCollectors }) => ({
  sampleCollectors: sampleCollectors.sampleCollectors,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAddNewSampleCollector: (sampleCollector, id) =>
    dispatch(addNewSampleCollector(sampleCollector, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SampleCollectorsList));
