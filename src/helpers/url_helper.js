//REGISTER ORIGINAL

const API_ENDPOINT = process.env.REACT_APP_BACKENDURL;

// -------------- MY URLS --------------
export const POST_LOGIN = `${API_ENDPOINT}/api/account/login/`;
export const POST_REGISTER = `${API_ENDPOINT}/api/account/register/`;
// PASSWORD RESET
export const POST_FORGET_PASSWORD = `${API_ENDPOINT}/api/account/password_reset/`;
export const POST_CONFIRM_PASSWORD = `${API_ENDPOINT}/api/account/password_reset/confirm/`;
export const POST_CHANGE_PASSWORD = `${API_ENDPOINT}/api/account/change-password/`;

export const POST_PATIENT_INFORMATION = `${API_ENDPOINT}/api/patient/patient-information`;
export const POST_B2BCLIENT_INFORMATION = `${API_ENDPOINT}/api/b2bclient/register-b2bclient`;
export const POST_DONOR_INFORMATION = `${API_ENDPOINT}/api/donor/register-donor`;
export const POST_LAB_INFORMATION = `${API_ENDPOINT}/api/lab/lab-information`;
export const POST_CORPORATE_INFORMATION = `${API_ENDPOINT}/api/corporate/corporate-information`;

// LAB LIST
export const GET_LABS = `${API_ENDPOINT}/api/finance-officer/lab-MOF-list`;
export const GET_ALL_LABS_LIST = `${API_ENDPOINT}/api/finance-officer/labs-list`;
export const GET_MAIN_LABS = `${API_ENDPOINT}/api/lab/lab-list`;

// TEST
export const GET_TESTS = `${API_ENDPOINT}/api/medicaltest/test-list`;
export const GET_UNITS = `${API_ENDPOINT}/api/medicaltest/unit-list`;

// OFFERED TEST
export const GET_OFFERED_TESTS = `${API_ENDPOINT}/api/lab/offered-test-list`;
export const GET_OFFEREDTEST_REFERRELFEE = `${API_ENDPOINT}/api/lab/offered-test-share-list`;
export const GET_OFFEREDPROFILE_REFERRELFEE = `${API_ENDPOINT}/api/lab/offered-profile-share-list`;
export const GET_OFFEREDPACKAGE_REFERRELFEE = `${API_ENDPOINT}/api/lab/offered-package-share-list`;
export const GET_OFFEREDRADIOLOGY_REFERRELFEE = `${API_ENDPOINT}/api/lab/offered-radiology-share-list`;
export const ADD_NEW_OFFERED_TEST = `${API_ENDPOINT}/api/lab/offered-test`;
export const ADD_NEW_OFFERED_MAINTEST = `${API_ENDPOINT}/api/lab/offered-test-main-lab`;
export const UPDATE_OFFERED_TEST = `${API_ENDPOINT}/api/lab/offered-test`;
export const DELETE_OFFERED_TEST = `${API_ENDPOINT}/api/lab/offered-test`;

// Corporates
export const GET_COFFEREDTEST_REFERRELFEE = `${API_ENDPOINT}/api/lab/corporate-offered-test-share-list`;
export const GET_COFFEREDPROFILE_REFERRELFEE = `${API_ENDPOINT}/api/lab/corporate-offered-profile-share-list`;
export const GET_COFFEREDPACKAGE_REFERRELFEE = `${API_ENDPOINT}/api/lab/corporate-offered-packages-share-list`;
export const GET_COFFEREDRADIOLOGY_REFERRELFEE = `${API_ENDPOINT}/api/lab/corporate-offered-radiology-share-list`;
export const GET_CORPORATE_LIST = `${API_ENDPOINT}/api/corporate/list-corporate`;
// PATHOLOGIST
export const GET_ACTIVITY_LOG = `${API_ENDPOINT}/api/lab/activity-log`;
export const GET_NOTIFICATION = `${API_ENDPOINT}/api/lab/notifications`;
export const GET_SAMPLE_NOTIFICATION = `${API_ENDPOINT}/api/lab/sample-collector-notifications`;
export const GET_MARKETER_NOTIFICATION = `${API_ENDPOINT}/api/marketer-admin/marketer-notification`;
export const GET_CSR_ADMIN_NOTIFICATION = `${API_ENDPOINT}/api/csr-admin/csradmin-notification`;
export const GET_REG_ADMIN_NOTIFICATION = `${API_ENDPOINT}/api/registration-admin/regadmin-notification`;
export const GET_CSR_OFFICER_NOTIFICATION = `${API_ENDPOINT}/api/complaint/csrofficer-notification`;
export const GET_ACTIVITY_LOG_FINANCE = `${API_ENDPOINT}/api/finance-officer/activity-log-finance`;
export const GET_CORPORATE_COMMIT = `${API_ENDPOINT}/api/corporate/corporate-commit`;
export const GET_ACTIVITY_LOG_MARKETER = `${API_ENDPOINT}/api/marketer-admin/activity-log-marketer`;
export const GET_LAB_ACTIVITY_LOG_MARKETER = `${API_ENDPOINT}/api/marketer-admin/activity-log-lab-marketer`;
export const GET_PATHOLOGISTS = `${API_ENDPOINT}/api/lab/pathologist-list`;
export const ADD_NEW_PATHOLOGIST = `${API_ENDPOINT}/api/lab/pathologist`;
export const UPDATE_PATHOLOGIST = `${API_ENDPOINT}/api/lab/pathologist`;
export const DELETE_PATHOLOGIST = `${API_ENDPOINT}/api/lab/pathologist`;

