import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import Select from "react-select";
import { Collapse } from "reactstrap";
import { any } from "prop-types";
import * as Yup from "yup";

import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
  ModalBody,
  ModalHeader,
  Modal,
  Label,
  Input,
} from "reactstrap";
import Tooltip from "@material-ui/core/Tooltip";
import { isEmpty, map, size } from "lodash";
import { addToCart } from "store/actions";
import { getCarts } from "store/carts/actions";
import StarRatings from "react-star-ratings";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form } from "formik";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { onlyMedicalTestList } from "store/only-medical-tests-list/actions";
import { getTerritoriesList } from "store/territories-list/actions";
import { getQuotes } from "store/quotes/actions";

import "assets/scss/table.scss";
import quotes from "store/quotes/reducer";

class MedicalTestList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      territoriesList: [],
      carts: [],
      onlyMedicalTestList: [],
      test_name: [], // Use an array to store multiple selections
      quotes: [],
      search_type: "", // Set the initial value to an empty string or a default value
      km: "30",
      address: "",
      latitude: "",
      longitude: "",
      locationAccessAllowed: "",
      currentLatitude: "",
      currentLongitude: "",
      quote: "",
      id: "",
      searchQuery: "", // New state property for search query
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      onlyMedicalTestList: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      user_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
      loading: true, // Add loading state proper
      page: "1",
    };
    // this.toggle = this.toggle.bind(this);
    this.handlePatientFeedbackClick =
      this.handlePatientFeedbackClick.bind(this);
    console.log("yaha ani chahi hai uuid", this.props.match.params.id, this.state.user_id, this.props.match.params.filnalurl)
    console.log(this.state.user_type)
  }

  componentDidMount() {
    const { carts, onGetCarts } = this.props;
    onGetCarts(this.state.user_id);
    this.setState({
      carts
    });
    const { onlyMedicalTestList, onGetonlyMedicalTestList } = this.props;
    onGetonlyMedicalTestList(this.state.user_id);
    this.setState({ onlyMedicalTestList });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 7000); // Set loading state to false after 7 seconds
    const { territoriesList, onGetTerritoriesList } = this.props;
    if (territoriesList && !territoriesList.length) {
      console.log(onGetTerritoriesList(this.state.user_id));
    }
    let latitude;
    let longitude;

    const url = window.location.href;
    const queryString = url.substring(url.indexOf('&') + 1);
    const params = new URLSearchParams(queryString);
    console.log("print params in app", url, queryString, params)

    const latitudeFromUrl = params.get('lat');
    const longitudeFromUrl = params.get('lon');

    console.log('Latitude:', latitudeFromUrl);
    console.log('Longitude:', longitudeFromUrl);

    if (latitudeFromUrl && longitudeFromUrl) {
      // Use latitude and longitude from URL
      latitude = parseFloat(latitudeFromUrl);
      longitude = parseFloat(longitudeFromUrl);
      console.log("print lat log in app", latitude, longitude);

      // Call the dependent code here or pass the latitude and longitude values as arguments
      this.handleLocationUpdate(latitude, longitude);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          console.log("web", latitude, longitude);

          this.setState({ currentLatitude: latitude });
          this.setState({ currentLongitude: longitude });
          this.setState({ locationAccessAllowed: true });

          // Assuming onGetQuotes is a prop, use it from props
          const { onGetQuotes } = this.props;
          onGetQuotes(this.state.city_id, this.state.test_id, this.state.search_type, this.state.address, this.state.currentLongitude, this.state.currentLatitude, this.state.km, this.state.locationAccessAllowed);

          // Set loading state
          this.setState({ loading: true });

          // Set loading state to false after 7 seconds
          setTimeout(() => {
            this.setState({ loading: false });
          }, 7000);

        }, () => {
          this.setState({ latitude: null, longitude: null });
        }
        );
      } else {
        // Geolocation is not supported by the browser
        console.log("Geolocation is not supported by the browser.");
        // Handle this scenario as needed, e.g., display an error message or provide alternative functionality.
      }
    }
    setTimeout(() => {
      this.setState({ loading: false });
    }, 7000); // Set loading state to false after 7 seconds
  }
  onchangename = selectedOptions => {
    const selectedValues = selectedOptions.map(option => option.value);
    this.setState({
      test_name: selectedValues, locationAccessAllowed: true,
    });
  };
  handleLocationUpdate(latitude, longitude) {
    const { onGetQuotes } = this.props;

    setTimeout(() => {
      this.setState({ currentLatitude: latitude });
      this.setState({ currentLongitude: longitude });
      if (this.state.currentLatitude && this.state.currentLongitude && this.state.test_id) {
        onGetQuotes(this.state.city_id, this.state.test_id, this.state.search_type, this.state.address, this.state.currentLongitude, this.state.currentLatitude, this.state.km, this.state.locationAccessAllowed);

        // Set loading state
        this.setState({ loading: true });

        // Clear previous quotes
        this.setState({ quotes: [] });

        // Set loading state to false after 7 seconds
        setTimeout(() => {
          this.setState({ loading: false });
        }, 1000);
      }
    }, 1000);
  }

  // Handle search type change
  onChangeSearchType = async e => {
    this.setState({ search_type: e.target.value });
    this.setState({ city_id: "" });

    console.log("search type have to note", this.state.search_type, e.target.value);

    // Check if the search type is "Current Location" and test IDs are selected
    if (e.target.value === "Current Location" && this.state.test_id) {
      this.handleCurrentLocationSearch();
    }
  }; 
  // Add a new function for handling API call when search type is "Current Location"
  handleCurrentLocationSearch = async () => {
    this.setState({ city_id: "", locationAccessAllowed: true });

    // Check if the geolocation API is supported
    if ("geolocation" in navigator) {
      try {
        const locationPermission = await navigator.permissions.query({ name: 'geolocation' });

        if (locationPermission.state === 'denied' && !this.state.locationAccessAllowed) {
          // Location access is denied
          this.setState({ PatientModal: true });
        } else {
          // Location access is prompted, ask the user for permission
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const { onGetQuotes } = this.props;
          onGetQuotes(this.state.city_id, this.state.test_id, this.state.search_type, this.state.address, longitude, latitude, this.state.km, this.state.locationAccessAllowed);

          // Set loading state
          this.setState({ loading: true, quotes: [] });

          // Set loading state to false after 7 seconds
          setTimeout(() => {
            this.setState({ loading: false });
          }, 7000);
        }
      } catch (error) {
        console.error('Error checking location permission:', error);
      }
    } else {
      // Geolocation API is not supported, show an error message
      this.setState({ PatientModal: true });
    }
  };
  onChangeKm = async e => {
    this.setState({ km: e.target.value });

    // Check if both city and test name are selected before making the API call
    if (this.state.city_id && this.state.test_id) {
      this.handleApiCall();
    } else if (this.state.search_type === "Current Location" && this.state.test_id) {
      this.handleCurrentLocationSearch();
    }  
    else if (this.state.search_type === "Custom Address" && this.state.test_id && this.state.address) {
      this.makeApiCall();
    }
  };

  // Add a new function for handling the API call
  handleApiCall = async () => {
    const { onGetQuotes } = this.props;
    onGetQuotes(
      this.state.city_id,
      this.state.test_id,
      this.state.search_type,
      this.state.address,
      this.state.currentLongitude,
      this.state.currentLatitude,
      this.state.km,
      this.state.locationAccessAllowed
    );

    // Set loading state
    this.setState({ loading: true, quotes: [] });

    // Set loading state to false after 7 seconds
    setTimeout(() => {
      this.setState({ loading: false });
    }, 7000);
  };
  onChangeAddress = async (e) => {
    // Apply that city's latitude and longitude as city bound so that we see addresses of that city only
    var cityBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(this.state.latitude, this.state.longitude)
    );
  
    const options = {
      bounds: cityBounds,
      types: ["establishment"],
      componentRestrictions: { country: "pk" },
    };
  
    var searchBox = new window.google.maps.places.SearchBox(e.target, options);
  
    searchBox.addListener("places_changed", () => {
      this.setState({ address: e.target.value }, () => {
        // Now that the state is updated, make the API call
        this.makeApiCall();
      });
    });
  };

  handleCityChange = (selectedGroup) => {
    const selectedCityId = selectedGroup.value;
    this.setState({ city_id: selectedCityId });
    // this.setState({ km: "", latitude: "", longitude: "", locationAccessAllowed: "" });
    if (selectedCityId && this.state.test_id) {
      // Call your API here
      const { onGetQuotes } = this.props;
      onGetQuotes(selectedCityId, this.state.test_id, this.state.search_type);

      // Set loading state
      this.setState({ loading: true });

      // Clear previous quotes
      this.setState({ quotes: [] });

      // Set loading state to false after 7 seconds
      setTimeout(() => {
        this.setState({ loading: false });
      }, 7000);
    }
  };
  handleTestsChange = async (selectedTests, e) => {
    const selectedTestIds = selectedTests.map((test) => test.value);
    this.setState({ test_id: selectedTestIds });

    // Check if both city and test name are selected before making the API call
    if (this.state.city_id && selectedTestIds.length > 0) {
      // Call your API here
      const { onGetQuotes } = this.props;
      onGetQuotes(this.state.city_id, selectedTestIds, this.state.search_type);

      // Set loading state
      this.setState({ loading: true });

      // Clear previous quotes
      this.setState({ quotes: [] });

      // Set loading state to false after 7 seconds
      setTimeout(() => {
        this.setState({ loading: false });
      }, 7000);
    } else if (this.state.search_type === "Current Location" && selectedTestIds.length > 0) {
      this.setState({ city_id: "", locationAccessAllowed: true });
      // Check if the geolocation API is supported
      if ("geolocation" in navigator) {
        try {
          const locationPermission = await navigator.permissions.query({ name: 'geolocation' });

          if (locationPermission.state === 'denied' && !this.state.locationAccessAllowed) {
            // Location access is denied
            // Show the PatientModal only when the user explicitly clicks on "Current Location"
            this.setState({ PatientModal: true });
          } else {
            // Location access is prompted, ask the user for permission
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const { onGetQuotes } = this.props;
            onGetQuotes(this.state.city_id, selectedTestIds, this.state.search_type, this.state.address, longitude, latitude, this.state.km, this.state.locationAccessAllowed);

            // Set loading state
            this.setState({ loading: true, quotes: [] });

            // Set loading state to false after 7 seconds
            setTimeout(() => {
              this.setState({ loading: false });
            }, 7000);
          }
        } catch (error) {
          console.error('Error checking location permission:', error);
        }
      } else {
        // Geolocation API is not supported, show an error message
        this.setState({ PatientModal: true }); // Show the modal for error
      }
    } else if (this.state.search_type === "Custom Address" && selectedTestIds.length > 0) {
      // Apply that city's latitude and longitude as city bound so that we see addresses of that city only

        this.setState({ test_id: selectedTestIds }, () => {
          // Now that the state is updated, make the API call
          this.makeApiCall();
        });
    } else {
      console.log("City or Test IDs not selected. API call not made.");
    }
  };
  makeApiCall = () => {
    const { onGetQuotes } = this.props;
    onGetQuotes(
      this.state.city_id,
      this.state.test_id,
      this.state.search_type,
      this.state.address,
      this.state.longitude,
      this.state.latitude,
      this.state.km,
      this.state.locationAccessAllowed
    );
  
    // Set loading state
    this.setState({ loading: true, quotes: [] });
  
    // Set loading state to false after 7 seconds
    setTimeout(() => {
      this.setState({ loading: false });
    }, 7000);
  };
  handleAddToCart = cart => {
    console.log("1stttt", cart);
    const { onAddToCart } = this.props;
    const { offered_tests } = cart;
    console.log("2nd", offered_tests);
    // Check if there are offered tests in the nearbyTest
    if (offered_tests && offered_tests.length > 0) {
      offered_tests.forEach(offeredTest => {
        console.log("3rddd", offeredTest);
        const { test_name } = offeredTest;

        // Check if the test_name already exists in the cart
        const isTestInCart = this.props.carts.some(cartItem => cartItem.test_name === test_name);

        if (isTestInCart) {
          // Skip adding to the cart if the test already exists
          return;
        }
        // const { id:id } = offeredTest;
        if (!this.state.user_id) {
          // Check if the item is already in the cart
          if (offeredTest.guest_id === this.props.match.params.guest_id) {
            this.showErrorMessage("Item is already added to the cart");
            return;
          }

          this.setState({ guest_id: this.props.match.params.guest_id });
          offeredTest.guest_id = this.props.match.params.guest_id;
          onAddToCart(offeredTest, offeredTest.guest_id);

          console.log(
            "uuid:",
            offeredTest.guest_id,
            this.props.match.params.guest_id
          );
        } else if (
          this.state.user_type !== "CSR" &&
          this.state.user_type !== "b2bclient"
        ) {
          // Check if the item is already in the cart
          if (offeredTest.user_id === this.state.user_id) {
            this.showErrorMessage("Item is already added to the cart");
            return;
          }

          onAddToCart(offeredTest, this.state.user_id);
        } else if (
          this.state.user_type === "CSR" &&
          this.state.user_type !== "b2bclient"
        ) {
          // Check if the item is already in the offeredTest
          if (offeredTest.guest_id === this.props.match.params.guest_id) {
            this.showErrorMessage("Item is already added to the cart");
            return;
          }

          onAddToCart(offeredTest, this.props.match.params.guest_id);
        } else if (
          this.state.user_type === "b2bclient" &&
          this.state.user_type !== "CSR"
        ) {
          // Check if the item is already in the offeredTest
          if (offeredTest.user_id === this.state.user_id) {
            this.showErrorMessage("Item is already added to the cart");
            return;
          }

          onAddToCart(offeredTest, this.props.match.params.uuid);
        }
      });
      this.showSuccessMessage("Item added Successfully");
    } else {
      // Show error message if there are no offered tests
      this.showErrorMessage("No offered tests to add to the cart");
    }
  };
  showErrorMessage = message => {
    this.showPopup(message, "red");
  };

  showSuccessMessage = message => {
    this.showPopup(message, "green");
  };
  showPopup = (message, textColor) => {
    // Create and style the popup
    const popup = document.createElement("div");
    popup.style.display = "none";
    popup.style.position = "fixed";
    popup.style.top = "0";
    popup.style.left = "0";
    popup.style.width = "100%";
    popup.style.height = "100%";
    popup.style.background = "rgba(0, 0, 0, 0.5)";
    popup.style.zIndex = "1000";

    const popupContent = document.createElement("div");
    popupContent.style.position = "absolute";
    popupContent.style.top = "50%";
    popupContent.style.left = "50%";
    popupContent.style.transform = "translate(-50%, -50%)";
    popupContent.style.background = "#fff";
    popupContent.style.padding = "20px";
    popupContent.style.borderRadius = "5px";
    popupContent.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";

    const messageElement = document.createElement("div");
    messageElement.style.fontSize = "18px";
    messageElement.style.textAlign = "center";
    messageElement.style.color = textColor; // Set the text color

    // Set the message
    messageElement.textContent = message;

    // Append elements to the DOM
    popupContent.appendChild(messageElement);
    popup.appendChild(popupContent);
    document.body.appendChild(popup);

    // Show the popup
    popup.style.display = "block";

    // Hide the popup after a certain duration (e.g., 3 seconds)
    setTimeout(() => {
      popup.style.display = "none";
    }, 1000); // 3000 milliseconds = 3 seconds
  };
  handlePatientFeedbackClick = (e, arg) => {
    this.setState({
      id: arg,
    });

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

  shouldHighlightTestsLink() {
    const { location } = this.props;
    const currentURL = location.pathname;

    // Check if the URL contains "nearby-test"
    return currentURL.includes("/tests-offered-labhazir/");
  }



  render() {
    const { onGetCarts } = this.props;

    const { carts } = this.props;
    const { search_type } = this.state;
    let borderColor = '2px solid blue'; // Default border color

    // Check the selected option and update border color accordingly
    if (search_type === 'Current Location') {
      borderColor = '2px solid red'; // Change to the desired color
    }
    if (search_type === 'City') {
      borderColor = '2px solid green'; // Change to the desired color
    }
    if (search_type === 'Custom Address') {
      borderColor = '2px solid yellow'; // Change to the desired color
    }
    const { SearchBar } = Search;
    const { loading } = this.state;
    const isTestsLinkHighlighted = this.shouldHighlightTestsLink();
    const linkStyles = {
      color: isTestsLinkHighlighted ? "black" : "black", // Text color
      // backgroundColor: isTestsLinkHighlighted ? '#ffcc00' : 'transparent', // Background color
      fontWeight: isTestsLinkHighlighted ? "bold" : "normal",
    };

    const { onlyMedicalTestList, quotes } = this.props;
    console.log("quesots have data or not", quotes, this.state.city_id, this.state.test_id)
    const { onGetonlyMedicalTestList, onGetQuotes } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: onlyMedicalTestList.length, // replace later with size(onlyMedicalTestList),
      custom: true,
    };
    const { searchQuery } = this.state;
    // const filteredTests = this.props.onlyMedicalTestList.filter(test =>
    //   test.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );
    // list of city from territories
    const cityList = [];
    for (let i = 0; i < this.props.territoriesList.length; i++) {
      cityList.push({
        label: this.props.territoriesList[i].city,
        value: this.props.territoriesList[i].id,
      });
    }
    const testList = [];
    for (let i = 0; i < this.props.onlyMedicalTestList.length; i++) {
      testList.push({
        label: this.props.onlyMedicalTestList[i].name,
        value: this.props.onlyMedicalTestList[i].id,
      });
    }

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];
    const isFilterApplied = this.state.city_id && this.state.test_id && this.state.search_type === "City";
    const isFilterApplied2 = this.state.test_id && this.state.search_type === "Current Location";
    const isFilterApplied3 = this.state.test_id && this.state.search_type === "Custom Address" && this.state.address;
    const renderedRowKeys = []; // Array to store rendered row keys
    console.log("have data in the renderedRowKeys", renderedRowKeys)
    const isSmallScreen = window.innerWidth < 490;

    return (
      <React.Fragment>
        <div className="topnav">
          <div className="container-fluid left-space">
            <nav
              className="navbar navbar-light navbar-expand-lg topnav-menu"
              id="navigation"
            >
              {this.state.user_id &&
                this.state.user_type === "CSR" &&
                this.state.user_type !== "b2bclient" ? (
                <Collapse
                  isOpen={this.state.isMenuOpened}
                  className="navbar-collapse"
                  id="topnav-menu-content"
                >
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/tests-offered-labhazir/${this.props.match.params.guest_id}`
                            : `/tests-offered-labhazir`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12" style={linkStyles}>
                          Book a Test
                        </span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/labs/${this.props.match.params.guest_id}`
                            : `/labs`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Labs</span>
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-test/${this.props.match.params.guest_id}`
                            : `/nearby-test`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Tests</span>
                        {/* {this.props.t("Tests")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-profiles/${this.props.match.params.guest_id}`
                            : `/nearby-profiles`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Profiles</span>
                        {/* {this.props.t("Profiles")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-packages/${this.props.match.params.guest_id}`
                            : `/nearby-packages`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Packages</span>

                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-radiology/${this.props.match.params.guest_id}`
                            : `/nearby-radiology`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Radiology</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>

                    {this.state.user_id && this.state.user_type == "patient" && (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/test-appointments/${this.props.match.params.guest_id}`
                              : `/test-appointments`
                          }
                          className="dropdown-item"
                        >
                          {/* {this.props.t("My Appointments")} */}
                          <span className="pt-4 font-size-12">
                            My Appointments
                          </span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </Collapse>
              ) : null}
              {!this.state.user_id ? (
                <Collapse
                  isOpen={this.props.menuOpen}
                  className="navbar-collapse"
                  id="topnav-menu-content"
                >
                  <ul className="navbar-nav">
                    {this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/tests-offered-labhazir/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                              : `/tests-offered-labhazir/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span
                            className="pt-4 font-size-12"
                            style={linkStyles}
                          >
                            Book a Test
                          </span>
                        </Link>
                      </li>
                    ) : !this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/tests-offered-labhazir/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                              : `/tests-offered-labhazir/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span
                            className="pt-4 font-size-12"
                            style={linkStyles}
                          >
                            Book a Test
                          </span>
                        </Link>
                      </li>
                    ) : null}
                    {this.props.match.params.filnalurl ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/labs/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                              : `/labs/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Labs</span>
                        </Link>
                      </li>
                    ) : (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/labs/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                              : `/labs/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Labs</span>
                        </Link>
                      </li>
                    )}

                    {this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-test/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                              : `/nearby-test/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Tests</span>
                        </Link>
                      </li>
                    ) : !this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-test/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-test/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Tests</span>
                        </Link>
                      </li>
                    ) : null}
                    {this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-profiles/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                              : `/nearby-profiles/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Profiles</span>
                        </Link>
                      </li>
                    ) : !this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-profiles/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-profiles/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Profiles</span>
                        </Link>
                      </li>
                    ) : null}

                    {this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-packages/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                              : `/nearby-packages/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Packages</span>
                        </Link>
                      </li>
                    ) : !this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-packages/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-packages/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Packages</span>
                        </Link>
                      </li>
                    ) : null}

                    {this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-radiology/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                              : `/nearby-radiology/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Radiology</span>
                        </Link>
                      </li>
                    ) : !this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-radiology/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-radiology/${this.props.match.params.guest_id}`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Radiology</span>
                        </Link>
                      </li>
                    ) : null}


                    {/* <li className="nav-item dropdown">
                     <Link
                       to="/#"
                       onClick={e => {
                         e.preventDefault();
                         this.setState({ appState: !this.state.appState });
                       }}
                       className="nav-link dropdown-toggle arrow-none"
                     >
                       <i className="bx bx-store me-2" />
                       {this.props.t("Lab Marketplace")}{" "}
                       <div className="arrow-down" />
                     </Link>
                     <div
                       className={classname("dropdown-menu", {
                         show: this.state.appState,
                       })}
                     >
                       <Link to="/nearby-labs" className="dropdown-item">
                         {this.props.t("Nearby Labs")}
                       </Link>
                       <Link to="/nearby-test" className="dropdown-item">
                         {this.props.t("Nearby Tests")}
                       </Link>
                     </div>
                   </li> */}

                    {this.state.user_id && this.state.user_type == "patient" && (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/test-appointments/${this.props.match.params.guest_id}`
                              : `/test-appointments`
                          }
                          className="dropdown-item"
                        >
                          {/* {this.props.t("My Appointments")} */}
                          <span className="pt-4 font-size-12">
                            My Appointments
                          </span>
                        </Link>
                      </li>
                      /* <li className="nav-item dropdown">
                           <Link
                            to="/#"
                            onClick={e => {
                              e.preventDefault();
                              this.setState({ appState: !this.state.appState });
                            }}
                            className="nav-link dropdown-toggle arrow-none"
                          >
                            <i className="bx bx-test-tube me-2" />
                            {this.props.t("Appointments")}{" "}
                            <div className="arrow-down" />
                          </Link>
                          <div
                            className={classname("dropdown-menu", {
                              show: this.state.appState,
                            })}
                          >
                            <Link
                              to={"/test-appointments"}
                              className="dropdown-item"
                            >
                              {this.props.t("Test Appointments")}
                            </Link>
                          </div>
                          </li> */
                    )}
                  </ul>
                </Collapse>
              ) : this.state.user_id &&
                this.state.user_type !== "CSR" &&
                this.state.user_type !== "b2bclient" ? (
                <Collapse
                  isOpen={this.props.menuOpen}
                  className="navbar-collapse"
                  id="topnav-menu-content"
                >
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/tests-offered-labhazir/${this.props.match.params.guest_id}`
                            : `/tests-offered-labhazir/`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12" style={linkStyles}>
                          Book a Test
                        </span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/labs/${this.props.match.params.guest_id}`
                            : `/labs`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Labs</span>
                        {/* {this.props.t("Labs")} */}
                      </Link>
                    </li>

                    <li className="nav-item">
                      {/* <Link to="/nearby-test" className="dropdown-item">
                      {this.props.t("Search by Tests")}
                    </Link> */}
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-test/${this.props.match.params.guest_id}`
                            : `/nearby-test/`
                        }
                        className="dropdown-item"
                      >
                        {/* {this.props.t("Tests")} */}
                        <span className="pt-4 font-size-12">Tests</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-profiles/${this.props.match.params.guest_id}`
                            : `/nearby-profiles/`
                        }
                        className="dropdown-item"
                      >
                        {/* {this.props.t("Profiles")} */}
                        <span className="pt-4 font-size-12">Profiles</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-packages/${this.props.match.params.guest_id}`
                            : `/nearby-packages/`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Packages</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-radiology/${this.props.match.params.guest_id}`
                            : `/nearby-radiology/`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Radiology</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>

                    {/* <li className="nav-item dropdown">
                    <Link
                      to="/#"
                      onClick={e => {
                        e.preventDefault();
                        this.setState({ appState: !this.state.appState });
                      }}
                      className="nav-link dropdown-toggle arrow-none"
                    >
                      <i className="bx bx-store me-2" />
                      {this.props.t("Lab Marketplace")}{" "}
                      <div className="arrow-down" />
                    </Link>
                    <div
                      className={classname("dropdown-menu", {
                        show: this.state.appState,
                      })}
                    >
                      <Link to="/nearby-labs" className="dropdown-item">
                        {this.props.t("Nearby Labs")}
                      </Link>
                      <Link to="/nearby-test" className="dropdown-item">
                        {this.props.t("Nearby Tests")}
                      </Link>
                    </div>
                  </li> */}

                    {this.state.user_id && this.state.user_type == "patient" && (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/test-appointments/${this.props.match.params.guest_id}`
                              : `/test-appointments`
                          }
                          className="dropdown-item"
                        >
                          {/* {this.props.t("My Appointments")} */}
                          <span className="pt-4 font-size-12">
                            My Appointments
                          </span>
                        </Link>
                      </li>
                      /* <li className="nav-item dropdown">
                           <Link
                            to="/#"
                            onClick={e => {
                              e.preventDefault();
                              this.setState({ appState: !this.state.appState });
                            }}
                            className="nav-link dropdown-toggle arrow-none"
                          >
                            <i className="bx bx-test-tube me-2" />
                            {this.props.t("Appointments")}{" "}
                            <div className="arrow-down" />
                          </Link>
                          <div
                            className={classname("dropdown-menu", {
                              show: this.state.appState,
                            })}
                          >
                            <Link
                              to={"/test-appointments"}
                              className="dropdown-item"
                            >
                              {this.props.t("Test Appointments")}
                            </Link>
                          </div>
                          </li> */
                    )}
                  </ul>
                </Collapse>
              ) : this.state.user_id &&
                this.state.user_type !== "CSR" &&
                this.state.user_type === "b2bclient" ? (
                <Collapse
                  isOpen={this.state.isMenuOpened}
                  className="navbar-collapse"
                  id="topnav-menu-content"
                >
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/tests-offered-labhazir/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/tests-offered-labhazir`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12" style={linkStyles}>
                          Book a Test
                        </span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/labs/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/labs`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Labs</span>
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-test/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-test`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Tests</span>
                        {/* {this.props.t("Tests")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-profiles/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-profiles`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Profiles</span>
                        {/* {this.props.t("Profiles")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-packages/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-packages`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Packages</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={
                          this.props.match.params.guest_id
                            ? `/nearby-radiology/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-radiology`
                        }
                        className="dropdown-item"
                      >
                        <span className="pt-4 font-size-12">Radiology</span>
                        {/* {this.props.t("Packages")} */}
                      </Link>
                    </li>

                    {this.state.user_id && this.state.user_type == "patient" && (
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/test-appointments/${this.props.match.params.guest_id}`
                              : `/test-appointments`
                          }
                          className="dropdown-item"
                        >
                          {/* {this.props.t("My Appointments")} */}
                          <span className="pt-4 font-size-12">
                            My Appointments
                          </span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </Collapse>
              ) : null}
            </nav>
          </div>
        </div>
        <div className="page-content">
          <MetaTags>
            {/* <title>Approved Donors | Lab Hazir</title> */}
          </MetaTags>
          <Container fluid>
          {!isSmallScreen ? (
            <Row className="mb-3">
              <Formik
                enableReinitialize={true}
                initialValues={{
                  search_type:
                    (this.state && this.state.search_type) ||
                    "",
                  city_id: (this.state && this.state.city_id) || "",
                  test_id: (this.state && this.state.test_id) ||
                    "",
                  km: (this.state && this.state.km) || "30",
                }}
                validationSchema={Yup.object().shape({
                  // city: Yup.string().when("search_type", {
                  //   is: val => val === "Custom Address",
                  //   then: Yup.string().required("Please enter your City"),
                  // }),
                  // location: Yup.string().when("city", {
                  //   is: val => val != "",
                  //   then: Yup.string().required("Please enter your Location"),
                  // }),
                })}
              >
                {({ errors, status, touched }) => (
                  <Form className="form-horizontal">
                    {/* Type field */}
                    <Row>
                      <Col xs="3" sm="3" md="2" lg="2">
                        <div className="mb-3">
                          <Label
                            for="LabType2"
                            className="form-label"
                            style={{
                              fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                              color: 'black',
                              fontWeight: 'bold',
                            }}
                          >
                            Search Types
                          </Label>
                          <select
                            name="search_type"
                            component="select"
                            onChange={(e) => this.onChangeSearchType(e)
                            }
                            value={search_type}
                            className="form-select"
                            style={{
                              border: borderColor,
                              borderRadius: '5px',
                              // Add more style overrides as needed
                            }}
                          >
                            <option value="">Choose an option</option>
                            <option value="Current Location">Current Location</option>
                            <option value="City">Search By City</option>
                            <option value="Custom Address">Custom Address</option>

                          </select>
                        </div>
                      </Col>
                      {this.state.search_type === 'Custom Address' && (
                            <Col xs="3" sm="3" md="2" lg="2">
                              <div className="mb-3">
                                <Label
                                  for="LabType1"
                                  className="form-label"
                                  style={{
                                    fontSize: window.innerWidth <= 576 ? '8px' : '12px',
                                    color: 'black',
                                    fontWeight: "bold",
                                  }}
                                >
                                  <span style={{ fontSize: '12px', }}>Custom Address </span>
                                </Label>
                                <Input
                                  defaultValue={this.state.address}
                                  onChange={(e) => this.onChangeAddress(e)}
                                  id="pac-input"
                                  type="text"
                                  className="form-control"
                                  placeholder="Address.."
                                  style={{
                                    border: '2px solid yellow',
                                    borderRadius: '5px',
                                    // Add more style overrides as needed
                                  }}
                                />
                              </div>
                            </Col>
                          )}
                          {this.state.search_type === 'Custom Address' && (
                        <Col xs="1" sm="2" md="1" lg="1">
                          <div className="mb-3">
                          <Label
                                for="LabType2"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                                  color: 'black',
                                  fontWeight: "bold",
                                }}
                              >
                                Km
                              </Label>
                            <div className="input-group">
                              <Input
                                defaultValue={this.state.km}
                                onChange={(e) => this.onChangeKm(e)}
                                id="pac-input"
                                type="number"
                                className="form-control"
                                placeholder="km.."
                                style={{
                                  border: '2px solid yellow',
                                  borderRadius: '5px',
                                  fontSize: '14px'
                                  // Add more style overrides as needed
                                }}
                              />
                            </div>
                          </div>
                        </Col>
                      )}
                      {this.state.search_type === 'Current Location' && (
                        <Col xs="1" sm="2" md="1" lg="1">
                          <div className="mb-3">
                            <Label
                              for="LabType"
                              className="form-label"
                              style={{
                                fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                                color: 'black',
                                fontWeight: "bold",
                              }}
                            >
                              <span style={{ fontSize: '12px' }}>Km </span>
                            </Label>
                            <div className="input-group">
                              <Input
                                defaultValue={this.state.km}
                                onChange={(e) => this.onChangeKm(e)}
                                id="pac-input"
                                type="number"  // Change "numbers" to "number"
                                className="form-control"
                                placeholder=""
                                style={{
                                  border: '2px solid red',
                                  borderRadius: '5px',
                                  fontSize: '14px'
                                  // Add more style overrides as needed
                                }}
                              />
                            </div>
                          </div>
                        </Col>
                      )}
                      {this.state.search_type === 'City' && (
                        <Col xs="4" sm="4" md="2" lg="2">
                          <div className="mb-3">
                            <Label for="city" className="form-label" style={{
                              fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                              color: 'black',
                              fontWeight: 'bold',
                            }}>
                              Select City
                            </Label>
                            <Select
                              name="city"
                              component="Select"
                              onChange={this.handleCityChange} // Call the separate function here
                              className="defautSelectParent"
                              options={cityList}
                              defaultValue={{
                                label: "Select City...",
                                value: this.state.id,
                              }}
                              styles={{
                                control: (provided, state) => ({
                                  ...provided,
                                  border: '2px solid green',
                                  borderRadius: '5px',
                                }),
                                // Add more style overrides as needed
                              }}
                            />
                          </div>
                        </Col>
                      )}
                      <Col xs="4" sm="4" md="3" lg="3">
                        <div className="mb-3">
                          <Label for="test_id" className="form-label" style={{
                            fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                            color: 'black',
                            fontWeight: 'bold',
                          }}>
                            Select Test Names
                          </Label>
                          <Select
                            name="test"
                            component="Select"
                            placeholder="Select Test..."
                            onChange={this.handleTestsChange} // Call the separate function here
                            isMulti={true}
                            className="defautSelectParent"
                            options={testList}
                            styles={{
                              control: (provided, state) => ({
                                ...provided,
                                border: '2px solid blue',
                                borderRadius: '5px',
                              }),
                              // Add more style overrides as needed
                            }}
                          />
                          <p className="text-danger font-size-10">You may Select Single or Multiple Tests to Book.</p>
                        </div>

                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </Row>
          ) : <Row className="mb-3">
          <Formik
            enableReinitialize={true}
            initialValues={{
              search_type:
                (this.state && this.state.search_type) ||
                "",
              city_id: (this.state && this.state.city_id) || "",
              test_id: (this.state && this.state.test_id) ||
                "",
              km: (this.state && this.state.km) || "30",
            }}
            validationSchema={Yup.object().shape({
              // city: Yup.string().when("search_type", {
              //   is: val => val === "Custom Address",
              //   then: Yup.string().required("Please enter your City"),
              // }),
              // location: Yup.string().when("city", {
              //   is: val => val != "",
              //   then: Yup.string().required("Please enter your Location"),
              // }),
            })}
          >
            {({ errors, status, touched }) => (
              <Form className="form-horizontal">
                {/* Type field */}
                <Row className="g-0">
                    <Col Col xs="6" sm="6" md="3" lg="3">
                      <div>
                        <Label
                          for="LabType2"
                          className="form-label"
                          style={{
                            fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                            color: 'black',
                            fontWeight: 'bold',
                          }}
                        >
                          Search Types
                        </Label>
                        <select
                          name="search_type"
                          component="select"
                          onChange={(e) => this.onChangeSearchType(e)
                          }
                          value={search_type}
                          className="form-select"
                          style={{
                            border: borderColor,
                            borderRadius: '5px',
                            // Add more style overrides as needed
                          }}
                        >
                          <option value="">Choose an option</option>
                          <option value="Current Location">Current Location</option>
                          <option value="City">Search By City</option>
                          <option value="Custom Address">Custom Address</option>

                        </select>
                      </div>
                    </Col>
                    {this.state.search_type === 'Custom Address' && (
                          <Col xs="4" sm="4" md="2" lg="2">
                            <div>
                            <Label
                              for="LabType2"
                              className="form-label"
                              style={{
                                fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                                color: 'black',
                                fontWeight: 'bold',
                              }}
                            >
                              Custom Address
                            </Label>
                              <Input
                                defaultValue={this.state.address}
                                onChange={(e) => this.onChangeAddress(e)}
                                id="pac-input"
                                type="text"
                                className="form-control"
                                placeholder="Address.."
                                style={{
                                  border: '2px solid yellow',
                                  borderRadius: '5px',
                                  // Add more style overrides as needed
                                }}
                              />
                            </div>
                          </Col>
                    )}
                    {this.state.search_type === 'Custom Address' && (
                      <Col xs="2" sm="2" md="2" lg="2">
                        <div>
                        <Label
                              for="LabType2"
                              className="form-label"
                              style={{
                                fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                                color: 'black',
                                fontWeight: "bold",
                              }}
                            >
                              Km
                            </Label>
                          <div className="input-group">
                            <Input
                              defaultValue={this.state.km}
                              onChange={(e) => this.onChangeKm(e)}
                              id="pac-input"
                              type="number"
                              className="form-control"
                              placeholder="km.."
                              style={{
                                border: '2px solid yellow',
                                borderRadius: '5px',
                                fontSize: '14px'
                                // Add more style overrides as needed
                              }}
                            />
                          </div>
                        </div>
                      </Col>
                    )}
                    {this.state.search_type === 'Current Location' && (
                      <Col xs="3" sm="3" md="2" lg="2">
                        <div>
                          <Label
                            for="LabType"
                            className="form-label"
                            style={{
                              fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                              color: 'black',
                              fontWeight: "bold",
                            }}
                          >
                            <span style={{ fontSize: '12px' }}>Km </span>
                          </Label>
                          <div className="input-group">
                            <Input
                              defaultValue={this.state.km}
                              onChange={(e) => this.onChangeKm(e)}
                              id="pac-input"
                              type="number"  // Change "numbers" to "number"
                              className="form-control"
                              placeholder=""
                              style={{
                                border: '2px solid red',
                                borderRadius: '5px',
                                fontSize: '14px'
                                // Add more style overrides as needed
                              }}
                            />
                          </div>
                        </div>
                      </Col>
                    )}
                    {this.state.search_type === 'City' && (
                      <Col xs="6" sm="6" md="6" lg="6">
                        <div>
                          <Label for="city" className="form-label" style={{
                            fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                            color: 'black',
                            fontWeight: 'bold',
                          }}>
                            Select City
                          </Label>
                          <Select
                            name="city"
                            component="Select"
                            onChange={this.handleCityChange} // Call the separate function here
                            className="defautSelectParent"
                            options={cityList}
                            defaultValue={{
                              label: "Select City...",
                              value: this.state.id,
                            }}
                            styles={{
                              control: (provided, state) => ({
                                ...provided,
                                border: '2px solid green',
                                borderRadius: '5px',
                              }),
                              // Add more style overrides as needed
                            }}
                          />
                        </div>
                      </Col>
                    )}</Row>
                    <Row className="g-0">
                    <Col xs="6" sm="6" md="3" lg="3">
                      <div className="mb-3">
                        <Label for="test_id" className="form-label" style={{
                          fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                          color: 'black',
                          fontWeight: 'bold',
                        }}>
                          Select Test Names
                        </Label>
                        <Select
                          name="test"
                          component="Select"
                          placeholder="Select Test..."
                          onChange={this.handleTestsChange} // Call the separate function here
                          isMulti={true}
                          className="defautSelectParent"
                          options={testList}
                          styles={{
                            control: (provided, state) => ({
                              ...provided,
                              border: '2px solid blue',
                              borderRadius: '5px',
                            }),
                            // Add more style overrides as needed
                          }}
                        />
                        <p className="text-danger font-size-10">You may Select Single or Multiple Tests to Book.</p>
                      </div>

                    </Col>
                  </Row>
              </Form>
            )}
          </Formik>
        </Row>}
            <Row>
              <Card >
                <CardBody>
                  {isFilterApplied ? ( // Only render the table if both city_id and test_id are selected
                    <div className="table-responsive">
                      <Table className="table-nowrap">
                        <thead style={{ backgroundColor: "red" }}>
                          <tr >
                            <th className="text-start">Lab Name</th>
                            <th className="text-start">Test Name</th>
                            <th className="text-end">Reporting Time</th>
                            <th className="text-end">Price</th>
                            {/* <th className="text-center"> Total Price</th> */}
                            <th className="text-center"> Discount (Rs)</th>
                            <th className="text-center"> Price after Discount</th>
                            <th className="text-center">
                              Net Payable
                            </th>
                            <th></th>
                          </tr>
                        </thead>
                        {!isEmpty(quotes) &&
                          Array.isArray(quotes.top_lab_details_with_tests) && quotes.top_lab_details_with_tests.length > 0 ?
                          quotes.top_lab_details_with_tests.map(
                            (referrelFeeLab, key) => (
                              <tr
                                key={"_row_" + key}
                                style={{ backgroundColor: key % 2 === 0 ? 'white' : '#f1f8fe' }}
                              >
                                <td className="text-start" style={{
                                  backgroundColor: 'transparent !important',
                                  width: '200px',
                                  fontSize: '14px',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'normal',
                                  textAlign: 'left',
                                  display: 'block',
                                }}>
                                  {!this.state.user_id ? (
                                    <React.Fragment>
                                      {!this.state.user_id ? (
                                        <React.Fragment>
                                          <div style={{ background: 'transparent' }}>
                                            <Link
                                              to={
                                                this.props.match.params.guest_id
                                                  ? `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                                  : `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}`
                                              }
                                              className="text-dark"
                                              style={{ background: 'transparent' }}
                                            >
                                              <span className="text-primary" style={{ fontSize: "14px", display: 'block' }}>
                                                <b>{referrelFeeLab.name}</b>
                                              </span>    </Link>
                                            <div style={{ fontSize: "12px", background: 'transparent' }}>
                                              <b>{referrelFeeLab.type}</b>
                                            </div>
                                            <div>
                                              <StarRatings
                                                rating={referrelFeeLab.rating}
                                                starRatedColor="#F1B44C"
                                                starEmptyColor="#2D363F"
                                                numberOfStars={5}
                                                name="rating"
                                                starDimension="14px"
                                                starSpacing="3px"
                                              />
                                              {referrelFeeLab && referrelFeeLab.rating && (
    <p> {referrelFeeLab.rating}</p>
)}
                                            </div>
                                            
                                          </div>
                                        </React.Fragment>
                                      ) : null}

                                    </React.Fragment>
                                  ) : null}

                                  {(this.state.user_id) && (this.state.user_type === "CSR") && (this.state.user_type !== "b2bclient") && (
                                    <div>
                                      <Link
                                        to={
                                          this.props.match.params.guest_id
                                            ? `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                            : `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}`
                                        }
                                        className="text-dark"
                                      >
                                        <span className="text-primary" style={{ fontSize: "14px", display: 'block' }}>
                                          <b>{referrelFeeLab.name}</b>
                                        </span>
                                      </Link>
                                      <div style={{ fontSize: "12px" }}>
                                        <b>{referrelFeeLab.type}</b>
                                      </div>
                                      <div>
                                        <StarRatings
                                          rating={referrelFeeLab.rating}
                                          starRatedColor="#F1B44C"
                                          starEmptyColor="#2D363F"
                                          numberOfStars={5}
                                          name="rating"
                                          starDimension="14px"
                                          starSpacing="3px"
                                        />
                                        {referrelFeeLab && referrelFeeLab.rating && (
    <p> {referrelFeeLab.rating}</p>
)}
                                      </div>
                                      
                                    </div>
                                  )}

                                  {(this.state.user_id) && (this.state.user_type !== "CSR") && (this.state.user_type !== "b2bclient") && (
                                    <div>
                                      <Link
                                        to={
                                          this.props.match.params.guest_id
                                            ? `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                            : `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}`
                                        }
                                        className="text-dark"
                                      >
                                        <span className="text-primary" style={{ fontSize: "14px", display: 'block' }}>
                                          <b>{referrelFeeLab.name}</b>
                                        </span>
                                      </Link>
                                      <div style={{ fontSize: "12px" }}>
                                        <b>{referrelFeeLab.type}</b>
                                      </div>
                                      <div>
                                        <StarRatings
                                          rating={referrelFeeLab.rating}
                                          starRatedColor="#F1B44C"
                                          starEmptyColor="#2D363F"
                                          numberOfStars={5}
                                          name="rating"
                                          starDimension="14px"
                                          starSpacing="3px"
                                        />
                                        {referrelFeeLab && referrelFeeLab.rating && (
    <p> {referrelFeeLab.rating}</p>
)}
                                      </div>
                                      
                                    </div>
                                  )}

                                  {(this.state.user_id) && (this.state.user_type !== "CSR") && (this.state.user_type === "b2bclient") && (
                                    <div>
                                      <Link
                                        to={
                                          this.props.match.params.guest_id
                                            ? `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                            : `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}`
                                        }
                                        className="text-dark"
                                      >
                                        <span className="text-primary" style={{ fontSize: "14px", display: 'block' }}>
                                          <b>{referrelFeeLab.name}</b>
                                        </span>
                                      </Link>
                                      <div style={{ fontSize: "12px" }}>
                                        <b>{referrelFeeLab.type}</b>
                                      </div>
                                      <div>
                                        <StarRatings
                                          rating={referrelFeeLab.rating}
                                          starRatedColor="#F1B44C"
                                          starEmptyColor="#2D363F"
                                          numberOfStars={5}
                                          name="rating"
                                          starDimension="14px"
                                          starSpacing="3px"
                                        />
                                        {referrelFeeLab && referrelFeeLab.rating && (
    <p> {referrelFeeLab.rating}</p>
)}
                                      </div>
                                      
                                    </div>
                                  )}
                                </td>
                                <td className="text-start"
                                  style={{ whiteSpace: "pre-wrap" }}
                                >
                                  {!isEmpty(referrelFeeLab.offered_tests) &&
                                    referrelFeeLab.offered_tests.map(
                                      (offeredTest, index) => (
                                        <div key={index} style={{ background: 'transparent' }}>{offeredTest.test_name}</div>
                                      )
                                    )}
                                </td>
                                <td className="text-end">
                                  {!isEmpty(referrelFeeLab.offered_tests) &&
                                    referrelFeeLab.offered_tests.map(
                                      (offeredTest, index) => (
                                        <div key={index} style={{ background: 'transparent' }}>
                                          {" "}
                                          {offeredTest.duration_required}{" "}
                                          {offeredTest.duration_type}
                                        </div>
                                      )
                                    )}
                                </td>
                                <td className="text-end">
                                  {!isEmpty(referrelFeeLab.offered_tests) &&
                                    referrelFeeLab.offered_tests.map(
                                      (offeredTest, index) => (
                                        <div key={index} style={{ background: 'transparent' }}>
                                          {" "}
                                          {offeredTest.price
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </div>
                                      )
                                    )}
                                </td>
                                <td className="text-end">
                                  {!isEmpty(referrelFeeLab.offered_tests) &&
                                    referrelFeeLab.offered_tests.map((offeredTest, index) => (
                                      // Use a Fragment to avoid wrapping with a div
                                      <div key={index} style={{ background: 'transparent' }}>
                                        {((offeredTest.discount + (offeredTest.discount_by_labhazir || 0) + (offeredTest.test_discount || 0)) !== 0) ? (
                                          <span>
                                            {((offeredTest.discount + (offeredTest.discount_by_labhazir || 0) + (offeredTest.test_discount || 0)) * 100)} %
                                          </span>
                                        ) : (
                                          '--'
                                        )}
                                      </div>
                                    ))}
                                </td>

                                <td className="text-end">
                                  {referrelFeeLab.offered_tests
                                    .map((offeredTest, index) => {
                                      const discountByTest = offeredTest.discount || 0;
                                      const discountByLabhazir = offeredTest.discount_by_labhazir || 0;
                                      const discountByAllLabhazir = offeredTest.test_discount || 0;
                                      const totalDiscount = discountByTest + discountByLabhazir + discountByAllLabhazir;
                                      const discountedPrice =
                                        offeredTest.price -
                                        (offeredTest.price * (totalDiscount * 100)) / 100;

                                      return (
                                        <div key={index} style={{ background: 'transparent', }}>
                                          {discountedPrice
                                            .toFixed(2)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </div>
                                      );
                                    })}
                                </td>
                                <td className="text-end py-2 pl-3 pr-4">
                                  <div className="text-danger" style={{ background: 'transparent', fontSize: "16px", fontWeight: "bold" }}>
                                    {referrelFeeLab.offered_tests
                                      .reduce((total, offeredTest) => {
                                        const discountByTest = offeredTest.discount || 0;
                                        const discountByLabhazir = offeredTest.discount_by_labhazir || 0;
                                        const discountByAllLabhazir = offeredTest.test_discount || 0;
                                        const totalDiscount = discountByTest + discountByLabhazir
                                        const discountedPrice = (
                                          offeredTest.price -
                                          (offeredTest.price * (totalDiscount * 100)) / 100
                                        );
                                        return total + Number(discountedPrice);
                                      }, 0)
                                      .toFixed(2)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </div></td>

                                {/* <td className="text-center">
                                  <Button
                                    type="button"
                                    color="primary"
                                    className="btn mt-3 me-1 text-white bg-primary btn-outline-primary"
                                    onClick={() => {
                                      this.handleAddToCart(referrelFeeLab);
                                    }}
                                  >
                                    <i className="bx bx-cart me-2" /> Add to cart
                                  </Button>
                                </td> */}
                                <td className="text-center">
                                  {(() => {
                                    // Check if all offeredTest.id in this row are already in this.props.carts
                                    const areAllTestIdsInCart = referrelFeeLab.offered_tests.every(offeredTest =>
                                      this.props.carts.some(cartItem => cartItem.offered_test_id === offeredTest.id)
                                    );

                                    console.log("all present have or not", areAllTestIdsInCart);

                                    return (
                                      <Button
                                        type="button"
                                        color={areAllTestIdsInCart ? 'secondary' : 'primary'}
                                        className={`btn mt-3 me-1${areAllTestIdsInCart ? ' disabled' : ''}`}
                                        onClick={() => {
                                          const areAllTestIdsInCart = referrelFeeLab.offered_tests.every(offeredTest =>
                                            this.props.carts.some(cartItem => cartItem.test_name === offeredTest.test_name)
                                          );
                                          if (areAllTestIdsInCart) {
                                            alert("An item with the same name but from a different lab is already in the cart. Please remove the previous one first.");
                                          } else {
                                            this.handleAddToCart(referrelFeeLab);
                                          }
                                        }}
                                        disabled={areAllTestIdsInCart}
                                        style={{
                                          backgroundColor: 'primary', // Primary color
                                          borderColor: 'primary', // Primary color
                                          fontSize: '10px',

                                        }}
                                      >
                                        <i className="bx bx-cart me-2" /> {areAllTestIdsInCart ? 'Already Added' : 'Add to cart'}
                                      </Button>
                                    );
                                  })()}
                                </td>
                              </tr>
                            )
                          ) : (
                            <div className=" mt-4" >
                              <h4 className="text-primary" style={{ fontSize: "18px" }}>
                                &quot;Labhazir will only show labs that offer All the tests you&lsquo;ve selected.&quot;
                              </h4>

                            </div>
                          )}
                        {/* {isEmpty(quotes) && (
                          <Row style={{ background: 'transparent' }}>
                            <div className=" mt-4" >
                              <h4 className="text-uppercase">
                              Labhazir will only show labs offering All selected tests.
                              </h4>
                            </div>
                          </Row>
                        )} */}
                      </Table>
                    </div>
                  ) : isFilterApplied2 ? (
                    <div className="table-responsive">
                      <Table className="table-nowrap">
                        <thead style={{ backgroundColor: "red" }}>
                          <tr >
                            <th className="text-start">Lab Name</th>
                            <th className="text-start">Test Name</th>
                            <th className="text-end">Reporting Time</th>
                            <th className="text-center">Price</th>
                            {/* <th className="text-center"> Total Price</th> */}
                            <th className="text-center"> Discount</th>
                            <th className="text-center"> Price after Discount</th>
                            <th className="text-center">
                              Net Payable
                            </th>
                            <th></th>
                          </tr>
                        </thead>
                        {!isEmpty(quotes) &&
                          Array.isArray(quotes.top_lab_details_with_tests) && quotes.top_lab_details_with_tests.length > 0 ?
                          quotes.top_lab_details_with_tests.map(
                            (referrelFeeLab, key) => (
                              <tr
                                key={"_row_" + key}
                                style={{ backgroundColor: key % 2 === 0 ? 'white' : '#f1f8fe' }}
                              >
                                <td className="text-start" style={{
                                  backgroundColor: 'transparent !important',
                                  width: '200px',
                                  fontSize: '14px',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'normal',
                                  textAlign: 'left',
                                  display: 'block',
                                }}>
                                  {!this.state.user_id ? (
                                    <React.Fragment>
                                      {!this.state.user_id ? (
                                        <React.Fragment>
                                          <div style={{ background: 'transparent' }}>
                                            <Link
                                              to={
                                                this.props.match.params.guest_id
                                                  ? `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                                  : `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}`
                                              }
                                              className="text-dark"
                                              style={{ background: 'transparent' }}
                                            >
                                              <span className="text-primary" style={{ fontSize: "14px", display: 'block' }}>
                                                <b>{referrelFeeLab.name}</b>
                                              </span>    </Link>
                                            <div style={{ fontSize: "12px", background: 'transparent' }}>
                                              <b>{referrelFeeLab.type}</b>
                                            </div>
                                            <div>
                                              <StarRatings
                                                rating={referrelFeeLab.rating}
                                                starRatedColor="#F1B44C"
                                                starEmptyColor="#2D363F"
                                                numberOfStars={5}
                                                name="rating"
                                                starDimension="14px"
                                                starSpacing="3px"
                                              />
                                              {referrelFeeLab && referrelFeeLab.rating && (
    <p> {referrelFeeLab.rating}</p>
)}
                                            </div>
                                            
                                          </div>
                                        </React.Fragment>
                                      ) : null}

                                    </React.Fragment>
                                  ) : null}

                                  {(this.state.user_id) && (this.state.user_type === "CSR") && (this.state.user_type !== "b2bclient") && (
                                    <div>
                                      <Link
                                        to={
                                          this.props.match.params.guest_id
                                            ? `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                            : `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}`
                                        }
                                        className="text-dark"
                                      >
                                        <span className="text-primary" style={{ fontSize: "14px", display: 'block' }}>
                                          <b>{referrelFeeLab.name}</b>
                                        </span>
                                      </Link>
                                      <div style={{ fontSize: "12px" }}>
                                        <b>{referrelFeeLab.type}</b>
                                      </div>
                                      <div>
                                        <StarRatings
                                          rating={referrelFeeLab.rating}
                                          starRatedColor="#F1B44C"
                                          starEmptyColor="#2D363F"
                                          numberOfStars={5}
                                          name="rating"
                                          starDimension="14px"
                                          starSpacing="3px"
                                        />
                                        {referrelFeeLab && referrelFeeLab.rating && (
    <p> {referrelFeeLab.rating}</p>
)}
                                      </div>
                                      
                                    </div>
                                  )}

                                  {(this.state.user_id) && (this.state.user_type !== "CSR") && (this.state.user_type !== "b2bclient") && (
                                    <div>
                                      <Link
                                        to={
                                          this.props.match.params.guest_id
                                            ? `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                            : `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}`
                                        }
                                        className="text-dark"
                                      >
                                        <span className="text-primary" style={{ fontSize: "14px", display: 'block' }}>
                                          <b>{referrelFeeLab.name}</b>
                                        </span>
                                      </Link>
                                      <div style={{ fontSize: "12px" }}>
                                        <b>{referrelFeeLab.type}</b>
                                      </div>
                                      <div>
                                        <StarRatings
                                          rating={referrelFeeLab.rating}
                                          starRatedColor="#F1B44C"
                                          starEmptyColor="#2D363F"
                                          numberOfStars={5}
                                          name="rating"
                                          starDimension="14px"
                                          starSpacing="3px"
                                        />
                                        {referrelFeeLab && referrelFeeLab.rating && (
    <p> {referrelFeeLab.rating}</p>
)}
                                      </div>
                                      
                                    </div>
                                  )}

                                  {(this.state.user_id) && (this.state.user_type !== "CSR") && (this.state.user_type === "b2bclient") && (
                                    <div>
                                      <Link
                                        to={
                                          this.props.match.params.guest_id
                                            ? `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                            : `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}`
                                        }
                                        className="text-dark"
                                      >
                                        <span className="text-primary" style={{ fontSize: "14px", display: 'block' }}>
                                          <b>{referrelFeeLab.name}</b>
                                        </span>
                                      </Link>
                                      <div style={{ fontSize: "12px" }}>
                                        <b>{referrelFeeLab.type}</b>
                                      </div>
                                      <div>
                                        <StarRatings
                                          rating={referrelFeeLab.rating}
                                          starRatedColor="#F1B44C"
                                          starEmptyColor="#2D363F"
                                          numberOfStars={5}
                                          name="rating"
                                          starDimension="14px"
                                          starSpacing="3px"
                                        />
                                        {referrelFeeLab && referrelFeeLab.rating && (
    <p> {referrelFeeLab.rating}</p>
)}
                                      </div>
                                      
                                    </div>
                                  )}
                                </td>
                                <td className="text-start"
                                  style={{ whiteSpace: "pre-wrap" }}
                                >
                                  {!isEmpty(referrelFeeLab.offered_tests) &&
                                    referrelFeeLab.offered_tests.map(
                                      (offeredTest, index) => (
                                        <div key={index} style={{ background: 'transparent' }}>{offeredTest.test_name}</div>
                                      )
                                    )}
                                </td>
                                <td className="text-end">
                                  {!isEmpty(referrelFeeLab.offered_tests) &&
                                    referrelFeeLab.offered_tests.map(
                                      (offeredTest, index) => (
                                        <div key={index} style={{ background: 'transparent' }}>
                                          {" "}
                                          {offeredTest.duration_required}{" "}
                                          {offeredTest.duration_type}
                                        </div>
                                      )
                                    )}
                                </td>
                                <td className="text-end">
                                  {!isEmpty(referrelFeeLab.offered_tests) &&
                                    referrelFeeLab.offered_tests.map(
                                      (offeredTest, index) => (
                                        <div key={index} style={{ background: 'transparent' }}>
                                          {" "}
                                          {offeredTest.price
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </div>
                                      )
                                    )}
                                </td>
                                <td className="text-end">
                                  {!isEmpty(referrelFeeLab.offered_tests) &&
                                    referrelFeeLab.offered_tests.map((offeredTest, index) => (
                                      // Use a Fragment to avoid wrapping with a div
                                      <div key={index} style={{ background: 'transparent' }}>
                                        {((offeredTest.discount + (offeredTest.discount_by_labhazir || 0) + (offeredTest.test_discount || 0)) !== 0) ? (
                                          <span>
                                            {((offeredTest.discount + (offeredTest.discount_by_labhazir || 0) + (offeredTest.test_discount || 0)) * 100)} %
                                          </span>
                                        ) : (
                                          '--'
                                        )}
                                      </div>
                                    ))}
                                </td>

                                <td className="text-end">
                                  {referrelFeeLab.offered_tests
                                    .map((offeredTest, index) => {
                                      const discountByTest = offeredTest.discount || 0;
                                      const discountByLabhazir = offeredTest.discount_by_labhazir || 0;
                                      const totalDiscount = discountByTest + discountByLabhazir;
                                      const discountedPrice =
                                        offeredTest.price -
                                        (offeredTest.price * (totalDiscount * 100)) / 100;

                                      return (
                                        <div key={index} style={{ background: 'transparent', }}>
                                          {discountedPrice
                                            .toFixed(2)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </div>
                                      );
                                    })}
                                </td>
                                <td className="text-end py-2 pl-3 pr-4">
                                  <div className="text-danger" style={{ background: 'transparent', fontSize: "16px", fontWeight: "bold" }}>
                                    {referrelFeeLab.offered_tests
                                      .reduce((total, offeredTest) => {
                                        const discountByTest = offeredTest.discount || 0;
                                        const discountByLabhazir = offeredTest.discount_by_labhazir || 0;
                                        const totalDiscount = discountByTest + discountByLabhazir;
                                        const discountedPrice = (
                                          offeredTest.price -
                                          (offeredTest.price * (totalDiscount * 100)) / 100
                                        );
                                        return total + Number(discountedPrice);
                                      }, 0)
                                      .toFixed(2)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </div></td>

                                {/* <td className="text-center">
                                  <Button
                                    type="button"
                                    color="primary"
                                    className="btn mt-3 me-1 text-white bg-primary btn-outline-primary"
                                    onClick={() => {
                                      this.handleAddToCart(referrelFeeLab);
                                    }}
                                  >
                                    <i className="bx bx-cart me-2" /> Add to cart
                                  </Button>
                                </td> */}
                                <td className="text-center">
                                  {(() => {
                                    // Check if all offeredTest.id in this row are already in this.props.carts
                                    const areAllTestIdsInCart = referrelFeeLab.offered_tests.every(offeredTest =>
                                      this.props.carts.some(cartItem => cartItem.offered_test_id === offeredTest.id)
                                    );

                                    console.log("all present have or not", areAllTestIdsInCart);

                                    return (
                                      <Button
                                        type="button"
                                        color={areAllTestIdsInCart ? 'secondary' : 'primary'}
                                        className={`btn mt-3 me-1${areAllTestIdsInCart ? ' disabled' : ''}`}
                                        onClick={() => {
                                          const areAllTestIdsInCart = referrelFeeLab.offered_tests.every(offeredTest =>
                                            this.props.carts.some(cartItem => cartItem.test_name === offeredTest.test_name)
                                          );
                                          if (areAllTestIdsInCart) {
                                            alert("An item with the same name but from a different lab is already in the cart. Please remove the previous one first.");
                                          } else {
                                            this.handleAddToCart(referrelFeeLab);
                                          }
                                        }}
                                        disabled={areAllTestIdsInCart}
                                        style={{
                                          backgroundColor: 'primary', // Primary color
                                          borderColor: 'primary', // Primary color
                                          fontSize: '10px',
                                        }}
                                      >
                                        <i className="bx bx-cart me-2" /> {areAllTestIdsInCart ? 'Already Added' : 'Add to cart'}
                                      </Button>
                                    );
                                  })()}
                                </td>
                              </tr>
                            )
                          ) : (
                            <div className=" mt-4" >
                              <h4 className="text-primary" style={{ fontSize: "18px" }}>
                                &quot;Labhazir will only show labs that offer All the tests you&lsquo;ve selected.&quot;
                              </h4>

                            </div>
                          )}
                        {/* {isEmpty(quotes) && (
                          <Row style={{ background: 'transparent' }}>
                            <div className=" mt-4" >
                              <h4 className="text-primary" style={{ fontSize: "18px" }}>
                                &quot;Labhazir will only show labs that offer all the tests you&lsquo;ve selected.&quot;
                              </h4>
                            </div>
                          </Row>
                        )} */}
                      </Table>
                    </div>

                  ) : isFilterApplied3 ? (
                    <div className="table-responsive">
                      <Table className="table-nowrap">
                        <thead style={{ backgroundColor: "red" }}>
                          <tr >
                            <th className="text-start">Lab Name</th>
                            <th className="text-start">Test Name</th>
                            <th className="text-end">Reporting Time</th>
                            <th className="text-center">Price</th>
                            {/* <th className="text-center"> Total Price</th> */}
                            <th className="text-center"> Discount</th>
                            <th className="text-center"> Price after Discount</th>
                            <th className="text-center">
                              Net Payable
                            </th>
                            <th></th>
                          </tr>
                        </thead>
                        {!isEmpty(quotes) &&
                          Array.isArray(quotes.top_lab_details_with_tests) && quotes.top_lab_details_with_tests.length > 0 ?
                          quotes.top_lab_details_with_tests.map(
                            (referrelFeeLab, key) => (
                              <tr
                                key={"_row_" + key}
                                style={{ backgroundColor: key % 2 === 0 ? 'white' : '#f1f8fe' }}
                              >
                                <td className="text-start" style={{
                                  backgroundColor: 'transparent !important',
                                  width: '200px',
                                  fontSize: '14px',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'normal',
                                  textAlign: 'left',
                                  display: 'block',
                                }}>
                                  {!this.state.user_id ? (
                                    <React.Fragment>
                                      {!this.state.user_id ? (
                                        <React.Fragment>
                                          <div style={{ background: 'transparent' }}>
                                            <Link
                                              to={
                                                this.props.match.params.guest_id
                                                  ? `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                                  : `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}`
                                              }
                                              className="text-dark"
                                              style={{ background: 'transparent' }}
                                            >
                                              <span className="text-primary" style={{ fontSize: "14px", display: 'block' }}>
                                                <b>{referrelFeeLab.name}</b>
                                              </span>    </Link>
                                            <div style={{ fontSize: "12px", background: 'transparent' }}>
                                              <b>{referrelFeeLab.type}</b>
                                            </div>
                                            <div>
                                              <StarRatings
                                                rating={referrelFeeLab.rating}
                                                starRatedColor="#F1B44C"
                                                starEmptyColor="#2D363F"
                                                numberOfStars={5}
                                                name="rating"
                                                starDimension="14px"
                                                starSpacing="3px"
                                              />
                                              {referrelFeeLab && referrelFeeLab.rating && (
    <p> {referrelFeeLab.rating}</p>
)}
                                            </div>
                                            
                                          </div>
                                        </React.Fragment>
                                      ) : null}

                                    </React.Fragment>
                                  ) : null}

                                  {(this.state.user_id) && (this.state.user_type === "CSR") && (this.state.user_type !== "b2bclient") && (
                                    <div>
                                      <Link
                                        to={
                                          this.props.match.params.guest_id
                                            ? `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                            : `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}`
                                        }
                                        className="text-dark"
                                      >
                                        <span className="text-primary" style={{ fontSize: "14px", display: 'block' }}>
                                          <b>{referrelFeeLab.name}</b>
                                        </span>
                                      </Link>
                                      <div style={{ fontSize: "12px" }}>
                                        <b>{referrelFeeLab.type}</b>
                                      </div>
                                      <div>
                                        <StarRatings
                                          rating={referrelFeeLab.rating}
                                          starRatedColor="#F1B44C"
                                          starEmptyColor="#2D363F"
                                          numberOfStars={5}
                                          name="rating"
                                          starDimension="14px"
                                          starSpacing="3px"
                                        />
                                        {referrelFeeLab && referrelFeeLab.rating && (
    <p> {referrelFeeLab.rating}</p>
)}
                                      </div>
                                      
                                    </div>
                                  )}

                                  {(this.state.user_id) && (this.state.user_type !== "CSR") && (this.state.user_type !== "b2bclient") && (
                                    <div>
                                      <Link
                                        to={
                                          this.props.match.params.guest_id
                                            ? `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                            : `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}`
                                        }
                                        className="text-dark"
                                      >
                                        <span className="text-primary" style={{ fontSize: "14px", display: 'block' }}>
                                          <b>{referrelFeeLab.name}</b>
                                        </span>
                                      </Link>
                                      <div style={{ fontSize: "12px" }}>
                                        <b>{referrelFeeLab.type}</b>
                                      </div>
                                      <div>
                                        <StarRatings
                                          rating={referrelFeeLab.rating}
                                          starRatedColor="#F1B44C"
                                          starEmptyColor="#2D363F"
                                          numberOfStars={5}
                                          name="rating"
                                          starDimension="14px"
                                          starSpacing="3px"
                                        />
                                        {referrelFeeLab && referrelFeeLab.rating && (
    <p> {referrelFeeLab.rating}</p>
)}
                                      </div>
                                      
                                    </div>
                                  )}

                                  {(this.state.user_id) && (this.state.user_type !== "CSR") && (this.state.user_type === "b2bclient") && (
                                    <div>
                                      <Link
                                        to={
                                          this.props.match.params.guest_id
                                            ? `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                            : `/nearby-lab-detail/${referrelFeeLab.account_id}/${this.props.match.params.guest_id}`
                                        }
                                        className="text-dark"
                                      >
                                        <span className="text-primary" style={{ fontSize: "14px", display: 'block' }}>
                                          <b>{referrelFeeLab.name}</b>
                                        </span>
                                      </Link>
                                      <div style={{ fontSize: "12px" }}>
                                        <b>{referrelFeeLab.type}</b>
                                      </div>
                                      <div>
                                        <StarRatings
                                          rating={referrelFeeLab.rating}
                                          starRatedColor="#F1B44C"
                                          starEmptyColor="#2D363F"
                                          numberOfStars={5}
                                          name="rating"
                                          starDimension="14px"
                                          starSpacing="3px"
                                        />
                                        {referrelFeeLab && referrelFeeLab.rating && (
    <p> {referrelFeeLab.rating}</p>
)}
                                      </div>
                                      
                                    </div>
                                  )}
                                </td>
                                <td className="text-start"
                                  style={{ whiteSpace: "pre-wrap" }}
                                >
                                  {!isEmpty(referrelFeeLab.offered_tests) &&
                                    referrelFeeLab.offered_tests.map(
                                      (offeredTest, index) => (
                                        <div key={index} style={{ background: 'transparent' }}>{offeredTest.test_name}</div>
                                      )
                                    )}
                                </td>
                                <td className="text-end">
                                  {!isEmpty(referrelFeeLab.offered_tests) &&
                                    referrelFeeLab.offered_tests.map(
                                      (offeredTest, index) => (
                                        <div key={index} style={{ background: 'transparent' }}>
                                          {" "}
                                          {offeredTest.duration_required}{" "}
                                          {offeredTest.duration_type}
                                        </div>
                                      )
                                    )}
                                </td>
                                <td className="text-end">
                                  {!isEmpty(referrelFeeLab.offered_tests) &&
                                    referrelFeeLab.offered_tests.map(
                                      (offeredTest, index) => (
                                        <div key={index} style={{ background: 'transparent' }}>
                                          {" "}
                                          {offeredTest.price
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </div>
                                      )
                                    )}
                                </td>
                                <td className="text-end">
                                  {!isEmpty(referrelFeeLab.offered_tests) &&
                                    referrelFeeLab.offered_tests.map((offeredTest, index) => (
                                      // Use a Fragment to avoid wrapping with a div
                                      <div key={index} style={{ background: 'transparent' }}>
                                        {((offeredTest.discount + (offeredTest.discount_by_labhazir || 0) + (offeredTest.test_discount || 0)) !== 0) ? (
                                          <span>
                                            {((offeredTest.discount + (offeredTest.discount_by_labhazir || 0) + (offeredTest.test_discount || 0)) * 100)} %
                                          </span>
                                        ) : (
                                          '--'
                                        )}
                                      </div>
                                    ))}
                                </td>

                                <td className="text-end">
                                  {referrelFeeLab.offered_tests
                                    .map((offeredTest, index) => {
                                      const discountByTest = offeredTest.discount || 0;
                                      const discountByLabhazir = offeredTest.discount_by_labhazir || 0;
                                      const totalDiscount = discountByTest + discountByLabhazir;
                                      const discountedPrice =
                                        offeredTest.price -
                                        (offeredTest.price * (totalDiscount * 100)) / 100;

                                      return (
                                        <div key={index} style={{ background: 'transparent', }}>
                                          {discountedPrice
                                            .toFixed(2)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </div>
                                      );
                                    })}
                                </td>
                                <td className="text-end py-2 pl-3 pr-4">
                                  <div className="text-danger" style={{ background: 'transparent', fontSize: "16px", fontWeight: "bold" }}>
                                    {referrelFeeLab.offered_tests
                                      .reduce((total, offeredTest) => {
                                        const discountByTest = offeredTest.discount || 0;
                                        const discountByLabhazir = offeredTest.discount_by_labhazir || 0;
                                        const totalDiscount = discountByTest + discountByLabhazir;
                                        const discountedPrice = (
                                          offeredTest.price -
                                          (offeredTest.price * (totalDiscount * 100)) / 100
                                        );
                                        return total + Number(discountedPrice);
                                      }, 0)
                                      .toFixed(2)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </div></td>

                                {/* <td className="text-center">
                                  <Button
                                    type="button"
                                    color="primary"
                                    className="btn mt-3 me-1 text-white bg-primary btn-outline-primary"
                                    onClick={() => {
                                      this.handleAddToCart(referrelFeeLab);
                                    }}
                                  >
                                    <i className="bx bx-cart me-2" /> Add to cart
                                  </Button>
                                </td> */}
                                <td className="text-center">
                                  {(() => {
                                    // Check if all offeredTest.id in this row are already in this.props.carts
                                    const areAllTestIdsInCart = referrelFeeLab.offered_tests.every(offeredTest =>
                                      this.props.carts.some(cartItem => cartItem.offered_test_id === offeredTest.id)
                                    );

                                    console.log("all present have or not", areAllTestIdsInCart);

                                    return (
                                      <Button
                                        type="button"
                                        color={areAllTestIdsInCart ? 'secondary' : 'primary'}
                                        className={`btn mt-3 me-1${areAllTestIdsInCart ? ' disabled' : ''}`}
                                        onClick={() => {
                                          const areAllTestIdsInCart = referrelFeeLab.offered_tests.every(offeredTest =>
                                            this.props.carts.some(cartItem => cartItem.test_name === offeredTest.test_name)
                                          );
                                          if (areAllTestIdsInCart) {
                                            alert("An item with the same name but from a different lab is already in the cart. Please remove the previous one first.");
                                          } else {
                                            this.handleAddToCart(referrelFeeLab);
                                          }
                                        }}
                                        disabled={areAllTestIdsInCart}
                                        style={{
                                          backgroundColor: 'primary', // Primary color
                                          borderColor: 'primary', // Primary color
                                          fontSize: '10px',
                                        }}
                                      >
                                        <i className="bx bx-cart me-2" /> {areAllTestIdsInCart ? 'Already Added' : 'Add to cart'}
                                      </Button>
                                    );
                                  })()}
                                </td>
                              </tr>
                            )
                          ) : (
                            <div className=" mt-4" >
                              <h4 className="text-primary" style={{ fontSize: "18px" }}>
                                &quot;Labhazir will only show labs that offer All the tests you&lsquo;ve selected.&quot;
                              </h4>

                            </div>
                          )}
                        {/* {isEmpty(quotes) && (
                          <Row style={{ background: 'transparent' }}>
                            <div className=" mt-4" >
                              <h4 className="text-primary" style={{ fontSize: "18px" }}>
                                &quot;Labhazir will only show labs that offer all the tests you&lsquo;ve selected.&quot;
                              </h4>
                            </div>
                          </Row>
                        )} */}
                      </Table>
                    </div>

                  ) : (
                    <div className="table-responsive">
                      <Table className="table-nowrap">
                        <thead style={{ backgroundColor: "red" }}>
                          <tr >
                            <th className="text-start">Lab Name</th>
                            <th className="text-start">Test Name</th>
                            <th className="text-end">Reporting Time</th>
                            <th className="text-center">Price</th>
                            {/* <th className="text-center"> Total Price</th> */}
                            <th className="text-center"> Discount (Rs)</th>
                            <th className="text-center"> Price after Discount</th>
                            <th className="text-center">
                              Net Payable
                            </th>
                            <th></th>
                          </tr>
                        </thead>
                        <div className="mt-4">
                          <h4 className="text-primary" style={{ fontSize: "18px" }}>
                            Select Your Location or City and Test Names to book an appointment.
                          </h4>
                        </div>
                      </Table>
                    </div>
                  )}

                </CardBody>
              </Card>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

MedicalTestList.propTypes = {
  match: PropTypes.object,
  location: any,
  onlyMedicalTestList: PropTypes.array,
  className: PropTypes.any,
  menuOpen: PropTypes.any,
  quotes: PropTypes.array,
  onGetQuotes: PropTypes.func,
  onGetonlyMedicalTestList: PropTypes.func,
  onGetTerritoriesList: PropTypes.func,
  territoriesList: PropTypes.array,
  onAddToCart: PropTypes.func,
  success: PropTypes.any,
  error: PropTypes.any,
  carts: PropTypes.any,
  onGetCarts: PropTypes.func,
};
const mapStateToProps = ({
  onlyMedicalTestList,
  territoriesList,
  quotes,
  carts,
}) => ({
  onlyMedicalTestList: onlyMedicalTestList.onlyMedicalTestList,
  territoriesList: territoriesList.territoriesList,
  quotes: quotes.quotes,
  success: carts.success,
  error: carts.error,
  carts: carts.carts,

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetonlyMedicalTestList: () => dispatch(onlyMedicalTestList()),
  onGetTerritoriesList: id => dispatch(getTerritoriesList(id)),
  onGetQuotes: (city_id, test_id, search_type, address, longitude, latitude, km, locationAccessAllowed) => dispatch(getQuotes(city_id, test_id, search_type, address, longitude, latitude, km, locationAccessAllowed)),
  onAddToCart: (cart, id) => dispatch(addToCart(cart, id)),
  onGetCarts: id => dispatch(getCarts(id)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MedicalTestList));