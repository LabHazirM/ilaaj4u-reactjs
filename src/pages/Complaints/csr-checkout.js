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

class CSRCheckout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guest_id: "",
    };
  }

  render() {
    return (
      // <React.Fragment>
      //   <div className="page-content">
      //     <MetaTags>
      //       <title>CSR Checkout | Lab Hazir</title>
      //     </MetaTags>
      //     <Container fluid>
      //       {/* Render Breadcrumbs */}
      //       <Breadcrumbs title="Checkout" breadcrumbItem="CSR Checkout" />
      //       <Card>
      //         <CardBody>
      //           <Row className="g-0">
      //             <div className="p-5">
      //               <div className="w-200">
      //                 <h4>Please Select</h4>
      //                 <div>
      //                   <p>
      //                     Do not have an account?{" "}
      //                     <Link
      //                       // to={{ pathname: "/register" }}
      //                       to={
      //                         this.props.match.params.guest_id
      //                           ? `/register/${this.props.match.params.guest_id}`
      //                           : `/register`
      //                       }
      //                       // className="fw-medium text-primary"
      //                       className="btn btn-success mb-2 mt-2"
      //                     >
      //                       {" "}
      //                       Register
      //                     </Link>{" "}
      //                   </p>
      //                 </div>
      //                 <div className="text-sm-end">
      //                   <p>
      //                     Already have an account?{" "}
      //                     <Link
      //                       // to={{ pathname: "/register" }}
      //                       to={
      //                         this.props.match.params.guest_id
      //                           ? `/patients-list/${this.props.match.params.guest_id}`
      //                           : `/patients-list`
      //                       }
      //                       // className="fw-medium text-primary"
      //                       // className="btn btn-secondary"
      //                       className="btn btn-success mb-4 mt-4"
      //                     >
      //                       {" "}
      //                       Proceed
      //                     </Link>{" "}
      //                   </p>
      //                 </div>
      //               </div>
                    
      //             </div>
      //           </Row>
      //         </CardBody>
      //       </Card>
      //     </Container>
      //   </div>
      // </React.Fragment>
      <React.Fragment>
  <div className="page-content">
    <MetaTags>
      <title>CSR Checkout | Lab Hazir</title>
    </MetaTags>
    <Container fluid>
      {/* Render Breadcrumbs */}
      <Breadcrumbs title="Checkout" breadcrumbItem="CSR Checkout" />
      <Card>
        <CardBody>
          <Row className="g-0">
            <div className="p-5 w-75 d-flex justify-content-between">
              <div>
                <h5>Please Select</h5>
                <div>
                  <p>
                    Do not have an account?{"  "}
                    <Link
                      to={
                        this.props.match.params.guest_id
                          ? `/register/${this.props.match.params.guest_id}`
                          : `/register`
                      }
                      className="btn btn-success mb-2 mt-2"
                    >
                      {" "}
                      Register
                    </Link>{" "}{" "}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p>
                  Already have an account?{" "}
                  <Link
                    to={
                      this.props.match.params.guest_id
                        ? `/patients-list/${this.props.match.params.guest_id}`
                        : `/patients-list`
                    }
                    className="btn btn-success mb-4 mt-4"
                  >
                    {" "}{" "}{" "}
                    <span></span>
                    Proceed
                  </Link>{" "}{" "}{" "}
                </p>
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

CSRCheckout.propTypes = {
  match: PropTypes.object,
};

const mapStateToProps = state => {
  const { error } = state;
  return { error };
};

export default withRouter(connect(mapStateToProps)(CSRCheckout));