// PATHOLOGIST
export const GET_BANKACCOUNTS = `${API_ENDPOINT}/api/finance-admin/bank-account`;
export const UPDATE_BANKACCOUNT = `${API_ENDPOINT}/api/finance-admin/bank-account`;
// export const DELETE_BANKACCOUNT = `${API_ENDPOINT}/api/lab/pathologist`;

// CART
export const GET_CARTS = `${API_ENDPOINT}/api/patient/cart-list`;
export const EMPTY_CART = `${API_ENDPOINT}/api/patient/cart-list`;
export const DELETE_CART = `${API_ENDPOINT}/api/patient/cart-item`;
export const ADD_TO_CART = `${API_ENDPOINT}/api/patient/cart-item`;

export const GET_QUOTES = `${API_ENDPOINT}/api/patient/quote-list`;

// SAMPLE COLLECTOR
export const GET_SAMPLE_COLLECTORS = `${API_ENDPOINT}/api/lab/sample-collector-list`;
export const ADD_NEW_SAMPLE_COLLECTOR = `${API_ENDPOINT}/api/lab/sample-collector`;
export const UPDATE_SAMPLE_COLLECTOR = `${API_ENDPOINT}/api/lab/sample-collector`;
export const DELETE_SAMPLE_COLLECTOR = `${API_ENDPOINT}/api/lab/sample-collector`;

// QUALITY CERTIFICATES
export const ADD_NEW_COLLECTIONPOINT_QUALITY = `${API_ENDPOINT}/api/lab/quality-certificate-collectionpoint-list`;
export const GET_QUALITY_CERTIFICATES = `${API_ENDPOINT}/api/lab/quality-certificate-list`;
export const ADD_NEW_QUALITY_CERTIFICATE = `${API_ENDPOINT}/api/lab/quality-certificate`;
export const UPDATE_QUALITY_CERTIFICATE = `${API_ENDPOINT}/api/lab/quality-certificate`;
export const DELETE_QUALITY_CERTIFICATE = `${API_ENDPOINT}/api/lab/quality-certificate`;

// ADVERTISEMENTS
export const GET_ADVERTISEMENTS = `${API_ENDPOINT}/api/marketer-admin/advertisement-list`;
export const ADD_NEW_ADVERTISEMENT = `${API_ENDPOINT}/api/marketer-admin/advertisement`;
export const UPDATE_ADVERTISEMENT = `${API_ENDPOINT}/api/marketer-admin/advertisement`;
export const DELETE_ADVERTISEMENT = `${API_ENDPOINT}/api/marketer-admin/advertisement`;

// LAB ADVERTISEMENTS
export const GET_LAB_ADVERTISEMENTS = `${API_ENDPOINT}/api/lab/lab-advertisement`;
export const ADD_NEW_LAB_ADVERTISEMENT = `${API_ENDPOINT}/api/lab/lab-advertisement`;
export const UPDATE_LAB_ADVERTISEMENT = `${API_ENDPOINT}/api/lab/lab-advertisement`;
export const DELETE_LAB_ADVERTISEMENT = `${API_ENDPOINT}/api/lab/lab-advertisement`;

// LAB ADVERTISEMENTS REQUESTS PENDING
export const GET_LAB_ADVERTISEMENT_REQUESTS = `${API_ENDPOINT}/api/marketer-admin/lab-advertisement-request`;
export const UPDATE_LAB_ADVERTISEMENT_REQUEST = `${API_ENDPOINT}/api/marketer-admin/lab-advertisement-request`;

// LAB ADVERTISEMENTS REQUESTS ACCEPTED
export const GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED = `${API_ENDPOINT}/api/marketer-admin/lab-advertisement-accepted-list`;

// ADVERTISEMENTS LIVE
export const GET_ADVERTISEMENT_LIVES = `${API_ENDPOINT}/api/marketer-admin/advertisement-live`;

// ADVERTISEMENTS LIVE
export const GET_ADV_LIVE = `${API_ENDPOINT}/api/marketer-admin/advertisement-live`;

// ADVERTISEMENT PRICE LIST
export const GET_ADVERTISEMENT_PRICE_LISTS = `${API_ENDPOINT}/api/marketer-admin/advertisement-price-list`;
export const ADD_NEW_ADVERTISEMENT_PRICE_LIST = `${API_ENDPOINT}/api/marketer-admin/advertisement-price`;
export const UPDATE_ADVERTISEMENT_PRICE_LIST = `${API_ENDPOINT}/api/marketer-admin/advertisement-price`;
export const DELETE_ADVERTISEMENT_PRICE_LIST = `${API_ENDPOINT}/api/marketer-admin/advertisement-price`;

// DISCOUNT LAB HAZIR
export const GET_DISCOUNT_LABHAZIR = `${API_ENDPOINT}/api/marketer-admin/discount-test`;
export const UPDATE_DISCOUNT_LABHAZIR = `${API_ENDPOINT}/api/marketer-admin/discount-test`;
export const UPDATE_DISCOUNT_ALL_LABHAZIR = `${API_ENDPOINT}/api/marketer-admin/discount-all-tests`;
export const GET_LABS_LIST = `${API_ENDPOINT}/api/marketer-admin/labs-list`;
export const GET_DISCOUNT_LABHAZIRTOLABS = `${API_ENDPOINT}/api/marketer-admin/discount-labhazir-lab-test`; 
export const UPDATE_DISCOUNT_LABHAZIRTOLAB = `${API_ENDPOINT}/api/marketer-admin/discount-labhazir-lab-test`;
export const UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB = `${API_ENDPOINT}/api/marketer-admin/discount-labhazir-lab-all-tests`;


