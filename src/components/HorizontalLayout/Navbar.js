import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col, Collapse } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import classname from "classnames";
import { connect } from "react-redux";

//i18n
import { withTranslation } from "react-i18next";
import "./horizontal-navbar.scss";
import { getPatientProfile } from "store/labmarket/actions";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientProfile: [],

      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      user_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
    };
    console.log("yaha ani chahi hai uuid", this.props.match.params.uuid);
    console.log("yaha ani chahi hai guid", this.props.match.params.guest_id);
    console.log("yaha ani chahi hai fuid", this.props.match.params.filnalur);
  }

  componentDidMount() {
    let matchingMenuItem = null;
    const ul = document.getElementById("navigation");
    const items = ul.getElementsByTagName("a");
    for (let i = 0; i < items.length; ++i) {
      if (this.props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }
    const { patientProfile, getPatientProfile } = this.props;
    getPatientProfile(this.state.user_id);
    this.setState({
      patientProfile
    });
    console.log("state in navbar", patientProfile);
  }

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

  render() {
    const { patientProfile } = this.props;

    return (
      <React.Fragment>
        <div className="topnav">
          <div className="container-fluid left-space">
            <nav
              className="navbar navbar-light navbar-expand-lg topnav-menu"
              id="navigation"
            >
              {this.state.user_id &&
                this.state.user_type === "CSR" &&
                this.state.user_type !== "b2bclient" ? (
                <Collapse
                  isOpen={this.props.menuOpen}
                  className="navbar-collapse"
                  id="topnav-menu-content"
                >
                  <ul className="navbar-nav">
                    {this.props.patientProfile && (
                      <>
                        {!this.props.patientProfile.is_assosiatewith_anycorporate && !this.props.patientProfile.employee_id_card ? (
                          <>
                           <li className="nav-item">
                      <Link
                        to={"/tests-offered-labhazir"
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Book a Test</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
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
                        to={"/nearby-packages"
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Packages</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={"/nearby-radiology"
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Radiology</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
                          </>) : (this.props.patientProfile.is_assosiatewith_anycorporate && this.props.patientProfile.employee_id_card) ? (
                          <>
                            <li className="nav-item">
                              <Link
                                to={this.props.match.params.guest_id ? `/corporate-labs/${this.props.match.params.guest_id}` :
                                  this.props.match.params.uuid ? `/corporate-labs/${this.props.match.params.uuid}` : `/corporate-labs`}
                                className="dropdown-item"
                              >
                                <span className="pt-4 font-size-12">Labs</span>
                              </Link>
                            
                            </li>
                             <li className="nav-item">
                             <Link
                                to={this.props.match.params.guest_id ? `/test-appointments/${this.props.match.params.guest_id}` :
                                  this.props.match.params.uuid ? `/test-appointments/${this.props.match.params.uuid}` : `/corporate-labs`}
                                className="dropdown-item"
                              >
                                <span className="pt-4 font-size-12">My Appointments</span>
                              </Link>
                             
                           </li>
                           </>
                          ) : null}
                      </>
                    )}

                    {this.state.user_id && this.state.user_type == "patient" && (
                      <li className="nav-item">
                        <Link
                          to={"/test-appointments"}
                          className="dropdown-item"
                        >
                          {/* {this.props.t("My Appointments")} */}
                          <span className="pt-4 font-size-12">
                            My Appointments
                          </span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </Collapse>
              ) : null}
              {!this.state.user_id ? (
                <Collapse
                  isOpen={this.props.menuOpen}
                  className="navbar-collapse"
                  id="topnav-menu-content"
                >
                  <ul className="navbar-nav">
                    {this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/tests-offered-labhazir/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                              : `/tests-offered-labhazir/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Book a Test</span>
                        </Link>
                      </li>
                    ) : !this.props.match.params.filnalurl && this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/tests-offered-labhazir/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                              : `/tests-offered-labhazir/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Book a Test</span>
                        </Link>
                      </li>
                    ) : null}
                    {this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
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
                    ) : !this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
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
                    ) : null}
                    {this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
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
                    ) : !this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
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
                    {this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
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
                    ) : !this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
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

                    {this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
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
                    ) : !this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
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

                    {this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
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
                    ) : !this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
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

                    {this.state.user_id && this.state.user_type == "patient" && (
                      <li className="nav-item">
                        <Link
                          to={"/test-appointments"}
                          className="dropdown-item"
                        >
                          {/* {this.props.t("My Appointments")} */}
                          <span className="pt-4 font-size-12">
                            My Appointments
                          </span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </Collapse>
              ) : this.state.user_id &&
                this.state.user_type !== "CSR" &&
                this.state.user_type !== "b2bclient" ? (
                <Collapse
                  isOpen={this.props.menuOpen}
                  className="navbar-collapse"
                  id="topnav-menu-content"
                >
                  <ul className="navbar-nav">
                    {this.props.patientProfile && (
                      <>
                        {!this.props.patientProfile.is_assosiatewith_anycorporate && !this.props.patientProfile.employee_id_card ? (
                          <>
                            <li className="nav-item">
                              <Link
                                to={this.props.match.params.guest_id ? `/tests-offered-labhazir/${this.props.match.params.guest_id}` :
                                  this.props.match.params.uuid ? `/tests-offered-labhazir/${this.props.match.params.uuid}` : `/tests-offered-labhazir`}
                                className="dropdown-item"
                              >
                                <span className="pt-4 font-size-12">Book a Test</span>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                to={this.props.match.params.guest_id ? `/labs/${this.props.match.params.guest_id}` :
                                  this.props.match.params.uuid ? `/labs/${this.props.match.params.uuid}` : `/labs`}
                                className="dropdown-item"
                              >
                                <span className="pt-4 font-size-12">Labs</span>
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
                                    : this.props.match.params.uuid
                                      ? `/nearby-test/${this.props.match.params.uuid}`
                                      : `/nearby-test`
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
                                    : this.props.match.params.uuid
                                      ? `/nearby-profiles/${this.props.match.params.uuid}`
                                      : `/nearby-profiles`
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
                                    : this.props.match.params.uuid
                                      ? `/nearby-packages/${this.props.match.params.uuid}`
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
                                    : this.props.match.params.uuid
                                      ? `/nearby-radiology/${this.props.match.params.uuid}`
                                      : `/nearby-radiology`
                                }
                                className="dropdown-item"
                              >
                                <span className="pt-4 font-size-12">Radiology</span>
                                {/* {this.props.t("Packages")} */}
                              </Link>
                            </li>
                          </>) : (this.props.patientProfile.is_assosiatewith_anycorporate && this.props.patientProfile.employee_id_card) ? (
                            <li className="nav-item">
                              <Link
                                to={this.props.match.params.guest_id ? `/corporate-labs/${this.props.match.params.guest_id}` :
                                  this.props.match.params.uuid ? `/corporate-labs/${this.props.match.params.uuid}` : `/corporate-labs`}
                                className="dropdown-item"
                              >
                                <span className="pt-4 font-size-12">Labs</span>
                              </Link>
                            </li>) : null}
                      </>
                    )}

                    {this.state.user_id && this.state.user_type === "patient" && (
                      <li className="nav-item">
                        <Link
                          to={this.props.match.params.guest_id ? `/test-appointments/${this.props.match.params.guest_id}` :
                            this.props.match.params.uuid ? `/test-appointments/${this.props.match.params.uuid}` : `/test-appointments`}
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">My Appointments</span>
                        </Link>
                      </li>
                    )}
                  </ul>


                </Collapse>
              ) : this.state.user_id &&
                this.state.user_type !== "CSR" &&
                this.state.user_type === "b2bclient" ? (
                <Collapse
                  isOpen={this.props.menuOpen}
                  className="navbar-collapse"
                  id="topnav-menu-content"
                >
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/tests-offered-labhazir/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/tests-offered-labhazir`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Book a Test</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
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
                        <Link
                          to={"/test-appointments"}
                          className="dropdown-item"
                        >
                          {/* {this.props.t("My Appointments")} */}
                          <span className="pt-4 font-size-12">
                            My Appointments
                          </span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </Collapse>
              ) : null}
            </nav>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Navbar.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
  patientProfile: PropTypes.array,
  getPatientProfile: PropTypes.func,
};

// Header.propTypes = {
//   match: PropTypes.object,
//   openLeftMenuCallBack: PropTypes.func,
//   t: PropTypes.any,
//   toggleRightSidebar: PropTypes.func,
//   carts: PropTypes.array,
//   getCarts: PropTypes.func,
//   patientProfile: PropTypes.array,
//   getPatientProfile: PropTypes.func,
// };

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
  connect(mapStateToProps, { getPatientProfile })(withTranslation()(Navbar))
);