import React, { Component } from "react";
import Select from "react-select";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { any } from "prop-types";
import axios from 'axios';
import { connect } from "react-redux";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Link, withRouter } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  Form,
  FormGroup,
  Label,
  CardBody,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
} from "reactstrap";

import classnames from "classnames";

import { every, isEmpty, map, size } from "lodash";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import {
  getHomeSampledTests,
  getCheckoutItems,
  addCheckoutData,
  getDonationCheck,
} from "store/checkout/actions";
import { getTerritoriesList } from "store/territories-list/actions";
import { getPatientProfile } from "store/labmarket/actions";

import { CITIES, DISTRICTS } from "helpers/global_variables_helper";


class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homeSampledTests: [],
      checkoutItems: [],
      territoriesList: [],
      donationCheck: [],
      patientProfile: [],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      user_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
      patient_name: "", // Set default to an empty string if patientProfile.name is undefined
      patient_age: "",
      patient_gender: "Male",
      patient_phone: "",
      booked_by: "",
      csr_id: "",
      // relationsip_with_patient: "Self",
      patient_address: "",
      city_id: "",
      city: "",
      email: "",
      address: "",
      // patient_district: "",
      appointment_requested_at: "",
      is_home_sampling_availed: "",
      is_state_sampling_availed: "",
      payment_method: "Cash",
      donation: "",
      isDisabled: true,
      isRequiredFilled: true,
      checkoutData: "",
      checkedoutData: "",
      activeTab: "1",
      selectedGroup: null,
      checkoutSuccess: "",
      ageFormat: 'years', // default to years
    };

    this.toggleTab = this.toggleTab.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
    this.handleSelectGroup = this.handleSelectGroup.bind(this);

    console.log("guest_id", this.props.match.params.guest_id);
    console.log("uuid", this.props.match.params.uuid);
    console.log("id", this.props.match.params.id);
    console.log("fid", this.props.match.params.filnalurl);
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  handleSelectGroup = selectedGroup => {
    this.setState({ selectedGroup });
  };
  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };

  handleStateSamplingChange = e => {
    this.setState({
      is_state_sampling_availed: "Yes",
      is_home_sampling_availed: "No",
    });


    // API call to get the checkout items
    const { onGetCheckoutItems } = this.props;
    if (this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type !== "b2bclient") {
      setTimeout(() => {
        onGetCheckoutItems(
          this.state.user_id,
          this.state.is_home_sampling_availed,
          this.state.is_state_sampling_availed
        );
      }, 1000);
    } else if (this.state.user_id && this.state.user_type === "CSR" && this.state.user_type !== "b2bclient") {
      setTimeout(() => {
        onGetCheckoutItems(
          this.props.match.params.id,
          this.state.is_home_sampling_availed,
          this.state.is_state_sampling_availed
        );
      }, 1000);
    } else if (this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type === "b2bclient") {
      setTimeout(() => {
        onGetCheckoutItems(
          this.props.match.params.guest_id,
          this.state.is_home_sampling_availed,
          this.state.is_state_sampling_availed
        );
      }, 1000);
    }
    setTimeout(() => {
      this.setState({ checkoutItems: this.props.checkoutItems });
    }, 2000);
  };

  handleHomeSamplingChange = e => {
    this.setState({
      is_home_sampling_availed: "Yes",
      is_state_sampling_availed: "No",
    });

    // API call to get the checkout items
    const { onGetCheckoutItems } = this.props;
    if (this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type !== "b2bclient") {
      setTimeout(() => {
        onGetCheckoutItems(
          this.state.user_id,
          this.state.is_home_sampling_availed,
          this.state.is_state_sampling_availed
        );
      }, 1000);
    } else if (this.state.user_id && this.state.user_type === "CSR" && this.state.user_type !== "b2bclient") {
      setTimeout(() => {
        onGetCheckoutItems(
          this.props.match.params.id,
          this.state.is_home_sampling_availed,
          this.state.is_state_sampling_availed
        );
      }, 1000);
    } else if (this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type === "b2bclient") {
      setTimeout(() => {
        onGetCheckoutItems(
          this.props.match.params.guest_id,
          this.state.is_home_sampling_availed,
          this.state.is_state_sampling_availed
        );
      }, 1000);
    }

    setTimeout(() => {
      this.setState({ checkoutItems: this.props.checkoutItems });
    }, 2000);
  };

  handleFullProceedClick = () => {
    const canProceed = this.checkForFullValidations();
    if (canProceed) {
      let paymentMethod;
      if (this.state.user_id && this.state.user_type !== "CSR") {
        paymentMethod =
          this.props.patientProfile.corporate_payment === "Payment by Coorporate to LH"
            ? "Corporate to Lab"
            : this.state.payment_method;
      } else {
        paymentMethod = this.state.payment_method;
      }
  
      if (this.state.user_id && this.state.user_type !== "CSR") {
        this.setState({
          checkoutData: {
            uuid: this.props.match.params.uuid ? this.props.match.params.uuid : "",
            patient_name: this.state.patient_name,
            patient_age: this.state.patient_age,
            ageFormat: this.state.ageFormat,
            patient_gender: this.state.patient_gender,
            patient_phone: this.state.patient_phone,
            patient_address: this.state.patient_address,
            appointment_requested_at: this.state.appointment_requested_at,
            is_home_sampling_availed: this.state.is_home_sampling_availed,
            is_state_sampling_availed: this.state.is_state_sampling_availed,
            payment_method: paymentMethod,
            donation: this.state.donation,
          },
        });
      } else if (this.state.user_id && this.state.user_type === "CSR") {
        this.setState({
          checkoutData: {
            uuid: this.props.match.params.uuid ? this.props.match.params.uuid : "",
            csr_id: this.state.user_id,
            booked_by: "CSR",
            patient_name: this.state.patient_name,
            patient_age: this.state.patient_age,
            ageFormat: this.state.ageFormat,
            patient_gender: this.state.patient_gender,
            patient_phone: this.state.patient_phone,
            patient_address: this.state.patient_address,
            appointment_requested_at: this.state.appointment_requested_at,
            is_home_sampling_availed: this.state.is_home_sampling_availed,
            is_state_sampling_availed: this.state.is_state_sampling_availed,
            payment_method: this.state.payment_method,
            donation: this.state.donation,
          },
        });
      }
  
      // API call to add checkout data
      const { onAddCheckoutData } = this.props;
      const userId = this.state.user_id;
      const guestId = this.props.match.params.guest_id;
      const csrId = this.props.match.params.id;
  
      setTimeout(() => {
        if (userId && this.state.user_type !== "CSR") {
          onAddCheckoutData(this.state.checkoutData, userId);
        } else if (userId && this.state.user_type === "CSR" && this.state.user_type !== "b2bclient") {
          onAddCheckoutData(this.state.checkoutData, csrId);
        } else if (userId && this.state.user_type !== "CSR" && this.state.user_type === "b2bclient") {
          onAddCheckoutData(this.state.checkoutData, guestId);
        }
      }, 2000);
  
      // Set state to show checkout success modal
      if (this.props.checkedoutData) {
        this.setState({
          checkoutSuccess: true,
          PatientModal: true,
        });
      }
  
      // Redirect to respective dashboard after timeout
      setTimeout(() => {
        if (userId && this.state.user_type !== "CSR" && this.state.user_type === "b2bclient") {
          this.props.history.push("/dashboard-b2bclient");
        }
      }, 7000);
    }
  };
  

  checkForFullValidations = () => {
    // Check if patient's name, age and appointment Booked for is filled
    if (
      this.state.patient_name &&
      this.state.patient_age &&
      this.state.ageFormat &&
      this.state.appointment_requested_at
    ) {

      if (this.state.payment_method == "Donation") {
        if (
          this.state.donation
        ) {
          this.setState({ isRequiredFilled: true });
          return true;
        } else {
          this.setState({ isRequiredFilled: false });
          this.toggleTab("3"); // Redirect to Tab "3" if card information is missing
          return false;
        }
      }
      if (this.state.payment_method) {
        this.setState({ isRequiredFilled: true });
        return true;
      } else {
        this.setState({ isRequiredFilled: false });
        this.toggleTab("3"); // Redirect to Tab "3" if card information is missing
        return false;
      }
    } else {
      this.setState({ isRequiredFilled: false });
      return false;
    }
  };

  handleProceedClick4 = () => {
    const canProceed = this.checkForValidationssample();
    if (canProceed) {
      this.setState({
        checkoutData: {
          uuid: this.props.match.params.uuid
            ? this.props.match.params.uuid
            : "",
          patient_name: this.state.patient_name,
          patient_age: this.state.patient_age,
          ageFormat: this.state.ageFormat,
          patient_gender: this.state.patient_gender,
          patient_phone: this.state.patient_phone,
          appointment_requested_at: this.state.appointment_requested_at,
        },
      });
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setTimeout(() => {
        if (this.props.checkedoutData) {
          this.toggleTab("4");
        }
      }, 1000);
    }
  };

  handleProceedClick = () => {
    const canProceed = this.checkForValidations();
    if (canProceed) {
      this.setState({
        checkoutData: {
          uuid: this.props.match.params.uuid
            ? this.props.match.params.uuid
            : "",
          patient_name: this.state.patient_name,
          patient_age: this.state.patient_age,
          ageFormat: this.state.ageFormat,
          patient_gender: this.state.patient_gender,
          patient_phone: this.state.patient_phone,
          appointment_requested_at: this.state.appointment_requested_at,
        },
      });
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setTimeout(() => {
        if (this.props.checkedoutData) {
          this.toggleTab("2");
        }
      }, 1000);
    }
  };

  checkForValidations = () => {
    if (
      this.state.patient_name &&
      this.state.patient_age &&
      this.state.ageFormat &&
      this.state.appointment_requested_at
    ) {
      this.setState({ isRequiredFilled: true });
      return true;
    } else {
      this.setState({ isRequiredFilled: false });
      return false;
    }
  };
  checkForValidationssample = () => {
    if (
      this.state.is_home_sampling_availed === 'Yes' ||
      this.state.is_state_sampling_availed === 'Yes'
    ) {
      const { patient_address } = this.state;

      // Check if all the required fields for card payment are filled
      if (patient_address) {
        this.setState({ isRequiredFilled: true });
        return true;
      } else {
        this.setState({ isRequiredFilled: false });
        return false;
      }
    } else {
      this.setState({ isRequiredFilled: true });
      return true;
    }
  };

  componentDidMount() {
    const { onGetPatientProfile } = this.props;
    // Assuming onGetPatientProfile is synchronous
    onGetPatientProfile(this.state.user_id);
    // Now you can safely access patientProfile from props
    const { patientProfile } = this.props;  console.log("patient info",this.state.payment_method)
    // Update the state with the fetched patientProfile
    if (this.state.user_id && this.state.user_type !== "CSR") {
      setTimeout(() => {
        this.setState({
          patientProfile,
          patient_name: this.props.patientProfile.name, // Set patient_name if needed
          patient_phone: this.props.patientProfile.phone, // Set patient_name if needed
          patient_email: this.props.patientProfile.email, // Set patient_name if needed
          patient_city: this.props.patientProfile.city, // Set patient_name if needed
          patient_address: this.props.patientProfile.address, // Set patient_name if needed

          // Add other state updates as needed
        });
      }, 1000);
    } else if (this.state.user_id && this.state.user_type === "CSR") {
      setTimeout(() => {
        this.setState({
          patientProfile,
          patient_name: this.state.patient_name, // Set patient_name if needed
          patient_phone: this.state.patient_phone, // Set patient_name if needed
          patient_email: this.state.patient_email, // Set patient_name if needed
          patient_address: this.state.patient_address, // Set patient_name if needed
          patient_city: this.state.patient_city, // Set patient_name if needed

          // Add other state updates as needed
        });
      }, 1000);
    }
    
    
    console.log("state in the componentdidmount", patientProfile, this.state.patient_name);
    const { onGetDonationCheck } = this.props;
    if (this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type !== "b2bclient") {
      setTimeout(() => {
        onGetDonationCheck(this.state.user_id);
      }, 1000);
    } else if (this.state.user_id && this.state.user_type === "CSR" && this.state.user_type !== "b2bclient") {
      setTimeout(() => {
        onGetDonationCheck(this.props.match.params.id);
      }, 1000);
    } else if (this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type === "b2bclient") {
      setTimeout(() => {
        onGetDonationCheck(this.props.match.params.guest_id);
      }, 1000);
    }
    this.setState({ donationCheck: this.props.donationCheck });
    console.log("heeeeeee", this.props.donationCheck);
    // API call to get the home sampled tests
    const { onGetHomeSampledTests } = this.props;
    if (this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type !== "b2bclient") {
      setTimeout(() => {
        onGetHomeSampledTests(this.state.user_id);
      }, 1000);
    } else if (this.state.user_id && this.state.user_type === "CSR" && this.state.user_type !== "b2bclient") {
      setTimeout(() => {
        onGetHomeSampledTests(this.props.match.params.id);
      }, 1000);
    } else if (this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type === "b2bclient") {
      setTimeout(() => {
        onGetHomeSampledTests(this.props.match.params.guest_id);
      }, 1000);
    }
    this.setState({ homeSampledTests: this.props.homeSampledTests });

    // API call to get the checkout items
    const { onGetCheckoutItems } = this.props;
    if (this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type !== "b2bclient") {
      setTimeout(() => {
        onGetCheckoutItems(this.state.user_id);
      }, 1000);
    } else if (this.state.user_id && this.state.user_type === "CSR" && this.state.user_type !== "b2bclient") {
      setTimeout(() => {
        onGetCheckoutItems(this.props.match.params.id);
      }, 1000);
    } else if (this.state.user_id && this.state.user_type !== "CSR" && this.state.user_type === "b2bclient") {
      setTimeout(() => {
        onGetCheckoutItems(this.props.match.params.guest_id);
      }, 1000);
    }
    this.setState({ checkoutItems: this.props.checkoutItems});

    const { territoriesList, onGetTerritoriesList } = this.props;
    if (territoriesList && !territoriesList.length) {
      console.log(onGetTerritoriesList(this.state.user_id));
    }
    flatpickr("#flatpickrInput", {
      enableTime: false,
      dateFormat: "Y-m-d", // Use "Y-m-d" to include only the date
      minDate: new Date().toISOString().split("T")[0], // Set minimum date to today
      onChange: (selectedDates, dateStr, instance) => {
        // Get current time
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // Append current time to the selected date
        const dateTimeStr = `${dateStr}T${currentTime}`;

        // Set the state with the combined date and time
        this.setState({ appointment_requested_at: dateTimeStr });
      },
    });
  }
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { homeSampledTests } = this.props;
    if (
      isEmpty(prevProps.homeSampledTests) &&
      !isEmpty(homeSampledTests) &&
      size(homeSampledTests) !== size(prevProps.homeSampledTests)
    ) {
      this.setState({ homeSampledTests });
    }

    const { checkoutItems } = this.props;
    if (
      isEmpty(prevProps.checkoutItems) &&
      !isEmpty(checkoutItems) &&
      size(checkoutItems) !== size(prevProps.checkoutItems)
    ) {
      this.setState({ checkoutItems });
    }
  }

  handleClickAddPayment = () => {
    this.toggleTab("3"); // Switch to the "Payment Info" tab with the id of "3"
  };

  handlePaymentMethodChange = (e) => {
    const { value, name } = e.target;
    this.setState(
      {
        [name]: value,
      },
      () => {
        if (this.state.payment_method === 'Card') {
          setTimeout(() => {
              this.toggleTab('2');
            }, 2000);
        }
        if (this.state.payment_method === 'Donation') {
          const {
            donation,
          } = this.state;
          if (donation) {
            setTimeout(() => {
              this.toggleTab('2');
            }, 2000);
          }
        }
        else {
          setTimeout(() => {
            this.toggleTab('2');
          }, 2000);
          // For other payment methods, do not switch to Tab 4
        }
      }
    );
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
      const places = searchBox.getPlaces();
      if (places.length > 0) {
        const formattedAddress = places[0].formatted_address;
        this.setState({ patient_address: formattedAddress });
      }
    });

    // Update patient_address state when the user types in the input field
    this.setState({ patient_address: e.target.value });
  };

  handleLocatorIconClick = () => {
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
              this.setState({ patient_address: formattedAddress }, () => {
                // Call the function to update patient address
                this.onChangeAddress({ target: { value: formattedAddress } });
              });
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
  };
  handleCancelIconClick = () => {
    this.setState({ patient_address: "" });
  };
  handleAgeChange = (e) => {
    this.setState({
      patient_age: e.target.value,
    });
  };

  handleAgeFormatChange = (e) => {
    this.setState({
      ageFormat: e.target.value,
    });
  };
  handleFormGroupClick = () => {
    this.datePickerRef.setFocus(); // Use the correct reference here
  }
  printInvoice = () => {
    window.print();
  };
  handlePayment = async () => {
    console.log("state in the componentdidmount", this.props.patientProfile, this.state.patient_name);

    const { current_amount, total_sampling_charges, test_name } = this.state.checkoutItems;
    const { patient_name, patient_phone, patient_email, patient_address, patient_city } = this.state;

    // Log the state values to ensure they are set correctly
    console.log('checkoutItems:', this.state.checkoutItems);
    console.log('patient_name:', patient_name);
    console.log('patient_phone:', patient_phone);
    console.log('patient_email:', patient_email);
    console.log('patient_city:', patient_city);
    console.log('patient_address:', patient_address);

    if (current_amount == "200" || total_sampling_charges == "100") {
        console.error('SUBTOTAL or SHIPPING_COST is undefined');
        return;
    }

    const paymentData = {
      customer_id: this.props.patientProfile.id,
      customer_name: patient_name,
      customer_email: patient_email,
      customer_phone: patient_phone,
      customer_address: patient_address,
      customer_city: patient_city,
      mdd1: "WC",
      mdd2: "Yes",
      mdd4: "Medical Test",
      mdd5: "Yes",
      mdd7: "1",
      mdd20: "No",

    };

    console.log('Payment Data:', paymentData); // Log the payment data

    // try {
    //     const response = await axios.post('https://labhazirapi.com/api/patient/hblcartpayments', paymentData);
    //     console.log('Response:', response); // Log the response for debugging

    //     if (response.data.message === 'Success') {
    //         this.setState({ checkoutSuccess: true });
    //         // Handle success response
    //     } else {
    //         // Handle failure response
    //         console.error('Payment failed:', response.data);
    //     }
    // } catch (error) {
    //     console.error('Error making payment:', error);
    // }
    try {
      const response = await axios.post('https://labhazirapi.com/api/patient/hblcartpayments', paymentData);
      console.log('Response:', response); // Log the response for debugging

      if (response.data.message === 'Success') {
          this.setState({ checkoutSuccess: true, pay_now_url: response.data.pay_now_url }, () => {
              // Redirect to the payment URL
              window.location.href = this.state.pay_now_url;
          });
      } else {
          // Handle failure response
          console.error('Payment failed:', response.data);
      }
  } catch (error) {
      console.error('Error making payment:', error);
  }
};



  render() {
    const iconStyle = {
      position: 'absolute',
      top: '50%',
      right: '10px', // Adjust this value to move the icon horizontally
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: 'blue', // Icon color
      fontSize: '16px',
      marginLeft: '6px'
    };
    const closeiconStyle = {
      position: 'absolute',
      top: '50%',
      right: '10px', // Adjust this value to move the icon horizontally
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: 'red', // Icon color
      fontSize: '16px'
    };

    const inputGroupStyle = {
      position: 'relative',
    };

    // list of city from territories
    const isLargeScreen = window.innerWidth > 645;
    const cityList = [];
    for (let i = 0; i < this.props.territoriesList.length; i++) {
      cityList.push({
        label: this.props.territoriesList[i].city,
        value: this.props.territoriesList[i].id,
      });
    }
    const { patientProfile } = this.props;
    const { onGetPatientProfile } = this.props;
    const openModal = () => {
      const modal = document.getElementById("modal");
      modal.style.display = "block";
    };

    const closeModal = () => {
      this.setState({ PatientModal: false });

    };
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Adjust the opacity to control the blur
      zIndex: 9999,
      display: this.state.PatientModal ? 'block' : 'none',
    };

    const modalStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      width: '500px', // Increase width
      height: '400px', // Increase height
      zIndex: 10000,
      display: this.state.PatientModal ? 'block' : 'none',
    };
    return (
      console.log("donation check here",this.state.donationCheck),
      (
        <React.Fragment>
          <div className="page-content">
            <MetaTags>
              <title>Checkout | Lab Hazir - Dashboard</title>
            </MetaTags>
            <Container fluid>
              {/* Render Breadcrumb */}
              <Breadcrumbs title="Test" breadcrumbItem="Checkout" />
              {/* {this.state.checkoutSuccess && (
                <Alert color="success" className="col-md-8">
                  {this.state.checkoutSuccess}
                </Alert>
              )} */}
              
              <div>
                <div style={backdropStyle}></div>
                <div style={modalStyle}>
                  <Col className="col-12 text-center">
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid green",
                        margin: "0 auto", // Center the circle
                        marginBottom: "20px",
                      }}
                    >
                      <i
                        className="fas fa-check"
                        style={{ color: "green", fontSize: "36px", borderRadius: "50%" }}
                      ></i>
                    </div>
                    <strong className="font-size-15 font-weight-bold mb-3">
                      Order has been placed successfully,
                    </strong>
                    <p style={{ fontSize: "14px", color: "gray" }}>
                      Your booking detail has been sent to you by Email.
                    </p>
                    <strong className="font-size-15 font-weight-bold mb-3 text-danger">
                      Thank You For Choosing Labhazir!
                    </strong>
                  </Col>
                  {this.props.patientProfile && this.props.patientProfile.corporate_id == "undefined" && this.props.patientProfile.is_assosiatewith_anycorporate == false ? (
                  <>
                  <div className="d-flex justify-content-center mb-3">
                    <Link
                      to="/nearby-test"
                      // onClick={this.printInvoice}
                      className="btn mt-2 me-1"
                      style={{
                        color: "black",
                        border: "2px solid blue",
                        // backgroundColor: "white",
                      }}
                    >
                      Search More Tests
                    </Link>
                    <Link
                      to="/test-appointments"
                      className="btn mt-2 me-1"
                      style={{
                        color: "black",
                        border: "2px solid blue",
                        backgroundColor: "white",
                      }}
                    >
                      Track Appointments
                    </Link>
                  </div>
                  <div className="text-center mb-3">
                    <Link to="/labs" className="btn btn-primary" onClick={this.closeModal}>
                      <i className="bx bxs-home" /> Go Back To Home Page
                    </Link>
                  </div>
</>
                  ): this.state.user_type === "CSR" ? (
                  <>
                  <div className="d-flex justify-content-center mb-3">
                    <Link
                      to="/dashboard-csr"
                      // onClick={this.printInvoice}
                      className="btn btn-primary mt-2 me-1"
                      // style={{
                      //   color: "black",
                      //   border: "2px solid blue",
                      //   // backgroundColor: "white",
                      // }}
                    >
                      Go Back To Home Page
                    </Link>
                    <Link
                      // to="/test-appointments/${this.props.match.params.id}"
                      to={
                        this.props.match.params.uuid
                          ? `/test-appointments/${this.props.match.params.uuid}/${this.props.match.params.id}`
                          : `/test-appointments/${this.props.match.params.id}`}
                      className="btn mt-2 me-1"
                      style={{
                        color: "black",
                        border: "2px solid blue",
                        backgroundColor: "white",
                      }}
                    >
                      Track Appointments
                    </Link>
                  </div>
                 </> ) : <>
                  <div className="d-flex justify-content-center mb-3">
                    <Link
                      to="/labs"
                      // onClick={this.printInvoice}
                      className="btn btn-primary mt-2 me-1"
                      // style={{
                      //   color: "black",
                      //   border: "2px solid blue",
                      //   // backgroundColor: "white",
                      // }}
                    >
                      Go Back To Home Page
                    </Link>
                    <Link
                      to="/test-appointments"
                      className="btn mt-2 me-1"
                      style={{
                        color: "black",
                        border: "2px solid blue",
                        backgroundColor: "white",
                      }}
                    >
                      Track Appointments
                    </Link>
                  </div>
                 </>}
                </div>
              </div>
              <div className="checkout-tabs">
                <Row>
                  <Col>
                    <Nav className="mt-4 mb-2 gap-4" pills>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: this.state.activeTab === "1",
                          })}
                          onClick={() => {
                            this.toggleTab("1");
                          }}
                        >
                          <i className="bx bx-user d-block check-nav-icon font-size-18" />
                          {/* <p className="font-weight-bold mb-4">Patient Info</p> */}
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: this.state.activeTab === "2",
                          })}
                          onClick={() => {
                            this.toggleTab("2");
                          }}
                        >
                          <i className="bx bx-home d-block check-nav-icon font-size-18" />
                          {/* <p className="font-weight-bold mb-4">Home Sample</p> */}
                        </NavLink>
                      </NavItem>
                      <NavItem style={{ display: 'none' }}>
                        <NavLink
                          className={classnames({
                            active: this.state.activeTab === "3",
                          })}
                          onClick={() => {
                            this.toggleTab("3");
                          }}


                        >
                          <i className="bx bx-money d-block check-nav-icon font-size-18" />
                          {/* <p className="font-weight-bold mb-4">Payment Info</p> */}
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {!this.state.isRequiredFilled ? (
                      <Alert color="danger" className="col-md-5">
                        Please fill the required fields.
                      </Alert>
                    ) : null}

                    <Card>
                      <CardBody>
                        <TabContent activeTab={this.state.activeTab}>
                          
                          <TabPane tabId="1">
                            <div>
                              <CardTitle className="h4">Patient information</CardTitle>
                              <p className="card-title-desc">
                                Fill all the information for the patient below
                              </p>
                              <Container>
                                <Form>
                                  <FormGroup className="mb-4" row>
                                    <Label htmlFor="patient-name" md="2" className="col-form-label">
                                      Patient Name
                                      <span style={{ color: "#f46a6a" }} className="font-size-18">
                                        *
                                      </span>
                                    </Label>
                                    <Col md="10">
                                      <Input
                                        type="text"
                                        className="form-control"
                                        name="patient_name"
                                        value={this.state.patient_name}  // Use this.state.patient_name as the value
                                        onChange={(e) => this.setState({ patient_name: e.target.value })}
                                      />
                                    </Col>
                                  </FormGroup>

                                  <FormGroup className="mb-4" row>
                                    <Label md="2" className="col-form-label">
                                      Patient Phone
                                      <span
                                        style={{ color: "#f46a6a" }}
                                        className="font-size-18"
                                      >
                                        *
                                      </span>
                                    </Label>
                                    <Col md={10}>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="patient_phone"
                                        // placeholder="Enter Contact no of Patient"
                                        value={this.state.patient_phone}  // Use this.state.patient_name as the value
                                        onChange={e =>
                                          this.setState({
                                            patient_phone: e.target.value,
                                          })
                                        }
                                      />
                                    </Col>
                                  </FormGroup>

                                  <FormGroup className="mb-4" row>
                                    <Label md="2" className="col-form-label">
                                      Patient Gender
                                      <span
                                        style={{ color: "#f46a6a" }}
                                        className="font-size-18"
                                      >
                                        *
                                      </span>
                                    </Label>
                                    <Col md="10">
                                      <select
                                        className="form-control select2"
                                        title="Gender"
                                        name="patient_gender"
                                        onChange={e =>
                                          this.setState({
                                            patient_gender: e.target.value,
                                          })
                                        }
                                      >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                      </select>
                                    </Col>
                                  </FormGroup>
                                  <FormGroup className="mb-4" row>
  <Label md="2" className="col-form-label">
    Patient Age
    <span style={{ color: "#f46a6a" }} className="font-size-18">
      *
    </span>
  </Label>
  <Col md={4} className="mb-3 mb-md-0"> {/* Adds margin-bottom for smaller screens */}
    <input
      type="number"
      className="form-control"
      name="patient_age"
      min="0"
      placeholder="Enter age"
      value={this.state.patient_age}
      onChange={this.handleAgeChange}
    />
  </Col>
  <Col md={4}>
    <Input
      type="select"
      name="ageFormat"
      value={this.state.ageFormat}
      onChange={this.handleAgeFormatChange}
      style={{ color: 'red' }}
    >
      <option value="years">Years</option>
      <option value="months">Months</option>
      <option value="days">Days</option>
    </Input>
  </Col>