export const GET_REFERREL_FEES = `${API_ENDPOINT}/api/registration-admin/referrel-fee-labhazir`;
export const GET_REVIEW_PERFORMANCE = `${API_ENDPOINT}/api/registration-admin/totallabsView-labs`;
export const GET_REVIEW_PERFORMANCE_TEST = `${API_ENDPOINT}/api/registration-admin/totalofferedtestsView-tests`;

export const GET_PUT_REFERREL_FEES = `${API_ENDPOINT}/api/registration-admin/approve-referrel-fee-labhazir`;
export const UPDATE_REFERREL_FEE = `${API_ENDPOINT}/api/registration-admin/update-referrel-fee-labhazir`;
export const UPDATE_REFERREL_ALL_FEE = `${API_ENDPOINT}/api/registration-admin/all-referrel-fee-labhazir`;
export const GET_LABS_LIST_PENDING_FEE = `${API_ENDPOINT}/api/registration-admin/lab-list-pending`;
export const GET_LABS_LIST_APPROVED_FEE = `${API_ENDPOINT}/api/registration-admin/lab-list-approved`;
export const GET_SHARED_PERCENTAGE_PENDING_FEE = `${API_ENDPOINT}/api/registration-admin/shared_percentage_pending_tests`;
export const GET_SHARED_PERCENTAGE_APPROVED_FEE = `${API_ENDPOINT}/api/registration-admin/shared_percentage_Approved_tests`;
export const UPDATE_SHARED_PERCENTAGE_PENDING_FEE = `${API_ENDPOINT}/api/registration-admin/shared_percentage_pending_tests`;
export const UPDATE_SHARED_PERCENTAGE_ALL_PENDING_FEE = `${API_ENDPOINT}/api/registration-admin/shared_percentage_all_pending_tests`;

// DISCOUNT LAB
export const GET_DISCOUNT_LAB = `${API_ENDPOINT}/api/lab/offered-test-discount-list`;
export const UPDATE_DISCOUNT_LAB = `${API_ENDPOINT}/api/lab/discount-offered-test`;
export const UPDATE_DISCOUNT_ALL_LAB = `${API_ENDPOINT}/api/lab/discount-all-offered-tests`;
export const GET_FEEDBACKS = `${API_ENDPOINT}/api/lab/feedback-list`;

// TERRITORIES LIST
export const GET_TERRITORIES_LIST = `${API_ENDPOINT}/api/territories/district-city-list`;

// CORPORATES LIST
export const GET_CORPORATES_LIST = `${API_ENDPOINT}/api/corporate/corporates-list`;

// TERRITORIES LIST
export const GET_LAB_NAMES_LIST = `${API_ENDPOINT}/api/lab/lab-names`;

// MEDICAL LIST
export const GET_ONLY_MEDICAL_LIST = `${API_ENDPOINT}/api/medicaltest/only-medical-tests`;

// CSR CENTRAL TERRITORIES LIST
export const GET_CSR_CENTRAL_TERRITORY_LIST = `${API_ENDPOINT}/api/staff/csr-central-list`;
// CSR SOUTH TERRITORIES LIST
export const GET_CSR_SOUTH_TERRITORY_LIST = `${API_ENDPOINT}/api/staff/csr-south-list`;
// CSR NORTH TERRITORIES LIST
export const GET_CSR_NORTH_TERRITORY_LIST = `${API_ENDPOINT}/api/staff/csr-north-list`;


// AUDITOR CENTRAL TERRITORIES LIST
export const GET_AUDITOR_CENTRAL_TERRITORY_LIST = `${API_ENDPOINT}/api/staff/auditor-central-list`;
// auditor SOUTH TERRITORIES LIST
export const GET_AUDITOR_SOUTH_TERRITORY_LIST = `${API_ENDPOINT}/api/staff/auditor-south-list`;
// auditor NORTH TERRITORIES LIST
export const GET_AUDITOR_NORTH_TERRITORY_LIST = `${API_ENDPOINT}/api/staff/auditor-north-list`;


// TEST APPOINTMENT
export const ADD_NEW_COLLECTIONPOINT_TESTAPPOINTMENT = `${API_ENDPOINT}/api/lab/test-appointment-collectionpoint-list`;
export const GET_TEST_APPOINTMENTS_PENDING_LIST = `${API_ENDPOINT}/api/lab/test-appointment-pending-list`;
export const GET_TEST_APPOINTMENTS_IN_PROCESS_LIST = `${API_ENDPOINT}/api/lab/test-appointment-in-process-list`;
export const GET_TEST_APPOINTMENTS_COMPLETED_LIST = `${API_ENDPOINT}/api/lab/test-appointment-completed-list`;
export const UPDATE_TEST_APPOINTMENT = `${API_ENDPOINT}/api/lab/test-appointment-update`;

// PAYMENT IN STATUS
export const GET_ACCEPTED_LAB_ADVERTISEMENTS = `${API_ENDPOINT}/api/marketer-admin/lab-advertisement-accepted-list`;
export const GET_PAYMENT_IN_STATUS_CREATED_LIST = `${API_ENDPOINT}/api/finance-officer/get-payment-in-created`;
export const GET_PAYMENT_IN_STATUS_DEPOSITED_LIST = `${API_ENDPOINT}/api/finance-officer/get-payment-in-deposited`;
export const GET_LABS_MOF = `${API_ENDPOINT}/api/finance-officer/lab-MOF-list`;
export const GET_LABS_C = `${API_ENDPOINT}/api/finance-officer/lab-c-list`;

