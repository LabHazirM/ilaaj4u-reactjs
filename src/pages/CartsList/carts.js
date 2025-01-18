import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link, Redirect } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import { getCarts, deleteCart, emptyCart } from "store/carts/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class CartList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      carts: [],
      cart: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      modal: false,
      deleteModal: false,
      isDisabled: true,
      cartListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, cart) => <>{cart.id}</>,
        },
        {
          dataField: "patient_name",
          text: "Patient name",
          sort: true,
        },
        {
          dataField: "lab_name",
          text: "Lab name",
          sort: true,
        },
        {
          dataField: "test_name",
          text: "Test name",
          sort: true,
          headerStyle: () => {
            return { width: "30%" };
          } 
        },
        {
          dataField: "price",
          text: "Price",
          sort: true,
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, cart) => (
            <div className="d-flex gap-3">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(cart)}
                ></i>
              </Link>
            </div>
          ),
        },
      ],
    };
    this.handleCartClick = this.handleCartClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const { onGetCarts } = this.props;
    onGetCarts(this.state.user_id);
    this.setState({ carts: this.props.carts });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { carts } = this.props;
    if (!isEmpty(carts) && size(prevProps.carts) !== size(carts)) {
      this.setState({ carts: {}, isEdit: false });
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

  onClickDelete = carts => {
    this.setState({ carts: carts });
    this.setState({ deleteModal: true });
  };

  handleDeleteCart = () => {
    const { onDeleteCart, onGetCarts } = this.props;
    const { carts } = this.state;

    if (carts.id !== undefined) {
      onDeleteCart(carts);
      // onDeleteAllCart(id);
      setTimeout(() => {
        onGetCarts(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleEmptyCart = () => {
    const { onGetCarts, onEmptyCart } = this.props;
    const { carts } = this.state;

    onEmptyCart(this.state.user_id);

    setTimeout(() => {
      onGetCarts(this.state.user_id);
    }, 1000);

    this.setState({ carts });

    this.props.history.push(
      this.props.match.params.uuid
        ? `/nearby-labs/${this.props.match.params.uuid}`
        : `/nearby-labs`
    );
  };

  handleCartClick = (e, arg) => {
    const cart = arg;

    this.setState({
      cart: {
        id: cart.id,
        patient_id: cart.patient_id,
        lab_id: cart.lab_id,
        offered_test_id: cart.offered_test_id,
        test_appointment_id: cart.test_appointment_id,
        invoice_id: cart.invoice_id,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { carts } = this.props;

    const { deleteModal } = this.state;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: carts.length, // replace later with size(carts),
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
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteCart}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Carts List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Carts" breadcrumbItem="Carts List" />
            <Row>
              <Col lx="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.cartListColumns}
                      data={carts}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.cartListColumns}
                          data={carts}
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
                              </Row>
                              <Row>
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
                    <Row className="mt-4">
                      <Col sm="6">
                        <button
                          to="/dashboard-patient/:id/nearby-labs"
                          className="btn btn-danger"
                          onClick={this.handleEmptyCart}
                          disabled={this.state.carts.length == 0}
                        >
                          <i className="mdi mdi-delete-empty me-1" />
                          Empty Cart
                        </button>
                      </Col>
                      <Col sm="6">
                        <div className="text-sm-end mt-2 mt-sm-0">
                          <button
                            component={Link}
                            onClick={() => {
                              this.props.history.push(
                                this.props.match.params.uuid
                                  ? `/checkout/${this.props.match.params.uuid}`
                                  : `/checkout`
                              );
                            }}
                            className="btn btn-success"
                            disabled={this.state.carts.length == 0}
                          >
                            <i className="mdi mdi-cart-arrow-right me-1" />{" "}
                            Checkout{" "}
                          </button>
                        </div>
                      </Col>
                    </Row>
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

CartList.propTypes = {
  history: PropTypes.any,
  location: PropTypes.any,
  match: PropTypes.object,
  carts: PropTypes.array,
  className: PropTypes.any,
  onGetCarts: PropTypes.func,
  onDeleteCart: PropTypes.func,
  onEmptyCart: PropTypes.func,
};

const mapStateToProps = ({ carts }) => ({
  carts: carts.carts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetCarts: id => dispatch(getCarts(id)),
  onDeleteCart: cartItem => dispatch(deleteCart(cartItem)),
  onEmptyCart: id => dispatch(emptyCart(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CartList));