</FormGroup>

                                  <div className="form-group row">
                                    <label className="col-md-2" htmlFor="flatpickrInput">
                                      Select a date for the appointment?{' '}
                                      <span style={{ color: '#f46a6a' }} className="font-size-18">
                                        *
                                      </span>
                                    </label>
                                    <Col md={10}>
                                      <div className="input-group">
                                        <input
                                          id="flatpickrInput"
                                          name="appointment_requested_at"
                                          type="text"
                                          className="form-control"
                                          placeholder="Select the date on which you would like to book an appointment"
                                        />
                                      </div>
                                      <small className="text-danger">
                                        <strong>
                                          <span className="text-danger">Note:</span>
                                        </strong>{' '}
                                        <strong>Once the lab confirms, you will receive a confirmation email for this time.</strong>
                                      </small>
                                    </Col>
                                  </div>

                                </Form>
                              </Container>
                              <Row className="mt-4">
                                <Col sm="6"></Col>
                                <Col sm="6">
                                  <div className="text-end">
                                    <button
                                      component={Link}
                                      onClick={this.handleProceedClick}
                                      to="/checkout"
                                      className="btn btn-success mb-4"
                                    >
                                      <i className="mdi mdi-truck-fast me-1" /> Next
                                    </button>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </TabPane>

                          <TabPane
                            tabId="2"
                            id="v-pills-payment"
                            role="tabpanel"
                            aria-labelledby="v-pills-payment-tab"
                          >
                            <div className="container mb-4">
                              <div className="row">
                                <div className="col-md-12">
                                  <CardTitle className="h4">Home Sampling Information for Tests.</CardTitle>
                                  <span className="text-danger font-size-12">
                                    <strong><span className="text-danger">Note:</span></strong> <strong>
                                      Please choose if you want to avail Routine / Urgent Home Sampling services for the following tests
                                    </strong>
                                  </span>
                                  <div className="d-flex" style={{ marginBottom: '20px', marginTop: '20px' }}>
                                    <strong>Home Sampling: </strong>
                                    {this.state.homeSampledTests.find(homeSampledTest => homeSampledTest.is_homesampling_offered == "Yes") ? (
                                      <div className="form-check form-check-inline font-size-16" style={{ marginLeft: '14px' }}>
                                        <Input
                                          type="radio"
                                          value="Cash"
                                          name="payment_method"
                                          id="customRadioInline1"
                                          className="form-check-input"
                                          onChange={this.handleHomeSamplingChange}
                                        />
                                        <Label className="form-check-label font-size-13" htmlFor="customRadioInline1">
                                          <i className="fas fa-shipping-fast me-2" style={{ color: 'red' }} />
                                          Routine
                                        </Label>
                                      </div>
                                    ) : (
                                      <div className="form-check form-check-inline font-size-16" style={{ marginLeft: '10px' }}>
                                        <Input
                                          type="radio"
                                          value="Cash"
                                          name="payment_method"
                                          id="customRadioInline1"
                                          className="form-check-input"
                                          onChange={this.handleHomeSamplingChange}
                                          disabled  // Add the disabled attribute
                                        />
                                        <Label className="form-check-label font-size-13" htmlFor="customRadioInline1" style={{ color: 'grey' }}>
                                          <i className="fas fa-shipping-fast me-2" style={{ color: 'red' }} />
                                          Routine
                                        </Label>
                                      </div>
                                    )}

                                    {this.state.homeSampledTests.find(homeSampledTest => homeSampledTest.state_sampling_charges > 0) ? (
                                      <div className="form-check form-check-inline font-size-16">
                                        <Input
                                          type="radio"
                                          value="Cash"
                                          name="payment_method"
                                          id="customRadioInline2"
                                          className="form-check-input"
                                          onChange={this.handleStateSamplingChange}
                                        />
                                        <Label className="form-check-label font-size-13" htmlFor="customRadioInline2">
                                          <i className="fas fa-shipping-fast me-2" style={{ color: 'red' }} />
                                          Urgent
                                        </Label>
                                      </div>
                                    ) : <div className="form-check form-check-inline font-size-16">
                                      <Input
                                        type="radio"
                                        value="Cash"
                                        name="payment_method"
                                        id="customRadioInline2"
                                        className="form-check-input"
                                        onChange={this.handleStateSamplingChange}
                                        disabled  // Add the disabled attribute
                                      />
                                      <Label className="form-check-label font-size-13" htmlFor="customRadioInline2" style={{ color: 'grey' }}>
                                        <i className="fas fa-shipping-fast me-2" style={{ color: 'red' }} />
                                        Urgent
                                      </Label>
                                    </div>}
                                  </div>

                                  {this.state.is_home_sampling_availed === "Yes" && (
                                    <>
                                      <FormGroup className="mb-4" row>
                                        <Label htmlFor="patient-name" md="2" className="col-form-label">
                                          Address
                                          <span style={{ color: "#f46a6a" }} className="font-size-18">
                                            *
                                          </span>
                                        </Label>
                                        <Col md="10">
                                          <div style={inputGroupStyle}>
                                            <Input
                                              onChange={e => this.onChangeAddress(e)}
                                              id="pac-input"
                                              type="text"
                                              className="form-control"
                                              placeholder="Search Location..."
                                              value={this.state.patient_address}
                                              required={this.state.is_home_sampling_availed === "Yes"} // Set required based on the condition
                                            />
                                            {this.state.patient_address ? (
                                              <span style={closeiconStyle} onClick={this.handleCancelIconClick}>
                                                <i className="mdi mdi-close-circle"></i>
                                              </span>
                                            ) : (
                                              <span style={iconStyle} onClick={this.handleLocatorIconClick}>
                                                <i className="bx bx-target-lock">
                                                  <span style={{ color: "black", marginLeft: "4px" }}>Current Location</span>
                                                </i>
                                              </span>
                                            )}
                                          </div>
                                          {/* Error message */}
                                          {this.state.is_home_sampling_availed === "Yes" && !this.state.patient_address && (
                                            <small className="text-danger">Address is required</small>
                                          )}
                                        </Col>
                                      </FormGroup>
                                    </>
                                  )}

                                  {this.state.is_state_sampling_availed === "Yes" && (
                                    <>
                                      <FormGroup className="mb-4" row>
                                        <Label htmlFor="patient-name" md="2" className="col-form-label">
                                          Address
                                          <span style={{ color: "#f46a6a" }} className="font-size-18">
                                            *
                                          </span>
                                        </Label>
                                        <Col md="10">
                                          <div style={inputGroupStyle}>
                                            <Input
                                              onChange={e => this.onChangeAddress(e)}
                                              id="pac-input"
                                              type="text"
                                              className="form-control"
                                              placeholder="Search Location..."
                                              value={this.state.patient_address}
                                              required={this.state.is_home_sampling_availed === "Yes"} // Set required based on the condition
                                            />
                                            {this.state.patient_address ? (
                                              <span style={closeiconStyle} onClick={this.handleCancelIconClick}>
                                                <i className="mdi mdi-close-circle"></i>
                                              </span>
                                            ) : (
                                              <span style={iconStyle} onClick={this.handleLocatorIconClick}>
                                                <i className="bx bx-target-lock">
                                                  <span style={{ color: "black", marginLeft: "4px" }}>Current Location</span>
                                                </i>
                                              </span>
                                            )}
                                          </div>
                                          {/* Error message */}
                                          {this.state.is_home_sampling_availed === "Yes" && !this.state.patient_address && (
                                            <small className="text-danger">Address is required</small>
                                          )}
                                        </Col>
                                      </FormGroup>
                                      <FormGroup className="mb-4" row>
                                      <Col md="2"></Col>
                                     <Col md="10">
                                    <Card className="bg-primary bg-soft rounded" >
                                      {this.state.homeSampledTests.map((homeSampledTest, key) => {
                                        if (homeSampledTest.state_sampling_charges && homeSampledTest.state_sampling_time) {
                                          return (
                                            <div key={"homeSampledTest" + key}>
                                              <div className="row font-size-12" style={{ margin: '5px' }}>
                                                <Col sm="4" >
                                                  <span className="text-primary">Lab Name: </span>
                                                  <span className="badge rounded-pill badge-soft-warning font-size-16 badge-soft-warning blinking-text">
                                                    {homeSampledTest.lab_name}
                                                  </span></Col>
                                                <Col sm="4" >
                                                  <span className="text-primary">Urgent Sampling Time: </span>
                                                  <span className="badge rounded-pill badge-soft-warning font-size-16 badge-soft-warning blinking-text">
                                                    {homeSampledTest.state_sampling_time}h
                                                  </span></Col>
                                                <Col sm="4" >
                                                  <span className="text-primary">Urgent Sampling Charges : </span>
                                                  <span className="badge rounded-pill badge-soft-warning font-size-16 badge-soft-warning blinking-text">
                                                    {homeSampledTest.state_sampling_charges}
                                                  </span></Col>

                                                <style>
                                                  {`
                                                  .blinking-text {
                                                    animation: blinking 1s infinite;
                                                    color: red; /* Your desired text color */
                                                    background-color: black; /* Your desired background color */
                                                  }

                                                  @keyframes blinking {
                                                    0% {
                                                      opacity: 1;
                                                    }
                                                    50% {
                                                      opacity: 0;
                                                    }
                                                    100% {
                                                      opacity: 1;
                                                    }
                                                  }
                                                `}
                                                </style>
                                              </div>
                                            </div>
                                          );
                                        } else {
                                          return null; // Skip rendering if sampling charges and fees are missing
                                        }
                                      })}
                                    </Card></Col>
                                    </FormGroup>
                                    </>

                                  )}

                                  {/* <div className="table-responsive"> */}
                                  {isLargeScreen ? (
                                    <Table>
                                      <Thead className="table-light">
                                        <Tr>
                                          <Th scope="col">Home Sampling Offered</Th>
                                          <Th scope="col">Test name</Th>
                                          <Th scope="col">Lab name</Th>
                                        </Tr>
                                      </Thead>
                                      <Tbody>
                                        {this.state.homeSampledTests.map(
                                          (homeSampledTest, key) => (
                                            <Tr key={"_homeSampledTest_" + key}>
                                              <p className="font-size-14 float-start">
                                                <Td>
                                                  {
                                                    homeSampledTest.is_home_sampling_available
                                                  }
                                                </Td>
                                              </p>

                                              <Td>
                                                <h5 className="font-size-14 float-start">
                                                  <p
                                                    className="text-dark"
                                                  >
                                                    {homeSampledTest.test_name}{" "}
                                                  </p>
                                                </h5>
                                              </Td>
                                              <p className="font-size-14 float-start">
                                                <Td>{homeSampledTest.lab_name}</Td>
                                              </p>
                                            </Tr>
                                          )
                                        )}
                                      </Tbody>
                                    </Table>
                                  ) : (
                                    <Table>
                                      <Thead className="table-light">
                                        <Tr>
                                          <Th style={{ fontSize: "8px" }} scope="col">Home Sampling Offered</Th>
                                          <Th style={{ fontSize: "8px" }} scope="col">Test name</Th>
                                          <Th style={{ fontSize: "8px" }} scope="col">Lab name</Th>
                                        </Tr>
                                      </Thead>
                                      <Tbody>
                                        {this.state.homeSampledTests.map(
                                          (homeSampledTest, key) => (
                                            <Tr key={"_homeSampledTest_" + key}>
                                              {/* <p className="float-start"  style={{ fontSize: "4px" }}> */}
                                              <Td style={{ fontSize: "6px" }}>
                                                {
                                                  homeSampledTest.is_home_sampling_available
                                                }
                                              </Td>
                                              {/* </p> */}

                                              <Td style={{ fontSize: "6px" }}>
                                                {/* <h5 className="font-size-14 float-start"> */}
                                                <a
                                                  href="/ecommerce-product-details/1"
                                                  className="text-dark"
                                                >
                                                  {homeSampledTest.test_name}{" "}
                                                </a>
                                                {/* </h5> */}
                                              </Td>
                                              {/* <p className="font-size-14 float-start"> */}
                                              <Td style={{ fontSize: "6px" }}>{homeSampledTest.lab_name}</Td>
                                              {/* </p> */}
                                            </Tr>
                                          )
                                        )}
                                      </Tbody>
                                    </Table>

                                  )}
                                  {/* <Row className="mt-4">
                                    <Col sm="6"></Col>
                                    <Col sm="6">
                                      <div className="text-end">
                                        <button
                                          component={Link}
                                          onClick={this.handleProceedClick4}

                                          to="/checkout"
                                          className="btn btn-success mb-4"
                                        >
                                          <i className="mdi mdi-truck-fast me-1" /> Next
                                        </button>
                                      </div>
                                    </Col>
                                  </Row> */}
                                </div>
                              </div>
                            </div>
                            <div>
                            <Card className="shadow-none border mb-0">
                              <CardBody>
                                <CardTitle className="mb-4">
                                  Order Summary
                                </CardTitle>
                                <div className="container">
                                  <div className="table-responsive" style={{ overflowX: "auto" }}>
                                    <table className="table">
                                      <thead style={{ backgroundColor: "blue", color: "#fff" }}>
                                        <tr>
                                          <th scope="col" style={{ width: "20%" }} className="text-start">
                                            Test Name
                                          </th>
                                          <th scope="col" style={{ width: "25%" }} className="text-end">
                                            Price
                                          </th>
                                          <th scope="col" style={{ width: "25%" }} className="text-end">
                                            Sum Of Discounts <br /> (Lab + Labhazir)
                                          </th>
                                          <th scope="col" style={{ width: "25%" }} className="text-end">
                                            Net Payable
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {this.state.checkoutItems.map((checkoutItem, key) => (
                                          <>
                                            {checkoutItem.items.map((item, key) => (
                                              <tr key={"_item_" + key}>
                                                <td>
                                                  <p className="text-start">
                                                    <h6>{item.test_name}</h6>
                                                    <p className="text-muted mb-0">{item.lab_name}</p>
                                                  </p>
                                                </td>

                                                <td>
                                                  <p className="text-end">
                                                    {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                  </p>
                                                </td>
                                                <td>
                                                  <p className="text-end">
                                                    {item.discount_per +
                                                      item.discount_by_labhazir_per +
                                                      item.discount_by_labhazird_by_test_per}
                                                  </p>
                                                </td>
                                                <td>
                                                  <p className="text-end">
                                                    {item.current_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                  </p>
                                                </td>
                                              </tr>
                                            ))}
                                          </>
                                        ))}
                                      </tbody>
                                      <tfoot>
                                        {this.state.checkoutItems.slice(-1).map(
                                          (checkoutItem, key) => (
                                            <>
                                              {checkoutItem.lab_home_sampling_charges !=
                                                0 && (
                                                  <tr key={"_checkoutItem_" + key}>
                                                    <td colSpan="4">
                                                      {this.state
                                                        .is_home_sampling_availed !=
                                                        "Yes" &&
                                                        this.state
                                                          .is_state_sampling_availed ==
                                                        "Yes" && (
                                                          <div className="bg-primary bg-soft p-3 rounded">
                                                            <h5 className="font-size-14 text-primary mb-0">
                                                              <i className="fas fa-shipping-fast me-2" />{" "}
                                                              Sum of Urgent Sampling
                                                              Charges{" "}
                                                              <span className="float-end">
                                                                Rs.{" "}
                                                                {checkoutItem.total_sampling_charges
                                                                  .toString()
                                                                  .replace(
                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                    ","
                                                                  )}
                                                              </span>
                                                            </h5>
                                                          </div>
                                                        )}
                                                      {this.state
                                                        .is_home_sampling_availed ==
                                                        "Yes" &&
                                                        this.state
                                                          .is_state_sampling_availed !=
                                                        "Yes" && (
                                                          <div className="bg-primary bg-soft p-3 rounded">
                                                            <h5 className="font-size-14 text-primary mb-0">
                                                              <i className="fas fa-shipping-fast me-2" />{" "}
                                                              Sum of Home Sampling
                                                              Charges{" "}
                                                              <span className="float-end">
                                                                Rs.{" "}
                                                                {checkoutItem.total_sampling_charges
                                                                  .toString()
                                                                  .replace(
                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                    ","
                                                                  )}
                                                              </span>
                                                            </h5>
                                                          </div>
                                                        )}
                                                    </td>
                                                  </tr>
                                                )}

                                              {checkoutItem.plateformcharges_roundoff ? (
                                                <Tr>
                                                  <Td colSpan="4">
                                                    <div className="bg-success bg-soft p-3 rounded">
                                                      <h5 className="font-size-14 text-success mb-0">
                                                        <i className="mdi mdi-cash-multiple me-2 font-size-22" />{" "}
                                                        Plateform Charges{" "}
                                                        <span className="float-end">
                                                          Rs.{" "}
                                                          {checkoutItem.plateformcharges_roundoff
                                                            .toString()
                                                            .replace(
                                                              /\B(?=(\d{3})+(?!\d))/g,
                                                              ","
                                                            )}
                                                        </span>
                                                      </h5>
                                                    </div>
                                                  </Td>
                                                </Tr>
                                              ) : null}
                                              
                                                <Tr>
                                                  <Td colSpan="4">
                                                    <div className="bg-success bg-soft p-3 rounded">
                                                      <h5 className="font-size-14 text-success mb-0">
                                                        <i className="mdi mdi-cash-multiple me-2 font-size-22" />{" "}
                                                        Sub Total
                                                        <span className="float-end">
                                                          Rs.{" "}
                                                          {checkoutItem.total_test_cost
                                                            .toString()
                                                            .replace(
                                                              /\B(?=(\d{3})+(?!\d))/g,
                                                              ","
                                                            )}
                                                        </span>
                                                      </h5>
                                                    </div>
                                                  </Td>
                                                </Tr>
                                              
                                            </>
                                          )
                                        )}
                                      </tfoot>
                                    </table>
                                  </div>
                                </div>

                              </CardBody>

                              {!isEmpty(this.state.payment_method) && (
  <Card className="shadow-none border mb-0">
    <CardBody className="text-center">
      <CardTitle className="mb-1">
        <i className="mdi mdi-wallet me-1 font-size-18 align-middle" style={{ color: 'red' }} />
        Payment Method
      </CardTitle>

      {this.state.payment_method !== "Card" && (
        <div>
          <p style={{ fontWeight: 'bold', marginTop: '10px' }}>
            {this.props.patientProfile && this.props.patientProfile.corporate_payment === "Payment by Coorporate to LH" && this.state.payment_method === "Cash" ? (
              // this.setState({ payment_method: "Corporate to Lab" }), // Setting the state directly
              <span style={{ color: 'red', marginLeft: '10px' }}>Corporate to Lab</span>
            ) : (
              <span style={{ color: 'red', marginLeft: '10px' }}>{this.state.payment_method}</span>
            )}
          </p>
        </div>
      )}

      {this.state.payment_method === "Card" && (
        <div>
          <p style={{ fontWeight: 'bold', marginTop: '10px' }}>
            <span style={{ marginLeft: '10px' }}>Provide Your Card Details:</span>
          </p>
        </div>
      )}

      {this.state.payment_method === "Donation" && (
        <div>
          <p style={{ fontWeight: 'bold', fontSize: '20px', marginTop: '10px', color: 'red', backgroundColor: 'grey' }}>
            Sub Total After Donation = Rs. 0
          </p>
        </div>
      )}

      {this.props.patientProfile && this.props.patientProfile.corporate_payment !== "Payment by Coorporate to LH" && this.props.patientProfile.corporate_payment !== "Payment by Patient to Lab" && (
        <div>
          <div className="table-responsive">
            <a
              href="#"
              onClick={this.handleClickAddPayment}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <i className="mdi mdi-pencil me-1 font-size-18 align-middle" style={{ color: 'red', fontWeight: "bold" }} />
              <strong>Change Your Payment Method</strong>
            </a>
          </div>
        </div>
      )}
    </CardBody>
  </Card>
)}

                              {isEmpty(this.state.payment_method) && (
                                <Card className="shadow-none border mb-0">
                                  <CardBody className="text-center">
                                    {/* <CardTitle className="mb-1">
                                      <i className="mdi mdi-wallet me-1 font-size-18 align-middle" style={{ color: 'red' }} />
                                      Payment method
                                    </CardTitle> */}
                                    <div>
                                      <div className="table-responsive">
                                        <a
                                          href="#"
                                          onClick={this.handleClickAddPayment}
                                          style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                          <i className="mdi mdi-plus me-1 font-size-18 align-middle" style={{ color: 'red', fontWeight: "bold" }} />
                                          <strong>Add Payment Method</strong>
                                        </a>
                                      </div>
                                    </div>
                                  </CardBody>
                                </Card>
                              )}

                              <Row className="mt-4">
                                <Col sm="6">
                                  <Link
                                    to="/cart"
                                    className="btn text-muted d-none d-sm-inline-block btn-link"
                                  >
                                    <i className="mdi mdi-arrow-left me-1" /> Back
                                    to Cart{" "}
                                  </Link>
                                </Col>
                                {this.state.payment_method !== "Card" ? (
                                  <Col sm="6">
                                  <div className="text-end">
                                    <button
                                      component={Link}
                                      onClick={this.handleFullProceedClick}
                                      to="/checkout"
                                      className="btn btn-success mb-4"
                                      disabled={this.state.checkoutSuccess}
                                    >
                                      <i className="mdi mdi-truck-fast me-1" />{" "}
                                      Book Appointment{" "}
                                    </button>
                                  </div>
                                </Col>
                                ) : (
                                  <Col sm="6">
                                  <div className="text-end">
                                  <button
                                      component={Link}
                                      to="/checkout"
                                      className="btn btn-success mb-4"
                                      disabled={this.state.checkoutSuccess}
                                      onClick={this.handlePayment}
                                  >
                                      <i className="mdi mdi-truck-fast me-1" /> Proceed Card Details
                                  </button>
                                  </div>
                                </Col>
                                )}
                                
                              </Row>
                            </Card>

                            </div>
                          </TabPane>

                          <TabPane
                            tabId="3"
                            id="v-pills-payment"
                            role="tabpanel"
                            aria-labelledby="v-pills-payment-tab"
                          >
                            <div>
                              <CardTitle className="h4">
                                Payment information
                              </CardTitle>
                              <p className="card-title-desc">
                                Fill the card payment only if your payment
                                method is card
                              </p>
                              {this.props.patientProfile && this.props.patientProfile.corporate_id == "undefined" && this.props.patientProfile.is_assosiatewith_anycorporate == false && this.props.patientProfile.corporate_payment == "Payment by Patient to Lab" ? (
                                  <div className="form-check form-check-inline font-size-16">
                                  <Input
                                    type="radio"
                                    value="Cash"
                                    name="payment_method"
                                    id="customRadioInline1"
                                    className="form-check-input"
                                    onChange={this.handlePaymentMethodChange}

                                  />
                                  <Label
                                    className="form-check-label font-size-13"
                                    htmlFor="customRadioInline1"
                                  >
                                    {/* <i className="far fa-money-bill-alt me-1 font-size-20 align-top" />{" "} */}
                                    <i className="fas fa-money-bill-alt me-1 font-size-18 align-top" style={{ color: 'green' }} />

                                    Cash on Spot
                                  </Label>
                                </div>
                              ) : this.props.patientProfile && this.props.patientProfile.corporate_payment == "Payment by Coorporate to LH" ? (
                                <div className="form-check form-check-inline font-size-16">
                                  <Input
                                    type="radio"
                                    value="Cash"
                                    defaultChecked
                                    name="payment_method"
                                    id="customRadioInline1"
                                    className="form-check-input"
                                    onChange={this.handlePaymentMethodChange}
                                  />
                                  <Label
                                    className="form-check-label font-size-13"
                                    htmlFor="customRadioInline1"
                                  >
                                    {/* <i className="far fa-money-bill-alt me-1 font-size-20 align-top" />{" "} */}
                                    <i className="fas fa-money-bill-alt me-1 font-size-18 align-top" style={{ color: 'green' }} />
                                    Corporate to Lab
                                  </Label>
                                </div>

                              ) :  <div>
                              <div className="form-check form-check-inline font-size-16">
                                <Input
                                  type="radio"
                                  value="Cash"
                                  // defaultChecked
                                  name="payment_method"
                                  id="customRadioInline1"
                                  className="form-check-input"
                                  onChange={this.handlePaymentMethodChange}

                                />
                                <Label
                                  className="form-check-label font-size-13"
                                  htmlFor="customRadioInline1"
                                >
                                  {/* <i className="far fa-money-bill-alt me-1 font-size-20 align-top" />{" "} */}
                                  <i className="fas fa-money-bill-alt me-1 font-size-18 align-top" style={{ color: 'green' }} />

                                  Cash on Spot
                                </Label>
                              </div>
                              <div className="form-check form-check-inline font-size-16">
                                <Input
                                  type="radio"
                                  value="Card"
                                  // defaultChecked
                                  id="customRadioInline2"
                                  name="payment_method"
                                  className="form-check-input"
                                  onChange={this.handlePaymentMethodChange}

                                />
                                <Label
                                  className="form-check-label font-size-13"
                                  htmlFor="customRadioInline2"
                                >
                                  <i
                                    className="fab fa-cc-mastercard me-1 font-size-20 align-top"
                                    style={{
                                      color: 'white', // Set the yellow color for the circles
                                      background: '#FFA800', // Set the red color for the background
                                    }}
                                  />
                                  Credit / Debit Card
                                </Label>
                              </div>
                              <div className="form-check form-check-inline font-size-16">
                                {!isEmpty(this.props.donationCheck) &&
                                  this.props.donationCheck.map(
                                    (donationcheck, key) => {
                                      return (
                                        <div key={"_donationcheck_" + key}>
                                          {donationcheck.bankaccount ===
                                            true ? (
                                            <div>
                                              <Input
                                                type="radio"
                                                value="Donation"
                                                name="payment_method"
                                                id="customRadioInline1"
                                                className="form-check-input"
                                                onChange={this.handlePaymentMethodChange}

                                              />
                                              <Label
                                                className="form-check-label font-size-13"
                                                htmlFor="customRadioInline1"
                                              >
                                                <i className="fas fa-hand-holding-heart me-1 font-size-20 align-top" style={{ color: 'red' }} />
                                                Avail Donation
                                              </Label>
                                            </div>
                                          ) : donationcheck.bankaccount ===
                                            false ? (
                                            <div style={{ display: 'none' }}></div>
                                          ) : null}
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                              <div className="form-check form-check-inline font-size-16">
                                {this.props.donationCheck.map(
                                  (donationcheck, key) => {
                                    return (
                                      <div key={"_donationcheck_" + key}>
                                        {donationcheck.available_credit >= donationcheck.grand_total_test_cost ? (
                                          <div>
                                            <Input
                                              type="radio"
                                              value="My Wallet"
                                              name="payment_method"
                                              id="customRadioInline1"
                                              className="form-check-input"
                                              onChange={this.handlePaymentMethodChange}

                                            />
                                            <Label
                                              className="form-check-label font-size-13"
                                              htmlFor="customRadioInline1"
                                            >
                                              <i className="mdi mdi-wallet align-middle me-1 font-size-20" style={{ color: '#0000FF' }} />
                                              My Wallet
                                            </Label>
                                          </div>
                                        ) : null}
                                      </div>
                                    );
                                  }
                                )}
                              </div>

                              <div className="d-flex justify-content-center">
                                {this.state.payment_method === "My Wallet" && (
                                  this.props.donationCheck.map((donationcheck, key) => (
                                    <div key={key} className="card" style={{ background: '#ADD8E6', width: '300px', height: '200px' }}>
                                      <div className="card-body d-flex flex-column justify-content-center">
                                        <h5 className="card-title text-center font-weight-bold">Available Credit in your Wallet</h5>
                                        <div className="card-text text-center" style={{ fontSize: '30px' }}>
                                          Rs. {donationcheck.available_credit}
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>




                              {this.state.payment_method == "Donation" ? (
                                <div>
                                  <h5 className="mt-5 mb-3 font-size-15">
                                    For Donation
                                  </h5>
                                  <div className="p-4 border">
                                    <Form>
                                      <FormGroup className="mb-0">
                                        <input
                                          name="donation"
                                          type="checkbox"
                                          required={true}
                                          // checked={false}
                                          onChange={this.handlePaymentMethodChange}
                                          checked={this.state.isChecked}
                                        />
                                        <b>
                                          {" "}
                                          I hereby confirm that I am deserving
                                          individual who fall into eligible
                                          category to avail obligatory charity
                                          / donation money.
                                        </b>
                                      </FormGroup>
                                    </Form>
                                  </div>
                                </div>
                              ) : null}
                            </div>}
                              
                            </div>
                            {/* <Row className="mt-4">
                              <Col sm="6"></Col>

                              <Col sm="6">
                                <div className="text-end">
                                  <button
                                    component={Link}
                                    onClick={() => {
                                      this.toggleTab("4");
                                    }}
                                    to="/checkout"
                                    className="btn btn-success mb-4"
                                  >
                                    <i className="mdi mdi-truck-fast me-1" />{" "}
                                    Next{" "}
                                  </button>
                                </div>
                              </Col>
                            </Row> */}
                          </TabPane>

                        </TabContent>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Container>
          </div>
        </React.Fragment>
      )
    );
  }
}

Checkout.propTypes = {
  match: PropTypes.object,
  history: any,
  homeSampledTests: PropTypes.array,
  donationCheck: PropTypes.array,
  onGetHomeSampledTests: PropTypes.func,
  onGetDonationCheck: PropTypes.func,
  checkoutItems: PropTypes.array,
  onGetCheckoutItems: PropTypes.func,
  onAddCheckoutData: PropTypes.func,
  checkedoutData: PropTypes.array,
  onGetTerritoriesList: PropTypes.func,
  territoriesList: PropTypes.array,
  onGetPatientProfile: PropTypes.func,
  patientProfile: PropTypes.array,
  className: PropTypes.any,

};

const mapStateToProps = state => ({
  homeSampledTests: state.checkout.homeSampledTests,
  donationCheck: state.checkout.donationCheck,
  patientProfile: state.LabMarket.patientProfile,
  checkoutItems: state.checkout.checkoutItems,
  checkedoutData: state.checkout.checkedoutData,
  territoriesList: state.territoriesList.territoriesList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetHomeSampledTests: id => dispatch(getHomeSampledTests(id)),
  onGetDonationCheck: id => dispatch(getDonationCheck(id)),
  onGetPatientProfile: id => dispatch(getPatientProfile(id)),
  onGetCheckoutItems: (
    id,
    is_home_sampling_availed,
    is_state_sampling_availed,
  ) =>
    dispatch(
      getCheckoutItems(id, is_home_sampling_availed, is_state_sampling_availed)
    ),
  onAddCheckoutData: (checkoutData, id) =>
    dispatch(addCheckoutData(checkoutData, id)),
  onGetTerritoriesList: id => dispatch(getTerritoriesList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Checkout));
