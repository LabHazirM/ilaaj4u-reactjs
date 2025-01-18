import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link, Redirect } from "react-router-dom";
import { Card, CardBody, Col,Table, Container, Row } from "reactstrap";
import { Collapse } from "reactstrap";
import logo from "../../../src/assets/images/logo.svg";
import logoLight from "../../../src/assets/images/logo-light.png";
import logoLightSvg from "../../../src/assets/images/logo-light.svg";
import Tooltip from "@material-ui/core/Tooltip";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import { getQuotes, deleteCart } from "store/quotes/actions";

import { isEmpty, size , map} from "lodash";

import "assets/scss/table.scss";

class CartList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      quotes: [],
      isMenuOpened: false,
      quote: "",
      abc: "",
      isDropdownOpen: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      user_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
      patient_name: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).patient_name
        : "",
      modal: false,
      deleteModal: false,
      isDisabled: true,
    };
    this.handleCartClick = this.handleCartClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    console.log("uuid", this.props.match.params.uuid);
    console.log("guest_id", this.props.match.params.guest_id);
  }

  componentDidMount() {
    const { onGetQuotes } = this.props;
    if ((!this.state.user_id)) {
      console.log("quotesssssssssssssssssssssssssssssss",onGetQuotes(this.props.match.params.guest_id));
      this.setState({ quotes: this.props.quotes });
      console.log("quotessssssssssssssssssssssssssssssshshshhdhhsdhdhdhhdhdhdh",this.props.quotes );

      console.log("quotes:", this.props.match.params.guest_id)
      console.log("userr", this.state.user_id)
    }
    if ((this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type !== "b2bclient"))
    {
      onGetQuotes(this.state.user_id);
      this.setState({ quotes: this.props.quotes });
      console.log("quotes:", this.props.match.params.guest_id)
      console.log("userr", this.state.user_id)
    }
    if((this.state.user_id && this.state.user_type === "CSR" && this.state.user_type !== "b2bclient"))
    {
      onGetQuotes(this.props.match.params.guest_id);
      this.setState({ quotes: this.props.quotes });
      console.log("quotes:", this.props.match.params.guest_id)
      console.log("userr", this.state.user_id)
    }
    if((this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type === "b2bclient"))
    {
      onGetQuotes(this.props.match.params.uuid);
      this.setState({ quotes: this.props.quotes });
      console.log("quotes:", this.props.match.params.uuid)
      console.log("userr", this.state.user_id)
    }
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { quotes } = this.props;
    if (!isEmpty(quotes) && size(prevProps.quotes) !== size(quotes)) {
      this.setState({ quotes: {}, isEdit: false });
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

  /* Insert,Update Delete data */

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = quotes => {
    this.setState({ quotes: quotes });
    this.setState({ deleteModal: true });
  };

  handleDeleteCart = () => {
    const { onDeleteCart, onGetQuotes } = this.props;
    const { quotes } = this.state;

    if (quotes.id !== undefined) {
      onDeleteCart(quotes);
      // onDeleteAllCart(id);
      setTimeout(() => {
        if ((!this.state.user_id)) {
      console.log(onGetQuotes(this.props.match.params.guest_id));
      this.setState({ quotes: this.props.quotes });
      console.log("quotes:", this.props.match.params.uuid)
    }
    if ((this.state.user_id && this.state.user_type !== "CSR"))
    {
      onGetQuotes(this.state.user_id);
      this.setState({ quotes: this.props.quotes });
      console.log("quotes:", this.state.user_id)
      console.log("quotes:", quotes)
    }
    if((this.state.user_id && this.state.user_type === "CSR"))
    {
      onGetQuotes(this.props.match.params.guest_id);
      this.setState({ quotes: this.props.quotes });
      console.log("quotes:", this.props.match.params.guest_id)
      console.log("quotes:", quotes)
    }
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleCart = () => {

    if (this.state.user_id && this.state.user_type !=="CSR" && this.state.user_type !=="b2bclient") {
      this.props.match.params.uuid = this.props.match.params.guest_id
      console.log(this.props.match.params.uuid)
      this.props.history.push(
        this.props.match.params.uuid
          ? `/checkout/${this.props.match.params.uuid}`
          : `/checkout`
      );
    }
    if (this.state.user_id && this.state.user_type ==="CSR" && this.state.user_type !=="b2bclient") {
      console.log(this.state.user_id)
      console.log(this.state.user_type)
      console.log(this.props.match.params.guest_id)
      console.log(this.props.match.params.filnalurl)
      console.log(this.props.match.params.uuid)
      this.props.history.push(
        this.props.match.params.guest_id
          ? `/checkout-csr/${this.props.match.params.guest_id}`
          : `/checkout-csr`
      );
    }
    if (this.state.user_id && this.state.user_type !=="CSR" && this.state.user_type ==="b2bclient") {
      console.log(this.state.user_id)
      console.log(this.state.user_type)
      console.log(this.props.match.params.guest_id)
      console.log(this.props.match.params.filnalurl)
      console.log(this.props.match.params.uuid)
      this.props.history.push(
        this.props.match.params.guest_id
          ? `/checkout-b2b/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
          : `/checkout-b2b`
      );
    }
    if (!this.state.user_id) {
      this.props.history.push(
        this.props.match.params.uuid
          ? `/login/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
          : `/login/${this.props.match.params.guest_id}`
      );
      // this.props.history.push("/login");
    }
  };

  handleCartClick = (e, arg) => {
    const quote = arg;

    this.setState({
      quote: {
        id: quote.id,
        patient_id: quote.patient_id,
        lab_id: quote.lab_id,
        offered_test_id: quote.offered_test_id,
        test_appointment_id: quote.test_appointment_id,
        invoice_id: quote.invoice_id,
      },
      isEdit: true,
    });

    this.toggle();
  };
  toggleDropdown = () => {
    this.setState((prevState) => ({
      isDropdownOpen: !prevState.isDropdownOpen,
    }));
  };
  openMenu = () => {
    this.setState({ isMenuOpened: !this.state.isMenuOpened });
    console.log(this.state.isMenuOpened)
  };

  render() {
    const isLargeScreen = window.innerWidth > 992;
    const isSmallScreen = window.innerWidth < 540;
    const { isDropdownOpen } = this.state;

    const { SearchBar } = Search;

    const { quotes } = this.props;

    const { deleteModal } = this.state;

    // const pageOptions = {
    //   sizePerPage: 10,
    //   totalSize: quotes.length, // replace later with size(quotes),
    //   custom: true,
    // };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteCart}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="p-4">
        <div className="topnav mt-5">
          <div className="container-fluid left-space">
          <nav
              className="navbar navbar-light navbar-expand-lg topnav-menu"
              id="navigation"
            >
               {this.state.user_id && this.state.user_type ==="CSR" && this.state.user_type !== "b2bclient"
                ? (
                  <Collapse
                    isOpen={this.state.isMenuOpened}
                    className="navbar-collapse"
                    id="topnav-menu-content"
                  >
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/labs/${this.props.match.params.guest_id}`
                              : `/labs`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Labs</span>
                        </Link>
                      </li>

                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/nearby-test/${this.props.match.params.guest_id}`
                              : `/nearby-test`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Tests</span>
                          {/* {this.props.t("Tests")} */}
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/nearby-profiles/${this.props.match.params.guest_id}`
                              : `/nearby-profiles`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Profiles</span>
                          {/* {this.props.t("Profiles")} */}
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/nearby-packages/${this.props.match.params.guest_id}`
                              : `/nearby-packages`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Packages</span>
                          {/* {this.props.t("Packages")} */}
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/nearby-radiology/${this.props.match.params.guest_id}`
                              : `/nearby-radiology/`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Radiology</span>
                          {/* {this.props.t("Packages")} */}
                        </Link>
                      </li>
                      {this.state.user_id && this.state.user_type == "patient" && (
                        <li className="nav-item">
                          <Link to={"/test-appointments"} className="dropdown-item">
                            {/* {this.props.t("My Appointments")} */}
                            <span className="pt-4 font-size-12">My Appointments</span>

                          </Link>
                        </li>
                      )}
                    </ul>
                  </Collapse>
                ): null}
              {!this.state.user_id
                ? (
                  <Collapse
                    isOpen={this.state.isMenuOpened}
                    className="navbar-collapse"
                    id="topnav-menu-content"
                  >
                    <ul className="navbar-nav">
                    {this.props.match.params.filnalurl ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/labs/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                              : `/labs/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Labs</span>
                        </Link>
                      </li>
                    ) : (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/labs/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                              : `/labs/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Labs</span>
                        </Link>
                      </li>
                    )}

{this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-test/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                                : `/nearby-test/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Tests</span>
                          </Link>
                        </li>
                      ) : !this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-test/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-test/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Tests</span>
                          </Link>
                        </li>
                      ) : null}
                      {this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-profiles/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                                : `/nearby-profiles/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Profiles</span>
                          </Link>
                        </li>
                      ) : !this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-profiles/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-profiles/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Profiles</span>
                          </Link>
                        </li>
                      ) : null}

                      {this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-packages/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                                : `/nearby-packages/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Packages</span>
                          </Link>
                        </li>
                      ) : !this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-packages/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-packages/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Packages</span>
                          </Link>
                        </li>
                      ) : null}

                      {this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-radiology/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                                : `/nearby-radiology/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Radiology</span>
                          </Link>
                        </li>
                      ) : !this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-radiology/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-radiology/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Radiology</span>
                          </Link>
                        </li>
                      ) : null}

               
                      {/* <li className="nav-item dropdown">
                     <Link
                       to="/#"
                       onClick={e => {
                         e.preventDefault();
                         this.setState({ appState: !this.state.appState });
                       }}
                       className="nav-link dropdown-toggle arrow-none"
                     >
                       <i className="bx bx-store me-2" />
                       {this.props.t("Lab Marketplace")}{" "}
                       <div className="arrow-down" />
                     </Link>
                     <div
                       className={classname("dropdown-menu", {
                         show: this.state.appState,
                       })}
                     >
                       <Link to="/nearby-labs" className="dropdown-item">
                         {this.props.t("Nearby Labs")}
                       </Link>
                       <Link to="/nearby-test" className="dropdown-item">
                         {this.props.t("Nearby Tests")}
                       </Link>
                     </div>
                   </li> */}

                      {this.state.user_id && this.state.user_type == "patient" && (
                        <li className="nav-item">
                          <Link to={"/test-appointments"} className="dropdown-item">
                            {/* {this.props.t("My Appointments")} */}
                            <span className="pt-4 font-size-12">My Appointments</span>

                          </Link>
                        </li>
                        /* <li className="nav-item dropdown">
                           <Link
                            to="/#"
                            onClick={e => {
                              e.preventDefault();
                              this.setState({ appState: !this.state.appState });
                            }}
                            className="nav-link dropdown-toggle arrow-none"
                          >
                            <i className="bx bx-test-tube me-2" />
                            {this.props.t("Appointments")}{" "}
                            <div className="arrow-down" />
                          </Link>
                          <div
                            className={classname("dropdown-menu", {
                              show: this.state.appState,
                            })}
                          >
                            <Link
                              to={"/test-appointments"}
                              className="dropdown-item"
                            >
                              {this.props.t("Test Appointments")}
                            </Link>
                          </div>
                          </li> */
                      )}
                    </ul>
                  </Collapse>

                ) : 
                this.state.user_id && this.state.user_type !== "CSR"  && this.state.user_type !== "b2bclient" ? (
                  <Collapse
                    isOpen={this.state.isMenuOpened}
                    className="navbar-collapse"
                    id="topnav-menu-content"
                  >
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/labs/${this.props.match.params.guest_id}`
                              : `/labs`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Labs</span>
                          {/* {this.props.t("Labs")} */}
                        </Link>
                      </li>

                      <li className="nav-item">
                        {/* <Link to="/nearby-test" className="dropdown-item">
                      {this.props.t("Search by Tests")}
                    </Link> */}
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/nearby-test/${this.props.match.params.guest_id}`
                              : `/nearby-test/`
                          }
                          className="dropdown-item"
                        >
                          {/* {this.props.t("Tests")} */}
                          <span className="pt-4 font-size-12">Tests</span>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/nearby-profiles/${this.props.match.params.guest_id}`
                              : `/nearby-profiles/`
                          }
                          className="dropdown-item"
                        >
                          {/* {this.props.t("Profiles")} */}
                          <span className="pt-4 font-size-12">Profiles</span>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/nearby-packages/${this.props.match.params.guest_id}`
                              : `/nearby-packages/`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Packages</span>
                          {/* {this.props.t("Packages")} */}
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/nearby-radiology/${this.props.match.params.guest_id}`
                              : `/nearby-radiology/`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Radiology</span>
                          {/* {this.props.t("Packages")} */}
                        </Link>
                      </li>
                      {/* <li className="nav-item dropdown">
                    <Link
                      to="/#"
                      onClick={e => {
                        e.preventDefault();
                        this.setState({ appState: !this.state.appState });
                      }}
                      className="nav-link dropdown-toggle arrow-none"
                    >
                      <i className="bx bx-store me-2" />
                      {this.props.t("Lab Marketplace")}{" "}
                      <div className="arrow-down" />
                    </Link>
                    <div
                      className={classname("dropdown-menu", {
                        show: this.state.appState,
                      })}
                    >
                      <Link to="/nearby-labs" className="dropdown-item">
                        {this.props.t("Nearby Labs")}
                      </Link>
                      <Link to="/nearby-test" className="dropdown-item">
                        {this.props.t("Nearby Tests")}
                      </Link>
                    </div>
                  </li> */}

                      {this.state.user_id && this.state.user_type == "patient" && (
                        <li className="nav-item">
                          <Link to={
                            this.props.match.params.guest_id
                              ? `/test-appointments/${this.props.match.params.guest_id}`
                              : `/test-appointments`
                          } className="dropdown-item">
                            {/* {this.props.t("My Appointments")} */}
                            <span className="pt-4 font-size-12">My Appointments</span>

                          </Link>
                        </li>
                        /* <li className="nav-item dropdown">
                           <Link
                            to="/#"
                            onClick={e => {
                              e.preventDefault();
                              this.setState({ appState: !this.state.appState });
                            }}
                            className="nav-link dropdown-toggle arrow-none"
                          >
                            <i className="bx bx-test-tube me-2" />
                            {this.props.t("Appointments")}{" "}
                            <div className="arrow-down" />
                          </Link>
                          <div
                            className={classname("dropdown-menu", {
                              show: this.state.appState,
                            })}
                          >
                            <Link
                              to={"/test-appointments"}
                              className="dropdown-item"
                            >
                              {this.props.t("Test Appointments")}
                            </Link>
                          </div>
                          </li> */
                      )}

                    </ul>
                  </Collapse>
                ) : 
                this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type === "b2bclient" ? (
                  <Collapse
                  isOpen={this.state.isMenuOpened}
                  className="navbar-collapse"
                  id="topnav-menu-content"
                >
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/labs/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/labs`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Labs</span>
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-test/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-test`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Tests</span>
                        {/* {this.props.t("Tests")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-profiles/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-profiles`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Profiles</span>
                        {/* {this.props.t("Profiles")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-packages/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-packages`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Packages</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
                  <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-radiology/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-radiology`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Radiology</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>   
                    {this.state.user_id && this.state.user_type == "patient" && (
                      <li className="nav-item">
                        <Link to={"/test-appointments"} className="dropdown-item">
                          {/* {this.props.t("My Appointments")} */}
                          <span className="pt-4 font-size-12">My Appointments</span>

                        </Link>
                      </li>
                    )}
                  </ul>
                </Collapse>
                ) : null}

            </nav>
          </div>
        </div>
        </div>
       
        <header id="page-topbaar">
          <div className="navbar-header">
          <div className="d-flex">
              {isLargeScreen ? (
                <div className="navbar-brand-box">
                  <Link
                    to={
                      this.props.match.params.uuid
                        ? `/nearby-labs/${this.props.match.params.uuid}`
                        : `/nearby-labs/`
                    }
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
                    to={
                      this.props.match.params.uuid
                        ? `/nearby-labs/${this.props.match.params.uuid}`
                        : `/nearby-labs/`
                    }
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


              ) : null}

              {!isLargeScreen ? (

                <button
                  type="button"
                  className="btn btn-sm pl-5 font-size-16 d-lg-none header-item"
                  style={{ left: '12px', top: '6px' }} // Set left position to 10 pixels
                  data-toggle="collapse"
                  onClick={this.openMenu}
                  data-target="#topnav-menu-content"
                >
                  <i className="fa fa-fw fa-bars" />
                </button>

              ) : <button
                type="button"
                className="btn btn-sm pl-5 font-size-16 d-lg-none header-item"
                data-toggle="collapse"
                onClick={this.openMenu}
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
                  <Link
                      to={
                        this.props.match.params.uuid
                        ? `/cart/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                        : `/cart/${this.props.match.params.guest_id}`
                      }
                      className="btn header-items noti-icon right-bar-toggle d-none"
                  >
                      <i className="mdi mdi-cart align-middle me-1 font-size-20" />{" "}

                        {/* {!isEmpty(this.props.quotes) &&
                        
                          this.props.quotes.slice(-1).pop().cart_quantity+this.state.count
                          } */}
                  </Link>
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

                  <Link
                    to={
                      this.props.match.params.uuid
                        ? `/register/${this.props.match.params.uuid}`
                        : `/register`
                    }
                    className="btn header-items noti-icon right-bar-toggle"
                  >
                    <i className="mdi mdi-account-plus align-middle me-1 font-size-20" />{" "}
                    <span className="pt-4 font-size-12">Sign up</span>
                  </Link>

                  <Link
                    // to="/contact-us"
                    to={
                      this.props.match.params.uuid
                        ? `/contact-us/${this.props.match.params.uuid}`
                        : `/contact-us`
                    }
                    className="btn header-items noti-icon right-bar-toggle"
                  >
                    <i className="fas fa-headset align-middle me-1 mt-1 font-size-20" />{" "}
                  </Link>
                </div>
              )
               : this.state.user_type == "patient" ? (
                <div className="dropdown d-lg-inline-block ms-4 mt-2">
                <Link
                  // to={"/profile"}
                  to={
                    this.props.match.params.guest_id
                      ? `/profile/${this.props.match.params.guest_id}`
                      : `/profile`
                  }
                  className="dropdown-content me-2 text-light"
                >
                  <i className="mdi mdi-account-box align-middle font-size-20" />{" "}
                  <span className="pt-4 font-size-12">
                    {this.state.patient_name.split(" ")[0]}                    
                  </span>
                </Link>{" "}
                <button
                  className="btn header-items noti-icon right-bar-toggle"
                  style={{ position: 'relative' }}
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
                          <hr style={{margin: '0 0' }} />
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
                        <Link to="/logout" className="dropdown-content text-light">
                          <i className="mdi mdi-power align-middle font-size-20" style={{ color: 'blue' }}/>{" "}
                          <span className="pt-2 font-size-12" style={{ color: 'blue', marginLeft: '5px' }}>
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
                    <Link
                      to={"/dashboard-b2bclient"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
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
                    <Link
                      to={"/dashboard-csr"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
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

        <div className="page-content">
          <MetaTags>
            <title>Quote List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
        <Breadcrumbs title="Quote" breadcrumbItem="Quote List" />
        <Row>
          <Col lg="12">
            <Card>
              <CardBody>
                {/* <PaginationProvider
                  pagination={paginationFactory(pageOptions)}
                  keyField="id"
                  columns={this.state.cartListColumns}
                  data={quotes}
                >
                  {({ paginationProps, paginationTableProps }) => (
                    <ToolkitProvider
                      keyField="id"
                      columns={this.state.cartListColumns}
                      data={quotes}
                      search
                    >
                      {(toolkitprops) => (
                        <React.Fragment>
                          <Row className="mb-2">
                            <Col sm="4">
                              <div className="search-box ms-2 mb-2 d-inline-block">
                                <div className="position-relative">
                                  <SearchBar {...toolkitprops.searchProps} />
                                  <i className="bx bx-search-alt search-icon" />
                                </div>
                              </div>
                            </Col>
                            <Col sm="4">
                        <button
                          className="btn btn-danger"
                          // onClick={this.handleEmptyCart}
                          disabled={this.state.quotes.length == 0}
                        >
                          <i className="mdi mdi-delete-empty me-1" />
                          See Quote
                        </button>
                      </Col>
                          </Row>
                         
                          <Row>
                            <Col xl="12">
                              <div className="table-responsive">
                                <BootstrapTable
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                  defaultSorted={defaultSorted}
                                  classes={"table align-middle table-hover table-responsive"} // Added responsive class here
                                  bordered={false}
                                  striped={true}
                                  headerWrapperClasses={"table-light"}
                                  responsive
                                  ref={this.node}
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row className="align-items-md-center mt-30">
                            <Col className="pagination pagination-rounded justify-content-end mb-2">
                              <PaginationListStandalone
                                {...paginationProps}
                              />
                            </Col>
                          </Row>
                        </React.Fragment>
                      )}
                    </ToolkitProvider>
                  )}
                </PaginationProvider> */}
                               {!isEmpty(this.props.quotes.labs_offering_tests) ? (
  this.props.quotes.labs_offering_tests.map((lab, labIndex) => (
    <div key={`lab_${labIndex}`}>
      <h3 style={{ textAlign: 'center' }}>{lab.lab_details.lab_name}</h3>
      <Table key={`table_${labIndex}`}>
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Test Details</th>
            {/* Add more column headings if needed */}
          </tr>
        </thead>
        <tbody>
          {!isEmpty(lab.tests_offered) ? (
            lab.tests_offered.map((test, testIndex) => (
              <tr key={`test_${testIndex}`}>
                <td className="float-start" >{test.test_name}</td>
                <td>{test.test_details}</td>
                {/* Add more columns if needed */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No tests offered by this lab.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  ))
) : (
  <h5>Sorry! No labs found near you offering these tests.</h5>
)}




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

CartList.propTypes = {
  history: PropTypes.any,
  location: PropTypes.any,
  match: PropTypes.object,
  quotes: PropTypes.any,
  className: PropTypes.any,
  onGetQuotes: PropTypes.func,
  onDeleteCart: PropTypes.func,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStateToProps = ({ quotes }) => ({
  quotes: quotes.quotes,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetQuotes: id => dispatch(getQuotes(id)),
  onDeleteCart: cartItem => dispatch(deleteCart(cartItem)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CartList));
