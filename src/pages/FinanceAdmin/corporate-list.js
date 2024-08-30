import React, { Component, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  ModalHeader,
  Row,
  Label,
  Modal,
  ModalBody,
  Button,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik"; 

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
//Import Breadcrumb
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";
import { getCorporateList } from "store/labs-list/actions";
import { updateCorporateProfile } from "../../store/actions";
class LabsLists extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      labsList: [],
      id: "",
      LabsLists: "",
      btnText: "Copy",
      labsList: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      labsListListColumns: [
        {
          dataField: "id",
          text: "Corporate ID",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              <span  className="float-start">{labsList.id}</span >
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
        // {
        //   dataField: "id",
        //   text: "Corporate ID",
        //   sort: true,
        //   formatter: (cellContent, labsList) => (
        //     <>
        //       {/* <strong>{labsList.id}</strong> */}
        //       <Link
        //         to={`/finance-invoice-detail/${labsList.id}`}
        //       >
        //         {labsList.id}
        //       </Link>
        //     </>
        //   ),filter: textFilter(), // Add a text filter for this column
        // },
        {
          dataField: "city",
          text: "City",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              <span style={{
                width: '180px', // Set your desired width here
                fontSize: '14px',
              
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'left', // Align text to the left
                display: 'block',
              }}>{labsList.city}</span>
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "user_name",
          text: "Corporate Name",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              <span style={{
                width: '180px', // Set your desired width here
                fontSize: '14px',
              
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'left', // Align text to the left
                display: 'block',
              }}>{labsList.user_name}</span>
            </>
          ),filter: textFilter(), // Add a text filter for this column
          formatter: (cellContent, labsList) => (
            <>
              <span className="float-start">
                  <Link
                    to="#"
                    onClick={e => this.openPatientModal(e, labsList)}
                  >
                   {labsList.user_name}
                  </Link>
              </span>
            </>
          ),
        },
        
        {
          dataField: "email",
          text: "Email",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              <span  className="float-start">{labsList.email}</span >
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "payment_terms",
          text: "Pyment Type",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              <span  style={{
                width: '180px', // Set your desired width here
                fontSize: '14px',
              
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'left', // Align text to the left
                display: 'block',
              }}>  {(labsList.payment_terms || "--").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span >
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "payment_request",
          text: "Request for Change Payment",
          sort: true,
          formatter: (cellContent, labsList) => {
            const paymentRequest = labsList.payment_request;
        
            // Conditionally render based on the value of paymentRequest
            return (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {paymentRequest === 'Approved Payment Method' ? (
                  <span>{paymentRequest}</span> // Display as plain text
                ) : (
                  paymentRequest ? (
                    <button
                      className="btn btn-success"
                      style={{
                        padding: '5px 10px',
                        fontSize: '10px',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      onClick={() => this.toggles(labsList)} // Pass the entire labsList
                    >
                      Request for Accept
                    </button>
                  ) : (
                    <span>--</span> // Display placeholder if no paymentRequest
                  )
                )}
              </div>
            );
          },
          filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "phone",
          text: "Phone",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              <span  className="float-start">{labsList.phone}</span>
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "lab_payable",
          text: "Total Lab Payable",
          sort: true,
          formatter: (cellContent, labsList) => (
            <span  className="float-end">
            {(labsList.lab_payable || "--").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "lh_payable",
          text: "Total LH Payable",
          sort: true,
          formatter: (cellContent, labsList) => (
            <span  className="float-end">
            {(labsList.lh_payable || "--").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "account_id",
          text: "Account Statement",
          sort: true,
          formatter: (cellContent, labsList) => (
            <Link to={`/corporate-lab-appointments/${labsList.account_id}`}>
                                    Account statement
                                  </Link>
          ),filter: textFilter(), // Add a text filter for this column
        },

      ],
    };
    this.handlePaymentStatusClick =this.handlePaymentStatusClick.bind(this);
    this.toggles = this.toggles.bind(this);
  }


  // componentDidMount() {
  //   const { labsList, onGetDonorsList } = this.props;
  //   console.log(onGetDonorsList());
  //   this.setState({ labsList });
  // }
  componentDidMount() {
    const { labsList, onGetDonorsList } = this.props;
    onGetDonorsList(this.state.user_id);
    console.log(onGetDonorsList());
    this.setState({ labsList });
  }

  // eslint-disable-next-line no-unused-vars
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   const { banks } = this.props;
  //   if (
  //     !isEmpty(banks) &&
  //     size(prevProps.banks) !== size(banks)
  //   ) {
  //     this.setState({ banks: {}, isEdit: false });
  //   }
  // }

  // componentDidMount() {
  //   const { b2bAllClients, onGetB2bAllClientsList } = this.props;
  //   onGetB2bAllClientsList(this.state.user_id);
  //   this.setState({ b2bAllClients });
  // }
  toggles = (labsList) => {
    console.log("labsList:", labsList);
  
    let city;
    if (typeof labsList.city_id === 'string') {
      // Split the city_ids if they are in a comma-separated string format
      city = labsList.city_id.split(',').map(id => id.trim()).join(', ');
    } else if (Array.isArray(labsList.city_id)) {
      // Join array elements if city_ids is already an array
      city = labsList.city_id.join(', ');
    } else {
      // Handle unexpected cases
      city = labsList.city_id || ''; // Default to an empty string if city_id is undefined or null
    }
  
    console.log("Processed City:", city);
  
    this.setState({
      modal: !this.state.modal,
      selectedLabId: labsList.account_id,
      selectedLabName: labsList.name,
      selectedLabEmail: labsList.email,
      selectedLabPhone: labsList.phone,
      selectedLabLandline: labsList.landline,
      selectedLabAddress: labsList.address,
      selectedLabCity: city,
      selectedLabNTN: labsList.national_taxation_no,
      selectedLablogo: labsList.logo,
      selectedLabPT: labsList.payment_terms,
    });
  };
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  // The code for converting "image source" (url) to "Base64"
  toDataURL = url =>
    fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  // The code for converting "Base64" to javascript "File Object"
  dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  handlePaymentStatusClick = async () => {
    const { selectedLabId, selectedLabName, selectedLabEmail, selectedLabPhone, selectedLabLandline, selectedLabAddress, selectedLabCity, selectedLabNTN, selectedLablogo, selectedLabPT } = this.state;
  
    // Function to convert image URL to Base64 Data URL
    const urlToDataURL = async (url) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };
  
    // Check if selectedLablogo is a string (URL) and convert it
    if (typeof selectedLablogo === 'string') {
      try {
        console.log("Converting logo URL to Base64...");
        const imageUrl = process.env.REACT_APP_BACKENDURL + selectedLablogo;
        console.log("sdggfhjhdf",imageUrl )
        const dataUrl = await urlToDataURL(imageUrl);
        const fileData = this.dataURLtoFile(dataUrl, selectedLablogo.split("/").pop());
        console.log("File converted from Base64:", fileData);
  
        // Prepare form values
        const values = {
          payment_request: "Approved Payment Method",
          limit: "",
          end_date: "",
          reason: "",
          name: selectedLabName,
          logo: fileData,
          national_taxation_no: selectedLabNTN,
          payment_terms: "Payment by Patient to Lab",
          city_id: selectedLabCity,
          address: selectedLabAddress,
          landline: selectedLabLandline,
          phone: selectedLabPhone,
          email: selectedLabEmail,
        };
  
        // Call the prop method with the prepared values
        this.props.updateCorporateProfile(values, selectedLabId);
        setTimeout(() => {
          this.props.onGetDonorsList(this.state.user_id);
        }, 1000);
        setTimeout(() => {
          this.setState({ modal: false });
        }, 1000);
      } catch (error) {
        console.error("Error converting logo to Base64:", error);
      }
    } 
  };

  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      corporate_address: arg.address,
      corporate_phone: arg.landline,
      corporate_email: arg.email,

    });
  };
  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
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
  exportToExcel = () => {
    const { labsList } = this.props;
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    // Define fields to export
    const fieldsToExport = [
      "id",
      "city",
      "user_name",
      "email",
      "phone",
    ];

    // Map each row to an object with only the desired fields
    const dataToExport = labsList.map(statement => {
      const rowData = {};
      fieldsToExport.forEach(field => {
        rowData[field] = statement[field];
      });
      return rowData;
    });

    // Convert data to Excel format and save as file
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const fileName = "corporate_list" + fileExtension;
    saveAs(data, fileName);
  };

  render() {
    const { SearchBar } = Search;
    const { updateCorporateProfile } = this.props;
    const { labsList } = this.props;
    const data = this.state.data;
    const { onGetDonorsList } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: labsList.length, // replace later with size(labsList),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Corporate List | Lab Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="List" breadcrumbItem="Corporate List with Account Statements" />
            <Row>
              <Col lg="12" style={{ marginLeft: "87%" }}>
                <Button onClick={this.exportToExcel} className="mb-3">Export to Excel</Button>
              </Col>
            </Row>
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.labsListListColumns}
                      data={labsList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.labsListListColumns}
                          data={labsList}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    {/* <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div> */}
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
                                      filter={filterFactory()} // Enable filtering for the entire table
                                    />
                                  <Modal
  isOpen={this.state.modal}
  className={this.props.className}
>
  <ModalHeader
    toggle={this.toggles}
    tag="h4"
    className="text-danger"
  >
    Alert:
  </ModalHeader>
  <ModalBody>
    <div className="w-100">
      
      <div>
        <ol>
          <li>First Check all appointemnt which is in process or pending of this corporation</li>
          <li>After that Corporate payment term will be change from <strong> corporate pament to lab</strong> to <strong>patient to lab</strong></li>
          <li>After that all employees quota equal to zero </li>
        </ol>
      </div>
    </div>
    <Row className="mt-4">
      <Col sm="12" className="d-flex justify-content-end">
        <Button color="primary" className="me-2" onClick={this.handlePaymentStatusClick}>Accept Request</Button>
      </Col>
    </Row>
  </ModalBody>
</Modal>
                                      <Modal
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.togglePatientModal}
                                        tag="h4"
                                      >
                                        <span></span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik>
                                          <Form>
                                            <Row>
                                              <Col className="col-12">
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Corporate Address
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.corporate_address
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Corporate Email
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.corporate_email
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Landline No.
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.corporate_phone
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>

                                                  <div className="col-md-3">
                                                    <button
                                                      type="button"
                                                      className="btn btn-secondary"
                                                      onClick={() => {
                                                        navigator.clipboard.writeText(
                                                          this.state
                                                            .corporate_phone
                                                        );
                                                        this.setState({
                                                          btnText: "Copied",
                                                        });
                                                      }}
                                                    >
                                                      {this.state.btnText}
                                                    </button>
                                                  </div>
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                  </Modal>
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

LabsLists.propTypes = {
  match: PropTypes.object,
  labsList: PropTypes.array,
  className: PropTypes.any,
  onGetDonorsList: PropTypes.func,
  updateCorporateProfile: PropTypes.func,
};
const mapStateToProps = ({ labsList}) => ({
  labsList: labsList.labsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetDonorsList: id => dispatch(getCorporateList(id)),
 updateCorporateProfile: (profile, id) => dispatch(updateCorporateProfile(profile, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabsLists));
