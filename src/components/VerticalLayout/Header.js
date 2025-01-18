import PropTypes from "prop-types";
import React, { Component } from "react";
import "react-drawer/lib/react-drawer.css";

import { connect } from "react-redux";
import { Row, Col } from "reactstrap";

import { Link } from "react-router-dom";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";

import logo from "../../assets/images/logo.svg";
import logoLightPng from "../../assets/images/logo-light.png";
import logoLightSvg from "../../assets/images/logo-light.svg";
import logoDark from "../../assets/images/logo-dark.png";

//i18n
import { withTranslation } from "react-i18next";

// Redux Store
import { toggleRightSidebar } from "../../store/actions";
import NotificationDropdown from "components/CommonForBoth/TopbarDropdown/NotificationDropdown";
import SampleNotificationDropdown from "components/CommonForBoth/TopbarDropdown/SampleNotificationDropdown";
import MarketerNotificationDropdown from "components/CommonForBoth/TopbarDropdown/MarketerNotificationDropdown";
import CsrAdminNotificationDropdown from "components/CommonForBoth/TopbarDropdown/CsrAdminNotificationDropdown";
import CsrOfficerNotificationDropdown from "components/CommonForBoth/TopbarDropdown/CsrOfficerNotificationDropdown";
import RegAdminNotificationDropdown from "components/CommonForBoth/TopbarDropdown/RegAdminNotificationDropdown";
import Tooltip from "@material-ui/core/Tooltip";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearch: false,
      open: false,
      account_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
      position: "right",
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
  }
  /**
   * Toggle sidebar
   */
  toggleMenu() {
    this.props.toggleMenuCallback();
  }

  /**
   * Toggles the sidebar
   */
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

  render() {
    return (
      <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="d-flex">
              <Tooltip title="Menu">
              <button
                type="button"
                onClick={this.toggleMenu}
                className="btn btn-sm px-3 font-size-16 header-item"
                id="vertical-menu-btn"
              >
                <i className="fa fa-fw fa-bars"></i>
              </button>
              </Tooltip>
            </div>
            <div className="d-flex">
              <div className="dropdown d-none d-lg-inline-block ms-1">
                <Tooltip title="Full Screen">
                <button
                  type="button"
                  onClick={this.toggleFullscreen}
                  className="btn header-item noti-icon"
                  data-toggle="fullscreen"
                >
                  <i className="bx bx-fullscreen"></i>
                </button>
                </Tooltip>
              </div>
              {this.state.account_type && this.state.account_type == "labowner" &&  (
                <Tooltip title="Notifications">
              <NotificationDropdown />
              </Tooltip>
              )}
              {this.state.account_type && this.state.account_type == "samplecollector" &&  (
                <Tooltip title="Notifications">
              <SampleNotificationDropdown />
              </Tooltip>
              )}
               {this.state.account_type && this.state.account_type == "marketer-admin" &&  (
                <Tooltip title="Notifications">
              <MarketerNotificationDropdown />
              </Tooltip>
              )}
               {this.state.account_type && this.state.account_type == "csr-admin" &&  (
                <Tooltip title="Notifications">
              <CsrAdminNotificationDropdown />
              </Tooltip>
              )}
              {this.state.account_type && this.state.account_type == "CSR" &&  (
                <Tooltip title="Notifications">
              <CsrOfficerNotificationDropdown />
              </Tooltip>
              )}
               {this.state.account_type && this.state.account_type == "registration-admin" &&  (
                <Tooltip title="Notifications">
              <RegAdminNotificationDropdown />
              </Tooltip>
              )}
              <ProfileMenu />
            </div>
           
          </div>
        </header>
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  t: PropTypes.any,
  toggleMenuCallback: PropTypes.any,
  showRightSidebar: PropTypes.any,
  toggleRightSidebar: PropTypes.func,
};

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar } = state.Layout;
  return { layoutType, showRightSidebar };
};

export default connect(mapStatetoProps, { toggleRightSidebar })(
  withTranslation()(Header)
);