// PATIENT TEST APPOINTMENT
export const GET_PATIENT_TEST_APPOINTMENTS_LIST = `${API_ENDPOINT}/api/patient/test-appointment-list`;

// B2B Client
export const GET_B2B_REFERRED_PATIENTS_LIST = `${API_ENDPOINT}/api/b2bclient/b2breferred-patient`;
export const GET_B2B_LAB_SHARES_LIST = `${API_ENDPOINT}/api/b2bclient/list-b2bShare`;
export const UPDATE_LAB_SHARE = `${API_ENDPOINT}/api/b2bclient/list-b2bShare`;
export const UPDATE_ALL_LAB_SHARE = `${API_ENDPOINT}/api/b2bclient/b2bshare-update`;

export const GET_B2B_SHARES_LAB_LIST = `${API_ENDPOINT}/api/b2bclient/b2b-Share`;


// Donor SETTINGS
export const ADD_NEW_B2B_PAYMENT = `${API_ENDPOINT}/api/b2bclient/b2b-payment`;


// // B2B List 
// export const GET_B2B_ALL_CLIENTS_LIST = `${API_ENDPOINT}/api/labhaziradmin/list-b2b`;

//Donor
export const GET_DONOR_REFERRED_APPOINTMENTS_LIST = `${API_ENDPOINT}/api/donor/appointment-donor`;

// B2B List
export const GET_B2B_ALL_CLIENTS_LIST = `${API_ENDPOINT}/api/b2b-admin/b2b-clients-list`;
export const GET_PATIENTS_LIST = `${API_ENDPOINT}/api/patient/patient-list`;


export const ADD_NEW_LAB_SHARE = `${API_ENDPOINT}/api/b2bclient/list-b2bShare`;

export const GET_B2B_CLIENTS = `${API_ENDPOINT}/api/b2b-admin/b2b-clients-list`;

// CSR (COMPLAINTS)
export const GET_UNHANDLED_COMPLAINTS = `${API_ENDPOINT}/api/complaint/unhandled-complaints`;
export const UPDATE_UNHANDLED_COMPLAINTS = `${API_ENDPOINT}/api/complaint/unhandled-complaints`;
export const GET_HANDLED_COMPLAINTS = `${API_ENDPOINT}/api/complaint/handled-complaints`;
export const GET_CSR_COMPLAINTS = `${API_ENDPOINT}/api/staff/csr-appointment`;
export const UPDATE_CSR_COMPLAINTS = `${API_ENDPOINT}/api/staff/csr-appointment`;
export const GET_CSR_APPOINTMENTS = `${API_ENDPOINT}/api/staff/csr-admin-appointment`;
export const UPDATE_CSR_APPOINTMENTS = `${API_ENDPOINT}/api/staff/csr-admin-appointment`;
export const ADD_NEW_NOTE_COMPLAINT =`${API_ENDPOINT}/api/complaint/add-note`;
export const GET_NOTES_COMPLAINT = `${API_ENDPOINT}/api/complaint/add-note`;

export const ADD_NEW_NOTE =`${API_ENDPOINT}/api/staff/add-note`;
export const GET_NOTES = `${API_ENDPOINT}/api/staff/add-note`;
export const ADD_NEW_MSG =`${API_ENDPOINT}/api/marketer-admin/add-message`;
export const GET_MSGS = `${API_ENDPOINT}/api/marketer-admin/add-message`;
// TEST DESCRIPTION
export const GET_TEST_DESCRIPTIONS = `${API_ENDPOINT}/api/medicaltest/test`;

// LAB PROFILES
export const GET_LAB_PROFILE = `${API_ENDPOINT}/api/lab/lab-profile`;
export const GET_LAB_TOKEN =  `${API_ENDPOINT}/api/lab/lab-tokens`;
export const UPDATE_LAB_PROFILE = `${API_ENDPOINT}/api/lab/lab-profile`;

// B2b PROFILES
export const GET_B2B_PROFILE = `${API_ENDPOINT}/api/b2bclient/b2b-profile`;
export const UPDATE_B2B_PROFILE = `${API_ENDPOINT}/api/b2bclient/b2b-profile`;

// Donor PROFILES
export const GET_DONOR_PROFILE = `${API_ENDPOINT}/api/donor/profile-donor`;
export const UPDATE_DONOR_PROFILE = `${API_ENDPOINT}/api/donor/profile-donor`;

// Donor SETTINGS
export const GET_DONOR_SETTINGS = `${API_ENDPOINT}/api/lab/lab-settings`;
export const UPDATE_DONOR_SETTINGS = `${API_ENDPOINT}/api/lab/lab-settings`;

// Donor SETTINGS
export const ADD_NEW_DONOR_PAYMENT = `${API_ENDPOINT}/api/donor/donor-payment`;

// ADD ACCOUNT
export const ADD_NEW_CREATE_BANK = `${API_ENDPOINT}/api/finance-admin/bank`;
export const ADD_NEW_BANK_ACCOUNT = `${API_ENDPOINT}/api/finance-admin/bank-account`;

