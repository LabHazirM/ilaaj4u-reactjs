import React, { Component } from "react";
import PropTypes from "prop-types";
// import Select from "react-select";
import { Formik, Field, Form } from "formik";
import ScrollButton from "components/Common/Scrollbutton";
import * as Yup from "yup";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { Redirect, Link, withRouter } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Collapse } from "reactstrap";
import classname from "classnames";
import logo from "../../../assets/images/logo.svg";
import logoLight from "../../../assets/images/logo-light.png";
import logoLightSvg from "../../../assets/images/logo-light.svg";
import Select, { components } from "react-select";
import Tooltip from "@material-ui/core/Tooltip";

//i18n
import { withTranslation } from "react-i18next";
import "../../../components/HorizontalLayout/horizontal-navbar.scss";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Container,
  Button,
  Input,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
} from "reactstrap";

import { isEmpty, map, size } from "lodash";

//Import Star Ratings
import StarRatings from "react-star-ratings";

// RangeSlider
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

//Import data
import { productsData } from "common/data";
import { getPatientProfile } from "store/labmarket/actions";

//Import actions
import { getNearbyLabs, getAdvLive } from "store/labmarket/actions";
import { any } from "prop-types";
import "./nearbylabs.scss";

import { CITIES } from "helpers/global_variables_helper";
import { getTerritoriesList } from "store/territories-list/actions";
import { getLabNamesList } from "store/lab-names/actions";

import offeredTestsList from "pages/OfferedTests/offered-tests-list";

function formatTime(timeString, labId) {
  if (!timeString || typeof timeString !== "string") {
    console.warn(`Invalid time for lab ID ${labId}:`, timeString);
    return "Invalid Time";
  }

  try {
    const [hours, minutes] = timeString.split(":");
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes), 0);

    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Karachi",
    });
  } catch (error) {
    console.error(`Error formatting time for lab ID ${labId}:`, timeString, error);
    return "Invalid Time";
  }
}

class NearbyLabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      user_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
      patient_name: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).patient_name
        : "",
      position: "right",
      ratingvalues: [],
      locationAccessAllowed: "",
      corporatepatient: "",
      nearbyLabs: [],
      patientProfile: [],
      advLives: [],
      territoriesList: [],
      labNamesList: [],
      selectedLabName: "", // State to store the selected lab name
      filteredLabs: [], // State to store the filtered labs
      labNameInput: "", // Store the lab name input by the user
      filteredLabNames: [],
      name: "",
      advLive: "",
      activeTab: "1",
      address: "",
      search_type: "",
      city: "",
      latitude: "",
      km: "30",
      LabType: "",
      longitude: "",
      location: "",
      currentLatitude: "",
      currentLongitude: "",
      discountData: [],
      loading: true, // Add loading state property
      filters: {
        discount: [],
        price: { min: 0, max: 500 },
      },
      page: 1,
      totalPage: 5, //replace this with total pages of data
    };
    this.toggleTab = this.toggleTab.bind(this);
    this.onSelectRating = this.onSelectRating.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
    console.log(
      "yaha ani chahi hai uuid",
      this.props.match.params.uuid,
      this.props.match.params.guest_id,
      this.props.match.params.filnalurl
    );
    console.log(this.state.user_type);
  }

  componentDidMount() {
    // Load nearbyLabs data from local storage when the component mounts
    const nearbyLabsData = localStorage.getItem("nearbyLabs");
    if (nearbyLabsData) {
      try {
        const parsedData = JSON.parse(nearbyLabsData);
        this.setState({ nearbyLabs: parsedData });
      } catch (error) {
        console.error("Failed to parse nearbyLabs data from local storage", error);
      }
    }

    // Add event listener to save nearbyLabs data to local storage before the window unloads
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("nearbyLabs", JSON.stringify(this.state.nearbyLabs));
    });

    const { onGetPatientProfile } = this.props;

    // Assuming onGetPatientProfile is synchronous
    console.log(
      "this is patient profile",
      onGetPatientProfile(this.state.user_id)
    );

    // Now you can safely access patientProfile from props
    const { patientProfile } = this.props;
    const { onGetNearbyLabs } = this.props;
    const { territoriesList, onGetTerritoriesList } = this.props;
    if (territoriesList && !territoriesList.length) {
      console.log(onGetTerritoriesList(this.state.user_id));
    }
    const { labNamesList, onGetLabNamesList } = this.props;

    if (labNamesList && !labNamesList.length) {
      console.log(onGetLabNamesList(this.state.user_id));
    }
    let matchingMenuItem = null;
    const ul = document.getElementById("navigation");
    const items = ul.getElementsByTagName("a");
    for (let i = 0; i < items.length; ++i) {
      if (this.props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }

    let latitude;
    let longitude;

    const url = window.location.href;
    const queryString = url.substring(url.indexOf("&") + 1);
    const params = new URLSearchParams(queryString);
    console.log("print params in app", url, queryString, params);

    const latitudeFromUrl = params.get("lat");
    const longitudeFromUrl = params.get("lon");

    console.log("Latitude:", latitudeFromUrl);
    console.log("Longitude:", longitudeFromUrl);

    if (latitudeFromUrl && longitudeFromUrl) {
      // Use latitude and longitude from URL
      latitude = parseFloat(latitudeFromUrl);
      longitude = parseFloat(longitudeFromUrl);
      console.log("print lat log in app", latitude, longitude);

      // Call the dependent code here or pass the latitude and longitude values as arguments
      this.handleLocationUpdate(latitude, longitude);
    } else {
      if (navigator.geolocation) {
        // const nearbyLabsLocationDetails = {
        //   latitude,
        //   longitude,
        //   search_type: this.state.search_type,
        //   address: this.state.address,
        //   city: this.state.city,
        //   km: this.state.km,
        //   LabType: this.state.LabType,
        //   name: this.state.name,
        //   locationAccessAllowed: this.state.locationAccessAllowed,
        //   corporatepatient: this.props.patientProfile ? this.props.patientProfile.corporate_id : undefined,
        // };
        // // Call onGetNearbyLabs before prompting for geolocation
        // onGetNearbyLabs(nearbyLabsLocationDetails);
        // setTimeout(() => {
        //   this.setState({ nearbyLabs: this.props.nearbyLabs });
        // }, 500);
        navigator.geolocation.getCurrentPosition(
          position => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            console.log("web", latitude, longitude);

            this.setState({ currentLatitude: latitude });
            this.setState({ currentLongitude: longitude });
            this.setState({ locationAccessAllowed: true });
            this.setState({ search_type: "Current Location" });
            this.setState({ LabType: "Main" });

            // near by labs
            if (this.state.user_id || this.state.user_type === "CSR") {
              const nearbyLabsLocationDetails = {
                latitude,
                longitude,
                search_type: this.state.search_type,
                address: this.state.address,
                city: this.state.city,
                km: this.state.km,
                LabType: this.state.LabType,
                name: this.state.name,
                locationAccessAllowed: this.state.locationAccessAllowed,
                corporatepatient: this.props.patientProfile
                  ? this.props.patientProfile.corporate_id
                  : undefined,
              };
              console.log(window.location.href);
              if (latitude && longitude) {
                onGetNearbyLabs(nearbyLabsLocationDetails);

                this.setState({ nearbyLabs: [] });
                setTimeout(() => {
                  this.setState({ nearbyLabs: this.props.nearbyLabs });
                }, 500);
              }
            }
            // near by labs
            if (this.state.user_id || this.state.user_type === "b2bclient") {
              const nearbyLabsLocationDetails = {
                latitude,
                longitude,
                search_type: this.state.search_type,
                address: this.state.address,
                city: this.state.city,
                km: this.state.km,
                LabType: this.state.LabType,
                name: this.state.name,
                locationAccessAllowed: this.state.locationAccessAllowed,
                corporatepatient: this.props.patientProfile
                  ? this.props.patientProfile.corporate_id
                  : undefined,
              };
              if (latitude && longitude) {
                onGetNearbyLabs(nearbyLabsLocationDetails);
                this.setState({ nearbyLabs: [] });

                setTimeout(() => {
                  this.setState({ nearbyLabs: this.props.nearbyLabs });
                }, 500);
              }
            }

            if (!this.state.user_id || this.props.match.params.guest_id) {
              const nearbyLabsLocationDetails = {
                latitude,
                longitude,
                search_type: this.state.search_type,
                address: this.state.address,
                city: this.state.city,
                km: this.state.km,
                LabType: this.state.LabType,
                name: this.state.name,
                locationAccessAllowed: this.state.locationAccessAllowed,
                corporatepatient: this.props.patientProfile
                  ? this.props.patientProfile.corporate_id
                  : undefined,
              };
              console.log(window.location.href);
              if (latitude && longitude) {
                onGetNearbyLabs(nearbyLabsLocationDetails);
                this.setState({ nearbyLabs: [] });

                setTimeout(() => {
                  this.setState({ nearbyLabs: this.props.nearbyLabs });
                }, 500);
              }
            }
            if (
              this.state.user_id &&
              this.props.patientProfile &&
              this.props.patientProfile.is_assosiatewith_anycorporate &&
              this.props.patientProfile.employee_id_card
            ) {
              const nearbyLabsLocationDetails = {
                latitude,
                longitude,
                search_type: this.state.search_type,
                address: this.state.address,
                city: this.state.city,
                km: this.state.km,
                LabType: this.state.LabType,
                locationAccessAllowed: this.state.locationAccessAllowed,
                corporatepatient: this.props.patientProfile
                  ? this.props.patientProfile.corporate_id
                  : undefined,
                name: this.state.name,
              };
              if (latitude && longitude) {
                onGetNearbyLabs(nearbyLabsLocationDetails);
                this.setState({ nearbyLabs: [] });

                setTimeout(() => {
                  this.setState({ nearbyLabs: this.props.nearbyLabs });
                }, 500);
              }
            }
            if (
              this.state.user_id &&
              this.props.patientProfile &&
              !this.props.patientProfile.is_assosiatewith_anycorporate &&
              !this.props.patientProfile.employee_id_card
            ) {
              const nearbyLabsLocationDetails = {
                latitude,
                longitude,
                search_type: this.state.search_type,
                address: this.state.address,
                city: this.state.city,
                km: this.state.km,
                LabType: this.state.LabType,
                locationAccessAllowed: this.state.locationAccessAllowed,
                corporatepatient: this.props.patientProfile
                  ? this.props.patientProfile.corporate_id
                  : undefined,
                name: this.state.name,
              };
              if (latitude && longitude) {
                onGetNearbyLabs(nearbyLabsLocationDetails);
                this.setState({ nearbyLabs: [] });

                setTimeout(() => {
                  this.setState({ nearbyLabs: this.props.nearbyLabs });
                }, 500);
              }
            }
          },
          () => {
            this.setState({ latitude: null, longitude: null });
            // near by labs
            if (
              (this.state.user_id || this.state.user_type === "CSR") &&
              this.props.match.params.guest_id
            ) {
              const nearbyLabsLocationDetails = {
                latitude,
                longitude,
                search_type: this.state.search_type,
                address: this.state.address,
                city: this.state.city,
                km: this.state.km,
                LabType: this.state.LabType,
                name: this.state.name,
                locationAccessAllowed: this.state.locationAccessAllowed,
                corporatepatient: this.props.patientProfile
                  ? this.props.patientProfile.corporate_id
                  : undefined,
              };
              console.log(window.location.href);
              if (latitude && longitude) {
                onGetNearbyLabs(nearbyLabsLocationDetails);
                this.setState({ nearbyLabs: [] });

                setTimeout(() => {
                  this.setState({ nearbyLabs: this.props.nearbyLabs });
                }, 500);
              }
            }

            // near by labs
            if (this.state.user_id || this.state.user_type === "b2bclient") {
              const nearbyLabsLocationDetails = {
                latitude,
                longitude,
                search_type: this.state.search_type,
                address: this.state.address,
                city: this.state.city,
                km: this.state.km,
                LabType: this.state.LabType,
                locationAccessAllowed: this.state.locationAccessAllowed,
                corporatepatient: this.props.patientProfile
                  ? this.props.patientProfile.corporate_id
                  : undefined,
                name: this.state.name,
              };
              if (latitude && longitude) {
                onGetNearbyLabs(nearbyLabsLocationDetails);
                this.setState({ nearbyLabs: [] });

                setTimeout(() => {
                  this.setState({ nearbyLabs: this.props.nearbyLabs });
                }, 500);
              }
            }

            if (!this.state.user_id && this.props.match.params.guest_id) {
              const nearbyLabsLocationDetails = {
                latitude,
                longitude,
                search_type: this.state.search_type,
                address: this.state.address,
                city: this.state.city,
                km: this.state.km,
                LabType: this.state.LabType,
                name: this.state.name,
                locationAccessAllowed: this.state.locationAccessAllowed,
                corporatepatient: this.props.patientProfile
                  ? this.props.patientProfile.corporate_id
                  : undefined,
              };
              console.log(window.location.href);
              onGetNearbyLabs(nearbyLabsLocationDetails);
              this.setState({ nearbyLabs: [] });

              setTimeout(() => {
                this.setState({ nearbyLabs: this.props.nearbyLabs });
              }, 500);
            }
            if (this.state.user_id) {
              const nearbyLabsLocationDetails = {
                latitude,
                longitude,
                search_type: this.state.search_type,
                address: this.state.address,
                city: this.state.city,
                km: this.state.km,
                LabType: this.state.LabType,
                locationAccessAllowed: this.state.locationAccessAllowed,
                corporatepatient: this.props.patientProfile
                  ? this.props.patientProfile.corporate_id
                  : undefined,
                name: this.state.name,
              };
              onGetNearbyLabs(nearbyLabsLocationDetails);
              this.setState({ nearbyLabs: [] });

              setTimeout(() => {
                this.setState({ nearbyLabs: this.props.nearbyLabs });
              }, 500);
            }
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

  componentWillUnmount() {
    // Remove the event listener before the component unmounts
    window.removeEventListener("beforeunload", () => {
      localStorage.setItem("nearbyLabs", JSON.stringify(this.state.nearbyLabs));
    });
  }

  handleLocationUpdate(latitude, longitude) {
    const { onGetNearbyLabs } = this.props;
    // const guest_id = uuidv4();
    // console.log("uuid in nearby lab:",this.state.user_id)

    setTimeout(() => {
      this.setState({ currentLatitude: latitude });
      this.setState({ currentLongitude: longitude });
      // this.setState({ guest_id: guest_id });
      var locationDetails = {
        latitude: this.state.currentLatitude,
        longitude: this.state.currentLongitude,
        search_type: this.state.search_type,
        address: this.state.address,
        city: this.state.city,
        km: this.state.km,
        LabType: this.state.LabType,
        name: this.state.name,
        locationAccessAllowed: this.state.locationAccessAllowed,
        corporatepatient: this.props.patientProfile
          ? this.props.patientProfile.corporate_id
          : undefined,
      };
      if (this.state.currentLatitude && this.state.currentLongitude) {
        onGetNearbyLabs(locationDetails);
        // Clear previous quotes
        this.setState({ nearbyLabs: [] });
        setTimeout(() => {
          this.setState({ nearbyLabs: this.props.nearbyLabs });
          // console.log("guest id in near by labs and backend;", { nearbyLabs: this.props.nearbyLabs, guest_id })
        }, 1000);
      }
    }, 1000);
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { nearbyLabs } = this.props;
    if (
      isEmpty(prevProps.nearbyLabs) &&
      !isEmpty(nearbyLabs) &&
      size(nearbyLabs) !== size(prevProps.nearbyLabs)
    ) {
      this.setState({ nearbyLabs });
    }
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };

  onSelectDiscount = e => {
    const { value, checked } = e.target;
    const {
      filters,
      filters: { discount },
    } = this.state;
    this.setState(
      {
        filters: {
          ...filters,
          discount: discount.find(item => item === value)
            ? discount.filter(item => item !== value)
            : [...discount, value],
        },
      },
      () => {
        this.onFilterProducts(value, checked);
      }
    );
  };

  onFilterProducts = (value, checked) => {
    const {
      filters: { discount },
    } = this.state;
    let filteredProducts = productsData;
    if (!!checked && parseInt(value) === 0) {
      filteredProducts = productsData.filter(
        nearbyLab => nearbyLab.offer < 100
      );
    } else if (discount.length > 0) {
      filteredProducts = productsData.filter(
        nearbyLab => nearbyLab.offer >= Math.min(...discount)
      );
    }
    this.setState({ nearbyLabs: filteredProducts });
  };

  onUpdate = (render, handle, value) => {
    this.setState({
      nearbyLabs: productsData.filter(
        nearbyLab =>
          nearbyLab.newPrice >= value[0] && nearbyLab.newPrice <= value[1]
      ),
    });
  };

  /*
  on change rating checkbox method
  */
  onChangeRating = value => {
    this.setState({
      nearbyLabs: productsData.filter(nearbyLab => nearbyLab.rating >= value),
    });

    var modifiedRating = [...this.state.ratingvalues];
    modifiedRating.push(value);
    this.setState({ ratingvalues: modifiedRating });
  };

  onSelectRating = value => {
    this.setState({
      nearbyLabs: productsData.filter(nearbyLab => nearbyLab.rating === value),
    });
  };

  onUncheckMark = value => {
    var modifiedRating = [...this.state.ratingvalues];
    const modifiedData = (modifiedRating || []).filter(x => x !== value);
    /*
    find min values
    */
    var filteredProducts = productsData;
    if (modifiedData && modifiedData.length && value !== 1) {
      var minValue = Math.min(...modifiedData);
      if (minValue && minValue !== Infinity) {
        filteredProducts = productsData.filter(
          nearbyLab => nearbyLab.rating >= minValue
        );

        this.setState({ ratingvalues: modifiedData });
      }
    } else {
      filteredProducts = productsData;
    }
    this.setState({ nearbyLabs: filteredProducts });
  };

  handlePageClick = page => {
    this.setState({ page });
  };

  onChangeAddress = e => {
    const { onGetNearbyLabs } = this.props;

    // Apply that city's latitude and longitude as city bound so that we see addresses of that city only
    var cityBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(this.state.latitude, this.state.longitude)
    );

    // Initialize AutocompleteService
    const autocompleteService = new google.maps.places.AutocompleteService();

    // Call AutocompleteService to get place predictions
    autocompleteService.getPlacePredictions(
      {
        input: e.target.value,
        bounds: cityBounds,
        types: ["geocode", "establishment"],
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Filter predictions to include only those inside Pakistan
          const pakistanPredictions = predictions.filter(prediction => {
            return (
              prediction.structured_formatting.main_text_matched_substrings.some(
                match => match.offset === 0
              ) && prediction.terms.some(term => term.value === "Pakistan")
            );
          });

          // Handle predictions, e.g., update the state or perform further actions
          const locationDetails = {
            // Extract relevant details from the first prediction
            latitude:
              pakistanPredictions.length > 0
                ? pakistanPredictions[0].geometry.location.lat()
                : "",
            longitude:
              pakistanPredictions.length > 0
                ? pakistanPredictions[0].geometry.location.lng()
                : "",
            search_type: this.state.search_type,
            address: e.target.value,
            city: this.state.city,
            LabType: this.state.LabType,
            km: this.state.km,
            name: this.state.name,
            locationAccessAllowed: this.state.locationAccessAllowed,
            corporatepatient: this.props.patientProfile
              ? this.props.patientProfile.corporate_id
              : undefined,
          };

          // Call the action to get nearby labs
          onGetNearbyLabs(locationDetails);

  //         this.setState({ nearbyLabs: [] });

          // Update state after a delay (if needed)
          setTimeout(() => {
            this.setState({ nearbyLabs: this.props.nearbyLabs });
          }, 1000);
        } else {
          console.error("AutocompleteService failed with status:", status);
        }
      }
    );
  };

  onChangeSearchType = async e => {
    this.setState({ search_type: e.target.value });

    // Call nearby tests API only if the search type changes to current location
    if (e.target.value === "Current Location") {
      this.setState({ city: "" });
      this.setState({ address: "" });

      // Check if the geolocation API is supported
      if ("geolocation" in navigator) {
        try {
          const locationPermission = await navigator.permissions.query({
            name: "geolocation",
          });

          if (
            locationPermission.state === "denied" &&
            !this.state.locationAccessAllowed
          ) {
            // Location access is denied
            // Show the PatientModal only when the user explicitly clicks on "Current Location"
            this.setState({ PatientModal: true });
          } else {
            // Location access is prompted, ask the user for permission
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            var data = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              search_type: e.target.value,
              address: this.state.address,
              city: this.state.city,
              test_name: this.state.test_name,
              LabType: this.state.LabType,
              km: this.state.km,
              page: this.state.page,
              name: this.state.name,
              locationAccessAllowed: this.state.locationAccessAllowed,
              corporatepatient: this.props.patientProfile
                ? this.props.patientProfile.corporate_id
                : undefined,
            };

            const { onGetNearbyLabs } = this.props;
            onGetNearbyLabs(data);

            this.setState({ nearbyLabs: [] });

            setTimeout(() => {
              this.setState({
                nearbyLabs: this.props.nearbyLabs,
                locationAccessAllowed: true,
              });
            }, 1000);
          }
        } catch (error) {
          console.error("Error checking location permission:", error);
        }
      } else {
        // Geolocation API is not supported, show an error message
        this.setState({ PatientModal: true }); // Show the modal for error
      }
    }
  };

  onChangeKm = e => {
    this.setState({ km: e.target.value });

    // Call nearby labs API only if the search type changes to current location

    const { onGetNearbyLabs } = this.props;
    // const { onGetAdvLive } = this.props;
    // const { onGetRegionWiseAdvertisement } = this.props;

    var locationDetails = {
      latitude: this.state.currentLatitude,
      longitude: this.state.currentLongitude,
      search_type: this.state.search_type,
      km: e.target.value,
      LabType: this.state.LabType,
      address: this.state.address,
      city: this.state.city,
      name: this.state.name,
      locationAccessAllowed: this.state.locationAccessAllowed,
      corporatepatient: this.props.patientProfile
        ? this.props.patientProfile.corporate_id
        : undefined,
    };
    // region wise advertisement
    onGetNearbyLabs(locationDetails);
    // onGetAdvLive(locationDetails);
    // onGetRegionWiseAdvertisement(locationDetails);
    this.setState({ nearbyLabs: [] });

    setTimeout(() => {
      this.setState({ nearbyLabs: this.props.nearbyLabs });
    }, 1000);
  };
  clearSearch = () => {
    this.setState({
      selectedLab: null,
      name: null, // Clear the 'name' property as well if needed
    });
  };

  onChangeLabName = selectedOption => {
    // Check if selectedOption is not null before accessing its properties
    if (selectedOption && selectedOption.value) {
      this.setState({ name: selectedOption.value });
    } else {
      // Handle the case where selectedOption is null or doesn't have a value property
      this.setState({ name: "" }); // Set the name to an appropriate default value or leave it empty
    }

    // Call nearby labs API only if the search type changes to current location

    const { onGetNearbyLabs } = this.props;
    // const { onGetAdvLive } = this.props;
    // const { onGetRegionWiseAdvertisement } = this.props;

    var locationDetails = {
      latitude: this.state.currentLatitude,
      longitude: this.state.currentLongitude,
      search_type: this.state.search_type,
      name: selectedOption && selectedOption.value ? selectedOption.value : "", // Check if selectedOption is not null and has a value property
      LabType: this.state.LabType,
      km: this.state.km,
      address: this.state.address,
      city: this.state.city,
      locationAccessAllowed: this.state.locationAccessAllowed,
      corporatepatient: this.props.patientProfile
        ? this.props.patientProfile.corporate_id
        : undefined,
    };
    // region wise advertisement
    onGetNearbyLabs(locationDetails);
    // onGetAdvLive(locationDetails);
    // onGetRegionWiseAdvertisement(locationDetails);
    this.setState({ nearbyLabs: [] });

    setTimeout(() => {
      this.setState({ nearbyLabs: this.props.nearbyLabs });
    }, 1000);
  };
  onChangeType = e => {
    this.setState({ LabType: e.target.value });

    // Call nearby labs API only if the search type changes to current location

    const { onGetNearbyLabs } = this.props;
    // const { onGetAdvLive } = this.props;
    // const { onGetRegionWiseAdvertisement } = this.props;

    var locationDetails = {
      latitude: this.state.currentLatitude,
      longitude: this.state.currentLongitude,
      search_type: this.state.search_type,
      LabType: e.target.value,
      km: this.state.km,
      address: this.state.address,
      city: this.state.city,
      name: this.state.name,
      locationAccessAllowed: this.state.locationAccessAllowed,
      corporatepatient: this.props.patientProfile
        ? this.props.patientProfile.corporate_id
        : undefined,
    };
    // region wise advertisement
    onGetNearbyLabs(locationDetails);
    // onGetAdvLive(locationDetails);
    // onGetRegionWiseAdvertisement(locationDetails);
    this.setState({ nearbyLabs: [] });

    setTimeout(() => {
      this.setState({ nearbyLabs: this.props.nearbyLabs });
    }, 1000);
  };

  onChangeCity = selectedGroup => {
    this.setState({ city: selectedGroup.value });

    const { onGetNearbyLabs } = this.props;

    var locationDetails = {
      latitude: "",
      longitude: "",
      search_type: this.state.search_type,
      address: this.state.address,
      city: selectedGroup.value,
      LabType: this.state.LabType,
      km: this.state.km,
      name: this.state.name,
      locationAccessAllowed: this.state.locationAccessAllowed,
      corporatepatient: this.props.patientProfile
        ? this.props.patientProfile.corporate_id
        : undefined,
    };

    onGetNearbyLabs(locationDetails);

    this.setState({ nearbyLabs: [] });

    setTimeout(() => {
      this.setState({ nearbyLabs: this.props.nearbyLabs });
    }, 1000);

    var latitude = "";
    var longitude = "";

    setTimeout(() => {
      var geocoder = new google.maps.Geocoder();

      // Concatenate city selected with Pakistan, so that it can be set as proper address
      var address = selectedGroup.value + ", Pakistan";

      // Using geocoder search address and get its latitude and longitude
      geocoder.geocode({ address: address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          latitude = results[0].geometry.location.lat();
          longitude = results[0].geometry.location.lng();
        }
      });

      // Set the values of simple variables to the state variables of latitude and longitude
      // so that it can be used outside of this function
      setTimeout(() => {
        this.setState({ latitude: latitude });
        this.setState({ longitude: longitude });
      }, 1000);
    }, 1000);
  };

  activateParentDropdown = item => {
    item.classList.add("active");
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add("active"); // li
      const parent2 = parent.parentElement;
      parent2.classList.add("active"); // li
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add("active"); // li
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add("active"); // li
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add("active"); // li
            const parent6 = parent5.parentElement;
            if (parent6) {
              parent6.classList.add("active"); // li
            }
          }
        }
      }
    }
    return false;
  };
  shouldHighlightTestsLink() {
    const { location } = this.props;
    const currentURL = location.pathname;

    // Check if the URL contains "nearby-test"
    return currentURL.includes("/labs");
  }

  render() {
    const isSmallScreen = window.innerWidth < 490;
    const { patientProfile } = this.props;
    console.log(
      "there is patient profile and yes and not",
      this.props.patientProfile
    );

    const { search_type } = this.state;
    let borderColor = "2px solid blue"; // Default border color

    // Check the selected option and update border color accordingly
    if (search_type === "Current Location") {
      borderColor = "2px solid red"; // Change to the desired color
    }
    if (search_type === "City") {
      borderColor = "2px solid green"; // Change to the desired color
    }
    if (search_type === "Custom Address") {
      borderColor = "2px solid yellow"; // Change to the desired color
    }

    const ClearIndicator = props => {
      return (
        <components.ClearIndicator {...props}>
          <span onClick={props.clearValue}>X</span>
        </components.ClearIndicator>
      );
    };

    const isTestsLinkHighlighted = this.shouldHighlightTestsLink();

    const linkStyles = {
      color: isTestsLinkHighlighted ? "black" : "black", // Text color
      // backgroundColor: isTestsLinkHighlighted ? '#ffcc00' : 'transparent', // Background color
      fontWeight: isTestsLinkHighlighted ? "bold" : "normal",
    };

    const { labNameInput, filteredLabNames } = this.state;
    const { history } = this.props;
    const { discountData, nearbyLabs, page, totalPage } = this.state;
    // const labNames = generateLabNames(nearbyLabs);

    const cityList = [];
    for (let i = 0; i < this.props.territoriesList.length; i++) {
      cityList.push({
        label: this.props.territoriesList[i].city,
        value: this.props.territoriesList[i].city,
      });
    }
    const labNames = [];
    for (let i = 0; i < this.props.labNamesList.length; i++) {
      labNames.push({
        label: this.props.labNamesList[i].name,
        value: this.props.labNamesList[i].name,
      });
    }
    const closeModal = () => {
      this.setState({ PatientModal: false });
      this.setState({ AddressModal: false });
    };
    const { loading } = this.state;

    return (
      <React.Fragment>
        {this.props.patientProfile &&
        !this.props.patientProfile.corporate_id &&
        this.props.patientProfile.is_assosiatewith_anycorporate == false ? (
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
                          <span className="pt-4 font-size-12">Book a Test</span>
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
                          <span
                            className="pt-4 font-size-12"
                            style={linkStyles}
                          >
                            Labs
                          </span>
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
                      {/* <li className="nav-item">
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
                      {/* </Link>
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
                            <span className="pt-4 font-size-12">
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
                            <span className="pt-4 font-size-12">
                              Book a Test
                            </span>
                          </Link>
                        </li>
                      ) : null}
                      {this.props.match.params.filnalurl &&
                      this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/labs/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                                : `/labs/${this.props.match.params.filnalurl}/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span
                              className="pt-4 font-size-12"
                              style={linkStyles}
                            >
                              Labs
                            </span>
                          </Link>
                        </li>
                      ) : !this.props.match.params.filnalurl &&
                        this.props.match.params.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/labs/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                : `/labs/${this.props.match.params.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span
                              className="pt-4 font-size-12"
                              style={linkStyles}
                            >
                              Labs
                            </span>
                          </Link>
                        </li>
                      ) : null}
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
                          <span className="pt-4 font-size-12">Book a Test</span>
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
                          <span
                            className="pt-4 font-size-12"
                            style={linkStyles}
                          >
                            Labs
                          </span>

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
                          <span className="pt-4 font-size-12">Book a Test</span>
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
                          <span
                            className="pt-4 font-size-12"
                            style={linkStyles}
                          >
                            Labs
                          </span>
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
        ) : null}

        <div className="page-content">
          <MetaTags>
            <title>Nearby Labs | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Lab Marketplace" breadcrumbItem="Nearby Labs" />
            <Row>
              {/* <Col lg="3">
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Filter</CardTitle>
                    <div className="mt-4 pt-3">
                      <h5 className="font-size-14 mb-4">Price</h5>
                      <br />

                      <Nouislider
                        range={{ min: 0, max: 600 }}
                        tooltips={true}
                        start={[100, 500]}
                        connect
                        onSlide={this.onUpdate}
                      />
                    </div>

                    <div className="mt-4 pt-3">
                      <h5 className="font-size-14 mb-3">Discount</h5>
                      {discountData.map((discount, i) => (
                        <div className="form-check mt-2" key={i}>
                          <Input
                            type="checkbox"
                            value={discount.value}
                            className="form-check-input"
                            id={i}
                            onChange={this.onSelectDiscount}
                          />{" "}
                          <Label className="form-check-label" htmlFor={i}>
                            {discount.label}
                          </Label>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3">
                      <h5 className="font-size-14 mb-3">Customer Rating</h5>
                      <div>
                        <div className="form-check mt-2">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="productratingCheck1"
                            onChange={e => {
                              if (e.target.checked) {
                                this.onChangeRating(4);
                              } else {
                                this.onUncheckMark(4);
                              }
                            }}
                          />{" "}
                          <Label
                            className="form-check-label"
                            htmlFor="productratingCheck1"
                          >
                            4 <i className="bx bxs-star text-warning" /> & Above
                          </Label>
                        </div>
                        <div className="form-check mt-2">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="productratingCheck2"
                            onChange={e => {
                              if (e.target.checked) {
                                this.onChangeRating(3);
                              } else {
                                this.onUncheckMark(3);
                              }
                            }}
                          />{" "}
                          <Label
                            className="form-check-label"
                            htmlFor="productratingCheck2"
                          >
                            3 <i className="bx bxs-star text-warning" /> & Above
                          </Label>
                        </div>
                        <div className="form-check mt-2">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="productratingCheck3"
                            onChange={e => {
                              if (e.target.checked) {
                                this.onChangeRating(2);
                              } else {
                                this.onUncheckMark(2);
                              }
                            }}
                          />{" "}
                          <Label
                            className="form-check-label"
                            htmlFor="productratingCheck3"
                          >
                            2 <i className="bx bxs-star text-warning" /> & Above
                          </Label>
                        </div>
                        <div className="form-check mt-2">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="productratingCheck4"
                            onChange={e => {
                              if (e.target.checked) {
                                this.onSelectRating(1);
                              } else {
                                this.onUncheckMark(1);
                              }
                            }}
                          />{" "}
                          <Label
                            className="form-check-label"
                            htmlFor="productratingCheck4"
                          >
                            1 <i className="bx bxs-star text-warning" />
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>  */}

              <Modal
                isOpen={this.state.PatientModal}
                className={this.props.className}
              >
                <ModalHeader toggle={this.togglePatientModal}>
                  <h2 style={{ fontSize: "16px" }}>
                    How to enable location access on your browser
                  </h2>
                </ModalHeader>
                <ModalBody>
                  <Formik>
                    <Form>
                      <Row>
                        <Col className="col-12">
                          <p className="font-size-15 font-weight-bold">
                            On your Chrome browser
                          </p>
                          <p style={{ fontSize: "14px", marginLeft: "15px" }}>
                            <stront className="font-size-16 font-weight-bold">
                              1.
                            </stront>{" "}
                            To the left of the address bar, click the Padlock
                            icon{" "}
                            <i
                              className="fas fa-lock"
                              style={{ fontSize: "14px" }}
                            ></i>{" "}
                            <br></br>
                            <span
                              style={{ fontSize: "14px", marginLeft: "15px" }}
                            >
                              then select &ldquo;Site Settings.&rdquo;
                            </span>
                          </p>
                          <p style={{ fontSize: "14px", marginLeft: "15px" }}>
                            <stront className="font-size-16 font-weight-bold">
                              2.
                            </stront>{" "}
                            Under Permissions, find Location and change it to
                            Allow.
                          </p>
                        </Col>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={closeModal}
                          >
                            Got It!
                          </button>
                        </div>
                      </Row>
                    </Form>
                  </Formik>
                </ModalBody>
              </Modal>

              {/* <Col lg="9"> */}
              {!isSmallScreen ? (
                <Row className="mb-3">
                  <Formik
                    innerRef={formik => (this.formik = formik)}
                    enableReinitialize={true}
                    initialValues={{
                      // search_type:
                      //   (this.state && this.state.search_type) ||
                      //   "Current Location",
                      city: (this.state && this.state.city) || "",
                      name: (this.state && this.state.name) || "",
                      location: (this.state && this.state.location) || "",
                    }}
                    validationSchema={Yup.object().shape({
                      city: Yup.string().when("search_type", {
                        is: val => val === "Custom Address",
                        then: Yup.string().required("Please enter your City"),
                      }),
                      location: Yup.string().when("city", {
                        is: val => val != "",
                        then: Yup.string().required(
                          "Please enter your Location"
                        ),
                      }),
                    })}
                  >
                    {({ errors, status, touched }) => (
                      <Form className="form-horizontal">
                        {/* Type field */}
                        <Row>
                          {this.state.locationAccessAllowed === true ? (
                            <Col xs="3" sm="3" md="2" lg="2">
                              <div className="mb-3">
                                <Label
                                  for="LabType2"
                                  className="form-label"
                                  style={{
                                    fontSize:
                                      window.innerWidth <= 576 ? "7px" : "12px",
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Search Types
                                </Label>
                                <Field
                                  name="search_type"
                                  component="select"
                                  onChange={e => this.onChangeSearchType(e)}
                                  value={search_type}
                                  className="form-select"
                                  style={{
                                    border: borderColor,
                                    borderRadius: "5px",
                                    // Add more style overrides as needed
                                  }}
                                >
                                  <option value="Current Location">
                                    Current Location
                                  </option>
                                  <option value="City">Search By City</option>
                                  <option value="Custom Address">
                                    Custom Address
                                  </option>
                                </Field>
                              </div>
                            </Col>
                          ) : (
                            <Col xs="3" sm="3" md="2" lg="2">
                              <div className="mb-3">
                                <Label
                                  for="LabType2"
                                  className="form-label"
                                  style={{
                                    fontSize:
                                      window.innerWidth <= 576 ? "7px" : "12px",
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Search Types
                                </Label>
                                <Field
                                  name="search_type"
                                  component="select"
                                  onChange={e => this.onChangeSearchType(e)}
                                  value={search_type}
                                  className="form-select"
                                  style={{
                                    border: borderColor,
                                    borderRadius: "5px",
                                    // Add more style overrides as needed
                                  }}
                                >
                                  <option value="">Choose an option</option>
                                  <option value="Current Location">
                                    Current Location
                                  </option>
                                  <option value="City">Search By City</option>
                                  <option value="Custom Address">
                                    Custom Address
                                  </option>
                                </Field>
                              </div>
                            </Col>
                          )}
                          {this.state.search_type === "City" && (
                            <Col xs="3" sm="3" md="2" lg="2">
                              <div className="mb-3">
                                <Label
                                  for="LabType1"
                                  className="form-label"
                                  style={{
                                    fontSize:
                                      window.innerWidth <= 576 ? "8px" : "12px",
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  <span style={{ fontSize: "12px" }}>
                                    By City{" "}
                                  </span>
                                </Label>
                                <Select
                                  name="city"
                                  component="Select"
                                  onChange={this.onChangeCity}
                                  className="defautSelectParent is-invalid"
                                  options={cityList}
                                  placeholder="City.."
                                  styles={{
                                    control: (provided, state) => ({
                                      ...provided,
                                      border: "2px solid green",
                                      borderRadius: "5px",
                                    }),
                                    // Add more style overrides as needed
                                  }}
                                />
                              </div>
                            </Col>
                          )}
                          {this.state.search_type === "Custom Address" && (
                            <Col xs="3" sm="3" md="2" lg="2">
                              <div className="mb-3">
                                <Label
                                  for="LabType1"
                                  className="form-label"
                                  style={{
                                    fontSize:
                                      window.innerWidth <= 576 ? "8px" : "12px",
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  <span style={{ fontSize: "12px" }}>
                                    Custom Address{" "}
                                  </span>
                                </Label>
                                <Input
                                  defaultValue={this.state.address}
                                  onChange={e => this.onChangeAddress(e)}
                                  id="pac-input"
                                  type="text"
                                  className="form-control"
                                  placeholder="Address.."
                                  style={{
                                    border: "2px solid yellow",
                                    borderRadius: "5px",
                                    // Add more style overrides as needed
                                  }}
                                />
                              </div>
                            </Col>
                          )}
                          {this.state.search_type === "Custom Address" ? (
                            <Col xs="1" sm="2" md="1" lg="1">
                              <div className="mb-3">
                                <Label
                                  for="LabType2"
                                  className="form-label"
                                  style={{
                                    fontSize:
                                      window.innerWidth <= 576 ? "7px" : "12px",
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Km
                                </Label>
                                <div className="input-group">
                                  <Input
                                    defaultValue={this.state.km}
                                    onChange={e => this.onChangeKm(e)}
                                    id="pac-input"
                                    type="number"
                                    className="form-control"
                                    placeholder="km.."
                                    style={{
                                      border: "2px solid yellow",
                                      borderRadius: "5px",
                                      fontSize: "14px",
                                      // Add more style overrides as needed
                                    }}
                                  />
                                </div>
                              </div>
                            </Col>
                          ) : (
                            this.state.search_type === "Current Location" && (
                              <Col xs="1" sm="2" md="1" lg="1">
                                <div className="mb-3">
                                  <Label
                                    for="LabType2"
                                    className="form-label"
                                    style={{
                                      fontSize:
                                        window.innerWidth <= 576
                                          ? "7px"
                                          : "12px",
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Km
                                  </Label>
                                  <div className="input-group">
                                    <Input
                                      defaultValue={this.state.km}
                                      onChange={e => this.onChangeKm(e)}
                                      id="pac-input"
                                      type="number"
                                      className="form-control"
                                      placeholder="km.."
                                      style={{
                                        border: "2px solid red",
                                        borderRadius: "5px",
                                        fontSize: "14px",
                                        // Add more style overrides as needed
                                      }}
                                    />
                                  </div>
                                </div>
                              </Col>
                            )
                          )}
                          <Col xs="4" sm="4" md="3" lg="3">
                            <div className="mb-3">
                              <Label
                                for="LabType"
                                className="form-label"
                                style={{
                                  fontSize:
                                    window.innerWidth <= 576 ? "7px" : "12px",
                                  color: "black",
                                  fontWeight: "bold",
                                }}
                              >
                                Search By Lab Name
                              </Label>
                              <Select
                                type="text"
                                // value={labNames.find((option) => option.value === this.state.name)}
                                onChange={this.onChangeLabName}
                                options={labNames}
                                placeholder="Lab Name..."
                                isSearchable={true}
                                isClearable={true}
                                components={{
                                  ClearIndicator,
                                }}
                                styles={{
                                  control: (provided, state) => ({
                                    ...provided,
                                    border: "2px solid blue",
                                    borderRadius: "5px",
                                  }),
                                  // Add more style overrides as needed
                                }}
                              />
                            </div>
                          </Col>
                          {/* <Col xs="3" sm="3" md="2" lg="2">
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
                                Search By Labs Type
                              </Label>
                              <Field
                                name="LabType"
                                component="select"
                                onChange={(e) => this.onChangeType(e)}
                                value={this.state.LabType}
                                className="form-select"
                                style={{
                                  border: '2px solid blue',
                                  borderRadius: '5px',
                                  // Add more style overrides as needed
                                }}
                              >
                                <option value="Main">Main Labs</option>
                                <option value="Collection">Collection Points</option>
                                <option value="Others">Both</option>
                              </Field>
                            </div>
                          </Col> */}
                          {
                            this.state.locationAccessAllowed === true ? (
                              <Col xs="3" sm="3" md="2" lg="2">
                                <div className="mb-3">
                                  <Label
                                    for="LabType2"
                                    className="form-label"
                                    style={{
                                      fontSize:
                                        window.innerWidth <= 576
                                          ? "7px"
                                          : "12px",
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Search By Labs Type
                                  </Label>
                                  <Field
                                    name="LabType"
                                    component="select"
                                    onChange={e => this.onChangeType(e)}
                                    value={this.state.LabType}
                                    className="form-select"
                                    style={{
                                      border: "2px solid blue",
                                      borderRadius: "5px",
                                      // Add more style overrides as needed
                                    }}
                                  >
                                    <option value="Main">Main Labs</option>
                                    <option value="Collection">
                                      Collection Points
                                    </option>
                                    <option value="Others">Both</option>
                                  </Field>
                                </div>
                              </Col>
                            ) : 
                            (
                              <Col xs="3" sm="3" md="2" lg="2">
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
                                  Search By Labs Type
                                </Label>
                                  <Field
                                    name="LabType"
                                    component="select"
                                    onChange={(e) => this.onChangeType(e)}
                                    value={this.state.LabType}
                                    className="form-select"
                                    style={{
                                      border: '2px solid blue',
                                      borderRadius: '5px',
                                      // Add more style overrides as needed
                                    }}
                                  >
                                    <option value="Others">Both</option>
                                    <option value="Main">Main Labs</option>
                                    <option value="Collection">Collection Points</option>
                                  </Field>
                                </div>
                              </Col>
                            )
                          }
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Row>
              ) : (
                <Row>
                  <Formik
                    enableReinitialize={true}
                    initialValues={{
                      // search_type:
                      //   (this.state && this.state.search_type) ||
                      //   "Current Location",
                      city: (this.state && this.state.city) || "",
                      location: (this.state && this.state.location) || "",
                      LabType: (this.state && this.state.LabType) || "Main",
                      km: (this.state && this.state.km) || "30",
                    }}
                    validationSchema={Yup.object().shape({
                      city: Yup.string().when("search_type", {
                        is: val => val === "Custom Address",
                        then: Yup.string().required("Please enter your City"),
                      }),
                      location: Yup.string().when("city", {
                        is: val => val != "",
                        then: Yup.string().required(
                          "Please enter your Location"
                        ),
                      }),
                    })}
                  >
                    {({ errors, status, touched }) => (
                      <Form className="form-horizontal">
                        {/* Type field */}
                        {/* Type field */}
                        <h4
                          style={{
                            background: "#3B71CA",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          {" "}
                          Search Labs for more result in Pakistan!
                        </h4>
                        <Row className="g-0">
                          <Col>
                            <div>
                              <Select
                                type="text"
                                onChange={this.onChangeLabName}
                                options={labNames}
                                placeholder="Lab Name..."
                                styles={{
                                  control: (provided, state) => ({
                                    ...provided,
                                    border: "2px solid blue",
                                    borderRadius: "5px",
                                  }),
                                  // Add more style overrides as needed
                                }}
                                isSearchable={true}
                                isClearable={true}
                                components={{
                                  ClearIndicator,
                                }}
                              />
                            </div>
                          </Col>
                          {this.state.locationAccessAllowed === true ? (
                            <Col xs="4" sm="4" md="3" lg="3">
                              <div className="mb-3">
                                {/* <Label
                            for="LabType2"
                            className="form-label"
                            style={{
                              fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                              color: 'black',
                              fontWeight: "bold",
                            }}
                          >
                            Search By Labs Type
                          </Label> */}
                                <Field
                                  name="LabType"
                                  component="select"
                                  onChange={e => this.onChangeType(e)}
                                  value={this.state.LabType}
                                  className="form-select"
                                  style={{
                                    border: "2px solid blue",
                                    borderRadius: "5px",
                                    // Add more style overrides as needed
                                  }}
                                >
                                  <option value="Main">Main Labs</option>
                                  <option value="Collection">
                                    Collection Points
                                  </option>
                                  <option value="Others">Both</option>
                                </Field>
                              </div>
                            </Col>
                          ) : null}
                        </Row>
                        <Row className="g-0">
                          {this.state.locationAccessAllowed === true ? (
                            <Col xs="6" sm="6" md="3" lg="3">
                              <div className="mb-3">
                                {/* <Label
                                for="LabType2"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                                  color: 'black',
                                  fontWeight: 'bold',
                                }}
                              >
                                Search Types
                              </Label> */}
                                <Field
                                  name="search_type"
                                  component="select"
                                  onChange={e => this.onChangeSearchType(e)}
                                  value={search_type}
                                  className="form-select"
                                  style={{
                                    border: borderColor,
                                    borderRadius: "5px",
                                    // Add more style overrides as needed
                                  }}
                                >
                                  <option value="Current Location">
                                    Current Location
                                  </option>
                                  <option value="City">Search By City</option>
                                  <option value="Custom Address">
                                    Custom Address
                                  </option>
                                </Field>
                              </div>
                            </Col>
                          ) : (
                            <Col xs="6" sm="6" md="3" lg="3">
                              <div className="mb-3">
                                {/* <Label
                            for="LabType2"
                            className="form-label"
                            style={{
                              fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                              color: 'black',
                              fontWeight: "bold",
                            }}
                          >
                            Search Types
                          </Label> */}
                                <Field
                                  name="search_type"
                                  component="select"
                                  onChange={e => this.onChangeSearchType(e)}
                                  value={search_type}
                                  className="form-select"
                                  style={{
                                    border: borderColor,
                                    borderRadius: "5px",
                                    // Add more style overrides as needed
                                  }}
                                >
                                  <option value="">Choose an option</option>
                                  <option value="Current Location">
                                    Current Location
                                  </option>
                                  <option value="City">Search By City</option>
                                  <option value="Custom Address">
                                    Custom Address
                                  </option>
                                </Field>
                              </div>
                            </Col>
                          )}
                          {/* <Col xs="6" sm="6" md="3" lg="3">
                        <div className="mb-3">
                          <Field
                            name="search_type"
                            component="select"
                            onChange={e => this.onChangeSearchType(e)}
                            value={this.state.search_type}
                            className="form-select"
                          >
                            <option value="">Choose an option</option>
                            <option value="Current Location">
                              Current Location
                            </option>
                            <option value="City">By City</option>
                            <option value="Custom Address">
                              Custom Address
                            </option>
                          </Field>
                        </div>
                      </Col> */}

                          {this.state.search_type === "Current Location" && (
                            <Col xs="2" sm="2" md="2" lg="2">
                              <div className="mb-3">
                                <div className="input-group">
                                  <Input
                                    defaultValue={this.state.km}
                                    onChange={e => this.onChangeKm(e)}
                                    id="pac-input"
                                    type="number" // Change "numbers" to "number"
                                    className="form-control"
                                    placeholder="Search By Km..."
                                    style={{
                                      border: "2px solid red",
                                      borderRadius: "5px",
                                      fontSize: "14px",
                                      // Add more style overrides as needed
                                    }}
                                  />
                                </div>
                              </div>
                            </Col>
                          )}
                          {this.state.search_type === "Custom Address" && (
                            <Col xs="2" sm="2" md="2" lg="2">
                              <div className="mb-3">
                                <div className="input-group">
                                  <Input
                                    defaultValue={this.state.km}
                                    onChange={e => this.onChangeKm(e)}
                                    id="pac-input"
                                    type="number" // Change "numbers" to "number"
                                    className="form-control"
                                    placeholder="Search By Km..."
                                    style={{
                                      border: "2px solid yellow",
                                      borderRadius: "5px",
                                      fontSize: "14px",
                                      // Add more style overrides as needed
                                    }}
                                  />
                                </div>
                              </div>
                            </Col>
                          )}
                          {/* City field */}
                          {this.state.search_type === "City" && (
                            <Col xs="4" sm="4" md="3" lg="3">
                              <div className="mb-3">
                                <Select
                                  name="city"
                                  component="Select"
                                  onChange={this.onChangeCity}
                                  className="defautSelectParent is-invalid"
                                  options={cityList}
                                  placeholder="City..."
                                  styles={{
                                    control: (provided, state) => ({
                                      ...provided,
                                      border: "2px solid green",
                                      borderRadius: "5px",
                                    }),
                                    // Add more style overrides as needed
                                  }}
                                />
                              </div>
                            </Col>
                          )}
                          {/* Custom Address field */}
                          {this.state.search_type === "Custom Address" && (
                            <Col xs="4" sm="4" md="3" lg="3">
                              <div className="mb-3">
                                <Input
                                  defaultValue={this.state.address}
                                  onChange={e => this.onChangeAddress(e)}
                                  id="pac-input"
                                  type="text"
                                  className="form-control"
                                  placeholder="Search Location..."
                                  style={{
                                    border: "2px solid yellow",
                                    borderRadius: "5px",
                                    // Add more style overrides as needed
                                  }}
                                />
                              </div>
                            </Col>
                          )}
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Row>
              )}

              {/* ROW FOR ADVERTISEMENT */}
              {/* <Row> */}
              {!isEmpty(nearbyLabs) &&
                !this.state.user_id &&
                this.props.match.params.guest_id &&
                nearbyLabs.map((nearbyLab, key) => (
                  <Col xl="4" sm="6" key={"_col_" + key}>
                    <Card
                      onClick={() =>
                        history.push(
                          this.props.match.params.uuid
                            ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}`
                        )
                      }
                      style={{ height: "95%" }}
                    >
                      <CardBody>
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}`
                          }
                        >
                          <div
                            style={{
                              width: "150px",
                              height: "150px",
                              marginLeft: "25%",
                            }}
                          >
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                nearbyLab.logo
                              }
                              alt="Lab Logo"
                              className=" text-end"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                float: "end",
                              }}
                            />
                          </div>
                        </Link>

                        <div className="mt-4 text-center">
                          <h5 className="mb-3 text-truncate">
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                  : `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}`
                              }
                              className="text-dark"
                            >
                              {nearbyLab.name}{" "}
                            </Link>
                          </h5>

                          {nearbyLab.opening_time &&
                            nearbyLab.closing_time &&
                            nearbyLab.is_247_opened && (
                              <div className="my-0">
                                <span className=" text-success me-2">
                                  <i className="mdi mdi-timer text-success"></i>{" "}
                                  <strong>Open for 24 Hours</strong>
                                </span>
                              </div>
                            )}

                          <div className="my-0 text-truncate">
                            <Tooltip title={nearbyLab.address}>
                              <span className="text-muted me-2">
                                <i className="mdi mdi-google-maps"></i>{" "}
                                {nearbyLab.address}
                              </span>
                            </Tooltip>
                          </div>

                          {!nearbyLab.is_247_opened && nearbyLab.opening_time && (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-timer"></i>{" "}
                                {formatTime(nearbyLab.opening_time)} to{" "}
                                {formatTime(nearbyLab.closing_time)}
                              </span>
                            </div>
                          )}
                          {!nearbyLab.is_247_opened && nearbyLab.opening_day && (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-calendar"></i>{" "}
                                {nearbyLab.opening_day} to{" "}
                                {nearbyLab.closing_day}
                              </span>
                            </div>
                          )}
                          {/* <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-email"></i>{" "}
                                  {nearbyLab.email}
                                </span>
                              </div> */}

                          {/* <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="bx bx-mobile"></i>{" "}
                                  {nearbyLab.phone}
                                </span>
                              </div> */}
                          {nearbyLab.landline ? (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-phone"></i>{" "}
                                {nearbyLab.landline}
                              </span>
                            </div>
                          ) : null}
                          {nearbyLab.female_collectors == "Yes" && (
                            <div className="my-0">
                              <span className="text-danger">
                                <i className="mdi mdi-account-question"></i> Lab
                                has female sample collectors
                              </span>
                            </div>
                          )}

                          <Row
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginLeft: "40px",
                            }}
                          >
                            <Col
                              className="d-flex justify-content-end"
                              style={{ paddingRight: "0" }}
                            >
                              <StarRatings
                                rating={nearbyLab.rating}
                                starRatedColor="#F1B44C"
                                starEmptyColor="#2D363F"
                                numberOfStars={5}
                                name="rating"
                                starDimension="12px"
                                starSpacing="3px"
                              />
                            </Col>
                            <Col
                              className="d-flex justify-content-start"
                              style={{ paddingLeft: "0" }}
                            >
                              <span
                                style={{ fontSize: "14px", marginLeft: "7px" }}
                              >
                                {nearbyLab && nearbyLab.rating && (
                                  <p>
                                    {nearbyLab.rating
                                      .toFixed(1)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </p>
                                )}
                              </span>
                            </Col>
                          </Row>

                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}`
                            }
                          >
                            <div className="my-0 mt-3">
                              <span className="me-2" style={{ color: "blue" }}>
                                See Details
                                <i className="mdi mdi-chevron-double-down"></i>{" "}
                              </span>
                             
                            </div>
                          </Link>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              {!isEmpty(nearbyLabs) &&
                this.state.user_id &&
                this.state.user_type !== "CSR" &&
                this.state.user_type !== "b2bclient" &&
                nearbyLabs.map((nearbyLab, key) => (
                  <Col xl="4" sm="6" key={"_col_" + key}>
                    <Card
                      onClick={() =>
                        history.push(
                          this.props.match.params.uuid
                            ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                            : `/nearby-lab-detail/${nearbyLab.account_id}`
                        )
                      }
                      style={{ height: "95%" }}
                    >
                      <CardBody>
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}`
                          }
                        >
                          <div
                            style={{
                              width: "150px",
                              height: "150px",
                              marginLeft: "25%",
                            }}
                          >
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                nearbyLab.logo
                              }
                              alt="Lab Logo"
                              className=" text-end"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                float: "end",
                              }}
                            />
                          </div>
                        </Link>

                        <div className="mt-4 text-center">
                          <h5 className="mb-3 text-truncate">
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                                  : `/nearby-lab-detail/${nearbyLab.account_id}`
                              }
                              className="text-dark"
                            >
                              {nearbyLab.name}{" "}
                            </Link>
                          </h5>

                          {nearbyLab.opening_time &&
                            nearbyLab.closing_time &&
                            nearbyLab.is_247_opened && (
                              <div className="my-0">
                                <span className=" text-success me-2">
                                  <i className="mdi mdi-timer text-success"></i>{" "}
                                  <strong>Open for 24 Hours</strong>
                                </span>
                              </div>
                            )}

                          <div className="my-0 text-truncate">
                            <Tooltip title={nearbyLab.address}>
                              <span className="text-muted me-2">
                                <i className="mdi mdi-google-maps"></i>{" "}
                                {nearbyLab.address}
                              </span>
                            </Tooltip>
                          </div>

                          {!nearbyLab.is_247_opened && nearbyLab.opening_time && (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-timer"></i>{" "}
                                {formatTime(nearbyLab.opening_time)} to{" "}
                                {formatTime(nearbyLab.closing_time)}
                              </span>
                            </div>
                          )}
                          {!nearbyLab.is_247_opened && nearbyLab.opening_day && (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-calendar"></i>{" "}
                                {nearbyLab.opening_day} to{" "}
                                {nearbyLab.closing_day}
                              </span>
                            </div>
                          )}

                          {/* <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-email"></i>{" "}
                                  {nearbyLab.email}
                                </span>
                              </div> */}

                          {/* <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="bx bx-mobile"></i>{" "}
                                  {nearbyLab.phone}
                                </span>
                              </div> */}
                          {nearbyLab.landline ? (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-phone"></i>{" "}
                                {nearbyLab.landline}
                              </span>
                            </div>
                          ) : null}

                          {nearbyLab.female_collectors == "Yes" && (
                            <div className="my-0">
                              <span className="text-danger">
                                <i className="mdi mdi-account-question"></i> Lab
                                has female sample collectors
                              </span>
                            </div>
                          )}
                          <Row
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginLeft: "40px",
                            }}
                          >
                            <Col
                              className="d-flex justify-content-end"
                              style={{ paddingRight: "0" }}
                            >
                              <StarRatings
                                rating={nearbyLab.rating}
                                starRatedColor="#F1B44C"
                                starEmptyColor="#2D363F"
                                numberOfStars={5}
                                name="rating"
                                starDimension="12px"
                                starSpacing="3px"
                              />
                            </Col>
                            <Col
                              className="d-flex justify-content-start"
                              style={{ paddingLeft: "0" }}
                            >
                              <span
                                style={{ fontSize: "14px", marginLeft: "7px" }}
                              >
                                {nearbyLab && nearbyLab.rating && (
                                  <p>
                                    {nearbyLab.rating
                                      .toFixed(1)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </p>
                                )}
                              </span>
                            </Col>
                          </Row>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}`
                            }
                          >
                            <div className="my-0 mt-3">
                              <span className="me-2" style={{ color: "blue" }}>
                                See Details
                                <i className="mdi mdi-chevron-double-down"></i>{" "}
                              </span>
                            </div>
                          </Link>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              {!isEmpty(nearbyLabs) &&
                this.state.user_id &&
                this.state.user_type === "CSR" &&
                this.state.user_type !== "b2bclient" &&
                nearbyLabs.map((nearbyLab, key) => (
                  <Col xl="4" sm="6" key={"_col_" + key}>
                    <Card
                      onClick={() =>
                        history.push(
                          this.props.match.params.guest_id
                            ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}`
                            : `/nearby-lab-detail/${nearbyLab.account_id}`
                        )
                      }
                      style={{ height: "95%" }}
                    >
                      <CardBody>
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}`
                          }
                        >
                          {/* <div className="product-img position-relative">
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                nearbyLab.logo
                              }
                              alt="Lab Logo"
                           
                              className="img-thumbnail mx-auto d-block rounded"
                              />
                          </div> */}
                          <div
                            style={{
                              width: "150px",
                              height: "150px",
                              marginLeft: "25%",
                            }}
                          >
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                nearbyLab.logo
                              }
                              alt="Lab Logo"
                              className=" text-end"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                float: "end",
                              }}
                            />
                          </div>
                        </Link>

                        <div className="mt-4 text-center">
                          <h5 className="mb-3 text-truncate">
                            <Link
                              to={
                                this.props.match.params.guest_id
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}`
                                  : `/nearby-lab-detail/${nearbyLab.account_id}}`
                              }
                              className="text-dark"
                            >
                              {nearbyLab.name}{" "}
                            </Link>
                          </h5>

                          {nearbyLab.opening_time &&
                            nearbyLab.closing_time &&
                            nearbyLab.is_247_opened && (
                              <div className="my-0">
                                <span className=" text-success me-2">
                                  <i className="mdi mdi-timer text-success"></i>{" "}
                                  <strong>Open for 24 Hours</strong>
                                </span>
                              </div>
                            )}

                          <div className="my-0 text-truncate">
                            <Tooltip title={nearbyLab.address}>
                              <span className="text-muted me-2">
                                <i className="mdi mdi-google-maps"></i>{" "}
                                {nearbyLab.address}
                              </span>
                            </Tooltip>
                          </div>

                          {!nearbyLab.is_247_opened && nearbyLab.opening_time && (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-timer"></i>{" "}
                                {formatTime(nearbyLab.opening_time)} to{" "}
                                {formatTime(nearbyLab.closing_time)}
                              </span>
                            </div>
                          )}
                          {!nearbyLab.is_247_opened && nearbyLab.opening_day && (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-calendar"></i>{" "}
                                {nearbyLab.opening_day} to{" "}
                                {nearbyLab.closing_day}
                              </span>
                            </div>
                          )}
                          {nearbyLab.landline ? (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-phone"></i>{" "}
                                {nearbyLab.landline}
                              </span>
                            </div>
                          ) : null}
                          {nearbyLab.female_collectors == "Yes" && (
                            <div className="my-0">
                              <span className="text-danger">
                                <i className="mdi mdi-account-question"></i> Lab
                                has female sample collectors
                              </span>
                            </div>
                          )}
                          <Row
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginLeft: "40px",
                            }}
                          >
                            <Col
                              className="d-flex justify-content-end"
                              style={{ paddingRight: "0" }}
                            >
                              <StarRatings
                                rating={nearbyLab.rating}
                                starRatedColor="#F1B44C"
                                starEmptyColor="#2D363F"
                                numberOfStars={5}
                                name="rating"
                                starDimension="12px"
                                starSpacing="3px"
                              />
                            </Col>
                            <Col
                              className="d-flex justify-content-start"
                              style={{ paddingLeft: "0" }}
                            >
                              <span
                                style={{ fontSize: "14px", marginLeft: "7px" }}
                              >
                                {nearbyLab && nearbyLab.rating && (
                                  <p>
                                    {nearbyLab.rating
                                      .toFixed(1)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </p>
                                )}
                              </span>
                            </Col>
                          </Row>
                          <Link
                            to={
                              this.props.match.params.guest_id
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}}`
                            }
                          >
                            <div className="my-0 mt-3">
                              <span className="me-2" style={{ color: "blue" }}>
                                See Details
                                <i className="mdi mdi-chevron-double-down"></i>{" "}
                              </span>
                            </div>
                          </Link>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              {!isEmpty(nearbyLabs) &&
                this.state.user_id &&
                this.state.user_type !== "CSR" &&
                this.state.user_type === "b2bclient" &&
                nearbyLabs.map((nearbyLab, key) => (
                  <Col xl="4" sm="6" key={"_col_" + key}>
                    <Card
                      onClick={() =>
                        history.push(
                          this.props.match.params.guest_id
                            ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-lab-detail/${nearbyLab.account_id}`
                        )
                      }
                      style={{ height: "95%" }}
                    >
                      <CardBody>
                        <Link
                          to={
                            this.props.match.params.guest_id
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}`
                          }
                        >
                          {/* <div className="product-img position-relative">
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                nearbyLab.logo
                              }
                              alt="Lab Logo"
                           
                              className="img-thumbnail mx-auto d-block rounded"
                              />
                          </div> */}
                          <div
                            style={{
                              width: "150px",
                              height: "150px",
                              marginLeft: "25%",
                            }}
                          >
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                nearbyLab.logo
                              }
                              alt="Lab Logo"
                              className=" text-end"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                float: "end",
                              }}
                            />
                          </div>
                        </Link>

                        <div className="mt-4 text-center">
                          <h5 className="mb-3 text-truncate">
                            <Link
                              to={
                                this.props.match.params.guest_id
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                  : `/nearby-lab-detail/${nearbyLab.account_id}`
                              }
                              className="text-dark"
                            >
                              {nearbyLab.name}{" "}
                            </Link>
                          </h5>

                          {nearbyLab.opening_time &&
                            nearbyLab.closing_time &&
                            nearbyLab.is_247_opened && (
                              <div className="my-0">
                                <span className=" text-success me-2">
                                  <i className="mdi mdi-timer text-success"></i>{" "}
                                  <strong>Open for 24 Hours</strong>
                                </span>
                              </div>
                            )}

                          <div className="my-0 text-truncate">
                            <Tooltip title={nearbyLab.address}>
                              <span className="text-muted me-2">
                                <i className="mdi mdi-google-maps"></i>{" "}
                                {nearbyLab.address}
                              </span>
                            </Tooltip>
                          </div>
                          {!nearbyLab.is_247_opened && nearbyLab.opening_time && (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-timer"></i>{" "}
                                {formatTime(nearbyLab.opening_time)} to{" "}
                                {formatTime(nearbyLab.closing_time)}
                              </span>
                            </div>
                          )}
                          {!nearbyLab.is_247_opened && nearbyLab.opening_day && (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-calendar"></i>{" "}
                                {nearbyLab.opening_day} to{" "}
                                {nearbyLab.closing_day}
                              </span>
                            </div>
                          )}
                          {nearbyLab.landline ? (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-phone"></i>{" "}
                                {nearbyLab.landline}
                              </span>
                            </div>
                          ) : null}
                          {nearbyLab.female_collectors == "Yes" && (
                            <div className="my-0">
                              <span className="text-danger">
                                <i className="mdi mdi-account-question"></i> Lab
                                has female sample collectors
                              </span>
                            </div>
                          )}

                          <Row
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginLeft: "40px",
                            }}
                          >
                            <Col
                              className="d-flex justify-content-end"
                              style={{ paddingRight: "0" }}
                            >
                              <StarRatings
                                rating={nearbyLab.rating}
                                starRatedColor="#F1B44C"
                                starEmptyColor="#2D363F"
                                numberOfStars={5}
                                name="rating"
                                starDimension="12px"
                                starSpacing="3px"
                              />
                            </Col>
                            <Col
                              className="d-flex justify-content-start"
                              style={{ paddingLeft: "0" }}
                            >
                              <span
                                style={{ fontSize: "14px", marginLeft: "7px" }}
                              >
                                {nearbyLab && nearbyLab.rating && (
                                  <p>
                                    {nearbyLab.rating
                                      .toFixed(1)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </p>
                                )}
                              </span>
                            </Col>
                          </Row>
                          <Link
                            to={
                              this.props.match.params.guest_id
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}`
                            }
                          >
                            <div className="my-0 mt-3">
                              <span className="me-2" style={{ color: "blue" }}>
                                See Details
                                <i className="mdi mdi-chevron-double-down"></i>{" "}
                              </span>
                            </div>
                          </Link>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              {isEmpty(nearbyLabs) &&
                (loading ? (
                  <Row>
                    <Col lg="12">
                      <div className="mb-5" style={{ fontSize: "24px" }}>
                        Please Wait.....
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col lg="12">
                      <div
                        className="mb-5"
                        style={{ fontSize: "24px", color: "red" }}
                      >
                        Sorry, No Labs Found In Your Specific Area.....
                      </div>
                    </Col>
                  </Row>
                ))}
              <ScrollButton />
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

NearbyLabs.propTypes = {
  history: any,
  location: any,
  match: PropTypes.object,
  // carts: PropTypes.array,
  advLives: PropTypes.array,
  nearbyLabs: PropTypes.array,
  onGetNearbyLabs: PropTypes.func,
  onGetAdvLive: PropTypes.func,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
  onGetTerritoriesList: PropTypes.func,
  territoriesList: PropTypes.array,
  onGetLabNamesList: PropTypes.func,
  labNamesList: PropTypes.array,
  className: PropTypes.any,
  onGetPatientProfile: PropTypes.func,
  patientProfile: PropTypes.array,
  error: PropTypes.any,
  success: PropTypes.any,
};

const mapStateToProps = state => ({
  nearbyLabs: state.LabMarket.nearbyLabs,
  advLives: state.LabMarket.advLives,
  territoriesList: state.territoriesList.territoriesList,
  onGetLabNamesList: PropTypes.func,
  labNamesList: PropTypes.array,
  labNamesList: state.labNamesList.labNamesList,
  patientProfile: state.LabMarket.patientProfile,
  error: state.LabProfile.error,
  success: state.LabProfile.success,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetNearbyLabs: locationDetails => dispatch(getNearbyLabs(locationDetails)),
  onGetAdvLive: id => dispatch(getAdvLive(id)),
  onGetTerritoriesList: id => dispatch(getTerritoriesList(id)),
  onGetLabNamesList: id => dispatch(getLabNamesList(id)),
  onGetPatientProfile: id => dispatch(getPatientProfile(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NearbyLabs));
