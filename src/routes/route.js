import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
// import { v4 as uuidv4 } from 'uuid';


const AppRoute = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  isLabAuthProtected,
  isPatientAuthProtected,
  isCorporateAuthProtected,
  isB2BClientAuthProtected,
  isDonorAuthProtected,
  isSampleCollectorAuthProtected,
  isB2BAdminAuthProtected,
  isAuditorAuthProtected,
  isfinanceOfficerAuthProtected,
  isfinanceAdminAuthProtected,
  isRegistrationAdminAuthProtected,
  isMarketerAdminAuthProtected,
  isCSRAdminAuthProtected,
  isCSRAuthProtected,
  isAuditorAdminAuthProtected,
  isHRAdminAuthProtected,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      /* If the route is LabAuthProtected or CorporateAuthProtected then check if account type is patient
        - If yes then redirect it to the dashboard of the patient */

      /* If the route is PatientAuthProtected or CorporateAuthProtected then check if account type is labowner
        - If yes then redirect it to the dashboard of the labowner */

      /* If the route is PatientAuthProtected or LabAuthProtected then check if account type is corporate
        - If yes then redirect it to the dashboard of the corporate */

      if (isAuthProtected && !localStorage.getItem("authUser")) {
        // const guest_id = Math.floor(Math.random() * 10);
        // this.setState({ guest_id: guest_id });
        // guest_id = this.state.guest_id
        // console.log("differ route main set hoi:",guest_id)




        return (
          <Redirect
            // to={{ pathname: "/nearby-labs/"+ guest_id, state: { from: props.location } }}
            to={
              { pathname: "/nearby-labs", state: { from: props.location } }
       
            }
          />
        );
      }

      // Auth protection logics for the patient
      else if (
        isAuthProtected &&
        (isLabAuthProtected ||
          isCorporateAuthProtected ||
          isB2BClientAuthProtected ||
          isDonorAuthProtected ||
          isAuditorAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isfinanceAdminAuthProtected ||
          isB2BAdminAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isMarketerAdminAuthProtected ||
          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "patient"
      ) {
        return <Redirect to="/nearby-labs" />;
      }

      // Auth protection logics for the lab
      else if (
        isAuthProtected &&
        (isPatientAuthProtected ||
          isCorporateAuthProtected ||
          isB2BClientAuthProtected ||
          isDonorAuthProtected ||
          isAuditorAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isfinanceAdminAuthProtected ||
          isB2BAdminAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isMarketerAdminAuthProtected ||
          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "labowner"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/dashboard-lab",
              state: { from: props.location },
            }}
          />
        );
      }

      // Auth protection logics for the corporate
      else if (
        isAuthProtected &&
        (isPatientAuthProtected ||
          isLabAuthProtected ||
          isB2BClientAuthProtected ||
          isDonorAuthProtected ||
          isAuditorAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isfinanceAdminAuthProtected ||
          isB2BAdminAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isMarketerAdminAuthProtected ||
          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "corporate"
      ) {
        return (
          <Redirect
            to={{
              pathname:
                "/dashboard-corporate" ,
                state: { from: props.location },
            }}
          />
        );
      }

      // Auth protection logics for the b2bclient
      else if (
        isAuthProtected &&
        (isPatientAuthProtected ||
          isLabAuthProtected ||
          isCorporateAuthProtected ||
          isDonorAuthProtected ||
          isAuditorAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isfinanceAdminAuthProtected ||
          isB2BAdminAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isMarketerAdminAuthProtected ||
          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "b2bclient"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/dashboard-b2bclient",
              state: { from: props.location },
            }}
          />
        );
      }

      // Auth protection logics for the b2bclient
      else if (
        isAuthProtected &&
        (isPatientAuthProtected ||
          isLabAuthProtected ||
          isCorporateAuthProtected ||
          isB2BClientAuthProtected ||
          isAuditorAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isfinanceAdminAuthProtected ||
          isB2BAdminAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isMarketerAdminAuthProtected ||
          isAuditorAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "donor"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/unhandled-complaints",
              state: { from: props.location },
            }}
          />
        );
      }

      // Auth protection logics for the b2badmin
      else if (
        isAuthProtected &&
        (isPatientAuthProtected ||
          isLabAuthProtected ||
          isCorporateAuthProtected ||
          isDonorAuthProtected ||
          isB2BClientAuthProtected ||
          isAuditorAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isfinanceAdminAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isMarketerAdminAuthProtected ||
          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "b2b-admin"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/b2b-clients-list",
              state: { from: props.location },
            }}
          />
        );
      }

      // Auth protection logics for the auditor
      else if (
        isAuthProtected &&
        (isPatientAuthProtected ||
          isLabAuthProtected ||
          isCorporateAuthProtected ||
          isB2BClientAuthProtected ||
          isDonorAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isfinanceAdminAuthProtected ||
          isB2BAdminAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isMarketerAdminAuthProtected ||
          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "auditor"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/dashboard-auditor",
              state: { from: props.location },
            }}
          />
        );
      }

      // Auth protection logics for the sample collector
      else if (
        isAuthProtected &&
        (isPatientAuthProtected ||
          isLabAuthProtected ||
          isCorporateAuthProtected ||
          isB2BClientAuthProtected ||
          isDonorAuthProtected ||
          isAuditorAuthProtected ||
          isB2BAdminAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isfinanceAdminAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isMarketerAdminAuthProtected ||
          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type ==
          "samplecollector"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/dashboard-samplecollector",
              state: { from: props.location },
            }}
          />
        );
      }

      // Auth protection logics for the registration admin
      else if (
        isAuthProtected &&
        (isPatientAuthProtected ||
          isLabAuthProtected ||
          isCorporateAuthProtected ||
          isB2BClientAuthProtected ||
          isB2BAdminAuthProtected ||
          isDonorAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isfinanceAdminAuthProtected ||
          isAuditorAuthProtected ||
          isMarketerAdminAuthProtected ||
          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type ==
          "registration-admin"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/pending-labs",
              state: { from: props.location },
            }}
          />
        );
      }

      // Auth protection logics for the marketer admin
      else if (
        isAuthProtected &&
        (isPatientAuthProtected ||
          isLabAuthProtected ||
          isCorporateAuthProtected ||
          isB2BClientAuthProtected ||
          isDonorAuthProtected ||
          isB2BAdminAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isfinanceAdminAuthProtected ||
          isAuditorAuthProtected ||
          isCSRAuthProtected ||
          isMarketerAdminAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isAuditorAdminAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "csr-admin"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/pending-complaints-lab",
              state: { from: props.location },
            }}
          />
        );
      } else if (
        isAuthProtected &&
        (isPatientAuthProtected ||
          isLabAuthProtected ||
          isCorporateAuthProtected ||
          isB2BClientAuthProtected ||
          isB2BAdminAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isfinanceAdminAuthProtected ||
          isAuditorAuthProtected ||
          isCSRAdminAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isMarketerAdminAuthProtected ||
          isDonorAuthProtected ||
          isAuditorAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "CSR"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/dashboard-csr",
              state: { from: props.location },
            }}
          />
        );
      }

      // Auth protection logics for the auditor admin
      else if (
        isAuthProtected &&
        (isPatientAuthProtected ||
          isLabAuthProtected ||
          isCorporateAuthProtected ||
          isB2BClientAuthProtected ||
          isB2BAdminAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isfinanceAdminAuthProtected ||
          isAuditorAuthProtected ||
          isCSRAdminAuthProtected ||
          isDonorAuthProtected ||
          isCSRAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isMarketerAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type ==
          "auditor-admin"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/pending-audits",
              state: { from: props.location },
            }}
          />
        );
      }

      // Auth protection logics for the hr admin
      else if (
        isAuthProtected &&
        (isPatientAuthProtected ||
          isLabAuthProtected ||
          isCorporateAuthProtected ||
          isB2BClientAuthProtected ||
          isB2BAdminAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isfinanceAdminAuthProtected ||
          isAuditorAuthProtected ||
          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isDonorAuthProtected ||
          isMarketerAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type == "hr-admin"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/add-staff",
              state: { from: props.location },
            }}
          />
        );
      }

      // Auth protection logics for the marketer admin
      else if (
        isAuthProtected &&
        (isPatientAuthProtected ||
          isLabAuthProtected ||
          isCorporateAuthProtected ||
          isB2BClientAuthProtected ||
          isB2BAdminAuthProtected ||
          isSampleCollectorAuthProtected ||
          isfinanceOfficerAuthProtected ||
          isfinanceAdminAuthProtected ||
          isAuditorAuthProtected ||
          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isDonorAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type ==
          "marketer-admin"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/advertisements",
              state: { from: props.location },
            }}
          />
        );
      }
       // Auth protection logics for the finance officer
       else if (
        isAuthProtected &&
        (isPatientAuthProtected ||
          isLabAuthProtected ||
          isCorporateAuthProtected ||
          isB2BClientAuthProtected ||
          isB2BAdminAuthProtected ||
          isfinanceAdminAuthProtected ||
          isSampleCollectorAuthProtected ||
          isAuditorAuthProtected ||
          isCSRAdminAuthProtected ||
          isCSRAuthProtected ||
          isAuditorAdminAuthProtected ||
          isDonorAuthProtected ||
          isRegistrationAdminAuthProtected ||
          isMarketerAdminAuthProtected ||
          isHRAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type ==
          "finance-officer"
      ) {
        return (
          <Redirect
            to={{
              pathname: "/dashboard-finance",
              state: { from: props.location },
            }}
          />
        );
      }
             // Auth protection logics for the finance Admin
             else if (
              isAuthProtected &&
              (isPatientAuthProtected ||
                isLabAuthProtected ||
                isCorporateAuthProtected ||
                isB2BClientAuthProtected ||
                isB2BAdminAuthProtected ||
                isfinanceOfficerAuthProtected ||
                isSampleCollectorAuthProtected ||
                isAuditorAuthProtected ||
                isCSRAdminAuthProtected ||
                isCSRAuthProtected ||
                isAuditorAdminAuthProtected ||
                isDonorAuthProtected ||
                isRegistrationAdminAuthProtected ||
                isMarketerAdminAuthProtected ||
                isHRAdminAuthProtected) &&
              JSON.parse(localStorage.getItem("authUser")).account_type ==
                "finance-admin"
            ) {
              return (
                <Redirect
                  to={{
                    pathname: "/dashboard-financeadmin",
                    state: { from: props.location },
                  }}
                />
              );
            }

      return (
        <Layout>
          <Component {...props} />
        </Layout>
      );
    }}
  />
);

AppRoute.propTypes = {
  isAuthProtected: PropTypes.bool,
  isLabAuthProtected: PropTypes.bool,
  isB2BClientAuthProtected: PropTypes.bool,
  isDonorAuthProtected: PropTypes.bool,
  isSampleCollectorAuthProtected: PropTypes.bool,
  isfinanceOfficerAuthProtected: PropTypes.bool,
  isfinanceAdminAuthProtected: PropTypes.bool,
  isB2BAdminAuthProtected: PropTypes.bool,
  isAuditorAuthProtected: PropTypes.bool,
  isRegistrationAdminAuthProtected: PropTypes.bool,
  isMarketerAdminAuthProtected: PropTypes.bool,
  isCSRAdminAuthProtected: PropTypes.bool,
  isCSRAuthProtected: PropTypes.bool,
  isAuditorAdminAuthProtected: PropTypes.bool,
  isHRAdminAuthProtected: PropTypes.bool,
  isPatientAuthProtected: PropTypes.bool,
  isCorporateAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
};

export default AppRoute;