// ADD CORPORATE EMPLOYEE DATA
export const ADD_NEW_CEMPLOYEE_DATA = `${API_ENDPOINT}/api/corporate/employee-data`;
export const GET_CEMPLOYEE = `${API_ENDPOINT}/api/corporate/employee-list`;
export const GET_LABCORPORATE = `${API_ENDPOINT}/api/lab/corporatelist`;
export const GET_ALABCORPORATE = `${API_ENDPOINT}/api/lab/accepted-corporates-list`;
export const GET_ACORPORATE = `${API_ENDPOINT}/api/corporate/all-corporates-list`;
export const GET_RFeeCORPORATE = `${API_ENDPOINT}/api/lab/corporate-feffrellfee`;
export const UPDATE_ACORPORATE_STATUS = `${API_ENDPOINT}/api/corporate/update-corporate-list`;
export const GET_EMPLOYEECORPORATE = `${API_ENDPOINT}/api/corporate/employee-list`;
export const GET_LABSCORPORATE = `${API_ENDPOINT}/api/corporate/corporate-lab-list`;
export const UPDATE_CEMPLOYEE = `${API_ENDPOINT}/api/corporate/employee-data`;
export const ADD_NEW_CORPORATE_TEST = `${API_ENDPOINT}/api/corporate/corporate-offered-test`;
export const GET_CORPORATE_TESTS = `${API_ENDPOINT}/api/corporate/corporate-test-list`;
export const UPDATE_CORPORATE_TEST = `${API_ENDPOINT}/api/corporate/corporate-offered-test`;
export const UPDATE_CORPORATE_STATUS = `${API_ENDPOINT}/api/lab/accepted-corporates-list`;
export const ADD_NEW_CORPORATE = `${API_ENDPOINT}/api/lab/corporatelist`;
export const ADD_NEW_CEMPLOYEE_FILE = `${API_ENDPOINT}/api/corporate/employee-data-file`;
export const DELETE_CEDATA = `${API_ENDPOINT}/api/corporate/employee-data`;
export const DELETE_TESTS_IN_APPOINTMENTS = `${API_ENDPOINT}/api/patient/reduce-tests`;
// About All Finance
export const GET_BANK_ACCOUNTS = `${API_ENDPOINT}/api/finance-admin/bankaccount-list`;
export const GET_BANKS = `${API_ENDPOINT}/api/finance-admin/bank-list`;
export const UPDATE_BANK = `${API_ENDPOINT}/api/finance-admin/bank`;

export const ADD_NEW_IN_PAYMENT = `${API_ENDPOINT}/api/finance-officer/payment-in`;
export const GET_IN_PAYMENT = `${API_ENDPOINT}/api/finance-officer/payment-in`;

export const ADD_NEW_OUT_PAYMENT = `${API_ENDPOINT}/api/finance-officer/payment-out`;
export const ADD_NEW_CORPORATE_PAYMENT = `${API_ENDPOINT}/api/corporate/corporate-payment-out`;
export const GET_OUT_PAYMENT = `${API_ENDPOINT}/api/finance-officer/payment-out`;
export const DELETE_PAYMENTOUT = `${API_ENDPOINT}/api/finance-officer/payment-out`;
export const GET_LIST_DONATIONAPPOINTMENT = `${API_ENDPOINT}/api/finance-officer/alldonation-Appointments`;
export const GET_LIST_CLABS = `${API_ENDPOINT}/api/finance-officer/all-lab-c-list`;


export const ADD_NEW_INVOICE_ADJUSTMENT = `${API_ENDPOINT}/api/finance-officer/invoice-adjustment-detail`;

// Get Invoice LIst
export const GET_LIST_INVOICE = `${API_ENDPOINT}/api/finance-officer/all-invoices-list`;

// Get DONATION Appointments
export const GET_ALL_DONATION_APPOINTMENTS = `${API_ENDPOINT}/api/finance-officer/donation-Appointments`;

// Bank Transfer Details
export const ADD_NEW_BANK_TRANSFER = `${API_ENDPOINT}/api/finance-officer/bank-transfer-detail`;
export const UPDATE_BANK_TRANSFER = `${API_ENDPOINT}/api/finance-officer/bank-transfer-detail`;
export const GET_BANK_TRANSFER = `${API_ENDPOINT}/api/finance-officer/bank-transfer-detail`;

export const GET_PAYMENT_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-in-created`;
//////////////////////////
export const GET_PAY_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-in-created`;
export const GET_DEPOSIT_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-in-deposited`;
export const GET_CLEAR_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-in-cleared`;
export const UPDATE_PAYMENT_STATUS = `${API_ENDPOINT}/api/finance-officer/payment-in`;
export const UPDATE_PAYMENTIN_STATUS = `${API_ENDPOINT}/api/finance-officer/get-payment-in-deposited`;
export const GET_BOUNCEDIN_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-in-bounced`;
export const UPDATE_PAYMENTINBOUNCED_STATUS = `${API_ENDPOINT}/api/finance-officer/get-payment-in-bounced`;
export const GET_PAYMENTOUT_CLEAR_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-out-cleared`;
export const GET_PAYMENTOUT_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-out-pending`;
export const GET_CREATEDOUT_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-out-created`;
export const GET_CREATEDOUTDETAIL_STATUSS = `${API_ENDPOINT}/api/corporate/corporate-payment-detail`;
export const UPDATE_PAYMENTOUT_STATUS = `${API_ENDPOINT}/api/finance-officer/get-payment-out-pending`;
export const UPDATE_PAYMENTOUTCREATED_STATUS = `${API_ENDPOINT}/api/finance-officer/get-payment-out-created`;
export const GET_BOUNCED_STATUSS = `${API_ENDPOINT}/api/finance-officer/get-payment-out-bounced`;


