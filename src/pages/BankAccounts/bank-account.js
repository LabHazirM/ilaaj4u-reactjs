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
  getBanks,
  addNewBankAccount,
  getBankAccounts
} from "store/bankaccount/actions";

import { CITIES, DISTRICTS } from "helpers/global_variables_helper";


class DonorPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankAccounts: [],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
        complaintSuccess:"",
      bank_id: "",
      account_no: "",
      categorey: "",
      account_type:"",
      currency: "",
      opening_balance: "",
      creating_at: "",
      status: "",
      isDisabled: true,
      isRequiredFilled: true,
      bankAccount: "",
      checkedoutData: "",
      city: "",
      address: "",
      branch_no: "",
      selectedGroup: null,
    };
    this.handleSelectGroup = this.handleSelectGroup.bind(this);
  }

  handleSelectGroup = selectedGroup => {
    this.setState({ selectedGroup });
  };

  handleProceedClick = () => {
    this.setState({
      bankAccount: {
        bank_id: this.state.bank_id,
        account_no: this.state.account_no,
        categorey: this.state.categorey,
        account_type: this.state.account_type,
        currency: this.state.currency,
        opening_balance: this.state.opening_balance,
        creating_at: this.state.creating_at,
        status: this.state.status,
        city: this.state.city,
        address: this.state.address,
        branch_no: this.state.branch_no,
      },
    });
    const { onAddBankAccountData } = this.props;
    setTimeout(() => {
      console.log(
        onAddBankAccountData(this.state.bankAccount, this.state.user_id)
      );
    }, 2000);
     // If no error messages then show wait message
     setTimeout(() => {
      if (this.state.bankAccount) {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        this.setState({
          complaintSuccess:
            "Bank Account Added Successfully",
        });
      }
    }, 1000);
    setTimeout(() => {
      this.setState({
        complaintSuccess: "",
        bank_id: "",
      account_no: "",
      categorey: "",
      account_type:"",
      currency: "",
      opening_balance: "",
      creating_at: "",
      status: "",
      city: "",
      address: "",
      branch_no: "",
      });
    }, 4000);
    setTimeout(() => {
      if (this.state.bankAccount) {
        this.props.history.push("/bankaccounts-list");
      }
    }, 3000)
    
  };

  componentDidMount() {
    const { banks, onGetbanks } = this.props;
    if (banks && !banks.length) {
      onGetbanks();
    }
    this.setState({ banks });

    const { bankAccounts, onGetBankAccounts } = this.props;
    if (bankAccounts && !bankAccounts.length) {
      onGetBankAccounts(this.props.match.params.id);
    }
    this.setState({ bankAccounts });
  }


  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {

    const { bankAccounts } = this.props;
    if (
      isEmpty(prevProps.bankAccounts) &&
      !isEmpty(bankAccounts) &&
      size(bankAccounts) !== size(prevProps.bankAccounts)
    ) {
      this.setState({ bankAccounts });
    }
  }

  render() {
    const { banks } = this.props;
    const { bankAccounts } = this.props;
    const bankAccount = this.state.bankAccount;



    const bankList = [];
    for (let i = 0; i < banks.length; i++) {
      let flag = 0;
      // for (let j = 0; j < bankAccounts.length; j++) {
      //   if (banks[i].id == bankAccounts[j].bank_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
        bankList.push({
          label: banks[i].name,
          value: banks[i].id,
        });
      }
    }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Create Bank Account | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs title="Create" breadcrumbItem="Create Bank Account" />
            {this.state.complaintSuccess && (
              <Alert color="success" className="col-md-8">
                {this.state.complaintSuccess}
              </Alert>
            )}
            <Formik>
              <div className="checkout-tabs">
                <Row>
                  <Col lg="1" sm="1">
                  </Col>
                  <Col lg="10" sm="9">
                    {!this.state.isRequiredFilled ? (
                      <Alert color="danger" className="col-md-5">
                        Please fill the required fields.
                      </Alert>
                    ) : null}

                    <Card>
                      <CardBody>
                        <div>

                          <CardTitle className="h4">
                            {/* Bank Account Information */}
                          </CardTitle>
                          <p className="card-title-desc">
                          <b>Fill in the necessary Information to create a Bank Account.</b>
                                                    </p>
                          <FormGroup className="mb-4" row>
                            {/* Make field readonly in case of edit form */}
                            {bankAccount.bank_id &&
                              bankAccount.bank_id ? (
                              <div className="mb-3">
                                 <Label
                                   htmlFor="patient-name"
                                   md="2"
                                   className="col-form-label"
                                 >
                                  Bank Name</Label>
                                <Col md="10">

                                <Field
                                  name="bank_id"
                                  as="select"
                                  defaultValue={
                                    bankAccount.bank_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      bankAccount.bank_id
                                    }
                                    value={
                                      bankAccount.bank_id
                                    }
                                  >
                                    {
                                      bankAccount.bank_name
                                    }
                                  </option>
                                </Field>
                                </Col>
                              </div>
                            ) : (
                              <div className="mb-3 select2-container">
                                <Label
                                   htmlFor="patient-name"
                                   md="2"
                                   className="col-form-label"
                                 >
                                  Bank Name</Label>
                                <Col md="10">

                                <Select
                                  name="bank_id"
                                  component="Select"
                                  onChange={selectedGroup =>
                                    this.setState({
                                      bank_id:
                                        selectedGroup.value,
                                    })
                                  }
                                  className={
                                    "defautSelectParent" +
                                    (!this.state.bank_id
                                      ? " is-invalid"
                                      : "")
                                  }
                                  styles={{
                                    control: (
                                      base,
                                      state
                                    ) => ({
                                      ...base,
                                      borderColor: !this
                                        .state.bank_id
                                        ? "#f46a6a"
                                        : "#ced4da",
                                    }),
                                  }}
                                  options={bankList}
                                  placeholder="Select Bank..."
                                />
                                <div className="invalid-feedback">
                                  Please select your Bank
                                </div>
                                </Col>
                              </div>
                            )}
                          </FormGroup>
                          <FormGroup className="mb-4" row>
                            <Label
                              htmlFor="name"
                              md="2"
                              className="col-form-label"
                            >
                              Account No
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Col md="10">
                            <Input
                                            type="text"
                                            className="form-control"
                                            id="cardnumberInput"
                                            placeholder="0000 0000 0000 0000"
                                            name="account_no"
                                            onChange={e =>
                                              this.setState({
                                                account_no: e.target.value,
                                              })
                                            }
                                          />
                            </Col>
                          </FormGroup>
                          <FormGroup className="mb-4" row>
                            <Label
                              htmlFor="name"
                              md="2"
                              className="col-form-label"
                            >
                              Account Type
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Col md="10">
                            <select
                              name="account_type"
                              component="select"
                              onChange={e =>
                                this.setState({
                                  account_type: e.target.value,
                                })
                              }
                              defaultValue={this.state.account_type}
                              className="form-select"
                            >
                              <option
                                value=""
                              >
                                --- Please select the Account Type                                ---
                              </option>
                              <option value="LABHAZIR">Labhazir</option>
                              <option value="DONATION">Donation</option>

                            </select>
                            </Col>
                          </FormGroup>
                          <FormGroup className="mb-4" row>
                            <Label
                              htmlFor="name"
                              md="2"
                              className="col-form-label"
                            >
                              Categorey
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Col md="10">
                            <select
                              name="categorey"
                              component="select"
                              onChange={e =>
                                this.setState({
                                  categorey: e.target.value,
                                })
                              }
                              defaultValue={this.state.categorey}
                              className="form-select"
                            >
                              <option
                                value=""
                              >
                                --- Please select the Categorey
                                ---
                              </option>
                              <option value="PERSONAL">Personal</option>
                              <option value="SAVING">Saving</option>
                              <option value="CURRENT">Current</option>

                            </select>
                            </Col>
                          </FormGroup>

                          <FormGroup className="mb-4" row>
                            <Label
                              htmlFor="name"
                              md="2"
                              className="col-form-label"
                            >
                              Currency
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Col md="10">
                            <select
                              name="currency"
                              component="select"
                              onChange={e =>
                                this.setState({
                                  currency: e.target.value,
                                })
                              }
                              defaultValue={this.state.currency}
                              className="form-select"
                            >
                              {/* <option
                                value=""
                              >
                                --- Please select the C
                                ---
                              </option> */}
                              <option value="RUPEESS">Rs</option>
                              <option value="DOLLAR">Dollar</option>
                              <option value="EURO">Euro</option>
                            </select>
                            </Col>
                          </FormGroup>
                          
                              <FormGroup className="mb-4" row>
                                <Label md="2" className="col-form-label">
                                Opening Balance
                                  <span
                                    style={{ color: "#f46a6a" }}
                                    className="font-size-18"
                                  >
                                    *
                                  </span>
                                </Label>
                                <Col md={10}>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="opening_balance"
                                    min="0"
                                    // max="150"
                                    placeholder="Enter your Account Opening Balance"
                                    onChange={e =>
                                      this.setState({
                                        opening_balance: e.target.value,
                                      })
                                    }
                                  />
                                </Col>
                              </FormGroup>
                              <FormGroup className="mb-4" row>
                                <Label
                                  htmlFor="patient-name"
                                  md="2"
                                  className="col-form-label"
                                >
                                  Bank City
                                  <span
                                    style={{ color: "#f46a6a" }}
                                    className="font-size-18"
                                  >
                                    *
                                  </span>
                                </Label>
                                <Col md="10">
                                  <Select
                                    name="city"
                                    component="Select"
                                    onChange={selectedGroup =>
                                      this.setState({
                                        city: selectedGroup.value,
                                      })
                                    }
                                    className="defautSelectParent"
                                   options={CITIES}
                                    placeholder="Select City..."
                                  />
                                </Col>
                              </FormGroup>
                              <FormGroup className="mb-4" row>
                                <Label
                                  htmlFor="address"
                                  md="2"
                                  className="col-form-label"
                                >
                                  Bank Address
                                  <span
                                    style={{ color: "#f46a6a" }}
                                    className="font-size-18"
                                  >
                                    *
                                  </span>
                                </Label>
                                <Col md="10">
                                  <Input
                                    type="text"
                                    className="form-control"
                                    name="address"
                                    placeholder="Enter your complete address"
                                    onChange={e =>
                                      this.setState({
                                        address: e.target.value,
                                      })
                                    }
                                  />
                                </Col>
                              </FormGroup>
                              <FormGroup className="mb-4" row>
                                <Label md="2" className="col-form-label">
                                Branch Code
                                  <span
                                    style={{ color: "#f46a6a" }}
                                    className="font-size-18"
                                  >
                                    *
                                  </span>
                                </Label>
                                <Col md={10}>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="branch_no"
                                    min="0"
                                    max="150"
                                    placeholder="Enter your Bank Branch Code"
                                    onChange={e =>
                                      this.setState({
                                        branch_no: e.target.value,
                                      })
                                    }
                                  />
                                </Col>
                              </FormGroup>      

                        </div>
                        {/* </TabPane>
                        </TabContent> */}
                      </CardBody>
                    </Card>
                    <Row className="mt-4">
                      <Col sm="6">
                      </Col>
                      <Col sm="6">
                        <div className="text-end">
                          <button
                            component={Link}
                            onClick={this.handleProceedClick}
                            className="btn btn-success mb-4"
                          >
                            <i className="mdi mdi-truck-fast me-1" /> Create{" "}
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

DonorPayment.propTypes = {
  match: PropTypes.object,
  banks: PropTypes.array,
  history: any,
  bankAccounts: PropTypes.array,
  onGetbanks: PropTypes.func,
  // onGetDonorPaymentItems: PropTypes.func,
  onAddBankAccountData: PropTypes.func,
  bankAccount: PropTypes.array,
  onGetBankAccounts: PropTypes.array,
};

const mapStateToProps = ({ bankAccount }) => ({
  bankAccounts: bankAccount.bankAccounts,
  bankAccount: bankAccount.bankAccount,
  banks: bankAccount.banks,


});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetbanks: () => dispatch(getBanks()),
  onGetBankAccounts: id => dispatch(getBankAccounts(id)),
  onAddBankAccountData: (bankAccount, id) =>
    dispatch(addNewBankAccount(bankAccount, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DonorPayment));

