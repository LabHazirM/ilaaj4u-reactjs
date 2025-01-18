// import PropTypes from "prop-types";
// import React, { Component } from "react";
// import {
//   Alert,
//   Button,
//   Card,
//   CardBody,
//   Col,
//   Container,
//   Row,
//   Label,
//   Input,
// } from "reactstrap";

// import { Formik, Field, Form, ErrorMessage } from "formik";
// import * as Yup from "yup";

// // Redux
// import { connect } from "react-redux";
// import { Link, withRouter } from "react-router-dom";

// //Import Breadcrumb
// import Breadcrumb from "../../components/Common/Breadcrumb";

// // actions
// import { updateLabSettings, getLabSettings } from "../../store/actions";

// class LabSettings extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       office_phone: "",
//       complaint_handling_email: "",
//       complaint_handling_phone: "",
//       is_iso_9001_certified: "",

//       isSettingsUpdated: false,
//       user_id: localStorage.getItem("authUser")
//         ? JSON.parse(localStorage.getItem("authUser")).user_id
//         : "",
//     };
//   }

//   componentDidMount() {
//     setTimeout(() => {
//       this.props.getLabSettings(this.state.user_id);
//     }, 1000);

//     setTimeout(() => {
//       // if (this.props.success.is_iso_15189_certified == "Yes") {
//       //   this.setState({
//       //     // health_dept_certificate:
//       //     //   process.env.REACT_APP_BACKENDURL +
//       //     //   this.props.success.health_dept_certificate,
//       //     iso_certificate_15189:
//       //       process.env.REACT_APP_BACKENDURL +
//       //       this.props.success.iso_certificate_15189,
//       //     // iso_certificate_9001:
//       //     //   process.env.REACT_APP_BACKENDURL +
//       //     //   this.props.success.iso_certificate_9001,
//       //   });
//       // }

//       // if (this.props.success.is_iso_9001_certified == "Yes") {
//       //   this.setState({
//       //     // health_dept_certificate:
//       //     //   process.env.REACT_APP_BACKENDURL +
//       //     //   this.props.success.health_dept_certificate,
//       //     iso_certificate_9001:
//       //       process.env.REACT_APP_BACKENDURL +
//       //       this.props.success.iso_certificate_9001,
//       //   });
//       // }
//       this.setState({
//         office_phone: this.props.success.office_phone,
//         complaint_handling_email: this.props.success.complaint_handling_email,
//         complaint_handling_phone: this.props.success.complaint_handling_phone,
//         license_no: this.props.success.license_no,
//         is_iso_9001_certified: this.props.success.is_iso_9001_certified,
//       });
//     }, 2000);
//   }

//   render() {
//     return (
//       <React.Fragment>
//         <div className="page-content">
//           <Container fluid>
//             {/* Render Breadcrumb */}
//             <Breadcrumb title="Lab" breadcrumbItem="Settings" />

//             {this.state.isSettingsUpdated && this.state.isSettingsUpdated ? (
//               <Alert color="success">Your settings are updated.</Alert>
//             ) : null}

//             <Card>
//               <CardBody>
//                 <Formik
//                   enableReinitialize={true}
//                   initialValues={{
//                     office_phone: (this.state && this.state.office_phone) || "",
//                     complaint_handling_email:
//                       (this.state && this.state.complaint_handling_email) || "",
//                     complaint_handling_phone:
//                       (this.state && this.state.complaint_handling_phone) || "",
//                     is_iso_9001_certified:
//                       (this.state && this.state.is_iso_9001_certified) ||
//                       "",
//                   }}
//                   validationSchema={Yup.object().shape({
//                     complaint_handling_email: Yup.string()
//                       // .required("Please enter your complaint handling email")
//                       .email("Please enter valid email")
//                       .max(255, "Please enter maximum 255 characters"),
//                     complaint_handling_phone: Yup.string()
//                       // .required(
//                       //   "Please enter your complaint handling phone no."
//                       // )
//                       .max(255, "Please enter maximum 255 characters")
//                       .matches(
//                         /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{3}-\d{7}|^\d{11}$|^\d{3}-\d{8}$/,
//                         "Please enter a valid Pakistani landline number e.g. 0512345678"
//                       ),
//                   })}
//                   onSubmit={values => {
//                     console.log("values: ", values);
//                   }}
//                 >
//                   {({ errors, status, touched }) => (
//                     <Form className="form-horizontal">
//                       <p>{errors.health_dept_certificate}</p>
//                       {/* Office phonr Fields */}

//                       <div className="mb-3">
//                         <Label
//                           for="office_phone"
//                           className="form-label"
//                         >
//                           Office Phone
//                         </Label>
//                         <Field
//                           name="office_phone"
//                           type="text"
//                           onChange={e => {
//                             console.log("Value: ", e.target.value);
//                             this.setState({
//                               office_phone: e.target.value,
//                             });
//                             console.log(
//                               "Value: ",
//                               this.state.office_phone
//                             );
//                           }}
//                           value={this.state.office_phone}
//                           className="form-lebel"
//                         >
//                         </Field> 
//                       </div> 
//                        {/* ISO 9001 Certified */}
//                       <div className="mb-3">
//                         <Label
//                           for="is_iso_9001_certified"
//                           className="form-label"
//                         >
//                           Is ISO 9001 Certified?
//                         </Label>
//                         <Field
//                           name="is_iso_9001_certified"
//                           component="select"
//                           onChange={e => {
//                             console.log("Value: ", e.target.value);
//                             this.setState({
//                               is_iso_9001_certified: e.target.value,
//                             });
//                             console.log(
//                               "Value: ",
//                               this.state.is_iso_9001_certified
//                             );
//                           }}
//                           value={this.state.is_iso_9001_certified}
//                           className="form-select"
//                         >
//                           <option value="Yes">Yes</option>
//                           <option value="No">No</option>
//                         </Field> 
//                       </div> 

