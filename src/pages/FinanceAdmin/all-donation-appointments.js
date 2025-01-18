import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";

import {
  Card,
  CardBody,
  Col,
  Container,
  Button,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
} from "reactstrap";
import filterFactory, { textFilter} from 'react-bootstrap-table2-filter';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import {
  // getLabs,
  // addNewLabShare,
  getAllDonationAppointments,
  // updateLabShare,
  // updateAllLabShare,
} from "store/finance-admin/actions";

import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";
import "assets/scss/table.scss";

class DonationAppointmentsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      allDonationAppointment: [],
      b2bLabShare: "",
      modal: false,
      addmodal: false,
      confirmModal: false,
      isEditAll: true,
      id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      b2bLabShareListColumns: [
        // {
        //   dataField: "id",
        //   text: "Lab ID",
        //   sort: true,
        // },
        {
          dataField: "order_id",
          text: "Order ID",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "payment_method",
          text: "Payment Method",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "status",
          text: "Payment Status",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "amount",
          text: "Amount",
          sort: true,
          formatter: (cellContent, b2bLabShare) => (
            <>
              <div className="text-end">
                  <strong>{b2bLabShare.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong></div>
            </>
            ),
          filter: textFilter(),
        },
        // {
        //   dataField: "menu",
        //   isDummyField: true,
        //   editable: false,
        //   text: "Action",
        //   formatter: (cellContent, b2bLabShare) => (
        //     <Col>
        //       <Link className="text-success" to="#">
        //         <i
        //           className="mdi mdi-pencil font-size-18"
        //           id="edittooltip"
        //           onClick={() => this.handleEditBtnClick(b2bLabShare)}
        //         ></i>
        //       </Link>
        //     </Col>
        //   ),
        // },
      ],
    };
    this.handleEditBtnClick = this.handleEditBtnClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleEditAllBtnClick = this.handleEditAllBtnClick.bind(this);
    // this.handleb2bLabShareClicks = this.handleb2bLabShareClicks.bind(this);


  }

  componentDidMount() {
    // const { allDonationAppointment, onGetAllDonationAppointments } = this.props;
    // if (allDonationAppointment && !allDonationAppointment.length) {
    //   onGetAllDonationAppointments(this.props.match.params.id);
    //   console.log("lab id print here", onGetAllDonationAppointments(this.props.match.params.id))
    // }
    // this.setState({ allDonationAppointment });
    const { allDonationAppointment, onGetAllDonationAppointments } = this.props;
    onGetAllDonationAppointments(this.props.match.params.id);
    this.setState({ allDonationAppointment });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleEditAllBtnClicks = () => {
    this.setState({ b2bLabShare: "", isEdit: false, lab_id: "" });
    this.toggle();
  };
  handleEditAllBtnClick = () => {
    this.setState({ isEditAll: true, b2bLabShare: "" });

    this.toggle();
  };
  // Select
  handleSelectGroup = selectedGroup => {
    this.setState({ b2bLabShare: selectedGroup.value });
  };

  // handleAPICall = () => {
  //   const { onGetAllDonationAppointments, onUpdateAllLabShare, onUpdateLabShare } =
  //     this.props;

  //   if (this.state.isEditAll) {
  //     onUpdateAllLabShare(this.state.b2bLabShare);

  //     // console.log(onAddNewLabShare(this.state.b2bLabShare));

  //     setTimeout(() => {
  //       onGetAllDonationAppointments(this.props.match.params.id);

  //       setTimeout(() => {
  //         this.setState({ allDonationAppointment: this.props.allDonationAppointment });
  //       }, 1000);
  //     }, 1000);
  //   } else {
  //     onUpdateLabShare(this.state.b2bLabShare);

  //     setTimeout(() => {
  //       onGetAllDonationAppointments(this.props.match.params.id);

  //       setTimeout(() => {
  //         this.setState({ allDonationAppointment: this.props.allDonationAppointment });
  //       }, 1000);
  //     }, 1000);
  //   }
  // };

  // handleb2bLabShareClicks = () => {
  //   this.setState({ b2bLabShare: "", isEdit: false, lab_id: "" });
  //   this.setState({ addmodal: true });  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { allDonationAppointment } = this.props;
    if (
      !isEmpty(allDonationAppointment) &&
      size(prevProps.allDonationAppointment) !== size(allDonationAppointment)
    ) {
      this.setState({ allDonationAppointment: {}, isEdit: false });
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


  handleEditBtnClick = arg => {
    const b2bLabShare = arg;

    this.setState({
      isEditAll: false,
      b2bLabShare: b2bLabShare,
      // id: discountLab.id,
    });

    this.toggle();
  };

  // /* Insert,Update Delete data */
  // handleEditBtnClick = arg => {
  //   const b2bLabShare = arg;

  //   this.setState({
  //     b2bLabShare: {
  //       id: b2bLabShare.id,
  //       lab_name: b2bLabShare.lab_name,
  //       // unit_name: offeredTest.unit_name,
  //       lab_id: b2bLabShare.lab_id,
  //       b2b_shares: b2bLabShare.b2b_shares,
  //     },
  //     isEdit: true,
  //   });

  //   this.toggle();
  // };


  render() {
    const { SearchBar } = Search;

    const { allDonationAppointment } = this.props;
    // const { labs } = this.props;
    // const { units } = this.props;

    const { isEdit, isEditAll, deleteModal } = this.state;

    const { onGetAllDonationAppointments } =
      this.props;
    const b2bLabShare = this.state.b2bLabShare;

    const pageOptions = {
      sizePerPage: 10000,
      totalSize: allDonationAppointment.length, // replace later with size(allDonationAppointment),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    // const labList = [];
    // for (let i = 0; i < labs.length; i++) {
    //   let flag = 0;

    //   // Check if test available in our database is already being offered by lab
    //   // If yes then don't push it in labList
    //   for (let j = 0; j < allDonationAppointment.length; j++) {
    //     if (labs[i].id == allDonationAppointment[j].lab_id) {
    //       flag = 1;
    //     }
    //   }
    //   if (!flag) {
    //     labList.push({
    //       label: labs[i].name,
    //       value: labs[i].id,
    //     });
    //   }
    // }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Appointments | Donation Allocate Appointments</title>
          </MetaTags>
          <ConfirmModal
          // show={this.state.confirmModal}
          // onCloseClick={() => this.setState({ confirmModal: false })}
          />
          <Container fluid>
            {/* Render Breadcrumbs */}
            {/* <Breadcrumbs title="Appointments" breadcrumbItem="Donation Allocate Appointments "
            /> */}
            <Breadcrumbs
              title="Appointments"
              breadcrumbItem={allDonationAppointment.map((lab, index) => {
                // Check if lab_name is defined and not null
                if (lab.lab_name !== undefined && lab.lab_name !== null) {
                  // Return a div for each lab_name
                  return (
                    <div key={index} className="float-end">
                      <span className="text-danger">{lab.lab_name}</span>
                      <span>-Donation Allocate Appointments</span>
                    </div>
                  );
                }
                // Don't render anything for labs without lab_name
                return null;
              })}
              
            />
            <Row>
            <p><span className="text-danger">Note:</span> Here is the amount of those lab Appointments whose Payment method Donation Status Allocated and Result Uploaded</p>

              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.b2bLabShareListColumns}
                      data={allDonationAppointment}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.b2bLabShareListColumns}
                          data={allDonationAppointment}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col>
                                <Col sm="6">
                                  
                                </Col>
                                <Col sm="6" lg="2">
                                <div className="text-sm-end">
  <Link to="/out-payment">
    <button color="primary"
                  className="w-55  btn-block btn btn-primary">
     Payment Out Form
    </button>
  </Link>
</div>
                                </Col>
                              </Row>
                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                      filter={ filterFactory()}
                                    />
                                  </div>
                                </Col>
                              </Row>
                              {/* <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row> */}
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
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

DonationAppointmentsList.propTypes = {
  match: PropTypes.object,
  // labs: PropTypes.array,
  // units: PropTypes.array,
  allDonationAppointment: PropTypes.array,
  className: PropTypes.any,
  onGetAllDonationAppointments: PropTypes.func,
  // onGetlabs: PropTypes.func,
  // onGetUnits: PropTypes.func,
  // onAddNewLabShare: PropTypes.func,
  // onUpdateLabShare: PropTypes.func,
  // onUpdateAllLabShare: PropTypes.func,

};

const mapStateToProps = ({ financeAdmin }) => ({
  allDonationAppointment: financeAdmin.allDonationAppointment,
  // labs: b2bLabShares.labs,
  // units: allDonationAppointment.units,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  // onGetlabs: () => dispatch(getLabs()),
  // onGetUnits: () => dispatch(getUnits()),
  onGetAllDonationAppointments: id => dispatch(getAllDonationAppointments(id)),
  // onAddNewLabShare: (b2bLabShare, id) =>
  //   dispatch(addNewLabShare(b2bLabShare, id)),
  // onUpdateLabShare: b2bLabShare => dispatch(updateLabShare(b2bLabShare)),
  // onUpdateAllLabShare: b2bLabShare => dispatch(updateAllLabShare(b2bLabShare)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DonationAppointmentsList));