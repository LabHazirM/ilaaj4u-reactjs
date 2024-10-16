import React, { Component } from "react";
import PropTypes from "prop-types";
// import Select from "react-select";
import { Formik, Field, Form } from "formik";
import Tooltip from "@material-ui/core/Tooltip";

import * as Yup from "yup";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { Redirect, Link, withRouter } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button, Collapse } from "reactstrap";
import classname from "classnames";
import logo from "../../../assets/images/logo.svg";
import mtest from "../../../assets/images/m.test.png";
import mprofile from "../../../assets/images/m.profile1.png";
import mpackages from "../../../assets/images/m.package.png";
import mradiology from "../../../assets/images/m.radiology.png";
import mappointment from "../../../assets/images/m.appointment.png";
import discount from "../../../assets/images/discount.png";
import logoLight from "../../../assets/images/logo-light.png";
import logoLightSvg from "../../../assets/images/logo-light.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "../../../components/HorizontalLayout/Header";
import Select, { components } from 'react-select';


//i18n
import { withTranslation } from "react-i18next";
// import "../../../components/HorizontalLayout/horizontal-navbar.scss";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
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

//Import actions
import { getNearbyLabs, getAdvLive, getRegionWiseAdvertisement, getPatientProfile } from "store/labmarket/actions";
import { getLabNamesList } from "store/lab-names/actions";

import { any } from "prop-types";
import "./nearbylabs.scss";

import { getTerritoriesList } from "store/territories-list/actions";
import { getCarts, deleteCart, emptyCart } from "store/carts/actions";

