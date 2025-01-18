import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import { Collapse } from "reactstrap";
import logo from "../../../assets/images/logo.svg";
import logoLight from "../../../assets/images/logo-light.png";
import logoLightSvg from "../../../assets/images/logo-light.svg";
import StarRatings from "react-star-ratings";
import Tooltip from "@material-ui/core/Tooltip";


//i18n
import { withTranslation } from "react-i18next";
import "../../../components/HorizontalLayout/horizontal-navbar.scss";


import ScrollButton from "components/Common/Scrollbutton";
import {
  Card,
  Button,
  CardBody,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Col,
  Input,
  Container,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Alert,
} from "reactstrap";

import { isEmpty, map, size } from "lodash";

import "nouislider/distribute/nouislider.css";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { any } from "prop-types";

import { getCOfferedRadiologysReferrel } from "store/offered-tests/actions";
import { addToCart } from "store/actions";
import { getCarts } from "store/carts/actions";

class TestsOffered extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).user_id
      : "",
      user_type: localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).account_type
      : "",
      patient_name: localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).patient_name
      : "",
      position: "right",
      activeTab: "1",
      offeredTests: [],
      carts: [],
      cart: "",
      success: "",
      error: "",
      testtype: "test",
      applied: true,
      loading: true, // Add loading state property
      page: 1,
      searchQuery: "", // New state property for search query
      totalPage: 5, //replace this with total pages of data
      itemsInCart: [],
    };
    this.toggleTab = this.toggleTab.bind(this);
    console.log("yaha ani chahi hai uuid", this.props.match.params.uuid)
    console.log("yaha ani chahi hai guid", this.props.match.params.guest_id)
    console.log("yaha ani chahi hai fuid", this.props.match.params.filnalurl)

  }

  componentDidMount() {
    const { carts, onGetCarts } = this.props;
    onGetCarts(this.state.user_id);
    this.setState({
      carts
    });
    const { ongetCOfferedRadiologysReferrel } = this.props;
    if (this.state.applied) {
      ongetCOfferedRadiologysReferrel();
      this.setState({ offeredTests: this.props.offeredTests });
    }
    setTimeout(() => {
      this.setState({ loading: false });
    }, 70000); // Set loading state to false after 7 seconds
  }
  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  handlePageClick = page => {
    this.setState({ page });
  };
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      test_details: arg.test_details,
    });
  };

  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  openDescriptionModal = (e, arg) => {
    this.setState({
      DescriptionModal: true,
      description_in_english: arg.description_in_english,
      description_in_urdu: arg.description_in_urdu,
      test_details: arg.test_details,
      test_name:arg.test_name,
    });
  };

  toggleDescriptionModal = () => {
    this.setState(prevState => ({
      DescriptionModal: !prevState.DescriptionModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };

  handleAddToCart = (cart) => {
    const { onAddToCart } = this.props;
  
    // Check if the item is already in the cart based on user type
    if (!this.state.user_id) {
      // Check if the item is already in the cart
      if (cart.guest_id === this.props.match.params.guest_id) {
        this.showErrorMessage("Item is already added to the cart");
        return;
      }
  
      this.setState({ guest_id: this.props.match.params.guest_id });
      cart.guest_id = this.props.match.params.guest_id;
      onAddToCart(cart, cart.guest_id);
  
      console.log("uuid:", cart.guest_id, this.props.match.params.guest_id);
    } else if (this.state.user_type !== "CSR" && this.state.user_type !== "b2bclient") {
      // Check if the item is already in the cart
      if (cart.user_id === this.state.user_id) {
        this.showErrorMessage("Item is already added to the cart");
        return;
      }
  
      onAddToCart(cart, this.state.user_id);
    } else if (this.state.user_type === "CSR" && this.state.user_type !== "b2bclient") {
      // Check if the item is already in the cart
      if (cart.guest_id === this.props.match.params.guest_id) {
        this.showErrorMessage("Item is already added to the cart");
        return;
      }
  
      onAddToCart(cart, this.props.match.params.guest_id);
    } else if (this.state.user_type === "b2bclient" && this.state.user_type !== "CSR") {
      // Check if the item is already in the cart
      if (cart.user_id === this.state.user_id) {
        this.showErrorMessage("Item is already added to the cart");
        return;
      }
  
      onAddToCart(cart, this.props.match.params.uuid);
    }
  
    // Update the state to include the newly added item in the cart
    const updatedItemsInCart = [...this.state.itemsInCart, cart];
    this.setState({ itemsInCart: updatedItemsInCart });
  
    this.showSuccessMessage("Item added Successfully");
  };
  
  showErrorMessage = (message) => {
    this.showPopup(message, "red");
  };
  
  showSuccessMessage = (message) => {
    this.showPopup(message, "green");
  };
  
  showPopup = (message, textColor) => {
    // Create and style the popup
    const popup = document.createElement("div");
    popup.style.display = "none";
    popup.style.position = "fixed";
    popup.style.top = "0";
    popup.style.left = "0";
    popup.style.width = "100%";
    popup.style.height = "100%";
    popup.style.background = "rgba(0, 0, 0, 0.5)";
    popup.style.zIndex = "1000";
  
    const popupContent = document.createElement("div");
    popupContent.style.position = "absolute";
    popupContent.style.top = "50%";
    popupContent.style.left = "50%";
    popupContent.style.transform = "translate(-50%, -50%)";
    popupContent.style.background = "#fff";
    popupContent.style.padding = "20px";
    popupContent.style.borderRadius = "5px";
    popupContent.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
  
    const messageElement = document.createElement("div");
    messageElement.style.fontSize = "18px";
    messageElement.style.textAlign = "center";
    messageElement.style.color = textColor; // Set the text color
  
    // Set the message
    messageElement.textContent = message;
  
    // Append elements to the DOM
    popupContent.appendChild(messageElement);
    popup.appendChild(popupContent);
    document.body.appendChild(popup);
  
    // Show the popup
    popup.style.display = "block";
  
    // Hide the popup after a certain duration (e.g., 3 seconds)
    setTimeout(() => {
      popup.style.display = "none";
    }, 1000); // 3000 milliseconds = 3 seconds
  };

  activateParentDropdown = item => {
    item.classList.add("active");
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add("active"); // li
      const parent2 = parent.parentElement;
      parent2.classList.add("active"); // li
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add("active"); // li
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add("active"); // li
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add("active"); // li
            const parent6 = parent5.parentElement;
            if (parent6) {
              parent6.classList.add("active"); // li
            }
          }
        }
      }
    }
    return false;
  };
    handlePageClick = page => {
    this.setState({ page });
  };
  toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }
  onUpdate = (render, handle, value) => {
    const { carts } = this.props;
    if (
      !isEmpty(carts) &&
      size(prevProps.carts) !== size(carts)
    ) {
      this.setState({ carts: {} });
    }
    this.setState({
      nearbyLabs: productsData.filter(
        nearbyLab =>
          nearbyLab.newPrice >= value[0] && nearbyLab.newPrice <= value[1]
      ),
    });
  };

  render() {
    const { onGetCarts } = this.props;

    const { carts } = this.props;
    const { loading } = this.state;
    const isLargeScreen = window.innerWidth < 490;

    const { page, totalPage } = this.state;
    const { offeredTests } = this.props.offeredTests;
    const offeredTest = this.state.offeredTest;
    const { searchQuery } = this.state;
    const filteredTests = this.props.offeredTests.filter((test) =>
      test.test_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <React.Fragment>
       
        <div className="page-content">
          <MetaTags>
            <title>Tests Offered | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Nearby Labs" breadcrumbItem="Tests Offered" />

            {this.state.success ? (
              <Alert color="success" className="col-md-4">
                {this.state.success}
              </Alert>
            ) : this.state.error ? (
              <Alert color="danger" className="col-md-5">
                {this.state.error}
              </Alert>
            ) : null}

                        <Col xs="4" sm="4" md="2" lg="2">
                          <div className="mb-3">
                            <Label
                              for="LabType1"
                              className="form-label"
                              style={{
                                fontSize: window.innerWidth <= 576 ? '6px' : '12px',
                              }}
                            >
                              Search By Test Name
                            </Label>
                            <div className="mb-3">
                              <Input
                                type="text"
                                placeholder="Search tests..."
                                className="form-control"
                                value={searchQuery}
                                onChange={(e) => this.setState({ searchQuery: e.target.value })}
                              />
                            </div>
                          </div>
                        </Col>

            <Row>
              <Modal
                isOpen={this.state.DescriptionModal}
                className={this.props.className}
              >
                <ModalHeader toggle={this.toggleDescriptionModal} tag="h4">
                  <span></span>
                </ModalHeader>
                <ModalBody>
                  <Formik>
                    <Form>
                      <Row>
                        <Col className="col-12">
                          <div className="mb-3 row">
                            <div className="col-md-6">
                            <Label className="form-label">{this.state.test_name}</Label>
                              <br></br>
                              <Label className="form-label">English</Label>
                            </div>
                            <div>
                              <textarea
                                name="description_in_english"
                                id="description_in_english"
                                rows="4"
                                cols="4"
                                value={this.state.description_in_english}
                                className="form-control"
                                readOnly={true}
                              />
                            </div>
                          </div>
                          <div className="mb-3 row">
                            <div className="col-md-3">
                              <Label className="form-label">Urdu</Label>
                            </div>
                            <div>
                              <textarea
                                name="description_in_urdu"
                                id="description_in_urdu"
                                rows="4"
                                cols="4"
                                value={this.state.description_in_urdu}
                                className="form-control"
                                readOnly={true}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Formik>
                </ModalBody>
              </Modal>
              <Modal
                isOpen={this.state.PatientModal}
                className={this.props.className}
              >
                <ModalHeader toggle={this.togglePatientModal} tag="h4">
                  <span></span>
                </ModalHeader>
                <ModalBody>
                  <Formik>
                    <Form>
                      <Row>
                        <Col className="col-12">
                          <div className="mb-3 row">
                            <div className="col-md-3">
                              <Label className="form-label">
                                Test Description
                              </Label>
                            </div>
                            <textarea
                              name="test_details"
                              id="test_details"
                              rows="10"
                              cols="10"
                              value={this.state.test_details}
                              className="form-control"
                              readOnly={true}
                            />
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Formik>
                </ModalBody>
              </Modal>
             
              {filteredTests.length > 0 ? (
                filteredTests.map((offeredTest, key) => (
                  <Col xl="4" sm="6" key={"_col_" + key}>
                  <Card style={{ height: "95%" }}>
                    <CardBody>
                       <div className="mt-4 text-center">
                        <h5 className="mb-2 text-truncate">
                          {/* {offeredTest.test_name} */}
                          <Tooltip title={offeredTest.test_name}>
                              <span> {offeredTest.test_name} </span>
                          </Tooltip>
                        </h5>
                        {offeredTest.test_type != "Test" && (
                          // <div className="mb-3">
                            <Link
                              to="#"
                              onClick={e =>
                                this.openPatientModal(e, offeredTest)
                              }
                            >
                              <span>Test Description</span>
                            </Link>
                          // </div>
                        )}
                        {offeredTest.test_type == "Test" && (
                          // <div className="mb-3">
                            <Link
                              to="#"
                              onClick={e =>
                                this.openDescriptionModal(e, offeredTest)
                              }
                            >
                              <span>Test Description</span>
                            </Link>
                          // </div>
                        )}
                       
                       {(offeredTest.discount >= 0.01) && ((offeredTest.all_discount_by_labhazir + offeredTest.discount_by_labhazir) >= 0.01) && (
                          <div className="my-0">
                            <span className="text-muted me-2" style={{ textDecoration: "line-through", textDecorationColor: "red" }}>
                              {/* <i className="fas fa-money-bill"></i>{" "} */}
                              Rs {offeredTest.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </span>
                            <span className="text-muted me-2">
                              {/* <i className="fas fa-money-bill"></i>{" "} */}
                              Rs {((offeredTest.price - (offeredTest.discount + offeredTest.all_discount_by_labhazir + offeredTest.discount_by_labhazir) * offeredTest.price).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </span>
                          </div>
                        )}
                        {(offeredTest.discount >= 0.01) && ((offeredTest.all_discount_by_labhazir + offeredTest.discount_by_labhazir) <= 0.01) && (
                          <div className="my-0">
                            <span className="text-muted me-2" style={{ textDecoration: "line-through", textDecorationColor: "red" }}>
                              {/* <i className="fas fa-money-bill"></i>{" "} */}
                              Rs {offeredTest.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </span>
                            <span className="text-muted me-2">
                              {/* <i className="fas fa-money-bill"></i>{" "} */}
                              Rs {((offeredTest.price - (offeredTest.discount + offeredTest.all_discount_by_labhazir + offeredTest.discount_by_labhazir) * offeredTest.price).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </span>
                          </div>
                        )}
                        {(offeredTest.discount <= 0.01) && ((offeredTest.all_discount_by_labhazir + offeredTest.discount_by_labhazir) >= 0.01) && (
                          <div className="my-0">
                            <span className="text-muted me-2" style={{ textDecoration: "line-through", textDecorationColor: "red" }}>
                              {/* <i className="fas fa-money-bill"></i>{" "} */}
                              Rs {offeredTest.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </span>
                            <span className="text-muted me-2">
                              {/* <i className="fas fa-money-bill"></i>{" "} */}
                              Rs {((offeredTest.price - (offeredTest.discount + offeredTest.all_discount_by_labhazir + offeredTest.discount_by_labhazir) * offeredTest.price).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </span>
                          </div>
                        )}
                        {(offeredTest.discount <= 0.01) && ((offeredTest.all_discount_by_labhazir + offeredTest.discount_by_labhazir) <= 0.01) && (
                          <div className="my-0">
                            <span className="text-muted me-2">
                              {/* <i className="fas fa-money-bill"></i>{" "} */}
                              Rs {((offeredTest.price).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </span>
                          </div>
                        )}
                        {offeredTest.discount>=0.01 && (
                          <div className="my-0">
                          <span className="text-danger" >
                            <i className="fas fa-money-bill"></i>{" "}
                            Discount Lab: {(offeredTest.discount*100).toFixed()} % 
                          </span>
                        </div>
                        )}
                        {(offeredTest.all_discount_by_labhazir + offeredTest.discount_by_labhazir) >= 0.01 && (
                          <div className="my-0">
                            <span className="text-success" >
                              <i className="fas fa-money-bill"></i>{" "}
                              Discount LabHazir: {((offeredTest.all_discount_by_labhazir * 100) + (offeredTest.discount_by_labhazir * 100)).toFixed()} %
                            </span>

                          </div>
                        )}
                    
                        <div className="my-0">
                          <span className="text-muted me-2">
                            <i className="fas fa-stopwatch"></i> Reporting
                            Time: {offeredTest.duration_required}{" "}
                            {offeredTest.duration_type}
                          </span>
                        </div>

                        <div className="my-0">
                          <span className="text-muted me-2">
                            <i className="fas fa-home"></i> Home Sampling:{" "}
                            {offeredTest.is_home_sampling_available}
                          </span>
                        </div>
                        <div className="my-0">
                          {" "}
                          {!this.state.user_id ? (
                            <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${offeredTest.lab_account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${offeredTest.lab_account_id}/${this.props.match.params.guest_id}`
                            }
                            
                            className="text-dark"
                          >
                            <span className="text-primary">
                              {offeredTest.lab_name}{" "}
                              
                            </span>
                          </Link>
                          ):null}
                          {(this.state.user_id) && (this.state.user_type ==="CSR") && (this.state.user_type !=="b2bclient") && (
                   <Link
                   to={
                     this.props.match.params.guest_id
                       ? `/nearby-lab-detail/${offeredTest.lab_account_id}/${this.props.match.params.guest_id}`
                       : `/nearby-lab-detail/${offeredTest.lab_account_id}`
                   }

                   className="text-dark"
                 >
                   <span className="text-primary">
                     {offeredTest.lab_name}{" "}

                   </span>
                 </Link>
                  )}
                        {(this.state.user_id) && (this.state.user_type !=="CSR") && (this.state.user_type !=="b2bclient") && (
                   <Link
                   to={
                     this.props.match.params.uuid
                       ? `/nearby-lab-detail/${offeredTest.lab_account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                       : `/nearby-lab-detail/${offeredTest.lab_account_id}/${this.props.match.params.guest_id}`
                   }

                   className="text-dark"
                 >
                   <span className="text-primary">
                     {offeredTest.lab_name}{" "}

                   </span>
                 </Link>
                  )}
                  {(this.state.user_id) && (this.state.user_type !=="CSR") && (this.state.user_type ==="b2bclient") && (
                   <Link
                   to={
                     this.props.match.params.guest_id
                       ? `/nearby-lab-detail/${offeredTest.lab_account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                       : `/nearby-lab-detail/${offeredTest.lab_account_id}/${this.props.match.params.guest_id}`
                   }

                   className="text-dark"
                 >
                   <span className="text-primary">
                     {offeredTest.lab_name}{" "}

                   </span>
                 </Link>
                  )}
                        
                        <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
  <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
    <StarRatings
      rating={offeredTest.rating}
      starRatedColor="#F1B44C"
      starEmptyColor="#2D363F"
      numberOfStars={5}
      name="rating"
      starDimension="12px"
      starSpacing="3px"
    />
  </Col>
  <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
    <span style={{ fontSize: "14px", marginLeft: "7px"}}>
      {offeredTest && offeredTest.rating && (
        <p>{offeredTest.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
      )}
    </span>
  </Col>
</Row>
                        </div>
                        {/* <Button
  type="button"
  color={this.state.itemsInCart.includes(offeredTest) ? 'secondary' : 'primary'}
  className={`btn mt-3 me-1${this.state.itemsInCart.includes(offeredTest) ? ' disabled' : ''}`}
  onClick={() => this.handleAddToCart(offeredTest)}
  disabled={this.state.itemsInCart.includes(offeredTest)} // Disable the button if the item is in the cart
>
  <i className="bx bx-cart me-2" /> {this.state.itemsInCart.includes(offeredTest) ? 'Already Added' : 'Add to cart'}
</Button> */}
<Button
  type="button"
  color={this.props.carts.some(cartItem => cartItem.offered_test_id === offeredTest.id) ? 'secondary' : 'primary'}
  className={`btn mt-3 me-1${this.props.carts.some(cartItem => cartItem.offered_test_id === offeredTest.id) ? ' disabled' : ''}`}
  // onClick={() => this.handleAddToCart(offeredTest)}
  onClick={() => {
    // Check if offeredTest.name is equal to any cartItem.name
    if (this.props.carts.some(cartItem => cartItem.test_name === offeredTest.test_name)) {
      alert("An item with the same name but from a different lab is already in the cart. Please remove the previous one first.");
    } else {
      // If not, proceed with adding to the cart
      this.handleAddToCart(offeredTest);
    }
  }}
  disabled={this.props.carts.some(cartItem => cartItem.offered_test_id === offeredTest.id)}
>
  <i className="bx bx-cart me-2" /> {this.props.carts.some(cartItem => cartItem.offered_test_id === offeredTest.id) ? 'Already Added' : 'Add to cart'}
</Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                ))
              ) : isEmpty(this.props.offeredTests) && loading ? (
                // Loading state
                <Row>
                  <Col lg="12">
                    <div className="mb-5" style={{ fontSize: "24px" }}>
                      Please Wait.....
                    </div>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col lg="12">
                    <div className="mb-5" style={{ fontSize: "24px", color: "red" }}>
                    Sorry, No tests were found at your specified lab.....
                    </div>
                  </Col>
                </Row>
              )
              }
              {/* {isEmpty(nearbyLabs) && (
                loading ? (
                  <Row>
                    <Col lg="12">
                      <div className="mb-5" style={{ fontSize: '24px' }}>
                        Please Wait.....
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col lg="12">
                      <div className="mb-5" style={{ fontSize: '24px', color: 'red' }}>
                        Sorry, No Labs Found In Your Specific Area.....
                      </div>
                    </Col>
                  </Row>
                )
              )} */}
                 
                 <ScrollButton />
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

TestsOffered.propTypes = {
  match: PropTypes.object,
  history: any,
  location: PropTypes.any,
  offeredTests: PropTypes.array,
  ongetCOfferedRadiologysReferrel: PropTypes.func,
  onAddToCart: PropTypes.func,
  success: PropTypes.any,
  error: PropTypes.any,
  className: PropTypes.any,
  carts: PropTypes.array,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
  carts: PropTypes.any,
  onGetCarts: PropTypes.func,
};

const mapStateToProps = ({ offeredTests, carts }) => ({
  offeredTests: offeredTests.offeredTests,
  carts: carts.carts,
  success: carts.success,
  error: carts.error,

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ongetCOfferedRadiologysReferrel: () =>
    dispatch(getCOfferedRadiologysReferrel(ownProps.match.params.lab_account_id)),
  onAddToCart: (cart, id) => dispatch(addToCart(cart, id)),
  onGetCarts: id => dispatch(getCarts(id)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestsOffered));
