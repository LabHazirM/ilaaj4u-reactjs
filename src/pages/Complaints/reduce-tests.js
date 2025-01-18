import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Col, Container, Row, Alert } from "reactstrap";
import DeleteModal from "components/Common/DeleteModal";

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

// Import actions
import { getTestsInAppointment ,deleteTestsInAppointment} from "store/invoices/actions";
import "assets/scss/table.scss";
import { FaTrash } from "react-icons/fa"; // Import delete icon from react-icons

class ReduceTests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbackMessage: '',
      deleteModal: false,
      testsinappointments:[],
      feedbackListColumns: [
        {
          dataField: "test_name",
          text: "Test Name",
          sort: true,
          formatter: (cell, offeredTest) => {
            return (
              <div className="d-flex align-items-center">
                <FaTrash
                  className="text-danger cursor-pointer me-2"
                  onClick={() => this.onClickDelete(offeredTest)}
                />
                <span>{offeredTest.test_name}</span>
              </div>
            );
          },
          headerAlign: 'center',
          align: 'left',
        }       
        
      ],
    };
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
    
  };


  componentDidMount() {
    const { onGetInvoiceDetail } = this.props;
    const userId = this.props.match.params.id;
  
    if (userId) {
      this.setState({ user_id: userId }); // Store it in state for future use
      onGetInvoiceDetail(userId);
    } else {
      console.error("ID is not available in match params");
    }
  }
  
  
  filterData() {
    const { testsinappointments } = this.props;

    // Check if testsinappointments is an array
    if (!Array.isArray(testsinappointments)) {
      console.error("testsinappointments is not an array:", testsinappointments);
      return []; // Return an empty array or handle as needed
    }

    return testsinappointments.filter(item => {
      // Your filter logic here
      return true; // Example: replace with actual filtering condition
    });
  }

  onClickDelete = (testsinappointments) => {
    this.setState({ testsinappointments: testsinappointments }, () => {
      console.log("State updated with testsinappointments:", this.state.testsinappointments);
      this.toggleDeleteModal(); // Open the delete modal
    });
  };

  handleDeleteTests = () => {
    const { onDeleteTestsInAppointment, onGetInvoiceDetail } = this.props;
    const { testsinappointments } = this.state;
    if (testsinappointments.id !== undefined) {
      onDeleteTestsInAppointment(testsinappointments);
      setTimeout(() => {
        onGetInvoiceDetail(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };
  
  
  render() {
    const filteredData = this.filterData();
    const { deleteModal } = this.state;
    const defaultSorted = [{ dataField: "id", order: "desc" }];
    const { feedbackMessage, errorMessage } = this.state;

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteTests}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Edit Appointment | LabHazir</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="LabHazir" breadcrumbItem="Edit Appointment" />
            <Row className="justify-content-center">
              <Col lg="5">
                <Card>
                  <CardBody>
                    <Row>
                      <Col className="pagination pagination-rounded justify-content-center mb-2">
                        {feedbackMessage && (
                          <div className="alert alert-success" role="alert">
                            {feedbackMessage}
                          </div>
                        )}
                        {errorMessage && (
                          <Alert color="danger">
                            {errorMessage}
                          </Alert>
                        )}
                      </Col>
                    </Row>
                    <ToolkitProvider
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={filteredData}
                    >
                      {toolkitprops => (
                        <React.Fragment>
                          <Row className="mb-4">
                            <Col xl="12">
                              <div className="table-responsive">
                                <BootstrapTable
                                  key={this.state.tableKey}
                                  {...toolkitprops.baseProps}
                                  defaultSorted={defaultSorted}
                                  classes={"table align-middle table-hover"}
                                  bordered={false}
                                  striped={true}
                                  headerWrapperClasses={"table-light"}
                                  responsive
                                />
                              </div>
                            </Col>
                          </Row>
                        </React.Fragment>
                      )}
                    </ToolkitProvider>
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

ReduceTests.propTypes = {
  onDeleteTestsInAppointment: PropTypes.func,
  onGetInvoiceDetail: PropTypes.func.isRequired,
  testsinappointments: PropTypes.array.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,    
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  testsinappointments: state.invoices.testsinappointments,  
});

const mapDispatchToProps = (dispatch) => ({
  onGetInvoiceDetail: (id) => dispatch(getTestsInAppointment(id)),
  onDeleteTestsInAppointment: (offeredTest) => {
    console.log("Deleting test:", offeredTest);
    dispatch(deleteTestsInAppointment(offeredTest));
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReduceTests));