import { CITIES } from "helpers/global_variables_helper";
import offeredTestsList from "pages/OfferedTests/offered-tests-list";
import ScrollButton from "components/Common/Scrollbutton";

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes), 0);

  // Convert to 12-hour format with AM/PM
  const formattedTime = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'Asia/Karachi', // Adjust to the desired time zone (Islamabad)
  });

  return formattedTime;
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
      count: 0,
      ratingvalues: [],
      regionWiseAdvertisement: [],
      isMenuOpened: false,
      nearbyLabs: [],
      territoriesList: [],
      advLives: [],
      patientProfile: [],
      labNamesList: [],
      selectedLabName: "", // State to store the selected lab name
      filteredLabs: [], // State to store the filtered labs
      labNameInput: '',      // Store the lab name input by the user
      filteredLabNames: [],
      name: "",
      advLive: "",
      activeTab: "1",
      isDropdownOpen: false,
      address: "",
      search_type: "",
      km: "30",
      LabType: "",
      city: "",
      latitude: "",
      longitude: "",
      location: "",
      currentLatitude: "",
      currentLongitude: "",
      locationAccessAllowed: "",
      selectedLab: null,
      autoplay: true,
      loading: true, // Add loading state property
      discountData: [],
      isFormVisible: false,
      isDivVisible: false,
      showModal: false,
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
    this.toggleAddressModal = this.toggleAddressModal.bind(this);
    console.log("guest_id", this.props.match.params.guest_id);
    console.log("uuid", this.props.match.params.uuid);
    console.log("id", this.props.match.params.id);
    console.log("fid", this.props.match.params.filnalurl);
    console.log("type", this.state.user_type);
  }
  openMenu = () => {
    this.setState({ isMenuOpened: !this.state.isMenuOpened });
    console.log(this.state.isMenuOpened);
  };

  componentDidMount() {
    console.log("guest_id", this.props.match.params.guest_id);
    console.log("uuid", this.props.match.params.uuid);
    console.log("id", this.props.match.params.id);
    console.log("fid", this.props.match.params.filnalurl);
    console.log("type", this.state.user_type);
    const {
      territoriesList,
      onGetTerritoriesList,
      onGetAdvLive,
      onGetNearbyLabs,
      onGetRegionWiseAdvertisement,
    } = this.props;
    if (territoriesList && !territoriesList.length) {
      console.log(onGetTerritoriesList(this.state.user_id));
    }
    const { labNamesList, onGetLabNamesList } = this.props;
    if (labNamesList && !labNamesList.length) {
      console.log(onGetLabNamesList(this.state.user_id));
    }
    const { patientProfile, onGetPatientProfile } = this.props;
    onGetPatientProfile(this.state.user_id);
    this.setState({
      patientProfile,
    });
    console.log("state", patientProfile);
    let latitude;
    let longitude;
    const url = window.location.href;
    const queryString = url.substring(url.indexOf("&"));
    const params = new URLSearchParams(queryString);
    console.log("print params in app", url, queryString, params);
    const latitudeFromUrl = params.get("lat");
    const longitudeFromUrl = params.get("lon");
    console.log("Latitude:", latitudeFromUrl);
    console.log("Longitude:", longitudeFromUrl);
    // Check if latitude and longitude values are present in URL parameters
    if (latitudeFromUrl && longitudeFromUrl) {
      // Parse latitude and longitude from URL
      const latitude = parseFloat(latitudeFromUrl);
      const longitude = parseFloat(longitudeFromUrl);
      console.log("print lat log in app", latitude, longitude);

      // Construct the query string (finalUrl)
      const finalUrl = `&lat=${latitude}&lon=${longitude}`;

      // Batch state updates and use a callback to handle logic after state update
      this.setState(
        {
          finalUrl: finalUrl,
          currentLatitude: latitude,
          currentLongitude: longitude,
          search_type: "Current Location",
          LabType: "Main",
        },
        () => {
          // Logging the updated state values
          console.log("Final URL after state update:", this.state.finalUrl, this.state.search_type);

          // Lab Advertisement
          const regionWiseAdvLocationDetails = {
            latitude: this.state.currentLatitude,
            longitude: this.state.currentLongitude,
            search_type: this.state.search_type,
            address: this.state.address,
            city: this.state.city,
          };
          if (this.state.currentLatitude && this.state.currentLongitude) {
            onGetRegionWiseAdvertisement(regionWiseAdvLocationDetails);
            setTimeout(() => {
              this.setState({
                regionWiseAdvertisement: this.props.regionWiseAdvertisement,
              });
            }, 500);
          }

          // Labhazir Advertisement
          const advLiveLocationDetails = {
            latitude: this.state.currentLatitude,
            longitude: this.state.currentLongitude,
            search_type: this.state.search_type,
            address: this.state.address,
            city: this.state.city,
          };
          if (this.state.currentLatitude && this.state.currentLongitude) {
            onGetAdvLive(advLiveLocationDetails);
            setTimeout(() => {
              this.setState({ advLives: this.props.advLives });
            }, 500);
          }

          // Nearby Labs
          const guest_id = uuidv4();
          const nearbyLabsLocationDetails = {
            latitude: this.state.currentLatitude,
            longitude: this.state.currentLongitude,
            search_type: this.state.search_type,
            address: this.state.address,
            city: this.state.city,
            km: this.state.km,
            LabType: this.state.LabType,
            locationAccessAllowed: this.state.locationAccessAllowed,
            guest_id: guest_id,
          };

          console.log("guestid in nearby lab:", guest_id, nearbyLabsLocationDetails.guest_id, this.state.search_type);

          this.setState({ guest_id });

          if (this.state.currentLatitude && this.state.currentLongitude) {
            onGetNearbyLabs(nearbyLabsLocationDetails);
            this.setState({ nearbyLabs: [] });

            setTimeout(() => {
              this.setState({ nearbyLabs: this.props.nearbyLabs });
            }, 500);
          }

          // Additional user-type specific logic for nearby labs
          if (this.state.user_id || this.state.user_type === "b2bclient") {
            const nearbyLabsLocationDetailsForB2B = {
              latitude: this.state.currentLatitude,
              longitude: this.state.currentLongitude,
              search_type: this.state.search_type,
              address: this.state.address,
              city: this.state.city,
              km: this.state.km,
              locationAccessAllowed: this.state.locationAccessAllowed,
              LabType: this.state.LabType,
            };
            if (this.state.currentLatitude && this.state.currentLongitude) {
              onGetNearbyLabs(nearbyLabsLocationDetailsForB2B);
              this.setState({ nearbyLabs: [] });

              setTimeout(() => {
                this.setState({ nearbyLabs: this.props.nearbyLabs });
              }, 500);
            }
          }
          if ((!this.state.user_id || this.state.user_type === "CSR") &&
            !this.props.match.params.guest_id) {
            const guest_id = uuidv4();

            const nearbyLabsLocationDetailsForB2B = {
              latitude: this.state.currentLatitude,
              longitude: this.state.currentLongitude,
              search_type: this.state.search_type,
              address: this.state.address,
              city: this.state.city,
              km: this.state.km,
              locationAccessAllowed: this.state.locationAccessAllowed,
              LabType: this.state.LabType,
              guest_id,

            };
            this.setState({ guest_id });

            if (this.state.currentLatitude && this.state.currentLongitude) {
              onGetNearbyLabs(nearbyLabsLocationDetailsForB2B);
              this.setState({ nearbyLabs: [] });

              setTimeout(() => {
                this.setState({ nearbyLabs: this.props.nearbyLabs });
              }, 500);
            }
          }
          if (!this.state.user_id && !this.props.match.params.guest_id) {
            const guest_id = uuidv4();

            const nearbyLabsLocationDetailsForB2B = {
              latitude: this.state.currentLatitude,
              longitude: this.state.currentLongitude,
              search_type: this.state.search_type,
              address: this.state.address,
              city: this.state.city,
              km: this.state.km,
              locationAccessAllowed: this.state.locationAccessAllowed,
              LabType: this.state.LabType,
              guest_id,

            };
            this.setState({ guest_id });

            if (this.state.currentLatitude && this.state.currentLongitude) {
              onGetNearbyLabs(nearbyLabsLocationDetailsForB2B);
              this.setState({ nearbyLabs: [] });

              setTimeout(() => {
                this.setState({ nearbyLabs: this.props.nearbyLabs });
              }, 500);
            }
          }
          if (this.state.user_id) {

            const nearbyLabsLocationDetailsForB2B = {
              latitude: this.state.currentLatitude,
              longitude: this.state.currentLongitude,
              search_type: this.state.search_type,
              address: this.state.address,
              city: this.state.city,
              km: this.state.km,
              locationAccessAllowed: this.state.locationAccessAllowed,
              LabType: this.state.LabType,

            };

            if (this.state.currentLatitude && this.state.currentLongitude) {
              onGetNearbyLabs(nearbyLabsLocationDetailsForB2B);
              this.setState({ nearbyLabs: [] });

              setTimeout(() => {
                this.setState({ nearbyLabs: this.props.nearbyLabs });
              }, 500);
            }
          }

        }
      );
    }

    else {
      if (navigator.geolocation) {
        const geolocationPermission = navigator.permissions.query({ name: 'geolocation' });

        geolocationPermission.then((result) => {
          if (!(result.state === 'granted' || result.state === 'denied')) {
            const guest_id = uuidv4();
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
              guest_id,
            };
            console.log("guestid in nearby lab:", guest_id, nearbyLabsLocationDetails.guest_id)
            this.setState({ guest_id });
            // Call onGetNearbyLabs before prompting for geolocation
            onGetNearbyLabs(nearbyLabsLocationDetails);
            this.setState({ nearbyLabs: [] });

            setTimeout(() => {
              this.setState({ nearbyLabs: this.props.nearbyLabs });
            }, 500);
            console.log('Geolocation permission status:', result.state);
            return;
          }
        });

        navigator.geolocation.getCurrentPosition((position) => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          console.log("web", latitude, longitude);

          this.setState({ currentLatitude: latitude });
          this.setState({ currentLongitude: longitude });
          this.setState({ locationAccessAllowed: true });
          this.setState({ search_type: "Current Location" });
          this.setState({ LabType: "Main" });
          // Labhazir Advertisement 
          const advLiveLocationDetails = {
            latitude,
            longitude,
            search_type: this.state.search_type,
            address: this.state.address,
            city: this.state.city,

          };

          if (latitude && longitude) {
            onGetAdvLive(advLiveLocationDetails);
            setTimeout(() => {
              this.setState({ advLives: this.props.advLives });
            }, 500);
          }

          // Lab Advertisement 
          const regionWiseAdvLocationDetails = {
            latitude,
            longitude,
            search_type: this.state.search_type,
            address: this.state.address,
            city: this.state.city,

          };
          if (latitude && longitude) {
            onGetRegionWiseAdvertisement(regionWiseAdvLocationDetails);
            setTimeout(() => {
              this.setState({ regionWiseAdvertisement: this.props.regionWiseAdvertisement },
                console.log("lab advertisement have or not", this.props.regionWiseAdvertisement, this.state.regionWiseAdvertisement));
            }, 500);
          }

          // near by labs
          if ((!this.state.user_id || this.state.user_type === "CSR") && !this.props.match.params.guest_id) {
            const guest_id = uuidv4();
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
              guest_id,
            };
            console.log("guestid in nearby lab:", guest_id, nearbyLabsLocationDetails.guest_id)
            this.setState({ guest_id });
            console.log("differ:", this.state.guest_id)
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

            };
            if (latitude && longitude) {
              onGetNearbyLabs(nearbyLabsLocationDetails);
              this.setState({ nearbyLabs: [] });

              setTimeout(() => {
                this.setState({ nearbyLabs: this.props.nearbyLabs });
              }, 500);
            }
          }
          if ((!this.state.user_id) && !this.props.match.params.guest_id) {
            const guest_id = uuidv4();

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
              guest_id,
            };
            console.log("guestid in nearby lab:", guest_id, nearbyLabsLocationDetails.guest_id)
            this.setState({ guest_id });
            console.log("differ:", this.state.guest_id)
            console.log(window.location.href);
            if (latitude && longitude) {
              onGetNearbyLabs(nearbyLabsLocationDetails);
              this.setState({ nearbyLabs: [] });

              setTimeout(() => {
                this.setState({ nearbyLabs: this.props.nearbyLabs });
              }, 500);
            }
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

        }, () => {
          this.setState({ latitude: null, longitude: null });
          if ((!this.state.user_id || this.state.user_type === "CSR") && !this.props.match.params.guest_id) {
            const guest_id = uuidv4();
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
              guest_id,
            };
            console.log("guestid in nearby lab:", guest_id, nearbyLabsLocationDetails.guest_id)
            this.setState({ guest_id });
            console.log("differ:", this.state.guest_id)
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

          if ((!this.state.user_id) && !this.props.match.params.guest_id) {
            const guest_id = uuidv4();

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
              guest_id,
            };
            console.log("guestid in nearby lab:", guest_id, nearbyLabsLocationDetails.guest_id)
            this.setState({ guest_id });
            console.log("differ:", this.state.guest_id)
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
              name: this.state.name,
            };
            onGetNearbyLabs(nearbyLabsLocationDetails);
            this.setState({ nearbyLabs: [] });

            setTimeout(() => {
              this.setState({ nearbyLabs: this.props.nearbyLabs });
            }, 500);
          }

          // // region Wise Advertisement 
          // const regionWiseAdvLocationDetails = {
          //   latitude,
          //   longitude,
          //   search_type: this.state.search_type,
          //   address: this.state.address,
          //   city: this.state.city,
          // };
          // onGetRegionWiseAdvertisement(regionWiseAdvLocationDetails);
          // setTimeout(() => {
          //   this.setState({ regionWiseAdvertisement: this.props.regionWiseAdvertisement });
          // }, 500);
        }
        );
      } else {
        // Geolocation is not supported by the browser
        console.log("Geolocation is not supported by the browser.");
        // Handle this scenario as needed, e.g., display an error message or provide alternative functionality.
      }


    }
    // Set loading state to false after 7 seconds (if you want to maintain the same timing)
    setTimeout(() => {
      this.setState({ loading: false });
    }, 7000);
    if (this.state.search_type === "Current Location") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const geocoder = new window.google.maps.Geocoder();

          const latlng = {
            lat: latitude,
            lng: longitude
          };

          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === "OK") {
              if (results[0]) {
                const formattedAddress = results[0].formatted_address;

                // Extract specific components from the formatted address
                const addressComponents = formattedAddress.split(', ');
                const [area, street, city, country] = addressComponents;

                // Optionally, you can set these components in the state if needed
                this.setState({
                  area,
                  street,
                  city,
                  country,
                });

                this.handleAddressChange(formattedAddress);
              } else {
                alert("No results found");
              }
            } else {
              alert("Geocoder failed due to: " + status);
            }
          });
        });
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    }
  }

  handleLocationUpdate(latitude, longitude) {
    const { onGetAdvLive, onGetNearbyLabs, onGetRegionWiseAdvertisement } = this.props;

    this.setState({ currentLatitude: latitude });
    this.setState({ currentLongitude: longitude });

    // region Wise Advertisement
    const advLiveLocationDetails = {
      latitude: this.state.currentLatitude,
      longitude: this.state.currentLongitude,
      search_type: this.state.search_type,
      address: this.state.address,
      city: this.state.city,
    };

    if (this.state.currentLatitude && this.state.currentLongitude) {
      onGetAdvLive(advLiveLocationDetails);
      setTimeout(() => {
        this.setState({ advLives: this.props.advLives });
      }, 500);
    }

    // near by labs
    if ((!this.state.user_id || this.state.user_type === "CSR") && !this.props.match.params.guest_id) {
      const guest_id = uuidv4();
      const nearbyLabsLocationDetails = {
        latitude: this.state.currentLatitude,
        longitude: this.state.currentLongitude,
        search_type: this.state.search_type,
        address: this.state.address,
        city: this.state.city,
        km: this.state.km,
        LabType: this.state.LabType,
        guest_id: guest_id,
      };
      console.log("guestid in nearby lab:", guest_id, nearbyLabsLocationDetails.guest_id)
      this.setState({ guest_id: guest_id });
      console.log("differ:", this.state.guest_id)
      console.log(window.location.href);
      // onGetNearbyLabs(nearbyLabsLocationDetails).then(() => {
      //   this.setState({ nearbyLabs: this.props.nearbyLabs });
      // }).catch((error) => {
      //   console.log("Error fetching nearby labs:", error);
      //   // Handle error if necessary
      // });
      if (this.state.currentLatitude && this.state.currentLongitude) {
        onGetNearbyLabs(nearbyLabsLocationDetails);
        setTimeout(() => {
          this.setState({ nearbyLabs: this.props.nearbyLabs });
        }, 500);
      }
    }

    // region Wise Advertisement
    const regionWiseAdvLocationDetails = {
      latitude: this.state.currentLatitude,
      longitude: this.state.currentLongitude,
      search_type: this.state.search_type,
      address: this.state.address,
      city: this.state.city,
    };
    if (this.state.currentLatitude && this.state.currentLongitude) {
      onGetRegionWiseAdvertisement(regionWiseAdvLocationDetails);
      setTimeout(() => {
        this.setState({ regionWiseAdvertisement: this.props.regionWiseAdvertisement });
      }, 500);
    }
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
    const { carts } = this.props;
    if (!isEmpty(carts) && size(prevProps.carts) !== size(carts)) {
      this.setState({ carts: {} });
    }
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
      const newAddress = e.target.value;
      this.handleAddressChange(newAddress);

      // // Find and adjust the z-index of the suggestion list
      // const suggestionList = document.querySelector(".pac-container");
      // if (suggestionList) {
      //   suggestionList.style.zIndex = "9999"; // Adjust the z-index value as needed
      // }
    });
  };

  handleAddressChange = newAddress => {
    this.setState({ address: newAddress }, () => {
      // Update other state properties as needed
      // Call the function to update patient address or any other logic
      // this.onChangeAddress({ target: { value: newAddress } });
      console.log("address save or note", this.state.address);

      // Extract specific components from the formatted address
      const addressComponents = newAddress.split(', ');

      // Assuming the order is area, street, city, country
      const [area, street, city, country] = addressComponents;

      // Optionally, you can set these components in the state if needed
      this.setState({
        area,
        street,
        city,
        country,
      });

      // Call the necessary APIs with the extracted components
      const { currentLatitude, currentLongitude, LabType, km, name, locationAccessAllowed } = this.state;
      const { onGetNearbyLabs, onGetAdvLive, onGetRegionWiseAdvertisement } = this.props;

      const locationDetails = {
        latitude: currentLatitude,
        longitude: currentLongitude,
        search_type: this.state.search_type,
        address: newAddress,
        city,
        LabType,
        km,
        name,
        locationAccessAllowed,
      };

      // Call the necessary APIs
      onGetNearbyLabs(locationDetails);
      onGetAdvLive(locationDetails);
      onGetRegionWiseAdvertisement(locationDetails);

      // Update state after API calls
      setTimeout(() => {
        this.setState({
          nearbyLabs: this.props.nearbyLabs,
          advLives: this.props.advLives,
          regionWiseAdvertisement: this.props.regionWiseAdvertisement,
        });
      }, 1000);
    });
  };


  // onChangeSearchType = async e => {
  //   this.setState({ search_type: e.target.value });

  //   // Call nearby labs API only if the search type changes to current location
  //   if (e.target.value === "Current Location") {
  //     this.setState({ city: "" });
  //     this.setState({ address: "" });
  //     const { onGetNearbyLabs, onGetAdvLive, onGetRegionWiseAdvertisement } = this.props;

  //     // Check if the location access is allowed
  //     try {
  //       const locationPermission = await navigator.permissions.query({ name: 'geolocation' });
  //       if (locationPermission.state === 'denied') {
  //         // Location access is denied
  //         alert('Location access is denied. For accurate results, please allow location access.');
  //         return;
  //       } else {
  //         // Location access is allowed, refresh the page
  //         window.location.reload();
  //       }
  //     } catch (error) {
  //       console.error('Error checking location permission:', error);
  //     }
  //     // Location access is allowed, proceed with API calls
  //     var locationDetails = {
  //       latitude: this.state.currentLatitude,
  //       longitude: this.state.currentLongitude,
  //       search_type: e.target.value,
  //       address: this.state.address,
  //       city: this.state.city,
  //       LabType: this.state.LabType,
  //       km: this.state.km,
  //       name: this.state.name,
  //       locationAccessAllowed: this.state.locationAccessAllowed,
  //     };

  //     // region wise advertisement
  //     onGetNearbyLabs(locationDetails);
  //     onGetAdvLive(locationDetails);
  //     onGetRegionWiseAdvertisement(locationDetails);

  //     setTimeout(() => {
  //       this.setState({
  //         nearbyLabs: this.props.nearbyLabs,
  //         advLives: this.props.advLives,
  //         regionWiseAdvertisement: this.props.regionWiseAdvertisement,
  //       });
  //     }, 1000);
  //   }
  // };


  onChangeSearchType = async e => {
    this.setState({ search_type: e.target.value });

    if (e.target.value === "Current Location") {
      this.setState({ city: "" });
      this.setState({ address: "" });
      const { onGetNearbyLabs, onGetAdvLive, onGetRegionWiseAdvertisement } = this.props;

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
            };

            onGetNearbyLabs(locationDetails);
            onGetAdvLive(locationDetails);
            onGetRegionWiseAdvertisement(locationDetails);
            setTimeout(() => {
              this.setState({
                nearbyLabs: this.props.nearbyLabs,
                advLives: this.props.advLives,
                regionWiseAdvertisement: this.props.regionWiseAdvertisement,
              });
            }, 1000);
          }
        } catch (error) {
          console.error('Error checking location permission:', error);
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
    const { onGetAdvLive } = this.props;
    const { onGetRegionWiseAdvertisement } = this.props;

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
    };
    // region wise advertisement
    onGetNearbyLabs(locationDetails);
    onGetAdvLive(locationDetails);
    onGetRegionWiseAdvertisement(locationDetails);
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

  onChangeLabName = (selectedOption) => {
    // Check if selectedOption is not null before accessing its properties
    if (selectedOption && selectedOption.value) {
      this.setState({ name: selectedOption.value });
    } else {
      // Handle the case where selectedOption is null or doesn't have a value property
      this.setState({ name: '' }); // Set the name to an appropriate default value or leave it empty
    }

    // Call nearby labs API only if the search type changes to current location

    const { onGetNearbyLabs } = this.props;
    // const { onGetAdvLive } = this.props;
    // const { onGetRegionWiseAdvertisement } = this.props;

    var locationDetails = {
      latitude: this.state.currentLatitude,
      longitude: this.state.currentLongitude,
      search_type: this.state.search_type,
      name: selectedOption && selectedOption.value ? selectedOption.value : '', // Check if selectedOption is not null and has a value property
      LabType: this.state.LabType,
      km: this.state.km,
      address: this.state.address,
      city: this.state.city,
      locationAccessAllowed: this.state.locationAccessAllowed,
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
  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  toggleAddressModal = () => {
    this.setState(prevState => ({
      AddressModal: !prevState.AddressModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
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
    const { onGetAdvLive } = this.props;
    const { onGetRegionWiseAdvertisement } = this.props;

    var locationDetails = {
      latitude: "",
      longitude: "",
      search_type: this.state.search_type,
      address: "",
      city: selectedGroup.value,
      LabType: this.state.LabType,
      km: this.state.km,
      name: this.state.name,
      locationAccessAllowed: this.state.locationAccessAllowed,
    };

    onGetNearbyLabs(locationDetails);
    onGetAdvLive(locationDetails);
    onGetRegionWiseAdvertisement(locationDetails);

    setTimeout(() => {
      this.setState({
        nearbyLabs: this.props.nearbyLabs,
        advLives: this.props.advLives,
        regionWiseAdvertisement: this.props.regionWiseAdvertisement,
      });
    }, 1000);
    // ------------- Call API on city name END -------------

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

  resetVideo = event => {
    event.target.currentTime = 0;
  };

  toggleDropdown = () => {
    this.setState(prevState => ({
      isDropdownOpen: !prevState.isDropdownOpen,
    }));
  };
  toggleFormVisibility = () => {
    this.setState((prevState) => ({
      isFormVisible: !prevState.isFormVisible,
    }));
  };
  toggleDivVisibility = () => {
    this.setState((prevState) => ({
      isDivVisible: !prevState.isDivVisible,
    }));
    this.setState({ showModal: true });

  };
  hasNextSection(currentSection) {
    // Implement logic to check if there is a next section based on the current section
    // Return true if there is a next section, otherwise return false
    // Example: You might have an array of sections and check if the current section is not the last one
    const sections = ['Section1', 'Section2', 'Section3', 'Section4', 'Section5'];
    const currentIndex = sections.indexOf(currentSection);
    return currentIndex < sections.length - 1;
  };
  handleCancelIconClick = () => {
    // Handle cancel icon click logic here
    // Clear the input field
    this.setState({ address: "" });
  };

  render() {
    const { search_type } = this.state;
    let borderColor = '2px solid blue'; // Default border color

    // Check the selected option and update border color accordingly
    if (search_type === 'Current Location') {
      borderColor = '2px solid red'; // Change to the desired color
    }
    if (search_type === 'Custom Address') {
      borderColor = '2px solid yellow'; // Change to the desired color
    }
    if (search_type === 'City') {
      borderColor = '2px solid green'; // Change to the desired color
    }
    const ClearIndicator = (props) => {
      return (
        <components.ClearIndicator {...props}>
          <span onClick={props.clearValue}>X</span>
        </components.ClearIndicator>
      );
    };
    const { selectedLab } = this.state;
    const { showModal } = this.state;
    const { labNameInput, filteredLabNames } = this.state;
    const { isDropdownOpen } = this.state;
    const isSmallScreen = window.innerWidth < 490;
    const sliderStyles = {
      maxWidth: "100%",
      maxHeight: "100%", // Adjust the height as per your requirements
      objectFit: "cover",
    };
    const settings = {
      autoplay: true,
      dots: true, // Add slider dots
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    const customDots = dots => (
      <ul style={{ marginBottom: "0", textAlign: "center" }}>
        {dots.map((dot, index) => (
          <li
            key={index}
            style={{
              display: "inline-block",
              margin: 0,
              position: "relative",
              top: "-40px",
              height: "20px",
            }}
          >
            {dot}
          </li>
        ))}
      </ul>
    );

    const { history } = this.props;
    const { patientProfile } = this.props;
    const {
      discountData,
      nearbyLabs,
      page,
      totalPage,
      regionWiseAdvertisement,
    } = this.state;
    const { onGetPatientProfile } = this.props;
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

    const openModal = () => {
      const modal = document.getElementById("modal");
      modal.style.display = "block";
    };


    const closeModal = () => {
      this.setState({ PatientModal: false });
      this.setState({ AddressModal: false });

    };

    const { loading } = this.state;

    const closeiconStyle = {
      position: 'absolute',
      top: '50%',
      right: '10px', // Adjust this value to move the icon horizontally
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: 'red', // Icon color
      fontSize: '16px'
    };


    return (

      <React.Fragment>
        <div className="topnav">
          <div className="container-fluid left-space">
            <nav
              className="navbar navbar-light navbar-expand-lg topnav-menu"
              id="navigation"
            >
              {this.state.user_id && this.state.user_type === "CSR" && this.state.user_type !== "b2bclient"
                ? (
                  <Collapse
                    isOpen={this.state.isMenuOpened}
                    className="navbar-collapse"
                    id="topnav-menu-content"
                  >
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/tests-offered-labhazir/${this.props.match.params.uuid}`
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
                            this.props.match.params.uuid
                              ? `/labs/${this.props.match.params.uuid}`
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
                            this.props.match.params.uuid
                              ? `/nearby-test/${this.props.match.params.uuid}`
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
                            this.props.match.params.uuid
                              ? `/nearby-profiles/${this.props.match.params.uuid}`
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
                            this.props.match.params.uuid
                              ? `/nearby-packages/${this.props.match.params.uuid}`
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
                            this.props.match.params.uuid
                              ? `/nearby-radiology/${this.props.match.params.uuid}`
                              : `/nearby-radiology`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Radiology</span>
                          {/* {this.props.t("Packages")} */}
                        </Link>
                      </li>

                      {this.state.user_id && this.state.user_type == "patient" && (
                        <li className="nav-item" style={{ animation: 'flickerAndMove 3s infinite linear' }}>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/test-appointments/${this.props.match.params.uuid}`
                                : `/test-appointments`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">My Appointments</span>

                          </Link>
                        </li>

                      )}
                    </ul>
                  </Collapse>
                ) : null}
              {!this.state.user_id
                ? (
                  <Collapse
                    isOpen={this.state.isMenuOpened}
                    className="navbar-collapse"
                    id="topnav-menu-content"
                  >
                    <ul className="navbar-nav">
                      {this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/tests-offered-labhazir/${this.state.filnalurl}/${this.state.guest_id}`
                                : `/tests-offered-labhazir/${this.state.filnalurl}/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Book a Test</span>
                          </Link>
                        </li>
                      ) : !this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/tests-offered-labhazir/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/tests-offered-labhazir/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Book a Test</span>
                          </Link>
                        </li>
                      ) : null}
                      {this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/labs/${this.state.filnalurl}/${this.state.guest_id}`
                                : `/labs/${this.state.filnalurl}/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Labs</span>
                          </Link>
                        </li>
                      ) : !this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/labs/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/labs/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Labs</span>
                          </Link>
                        </li>
                      ) : null}

                      {this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-test/${this.state.filnalurl}/${this.state.guest_id}`
                                : `/nearby-test/${this.state.filnalurl}/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Tests</span>
                          </Link>
                        </li>
                      ) : !this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-test/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-test/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Tests</span>
                          </Link>
                        </li>
                      ) : null}

                      {this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-profiles/${this.state.filnalurl}/${this.state.guest_id}`
                                : `/nearby-profiles/${this.state.filnalurl}/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Profiles</span>
                          </Link>
                        </li>
                      ) : !this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-profiles/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-profiles/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Profiles</span>
                          </Link>
                        </li>
                      ) : null}

                      {this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-packages/${this.state.filnalurl}/${this.state.guest_id}`
                                : `/nearby-packages/${this.state.filnalurl}/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Packages</span>
                          </Link>
                        </li>
                      ) : !this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-packages/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-packages/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Packages</span>
                          </Link>
                        </li>
                      ) : null}

                      {this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-radiology/${this.state.filnalurl}/${this.state.guest_id}`
                                : `/nearby-radiology/${this.state.filnalurl}/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Radiology</span>
                          </Link>
                        </li>
                      ) : !this.state.filnalurl && this.state.guest_id ? (
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-radiology/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-radiology/${this.state.guest_id}`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Radiology</span>
                          </Link>
                        </li>
                      ) : null}


                      {this.state.user_id && this.state.user_type == "patient" && (
                        <li className="nav-item" style={{ animation: 'flickerAndMove 3s infinite linear' }}>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/test-appointments/${this.props.match.params.uuid}`
                                : `/test-appointments`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">My Appointments</span>

                          </Link>
                        </li>

                      )}
                    </ul>
                  </Collapse>

                ) :
                this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type !== "b2bclient" ? (
                  <Collapse
                    isOpen={this.state.isMenuOpened}
                    className="navbar-collapse"
                    id="topnav-menu-content"
                  >
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/tests-offered-labhazir/${this.props.match.params.uuid}`
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
                            this.props.match.params.uuid
                              ? `/labs/${this.props.match.params.uuid}`
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
                            this.props.match.params.uuid
                              ? `/nearby-test/${this.props.match.params.uuid}`
                              : `/nearby-test`
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
                            this.props.match.params.uuid
                              ? `/nearby-profiles/${this.props.match.params.uuid}`
                              : `/nearby-profiles`
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
                            this.props.match.params.uuid
                              ? `/nearby-packages/${this.props.match.params.uuid}`
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
                            this.props.match.params.uuid
                              ? `/nearby-radiology/${this.props.match.params.uuid}`
                              : `/nearby-radiology`
                          }
                          className="dropdown-item"
                        >
                          <span className="pt-4 font-size-12">Radiology</span>
                          {/* {this.props.t("Packages")} */}
                        </Link>
                      </li>


                      {this.state.user_id && this.state.user_type == "patient" && (
                        <li className="nav-item" style={{ animation: 'flickerAndMove 3s infinite linear' }}>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/test-appointments/${this.props.match.params.uuid}`
                                : `/test-appointments`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">My Appointments</span>

                          </Link>
                        </li>




                      )}
                    </ul>
                  </Collapse>
                ) :
                  this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type === "b2bclient" ? (
                    <Collapse
                      isOpen={this.state.isMenuOpened}
                      className="navbar-collapse"
                      id="topnav-menu-content"
                    >
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/tests-offered-labhazir/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
                                : `/tests-offered-labhazir/`
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
                              this.props.match.params.uuid
                                ? `/labs/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
                                : `/labs/`
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
                              this.props.match.params.uuid
                                ? `/nearby-test/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
                              this.props.match.params.uuid
                                ? `/nearby-profiles/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
                              this.props.match.params.uuid
                                ? `/nearby-packages/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
                              this.props.match.params.uuid
                                ? `/nearby-radiology/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
                                : `/nearby-radiology/`
                            }
                            className="dropdown-item"
                          >
                            <span className="pt-4 font-size-12">Radiology</span>
                            {/* {this.props.t("Packages")} */}
                          </Link>
                        </li>

                        {this.state.user_id && this.state.user_type == "patient" && (
                          <li className="nav-item" style={{ animation: 'flickerAndMove 3s infinite linear' }}>
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/test-appointments/${this.props.match.params.uuid}`
                                  : `/test-appointments`
                              }
                              className="dropdown-item"
                            >
                              <span className="pt-4 font-size-12">My Appointments</span>

                            </Link>
                          </li>
                        )}
                      </ul>
                    </Collapse>
                  ) : null}
            </nav>
          </div>
        </div>
        <header id="page-topbaar">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box">
                {!isSmallScreen ? (
                  <Link
                    to={
                      this.props.match.params.uuid
                        ? `/nearby-labs/${this.state.guest_id}/${this.props.match.params.uuid}`
                        : `/nearby-labs/${this.state.guest_id}`
                    }
                    className="logo logo-dark"
                  >
                    <span className="logo-sm">
                      <img src={logo} alt="" height="40" />
                    </span>
                    <span className="logo-lg">
                      <img src={logoLight} alt="" height="60" />
                    </span>
                  </Link>
                ) : null}
              </div>
              {/* // for mobile app */}
              {isSmallScreen ? (
                <button
                  type="button"
                  className="btn btn-sm pl-5 font-size-16 d-lg-none header-item"
                  style={{ left: "12px" }} // Set left position to 10 pixels
                  data-toggle="collapse"
                  onClick={this.openMenu}
                  data-target="#topnav-menu-content"
                >
                  <i className="fa fa-fw fa-bars" />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-sm pl-5 font-size-16 d-lg-none header-item"
                  data-toggle="collapse"
                  onClick={this.openMenu}
                  data-target="#topnav-menu-content"
                >
                  <i className="fa fa-fw fa-bars" />
                </button>
              )}
            </div>

            <div className="d-flex">
              {!this.state.user_id ? (
                <div className="dropdown d-lg-inline-block ms-4 mt-4">
                  <Tooltip title="Cart">
                    <Link
                      to={
                        this.props.match.params.uuid
                          ? `/cart/${this.state.guest_id}/${this.props.match.params.uuid}`
                          : `/cart/${this.state.guest_id}`
                      }
                      className="btn header-items noti-icon right-bar-toggle d-none"
                    >
                      <i className="mdi mdi-cart align-middle me-1 font-size-20" />{" "}
                      {/* {!isEmpty(this.props.carts) &&
                        
                          this.props.carts.slice(-1).pop().cart_quantity+this.state.count
                          } */}
                    </Link>
                  </Tooltip>
                  <Tooltip title="Login">
                    <Link
                      to={
                        this.props.match.params.uuid
                          ? `/login/${this.state.guest_id}/${this.props.match.params.uuid}`
                          : `/login/${this.state.guest_id}`
                      }
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-account-arrow-right align-middle me-1 font-size-20" />{" "}
                      <span className="pt-4 font-size-12">Login</span>
                    </Link>
                  </Tooltip>
                  <Tooltip title="Sign up">
                    <Link
                      to={
                        this.props.match.params.uuid
                          ? `/register/${this.state.guest_id}/${this.props.match.params.uuid}`
                          : `/register/${this.state.guest_id}`
                      }
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-account-plus align-middle me-1 font-size-20" />{" "}
                      <span className="pt-4 font-size-12">Sign up</span>
                    </Link>
                  </Tooltip>
                  <Tooltip title="Help and Support">
                    <Link
                      // to="/contact-us"
                      to={
                        this.props.match.params.uuid
                          ? `/contact-us/${this.props.match.params.uuid}`
                          : `/contact-us`
                      }
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="fas fa-headset align-middle me-1 mt-1 font-size-20" />{" "}
                    </Link>
                  </Tooltip>
                </div>
              ) : this.state.user_type == "patient" ? (
                <Header />
              ) : (
                <div className="dropdown d-lg-inline-block ms-3 mt-3">
                  {this.state.user_type == "labowner" && (
                    <Link
                      to={"/dashboard-lab"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "b2bclient" && (
                    <Link
                      to={"/dashboard-b2bclient"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "auditor" && (
                    <Link
                      to={"/dashboard-auditor"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "CSR" && (
                    <div className="dropdown d-lg-inline-block ms-4 mt-4">
                      <Link
                        to={"/dashboard-csr"}
                        className="btn header-items noti-icon right-bar-toggle"
                      >
                        <i className="mdi mdi-home me-1 font-size-24" />{" "}
                      </Link>
                      <Link
                        to={
                          this.props.match.params.uuid
                            ? `/cart/${this.props.match.params.uuid}`
                            : `/cart`
                        }
                        className="btn header-items noti-icon right-bar-toggle"
                      >
                        <i className="mdi mdi-cart align-middle me-1 font-size-20" />{" "}
                        {!isEmpty(this.props.carts) &&
                          <span
                            style={{
                              verticalAlign: '0.9em',
                              fontSize: '0.6em',
                            }}
                          >
                            this.props.carts.slice(-1).pop().cart_quantity +
                            this.state.count
                          </span>

                        }
                      </Link>
                    </div>
                  )}

                  {this.state.user_type == "registration-admin" && (
                    <Link
                      to={"/pending-labs"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "auditor-admin" && (
                    <Link
                      to={"/pending-audits"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "csr-admin" && (
                    <Link
                      to={"/pending-complaints-lab"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "hr-admin" && (
                    <Link
                      to={"/add-staff"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}

                  {this.state.user_type == "marketer-admin" && (
                    <Link
                      to={"/discount-labhazir"}
                      className="btn header-items noti-icon right-bar-toggle"
                    >
                      <i className="mdi mdi-home me-1 font-size-24" />{" "}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
        <Modal
          isOpen={this.state.PatientModal}
          className={this.props.className}
        >
          <ModalHeader toggle={this.togglePatientModal}>
            <h2 style={{ fontSize: "16px" }}>How to enable location access on your browser</h2>
          </ModalHeader>
          <ModalBody>
            <Formik>
              <Form>
                <Row>
                  <Col className="col-12">
                    <p className="font-size-15 font-weight-bold">On your Chrome browser</p>
                    <p style={{ fontSize: "14px", marginLeft: "15px" }}>
                      <stront className="font-size-16 font-weight-bold">1.</stront>   To the left of the address bar, click the Padlock icon <i className="fas fa-lock" style={{ fontSize: '14px' }}></i> {" "}<br></br>
                      <span style={{ fontSize: "14px", marginLeft: "15px" }}>then select &ldquo;Site Settings.&rdquo;</span>
                    </p>
                    <p style={{ fontSize: "14px", marginLeft: "15px" }}>
                      <stront className="font-size-16 font-weight-bold">2.</stront>   Under Permissions, find Location and change it to
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
        {!isSmallScreen && isEmpty(this.props.advLives) && isEmpty(regionWiseAdvertisement) ? (
          <div className="page-content">
            <Container fluid>
              {/* <Breadcrumbs
                // title="Filter Labs by"
                breadcrumbItem="Filter Labs by"
              /> */}
              {/* <h5>Need Some Better?</h5>
              <h2>&ldquo;Let&apos;s find the labs,&rdquo;</h2> */}
              <Row>
                <span className="mb-1" style={{ fontSize: "14px" }}><span>Filter Labs by:</span>
                  {/* {this.state.locationAccessAllowed === true ? (
                    <a
                      onClick={this.toggleDivVisibility}
                      className="text-danger"
                      style={{ cursor: "pointer", textDecoration: "underline", color: "inherit" }}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#DDEEFA"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                    >
                      {this.state.address}
                    </a>
                  ) : (this.state.locationAccessAllowed === false ? (
                    <a
                      onClick={() => this.setState({ PatientModal: true })}
                      // className="text-danger"
                      style={{ cursor: "pointer", textDecoration: "underline", color: "inherit" }}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#DDEEFA"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                    >
                      <span >We&apos;re having trouble finding you. Check your connection and location access.  </span>
                      <span className="text-decoration-underline text-danger">
                        See how to enable location access.
                      </span>
                    </a>
                  ) : null
                  )} */}
                </span>
                {this.state.isDivVisible && (
                  <div className="mb-2">
                    <Input
                      defaultValue={this.state.address}
                      onChange={(e) => this.onChangeAddress(e)}
                      id="pac-input"
                      type="text"
                      className="form-control"
                      placeholder="Enter Custom Address"
                    />
                  </div>
                )}

                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    search_type: (this.state && this.state.search_type) || "",
                    city: (this.state && this.state.city) || "",
                    location: (this.state && this.state.location) || "",
                    LabType: (this.state && this.state.LabType) || "",
                    km: (this.state && this.state.km) || "30",
                    name: (this.state && this.state.name) || "",
                  }}
                  validationSchema={Yup.object().shape({
                    city: Yup.string().when("search_type", {
                      is: val => val === "Custom Address",
                      then: Yup.string().required("Please enter your City"),
                    }),
                    location: Yup.string().when("city", {
                      is: val => val !== "",
                      then: Yup.string().required("Please enter your Location"),
                    }),
                  })}
                >
                  {({ errors, status, touched }) => (
                    <Row>
                      {this.state.locationAccessAllowed === true ? (
                        <Col xs="3" sm="3" md="2" lg="2">
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
                                borderRadius: '5px',
                                // Add more style overrides as needed
                              }}
                            >
                              <option value="Current Location">Current Location</option>
                              <option value="City">Search By City</option>
                              <option value="Custom Address">Custom Address</option>
                            </Field>
                          </div>
                        </Col>
                      ) : (
                        <Col xs="3" sm="3" md="2" lg="2">
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
                                borderRadius: '5px',
                                // Add more style overrides as needed
                              }}
                            >
                              <option value="">Choose an option</option>
                              <option value="Current Location">
                                Current Location
                              </option>
                              <option value="City">Search By City</option>
                              <option value="Custom Address">Custom Address</option>
                            </Field>
                          </div>
                        </Col>
                      )}
                      {this.state.search_type === 'City' && (
                        <Col xs="3" sm="3" md="2" lg="2">
                          <div className="mb-3">
                            {/* <Label
                                  for="LabType1"
                                  className="form-label"
                                  style={{
                                    fontSize: window.innerWidth <= 576 ? '8px' : '12px',
                                    color: 'black',
                                  fontWeight: "bold",
                                  }}
                                >
                                  <span style={{ fontSize: '12px' }}>By City </span>
                                </Label> */}
                            <Select
                              name="city"
                              component="Select"
                              onChange={this.onChangeCity}
                              className="defautSelectParent is-invalid"
                              options={cityList}
                              placeholder="City Name.."

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
                      {this.state.search_type === 'Custom Address' && (
                        <Col xs="3" sm="3" md="2" lg="2">
                          <div className="mb-3">
                            {/* <Label
                                  for="LabType1"
                                  className="form-label"
                                  style={{
                                    fontSize: window.innerWidth <= 576 ? '8px' : '12px',
                                    color: 'black',
                                  fontWeight: "bold",
                                  }}
                                >
                                  <span style={{ fontSize: '12px', }}>Custom Address </span>
                                </Label> */}
                            <Input
                              defaultValue={this.state.address}
                              onChange={(e) => this.onChangeAddress(e)}
                              id="pac-input"
                              type="text"
                              className="form-control"
                              placeholder="Enter Address.."
                              style={{
                                border: '2px solid yellow',
                                borderRadius: '5px',
                                // Add more style overrides as needed
                              }}
                            />
                          </div>
                        </Col>
                      )}
                      {this.state.search_type === 'Custom Address' ? (
                        <Col xs="1" sm="2" md="1" lg="1">
                          <div className="mb-3">
                            <div className="input-group">
                              <Input
                                defaultValue={this.state.km}
                                onChange={(e) => this.onChangeKm(e)}
                                id="pac-input"
                                type="number"
                                className="form-control"
                                placeholder=""
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
                      ) : (this.state.search_type === 'Current Location' && (
                        <Col xs="1" sm="2" md="1" lg="1">
                          <div className="mb-3">
                            <div className="input-group">
                              <Input
                                defaultValue={this.state.km}
                                onChange={(e) => this.onChangeKm(e)}
                                id="pac-input"
                                type="number"
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
                      )
                      )}
                      <Col xs="4" sm="4" md="3" lg="3">
                        <div className="mb-3">
                          {/* <Label
                                for="LabType"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                                  color: 'black',
                                  fontWeight: "bold",
                                }}
                              >
                                Search By Lab Name
                              </Label> */}
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
                                border: '2px solid blue',
                                borderRadius: '5px',
                              }),
                              // Add more style overrides as needed
                            }}
                          />
                        </div>
                      </Col>

                      {this.state.locationAccessAllowed === true ? (
                        <Col xs="3" sm="3" md="2" lg="2">
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
                        </Col>
                      ) : 
                        (
                          <Col xs="3" sm="3" md="2" lg="2">
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
                  )}
                </Formik>

              </Row>
              <Row>
                {!isEmpty(nearbyLabs) &&
                  !this.state.user_id &&
                  nearbyLabs.map((nearbyLab, key) => (
                    <Col xl="4" sm="6" key={"_col_" + key}>
                      <Card
                        onClick={() =>
                          history.push(
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                          )
                        } style={{ height: "95%" }}
                      >
                        <CardBody>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
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
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
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

                            {!nearbyLab.is_247_opened &&
                              nearbyLab.opening_time && (
                                <div className="my-0">
                                  <span className="text-muted me-2">
                                    <i className="mdi mdi-timer"></i>{" "}
                                    {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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

                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-phone"></i>{" "}
                                {nearbyLab.landline}
                              </span>
                            </div>
                            {nearbyLab.female_collectors == "Yes" && (
                              <div className="my-0">
                                <span className="text-danger">
                                  <i className="mdi mdi-account-question"></i>{" "}
                                  Lab has female sample collectors
                                </span>
                              </div>
                            )}
                            <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                              <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                              <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                                <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                  {nearbyLab && nearbyLab.rating && (
                                    <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                  )}
                                </span>
                              </Col>
                            </Row>

                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                  : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                              }
                            >
                              <div className="my-0 mt-3">
                                <span className="me-2" style={{ color: 'blue' }}>
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
                    <Col xl="4" sm="9" key={"col" + key}>
                      <Card
                        onClick={() =>
                          history.push(
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}`
                          )
                        } style={{ height: "95%" }}
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

                            {!nearbyLab.is_247_opened &&
                              nearbyLab.opening_time && (
                                <div className="my-0">
                                  <span className="text-muted me-2">
                                    <i className="mdi mdi-timer"></i>{" "}
                                    {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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
                            {/* {nearbyLab.email ? (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-email"></i>{" "}
                                  {nearbyLab.email}
                                </span>
                              </div>) : null} */}
                            {nearbyLab.phone ? (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="bx bx-mobile"></i>{" "}
                                  {nearbyLab.phone}
                                </span>
                              </div>) : null}
                            {nearbyLab.landline ? (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-phone"></i>{" "}
                                  {nearbyLab.landline}
                                </span>
                              </div>) : null}
                            {nearbyLab.female_collectors == "Yes" && (
                              <div className="my-0">
                                <span className="text-danger">
                                  <i className="mdi mdi-account-question"></i>{" "}
                                  Lab has female sample collectors
                                </span>
                              </div>
                            )}
                            <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                              <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                              <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                                <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                  {nearbyLab && nearbyLab.rating && (
                                    <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                  )}
                                </span>
                              </Col>
                            </Row>

                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                  : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                              }
                            >
                              <div className="my-0 mt-3">
                                <span className="me-2" style={{ color: 'blue' }}>
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
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}`
                          )
                        } style={{ height: "95%" }}
                      >
                        <CardBody>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
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

                            {!nearbyLab.is_247_opened &&
                              nearbyLab.opening_time && (
                                <div className="my-0">
                                  <span className="text-muted me-2">
                                    <i className="mdi mdi-timer"></i>{" "}
                                    {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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
                              </div>) : null}
                            {nearbyLab.female_collectors == "Yes" && (
                              <div className="my-0">
                                <span className="text-danger">
                                  <i className="mdi mdi-account-question"></i>{" "}
                                  Lab has female sample collectors
                                </span>
                              </div>
                            )}
                            <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                              <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                              <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                                <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                  {nearbyLab && nearbyLab.rating && (
                                    <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                  )}
                                </span>
                              </Col>
                            </Row>
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                  : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                              }
                            >
                              <div className="my-0 mt-3">
                                <span className="me-2" style={{ color: 'blue' }}>
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
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}`
                          )
                        } style={{ height: "95%" }}
                      >
                        <CardBody>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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

                            {!nearbyLab.is_247_opened &&
                              nearbyLab.opening_time && (
                                <div className="my-0">
                                  <span className="text-muted me-2">
                                    <i className="mdi mdi-timer"></i>{" "}
                                    {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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
                              </div>) : null}
                            {nearbyLab.female_collectors == "Yes" && (
                              <div className="my-0">
                                <span className="text-danger">
                                  <i className="mdi mdi-account-question"></i>{" "}
                                  Lab has female sample collectors
                                </span>
                              </div>
                            )}
                            <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                              <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                              <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                                <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                  {nearbyLab && nearbyLab.rating && (
                                    <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                  )}
                                </span>
                              </Col>
                            </Row>                   <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                  : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                              }
                            >
                              <div className="my-0 mt-3">
                                <span className="me-2" style={{ color: 'blue' }}>
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
                {isEmpty(nearbyLabs) && (
                  loading ? (
                    <Row>
                      <Col lg="12">
                        <div className="mb-5" style={{ fontSize: '24px' }}>
                          Please Wait.....
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    <Row>
                      <Col lg="12">
                        <div className="mb-5" style={{ fontSize: '24px', color: 'red' }}>
                          Sorry, No Labs Found In Your Specific Area.....
                        </div>
                      </Col>
                    </Row>
                  )
                )}

                <ScrollButton />
              </Row>
            </Container>
          </div>
        ) : null}
        
        {!isSmallScreen &&
          (!isEmpty(this.props.advLives) ||
            !isEmpty(regionWiseAdvertisement)) ? (
          <div className="page-content">
            <MetaTags>
              <title>Nearby Labs | Lab Hazir - Dashboard</title>
            </MetaTags>
            <Row style={{ marginLeft: "20px", marginRight: "20px", marginTop: "-20px" }}>
              {/* <Breadcrumbs
                title="Lab Marketplace"
                breadcrumbItem="Nearby Labs"
              /> */}
              <Col lg="9">
                <Row>
                  <span className="mb-1" style={{ fontSize: "14px" }}><span>Filter Labs by: </span>
                    {/* {this.state.locationAccessAllowed === true ? (
                      <a
                        onClick={this.toggleDivVisibility}
                        className="text-danger"
                        style={{ cursor: "pointer", textDecoration: "underline", color: "inherit" }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#DDEEFA"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                      >
                        {this.state.address}
                      </a>
                    ) : (this.state.locationAccessAllowed === false ? (
                      <a
                        onClick={() => this.setState({ PatientModal: true })}
                        // className="text-danger"
                        style={{ cursor: "pointer", textDecoration: "underline", color: "inherit" }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#DDEEFA"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                      >
                        <span >We&apos;re having trouble finding you. Check your connection and location access.  </span>
                        <span className="text-decoration-underline text-danger">
                          See how to enable location access.
                        </span>
                      </a>
                    ) : null
                    )} */}
                  </span>
                  {this.state.isDivVisible && (
                    <div className="mb-2">
                      <Input
                        defaultValue={this.state.address}
                        onChange={(e) => this.onChangeAddress(e)}
                        id="pac-input"
                        type="text"
                        className="form-control"
                        placeholder="Enter Custom Address"
                      />
                    </div>
                  )}
                  {/* <Card style={{ alignContent: "center", display: "flex", marginTop: "7px" }}> */}
                  <Formik
                    enableReinitialize={true}
                    initialValues={{
                      // search_type: (this.state && this.state.search_type) || "Current Location",
                      city: (this.state && this.state.city) || "",
                      location: (this.state && this.state.location) || "",
                      LabType: (this.state && this.state.LabType) || "",
                      km: (this.state && this.state.km) || "30",
                      name: (this.state && this.state.name) || "",
                    }}
                    validationSchema={Yup.object().shape({
                      city: Yup.string().when("search_type", {
                        is: val => val === "Custom Address",
                        then: Yup.string().required("Please enter your City"),
                      }),
                      location: Yup.string().when("city", {
                        is: val => val !== "",
                        then: Yup.string().required("Please enter your Location"),
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
                                    borderRadius: '5px',
                                    // Add more style overrides as needed
                                  }}
                                >
                                  <option value="Current Location">Current Location</option>
                                  <option value="City">Search By City</option>
                                  <option value="Custom Address">Custom Address</option>
                                </Field>
                              </div>
                            </Col>
                          ) : (
                            <Col xs="3" sm="3" md="2" lg="2">
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
                                    borderRadius: '5px',
                                    // Add more style overrides as needed
                                  }}
                                >
                                  <option value="">Choose an option</option>
                                  <option value="Current Location">
                                    Current Location
                                  </option>
                                  <option value="City">Search By City</option>
                                  <option value="Custom Address">Custom Address</option>
                                </Field>
                              </div>
                            </Col>
                          )}
                          {this.state.search_type === 'City' && (
                            <Col xs="3" sm="3" md="2" lg="2">
                              <div className="mb-3">
                                {/* <Label
                                  for="LabType1"
                                  className="form-label"
                                  style={{
                                    fontSize: window.innerWidth <= 576 ? '8px' : '12px',
                                    color: 'black',
                                  fontWeight: "bold",
                                  }}
                                >
                                  <span style={{ fontSize: '12px' }}>By City </span>
                                </Label> */}
                                <Select
                                  name="city"
                                  component="Select"
                                  onChange={this.onChangeCity}
                                  className="defautSelectParent is-invalid"
                                  options={cityList}
                                  placeholder="City Name.."
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
                          {this.state.search_type === 'Custom Address' && (
                            <Col xs="3" sm="3" md="2" lg="2">
                              <div className="mb-3">
                                {/* <Label
                                  for="LabType1"
                                  className="form-label"
                                  style={{
                                    fontSize: window.innerWidth <= 576 ? '8px' : '12px',
                                    color: 'black',
                                  fontWeight: "bold",
                                  }}
                                >
                                  <span style={{ fontSize: '12px', }}>Custom Address </span>
                                </Label> */}
                                <Input
                                  defaultValue={this.state.address}
                                  onChange={(e) => this.onChangeAddress(e)}
                                  id="pac-input"
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Address.."
                                  style={{
                                    border: '2px solid yellow',
                                    borderRadius: '5px',
                                    // Add more style overrides as needed
                                  }}
                                />
                              </div>
                            </Col>
                          )}
                          {this.state.search_type === 'Custom Address' ? (
                            <Col xs="1" sm="2" md="1" lg="1">
                              <div className="mb-3">
                                <div className="input-group">
                                  <Input
                                    defaultValue={this.state.km}
                                    onChange={(e) => this.onChangeKm(e)}
                                    id="pac-input"
                                    type="number"
                                    className="form-control"
                                    placeholder=""
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
                          ) : (this.state.search_type === 'Current Location' && (
                            <Col xs="1" sm="2" md="1" lg="1">
                              <div className="mb-3">
                                <div className="input-group">
                                  <Input
                                    defaultValue={this.state.km}
                                    onChange={(e) => this.onChangeKm(e)}
                                    id="pac-input"
                                    type="number"
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
                          )
                          )
                          }
                          <Col xs="4" sm="4" md="3" lg="3">
                            <div className="mb-3">
                              {/* <Label
                                for="LabType"
                                className="form-label"
                                style={{
                                  fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                                  color: 'black',
                                  fontWeight: "bold",
                                }}
                              >
                                Search By Lab Name
                              </Label> */}
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
                                    border: '2px solid blue',
                                    borderRadius: '5px',
                                  }),
                                  // Add more style overrides as needed
                                }}
                              />
                            </div>
                          </Col>
                          {this.state.locationAccessAllowed === true ? (
                            <Col xs="3" sm="3" md="2" lg="2">
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
                            </Col>
                          ) : null
                            // (
                            //   <Col xs="3" sm="3" md="2" lg="2">
                            //     <div className="mb-3">
                            //       {/* <Label
                            //       for="LabType2"
                            //       className="form-label"
                            //       style={{
                            //         fontSize: window.innerWidth <= 576 ? '7px' : '12px',
                            //         color: 'black',
                            //         fontWeight: "bold",
                            //       }}
                            //     >
                            //       Search By Labs Type
                            //     </Label> */}
                            //       <Field
                            //         name="LabType"
                            //         component="select"
                            //         onChange={(e) => this.onChangeType(e)}
                            //         value={this.state.LabType}
                            //         className="form-select"
                            //         style={{
                            //           border: '2px solid blue',
                            //           borderRadius: '5px',
                            //           // Add more style overrides as needed
                            //         }}
                            //       >
                            //         <option value="Others">Both</option>
                            //         <option value="Main">Main Labs</option>
                            //         <option value="Collection">Collection Points</option>
                            //       </Field>
                            //     </div>
                            //   </Col>
                            // )
                          }
                        </Row>
                      </Form>
                    )}
                  </Formik>
                  {/* </Card> */}

                </Row>

                <Row>
                  {!isEmpty(nearbyLabs) &&
                    !this.state.user_id &&
                    nearbyLabs.map((nearbyLab, key) => (
                      <Col xl="4" sm="6" key={"_col_" + key}>
                        <Card
                          onClick={() =>
                            history.push(
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                            )
                          } style={{ height: "95%" }}
                        >
                          <CardBody>
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                  : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
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
                                  marginLeft: "30%",
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

                            <div className="text-center">
                              <h5 className="mb-3 text-truncate" style={{ fontWeight: "bold" }}>
                                <Link
                                  to={
                                    this.props.match.params.uuid
                                      ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                      : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
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

                              {!nearbyLab.is_247_opened &&
                                nearbyLab.opening_time && (
                                  <div className="my-0">
                                    <span className="text-muted me-2">
                                      <i className="mdi mdi-timer"></i>{" "}
                                      {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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
                                </div>) : null}
                              {nearbyLab.female_collectors == "Yes" && (
                                <div className="my-0">
                                  <span className="text-danger">
                                    <i className="mdi mdi-account-question"></i>{" "}
                                    Lab has female sample collectors
                                  </span>
                                </div>
                              )}
                              <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                                <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                                <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                                  <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                    {nearbyLab && nearbyLab.rating && (
                                      <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                    )}
                                  </span>
                                </Col>
                              </Row>
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                                }
                              >
                                <div className="my-0 mt-3">
                                  <span className="me-2" style={{ color: 'blue' }}>
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
                      <Col xl="4" sm="9" key={"col" + key}>
                        <Card
                          onClick={() =>
                            history.push(
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}`
                            )
                          } style={{ height: "95%" }}
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

                              {!nearbyLab.is_247_opened &&
                                nearbyLab.opening_time && (
                                  <div className="my-0">
                                    <span className="text-muted me-2">
                                      <i className="mdi mdi-timer"></i>{" "}
                                      {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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

                              {nearbyLab.phone ? (
                                <div className="my-0">
                                  <span className="text-muted me-2">
                                    <i className="bx bx-mobile"></i>{" "}
                                    {nearbyLab.phone}
                                  </span>
                                </div>) : null}

                              {nearbyLab.landline ? (
                                <div className="my-0">
                                  <span className="text-muted me-2">
                                    <i className="mdi mdi-phone"></i>{" "}
                                    {nearbyLab.landline}
                                  </span>
                                </div>) : null}
                              {nearbyLab.female_collectors == "Yes" && (
                                <div className="my-0">
                                  <span className="text-danger">
                                    <i className="mdi mdi-account-question"></i>{" "}
                                    Lab has female sample collectors
                                  </span>
                                </div>
                              )}
                              <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                                <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                                <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                                  <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                    {nearbyLab && nearbyLab.rating && (
                                      <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                    )}
                                  </span>
                                </Col>
                              </Row>                      <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                                }
                              >
                                <div className="my-0 mt-3">
                                  <span className="me-2" style={{ color: 'blue' }}>
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
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}`
                            )
                          } style={{ height: "95%" }}
                        >
                          <CardBody>
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
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

                              {!nearbyLab.is_247_opened &&
                                nearbyLab.opening_time && (
                                  <div className="my-0">
                                    <span className="text-muted me-2">
                                      <i className="mdi mdi-timer"></i>{" "}
                                      {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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
                                </div>) : null}
                              {nearbyLab.female_collectors == "Yes" && (
                                <div className="my-0">
                                  <span className="text-danger">
                                    <i className="mdi mdi-account-question"></i>{" "}
                                    Lab has female sample collectors
                                  </span>
                                </div>
                              )}
                              <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                                <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                                <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                                  <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                    {nearbyLab && nearbyLab.rating && (
                                      <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                    )}
                                  </span>
                                </Col>
                              </Row>
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                                }
                              >
                                <div className="my-0 mt-3">
                                  <span className="me-2" style={{ color: 'blue' }}>
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
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}`
                            )
                          } style={{ height: "95%" }}
                        >
                          <CardBody>
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
                                    this.props.match.params.uuid
                                      ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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

                              {!nearbyLab.is_247_opened &&
                                nearbyLab.opening_time && (
                                  <div className="my-0">
                                    <span className="text-muted me-2">
                                      <i className="mdi mdi-timer"></i>{" "}
                                      {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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
                                </div>) : null}
                              {nearbyLab.female_collectors == "Yes" && (
                                <div className="my-0">
                                  <span className="text-danger">
                                    <i className="mdi mdi-account-question"></i>{" "}
                                    Lab has female sample collectors
                                  </span>
                                </div>
                              )}
                              <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                                <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                                <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                                  <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                    {nearbyLab && nearbyLab.rating && (
                                      <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                    )}
                                  </span>
                                </Col>
                              </Row>
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                                }
                              >
                                <div className="my-0 mt-3">
                                  <span className="me-2" style={{ color: 'blue' }}>
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
                </Row>
                {isEmpty(nearbyLabs) && (
                  loading ? (
                    <Row>
                      <Col lg="12">
                        <div className="mb-5" style={{ fontSize: '24px' }}>
                          Please Wait.....
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    <Row>
                      <Col lg="12">
                        <div className="mb-5" style={{ fontSize: '24px', color: 'red' }}>
                          Sorry, No Labs Found In Your Specific Area.....
                        </div>
                      </Col>
                    </Row>
                  )
                )}
                <ScrollButton />
              </Col>
              <Col lg="3">
                <span style={{ fontSize: '18px', backgroundColor: '#3B71CA', color: 'white', borderRadius: '5px', padding: '0px 20px' }}>Advertisements</span>
                {!isEmpty(this.props.advLives) && Array.isArray(this.props.advLives) && (
                  this.props.advLives.map((advLive, key) => (
                    <Col className="mt-3" lg="9" key={"col" + key}>
                      <Link
                        to={
                          this.props.match.params.uuid
                            ? `/nearby-tests-discountedlh/${this.state.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-tests-discountedlh/${this.state.guest_id}`
                        }
                      >
                        <div>
                          {advLive.poster ? (
                            advLive.poster.match(/\.(jpeg|jpg|gif|png)$/) ? (
                              <img
                                src={
                                  process.env.REACT_APP_BACKENDURL + advLive.poster
                                }
                                alt="Advertisement"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "100%",
                                  objectFit: "cover",
                                }}
                                className="img-fluid mx-auto d-block"
                              />
                            ) : (
                              <video
                                width="100%"
                                height="100%"
                                controls
                                autoPlay={this.state.autoplay}
                                loop
                              >
                                <source
                                  src={process.env.REACT_APP_BACKENDURL + advLive.poster}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>

                              // <video width="100%" height="100%" controls autoPlay>
                              // <source
                              // src={
                              // process.env.REACT_APP_BACKENDURL + advLive.poster
                              // }
                              // type="video/mp4"
                              // />
                              // Your browser does not support the video tag.
                              // </video>
                            )
                          ) : (
                            <div>No media found.</div>
                          )}
                        </div>
                      </Link>
                    </Col>
                  ))
                )}
                {this.props.regionWiseAdvertisement.map((regionWiseAdvertisement, key) => (
                  <>
                    {regionWiseAdvertisement.nearby_adv_list.map(
                      (nearby_adv_list, key) => (
                        <Col className="mt-3" lg="9" key={"col" + key}>
                          {!isEmpty(regionWiseAdvertisement) && (
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearby_adv_list.account_id}/${this.props.match.params.uuid}`
                                  : `/nearby-lab-detail/${nearby_adv_list.account_id}`
                              }
                            >
                              {/* <div className="product-img position-relative">
                                  <img
                                    src={
                                      process.env.REACT_APP_BACKENDURL +
                                      nearby_adv_list.poster
                                    }
                                    alt="Advertisement"
                                    style={{
                                      width: "250px",
                                      height: "250px",
                                      objectFit: "cover",
                                    }}
                                    className="img-fluid mx-auto d-block" />
                                </div> */}
                              <div>
                                <img
                                  src={process.env.REACT_APP_BACKENDURL +
                                    nearby_adv_list.poster}
                                  alt="Lab Advertisement"
                                  // className=" text-end"
                                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: "cover" }}
                                />
                              </div>
                            </Link>
                          )}
                        </Col>
                      )
                    )}
                  </>
                ))}
              </Col>
            </Row>
          </div>
        ) : isSmallScreen &&
          isEmpty(this.props.advLives) &&
          isEmpty(regionWiseAdvertisement) &&
          this.state.user_type === "patient" ? (
          <div>
            <MetaTags>
              <title>Nearby Labs | Lab Hazir - Dashboard</title>
            </MetaTags>
            <Row style={{ marginTop: "80px", marginLeft: "20px", marginRight: "20px" }}>
            <Card className="mini-stats-wid" style={{ marginTop: "4px", marginBottom: "10px", padding: 0, backgroundColor: "transparent" }}>
  <CardBody>
    <h4>Categories</h4>
    <p className={"font-size-10"}>
      Sehatmand Pakistan, Khushhaal Pakistan: Aapki Sehat, Hamari Zimmedari!
    </p>

    {/* Horizontal Scrollable Row */}
    <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
      <Link to={this.props.match.params.uuid ? `/nearby-test/${this.props.match.params.uuid}` : `/nearby-test/`}>
        <div style={{ display: "inline-block", margin: "0 10px", textAlign: "center" }}>
          <div className="mini-stat-icon avatar-sm rounded-circle bg-white">
            <span className="avatar-title">
              <img src={mtest} alt="" height="60" />
            </span>
          </div>
          <p className="font-size-10 mt-1" style={{ color: "black" }}>
            Tests
          </p>
        </div>
      </Link>

      <Link to={this.props.match.params.uuid ? `/nearby-profiles/${this.props.match.params.uuid}` : `/nearby-profiles/`}>
        <div style={{ display: "inline-block", margin: "0 10px", textAlign: "center" }}>
          <div className="mini-stat-icon avatar-sm rounded-circle bg-white">
            <span className="avatar-title">
              <img src={mprofile} alt="" height="60" />
            </span>
          </div>
          <p className="font-size-10 mt-1" style={{ color: "black" }}>
            Profiles
          </p>
        </div>
      </Link>

      <Link to={this.props.match.params.uuid ? `/nearby-packages/${this.props.match.params.uuid}` : `/nearby-packages/`}>
        <div style={{ display: "inline-block", margin: "0 10px", textAlign: "center" }}>
          <div className="mini-stat-icon avatar-sm rounded-circle bg-white">
            <span className="avatar-title">
              <img src={mpackages} alt="" height="60" />
            </span>
          </div>
          <p className="font-size-10 mt-1" style={{ color: "black" }}>
            Packages
          </p>
        </div>
      </Link>

      <Link to={this.props.match.params.uuid ? `/nearby-radiology/${this.props.match.params.uuid}` : `/nearby-radiology/`}>
        <div style={{ display: "inline-block", margin: "0 10px", textAlign: "center" }}>
          <div className="mini-stat-icon avatar-sm rounded-circle bg-white">
            <span className="avatar-title">
              <img src={mradiology} alt="" height="60" />
            </span>
          </div>
          <p className="font-size-10 mt-1" style={{ color: "black" }}>
            Radiology
          </p>
        </div>
      </Link>

      <Link to={this.props.match.params.uuid ? `/nearby-packages/${this.props.match.params.uuid}` : `/nearby-packages/`}>
        <div style={{ display: "inline-block", margin: "0 10px", textAlign: "center" }}>
          <div className="mini-stat-icon avatar-sm rounded-circle bg-white">
            <span className="avatar-title">
              <img src={discount} alt="" height="60" />
            </span>
          </div>
          <p className="font-size-10 mt-1" style={{ color: "black" }}>
            Discounts
          </p>
        </div>
      </Link>

      <Link to={"/test-appointments"}>
        <div style={{ display: "inline-block", margin: "0 10px", textAlign: "center" }}>
          <div className="mini-stat-icon avatar-sm rounded-circle bg-white">
            <span className="avatar-title">
              <img src={mappointment} alt="" height="60" />
            </span>
          </div>
          <p className="font-size-10 mt-1" style={{ color: "black" }}>
            Appointments
          </p>
        </div>
      </Link>
    </div>
  </CardBody>
</Card>


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
                      <h4 style={{ background: "#3B71CA", color: "white", fontWeight: "bold" }}> Search Labs for more result in Pakistan!</h4>
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
                                    border: '2px solid blue',
                                    borderRadius: '5px',
                                  }),
                                }}
                                isSearchable={true}
                                isClearable={true}
                                components={{
                                  ClearIndicator,
                                }}
                              />
                            </div>
                          </Col>
                        
                        {(this.state.search_type === "Current Location" || this.state.search_type === "City" || this.state.search_type === "Custom Address") ? (
                          <Col xs="4" sm="4" md="3" lg="3">
                            <div className="mb-3">
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
                                  borderRadius: '5px',
                                  // Add more style overrides as needed
                                }}
                              >
                                <option value="Current Location">Current Location</option>
                                <option value="City">Search By City</option>
                                <option value="Custom Address">Custom Address</option>
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
                                  borderRadius: '5px',
                                  // Add more style overrides as needed
                                }}
                              >
                                <option value="">Choose an option</option>
                                <option value="Current Location">
                                  Current Location
                                </option>
                                <option value="City">Search By City</option>
                                <option value="Custom Address">Custom Address</option>
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
                                  type="number"  // Change "numbers" to "number"
                                  className="form-control"
                                  placeholder="Search By Km..."
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
                        {this.state.search_type === "Custom Address" && (
                          <Col xs="2" sm="2" md="2" lg="2">
                            <div className="mb-3">
                              <div className="input-group">
                                <Input
                                  defaultValue={this.state.km}
                                  onChange={e => this.onChangeKm(e)}
                                  id="pac-input"
                                  type="number"  // Change "numbers" to "number"
                                  className="form-control"
                                  placeholder="Search By Km..."
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
                                    border: '2px solid green',
                                    borderRadius: '5px',
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
                                  border: '2px solid yellow',
                                  borderRadius: '5px',
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
              {!isEmpty(nearbyLabs) &&
                !this.state.user_id &&
                nearbyLabs.map((nearbyLab, key) => (
                  <Col xl="4" sm="6" key={"_col_" + key}>
                    <Card
                      onClick={() =>
                        history.push(
                          this.props.match.params.uuid
                            ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                        )
                      } style={{ height: "95%" }}
                    >
                      <CardBody>
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
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
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                  : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
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
                            {/* <Tooltip title={nearbyLab.address}> */}
                            <span className="text-muted me-2">
                              <i className="mdi mdi-google-maps"></i>{" "}
                              {nearbyLab.address}
                            </span>
                            {/* </Tooltip> */}
                          </div>

                          {!nearbyLab.is_247_opened &&
                            nearbyLab.opening_time && (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-timer"></i>{" "}
                                  {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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
                            </div>) : null}
                          {nearbyLab.female_collectors == "Yes" && (
                            <div className="my-0">
                              <span className="text-danger">
                                <i className="mdi mdi-account-question"></i> Lab
                                has female sample collectors
                              </span>
                            </div>
                          )}
                          <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                            <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                            <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                              <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                {nearbyLab && nearbyLab.rating && (
                                  <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                )}
                              </span>
                            </Col>
                          </Row>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                            }
                          >
                            <div className="my-0 mt-3">
                              <span className="me-2" style={{ color: 'blue' }}>
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
                  <Col xl="4" sm="9" key={"col" + key}>
                    <Card
                      onClick={() =>
                        history.push(
                          this.props.match.params.uuid
                            ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                            : `/nearby-lab-detail/${nearbyLab.account_id}`
                        )
                      } style={{ height: "95%" }}
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

                          {!nearbyLab.is_247_opened &&
                            nearbyLab.opening_time && (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-timer"></i>{" "}
                                  {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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

                          {nearbyLab.phone ? (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="bx bx-mobile"></i>{" "}
                                {nearbyLab.phone}
                              </span>
                            </div>) : null}

                          {nearbyLab.landline ? (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-phone"></i>{" "}
                                {nearbyLab.landline}
                              </span>
                            </div>) : null}
                          {nearbyLab.female_collectors == "Yes" && (
                            <div className="my-0">
                              <span className="text-danger">
                                <i className="mdi mdi-account-question"></i> Lab
                                has female sample collectors
                              </span>
                            </div>
                          )}
                          <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                            <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                            <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                              <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                {nearbyLab && nearbyLab.rating && (
                                  <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                )}
                              </span>
                            </Col>
                          </Row>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                            }
                          >
                            <div className="my-0 mt-3">
                              <span className="me-2" style={{ color: 'blue' }}>
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
                          this.props.match.params.uuid
                            ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                            : `/nearby-lab-detail/${nearbyLab.account_id}`
                        )
                      } style={{ height: "95%" }}
                    >
                      <CardBody>
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
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

                          {!nearbyLab.is_247_opened &&
                            nearbyLab.opening_time && (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-timer"></i>{" "}
                                  {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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
                            </div>) : null}
                          {nearbyLab.female_collectors == "Yes" && (
                            <div className="my-0">
                              <span className="text-danger">
                                <i className="mdi mdi-account-question"></i> Lab
                                has female sample collectors
                              </span>
                            </div>
                          )}
                          <div className="my-0 mt-2">
                            <StarRatings
                              rating={nearbyLab.rating}
                              starRatedColor="#F1B44C"
                              starEmptyColor="#2D363F"
                              numberOfStars={5}
                              name="rating"
                              starDimension="14px"
                              starSpacing="3px"
                            />
                            {nearbyLab && nearbyLab.rating && (
                              <p> {nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            )}
                          </div>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                            }
                          >
                            <div className="my-0 mt-3">
                              <span className="me-2" style={{ color: 'blue' }}>
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
                          this.props.match.params.uuid
                            ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
                            : `/nearby-lab-detail/${nearbyLab.account_id}`
                        )
                      } style={{ height: "95%" }}
                    >
                      <CardBody>
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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

                          {!nearbyLab.is_247_opened &&
                            nearbyLab.opening_time && (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-timer"></i>{" "}
                                  {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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
                            </div>) : null}
                          {nearbyLab.female_collectors == "Yes" && (
                            <div className="my-0">
                              <span className="text-danger">
                                <i className="mdi mdi-account-question"></i> Lab
                                has female sample collectors
                              </span>
                            </div>
                          )}
                          <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                            <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                            <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                              <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                {nearbyLab && nearbyLab.rating && (
                                  <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                )}
                              </span>
                            </Col>
                          </Row>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                            }
                          >
                            <div className="my-0 mt-3">
                              <span className="me-2" style={{ color: 'blue' }}>
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
              {isEmpty(nearbyLabs) && (
                loading ? (
                  <Row>
                    <Col lg="12">
                      <div className="mb-5" style={{ fontSize: '24px' }}>
                        Please Wait.....
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col lg="12">
                      <div className="mb-5" style={{ fontSize: '24px', color: 'red' }}>
                        Sorry, No Labs Found In Your Specific Area.....
                      </div>
                    </Col>
                  </Row>
                )
              )}

              <ScrollButton />
            </Row>
          </div>
        ) : isSmallScreen &&
          isEmpty(this.props.advLives) &&
          isEmpty(regionWiseAdvertisement) ? (
          <div>
            <MetaTags>
              <title>Nearby Labs | Lab Hazir - Dashboard</title>
            </MetaTags>
            <Row
              style={{
                marginTop: "80px",
                marginLeft: "20px",
                marginRight: "20px",
              }}
            >
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
                      <h4 style={{ background: "#3B71CA", color: "white", fontWeight: "bold" }}> Search Labs for more result in Pakistan!</h4>
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
                                  border: '2px solid blue',
                                  borderRadius: '5px',
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
                                  borderRadius: '5px',
                                  // Add more style overrides as needed
                                }}
                              >
                                <option value="Current Location">Current Location</option>
                                <option value="City">Search By City</option>
                                <option value="Custom Address">Custom Address</option>
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
                                  borderRadius: '5px',
                                  // Add more style overrides as needed
                                }}
                              >
                                <option value="">Choose an option</option>
                                <option value="Current Location">
                                  Current Location
                                </option>
                                <option value="City">Search By City</option>
                                <option value="Custom Address">Custom Address</option>
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
                                  type="number"  // Change "numbers" to "number"
                                  className="form-control"
                                  placeholder="Search By Km..."
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
                        {this.state.search_type === "Custom Address" && (
                          <Col xs="2" sm="2" md="2" lg="2">
                            <div className="mb-3">
                              <div className="input-group">
                                <Input
                                  defaultValue={this.state.km}
                                  onChange={e => this.onChangeKm(e)}
                                  id="pac-input"
                                  type="number"  // Change "numbers" to "number"
                                  className="form-control"
                                  placeholder="Search By Km..."
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
                                    border: '2px solid green',
                                    borderRadius: '5px',
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
                                  border: '2px solid yellow',
                                  borderRadius: '5px',
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

              {!isEmpty(nearbyLabs) &&
                !this.state.user_id &&
                nearbyLabs.map((nearbyLab, key) => (
                  <Col xl="4" sm="6" key={"_col_" + key}>
                    <Card
                      onClick={() =>
                        history.push(
                          this.props.match.params.uuid
                            ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                        )
                      } style={{ height: "95%" }}
                    >
                      <CardBody>
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                              : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
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
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                  : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
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

                          {!nearbyLab.is_247_opened &&
                            nearbyLab.opening_time && (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-timer"></i>{" "}
                                  {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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
                            </div>) : null}
                          {nearbyLab.female_collectors == "Yes" && (
                            <div className="my-0">
                              <span className="text-danger">
                                <i className="mdi mdi-account-question"></i> Lab
                                has female sample collectors
                              </span>
                            </div>
                          )}
                          <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                            <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                            <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                              <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                {nearbyLab && nearbyLab.rating && (
                                  <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                )}
                              </span>
                            </Col>
                          </Row>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                            }
                          >
                            <div className="my-0 mt-3">
                              <span className="me-2" style={{ color: 'blue' }}>
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
                  <Col xl="4" sm="9" key={"col" + key}>
                    <Card
                      onClick={() =>
                        history.push(
                          this.props.match.params.uuid
                            ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                            : `/nearby-lab-detail/${nearbyLab.account_id}`
                        )
                      } style={{ height: "95%" }}
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

                          {!nearbyLab.is_247_opened &&
                            nearbyLab.opening_time && (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-timer"></i>{" "}
                                  {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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

                          {nearbyLab.phone ? (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="bx bx-mobile"></i>{" "}
                                {nearbyLab.phone}
                              </span>
                            </div>) : null}

                          {nearbyLab.landline ? (
                            <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-phone"></i>{" "}
                                {nearbyLab.landline}
                              </span>
                            </div>) : null}
                          {nearbyLab.female_collectors == "Yes" && (
                            <div className="my-0">
                              <span className="text-danger">
                                <i className="mdi mdi-account-question"></i> Lab
                                has female sample collectors
                              </span>
                            </div>
                          )}
                          <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                            <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                            <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                              <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                {nearbyLab && nearbyLab.rating && (
                                  <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                )}
                              </span>
                            </Col>
                          </Row>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                            }
                          >
                            <div className="my-0 mt-3">
                              <span className="me-2" style={{ color: 'blue' }}>
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
                          this.props.match.params.uuid
                            ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                            : `/nearby-lab-detail/${nearbyLab.account_id}`
                        )
                      } style={{ height: "95%" }}
                    >
                      <CardBody>
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
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

                          {!nearbyLab.is_247_opened &&
                            nearbyLab.opening_time && (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-timer"></i>{" "}
                                  {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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
                            </div>) : null}
                          {nearbyLab.female_collectors == "Yes" && (
                            <div className="my-0">
                              <span className="text-danger">
                                <i className="mdi mdi-account-question"></i> Lab
                                has female sample collectors
                              </span>
                            </div>
                          )}
                          <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                            <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                            <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                              <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                {nearbyLab && nearbyLab.rating && (
                                  <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                )}
                              </span>
                            </Col>
                          </Row>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                            }
                          >
                            <div className="my-0 mt-3">
                              <span className="me-2" style={{ color: 'blue' }}>
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
                          this.props.match.params.uuid
                            ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
                            : `/nearby-lab-detail/${nearbyLab.account_id}`
                        )
                      } style={{ height: "95%" }}
                    >
                      <CardBody>
                        <Link
                          to={
                            this.props.match.params.uuid
                              ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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

                          {!nearbyLab.is_247_opened &&
                            nearbyLab.opening_time && (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-timer"></i>{" "}
                                  {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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
                            </div>) : null}
                          {nearbyLab.female_collectors == "Yes" && (
                            <div className="my-0">
                              <span className="text-danger">
                                <i className="mdi mdi-account-question"></i> Lab
                                has female sample collectors
                              </span>
                            </div>
                          )}
                          <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                            <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                            <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                              <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                {nearbyLab && nearbyLab.rating && (
                                  <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                )}
                              </span>
                            </Col>
                          </Row>
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                            }
                          >
                            <div className="my-0 mt-3">
                              <span className="me-2" style={{ color: 'blue' }}>
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
              {isEmpty(nearbyLabs) && (
                loading ? (
                  <Row>
                    <Col lg="12">
                      <div className="mb-5" style={{ fontSize: '24px' }}>
                        Please Wait.....
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col lg="12">
                      <div className="mb-5" style={{ fontSize: '24px', color: 'red' }}>
                        Sorry, No Labs Found In Your Specific Area.....
                      </div>
                    </Col>
                  </Row>
                )
              )}
              <ScrollButton />
            </Row>
          </div>
        ) : isSmallScreen &&
          (!isEmpty(this.props.advLives) ||
            !isEmpty(regionWiseAdvertisement)) &&
          isEmpty(this.state.user_type) ? (
          <div>
            <MetaTags>
              <title>Nearby Labs | Lab Hazir - Dashboard</title>
            </MetaTags>
            <Row style={{ marginTop: "70px" }}>
              <Slider {...settings} appendDots={customDots}>
                {Array.isArray(this.props.advLives) && this.props.advLives.length > 0 ? (
                  this.props.advLives.map((advLive, key) => (
                    <div key={"advLive-" + key}>
                      <Link
                        to={
                          this.props.match.params.uuid
                            ? `/nearby-tests-discountedlh/${this.state.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-tests-discountedlh/${this.state.guest_id}`
                        }
                        style={sliderStyles}
                      >
                        {advLive.poster ? (
                          advLive.poster.match(/\.(jpeg|jpg|gif|png)$/) ? (
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                advLive.poster
                              }
                              alt="Advertisement"
                              style={sliderStyles}
                              className="img-fluid mx-auto d-block"
                            />
                          ) : (
                            <video
                              width="100%"
                              height="100%"
                              controls
                              autoPlay={this.state.autoplay}
                              loop
                              style={sliderStyles}
                              key={"video-" + key}
                            >
                              <source
                                src={
                                  process.env.REACT_APP_BACKENDURL +
                                  advLive.poster
                                }
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          )
                        ) : (
                          <div key={"no-media-" + key}>No media found.</div>
                        )}
                      </Link>
                    </div>
                  ))
                ) : (
                  <p>No advertisements available.</p>
                )}

                {this.props.regionWiseAdvertisement.map(
                  (regionWiseAdvertisement, key) => (
                    <div key={"regionWiseAdvertisement-" + key}>
                      {regionWiseAdvertisement.nearby_adv_list.map(
                        (nearby_adv_list, index) => (
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearby_adv_list.account_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearby_adv_list.account_id}`
                            }
                            style={sliderStyles}
                            key={"image-" + index}
                          >
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                nearby_adv_list.poster
                              }
                              alt="Lab Advertisement"
                              style={sliderStyles}
                            />
                          </Link>
                        )
                      )}
                    </div>
                  )
                )}
              </Slider>
            </Row>
            <Row style={{ marginLeft: "20px", marginRight: "20px" }}>
              <Col lg="9">
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
                        <h4 style={{ background: "#3B71CA", color: "white", fontWeight: "bold" }}> Search Labs for more result in Pakistan!</h4>
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
                                    border: '2px solid blue',
                                    borderRadius: '5px',
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
                                    borderRadius: '5px',
                                    // Add more style overrides as needed
                                  }}
                                >
                                  <option value="Current Location">Current Location</option>
                                  <option value="City">Search By City</option>
                                  <option value="Custom Address">Custom Address</option>
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
                                    borderRadius: '5px',
                                    // Add more style overrides as needed
                                  }}
                                >
                                  <option value="">Choose an option</option>
                                  <option value="Current Location">
                                    Current Location
                                  </option>
                                  <option value="City">Search By City</option>
                                  <option value="Custom Address">Custom Address</option>
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
                                    type="number"  // Change "numbers" to "number"
                                    className="form-control"
                                    placeholder="Search By Km..."
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
                          {this.state.search_type === "Custom Address" && (
                            <Col xs="2" sm="2" md="2" lg="2">
                              <div className="mb-3">
                                <div className="input-group">
                                  <Input
                                    defaultValue={this.state.km}
                                    onChange={e => this.onChangeKm(e)}
                                    id="pac-input"
                                    type="number"  // Change "numbers" to "number"
                                    className="form-control"
                                    placeholder="Search By Km..."
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
                                      border: '2px solid green',
                                      borderRadius: '5px',
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
                                    border: '2px solid yellow',
                                    borderRadius: '5px',
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

                <Row>
                  {!isEmpty(nearbyLabs) &&
                    !this.state.user_id &&
                    nearbyLabs.map((nearbyLab, key) => (
                      <Col xl="4" sm="6" key={"_col_" + key}>
                        <Card
                          onClick={() =>
                            history.push(
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                            )
                          } style={{ height: "95%" }}
                        >
                          <CardBody>
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                  : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
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
                                    this.props.match.params.uuid
                                      ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                      : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
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

                              {!nearbyLab.is_247_opened &&
                                nearbyLab.opening_time && (
                                  <div className="my-0">
                                    <span className="text-muted me-2">
                                      <i className="mdi mdi-timer"></i>{" "}
                                      {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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
                                </div>) : null}
                              {nearbyLab.female_collectors == "Yes" && (
                                <div className="my-0">
                                  <span className="text-danger">
                                    <i className="mdi mdi-account-question"></i>{" "}
                                    Lab has female sample collectors
                                  </span>
                                </div>
                              )}
                              <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                                <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                                <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                                  <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                    {nearbyLab && nearbyLab.rating && (
                                      <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                    )}
                                  </span>
                                </Col>
                              </Row>
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                                }
                              >
                                <div className="my-0 mt-3">
                                  <span className="me-2" style={{ color: 'blue' }}>
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
                      <Col xl="4" sm="9" key={"col" + key}>
                        <Card
                          onClick={() =>
                            history.push(
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}`
                            )
                          } style={{ height: "95%" }}
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

                              {!nearbyLab.is_247_opened &&
                                nearbyLab.opening_time && (
                                  <div className="my-0">
                                    <span className="text-muted me-2">
                                      <i className="mdi mdi-timer"></i>{" "}
                                      {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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

                              {nearbyLab.phone ? (
                                <div className="my-0">
                                  <span className="text-muted me-2">
                                    <i className="bx bx-mobile"></i>{" "}
                                    {nearbyLab.phone}
                                  </span>
                                </div>) : null}

                              {nearbyLab.landline ? (
                                <div className="my-0">
                                  <span className="text-muted me-2">
                                    <i className="mdi mdi-phone"></i>{" "}
                                    {nearbyLab.landline}
                                  </span>
                                </div>) : null}
                              {nearbyLab.female_collectors == "Yes" && (
                                <div className="my-0">
                                  <span className="text-danger">
                                    <i className="mdi mdi-account-question"></i>{" "}
                                    Lab has female sample collectors
                                  </span>
                                </div>
                              )}
                              <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                                <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                                <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                                  <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                    {nearbyLab && nearbyLab.rating && (
                                      <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                    )}
                                  </span>
                                </Col>
                              </Row>
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                                }
                              >
                                <div className="my-0 mt-3">
                                  <span className="me-2" style={{ color: 'blue' }}>
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
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}`
                            )
                          } style={{ height: "95%" }}
                        >
                          <CardBody>
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
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

                              {!nearbyLab.is_247_opened &&
                                nearbyLab.opening_time && (
                                  <div className="my-0">
                                    <span className="text-muted me-2">
                                      <i className="mdi mdi-timer"></i>{" "}
                                      {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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
                                </div>) : null}
                              {nearbyLab.female_collectors == "Yes" && (
                                <div className="my-0">
                                  <span className="text-danger">
                                    <i className="mdi mdi-account-question"></i>{" "}
                                    Lab has female sample collectors
                                  </span>
                                </div>
                              )}
                              <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                                <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                                <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                                  <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                    {nearbyLab && nearbyLab.rating && (
                                      <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                    )}
                                  </span>
                                </Col>
                              </Row>
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                                }
                              >
                                <div className="my-0 mt-3">
                                  <span className="me-2" style={{ color: 'blue' }}>
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
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}`
                            )
                          } style={{ height: "95%" }}
                        >
                          <CardBody>
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
                                    this.props.match.params.uuid
                                      ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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

                              {!nearbyLab.is_247_opened &&
                                nearbyLab.opening_time && (
                                  <div className="my-0">
                                    <span className="text-muted me-2">
                                      <i className="mdi mdi-timer"></i>{" "}
                                      {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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
                                </div>) : null}
                              {nearbyLab.female_collectors == "Yes" && (
                                <div className="my-0">
                                  <span className="text-danger">
                                    <i className="mdi mdi-account-question"></i>{" "}
                                    Lab has female sample collectors
                                  </span>
                                </div>
                              )}
                              <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                                <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                                <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                                  <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                    {nearbyLab && nearbyLab.rating && (
                                      <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                    )}
                                  </span>
                                </Col>
                              </Row>
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                                }
                              >
                                <div className="my-0 mt-3">
                                  <span className="me-2" style={{ color: 'blue' }}>
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
                </Row>
                {isEmpty(nearbyLabs) && (
                  loading ? (
                    <Row>
                      <Col lg="12">
                        <div className="mb-5" style={{ fontSize: '24px' }}>
                          Please Wait.....
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    <Row>
                      <Col lg="12">
                        <div className="mb-5" style={{ fontSize: '24px', color: 'red' }}>
                          Sorry, No Labs Found In Your Specific Area.....
                        </div>
                      </Col>
                    </Row>
                  )
                )}
                <ScrollButton />
              </Col>
            </Row>
          </div>
        ) : isSmallScreen &&
          (!isEmpty(this.props.advLives) ||
            !isEmpty(regionWiseAdvertisement)) &&
          this.state.user_type === "patient" ? (
          <div>
            <MetaTags>
              <title>Nearby Labs | Lab Hazir - Dashboard</title>
            </MetaTags>
            <Row style={{ marginTop: "70px" }}>
              <Slider {...settings} appendDots={customDots}>
                {Array.isArray(this.props.advLives) && this.props.advLives.length > 0 && (
                  this.props.advLives.map((advLive, key) => (
                    <div key={"advLive-" + key}>
                      <Link
                        to={
                          this.props.match.params.uuid
                            ? `/nearby-tests-discountedlh/${this.state.guest_id}/${this.props.match.params.uuid}`
                            : `/nearby-tests-discountedlh/${this.state.guest_id}`
                        }
                        style={sliderStyles}
                      >
                        {advLive.poster ? (
                          advLive.poster.match(/\.(jpeg|jpg|gif|png)$/) ? (
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                advLive.poster
                              }
                              alt="Advertisement"
                              style={sliderStyles}
                              className="img-fluid mx-auto d-block"
                            />
                          ) : (
                            <video
                              width="100%"
                              height="100%"
                              controls
                              autoPlay={this.state.autoplay}
                              loop
                              style={sliderStyles}
                              key={"video-" + key} // Add unique key for video element
                            >
                              <source
                                src={
                                  process.env.REACT_APP_BACKENDURL +
                                  advLive.poster
                                }
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          )
                        ) : (
                          <div key={"no-media-" + key}>No media found.</div>
                        )}
                      </Link>
                    </div>
                  ))
                )}
                {this.props.regionWiseAdvertisement.map(
                  (regionWiseAdvertisement, key) => (
                    <div key={"regionWiseAdvertisement-" + key}>
                      {regionWiseAdvertisement.nearby_adv_list.map(
                        (nearby_adv_list, index) => (
                          <Link
                            to={
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearby_adv_list.account_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearby_adv_list.account_id}`
                            }
                            style={sliderStyles}
                            key={"image-" + index} // Add unique key for image element
                          >
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                nearby_adv_list.poster
                              }
                              alt="Lab Advertisement"
                              style={sliderStyles}
                            />
                          </Link>
                        )
                      )}
                    </div>
                  )
                )}
              </Slider>
            </Row>
            <Row style={{ marginLeft: "20px", marginRight: "20px" }}>
            <Card className="mini-stats-wid" style={{ marginTop: "4px", marginBottom: "10px", padding: 0, backgroundColor: "transparent" }}>
  <CardBody>
    <h4>Categories</h4>
    <p className={"font-size-10"}>
      Sehatmand Pakistan, Khushhaal Pakistan: Aapki Sehat, Hamari Zimmedari!
    </p>

    {/* Horizontal Scrollable Row */}
    <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
      <Link to={this.props.match.params.uuid ? `/nearby-test/${this.props.match.params.uuid}` : `/nearby-test/`}>
        <div style={{ display: "inline-block", margin: "0 10px", textAlign: "center" }}>
          <div className="mini-stat-icon avatar-sm rounded-circle bg-white">
            <span className="avatar-title">
              <img src={mtest} alt="" height="60" />
            </span>
          </div>
          <p className="font-size-10 mt-1" style={{ color: "black" }}>
            Tests
          </p>
        </div>
      </Link>

      <Link to={this.props.match.params.uuid ? `/nearby-profiles/${this.props.match.params.uuid}` : `/nearby-profiles/`}>
        <div style={{ display: "inline-block", margin: "0 10px", textAlign: "center" }}>
          <div className="mini-stat-icon avatar-sm rounded-circle bg-white">
            <span className="avatar-title">
              <img src={mprofile} alt="" height="60" />
            </span>
          </div>
          <p className="font-size-10 mt-1" style={{ color: "black" }}>
            Profiles
          </p>
        </div>
      </Link>

      <Link to={this.props.match.params.uuid ? `/nearby-packages/${this.props.match.params.uuid}` : `/nearby-packages/`}>
        <div style={{ display: "inline-block", margin: "0 10px", textAlign: "center" }}>
          <div className="mini-stat-icon avatar-sm rounded-circle bg-white">
            <span className="avatar-title">
              <img src={mpackages} alt="" height="60" />
            </span>
          </div>
          <p className="font-size-10 mt-1" style={{ color: "black" }}>
            Packages
          </p>
        </div>
      </Link>

      <Link to={this.props.match.params.uuid ? `/nearby-radiology/${this.props.match.params.uuid}` : `/nearby-radiology/`}>
        <div style={{ display: "inline-block", margin: "0 10px", textAlign: "center" }}>
          <div className="mini-stat-icon avatar-sm rounded-circle bg-white">
            <span className="avatar-title">
              <img src={mradiology} alt="" height="60" />
            </span>
          </div>
          <p className="font-size-10 mt-1" style={{ color: "black" }}>
            Radiology
          </p>
        </div>
      </Link>

      <Link to={this.props.match.params.uuid ? `/nearby-packages/${this.props.match.params.uuid}` : `/nearby-packages/`}>
        <div style={{ display: "inline-block", margin: "0 10px", textAlign: "center" }}>
          <div className="mini-stat-icon avatar-sm rounded-circle bg-white">
            <span className="avatar-title">
              <img src={discount} alt="" height="60" />
            </span>
          </div>
          <p className="font-size-10 mt-1" style={{ color: "black" }}>
            Discounts
          </p>
        </div>
      </Link>

      <Link to={"/test-appointments"}>
        <div style={{ display: "inline-block", margin: "0 10px", textAlign: "center" }}>
          <div className="mini-stat-icon avatar-sm rounded-circle bg-white">
            <span className="avatar-title">
              <img src={mappointment} alt="" height="60" />
            </span>
          </div>
          <p className="font-size-10 mt-1" style={{ color: "black" }}>
            Appointments
          </p>
        </div>
      </Link>
    </div>
  </CardBody>
</Card>
              <Col lg="9">
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
                        <h4 style={{ background: "#3B71CA", color: "white", fontWeight: "bold" }}> Search Labs for more result in Pakistan!</h4>
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
                                    border: '2px solid blue',
                                    borderRadius: '5px',
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
                                    borderRadius: '5px',
                                    // Add more style overrides as needed
                                  }}
                                >
                                  <option value="Current Location">Current Location</option>
                                  <option value="City">Search By City</option>
                                  <option value="Custom Address">Custom Address</option>
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
                                    borderRadius: '5px',
                                    // Add more style overrides as needed
                                  }}
                                >
                                  <option value="">Choose an option</option>
                                  <option value="Current Location">
                                    Current Location
                                  </option>
                                  <option value="City">Search By City</option>
                                  <option value="Custom Address">Custom Address</option>
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
                                    type="number"  // Change "numbers" to "number"
                                    className="form-control"
                                    placeholder="Search By Km..."
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
                          {this.state.search_type === "Custom Address" && (
                            <Col xs="2" sm="2" md="2" lg="2">
                              <div className="mb-3">
                                <div className="input-group">
                                  <Input
                                    defaultValue={this.state.km}
                                    onChange={e => this.onChangeKm(e)}
                                    id="pac-input"
                                    type="number"  // Change "numbers" to "number"
                                    className="form-control"
                                    placeholder="Search By Km..."
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
                                      border: '2px solid green',
                                      borderRadius: '5px',
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
                                    border: '2px solid yellow',
                                    borderRadius: '5px',
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

                <Row>
                  {!isEmpty(nearbyLabs) &&
                    !this.state.user_id &&
                    nearbyLabs.map((nearbyLab, key) => (
                      <Col xl="4" sm="6" key={"_col_" + key}>
                        <Card
                          onClick={() =>
                            history.push(
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                            )
                          } style={{ height: "95%" }}
                        >
                          <CardBody>
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                  : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
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
                                    this.props.match.params.uuid
                                      ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                      : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
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

                              {!nearbyLab.is_247_opened &&
                                nearbyLab.opening_time && (
                                  <div className="my-0">
                                    <span className="text-muted me-2">
                                      <i className="mdi mdi-timer"></i>{" "}
                                      {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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

                              {/* {!nearbyLab.is_247_opened && nearbyLab.closing_day && (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-timer"></i>{" "}
                                  {nearbyLab.closing_day}
                                </span>
                              </div>
                            )} */}

                              {nearbyLab.landline ? (
                                <div className="my-0">
                                  <span className="text-muted me-2">
                                    <i className="mdi mdi-phone"></i>{" "}
                                    {nearbyLab.landline}
                                  </span>
                                </div>) : null}
                              {nearbyLab.female_collectors == "Yes" && (
                                <div className="my-0">
                                  <span className="text-danger">
                                    <i className="mdi mdi-account-question"></i>{" "}
                                    Lab has female sample collectors
                                  </span>
                                </div>
                              )}
                              <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                                <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                                <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                                  <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                    {nearbyLab && nearbyLab.rating && (
                                      <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                    )}
                                  </span>
                                </Col>
                              </Row>
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                                }
                              >
                                <div className="my-0 mt-3">
                                  <span className="me-2" style={{ color: 'blue' }}>
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
                      <Col xl="4" sm="9" key={"col" + key}>
                        <Card
                          onClick={() =>
                            history.push(
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}`
                            )
                          } style={{ height: "95%" }}
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

                              {!nearbyLab.is_247_opened &&
                                nearbyLab.opening_time && (
                                  <div className="my-0">
                                    <span className="text-muted me-2">
                                      <i className="mdi mdi-timer"></i>{" "}
                                      {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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

                              {/* {!nearbyLab.is_247_opened && nearbyLab.closing_day && (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-timer"></i>{" "}
                                  {nearbyLab.closing_day}
                                </span>
                              </div>
                            )} */}

                              {/* <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-email"></i>{" "}
                                  {nearbyLab.email}
                                </span>
                              </div> */}

                              {nearbyLab.phone ? (
                                <div className="my-0">
                                  <span className="text-muted me-2">
                                    <i className="bx bx-mobile"></i>{" "}
                                    {nearbyLab.phone}
                                  </span>
                                </div>) : null}

                              {nearbyLab.landline ? (
                                <div className="my-0">
                                  <span className="text-muted me-2">
                                    <i className="mdi mdi-phone"></i>{" "}
                                    {nearbyLab.landline}
                                  </span>
                                </div>) : null}
                              {nearbyLab.female_collectors == "Yes" && (
                                <div className="my-0">
                                  <span className="text-danger">
                                    <i className="mdi mdi-account-question"></i>{" "}
                                    Lab has female sample collectors
                                  </span>
                                </div>
                              )}
                              <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                                <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                                <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                                  <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                    {nearbyLab && nearbyLab.rating && (
                                      <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                    )}
                                  </span>
                                </Col>
                              </Row>
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                                }
                              >
                                <div className="my-0 mt-3">
                                  <span className="me-2" style={{ color: 'blue' }}>
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
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}`
                            )
                          } style={{ height: "95%" }}
                        >
                          <CardBody>
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}`
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

                              {!nearbyLab.is_247_opened &&
                                nearbyLab.opening_time && (
                                  <div className="my-0">
                                    <span className="text-muted me-2">
                                      <i className="mdi mdi-timer"></i>{" "}
                                      {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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
                                </div>) : null}
                              {nearbyLab.female_collectors == "Yes" && (
                                <div className="my-0">
                                  <span className="text-danger">
                                    <i className="mdi mdi-account-question"></i>{" "}
                                    Lab has female sample collectors
                                  </span>
                                </div>
                              )}
                              <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                                <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                                <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                                  <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                    {nearbyLab && nearbyLab.rating && (
                                      <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                    )}
                                  </span>
                                </Col>
                              </Row>
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                                }
                              >
                                <div className="my-0 mt-3">
                                  <span className="me-2" style={{ color: 'blue' }}>
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
                              this.props.match.params.uuid
                                ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
                                : `/nearby-lab-detail/${nearbyLab.account_id}`
                            )
                          } style={{ height: "95%" }}
                        >
                          <CardBody>
                            <Link
                              to={
                                this.props.match.params.uuid
                                  ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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
                                    this.props.match.params.uuid
                                      ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.props.match.params.uuid}/${this.props.match.params.guest_id}`
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

                              {!nearbyLab.is_247_opened &&
                                nearbyLab.opening_time && (
                                  <div className="my-0">
                                    <span className="text-muted me-2">
                                      <i className="mdi mdi-timer"></i>{" "}
                                      {formatTime(nearbyLab.opening_time)} to {formatTime(nearbyLab.closing_time)}


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

                              {/* {!nearbyLab.is_247_opened && nearbyLab.closing_day && (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-timer"></i>{" "}
                                  {nearbyLab.closing_day}
                                </span>
                              </div>
                            )} */}

                              {nearbyLab.landline ? (
                                <div className="my-0">
                                  <span className="text-muted me-2">
                                    <i className="mdi mdi-phone"></i>{" "}
                                    {nearbyLab.landline}
                                  </span>
                                </div>) : null}
                              {nearbyLab.female_collectors == "Yes" && (
                                <div className="my-0">
                                  <span className="text-danger">
                                    <i className="mdi mdi-account-question"></i>{" "}
                                    Lab has female sample collectors
                                  </span>
                                </div>
                              )}
                              <Row style={{ display: "flex", justifyContent: "center", marginLeft: "40px" }}>
                                <Col className="d-flex justify-content-end" style={{ paddingRight: "0" }}>
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
                                <Col className="d-flex justify-content-start" style={{ paddingLeft: "0" }}>
                                  <span style={{ fontSize: "14px", marginLeft: "7px" }}>
                                    {nearbyLab && nearbyLab.rating && (
                                      <p>{nearbyLab.rating.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                    )}
                                  </span>
                                </Col>
                              </Row>
                              <Link
                                to={
                                  this.props.match.params.uuid
                                    ? `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}/${this.props.match.params.uuid}`
                                    : `/nearby-lab-detail/${nearbyLab.account_id}/${this.state.guest_id}`
                                }
                              >
                                <div className="my-0 mt-3">
                                  <span className="me-2" style={{ color: 'blue' }}>
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
                </Row>
                {isEmpty(nearbyLabs) && (
                  loading ? (
                    <Row>
                      <Col lg="12">
                        <div className="mb-5" style={{ fontSize: '24px' }}>
                          Please Wait.....
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    <Row>
                      <Col lg="12">
                        <div className="mb-5" style={{ fontSize: '24px', color: 'red' }}>
                          Sorry, No Labs Found In Your Specific Area.....
                        </div>
                      </Col>
                    </Row>
                  )
                )}
                <ScrollButton />
              </Col>
            </Row>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

NearbyLabs.propTypes = {
  history: any,
  location: any,
  match: PropTypes.object,
  advLives: PropTypes.array,
  carts: PropTypes.array,
  regionWiseAdvertisement: PropTypes.array,
  nearbyLabs: PropTypes.array,
  onGetNearbyLabs: PropTypes.func,
  onGetRegionWiseAdvertisement: PropTypes.func,
  onGetAdvLive: PropTypes.func,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
  onGetTerritoriesList: PropTypes.func,
  territoriesList: PropTypes.array,
  onGetPatientProfile: PropTypes.func,
  patientProfile: PropTypes.array,
  onGetLabNamesList: PropTypes.func,
  labNamesList: PropTypes.array,
  className: PropTypes.any,

};

const mapStateToProps = state => ({
  nearbyLabs: state.LabMarket.nearbyLabs,
  regionWiseAdvertisement: state.LabMarket.regionWiseAdvertisement,
  advLives: state.LabMarket.advLives,
  territoriesList: state.territoriesList.territoriesList,
  patientProfile: state.LabMarket.patientProfile,
  onGetLabNamesList: PropTypes.func,
  labNamesList: PropTypes.array,
  labNamesList: state.labNamesList.labNamesList,

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetNearbyLabs: locationDetails => dispatch(getNearbyLabs(locationDetails)),
  onGetRegionWiseAdvertisement: locationDetails =>
    dispatch(getRegionWiseAdvertisement(locationDetails)),
  onGetAdvLive: locationDetails => dispatch(getAdvLive(locationDetails)),
  offeredTestsList: guest_id => dispatch(offeredTestsList(guest_id)),
  onGetTerritoriesList: id => dispatch(getTerritoriesList(id)),
  onGetPatientProfile: id => dispatch(getPatientProfile(id)),
  onGetLabNamesList: id => dispatch(getLabNamesList(id)),

});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  (stateProps, dispatchProps, ownProps) => {
    // Return an object that merges stateProps, dispatchProps, and ownProps
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
    };
  }
)(withRouter(NearbyLabs));

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(withRouter(NearbyLabs));