//                       ISO 9001 Certificate field
//                       {this.state.is_iso_9001_certified === "Yes" && (
//                         <div className="mb-3">
//                           <Label for="name" className="form-label">
//                             ISO 9001 Certificate (Choose file only if you want
//                             to add/change ISO 9001 certificate)
//                           </Label>
//                           <Row>
//                             <Col md={8} lg={8}>
//                               <Input
//                                 id="formFile"
//                                 name="iso_certificate_9001"
//                                 type="file"
//                                 multiple={false}
//                                 accept=".jpg,.jpeg,.png"
//                                 onChange={e =>
//                                   this.setState({
//                                     iso_certificate_9001: e.target.files[0],
//                                   })
//                                 }
//                                 className={
//                                   "form-control" +
//                                   (errors.iso_certificate_9001 &&
//                                   touched.iso_certificate_9001
//                                     ? " is-invalid"
//                                     : "")
//                                 }
//                               />
//                               <ErrorMessage
//                                 name="iso_certificate_9001"
//                                 component="div"
//                                 className="invalid-feedback"
//                               />
//                             </Col>

//                             <Col md={4} lg={4}>
//                               {this.props.success.is_iso_9001_certified ===
//                                 "Yes" && (
//                                 <div className="mt-2">
//                                   <strong>Currently: </strong>{" "}
//                                   <Link
//                                     to={{
//                                       pathname:
//                                         process.env.REACT_APP_BACKENDURL +
//                                         this.props.success.iso_certificate_9001,
//                                     }}
//                                     target="_blank"
//                                   >
//                                     ISO 9001 Certificate
//                                   </Link>
//                                 </div>
//                               )}
//                             </Col>
//                           </Row>
//                         </div>
//                       )}
                      
//                       {/* Complaint Handling Email field */}
//                       <div className="mb-3">
//                         <Label
//                           for="complaint_handling_email"
//                           className="form-label"
//                         >
//                           Help & Support Email
//                           {/* <span
//                             style={{ color: "#f46a6a" }}
//                             className="font-size-18"
//                           >
//                             *
//                           </span> */}
//                         </Label>
//                         <Field
//                           name="complaint_handling_email"
//                           type="text"
//                           onChange={e =>
//                             this.setState({
//                               complaint_handling_email: e.target.value,
//                             })
//                           }
//                           value={this.state.complaint_handling_email}
//                           className={
//                             "form-control" +
//                             (errors.complaint_handling_email &&
//                             touched.complaint_handling_email
//                               ? " is-invalid"
//                               : "")
//                           }
//                         />
//                         <ErrorMessage
//                           name="complaint_handling_email"
//                           component="div"
//                           className="invalid-feedback"
//                         />
//                       </div>

//                       {/* Complaint Handling Phone field */}
//                       <div className="mb-3">
//                         <Label
//                           for="complaint_handling_phone"
//                           className="form-label"
//                         >
//                           Help & Support Phone No.
//                           {/* <span
//                             style={{ color: "#f46a6a" }}
//                             className="font-size-18"
//                           >
//                             *
//                           </span> */}
//                         </Label>
//                         <Field
//                           id="complaint_handling_phone"
//                           name="complaint_handling_phone"
//                           type="text"
//                           onChange={e =>
//                             this.setState({
//                               complaint_handling_phone: e.target.value,
//                             })
//                           }
//                           value={this.state.complaint_handling_phone}
//                           className={
//                             "form-control" +
//                             (errors.complaint_handling_phone &&
//                             touched.complaint_handling_phone
//                               ? " is-invalid"
//                               : "")
//                           }
//                         />
//                         <ErrorMessage
//                           name="complaint_handling_phone"
//                           component="div"
//                           className="invalid-feedback"
//                         />
//                       </div>
//                       <div className="text-center mt-4">
//                         <Button type="submit" color="danger">
//                           Update Settings
//                         </Button>
//                       </div>
//                     </Form>
//                   )}
//                 </Formik>
//               </CardBody>
//             </Card>
//           </Container>
//         </div>
//       </React.Fragment>
//     );
//   }
// }

// LabSettings.propTypes = {
//   match: PropTypes.object,
//   location: PropTypes.object,
//   updateLabSettings: PropTypes.func,
//   error: PropTypes.any,
//   success: PropTypes.any,
//   getLabSettings: PropTypes.func,
// };

// const mapStateToProps = state => {
//   const { error, success } = state.LabSettings;
//   return { error, success };
// };

// export default withRouter(
//   connect(mapStateToProps, {
//     updateLabSettings,
//     getLabSettings,
//   })(LabSettings)
// );
