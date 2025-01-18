import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Row,
  Col,
} from "reactstrap";
import SimpleBar from "simplebar-react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { isEmpty, map } from "lodash";
import Tooltip from "@material-ui/core/Tooltip";
import { getSampleNotification } from "store/samplenotification/actions";
import { withTranslation } from "react-i18next";
import moment from 'moment';

class SampleNotificationDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      menu: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { user_id } = this.state;
    const { onGetSampleNotification } = this.props;
    const previousApiCallTime = localStorage.getItem("api_call_time");

    onGetSampleNotification(user_id, previousApiCallTime);

    const currentApiCallTime = new Date();
    localStorage.setItem("api_call_time", currentApiCallTime.toISOString());
  }

  toggle() {
    this.setState((prevState) => ({
      menu: !prevState.menu,
    }));
  }

  render() {

    // const { SearchBar } = Search;

    const { sampleNotification } = this.props;
    console.log("My sampleNotification", sampleNotification);

    const { onGetSampleNotification } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: sampleNotification.length,
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id",
        order: "asc",
      },
    ];

    return (
      
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
              {!isEmpty(sampleNotification) &&
                sampleNotification.map((notification, key) => (
                  <Col key={"col" + key}>
                    {notification.notifications_count > 0 && (
                      <div>
                        <i className="bx bx-bell bx-tada" />
                        <span className="badge bg-danger rounded-pill">
                          {notification.notifications_count}
                        </span>
                      </div>
                    )}
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
                  <h6 className="m-0">{this.props.t("Notifications")}</h6>
                </Col>
                <div className="col-auto"></div>
              </Row>
            </div>

            <SimpleBar style={{ height: "230px" }}>
              <Link
                to="/sample-collector-in-process"
                className="text-reset sampleNotification-item"
              >
            {!isEmpty(sampleNotification) &&
              sampleNotification.map((notifications, key) => (
                <Col key={"col" + key}>
                  <>
                    {notifications.notifications &&
                      Array.isArray(notifications.notifications) &&
                      notifications.notifications.map((item, innerKey) => (
                        <div key={"item" + innerKey} className="d-flex mt-0">
                          {item.actions === "Updated" && (
                            <div>
                              <i className="fas fa-exchange-alt font-size-18"></i>{" "}
                            <b>{item.lab_name}</b> Has Assigned <b>{item.sample_collector_name} </b> The Sample Collection of order {item.order_id} At {moment(item.created_at).format("DD MMM YYYY, h:mm A")}.
                            </div>
                          )}
                          {/* Add more conditions for other actions if needed */}
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

SampleNotificationDropdown.propTypes = {
  match: PropTypes.object,
  sampleNotification: PropTypes.array,
  className: PropTypes.any,
  onGetSampleNotification: PropTypes.func,
  history: PropTypes.any,
  success: PropTypes.any,
  error: PropTypes.any,
  t: PropTypes.any,
};

const mapStateToProps = ({ sampleNotification }) => ({
  sampleNotification: sampleNotification.sampleNotification,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetSampleNotification: (id, previousApiCallTime) =>
    dispatch(getSampleNotification(id, previousApiCallTime)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(SampleNotificationDropdown))
);
