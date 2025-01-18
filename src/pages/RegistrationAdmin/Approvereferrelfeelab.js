
import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { isEmpty, map } from "lodash";
import Select from "react-select";

import {
  Card,
  Input,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { onlyMedicalTestList } from "store/only-medical-tests-list/actions";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";


//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getPutReferrelFeeLabs,
  updateReferrelFeeLab,
  updateReferrelAllFeeLab,
} from "store/referrel-fee-to-lab/actions";
import "assets/scss/table.scss";
import ConfirmModal from "components/Common/ConfirmModal";

import "assets/scss/table.scss";
// import { color } from "html2canvas/dist/types/css/types/color";

class ReferrelLabFee extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      referrelFeeLabs: [],
      referrelFeeLab: "",
      onlyMedicalTestList: [],
      selectedTest: null,
      modal: false,
      confirmModal: false,
      isEditAll: true,
      test_name: "",
      id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      showNoResultMessage: false,
    };
    this.toggle = this.toggle.bind(this);
    console.log("test name in the state", this.state.test_name)
  }

  componentDidMount() {
    const { onlyMedicalTestList, ononlyMedicalTestList } = this.props;

    if (onlyMedicalTestList && !onlyMedicalTestList.length) {
      console.log(ononlyMedicalTestList(this.state.user_id));
    }
    console.log("uuuuuuid", this.props.match.params.uuid)
    const { referrelFeeLabs, ongetPutReferrelFeeLabs } = this.props;
    ongetPutReferrelFeeLabs(this.state.user_id);
    this.setState({ referrelFeeLabs });
    console.log("guest", this.props.match.params.guest_id)
  }
  handleBlur = () => {
    // Reset the showNoResultMessage state to false before performing the search
    this.setState({ showNoResultMessage: false });

    // Calling API when focus is out of the text name and setting nearby tests array
    const { ongetPutReferrelFeeLabs } = this.props;
    const data = {
      test_name: this.state.test_name,
    };

    ongetPutReferrelFeeLabs(data);

    setTimeout(() => {
      // Update the referrelFeeLabs state with the search results
      this.setState({ referrelFeeLabs: this.props.referrelFeeLabs }, () => {
        // Check if the referrelFeeLabs array is empty after the search
        if (isEmpty(this.props.referrelFeeLabs)) {
          // Show the "Sorry no result found" message immediately
          this.setState({ showNoResultMessage: true });
        }
      });
    }, 200);
  };
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  onChangeTest = selectedOption => {
    this.setState({ test_name: selectedOption ? selectedOption.value : "" });
  };



  handleEditAllBtnClicks = () => {
    this.setState({ referrelFeeLab: "", isEdit: false, lab_id: "" });
    this.toggle();
  };
  handleEditAllBtnClick = () => {
    this.setState({ isEditAll: true, referrelFeeLab: "" });

    this.toggle();
  };

  handleAPICall = () => {
    const {
      ongetPutReferrelFeeLabs,
      onupdateReferrelAllFeeLab,
      onupdateReferrelFeeLab,
    } = this.props;

    if (this.state.isEditAll) {
      onupdateReferrelAllFeeLab(this.state.referrelFeeLab);

      // console.log(onAddNewLabShare(this.state.b2bLabShare));

      setTimeout(() => {
        ongetPutReferrelFeeLabs(this.state.user_id);

        setTimeout(() => {
          this.setState({ referrelFeeLabs: this.props.referrelFeeLabs });
        }, 1000);
      }, 1000);
    } else {
      onupdateReferrelFeeLab(this.state.b2bLabShare);

      setTimeout(() => {
        ongetPutReferrelFeeLabs(this.state.user_id);

        setTimeout(() => {
          this.setState({ referrelFeeLabs: this.props.referrelFeeLabs });
        }, 1000);
      }, 1000);
    }

    this.toggle();
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

  /* Insert,Update Delete data */
  handleEditBtnClick = arg => {
    const referrelFeeLab = arg;

    this.setState({
      isEditAll: false,
      referrelFeeLab: referrelFeeLab,
      // id: referrelFeeLab.id,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { referrelFeeLabs } = this.props;
    const { isEdit, deleteModal } = this.state;
    const referrelFeeLab = this.state.referrelFeeLab;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: referrelFeeLabs.length,
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];

    const columns = [
      {
        dataField: "test_id",
        text: "Test ID",
        sort: true,
        filter: textFilter(),
      },
      {
        dataField: "test_name",
        text: "Test Name",
        sort: true,
        filter: textFilter(),
      },
      {
        dataField: "test_categories",
        text: "Test Categories",
        sort: true,
        filter: textFilter(),
      },
      {
        dataField: "lab_city",
        text: "Lab City",
        sort: true,
        filter: textFilter(),
      },
      {
        dataField: "lab_name",
        text: "Lab Name",
        sort: true,
        formatter: (cellContent, referrelFeeLab) => (
          <span style={{
            width: '200px', // Set your desired width here
            fontSize: '14px',

            textOverflow: 'ellipsis',
            whiteSpace: 'prewrap',
            textAlign: 'left', // Align text to the left
            display: 'block',
          }}>
            {referrelFeeLab.lab_name}

          </span>
        ), filter: textFilter(),
      },
      {
        dataField: "type",
        text: "Lab Type",
        // sort: true,
        formatter: (cellContent, referrelFeeLab) => (
          <>
            <span className="float-end">
              {referrelFeeLab.type == "Main Lab" ? (
                <span>Main</span>
              ) : (
                <span>Collection</span>
              )}
            </span>
          </>
        ),
        filter: selectFilter({
          options: {
            // '': 'All',
            'Main Lab': 'Main',
            'Collection Point': 'Collection',
          },
          // defaultValue: 'Main Lab',
        }),
      },
      {
        dataField: "price",
        text: "Price",
        sort: true,
        formatter: (cellContent, referrelFeeLab) => (
          <>
            {referrelFeeLab.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </>
        ), filter: textFilter(),
      },
      {
        dataField: "is_eqa_participation",
        text: "Is EQA Participation",
        sort: true,
        filter: textFilter(),
      },
      {
        dataField: "is_home_sampling_available",
        text: "Is Home Sampling Available",
        sort: true,
        filter: textFilter(),
      },
      {
        dataField: "is_test_performed",
        text: "Is Test Performed",
        sort: true,
        filter: textFilter(),
      },
      {
        dataField: "shared_percentage",
        text: "Shared Percentage",
        sort: true,
        filter: textFilter(),
      },
      {
        dataField: "shared_percentage_value",
        text: "Shared Value",
        sort: true,
        formatter: (cellContent, referrelFeeLab) => (
          <>
            {(referrelFeeLab.price * referrelFeeLab.shared_percentage).toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </>
        ), filter: textFilter(),
      },
    ];
    const testList = this.props.onlyMedicalTestList.map((test) => ({
      label: test.name,
      value: test.name,
      // isDisabled: this.state.selectedTest && test.name !== this.state.selectedTest.value,
    }));

    const {
      ongetPutReferrelFeeLabs,
      onupdateReferrelAllFeeLab,
      onupdateReferrelFeeLab,
    } = this.props;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Lab Hazir | Referrel Fee Lab Hazir</title>
          </MetaTags>
          <ConfirmModal
            show={this.state.confirmModal}
            onCloseClick={() => this.setState({ confirmModal: false })}
          />
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="referrelFeeLabs" breadcrumbItem=" List" />
            <Row className="mb-2 g-0">
              <Col sm="2" lg="2">
                <div>
                  <Label
                    for="LabType1"
                    className="form-label"
                    style={{
                      fontSize: window.innerWidth <= 576 ? "6px" : "12px",
                    }}
                  >
                    Search By Test Name
                  </Label>
                  <Select
                    name="test_name"
                    component="Select"
                    onChange={this.onChangeTest}
                    value={testList.find(item => item.value === this.state.test_name)}
                    className="defautSelectParent"
                    options={testList}
                    style={{
                      minWidth: "300px", // Set the width for the Select component
                      // other styles if needed
                    }}
                  />
                </div>
              </Col>
              <Col sm="2" lg="2" style={{ marginTop: "28px", marginRight: "40px" }}>
                <div>
                  <button
                    onClick={this.handleBlur}
                    className="bx bx-search-alt"
                    style={{
                      fontSize: "32px",
                      color: "white",
                      background: "blue",
                      border: "none",
                      // marginLeft: "5px", // Add space between the input and the button
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Card>
              <CardBody>
                <ToolkitProvider
                  keyField="id"
                  data={referrelFeeLabs}
                  columns={columns}
                  search
                >
                  {props => (
                    <div>
                      {/* <SearchBar {...props.searchProps} /> */}
                      <BootstrapTable
                        {...props.baseProps}
                        defaultSorted={defaultSorted}
                        pagination={paginationFactory(pageOptions)}
                        filter={filterFactory()}
                      />
                    </div>
                  )}
                </ToolkitProvider>
              </CardBody>
            </Card>
            {this.state.showNoResultMessage && (
              <Row>
                <div className=" mb-5">
                  <h4 className="text-uppercase">
                    Sorry no result found.
                  </h4>
                </div>
              </Row>
            )}
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

ReferrelLabFee.propTypes = {
  match: PropTypes.object,
  referrelFeeLabs: PropTypes.array,
  className: PropTypes.any,
  ongetPutReferrelFeeLabs: PropTypes.func,
  onupdateReferrelFeeLab: PropTypes.func,
  onupdateReferrelAllFeeLab: PropTypes.func,
  ononlyMedicalTestList: PropTypes.func,
  onlyMedicalTestList: PropTypes.array,
};

const mapStateToProps = ({ referrelFeeLabs, onlyMedicalTestList }) => ({
  referrelFeeLabs: referrelFeeLabs.referrelFeeLabs,
  onlyMedicalTestList: onlyMedicalTestList.onlyMedicalTestList,

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ongetPutReferrelFeeLabs: (data) => dispatch(getPutReferrelFeeLabs(data)),
  onupdateReferrelFeeLab: referrelFeeLab =>
    dispatch(updateReferrelFeeLab(referrelFeeLab)),
  onupdateReferrelAllFeeLab: referrelFeeLab =>
    dispatch(updateReferrelAllFeeLab(referrelFeeLab)),

  ononlyMedicalTestList: id => dispatch(onlyMedicalTestList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReferrelLabFee));
