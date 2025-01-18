import React, { Component } from "react";
import Select from "react-select";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { any } from "prop-types";
import { Field, Formik } from "formik";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Table,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  Form,
  FormGroup,
  Label,
  CardBody,
  CardTitle,
  Alert,
} from "reactstrap";

import classnames from "classnames";

import { isEmpty, map, size } from "lodash";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import {
  addNewB2bPayment,
} from "store/b2bcheckout/actions";

class B2bPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      b2bPayments: [],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      // b2b_name: "",
      address_type: "",
      address: "",
      amount: "",
      paid_at: "",
      deposited_at: "",
      deposit_bank: "",
      payment_method: "Card",
      card_number: "",
      name_on_card: "",
      expiry_date: "",
      cvv_code: "",
      cheque_no: "",
      cheque_image: "",
      deposit_slip: "",
      is_cleared: "",
      cleared_at: "",
      is_settled: "",
      isDisabled: true,
      isRequiredFilled: true,
      b2bPayment: "", 
      checkedoutData: "",
      activeTab: "1",
      selectedGroup: null,
    };
    this.toggleTab = this.toggleTab.bind(this);
    this.handleSelectGroup = this.handleSelectGroup.bind(this);
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  handleSelectGroup = selectedGroup => {
    this.setState({ selectedGroup });
  };

  handleProceedClick = () => {
    const canProceed = this.checkForValidations();
    if (canProceed) {
      console.log("Can call API......");
      this.setState({
        b2bPayment: {
          amount: this.state.amount,
          payment_method: this.state.payment_method,
          card_number: this.state.card_number,
          name_on_card: this.state.name_on_card,
          expiry_date: this.state.expiry_date,
          cvv_code: this.state.cvv_code,
          address_type: this.state.address_type,
          address: this.state.address,
          paid_at: this.state.paid_at,
          deposited_at: this.state.deposited_at,
          deposit_bank: this.state.deposit_bank,
          cheque_no: this.state.cheque_no,
          cheque_image: this.state.cheque_image,
          deposit_slip: this.state.deposit_slip,
          is_cleared: this.state.is_cleared,
          cleared_at: this.state.cleared_at,
          is_settled: this.state.is_settled,
        },
      });

      // API call to get the checkout items
      const { onAddB2bPaymentData } = this.props;
      setTimeout(() => {
        console.log(
          onAddB2bPaymentData(this.state.b2bPayment, this.state.user_id)
        );
      }, 2000);

      setTimeout(() => {
        this.setState({ b2bPayment: this.props.b2bPayment });

        // If checkout operation is successful.
        if (this.props.b2bPayment) {
          this.props.history.push("/b2b-appointment");
        }
      }, 2000);
    }
  };

  checkForValidations = () => {
    // Check if patient's name, age and appointment Booked for is filled
    if (
      this.state.amount
    ) {
      // Check if card information is filled in case of payment method is Card
      if (this.state.payment_method == "Card") {
        if (
          this.state.card_number &&
          this.state.name_on_card &&
          this.state.expiry_date &&
          this.state.cvv_code
        ) {
          this.setState({ isRequiredFilled: true });
          return true;
        } else {
          this.setState({ isRequiredFilled: false });
          return false;
        }
      }
      // If patient's payment method is not Card (Cash) then set isRequiredFilled to true
      else {
        this.setState({ isRequiredFilled: true });
        return true;
      }
    } else {
      this.setState({ isRequiredFilled: false });
      return false;
    }
  };

  // componentDidMount() {

  // // API call to get the checkout items
  // const { onGetB2bPaymentItems } = this.props;
  // setTimeout(() => {
  // onGetB2bPaymentItems(this.state.user_id, "Yes");
  // }, 1000);

  // setTimeout(() => {
  // this.setState({ b2bPayments: this.props.b2bPayments });
  // }, 2000);
  // }
  // componentDidMount() {
  //   // API call to get the checkout items
  //   const { onGetB2bPaymentItems } = this.props;
  //   onGetB2bPaymentItems(this.state.user_id, "Yes");
  //   this.setState({ b2bPayments: this.props.b2bPayments });
  // }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {

    const { b2bPayments } = this.props;
    if (
      isEmpty(prevProps.b2bPayments) &&
      !isEmpty(b2bPayments) &&
      size(b2bPayments) !== size(prevProps.b2bPayments)
    ) {
      this.setState({ b2bPayments });
    }

    // Timeout functions to hide alerts after sometime......
    // setTimeout(() => {
    // this.setState({ isRequiredFilled: true });
    // }, 10000);
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>B2bPayment | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs title="Test" breadcrumbItem="B2bPayment" />
            <Formik>
              <div className="checkout-tabs">
                <Row>
                  <Col lg="2" sm="3">
                    <Nav className="flex-column" pills>
                      {/* <NavItem>
<NavLink
className={classnames({
active: this.state.activeTab === "1",
})}
onClick={() => {
this.toggleTab("1");
}}
>
<i className="bx bx-user d-block check-nav-icon mt-4 mb-2" />
<p className="font-weight-bold mb-4">B2b Info</p>
</NavLink>
</NavItem> */}

                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: this.state.activeTab === "1",
                          })}
                          onClick={() => {
                            this.toggleTab("1");
                          }}
                        >
                          <i className="bx bx-money d-block check-nav-icon mt-4 mb-2" />
                          <p className="font-weight-bold mb-4">Payment Info</p>
                        </NavLink>
                      </NavItem>
                      {/* <NavItem>
<NavLink
className={classnames({
active: this.state.activeTab === "3",
})}
onClick={() => {
this.toggleTab("3");
}}
>
<i className="bx bx-badge-check d-block check-nav-icon mt-4 mb-2" />
<p className="font-weight-bold mb-4">Confirmation</p>
</NavLink>
</NavItem> */}
                    </Nav>
                  </Col>
                  <Col lg="10" sm="9">
                    {!this.state.isRequiredFilled ? (
                      <Alert color="danger" className="col-md-5">
                        Please fill the required fields.
                      </Alert>
                    ) : null}

                    <Card>
                      <CardBody>
                        <TabContent activeTab={this.state.activeTab}>
                          <TabPane
                            tabId="1"
                            id="v-pills-payment"
                            role="tabpanel"
                            aria-labelledby="v-pills-payment-tab"
                          >
                            <div>
                              <CardTitle className="h4">
                                Payment information
                              </CardTitle>
                              <p className="card-title-desc">
                                Fill the card payment only if your payment method
                                is card
                              </p>
                              <div>
                                <div className="form-check form-check-inline font-size-16">
                                  <Input
                                    type="radio"
                                    value="Cash"
                                    name="payment_method"
                                    id="customRadioInline1"
                                    className="form-check-input"
                                    onChange={e =>
                                      this.setState({
                                        payment_method: e.target.value,
                                      })
                                    }
                                  />
                                  <Label
                                    className="form-check-label font-size-13"
                                    htmlFor="customRadioInline1"
                                  >
                                    <i className="far fa-money-bill-alt me-1 font-size-20 align-top" />{" "}
                                    Cash on Spot
                                  </Label>
                                </div>

                                <div className="form-check form-check-inline font-size-16">
                                  <Input
                                    type="radio"
                                    value="Cheque"
                                    defaultChecked
                                    id="customRadioInline2"
                                    name="payment_method"
                                    className="form-check-input"
                                    onChange={e =>
                                      this.setState({
                                        payment_method: e.target.value,
                                      })
                                    }
                                  />
                                  <Label
                                    className="form-check-label font-size-13"
                                    htmlFor="customRadioInline2"
                                  >
                                    <i className="fab fa-cc-mastercard me-1 font-size-20 align-top" />{" "}
                                    Cheque
                                  </Label>
                                </div>
                                <div className="form-check form-check-inline font-size-16">
                                  <Input
                                    type="radio"
                                    value="Card"
                                    defaultChecked
                                    id="customRadioInline2"
                                    name="payment_method"
                                    className="form-check-input"
                                    onChange={e =>
                                      this.setState({
                                        payment_method: e.target.value,
                                      })
                                    }
                                  />
                                  <Label
                                    className="form-check-label font-size-13"
                                    htmlFor="customRadioInline2"
                                  >
                                    <i className="fab fa-cc-mastercard me-1 font-size-20 align-top" />{" "}
                                    Credit / Debit Card
                                  </Label>
                                </div>
                              </div>

                              <FormGroup className="mb-0">
                                <Label htmlFor="cardnumberInput">
                                  Amount
                                  <span
                                    style={{ color: "#f46a6a" }}
                                    className="font-size-18"
                                  >
                                    *
                                  </span>
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="cardnumberInput"
                                  placeholder="Enter Amount"
                                  name="amount"
                                  onChange={e =>
                                    this.setState({
                                      amount: e.target.value,
                                    })
                                  }
                                />
                              </FormGroup>

                              {this.state.payment_method == "Card" ? (
                                <div>
                                  <h5 className="mt-5 mb-3 font-size-15">
                                    For card Payment
                                  </h5>
                                  <div className="p-4 border">
                                    <Form>
                                      <FormGroup className="mb-0">
                                        <Label htmlFor="cardnumberInput">
                                          Card number
                                          <span
                                            style={{ color: "#f46a6a" }}
                                            className="font-size-18"
                                          >
                                            *
                                          </span>
                                        </Label>
                                        <Input
                                          type="text"
                                          className="form-control"
                                          id="cardnumberInput"
                                          placeholder="0000 0000 0000 0000"
                                          name="card_number"
                                          onChange={e =>
                                            this.setState({
                                              card_number: e.target.value,
                                            })
                                          }
                                        />
                                      </FormGroup>
                                      <Row>
                                        <Col lg="6">
                                          <FormGroup className="mt-4 mb-0">
                                            <Label htmlFor="cardnameInput">
                                              Name on card
                                              <span
                                                style={{ color: "#f46a6a" }}
                                                className="font-size-18"
                                              >
                                                *
                                              </span>
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="cardnameInput"
                                              placeholder="Name on Card"
                                              name="name_on_card"
                                              onChange={e =>
                                                this.setState({
                                                  name_on_card: e.target.value,
                                                })
                                              }
                                            />
                                          </FormGroup>
                                        </Col>
                                        <Col lg="3">
                                          <FormGroup className=" mt-4 mb-0">
                                            <Label htmlFor="expirydateInput">
                                              Expiry date
                                              <span
                                                style={{ color: "#f46a6a" }}
                                                className="font-size-18"
                                              >
                                                *
                                              </span>
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="expirydateInput"
                                              placeholder="MM/YY"
                                              name="expiry_date"
                                              onChange={e =>
                                                this.setState({
                                                  expiry_date: e.target.value,
                                                })
                                              }
                                            />
                                          </FormGroup>
                                        </Col>
                                        <Col lg="3">
                                          <FormGroup className="mt-4 mb-0">
                                            <Label htmlFor="cvvcodeInput">
                                              CVV code
                                              <span
                                                style={{ color: "#f46a6a" }}
                                                className="font-size-18"
                                              >
                                                *
                                              </span>
                                            </Label>
                                            <Input
                                              type="text"
                                              className="form-control"
                                              id="cvvcodeInput"
                                              placeholder="Enter CVV Code"
                                              name="cvv_code"
                                              onChange={e =>
                                                this.setState({
                                                  cvv_code: e.target.value,
                                                })
                                              }
                                            />
                                          </FormGroup>
                                        </Col>
                                      </Row>
                                    </Form>
                                  </div>
                                </div>
                              ) : null}

                              {this.state.payment_method == "Cheque" ? (
                                <div>
                                  <h5 className="mt-5 mb-3 font-size-15">
                                    For Cheque Payment
                                  </h5>
                                  <div className="p-4 border">
                                    <Form>
                                      <FormGroup className="mb-0">
                                        <Label htmlFor="cardnumberInput">
                                          Choose Address
                                          <span
                                            style={{ color: "#f46a6a" }}
                                            className="font-size-18"
                                          >
                                            *
                                          </span>
                                        </Label>
                                        <select
                                          name="Cheque"
                                          component="select"
                                          onChange={e =>
                                            this.setState({
                                              Cheque: e.target.value,
                                            })
                                          }
                                          defaultValue={this.state.Cheque}
                                          className="form-select"
                                        >
                                          <option
                                            value=""
                                          >
                                            --- Please select the Type
                                            ---
                                          </option>
                                          <option value="Pick_from">Pick From</option>
                                          <option value="Deliever_to">Deliever To</option>
                                        </select>
                                      </FormGroup>

                                      {this.state.Cheque == "Pick_from" ? (
                                        <div className="mb-3">
                                          <Label
                                            for="Pick_from"
                                            className="form-label"
                                          >
                                            Pick From
                                          </Label>
                                          <Input
                                            type="text"
                                            className="form-control"
                                            id="Pick_from"
                                            placeholder="Enter Pick From Address"
                                            name="Pick_from"
                                            onChange={e =>
                                              this.setState({
                                                Pick_from: e.target.value,
                                              })
                                            }
                                          />
                                        </div>
                                      ) : null}

                                      {this.state.Cheque == "Deliever_to" ? (
                                        <div className="mb-3">
                                          <Label
                                            for="Deliever_to"
                                            className="form-label"
                                          >
                                            Delivered To
                                          </Label>
                                          <Input
                                            type="text"
                                            className="form-control"
                                            id="Deliever_to"
                                            name="Deliever_to"
                                            value="House # 339A Main Peshawar Rd, Westridge 1, Rawalpindi, Punjab 46000"
                                          // onChange={e =>
                                          // this.setState({
                                          // picked_from: e.target.value,
                                          // })
                                          // }
                                          />
                                        </div>
                                      ) : null}

                                    </Form>
                                  </div>
                                </div>

                              ) : null}

                              {this.state.payment_method == "Cash" ? (
                                <div>
                                  <h5 className="mt-5 mb-3 font-size-15">
                                    For Cash Payment
                                  </h5>
                                  <div className="p-4 border">
                                    <Form>
                                      <FormGroup className="mb-0">
                                        <Label htmlFor="cardnumberInput">
                                          Choose Address
                                          <span
                                            style={{ color: "#f46a6a" }}
                                            className="font-size-18"
                                          >
                                            *
                                          </span>
                                        </Label>
                                        <Field
                                          name="Cash"
                                          component="select"
                                          onChange={e =>
                                            this.setState({
                                              Cash: e.target.value,
                                            })
                                          }
                                          defaultValue={this.state.Cash}
                                          className="form-select"
                                        >
                                          <option
                                            value=""
                                          >
                                            --- Please select the Type
                                            ---
                                          </option>
                                          <option value="Pick_from">Pick From</option>
                                          <option value="Deliever_to">Delivered to</option>
                                        </Field>
                                      </FormGroup>

                                      {this.state.Cash == "Pick_from" ? (
                                        <div className="mb-3">
                                          <Label
                                            for="Pick_from"
                                            className="form-label"
                                          >
                                            Pick From
                                          </Label>
                                          <Input
                                            type="text"
                                            className="form-control"
                                            id="Pick_from"
                                            placeholder="Enter Pick From Address"
                                            name="cvv_code"
                                            onChange={e =>
                                              this.setState({
                                                Pick_from: e.target.value,
                                              })
                                            }
                                          />
                                        </div>
                                      ) : null}

                                      {this.state.Cash == "Deliever_to" ? (
                                        <div className="mb-3">
                                          <Label
                                            for="Deliever_to"
                                            className="form-label"
                                          >
                                            Delivered To
                                          </Label>
                                          <Input
                                            type="text"
                                            className="form-control"
                                            id="Deliever_to"
                                            name="Deliever_to"
                                            value="House # 339A Main Peshawar Rd, Westridge 1, Rawalpindi, Punjab 46000"
                                          // onChange={e =>
                                          // this.setState({
                                          // picked_from: e.target.value,
                                          // })
                                          // }
                                          />
                                        </div>
                                      ) : null}

                                    </Form>

                                  </div>
                                </div>
                              ) : null}

                            </div>
                          </TabPane>
                        </TabContent>
                      </CardBody>
                    </Card>
                    <Row className="mt-4">
                      <Col sm="6">
                        {/* <Link
to="/cart"
className="btn text-muted d-none d-sm-inline-block btn-link"
>
<i className="mdi mdi-arrow-left me-1" /> Back to-
Shopping Cart{" "}
</Link> */}
                      </Col>
                      <Col sm="6">
                        <div className="text-end">
                          <button
                            component={Link}
                            onClick={this.handleProceedClick}
                            to="/b2b-appointment"
                            className="btn btn-success mb-4"
                          >
                            <i className="mdi mdi-truck-fast me-1" /> Proceed to
                            Shipping{" "}
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Formik>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

B2bPayment.propTypes = {
  match: PropTypes.object,
  history: any,
  b2bPayments: PropTypes.array,
  // onGetB2bPaymentItems: PropTypes.func,
  onAddB2bPaymentData: PropTypes.func,
  b2bPayment: PropTypes.array,
};

// const mapStateToProps = state => ({
//   b2bPayments: state.b2bcheckout.b2bPayments,
//   checkedoutData: state.b2bcheckout.checkedoutData,
// });
const mapStateToProps = ({ b2bPayments }) => ({
  b2bPayments: b2bPayments.b2bPayments,
  b2bPayment: b2bPayments.b2bPayment,

});

const mapDispatchToProps = (dispatch, ownProps) => ({

  onAddB2bPaymentData: (b2bPayment, id) =>
    dispatch(addNewB2bPayment(b2bPayment, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(B2bPayment));

