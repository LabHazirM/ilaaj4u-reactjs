import React, { Component } from "react";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  Alert,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  FormGroup,
  Button,
} from "reactstrap";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { addNewComplaint } from "store/complaints/actions";
import {
  getLabs,
} from "store/inpayments/actions";
import {
  getTerritoriesList
} from "store/territories-list/actions";

class Contact extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      territoriesList: [],
      complaint: "",
      lab_id: "",
      labhazir_complainee: "",
      name: "",
      email: "",
      city: "",
      phone: "",
      subject: "",
      message: "",
      complainant: "",
      complainee: "",
      complaintSuccess: "",
    };
  }
  handleSelectGroup = selectedGroup => {
    this.setState({ complaint: selectedGroup.value });
  };
  componentDidMount() {
    const { territoriesList, onGetTerritoriesList } = this.props;
    if (territoriesList && !territoriesList.length) {
      console.log(onGetTerritoriesList(this.state.user_id));
    }
    const { labs, onGetlabs } = this.props;
    if (labs && !labs.length) {
      onGetlabs();
    }
    this.setState({ labs });
  }


  render() {
    const complaint = this.state.complaint;
    const { onAddNewComplaint } = this.props;
    const { labs } = this.props;

    const labList = [];
    for (let i = 0; i < labs.length; i++) {
      let flag = 0;
      if (!flag) {
        labList.push({
          label: labs[i].name,
          value: labs[i].id,
        });
      }
    }

    const cityList = [];
    for (let i = 0; i < this.props.territoriesList.length; i++) {
      cityList.push({
        label: this.props.territoriesList[i].city,
        value: this.props.territoriesList[i].city,
      });
    }
    function togglePopup(){
      document.getElementById("popup1").classList.toggle("active");
    }

    return (
      <React.Fragment>
        <div className="page-content">
         
          <MetaTags>
            <title> Lab Hazir | Contact Form</title>
          </MetaTags>
          <Container fluid={true}>
            <Breadcrumbs title="Contact" breadcrumbItem="Contact Us" />
            {this.state.complaintSuccess && (
              <Alert color="success" className="col-md-8">
                {this.state.complaintSuccess}
              </Alert>
            )}    
              <Button
                color="primary"
                className=" btn btn-primary float-end btn-responsive"
                style={{ position: "relative"}}
              >
                <a onClick={togglePopup}>
                  <span className="pt-4" style={{ fontWeight: 'bold', }}>
                    Call / Email HelpLine</span>
                  <hr style={{ margin: '0 0' }} />
                </a> 
              </Button>
                  <div id="popup1" className="popup">
                    <div className='overlay1'></div>
                        <div className="modal-header">
                        </div>
                          <div className="content" style={{textAlign: 'start', fontSize:"14px"}}>
                            <span className="text-danger">
                              <i className="mdi mdi-phone" style={{fontSize: "12px", backgroundColor: 'blue', color: 'white', borderRadius: '5px', padding: '2px' }}></i>{" "}
                              <span style={{ padding: '2px', fontSize:"16px"}}>0321 8543111</span>
                            </span><br />
                            <span className="text-danger">
                              <i className="mdi mdi-mail" style={{fontSize: "12px", backgroundColor: 'blue', color: 'white', borderRadius: '5px', padding: '2px' }}></i>{" "}
                              <span style={{ padding: '2px', fontSize:"16px"}}>labhazir@gmail.com</span><br />
                            </span>
                            <span className="text-danger">
                              <i className="mdi mdi-mail my-3" style={{ fontSize: "12px", backgroundColor: 'blue', color: 'white', borderRadius: '5px', padding: '2px', marginRight: '5px' }}></i>{" "}
                              <span style={{padding: '2px',fontSize: "16px" }}>info@labhazir.com</span>
                            </span>
          
                            <div className="modal-header">
                              <h5 className="modal-title" style={{ margin: '15px', fontSize:"12px"  }}>Available 24/7 for your convenience and peace of mind.</h5>
                            </div>

                            <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={togglePopup}
                                  >
                                    Close
                                  </button> 
                            </div> 
                          </div>
                  </div>        
              <style>
                        {`
                          .popup .overlay1 {
                            position: fixed;
                            top: 0px;
                            left: 0px;
                            width: 100vw;
                            height: 100vh;
                            background: rgba(0, 0, 0, 0.7);
                            z-index: 1;
                            display: none; /* initially hide the overlay */
                          }
                          .popup .content {
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%) scale(0); /* initially scale down */
                            background: #fff;
                            width: 310px;
                            height: 200px;
                            z-index: 2;
                            text-align: center;
                            padding: 20px;
                            box-sizing: border-box;
                          }
                          .popup.active .overlay1 {
                            display: block;
                          }
                          .popup.active .content {
                            transition: 300ms ease-in-out;
                            transform: translate(-50%, -50%) scale(1);
                          }

                          .btn-responsive {
                            font-size: 15px;
                          }

                          @media (max-width: 1100px) {
                            .btn-responsive {
                              font-size: 14px;
                              width: 42%;
                            }
                          }

                          @media (max-width: 1000px) {
                            .btn-responsive {
                              font-size: 10px;
                              width: 20%;
                            }
                          }

                          @media (max-width: 355px) {
                            .btn-responsive {
                              font-size: 6px;
                              width: 15%;
                            }
                          }
                      `}
              </style>
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        complainant:
                          (this.state && this.state.complainant) || "",
                        complainee: (this.state && this.state.complainee) || "",
                        lab_id: (this.state && this.state.lab_id) || "",
                        name: (this.state && this.state.name) || "",
                        labhazir_complainee:
                          (this.state && this.state.labhazir_complainee) || "",
                        email: (this.state && this.state.email) || "",
                        city: (this.state && this.state.city) || "",
                        phone: (this.state && this.state.phone) || "",
                        subject: (this.state && this.state.subject) || "",
                        message: (this.state && this.state.message) || "",
                      }}
                      validationSchema={Yup.object().shape({
                        complainant: Yup.string(),
                        complainee: Yup.string(),
                        name: Yup.string().trim().required("Please enter your name"),
                        // email: Yup.string().required("Please enter your email").email("Please enter valid email"),
                        phone: Yup.string()
                          .required("Please enter your mobile number")
                          .matches(
                            /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                            "Please enter a valid Pakistani mobile number e.g. 03123456789"
                          ),
                        // subject: Yup.string().trim().required("Please enter your subject"),
                        message: Yup.string().trim().required("Please enter your message"),
                        city: Yup.string().required('Please select your city'),
                        lab_id: Yup.string().when('complainee', {
                          is: 'Lab',
                          then: Yup.string().required('Please select lab'),
                          otherwise: Yup.string(),
                        }),
                        labhazir_complainee: Yup.string().when('complainee', {
                          is: 'LabHazir',
                          then: Yup.string().required('Please select labhazir complainee'),
                          otherwise: Yup.string(),
                        }),
                      })}
                                            
                      onSubmit={values => {
                        onAddNewComplaint(values);
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

                        setTimeout(() => {
                          if (this.props.complaint) {
                            this.setState({
                              complaintSuccess:
                                "Thank you for contacting us. Our customer service representative will get back to you soon.Check your email for Complaint ID",
                            }, () => {
                              // Reload the window after 2 seconds
                              setTimeout(() => {
                                window.location.reload();
                              }, 2000);
                            });
                          }
                        }, 1000);                        
                        

                        setTimeout(() => {
                          this.setState({
                            complaintSuccess: "",
                            complainant: "",
                            complainee: "",
                            lab_id: "",
                            labhazir_complainee: "",
                            name: "",
                            email: "",
                            city: "",
                            phone: "",
                            subject: "",
                            message: "",
                          });
                        }, 5000);
                      }}
                    >
                      {({ errors, status, touched }) => (
                        <Form className="form-horizontal">
                          <Row>
                            <Col lg="6">
                              {/* Type field */}
                              <div className="mb-3">
                                <Label for="complainant" className="form-label">
                                  Complaint From
                                </Label>
                                <Field
                                  name="complainant"
                                  component="select"
                                  onChange={e =>
                                    this.setState({
                                      complainant: e.target.value,
                                    })
                                  }
                                  value={this.state.complainant}
                                  className="form-select"
                                >
                                  <option value="">--- Please Select---</option>
                                  <option value="Lab">Lab</option>
                                  <option value="Patient">Patient</option>
                                  <option value="B2B">B2B</option>
                                  <option value="Donor">Donor</option>
                                  <option value="Corporate">Corporate</option>
                                </Field>
                              </div>
                            </Col>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="complainee" className="form-label">
                                Complaint Against
                                </Label>
                                <Field
                                  name="complainee"
                                  component="select"
                                  onChange={e =>
                                    this.setState({
                                      complainee: e.target.value,
                                    })
                                  }
                                  value={this.state.complainee}
                                  className="form-select"
                                >
                                  <option value="">--- Please Select---</option>
                                  <option value="Lab">Lab</option>
                                  <option value="LabHazir">LabHazir</option>
                                </Field>
                              </div>
                            </Col>
                            {this.state.complainee == "Lab" ? (

                              complaint.lab_id ? (

                                <div className="mb-3">
                                  <Label className="form-label">lab name</Label>
                                  <Field
                                    name="lab_id"
                                    as="select"
                                    
                                    defaultValue={complaint.lab_id}
                                    className="form-control"
                                    readOnly={true}
                                    multiple={false}
                                    required={true} // Make the field required

                                  >
                                    <option
                                      key={complaint.lab_id}
                                      value={complaint.lab_id}
                                    >
                                      {complaint.name}
                                    </option>
                                  </Field>
                                </div>
                              ) : (
                                <div className="mb-3 select2-container">
                                  <Label>Lab Name</Label>
                                  <Select
                                    name="lab_id"
                                    component="Select"
                                    required={true}
                                    onChange={selectedGroup =>
                                      this.setState({
                                        lab_id: selectedGroup.value,
                                      })
                                    }
                                    className={
                                      "defautSelectParent" +
                                      (!this.state.lab_id ? " is-invalid" : "")
                                    }
                                    styles={{
                                      control: (base, state) => ({
                                        ...base,
                                        borderColor: !this.state.lab_id
                                          ? "#f46a6a"
                                          : "#ced4da",
                                      }),
                                    }}
                                    options={labList}
                                    placeholder="Select Lab..."
                                  />

                                  <div className="invalid-feedback">
                                    Please select lab
                                  </div>

                                </div>

                              )

                            ) : null}
                          {this.state.complainee === "LabHazir" && (
  <div className="mb-3">
    <Label for="labhazir_complainee" className="form-label">
      Select Department
    </Label>
    <Field
      name="labhazir_complainee"
      component="select"
      onChange={e =>
        this.setState({
          labhazir_complainee: e.target.value,
        })
      }
      value={this.state.labhazir_complainee}
      className={
        "form-select" +
        (errors.labhazir_complainee && touched.labhazir_complainee
          ? " is-invalid"
          : "")
      }
    >
      <option value="">Please Select Department..</option>
      <option value="Customer Service Representative">
        Customer Service Representative
      </option>
      <option value="Accounts">Accounts</option>
      <option value="Marketing">Marketing</option>
      <option value="Auditor">Auditor</option>
      <option value="Others">Others</option>
    </Field>
    <ErrorMessage
      name="labhazir_complainee"
      component="div"
      className="invalid-feedback"
    />
  </div>
)}

                            
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="name">Name</Label>
                                <Input
                                  name="name"
                                  type="text"
                                  id="name"
                                  placeholder="Enter your name"
                                  onChange={e =>
                                    this.setState({ name: e.target.value })
                                  }
                                  value={this.state.name}
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
                            </Col>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="email">Email</Label>
                                <Input
                                  name="email"
                                  type="email"
                                  id="email"
                                  placeholder="Enter your email address"
                                  onChange={e =>
                                    this.setState({ email: e.target.value })
                                  }
                                  value={this.state.email}
                                  className={
                                    "form-control" +
                                    (errors.email && touched.email
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>

                            </Col>
                          </Row>

                          <Row>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="phoneno">Mobile No.</Label>
                                <Input
                                  name="phone"
                                  type="text"
                                  id="phone"
                                  placeholder="Enter your mobile no."
                                  onChange={e =>
                                    this.setState({ phone: e.target.value })
                                  }
                                  value={this.state.phone}
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
                            </Col>
                            <Col lg="6">
                            <div className="mb-3">
                              <Label for="city" className="form-label">
                                City
                              </Label>
                              <Select
                                name="city"
                                component="Select"
                                onChange={selectedGroup =>
                                  this.setState({
                                    city: selectedGroup.value,
                                  })
                                }
                                placeholder="Select City..."
                                className={
                                  "defautSelectParent" +
                                  (!this.state.city ? " is-invalid" : "")
                                }
                                options={
                                  cityList
                                }
                                // defaultValue={{
                                //   label:
                                //     this.state.city,
                                //   value:
                                //     this.state.office,
                                // }}
                                styles={{
                                  control: (base, state) => ({
                                    ...base,
                                    borderColor: !this.state.city
                                      ? "#f46a6a"
                                      : "#ced4da",
                                  }),
                                }}

                              />

                                  <div className="invalid-feedback">
                                    Please select City
                                  </div>
                            </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="12">
                              <div className="mb-3">
                                <Label for="address">Message</Label>
                                <textarea
                                  name="message"
                                  id="message"
                                  rows="2"
                                  cols="5"
                                  placeholder="Enter your message"
                                  onChange={e =>
                                    this.setState({
                                      message: e.target.value,
                                    })
                                  }
                                  value={this.state.message}
                                  className={
                                    "form-control" +
                                    (errors.message && touched.message
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="message"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                              <div className="text-end">
                                <button
                                  type="submit"
                                  className="btn btn-success save-user"
                                  disabled={this.state.complaintSuccess}
                                >
                                  Submit
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

Contact.propTypes = {
  match: PropTypes.object,
  className: PropTypes.any,
  complaint: PropTypes.any,
  labs: PropTypes.array,
  onGetlabs: PropTypes.func,
  onAddNewComplaint: PropTypes.func,
  addNewComplaint: PropTypes.func,
  onGetTerritoriesList: PropTypes.func,
  territoriesList: PropTypes.array,
};
const mapStateToProps = ({ complaints, territoriesList }) => ({
  complaint: complaints.complaint,
  labs: complaints.labs,
  territoriesList: territoriesList.territoriesList,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  onAddNewComplaint: complaint => dispatch(addNewComplaint(complaint)),
  onGetlabs: () => dispatch(getLabs()),
  onGetTerritoriesList: id => dispatch(getTerritoriesList(id)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Contact));
