import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { withRouter, Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

import { connect } from "react-redux";

// actions
import { getLabProfile } from "store/auth/labprofile/actions";

// actions
import { getB2bProfile } from "store/auth/b2bprofile/actions";

// actions
import { getPatientProfile } from "store/auth/patientprofile/actions";
import Tooltip from "@material-ui/core/Tooltip";

class ProfileMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      name: "",
      logo: "",
      account_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      menu: !prevState.menu,
    }));
  }

  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        <Dropdown
          isOpen={this.state.menu}
          toggle={this.toggle}
          className="d-inline-block"
        >
          <Tooltip title="Account">
          <DropdownToggle
            className="btn header-item"
            id="page-header-user-dropdown"
            tag="button"
          >
            <i className="mdi mdi-account-circle font-size-24 d-xl-inline-block" />
          </DropdownToggle>
          </Tooltip>


          <DropdownMenu className="dropdown-menu-end">
            {this.state.account_type && this.state.account_type == "labowner" && (
              <DropdownItem tag="a" href={"/lab-profile"}>
                <i className="mdi mdi-account font-size-16 align-middle ms-1" />{" "}
                {this.props.t("Lab Profile")}
              </DropdownItem>
            )}
            {this.state.account_type && this.state.account_type == "b2bclient" && (
              <DropdownItem tag="a" href={"/b2b-profile"}>
                <i className="mdi mdi-account font-size-16 align-middle ms-1" />{" "}
                {this.props.t("B2B Profile")}
              </DropdownItem>
            )}
             {this.state.account_type && this.state.account_type == "donor" && (
              <DropdownItem tag="a" href={"/donor-profile"}>
                <i className="mdi mdi-account font-size-16 align-middle ms-1" />{" "}
                {this.props.t("Donor Profile")}
              </DropdownItem>
            )}

            {/* {this.props.location &&
            this.props.location.pathname.includes("dashboard-corporate") ? (
              <DropdownItem
                tag="a"
                href={
                  "/dashboard-corporate/" +
                  this.props.match.params.id +
                  "/profile"
                }
              >
                <i className="mdi mdi-account-edit font-size-16 align-middle ms-1" />{" "}
                {this.props.t("Corporate Profile")}
              </DropdownItem>
            ) : null} */}

            <DropdownItem tag="a" href={"/change-password"}>
              <i className="mdi mdi-account-lock font-size-16 align-middle ms-1" />{" "}
              {this.props.t("Change Password")}
            </DropdownItem>

            <Link to="/logout" className="dropdown-item">
              <i className="mdi mdi-power font-size-16 align-middle me-1 text-danger" />{" "}
              <span>{this.props.t("Logout")}</span>
            </Link>
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    );
  }
}

ProfileMenu.propTypes = {
  t: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  error: PropTypes.any,
  success: PropTypes.any,
  getLabProfile: PropTypes.func,
  getB2bProfile: PropTypes.func,
  getPatientProfile: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
  if (ownProps.location.pathname.includes("dashboard-patient")) {
    const { error, success } = state.PatientProfile;
    return { error, success };
  } else if (ownProps.location.pathname.includes("dashboard-lab")) {
    const { error, success } = state.LabProfile;
    return { error, success };
  } else if (ownProps.location.pathname.includes("dashboard-b2b")) {
    const { error, success } = state.B2bProfile;
    return { error, success };
  }
};

export default withRouter(
  connect(mapStateToProps, { getLabProfile, getB2bProfile, getPatientProfile })(
    withTranslation()(ProfileMenu)
  )
);