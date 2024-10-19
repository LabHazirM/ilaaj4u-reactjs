import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { logoutUser } from "../../store/actions";

class Logout extends Component {
  /**
   * Redirect to login
   */
  componentDidMount = () => {
    // emit the event
    this.props.logoutUser(this.props.history);
    const isSmallScreen = window.innerWidth < 490;
    if(isSmallScreen){
      this.props.history.push("/login");
    }
    else{
    this.props.history.push("/nearby-labs");
    }
  };

  render() {
    return <React.Fragment></React.Fragment>;
  }
}

Logout.propTypes = {
  history: PropTypes.any,
  logoutUser: PropTypes.func,
};

export default withRouter(connect(null, { logoutUser })(Logout));
