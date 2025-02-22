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
  Row,
  Label,
  Modal,
  ModalBody,
  Table,
} from "reactstrap";

import { isEmpty, map } from "lodash";


//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getLabsListApprovedFee,
} from "store/labs-list-pending/actions";


class LabsLists extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      labsListApprovedFee: [],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      filters: {
        name: '',
        landline: '',
        email: '',
        address: '',
        city: '',
        type: '',
      },
      currentPage: 1,
      itemsPerPage: 10,
    };
  }

  componentDidMount() {
    const { onGetLabsListApprovedFee } = this.props;
    const { user_id, currentPage, itemsPerPage } = this.state;
    onGetLabsListApprovedFee(user_id, currentPage, itemsPerPage);
  }
  
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
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
  handleFilterChange = (field, value) => {
    this.setState(
      (prevState) => ({
        filters: {
          ...prevState.filters,
          [field]: value,
        },
        currentPage: 1, // Reset to first page on new filter
      }),
      () => {
        const { onGetLabsListApprovedFee } = this.props;
        const { user_id, currentPage, itemsPerPage, filters } = this.state;
        onGetLabsListApprovedFee(user_id, currentPage, itemsPerPage, filters);
      }
    );
  };
  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber }, () => {
      const { onGetLabsListApprovedFee } = this.props;
      const { user_id, currentPage, itemsPerPage } = this.state;
      onGetLabsListApprovedFee(user_id, currentPage, itemsPerPage);
    });
  };

  render() {
    const { filters, currentPage, itemsPerPage  } = this.state;
    const { labsListApprovedFee } = this.props;
    // const indexOfLastItem = currentPage * itemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredLabsList = (labsListApprovedFee?.data || []).filter((lab_list) => {
      return (
        (lab_list.city && lab_list.city.toLowerCase().includes(filters.city.toLowerCase())) &&
        (lab_list.name && lab_list.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (lab_list.type && lab_list.type.toLowerCase().includes(filters.type.toLowerCase())) &&
        (lab_list.landline && lab_list.landline.includes(filters.landline)) &&
        (lab_list.email && lab_list.email.toLowerCase().includes(filters.email.toLowerCase())) &&
        (lab_list.address && lab_list.address.toLowerCase().includes(filters.address.toLowerCase()))
      );
    });
    
    const columns = [
      { dataField: 'city', text: 'City' },
      { dataField: 'name', text: 'Lab Name' },
      { dataField: 'type', text: 'Lab Type' },
      { dataField: 'landline', text: 'Phone' },
      { dataField: 'email', text: 'Email' },
      { dataField: 'address', text: 'Address' },
    ];
    const currentItems = filteredLabsList;

    const totalPages = labsListApprovedFee.total_pages;

    // Calculate the range of page numbers to display
    const pageRange = 3; // Adjust this value based on your requirement
    let startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
    let endPage = Math.min(totalPages, startPage + pageRange - 1);
  
    // Adjust startPage and endPage to always show pageRange page numbers
    if (endPage - startPage + 1 < pageRange) {
      startPage = Math.max(1, endPage - pageRange + 1);
    }
  
    // Render the page numbers
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

    const headerCells = columns.map((column) => (
      <th key={column.dataField} scope="col">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{column.text}</span>
          <input
            className="form-control"
            type="text"
            placeholder={`Filter by ${column.text}`}
            value={filters[column.dataField]}
            onChange={(e) => this.handleFilterChange(column.dataField, e.target.value)}
            // style={{ width: '140px', padding: '6px' }}  // Adjust the width and padding as needed
          />
        </div>
      </th>
    ));
        
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Labs List | Lab Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Shared Percentage Approved Labs" breadcrumbItem="Labs Link" />
            {!isEmpty(this.props.labsListApprovedFee) && (
              
             
              <Row>
                <Col lg="12">
                  <Card>
                    <CardBody>
                      
                      <div className="py-2 mt-3">
                        <h3 className="font-size-15 font-weight-bold">
                          Lab Shared Percentage Approved
                        </h3>
                      </div>
                      <div className="table-responsive">
                      <Table className="align-middle mb-0 table-nowrap">
                        <thead className="table-light">
                        <tr>{headerCells}</tr>

                          </thead>
                         
                          <tbody>
                            
  {(currentItems || []).map((lab_list, key) => (
    <tr key={key}>
      <td className="text-start">{lab_list?.city || "N/A"}</td>
      <td className="text-start">
        <b>
          <Link to={`/shared-percentage-approved-Fee/${lab_list?.id || 0}`}>
            {lab_list?.name || "N/A"}
          </Link>
        </b>
      </td>
      <td className="text-start">{lab_list?.type || "N/A"}</td>
      <td className="text-start">{lab_list?.landline || "N/A"}</td>
      <td className="text-start">{lab_list?.email || "N/A"}</td>
      <td className="text-start">{lab_list?.address || "N/A"}</td>
    </tr>
  ))}
</tbody>

              
                        </Table>
                    </div>
                    <br/>
                    {/* Pagination */}
                    <Row className="align-items-md-center mt-30">
        <Col className="pagination pagination-rounded justify-content-end mb-2">
          {startPage > 1 && (
            <li className="page-item">
              <button className="page-link" onClick={() => this.handlePageChange(startPage - 1)}>
                {'<'}
              </button>
            </li>
          )}

          {pageNumbers.map((pageNumber) => (
            <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
              <button className="page-link" onClick={() => this.handlePageChange(pageNumber)}>
                {pageNumber}
              </button>
            </li>
          ))}

          {endPage < totalPages && (
            <li className="page-item">
              <button className="page-link" onClick={() => this.handlePageChange(endPage + 1)}>
                {'>'}
              </button>
            </li>
          )}
        </Col>
      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )}
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

LabsLists.propTypes = {
  match: PropTypes.object,
  labsListApprovedFee: PropTypes.array,
  className: PropTypes.any,
  onGetLabsListApprovedFee: PropTypes.func,
};
const mapStateToProps = ({ labsListPendingFee}) => ({
  labsListApprovedFee: labsListPendingFee.labsListApprovedFee,
});

const mapDispatchToProps = (dispatch) => ({
  onGetLabsListApprovedFee: (id, page, limit, filters) =>
    dispatch(getLabsListApprovedFee(id, page, limit, filters)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabsLists));
