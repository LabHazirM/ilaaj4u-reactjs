import React, { Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

// Import Routes
import {
  authProtectedRoutes,
  labAuthProtectedRoutes,
  patientAuthProtectedRoutes,
  patientPublicRoutes,
  corporateAuthProtectedRoutes,
  b2bclientAuthProtectedRoutes,
  donorAuthProtectedRoutes,
  sampleCollectorAuthProtectedRoutes,
  financeOfficerAuthProtectedRoutes,
  financeAdminAuthProtectedRoutes,
  b2badminAuthProtectedRoutes,
  auditorAuthProtectedRoutes,
  registrationAdminAuthProtectedRoutes,
  marketerAdminAuthProtectedRoutes,
  csrAdminAuthProtectedRoutes,
  csrAuthProtectedRoutes,
  auditorAdminAuthProtectedRoutes,
  hrAdminAuthProtectedRoutes,
  publicRoutes,
} from "./routes/";
import AppRoute from "./routes/route";

// layouts
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";

// Import fackbackend Configuration file
import fakeBackend from "./helpers/AuthType/fakeBackend";
import Pages404 from "pages/Utility/pages-404";

// Activating fake backend
fakeBackend();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getLayout = this.getLayout.bind(this);
  }

  /**
   * Returns the layout
   */
  getLayout = () => {
    let layoutCls = VerticalLayout;

    // For patient protected routes
    if (patientAuthProtectedRoutes) {
      layoutCls = HorizontalLayout;
    } else {
      switch (this.props.layout.layoutType) {
        default:
          layoutCls = VerticalLayout;
          break;
      }
    }
    return layoutCls;
  };

  render() {
    const Layout = this.getLayout();

    return (
      <React.Fragment>
        <Router>
          <Switch>
            {publicRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={false}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
              />
            ))}

            {authProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

            {labAuthProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={true}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

            {b2bclientAuthProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={true}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

            {donorAuthProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={true}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

            {b2badminAuthProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={true}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

            {auditorAuthProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={true}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

            {csrAuthProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={true}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

            {registrationAdminAuthProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={true}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

            {csrAdminAuthProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={true}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

            {marketerAdminAuthProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={true}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

            {auditorAdminAuthProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={true}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

            {hrAdminAuthProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={true}
                exact
              />
            ))}

            {sampleCollectorAuthProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={true}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}
             {financeOfficerAuthProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={true}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}
{financeAdminAuthProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={true}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

            {patientAuthProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isPatientAuthProtected={true}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

            {patientPublicRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={false}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={false}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

            {corporateAuthProtectedRoutes.map((route) => (
              <AppRoute
                key={idx}
                isAuthProtected={true}
                isLabAuthProtected={false}
                isPatientAuthProtected={false}
                isCorporateAuthProtected={true}
                isB2BClientAuthProtected={false}
                isSampleCollectorAuthProtected={false}
                isfinanceOfficerAuthProtected={false}
                isfinanceAdminAuthProtected={false}
                isB2BAdminAuthProtected={false}
                isAuditorAuthProtected={false}
                isDonorAuthProtected={false}
                isRegistrationAdminAuthProtected={false}
                isMarketerAdminAuthProtected={false}
                isCSRAdminAuthProtected={false}
                isCSRAuthProtected={false}
                isAuditorAdminAuthProtected={false}
                isHRAdminAuthProtected={false}
                exact
              />
            ))}

          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  };
};

App.propTypes = {
  layout: PropTypes.object,
};

export default connect(mapStateToProps, null)(App);
