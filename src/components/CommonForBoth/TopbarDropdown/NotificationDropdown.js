import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Row,
  Col,
  CardBody,
  Card,
  Container,
} from "reactstrap";
import SimpleBar from "simplebar-react";
import Breadcrumbs from "components/Common/Breadcrumb";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { isEmpty, map } from "lodash";

//Import images
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../assets/images/users/avatar-4.jpg";

//i18n
import { withTranslation } from "react-i18next";
import { getNotification } from "store/activtylog/actions";
import Tooltip from "@material-ui/core/Tooltip";

class NotificationDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      notification: [],
      notification: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount() {
    const { notification, onGetNotification } = this.props;
    // console.log(onGetNotification(this.state.user_id));
    
     // Retrieve the previous API call time from localStorage
    const previousApiCallTime = localStorage.getItem('api_call_time');
    console.log("previousApiCallTime",previousApiCallTime)

  // Call the onGetNotification action with user_id and previousApiCallTime
    onGetNotification(this.state.user_id, previousApiCallTime);
    this.setState({ notification });
  // Get the current time
    const currentApiCallTime = new Date();

    // Store the current API call time in localStorage
    localStorage.setItem('api_call_time', currentApiCallTime.toISOString());
    // Or store in component state
    // this.setState({ apiCallTime: currentApiCallTime });
  }
  toggle() {
    this.setState(prevState => ({
      menu: !prevState.menu,
    }));
  }
  render() {
    const { SearchBar } = Search;

    const { notification } = this.props;
    const { onGetNotification } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: notification.length, // replace later with size(notification),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "asc", // desc or asc
      },
    ];
    return (
      console.log("notifications_count", this.props.notification.notifications_count),
      <React.Fragment>
        <Dropdown
          isOpen={this.state.menu}
          toggle={this.toggle}
          className="dropdown d-inline-block"
          tag="li"
        >
          <Tooltip title="Notifications">
          <DropdownToggle
            className="btn header-item noti-icon"
            tag="button"
            id="page-header-notifications-dropdown"
          >
            {!isEmpty(this.props.notification) &&
                  this.props.notification.map((notification, key) => (
                    <Col key={"col" + key}>
                      {notification.notifications_count > 0 && (
                        <div>
            <i className="bx bx-bell bx-tada" />
            <span className="badge bg-danger rounded-pill">{notification.notifications_count}</span>
            </div> )}
            {notification.notifications_count === 0 && (
                        <div>
            <i className="bx bx-bell bx-tada" />
            <span className="badge bg-danger rounded-pill"></span>
            </div> 
            )}
            </Col>
                  ))}
          </DropdownToggle>
          </Tooltip>
          <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
            <div className="p-3">
              <Row className="align-items-center">
                <Col>
                  <h6 className="m-0"> {this.props.t("Notifications")} </h6>
                </Col>
                <div className="col-auto">
                </div>
              </Row>
            </div>

            <SimpleBar style={{ height: "230px" }}>
              <Link to="/pending-test-appointments" className="text-reset notification-item">
                {!isEmpty(this.props.notification) &&
                  this.props.notification.map((notification, key) => (
                    <Col key={"col" + key}>
                      <>
                      {notification.items.map(
                                              (item, key) => (
                     
                      <div key={"item" + key} className="d-flex mt-0">
                       {item.order_id ? (
  item.actions === "Added" && (
    <div>
      <i className="fas fa-plus-square font-size-18"></i>{" "}
      You have a new Appointment with order id{" "}
      <b>{item.order_id}</b> booked at{" "}
      {new Date(item.booked_at).toLocaleTimeString("en-US")}
      .
    </div>
  )
) : (
  item.actions === "Added" && (
    <div>
      <i className="fas fa-plus-square font-size-18"></i>{" "}
      Your <b>{item.corporate_name}</b> Corporation has conducted a new test add on{" "}
      {new Date(item.created_at).toLocaleTimeString("en-US")}
      .
    </div>
  )
)}
{item.order_id ? (
  item.actions === "Updated" && (
    <div>
    <i className="fas fa-exchange-alt font-size-18"></i>{" "}
    {item.lab_name} Changed{" "}
    <b>{item.test_name} </b>{" "}
    {item.field_name} from{" "}
    {item.old_value} to {item.new_value}{" "}
    on{" "}
    {new Date(
      notification.created_at
    ).toLocaleDateString("en-US")}{" "}
    at{" "}
    {new Date(
      notification.created_at
    ).toLocaleTimeString("en-US")}
    .
  </div>
  )
) : (
  item.actions === "Updated" && (
    <div>
      <i className="fas fa-plus-square font-size-18"></i>{" "}
      Your <b>{item.corporate_name}</b> Corporation Changed test price on {" "}
      {new Date(item.created_at).toLocaleTimeString("en-US")}
      .
    </div>
  )
)}

                        
                        {/* {item.actions == "Updated" && (
                          <div>
                            <i className="fas fa-exchange-alt font-size-18"></i>{" "}
                            {item.lab_name} Changed{" "}
                            <b>{item.test_name} </b>{" "}
                            {item.field_name} from{" "}
                            {item.old_value} to {item.new_value}{" "}
                            on{" "}
                            {new Date(
                              notification.created_at
                            ).toLocaleDateString("en-US")}{" "}
                            at{" "}
                            {new Date(
                              notification.created_at
                            ).toLocaleTimeString("en-US")}
                            .
                          </div>
                        )} */}
                        {item.actions == "Cancelled" && (
                          <div>
                            <i className="fas fa-sync-alt font-size-18"></i>{" "}
                            Appointment with order id {item.order_id} is Cancelled at 
                            {" "} {new Date(
                              item.cancelled_at
                            ).toLocaleTimeString("en-US")}
                            .
                          </div>
                        )}
                      </div>
                                              ))}
                                              </>
                    </Col>
                  ))}
              </Link>
            </SimpleBar>
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    );
  }
}
NotificationDropdown.propTypes = {
  match: PropTypes.object,
  notification: PropTypes.array,
  className: PropTypes.any,
  onGetNotification: PropTypes.func,
  history: PropTypes.any,
  success: PropTypes.any,
  error: PropTypes.any,
  t: PropTypes.any,
};
const mapStateToProps = ({ activitylog }) => ({
  notification: activitylog.notification,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetNotification: (id,previousApiCallTime) => dispatch(getNotification(id,previousApiCallTime)),
});
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(NotificationDropdown))
);