// Corporate out payment lists
export const GET_CCREATEDOUT_STATUSS  = `${API_ENDPOINT}/api/corporate/corporate-payment-out`;
export const UPDATE_PAYMENTOUTCCREATED_STATUS = `${API_ENDPOINT}/api/corporate/corporate-payment-out`;

// LAB SETTINGS
export const GET_LAB_SETTINGS = `${API_ENDPOINT}/api/lab/lab-settings`;
export const UPDATE_LAB_SETTINGS = `${API_ENDPOINT}/api/lab/lab-settings`;

// PATIENT PROFILES
export const GET_PATIENT_PROFILE = `${API_ENDPOINT}/api/patient/patient-profile`;
export const UPDATE_PATIENT_PROFILE = `${API_ENDPOINT}/api/patient/patient-profile`;

// PATIENT FEEDBACK
export const ADD_NEW_PATIENT_FEEDBACK = `${API_ENDPOINT}/api/patient/feedback`;
// COMPLAINT
export const ADD_NEW_COMPLAINT = `${API_ENDPOINT}/api/complaint/register-complaint`;

// corporate PROFILES
export const GET_CORPORATE_PROFILE = `${API_ENDPOINT}/api/corporate/corporate-profile`;
export const UPDATE_CORPORATE_PROFILE = `${API_ENDPOINT}/api/corporate/corporate-profile`;

// NEARBY LABS
export const GET_NEARBY_LABS = `${API_ENDPOINT}/api/patient/nearby-labs`;

// Cororate LABS
export const GET_CORPORATE_LABS = `${API_ENDPOINT}/api/patient/corporate-labs`;

// REGION WISE ADVERTISEMENT
export const GET_REGION_WISE_ADVERTISEMENT = `${API_ENDPOINT}/api/marketer-admin/region-wise-advertisements`;

export const GET_DONORS = `${API_ENDPOINT}/api/donor/list-donor`;
export const GET_DONORSA = `${API_ENDPOINT}/api/finance-admin/donationappointment-list`;
export const GET_LABS_LISTING = `${API_ENDPOINT}/api/marketer-admin/labs-list`;
export const GET_DONORS_LIST = `${API_ENDPOINT}/api/donor/list-donor`;
// export const GET_CL_LIST = `${API_ENDPOINT}/api/accountstatement/corporate-account-statements-list`;
export const GET_CL_LIST = `${API_ENDPOINT}/api/accountstatement/corporate-statements-list`;

// NEARBY TESTS
export const GET_NEARBY_TESTS = `${API_ENDPOINT}/api/patient/tests-offered`;
export const GET_NEARBY_TESTS_DISCOUNTEDLH = `${API_ENDPOINT}/api/patient/LHDiscount-offeredTest`;
export const GET_NEARBY_PROFILES = `${API_ENDPOINT}/api/patient/profiles-offered`;
export const GET_PROFILES = `${API_ENDPOINT}/api/medicaltest/profile-list`;
export const GET_TESTSS = `${API_ENDPOINT}/api/medicaltest/tests-list`;
export const GET_PACKAGES = `${API_ENDPOINT}/api/medicaltest/package-list`;
export const GET_NEARBY_PACKAGES = `${API_ENDPOINT}/api/patient/packages-offered`;
export const GET_RADIOLOGY = `${API_ENDPOINT}/api/medicaltest/radiology-list`;
export const GET_TESTS_LIST = `${API_ENDPOINT}/api/medicaltest/test-list`;
export const GET_CORPORATE_TESTS_LIST = `${API_ENDPOINT}/api/medicaltest/corporate-test-list`;
export const GET_NEARBY_RADIOLOGY = `${API_ENDPOINT}/api/patient/radiology-tests-offered`;

// CHECKOUT
export const GET_HOME_SAMPLED_TESTS = `${API_ENDPOINT}/api/patient/home-sampled-tests`;
export const GET_DONATION_CHECK = `${API_ENDPOINT}/api/patient/donation-check`;
export const GET_CHECKOUT_ITEMS = `${API_ENDPOINT}/api/patient/checkout-items`;
export const ADD_CHECKOUT_DATA = `${API_ENDPOINT}/api/patient/checkout`;

// INVOICES
export const GET_INVOICE_DETAIL = `${API_ENDPOINT}/api/patient/invoice-detail`;
/////////get tests

export const GET_TESTS_IN_APPOINTMENTS = `${API_ENDPOINT}/api/patient/tests-in-appointments`;

// ADVERTISEMENT INVOICES
export const GET_ADV_INVOICE = `${API_ENDPOINT}/api/lab/lab-advertisement-invoice`;

// PAYMENT
export const UPDATE_LAB_PAYMENTS = `${API_ENDPOINT}/api/patient/payment-info`;
export const GET_LAB_PAYMENTS = `${API_ENDPOINT}/api/patient/payment-info`;

// ACCOUNT STATEMENTS
export const GET_ACCOUNT_STATEMENTS = `${API_ENDPOINT}/api/accountstatement/lab-account-statements`;

// Bank Statements
export const GET_BANK_STATEMENTS = `${API_ENDPOINT}/api/finance-officer/bank-transfer-statement`;

// DONOR STATEMENYTS
export const GET_DONOR_ACCOUNT_STATEMENTS = `${API_ENDPOINT}/api/accountstatement/donor-account-statements`;
export const GET_DONORS_ACCOUNT_STATEMENTS = `${API_ENDPOINT}/api/accountstatement/donor-account-statements`;

// DONOR STATEMENYTS
export const GET_B2B_ACCOUNT_STATEMENTS = `${API_ENDPOINT}/api/accountstatement/b2b-account-statements`;
export const GET_CLAB_ACCOUNT_STATEMENTS = `${API_ENDPOINT}/api/accountstatement/corporate-lab-account-statements`;

