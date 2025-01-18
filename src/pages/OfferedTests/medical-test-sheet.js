import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";

import { Alert, Col, Container, Row, Label, Card, CardBody } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

class MedicalTestSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Offered Testssssssssssssss List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Offered Tests"
              breadcrumbItem="Medical Test sheet"
            />
            <Card>
              <CardBody>
                <Row className="g-0">
                  <div className="p-5">
                    <div className="w-100">
                      <h4><b>Instructions to fill the excel sheet:</b></h4>
                      <div>
                        <ol>
                          <li>
                            Add all the tests you are providing with details of
                            the test in the corresponding row.
                          </li>
                          <li>
                            If you are not offering the test that is in the
                            list, leave the row empty. Please{" "}
                            <strong>do not delete</strong> the row.
                          </li>
                          {/* <li>
                            If you are offering a test that is not in the list,
                            add the test at the end.
                          </li> */}
                          <li>
                            Select from the drop down where drop down is
                            provided.
                          </li>
                          <li>
                            Enter within the limits applied to the fields.
                          </li>
                          <li>
                            After correctly filling the sheet, email the file to
                            us at <strong>labhazir@gmail.com</strong>
                          </li>
                        </ol>
                      </div>
                      <div>
                      <p>
                          <b>
                            Note: This sheet can be added only once by labhazir, After that you can change test details from your own portal.
                            {/* Download button below:{" "} */}
                          </b>{" "}
                        </p>
                        <p>
                          <b>
                            You can download the excel sheet by clicking the
                            Download button below:{" "}
                          </b>{" "}
                        </p>
                        <Link
                          className="btn btn-primary"
                          to={{
                            pathname:
                              process.env.REACT_APP_BACKENDURL +
                              "/media/public/medical-test-list.xlsx",
                          }}
                          target="_blank"
                        >
                          <i className="mdi mdi-download me-1" />
                          Download
                        </Link>{" "}
                      </div>
                    </div>
                  </div>
                </Row>
              </CardBody>
            </Card>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

MedicalTestSheet.propTypes = {};

const mapStateToProps = state => {
  const { error } = state;
  return { error };
};

export default withRouter(connect(mapStateToProps)(MedicalTestSheet));
