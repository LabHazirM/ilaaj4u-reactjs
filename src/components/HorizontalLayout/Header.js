import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDrawer from "react-drawer";
import "react-drawer/lib/react-drawer.css";

import { connect } from "react-redux";
import { isEmpty, map, size } from "lodash";
import Tooltip from "@material-ui/core/Tooltip";


import { withRouter, Link } from "react-router-dom";
// Import menuDropdown
import logo from "../../assets/images/logo.svg";
import logoLight from "../../assets/images/logo-light.png";
import logoLightSvg from "../../assets/images/logo-light.svg";

// Redux Store
import { toggleRightSidebar } from "../../store/actions";
import { getCarts, deleteCart, emptyCart } from "store/carts/actions";
import { getPatientProfile } from "store/labmarket/actions";
//i18n
import { withTranslation } from "react-i18next";
import { DropdownItem } from "reactstrap";
import Navbar from "./Navbar";

import "./horizontal-navbar.scss";
import carts from "pages/CartsList/carts";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearch: false,
      open: false,
      count: 0,
      carts: [],
      patientProfile: [],
      isDropdownOpen: false,
      cart: "",
      prevUrl: '',
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
    };
    this.dropdownRef = React.createRef();
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    console.log("yaha ani chahi hai uuid", this.props.match.params.uuid)
    console.log("yaha ani chahi hai guid", this.props.match.params.guest_id)
    console.log("yaha ani chahi hai fuid", this.props.match.params.filnalurl)

    console.log(this.state.user_type)
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    const url = window.location.href;
    const queryString = url.includes('&') ? url.substring(url.indexOf('&') + 1) : '';
    const params = new URLSearchParams(queryString);
    const latitudeFromUrl = params.get('lat');
    const longitudeFromUrl = params.get('lon');

    if (latitudeFromUrl && longitudeFromUrl) {
      const finalUrl = `https://labhazirapi.com/nearby-labs/&lat=${latitudeFromUrl}&lon=${longitudeFromUrl}`;
      this.setState({ finalUrl });
      console.log('Final URL:', this.state.finalUrl);
    }
    const { patientProfile, getPatientProfile } = this.props;
    getPatientProfile(this.state.user_id);
    this.setState({
      patientProfile
    });
    console.log("state", patientProfile);
    // Call the asynchronous function initially
    this.getData();

    // Set an interval to call the asynchronous function every 2 seconds
    this.interval = setInterval(this.getData, 2000);
    // Check if the current URL is "/checkout#"
    const isCheckoutPage = window.location.href.endsWith("/checkout#");

    // If the current page is the checkout page, update the interval to 5 seconds
    if (isCheckoutPage) {
      clearInterval(this.interval); // Clear the previous interval
      this.interval = setInterval(this.getData, 5000);
    }
  }

  componentWillUnmount() {
    // Clear the interval when the component is unmounted to prevent memory leaks
    clearInterval(this.interval);
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  getData = async () => {
    const { getCarts } = this.props;
    const { user_id, user_type } = this.state;

    let cartsData;

    if (!user_id) {
      cartsData = await getCarts(this.props.match.params.guest_id);
    } else if (user_type !== 'CSR' && user_type !== 'b2bclient') {
      cartsData = await getCarts(user_id);
    } else if (user_type === 'CSR' && user_type !== 'b2bclient') {
      cartsData = await getCarts(this.props.match.params.guest_id);
    } else if (user_type !== 'CSR' && user_type === 'b2bclient') {
      cartsData = await getCarts(this.props.match.params.uuid);
    }

    this.setState({ carts: cartsData });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { carts } = this.props;
    if (
      !isEmpty(carts) &&
      size(prevProps.carts) !== size(carts)
    ) {
      this.setState({ carts: {} });
    }
  }
  toggleSearch = () => {
    this.setState({ isSearch: !this.state.isSearch });
  };
  handlePageClick = page => {
    this.setState({ page });
  };
  toggleMenu() {
    this.props.openLeftMenuCallBack();
  }
  toggleRightbar() {
    this.props.toggleRightSidebar();
  }
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
  toggleDropdown = () => {
    this.setState((prevState) => ({
      isDropdownOpen: !prevState.isDropdownOpen,
    }));
  };
  handleClickOutside = (event) => {
    if (this.dropdownRef.current && !this.dropdownRef.current.contains(event.target)) {
      this.setState({ isDropdownOpen: false });
    }
  };
  render() {
    const { carts } = this.props;
    const { patientProfile } = this.props;
    const { getPatientProfile } = this.props;
    const totalLength = carts.length + this.state.count;
    console.log("total array length", totalLength)
    const { isDropdownOpen } = this.state;
    // const isLargeScreen = window.innerWidth > 992;
    const isSmallScreen = window.innerWidth < 490;
    const openModal = () => {
      const modal = document.getElementById("modal");
      modal.style.display = "block";
    };

    const closeModal = () => {
      const modal = document.getElementById("modal");
      modal.style.display = "none";
    };
    return (
      <React.Fragment>
        <header id="page-topbaar">
          <div className="navbar-header">
            <div className="d-flex">
            {!isSmallScreen ? (
  this.props.patientProfile && !this.props.patientProfile.is_assosiatewith_anycorporate && !this.props.patientProfile.employee_id_card ? (
    <div className="navbar-brand-box">
      <Link
        to={this.props.match.params.uuid ? `/nearby-labs/${this.props.match.params.uuid}` : `/nearby-labs/`}
        className="logo logo-dark"
      >
        <span className="logo-sm">
          <img src={logo} alt="" height="40" />
        </span>
        <span className="logo-lg">
          <img src={logoLight} alt="" height="60" />
        </span>
      </Link>

      <Link
        to={this.props.match.params.uuid ? `/nearby-labs/${this.props.match.params.uuid}` : `/nearby-labs/`}
        className="logo logo-light"
      >
        <span className="logo-sm">
          <img src={logoLightSvg} alt="" height="40" />
        </span>
        <span className="logo-lg">
          <img src={logoLight} alt="" height="60" />
        </span>
      </Link>
    </div>
  ) : (
    <div className="navbar-brand-box">
      <Link
        to={this.props.match.params.uuid ? `/corporate-labs/${this.props.match.params.uuid}` : `/corporate-labs/`}
        className="logo logo-dark"
      >
        <span className="logo-sm">
          <img src={logo} alt="" height="40" />
        </span>
        <span className="logo-lg">
          <img src={logoLight} alt="" height="60" />
        </span>
      </Link>

      <Link
        to={this.props.match.params.uuid ? `/corporate-labs/${this.props.match.params.uuid}` : `/corporate-labs/`}
        className="logo logo-light"
      >
        <span className="logo-sm">
          <img src={logoLightSvg} alt="" height="40" />
        </span>
        <span className="logo-lg">
          <img src={logoLight} alt="" height="60" />
        </span>
      </Link>
    </div>
  )
) : null}

              {isSmallScreen && this.state.user_type == "patient" && window.location.pathname == "/nearby-labs" ? (
                <button
                  type="button"
                  className="
                btn btn-sm pl-5 font-size-16 d-lg-none header-item"
                  style={{ left: '12px', top: '6px', display: 'none' }} // Hide the button
                  data-toggle="collapse"
                  onClick={this.toggleMenu}
                  data-target="#topnav-menu-content"
                >
                  <i className="fa fa-fw fa-bars" />
                </button>
              ) : isSmallScreen && this.state.user_type == "patient" && window.location.pathname !== "/nearby-labs" ? (
                <button
                  type="button"
                  className="btn btn-sm pl-5 font-size-16 d-lg-none header-item"
                  data-toggle="collapse"
                  style={{ left: '12px', top: '6px' }}
                  onClick={this.toggleMenu}
                  data-target="#topnav-menu-content"
                >
                  <i className="fa fa-fw fa-bars" />
                </button>
              ) : <button
                type="button"
                className="btn btn-sm pl-5 font-size-16 d-lg-none header-item"
                data-toggle="collapse"
                style={{ left: '12px', top: '6px' }}
                onClick={this.toggleMenu}
                data-target="#topnav-menu-content"
              >
                <i className="fa fa-fw fa-bars" />
              </button>}

            </div>

            <div className="d-flex">
              {/* Display login and signup links if the user is not logged in,
              otherwise show logout and cart links to the user with patient account and is logged in */}
              {!this.state.user_id ? (
                <div className="dropdown d-lg-inline-block ms-4 mt-4">
                  <Tooltip title="Cart">
                    <Link
                      to={
                        this.props.match.params.uuid
                          ? `/cart/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                          : `/cart/${this.props.match.params.guest_id}`
                      }
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-cart align-middle me-1 font-size-20">
                        {!isEmpty(this.props.carts) && (
                          <span
                            style={{
                              verticalAlign: '0.9em',
                              fontSize: '0.6em',
                            }}
                          >
                            {totalLength + this.state.count}
                          </span>
                        )}
                      </i>
                    </Link>
                  </Tooltip>

                  <Tooltip title="Login">
                    <Link
                      to={
                        this.props.match.params.uuid
                          ? `/login/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                          : `/login/${this.props.match.params.guest_id}`
                      }
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-account-arrow-right align-middle me-1 font-size-20" />{" "}
                      <span className="pt-4 font-size-12">Login</span>
                    </Link>
                  </Tooltip>
                  <Tooltip title="Sign Up">
                    <Link
                      to={
                        this.props.match.params.uuid
                          ? `/register/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                          : `/register/${this.props.match.params.guest_id}`
                      }
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-account-plus align-middle me-1 font-size-20" />{" "}
                      <span className="pt-4 font-size-12">Sign up</span>
                    </Link>
                  </Tooltip>

                  {/* <Link
                    // to="/contact-us"
                    to={
                      this.props.match.params.uuid
                        ? `/contact-us/${this.props.match.params.uuid}`
                        : `/contact-us`
                    }
                    className="btn header-items noti-icon right-bar-toggle"
                  >
                    <i className="fas fa-headset align-middle me-1 mt-1 font-size-20" />{" "}
                  </Link> */}
                </div>
              ) : this.state.user_type === "patient" ? (
                <div className="dropdown d-lg-inline-block ms-4 mt-6">
                  <Tooltip title="Patient Profile">
                    <Link
                      // to={"/profile"}
                      to={
                        this.props.match.params.guest_id
                          ? `/profile/${this.props.match.params.guest_id}`
                          : this.props.match.params.uuid
                            ? `/profile/${this.props.match.params.uuid}`
                            : `/profile`
                      }
                      className="dropdown-content me-2 text-light"
                    >
                      <i className="mdi mdi-account-box align-middle font-size-20" />{" "}
                      {this.props.patientProfile && this.props.patientProfile.is_assosiatewith_anycorporate && this.props.patientProfile.employee_id_card ? (
                        <span className="pt-4 font-size-12">
                          {this.props.patientProfile.corporate_name}-{this.state.patient_name.split(" ")[0]}
                        </span>
                      ) : (
                        <span className="pt-4 font-size-12">
                          {this.state.patient_name.split(" ")[0]}
                        </span>
                      )}
                                        
                    </Link>
                  </Tooltip>{" "}
                  <Tooltip title="Cart">
                    <Link
                      to={
                        this.props.match.params.guest_id
                          ? `/cart/${this.props.match.params.guest_id}`
                          : this.props.match.params.uuid
                            ? `/cart/${this.props.match.params.uuid}`
                            : `/cart`
                      }

                      className="dropdown-content me-2 text-light"
                    >
                      <i className="mdi mdi-cart align-middle me-1 font-size-20">
                        {!isEmpty(this.props.carts) && (
                          <span
                            style={{
                              verticalAlign: '0.9em',
                              fontSize: '0.6em',
                            }}
                          >
                            {totalLength + this.state.count}
                          </span>
                        )}
                      </i>
                    </Link>
                  </Tooltip>
                  <Tooltip title="More">
                    <button
                      className="btn header-items noti-icon right-bar-toggle"
                      style={{
                        position: 'relative',
                        marginRight: '0',
                        padding: '0',
                      }}
                      onClick={this.toggleDropdown}
                    >
                      <i className="mdi mdi-menu-down align-middle me-1 font-size-20" />
                    </button>
                  </Tooltip>

                  {isDropdownOpen && (
                    <div ref={this.dropdownRef}
                      style={{
                        position: 'absolute',
                        top: '50px', // Adjust this value to set the distance between the button and the dropdown
                        right: '20px',
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        padding: '10px',
                        minWidth: '150px',
                        zIndex: 1,
                      }}>
                      <ul style={{ listStyleType: "none", padding: '2px' }}>
                        <li>
                          <Link to="/change-password" className="dropdown-content me-2 text-light">
                            <i className="mdi mdi-key align-middle me-1 font-size-20" style={{ color: 'blue' }} />{" "}
                            <span className="pt-4 font-size-12" style={{ color: 'blue' }}>
                              Password
                            </span>
                            <hr style={{ margin: '0 0' }} />
                          </Link>
                        </li>
                        <li>
                          <Link to="/contact-us" className="dropdown-content me-2 text-light">
                            <i className="fas fa-headset align-middle me-1 mt-1 font-size-20" style={{ color: 'blue' }} />{" "}
                            <span className="pt-4 font-size-12" style={{ color: 'blue' }}>
                              Contact Us                  </span>
                            <hr style={{ margin: '0 0' }} />
                          </Link>
                        </li>
                        <li>
                          <a onClick={openModal} className="dropdown-content me-2 text-light">
                            <i className="mdi mdi-wallet align-middle me-1 font-size-24" style={{ color: 'blue' }} />{" "}
                            <span className="pt-4 font-size-12" style={{ color: 'blue' }}>
                              Wallet                  </span>
                            <hr style={{ margin: '0 0' }} />
                          </a>
                          <div id="modal" className="modal mt-4" style={{ display: "none" }}>
                            <div className="modal-dialog" style={{ width: "300px", height: "150px" }}>
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title" style={{ textAlign: 'center', fontWeight: 'bold', margin: '0 auto' }}>Available Credit</h5>
                                </div>


                                <div className="modal-body" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 30 }}>
                                  Rs. {this.props.patientProfile.available_credit}
                                  {/* <div>
                                <p>
                                You have received this money in case of refund which you can use only for testing.
                                </p>
                              </div> */}
                                </div>
                                <div className="my-0" style={{ textAlign: 'center' }}>
                                  <span className="text-danger">
                                    <i className="mdi mdi-information"></i>{" "}
                                    You have received this money in case of refund.
                                  </span><br></br>
                                  <span className="text-danger w-25">
                                  This amount cannot be withdrawn and can only be used for booking tests in the future.
                                  </span>
                                </div>

                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={closeModal}
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <Link to={`/logout/${this.state.finalUrl}`} 
                          className="dropdown-content text-light">
                            <i className="mdi mdi-power align-middle font-size-20" style={{ color: 'blue' }} />{" "}
                            <span className="pt-4 font-size-12" style={{ color: 'blue', marginLeft: '5px' }}>
                              Log Out
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : this.state.user_type == "patient" && isSmallScreen && this.state.filnalurl ? (
                <div className="dropdown d-lg-inline-block ms-4 mt-6">
                  <Link
                    // to={"/profile"}
                    to={
                      this.props.match.params.uuid
                        ? `/profile/${this.state.filnalurl}/${this.props.match.params.uuid}`
                        : `/profile`
                    }
                    className="dropdown-content me-2 text-light"
                  >
                    <i className="mdi mdi-account-box align-middle font-size-20" />{" "}
                    <span className="pt-4 font-size-12">
                      {this.state.patient_name.split(" ")[0]}
                    </span>
                    
                  </Link>{" "}
                  <Link
                    to={
                      this.props.match.params.uuid
                        ? `/cart/${this.state.filnalurl}/${this.props.match.params.uuid}`
                        : `/cart`
                    }
                    className="dropdown-content me-2 text-light"
                  >
                    <i className="mdi mdi-cart align-middle me-1 font-size-20">
                      {!isEmpty(this.props.carts) && (
                        <span
                          style={{
                            verticalAlign: '0.9em',
                            fontSize: '0.6em',
                          }}
                        >
                          {totalLength + this.state.count}
                        </span>
                      )}
                    </i>
                  </Link>
                  <button
                    className="btn header-items noti-icon right-bar-toggle"
                    style={{
                      position: 'relative',
                      marginRight: '0',
                      padding: '0',
                    }}
                    onClick={this.toggleDropdown}
                  >
                    <i className="mdi mdi-menu-down align-middle me-1 font-size-20" />
                  </button>

                  {isDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '50px', // Adjust this value to set the distance between the button and the dropdown
                      right: '20px',
                      backgroundColor: '#f9f9f9',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      padding: '10px',
                      minWidth: '150px',
                      zIndex: 1,
                    }}>
                      <ul style={{ listStyleType: "none", padding: '2px' }}>
                        <li>
                          <Link to="/change-password" className="dropdown-content me-2 text-light">
                            <i className="mdi mdi-key align-middle me-1 font-size-20" style={{ color: 'blue' }} />{" "}
                            <span className="pt-4 font-size-12" style={{ color: 'blue' }}>
                              Password
                            </span>
                            <hr style={{ margin: '0 0' }} />
                          </Link>
                        </li>
                        <li>
                          <Link to="/contact-us" className="dropdown-content me-2 text-light">
                            <i className="fas fa-headset align-middle me-1 mt-1 font-size-20" style={{ color: 'blue' }} />{" "}
                            <span className="pt-4 font-size-12" style={{ color: 'blue' }}>
                              Contact Us                  </span>
                            <hr style={{ margin: '0 0' }} />
                          </Link>
                        </li>
                        <li>
                          <a onClick={openModal} className="dropdown-content me-2 text-light">
                            <i className="mdi mdi-wallet align-middle me-1 font-size-24" style={{ color: 'blue' }} />{" "}
                            <span className="pt-4 font-size-12" style={{ color: 'blue' }}>
                              Wallet                  </span>
                            <hr style={{ margin: '0 0' }} />
                          </a>
                          <div id="modal" className="modal mt-4" style={{ display: "none" }}>
                            <div className="modal-dialog" style={{ width: "500px", height: "300px" }}>
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title" style={{ textAlign: 'center', fontWeight: 'bold', margin: '0 auto' }}>Available Credit</h5>
                                </div>


                                <div className="modal-body" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 30 }}>
                                  Rs. {this.props.patientProfile.available_credit}
                                  {/* <div>
                                <p>
                                You have received this money in case of refund which you can use only for testing.
                                </p>
                              </div> */}
                                </div>
                                <div className="my-0" style={{ textAlign: 'center' }}>
                                  <span className="text-danger">
                                    <i className="mdi mdi-information"></i>{" "}
                                    You have received this money in case of refund.
                                  </span><br></br>
                                  <span className="text-danger w-25">
                                  This amount cannot be withdrawn and can only be used for booking tests in the future.
                                  </span>
                                </div>

                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={closeModal}
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <Link to={`/logout/${this.state.finalUrl}`} 
                           className="dropdown-content text-light">
                            <i className="mdi mdi-power align-middle font-size-20" style={{ color: 'blue' }} />{" "}
                            <span className="pt-4 font-size-12" style={{ color: 'blue', marginLeft: '5px' }}>
                              Log Out
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="dropdown d-lg-inline-block ms-3 mt-3">
                  {this.state.user_type == "labowner" && (
                    <Link
                      to={"/dashboard-lab"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "b2bclient" && (
                    <div className="dropdown d-lg-inline-block ms-4 mt-4">
                      <Link
                        to={"/dashboard-b2bclient"}
                        className="btn header-items noti-icon right-bar-toggle"
                      >
                        <i className="mdi mdi-home me-1 font-size-24" />{" "}
                      </Link>
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/cart/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/cart`
                        }
                        className="btn header-items noti-icon right-bar-toggle"
                      >
                        <i className="mdi mdi-cart align-middle me-1 font-size-20">
                          {!isEmpty(this.props.carts) && (
                            <span
                              style={{
                                verticalAlign: '0.9em',
                                fontSize: '0.6em',
                              }}
                            >
                              {totalLength + this.state.count}
                            </span>
                          )}
                        </i>
                      </Link>
                    </div>
                  )}

                  {this.state.user_type == "auditor" && (
                    <Link
                      to={"/dashboard-auditor"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "CSR" && (
                    <div className="dropdown d-lg-inline-block ms-4 mt-4">

<Link
  to="/dashboard-csr"
  className="btn btn-sm header-items noti-icon right-bar-toggle rounded-pill"
  style={{ backgroundColor: 'red', color: 'white', textDecoration: 'none', width: '160px', height: '30px', fontWeight: 'bold', fontSize: '10px' , marginTop: '-27px', alignContent: "center"}}
>
  {/* <i className="mdi mdi-home me-1 font-size-24" />{" "} */}
  Go back to CSR Dashboard
</Link>


                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/cart/${this.props.match.params.guest_id}`
                            : `/cart`
                        }
                        className="btn header-items noti-icon right-bar-toggle"
                      >
                        <i className="mdi mdi-cart align-middle me-1 font-size-20">
                          {!isEmpty(this.props.carts) && (
                            <span
                              style={{
                                verticalAlign: '0.9em',
                                fontSize: '0.6em',
                              }}
                            >
                              {totalLength + this.state.count}
                            </span>
                          )}
                        </i>
                      </Link>
                      {/* <Link
                      to={
                        this.props.match.params.uuid
                          ? `/login/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                          : `/login/${this.props.match.params.guest_id}`
                      }
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-account-arrow-right align-middle me-1 font-size-20" />{" "}
                      <span className="pt-4 font-size-12">Login</span>
                    </Link>
   */}
                      {/* <Link
                      to={
                        this.props.match.params.uuid
                          ? `/register/${this.props.match.params.uuid}`
                          : `/register`
                      }
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-account-plus align-middle me-1 font-size-20" />{" "}
                      <span className="pt-4 font-size-12">Sign up</span>
                    </Link> */}

                      {/* <Link
                      // to="/contact-us"
                      to={
                        this.props.match.params.uuid
                          ? `/contact-us/${this.props.match.params.uuid}`
                          : `/contact-us`
                      }
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="fas fa-headset align-middle me-1 mt-1 font-size-20" />{" "}
                    </Link> */}
                    </div>
                  )}

                  {this.state.user_type == "registration-admin" && (
                    <Link
                      to={"/pending-labs"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "auditor-admin" && (
                    <Link
                      to={"/pending-audits"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "csr-admin" && (
                    <Link
                      to={"/pending-complaints-lab"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "hr-admin" && (
                    <Link
                      to={"/add-staff"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "marketer-admin" && (
                    <Link
                      to={"/discount-labhazir"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
        {/* {!this.state.user_type == "patient" ? (
        <Navbar menuOpen={this.state.open} />
        ) : null } */}
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  match: PropTypes.object,
  openLeftMenuCallBack: PropTypes.func,
  t: PropTypes.any,
  toggleRightSidebar: PropTypes.func,
  carts: PropTypes.array,
  getCarts: PropTypes.func,
  patientProfile: PropTypes.array,
  getPatientProfile: PropTypes.func,
};

const mapStateToProps = state => {
  const { layoutType } = state.Layout;
  const { carts } = state.carts;
  const patientProfile = state.LabMarket.patientProfile; // Corrected assignment
  return { layoutType, carts, patientProfile }; // Added patientProfile to the returned object
};


// export default connect(mapStatetoProps, { toggleRightSidebar })(
//   withTranslation()(Header)
// );

export default withRouter(
  connect(mapStateToProps, { getCarts, getPatientProfile, toggleRightSidebar })(withTranslation()(Header))
);