// STAFF PROFILES
export const GET_STAFF_PROFILE = `${API_ENDPOINT}/api/staff/staff-profile`;
export const UPDATE_STAFF_PROFILE = `${API_ENDPOINT}/api/staff/staff-profile`;

// SAMPLE COLLECTOR PROFILES
export const GET_SAMPLE_COLLECTOR_PROFILE = `${API_ENDPOINT}/api/samplecollector/sample-collector-profile`;
export const UPDATE_SAMPLE_COLLECTOR_PROFILE = `${API_ENDPOINT}/api/samplecollector/sample-collector-profile`;

// SAMPLE COLLECTOR TEST APPOINTMENTS
export const GET_SAMPLE_COLLECTION_IN_PROCESS_LIST = `${API_ENDPOINT}/api/samplecollector/sample-collector-in-process`;
export const GET_SAMPLE_COLLECTION_COMPLETED_LIST = `${API_ENDPOINT}/api/samplecollector/sample-collector-completed`;
export const UPDATE_SAMPLE_COLLECTION_STATUS = `${API_ENDPOINT}/api/samplecollector/sample-collector-in-process`;

// REGISTRATION ADMIN
export const GET_PENDING_CORPORATE = `${API_ENDPOINT}/api/registration-admin/pending-corporate`;
export const GET_APPROVED_CORPORATE = `${API_ENDPOINT}/api/registration-admin/approved-corporate`;
export const GET_UNAPPROVED_CORPORATE = `${API_ENDPOINT}/api/registration-admin/unapproved-corporate`;
export const APPROVE_UNAPPROVE_CORPORATE = `${API_ENDPOINT}/api/registration-admin/approve-unapprove-corporate`;


export const GET_PENDING_LABS = `${API_ENDPOINT}/api/registration-admin/pending-labs`;
export const GET_APPROVED_LABS = `${API_ENDPOINT}/api/registration-admin/approved-labs`;
export const GET_UNAPPROVED_LABS = `${API_ENDPOINT}/api/registration-admin/unapproved-labs`;
export const APPROVE_UNAPPROVE_LAB = `${API_ENDPOINT}/api/registration-admin/approve-unapprove-lab`;

export const GET_PENDING_B2B_CLIENTS = `${API_ENDPOINT}/api/registration-admin/pending-b2b-clients`;
export const GET_APPROVED_B2B_CLIENTS = `${API_ENDPOINT}/api/registration-admin/approved-b2b-clients`;
export const GET_UNAPPROVED_B2B_CLIENTS = `${API_ENDPOINT}/api/registration-admin/unapproved-b2b-clients`;
export const APPROVE_UNAPPROVE_B2B_CLIENT = `${API_ENDPOINT}/api/registration-admin/approve-unapprove-b2b-client`;

export const GET_PENDING_DONORS = `${API_ENDPOINT}/api/registration-admin/pending-donors`;
export const GET_APPROVED_DONORS = `${API_ENDPOINT}/api/registration-admin/approved-donors`;
export const GET_UNAPPROVED_DONORS = `${API_ENDPOINT}/api/registration-admin/unapproved-donors`;
export const APPROVE_UNAPPROVE_DONOR = `${API_ENDPOINT}/api/registration-admin/approve-unapprove-donor`;
export const GET_LABS_RATING = `${API_ENDPOINT}/api/registration-admin/labs-rating`;
export const GET_LABS_TESTING = `${API_ENDPOINT}/api/marketer-admin/labs-list`;

// FINANCE ADMIN


export const GET_CLEARED_IN_PAYMENTS = `${API_ENDPOINT}/api/finance-admin/cleared-in-payments`;
export const GET_APPROVED_IN_PAYMENTS = `${API_ENDPOINT}/api/finance-admin/cleared-out-payments`;
export const GET_UNAPPROVED_IN_PAYMENTS = `${API_ENDPOINT}/api/finance-admin/unapproved-in-payments`;
export const UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT = `${API_ENDPOINT}/api/finance-admin/approve-unapprove-in-payment`;
export const GET_LC_LIST = `${API_ENDPOINT}/api/accountstatement/corporate-account-statements-list`;



// STAFF
export const GET_CSR_LIST = `${API_ENDPOINT}/api/staff/csr-list`;
export const GET_MARKETERS_LIST = `${API_ENDPOINT}/api/staff/marketers-list`;
export const GET_AUDITOR_LIST = `${API_ENDPOINT}/api/staff/auditor-list`;
export const GET_FINANCE_OFFICER_LIST = `${API_ENDPOINT}/api/staff/finance-officer-list`;
export const ADD_STAFF = `${API_ENDPOINT}/api/staff/register-staff`;
export const UPDATE_STAFF = `${API_ENDPOINT}/api/staff/register-staff`;
export const DELETE_STAFF = `${API_ENDPOINT}/api/staff/register-staff`;

// CSR ADMIN
export const GET_PENDING_COMPLAINTS = `${API_ENDPOINT}/api/csr-admin/pending-complaints-lab`;
export const GET_PENDING_COMPLAINTS_LABHAZIR = `${API_ENDPOINT}/api/csr-admin/pending-complaints-labhazir`;
export const GET_INPROCESS_COMPLAINTS = `${API_ENDPOINT}/api/csr-admin/inprocess-complaints`;
export const GET_INPROCESS_COMPLAINTS_LABHAZIR = `${API_ENDPOINT}/api/csr-admin/inprocess-complaints-labhazir`;
export const GET_RESOLVED_COMPLAINTS = `${API_ENDPOINT}/api/csr-admin/resolved-complaints`;
export const GET_RESOLVED_COMPLAINTS_LABHAZIR = `${API_ENDPOINT}/api/csr-admin/resolved-complaints-labhazir`;
export const ASSIGN_COMPLAINT = `${API_ENDPOINT}/api/csr-admin/pending-complaints-lab`;

// AUDITOR ADMIN
export const GET_PENDING_AUDITS = `${API_ENDPOINT}/api/auditor-admin/pending-audits`;
export const GET_INPROCESS_AUDITS = `${API_ENDPOINT}/api/auditor-admin/inprocess-audits`;
export const GET_PASSED_AUDITS = `${API_ENDPOINT}/api/auditor-admin/passed-audits`;
export const GET_FAILED_AUDITS = `${API_ENDPOINT}/api/auditor-admin/failed-audits`;
export const ASSIGN_AUDIT = `${API_ENDPOINT}/api/auditor-admin/pending-audits`;
export const ADD_LABS_AUDIT = `${API_ENDPOINT}/api/auditor-admin/pending-audits`;
export const GET_LABS_AUDIT_LIST = `${API_ENDPOINT}/api/auditor-admin/labs-list`;
export const GET_LABS_ALL_AUDIT_LIST = `${API_ENDPOINT}/api/auditor-admin/labs-audit-list`;

// AUDITS
export const GET_ASSIGNED_AUDITS = `${API_ENDPOINT}/api/auditor/assigned-audits`;
export const GET_ACTIVITY_LOG_AUDITOR = `${API_ENDPOINT}/api/auditor/activitylog-audits`;
export const UPDATE_ASSIGNED_AUDITS = `${API_ENDPOINT}/api/auditor/assigned-audits`;
export const GET_AUDITORS_COMPLETED_AUDITS = `${API_ENDPOINT}/api/auditor/completed-audits`;

export const GET_LAB_AUDITS = `${API_ENDPOINT}/api/lab/audits`;
export const ADD_NEW_AUDIT = `${API_ENDPOINT}/api/lab/audits`;
export const UPDATE_AUDIT_STATUS = `${API_ENDPOINT}/api/lab/reaudits-labs`;
// -------------- TEMPLATES URLS --------------

//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register";

//LOGIN
export const POST_FAKE_LOGIN = "/post-fake-login";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";
export const POST_EDIT_PROFILE = "/post-fake-profile";

//PRODUCTS
export const GET_PRODUCTS = "/products";
export const GET_PRODUCTS_DETAIL = "/product";
export const ADD_NEW_PROJECT = "/add/product";
export const UPDATE_PROJECT = "/update/product";
export const DELETE_PROJECT = "/delete/product";

//CALENDER
export const GET_EVENTS = "/events";
export const ADD_NEW_EVENT = "/add/event";
export const UPDATE_EVENT = "/update/event";
export const DELETE_EVENT = "/delete/event";
export const GET_CATEGORIES = "/categories";

//CHATS
export const GET_CHATS = "/chats";
export const GET_GROUPS = "/groups";
export const GET_CONTACTS = "/contacts";
export const GET_MESSAGES = "/messages";
export const ADD_MESSAGE = "/add/messages";

//ORDERS
export const GET_ORDERS = "/orders";
export const ADD_NEW_ORDER = "/add/order";
export const UPDATE_ORDER = "/update/order";
export const DELETE_ORDER = "/delete/order";

//CART DATA
export const GET_CART_DATA = "/cart";

//CUSTOMERS
export const GET_CUSTOMERS = "/customers";
export const ADD_NEW_CUSTOMER = "/add/customer";
export const UPDATE_CUSTOMER = "/update/customer";
export const DELETE_CUSTOMER = "/delete/customer";

//SHOPS
export const GET_SHOPS = "/shops";

//CRYPTO
export const GET_WALLET = "/wallet";
export const GET_CRYPTO_ORDERS = "/crypto/orders";

//INVOICES
export const GET_INVOICES = "/invoices";
// export const GET_INVOICE_DETAIL = "/invoice";

//PROJECTS
export const GET_PROJECTS = "/projects";
export const GET_PROJECT_DETAIL = "/project";

//TASKS
export const GET_TASKS = "/tasks";

//CONTACTS
export const GET_USERS = "/users";
export const GET_USER_PROFILE = "/user";
export const ADD_NEW_USER = "/add/user";
export const UPDATE_USER = "/update/user";
export const DELETE_USER = "/delete/user";

//Mails
export const GET_INBOX_MAILS = "/inboxmails";
export const ADD_NEW_INBOX_MAIL = "/add/inboxmail";
export const DELETE_INBOX_MAIL = "/delete/inboxmail";

//starred mail
export const GET_STARRED_MAILS = "/starredmails";

//important mails
export const GET_IMPORTANT_MAILS = "/importantmails";

//Draft mail
export const GET_DRAFT_MAILS = "/draftmails";

//Send mail
export const GET_SENT_MAILS = "/sentmails";

//Trash mail
export const GET_TRASH_MAILS = "/trashmails";

//dashboard charts data
export const GET_WEEKLY_DATA = "/weekly-data";
export const GET_YEARLY_DATA = "/yearly-data";
export const GET_MONTHLY_DATA = "/monthly-data";

export const TOP_SELLING_DATA = "/top-selling-data";

export const GET_EARNING_DATA = "/earning-charts-data";
