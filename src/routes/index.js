import React from "react";
import { Redirect } from "react-router-dom";

// User profile
import LabProfile from "../pages/Authentication/LabProfile";
import PatientProfile from "../pages/Authentication/PatientProfile";
import CorporateProfile from "../pages/Authentication/CorporateProfile";
import SampleCollectorProfile from "../pages/Authentication/SampleCollectorProfile";
import StaffProfile from "../pages/Authentication/StaffProfile";
// LabMarket Pages
import NearbyLabs from "../pages/LabMarket/NearbyLabs/index";
import MedicalTestsList from "pages/LabMarket/NearbyLabs/MedicalTestsList";
import NearbyLabDetail from "pages/LabMarket/NearbyLabs/NearbyLabDetail";
// TestMarket Pages
import labs from "pages/LabMarket/NearbyLabs/labs";
import NearbyTests from "pages/LabMarket/NearbyLabs/NearbyTests";
import NearbyTestsDiscountedlh from "pages/LabMarket/NearbyLabs/NearbyTestsDiscountedlh";
import NearbyProfiles from "pages/LabMarket/NearbyLabs/NearbyProfiles";
import NearbyPackages from "pages/LabMarket/NearbyLabs/NearbyPackages";
import NearbyRadiology from "pages/LabMarket/NearbyLabs/NearbyRadiology";


//ContactUs
import ContactUs from "../pages/Contact/contact-us";
import B2bAffiliate from "../pages/LabMarket/NearbyLabs/b2baffiliate"
import ChatBox from "../pages/Public/chat";
// Authentication related pages
import Login from "../pages/Authentication/Login";
import RegisterAffiliate from "../pages/Authentication/RegisterAffiliate"
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import PatientInformation from "../pages/Authentication/PatientInformation";
import B2bClientInformation from "../pages/Authentication/B2bClientInformation";
import DonorInformation from "../pages/Authentication/DonorInformation";
import LabInformation from "../pages/Authentication/LabInformation";
import CorporateInformation from "../pages/Authentication/CorporateInformation";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import ConfirmPwd from "../pages/Authentication/ConfirmPassword";

// Dashboard
import DashboardPatient from "../pages/Dashboard-Patient/index";
import DashboardLab from "../pages/Dashboard-Lab/index";
import DashboardB2b from "../pages/Dashboard-B2b/index";
// import DashboardFinanceOfficer from "pages/Dashboard-FinanceOfficer/StackedColumnChart";
import FinanceOfficerProfile from "../pages/Authentication/StaffProfile";
import DashboardFinance from "../pages/Dashboard-Finance/index"
import DashboardCorporate from "../pages/Dashboard-Corporate/index"

//Finance Admin
import DashboardFinanceAdmin from "pages/Dashboard-FinanceAdmin";

//Finance Admin
import DashboardMarketerAdmin from "pages/Dashboard-MarketerAdmin";
// import FinanceAdminProfile from "../pages/Authentication/StaffProfile";

// Corporate
import EmployeeData from "../pages/CorporatesData/add-employee";
import EmployeeList from "../pages/CorporatesData/employees-list";
import CorporateTestsList from "../pages/OfferedTests/corporate-medical-tests";
import CorporateOfferedTestsList from "../pages/OfferedTests/corporate-offeredtests-list"



// Lab Components
import OfferedTestsList from "../pages/OfferedTests/offered-tests-list";
import TestsList from "../pages/OfferedTests/medical-tests";
import SampleCollectorRegister from "pages/SampleCollectors/sample-collectors-register";
import SampleCollectorInfo from "pages/SampleCollectors/sample-collector-info";
import SampleCollectorsList from "../pages/SampleCollectors/sample-collectors-list";
import QualityCertificatesList from "../pages/QualityCertificates/quality-certificates-list";
import PathologistsList from "../pages/Pathologists/pathologists-list";
import TestAppointmentsPendingList from "../pages/TestAppointments/test-appointments-pending-list";
import TestAppointmentsInProcessList from "../pages/TestAppointments/test-appointments-in-process-list";
import TestAppointmentsCompletedList from "../pages/TestAppointments/test-appointments-completed-list";
import FeedbacksList from "../pages/Feedbacks/feedbacks-list";
import LabInvoiceDetail from "pages/Checkouts/invoice-detail";
import AppointmentDetail from "pages/Checkouts/appointment-detail";
import PatientAppointmentDetail from "pages/Checkouts/appointment-detail";
import CsrInvoiceDetail from "pages/Checkouts/invoice-detail";
import LabAdvertisements from "../pages/LabAdvertisements/lab-advertisement";
import CorporateOfferedTestsListForLab from "../pages/LabMarket/NearbyLabs/corporate-offeredtests-list"



// Payment In Status
import InPayments from "pages/Payments Form/in-payment-mathod";
import PaymentStatussList from "../pages/PaymentStatuss/payment-statuss-list";
// import depositStatussList from "../pages/PaymentStatuss/deposit-statuss-list";
import PendintClearenceStatussList from "../pages/PaymentStatuss/paymentin-pending-clearence-statuss-list";
import clearStatussList from "../pages/PaymentStatuss/clear-statuss-list";
import bouncedStatussList from "../pages/PaymentStatuss/payment-bounced-statuss-list"

// Payment Out

import OutPayments from "pages/Payments Form/out-payment-mathod";
import PaymentOutStatussList from "pages/PaymentStatuss/paymentout-pending-clearence-statuss-list"
import PaymentOutCreatedStatussList from "pages/PaymentStatuss/paymentout-created-statuss-list"
import PaymentOutclearStatussList from "pages/PaymentStatuss/paymentoutclear-statuss-list"
import PaymentOutBouncedStatussList from "pages/PaymentStatuss/paymentout-bounced-statuss-list"

// sample collector components
import SampleCollectorTestAppointmentsInProcessList from "../pages/SampleCollectorTestAppointments/test-appointments-in-process-list";
import SampleCollectorTestAppointmentsCompletedList from "../pages/SampleCollectorTestAppointments/test-appointments-completed-list";
import CollectorInvoiceDetail from "pages/Checkouts/invoice-detail";

// Patient Lab Components
import LabQualityCertificates from "../pages/LabMarket/NearbyLabs/NearbyLabDetails/quality-certificates-list";
import LabSampleCollectors from "../pages/LabMarket/NearbyLabs/NearbyLabDetails/sample-collectors-list";
import LabPathologists from "../pages/LabMarket/NearbyLabs/NearbyLabDetails/pathologists-list";

// Patient Components
import TestAppointmentsList from "../pages/PatientTestAppointments/test-appointments-list";
import TestAppointmentsCSRList from "../pages/Dashboard-Csr/test-appointments-list";
import TestsOfferedbyLab from "pages/LabMarket/NearbyLabs/TestsOfferedbyLab";
import CartsList from "../pages/Carts/carts-list";
import QuoteList from "../pages/Carts/quotes-list";
// import checkout from "pages/Checkouts/checkout-list";
import Checkout from "pages/Checkouts/checkout";
import checkoutcsr from "pages/Checkouts/checkout";
import checkoutb2b from "pages/Checkouts/checkout";
import InvoiceDetail from "pages/Checkouts/invoice-detail";
import LabSettings from "pages/Authentication/LabSettings";
import FeedbackDetail from "pages/Feedbacks-List/FeedbackDetail";
import TestDescriptions from "pages/Test-Description/test-descriptions-list";


// LAB ADV INVOICE
import AdvInvoiceDetail from "pages/advInvoice/adv-invoice-detail";



// B2B Reffered
import B2bReferredPatient from "pages/B2bReferredPatients/referred-patients-list";
import B2bLabShare from "pages/B2bLabShares/lab-shares-list";
// import B2bSettings from "pages/Authentication/B2bSettings";
import B2bProfile from "pages/Authentication/B2bProfile";

// Donor
import DonorDashboard from "pages/Dashboard-Donor/index";
import DonorProfile from "pages/Authentication/DonorProfile";
import DonorAppointments from "pages/DonorReferredAppointments/referred-appointments-list";
import DonorPayments from "pages/DonorPaymentMathods/payment-mathod";
import DonorSettings from "pages/Authentication/DonorSettings";
import DonorAccountStatements from "pages/AccountStatements/donor-account-statements";
import AccountStatementDonor from "pages/AccountStatements/donor-account-statements";
import B2bAccountStatements from "pages/AccountStatements/b2b-account-statements";
import AccountStatementsB2B from "pages/AccountStatements/b2b-account-statements";
import BankAccountStatements from "pages/AccountStatements/bank-account-statement";
import Invoiceb2b from "pages/Checkouts/invoice-detail"
import AllLabsList from "pages/FinanceAdmin/lab-labs-list"
import CreateBanks from "pages/CreateBanks/create-bank";
import BankAccounts from "pages/BankAccounts/bank-account"

// Admin
// import B2bAllClients from "pages/B2bAllClients/all-clients-list";
// import OfferedLabsshares from "pages/OfferedLabShares/offered-shares-list";
// B2B Admin
import B2bAllClients from "pages/B2BAdmin/all-clients-list";
import B2BClientShares from "pages/B2BAdmin/b2b-client-shares";
import B2bPayments from "pages/B2bPaymentMathods/payment-mathod";


// import B2bReferredPatient from "pages/B2bReferredPatients/referred-patients-list";
import AccountStatements from "pages/AccountStatements/account-statements";
import AccountStatementsLab from "pages/AccountStatements/account-statements";
import MedicalTestSheet from "pages/OfferedTests/medical-test-sheet";
import csrCheckout from "pages/Complaints/csr-checkout";
import Patientslist from "pages/Dashboard-Csr/patients-list";
import Patient from "pages/Dashboard-Csr/patients-list";
import Disclaimer from "pages/Public/disclaimer";
import AboutUs from "pages/Public/about-us";
// import ChatBox from "pages/Public/chat";
// import TermsConditions from "pdf/LabHazir - Terms & Conditions.pdf";
import ChangePassword from "pages/Authentication/ChangePassword";
import DashboardAuditor from "pages/Dashboard-Auditor";
import DashboardSampleCollector from "pages/Dashboard-SampleCollector";

// registration admin
import PendingLabs from "pages/RegistrationAdmin/pending-labs";
import labsListApprovedFeeOffered from "pages/RegistrationAdmin/labs-list-approved-fee";
import labsListPendingFeeOffered from "pages/RegistrationAdmin/labs-list-pending-fee";
import sharedPercentagePendingFeeTests from "pages/RegistrationAdmin/shared-percentage-pending-Fee";
import sharedPercentageApprovedFeeTests from "pages/RegistrationAdmin/shared-percentage-approved-Fee";
import ApprovedLabs from "pages/RegistrationAdmin/approved-labs";
import UnapprovedLabs from "pages/RegistrationAdmin/unapproved-labs";
import PendingB2bClients from "pages/RegistrationAdmin/pending-b2b-clients";
import ApprovedB2bClients from "pages/RegistrationAdmin/approved-b2b-clients";
import UnapprovedB2bClients from "pages/RegistrationAdmin/unapproved-b2b-clients";
import PendingDonors from "pages/RegistrationAdmin/pending-donors";
import ApprovedDonors from "pages/RegistrationAdmin/approved-donors";
import UnapprovedDonors from "pages/RegistrationAdmin/unapproved-donors";
import ReferrelLab from "pages/RegistrationAdmin/referrelfeelab";
import ApproveReferrelLab from "pages/RegistrationAdmin/Approvereferrelfeelab";
import labsRating from "../pages/RegistrationAdmin/labs-rating";




// finance admin
import ClearedInPayments from "pages/FinanceAdmin/cleared-in-payments";
import ApprovedInPayments from "pages/FinanceAdmin/approved-in-payments";
import UnapprovedInPayments from "pages/FinanceAdmin/unapproved-in-payments";
import bankTransferDetail from "pages/Payments Form/bank-transfer-detail";
import interBankDetailsList from "pages/PaymentStatuss/inter-bank-details-list";

// Maeketer Admin routes
import Advertisements from "pages/MarketerAdmin/advertisement";
import AdvertisementPriceLists from "pages/MarketerAdmin/advertisement-price-list";
import DiscountLabHazir from "pages/MarketerAdmin/discount-labhazir";
import labsList from "pages/MarketerAdmin/labs-list";
import labList from "pages/FinanceAdmin/labs-list";
import donorList from "pages/FinanceAdmin/donors-list";
import b2bList from "pages/FinanceAdmin/b2bclients-list";
import discountLab from "pages/MarketerAdmin/discount-lab";
import LabAdvertisementRequests from "pages/MarketerAdmin/pending-lab-advertisement-requests";
import LabAdvertisementRequestsAccepted from "pages/MarketerAdmin/accepted-lab-advertisement-requests";
import LabAdvertisementRequestsAcceptedMA from "pages/MarketerAdmin/accepted-lab-advertisement-requests";

// Discount of Labhazir to lab
// import DiscountLabHazirToLab from "pages/MarketerAdmin/discount-labhazir-to-lab";


// Registration of Marketer Admin
import PendingComplaints from "pages/CSRAdmin/pending-complaints";
import csrApointments from "pages/CSRAdmin/csr-apointments";
import InProcessComplaints from "pages/CSRAdmin/inprocess-complaints";
import inprocessComplaintslabhazir from "pages/CSRAdmin/inprocess-complaintslabhazir";
import ResolvedComplaints from "pages/CSRAdmin/resolved-complaints";
import ResolvedComplaintsLabhazir from "pages/CSRAdmin/resolved-complaintslabhazir";

import CSRsList from "pages/CSRAdmin/csrs-list";

import DashboardCsr from "pages/Dashboard-Csr";
import UnhandledComplaints from "pages/Complaints/unhandled-complaints";
import HandledComplaints from "pages/Complaints/handled-complaints";
import csrComplaints from "pages/Complaints/csr-complaints";
import NotesList from "pages/Complaints/notes-list";
import NotesLists from "pages/Complaints/notes-list";
import PatientCsrNotesList from "pages/Complaints/notes-list";
import NotesComplains from "pages/Complaints/notes-list-complain";
import NotesComplainsAdmin from "pages/Complaints/notes-list-complain"
import labnotes from "pages/Complaints/notes-list";
import MsgsList from "pages/Complaints/msg-box";

import AssignedAudits from "pages/Auditor/assigned-audits";
import LabAudits from "pages/Dashboard-Lab/lab-audits";
import activityLog from "pages/Dashboard-Lab/activity-log";
import activityLogFinance from "pages/PaymentStatuss/activity-log-finance";
import activityLogMarketer from "pages/Dashboard-MarketerAdmin/activity-log-marketer";
import activityLogFinanceAdmin from "pages/PaymentStatuss/activity-log-finance";

import AuditorCompletedAudits from "pages/Auditor/completed-audits";
import AuditorProfile from "../pages/Authentication/StaffProfile";

import PendingAudits from "pages/AuditorAdmin/pending-audits";
import InProcessAudits from "pages/AuditorAdmin/inprocess-audits";
import PassedAudits from "pages/AuditorAdmin/passed-audits";
import FailedAudits from "pages/AuditorAdmin/failed-audits";
import AuditorsList from "pages/AuditorAdmin/auditors-list";

import PagesMaintenance from "pages/Utility/pages-maintenance";
import PagesComingsoon from "pages/Utility/pages-comingsoon";
import Pages404 from "pages/Utility/pages-404";
import Pages500 from "pages/Utility/pages-500";

import StaffRegister from "pages/HrAdmin/staff-register";
import StaffInfo from "pages/HrAdmin/staff-info";
import CSRList from "pages/HrAdmin/csr-list";
import AuditorList from "pages/HrAdmin/auditor-list";
import FinanceOfficerList from "pages/HrAdmin/finance-officer-list";
import DiscountLab from "pages/MarketerAdmin/discounttolab";
import BanksList from "pages/CreateBanks/banks-list";
import BankAccountsList from "pages/BankAccounts/bankaccounts-list";
import Payments from "pages/Authentication/Payments"
import CorporatesList from "pages/LabMarket/NearbyLabs/corporate-list"

import csrsList from "pages/CSRAdmin/csrs-list";
import pendingComplaintslabhazir from "pages/CSRAdmin/pending-complaintslabhazir";
import { invoiceList } from "common/data";
import labsListPendingFee from "store/labs-list-pending/reducer";
import allDonationAppointments from "pages/FinanceAdmin/all-donation-appointments";
import msgBox from "pages/Complaints/msg-box";
import msgBoxFo from "pages/Complaints/msg-box";
import ProfilesOfferedbyLab from "pages/LabMarket/NearbyLabs/ProfilesOfferedbyLab";
import PackagesOfferedbyLab from "pages/LabMarket/NearbyLabs/PackagesOfferedbyLab";
import RadiologyOfferedbyLab from "pages/LabMarket/NearbyLabs/RadiologyOfferedbyLab"
import advLabChatBox from "pages/LabAdvertisements/adv-lab-chat-box";


// All general public routes will be listed here
const publicRoutes = [
  { path: "/register/:guest_id?/:uuid?", component: Register },
  { path: "/logout", component: Logout },
  { path: "/login/:guest_id?/:uuid?", component: Login },
  { path: "/register-affiliate", component: RegisterAffiliate },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/:token/confirm-password", component: ConfirmPwd },
  { path: "/patient-information/:id/:guest_id?/:uuid?", component: PatientInformation },
  { path: "/b2bclient-information/:id", component: B2bClientInformation },
  { path: "/donor-information/:id", component: DonorInformation },
  { path: "/lab-information/:id", component: LabInformation },
  { path: "/corporate-information/:id", component: CorporateInformation },
  { path: "/feedback-detail/:lab_account_id", component: FeedbackDetail },
  { path: "/pages-maintenance", component: PagesMaintenance },
  { path: "/pages-comingsoon", component: PagesComingsoon },
  { path: "/pages-404", component: Pages404 },
  { path: "/pages-500", component: Pages500 },
  {
    path: "/cart/:guest_id?/:uuid?",
    component: CartsList,
  },
  {
    path: "/quote-list/:guest_id?/:uuid?",
    component: QuoteList,
  },
  {
    path: "/corporate-offered-tests/:id",
    component: CorporateOfferedTestsListForLab,
  },
  
  // {
  //   path: "/labs/:uuid?",
  //   component: labs,
  // },
  // {
  //   path: "/nearby-tests/:guest_id?/:uuid?",
  //   component: NearbyTests,
  // },
  // {  path: "/nearby-profiles/:guest_id?/:uuid?",
  //    component: NearbyProfiles 
  // },
  // {  path: "/nearby-packages/:guest_id?/:uuid?",
  //   component: NearbyPackages 
  // },
  // {
  //   path: "/nearby-lab-detail/:lab_account_id/:guest_id?/:uuid?",
  //   component: NearbyLabDetail,
  // },
  // {
  //   path: "/:lab_account_id/offered-test-by-lab/:guest_id?/:uuid?",
  //   component: TestsOfferedbyLab,
  // },

];

const labAuthProtectedRoutes = [
  // { path: "/change-password", component: ChangePassword },
  { path: "/dashboard-lab", component: DashboardLab },
  {
    path: "/offered-tests",
    component: OfferedTestsList,
  },
  {
    path: "/medical-tests",
    component: TestsList,
  },
  {
    path: "/discount-lab",
    component: discountLab,
  },
  {
    path: "/medical-test-sheet",
    component: MedicalTestSheet,
  },
  {
    path: "/sample-collectors",
    component: SampleCollectorsList,
  },
  { path: "/lab-note-list/:id", component: labnotes },
  {
    path: "/sample-collector-info/:id",
    component: SampleCollectorInfo,
  },
  {
    path: "/add-sample-collector",
    component: SampleCollectorRegister,
  },
  {
    path: "/quality-certificates",
    component: QualityCertificatesList,
  },
  {
    path: "/feedbacks",
    component: FeedbacksList,
  },
  {
    path: "/pathologists",
    component: PathologistsList,
  },
  {
    path: "/pending-test-appointments",
    component: TestAppointmentsPendingList,
  },
  {
    path: "/in-process-test-appointments",
    component: TestAppointmentsInProcessList,
  },
  {
    path: "/completed-test-appointments",
    component: TestAppointmentsCompletedList,
  },
  {
    path: "/lab-audit",
    component: LabAudits,
  },
  {
    path: "/activity-log",
    component: activityLog,
  },
  {
    path: "/lab-profile",
    component: LabProfile,
  },
  {
    path: "/lab-settings",
    component: LabSettings,
  },
  {
    path: "/lab-invoice-detail/:id",
    component: LabInvoiceDetail,
  },
  { path: "/account-statements", component: AccountStatements },
  { path: "/lab-advertisement", component: LabAdvertisements },
  // { path: "/lab-advertisement", component: LabAdvertisements },
  {
    path: "/adv-invoice-detail/:id",
    component: AdvInvoiceDetail,
  },
  {
    path: "/lab-payments/:id",
    component: Payments,
  },
  {
    path: "/corporates-List",
    component: CorporatesList,
  },
];

const b2bclientAuthProtectedRoutes = [
  { path: "/dashboard-b2bclient", component: DashboardB2b },
  {
    path: "/b2b-referred-patients",
    component: B2bReferredPatient,
  },
  {
    path: "/patients/:uuid",
    component: Patient,
  },
  {
    path: "/checkout-b2b/:uuid?/:guest_id?",
    component: checkoutb2b,
  },
  { path: "/b2b-payment", component: B2bPayments },
  { path: "/b2b-account-statements", component: B2bAccountStatements },
  {
    path: "/in-process-b2b/:id",
    component: Invoiceb2b,
  },
  {
    path: "/b2b-shares",
    component: B2bLabShare,
  },
  {
    path: "/b2b-profile",
    component: B2bProfile,
  },
];
const financeOfficerAuthProtectedRoutes = [
  { path: "/dashboard-finance", component: DashboardFinance},
  { path: "/financeofficer-profile", component: FinanceOfficerProfile },
  { path: "/in-payment", component: InPayments },
  { path: "/accepted-lab-advertisements", component: LabAdvertisementRequestsAcceptedMA},
  { path: "/out-payment", component: OutPayments },
  { path: "/chat-list/:id", component: msgBoxFo },
  {
    path: "/payment-status",
    component: PaymentStatussList,
  },
  {
    path: "/activity-log-finance",
    component: activityLogFinance,
  },
  {
    path: "/payment-in-pending-clearence-status",
    component: PendintClearenceStatussList,
  },
  {
    path: "/clear-status",
    component: clearStatussList,
  },
  {
    path: "/bounced-status",
    component: bouncedStatussList,
  },
  {
    path: "/payment-out-bounced-status",
    component: PaymentOutBouncedStatussList,
  },
  {
    path: "/payment-out-pending-clearence-status",
    component: PaymentOutStatussList,
  },
  {
    path: "/payment-out-created-status",
    component: PaymentOutCreatedStatussList,
  },
  {
    path: "/payment-out-clear-status",
    component: PaymentOutclearStatussList,
  },
  { path: "/all-labs-list", component: AllLabsList },
  { path: "/bank-transfer", component: bankTransferDetail },
  {path : "/inter-bank-details-list", component: interBankDetailsList},
  { path: "/All-Donation-Appointments/:id", component: allDonationAppointments }


];
const financeAdminAuthProtectedRoutes = [
  { path: "/dashboard-financeadmin", component: DashboardFinanceAdmin },
  { path: "/account-statements-lab/:id", component: AccountStatementsLab },
  { path: "/account-statement-donor/:id", component: AccountStatementDonor },
  { path: "/account-statement-b2b/:id", component: AccountStatementsB2B },
  { path: "/cleared-in-payments", component: ClearedInPayments },
  { path: "/approved-in-payments", component: ApprovedInPayments },
  { path: "/unapproved-in-payments", component: UnapprovedInPayments },
  { path: "/activity-log-finance-admin", component: activityLogFinanceAdmin },

  {path: "/create-bank", component: CreateBanks},
  {path: "/bank-account", component: BankAccounts},
  {path: "/banks-list", component: BanksList},
  {path: "/bankaccounts-list", component: BankAccountsList},
  { path: "/lab-details", component: labList},
  { path: "/donor-details", component: donorList},
  { path: "/b2bclients-details", component: b2bList},
  {path: "/bank-account-statements/:id", component: BankAccountStatements},






  // { path: "/financeadmin-profile", component: FinanceAdminProfile },
];
const donorAuthProtectedRoutes = [
  { path: "/dashboard-donor", component: DonorDashboard },
  { path: "/donor-profile", component: DonorProfile },
  { path: "/donor-appointment", component: DonorAppointments },
  { path: "/donor-payment", component: DonorPayments },
  {
    path: "/donor-settings",
    component: DonorSettings,
  },
  { path: "/donor-account-statements", component: DonorAccountStatements },

];
// const b2badminAuthProtectedRoutes = [
//   { path: "/offeredlabs-shares/:id", component: OfferedLabsshares },
//   { path: "/b2blist", component: B2bAllClients },

const b2badminAuthProtectedRoutes = [
  { path: "/b2b-clients-shares/:id", component: B2BClientShares },
  // { path: "/offeredlabs-shares/:id", component: OfferedLabsshares },

  { path: "/b2b-clients-list", component: B2bAllClients },
];

const sampleCollectorAuthProtectedRoutes = [
  { path: "/dashboard-samplecollector", component: DashboardSampleCollector },
  {
    path: "/sample-collector-profile",
    component: SampleCollectorProfile,
  },
  // {
  //   path: "/sample-invoice-detail/:id",
  //   component: SampleInvoiceDetail,
  // },
  {
    path: "/sample-collector-in-process",
    component: SampleCollectorTestAppointmentsInProcessList,
  },
  {
    path: "/collector-invoice-detail/:id",
    component: CollectorInvoiceDetail,
  },
  {
    path: "/sample-collector-completed",
    component: SampleCollectorTestAppointmentsCompletedList,
  },

];

const auditorAuthProtectedRoutes = [
  { path: "/dashboard-auditor", component: DashboardAuditor },
  { path: "/auditor-profile", component: AuditorProfile },
  { path: "/assigned-audits", component: AssignedAudits },
  { path: "/audited-audits", component: AuditorCompletedAudits },
];

const registrationAdminAuthProtectedRoutes = [
  { path: "/pending-labs", component: PendingLabs },
  { path: "/labs-list-approved-fee", component: labsListApprovedFeeOffered },
  { path: "/labs-list-pending-fee", component: labsListPendingFeeOffered },
  {
    path: "/shared-percentage-pending-Fee/:id",component: sharedPercentagePendingFeeTests,
  },
  {
    path: "/shared-percentage-approved-Fee/:id",component: sharedPercentageApprovedFeeTests,
  },
  { path: "/approved-labs", component: ApprovedLabs },
  { path: "/unapproved-labs", component: UnapprovedLabs },
  { path: "/pending-b2b-clients", component: PendingB2bClients },
  { path: "/approved-b2b-clients", component: ApprovedB2bClients },
  { path: "/unapproved-b2b-clients", component: UnapprovedB2bClients },
  { path: "/pending-donors", component: PendingDonors },
  { path: "/approved-donors", component: ApprovedDonors },
  { path: "/unapproved-donors", component: UnapprovedDonors },
  {
    path: "/referrellab",component: ReferrelLab,
  },
  {
    path: "/approvereferrellab",component: ApproveReferrelLab,
  },
  {
    path: "/labs-rating",
    component: labsRating,
  },
];

const marketerAdminAuthProtectedRoutes = [
  { path: "/dashboard-marketeradmin", component: DashboardMarketerAdmin },
  { path: "/advertisement", component: Advertisements },
  { path: "/advertisement-price-list", component: AdvertisementPriceLists },
  { path: "/discount-labhazir", component: DiscountLabHazir },
  { path: "/labs-list", component: labsList},
  { path: "/comments-list/:id", component: msgBox },
  { path: "/adv-lab-chat-box/:id", component: advLabChatBox },
  {
    path: "/activity-log-marketer",
    component: activityLogMarketer,
  },
  {
    path: "/discountlab/:id",component: DiscountLab,
  },
  { path: "/pending-lab-advertisement-requests", component: LabAdvertisementRequests},
  { path: "/accepted-lab-advertisement-requests", component: LabAdvertisementRequestsAccepted}

];

const csrAuthProtectedRoutes = [
  { path: "/dashboard-csr", component: DashboardCsr },
  { path: "/staff-profile", component: StaffProfile},
  { path: "/handled-complaints", component: HandledComplaints },
  { path: "/unhandled-complaints", component: UnhandledComplaints },
  { path: "/csr-pending-appointments", component: csrComplaints },
  { path: "/csr-notes-list/:id", component: NotesList },
  { path: "/csr-notes-complains/:id", component: NotesComplains },

  {
    path: "/csr-invoice-detail/:id",
    component: CsrInvoiceDetail,
  },
  {
    path: "/csr-checkout",
    component: csrCheckout,
  },
  {
    path: "/patients-list",
    component: Patientslist,
  },
  {
    path: "/checkout-csr/:id",
    component: checkoutcsr,
  },
  {
    path: "/test-appointments/:id",
    component: TestAppointmentsCSRList,
  },
  {
    path: "/appointment-detail/:id",
    component: AppointmentDetail,
  },
];

const csrAdminAuthProtectedRoutes = [
  { path: "/pending-complaints-lab", component: PendingComplaints },
  { path: "/pending-csr-appointments", component: csrApointments },
  { path: "/csr-notes-lists/:id", component: NotesLists },
  { path: "/csr-notes-admincomplains/:id", component: NotesComplainsAdmin },
  { path: "/pending-complaints-labhazir", component: pendingComplaintslabhazir },
  { path: "/inprocess-complaints-lab", component: InProcessComplaints },
  { path: "/inprocess-complaints-labhazir", component: inprocessComplaintslabhazir },
  { path: "/resolved-complaints-lab", component: ResolvedComplaints },
  { path: "/resolved-complaints-labhazir", component: ResolvedComplaintsLabhazir },
  { path: "/csrs-list", component: CSRsList}
];

const auditorAdminAuthProtectedRoutes = [
  { path: "/pending-audits", component: PendingAudits },
  { path: "/inprocess-audits", component: InProcessAudits },
  { path: "/passed-audits", component: PassedAudits },
  { path: "/failed-audits", component: FailedAudits },
  { path: "/auditors-list", component: AuditorsList}
];


const hrAdminAuthProtectedRoutes = [
  { path: "/add-staff", component: StaffRegister },
  { path: "/staff-info/:id", component: StaffInfo },
  { path: "/csr-list", component: CSRList },
  { path: "/auditor-list", component: AuditorList },
  { path: "/finance-officer-list", component: FinanceOfficerList },
];

// All authenticated routes of the patient module will be listed here
const patientAuthProtectedRoutes = [
  { path: "/dashboard-patient/:uuid?", component: DashboardPatient },
  { path: "/csr-patient-notes-list/:id", component: PatientCsrNotesList },
  {
    path: "/test-appointments/:uuid?",
    component: TestAppointmentsList,
  },
  {
    path: "/profile/:guest_id?",
    component: PatientProfile,
  },
  {
    path: "/cart/:guest_id?/:uuid?",
    component: CartsList,
  },
  {
    path: "/quote-list/:guest_id?/:uuid?",
    component: QuoteList,
  },
  {
    path: "/checkout/:uuid?",
    component: Checkout,
  },
  {
    path: "/invoice-detail/:id",
    component: InvoiceDetail,
  },
  {
    path: "/patient-appointment-detail/:id",
    component: PatientAppointmentDetail,
  },
  // { path: "/nearby-labs/:uuid?", component: NearbyLabs },

    // {
    //   path: "/nearby-tests/:uuid?",
    //   component: NearbyTests,
    // },
    // {  path: "/nearby-profiles/:uuid?",
    //    component: NearbyProfiles 
    // },
    // {  path: "/nearby-packages/:uuid?",
    //   component: NearbyPackages 
    // },
];

// All public routes of the patient module will be listed here
const patientPublicRoutes = [
  { path: "/change-password", component: ChangePassword },
  { path: "/contact-us", component: ContactUs },

  { path: "/b2b-affiliate", component: B2bAffiliate },

  { path: "/disclaimer", component: Disclaimer },
  { path: "/about-us", component: AboutUs },
  { path: "/chat-box", component: ChatBox },
  // { path: "/terms-conditions", component: TermsConditions},
  { path: "/nearby-labs/:uuid?/:guest_id?", component: NearbyLabs },
  {
    path: "/labs/:guest_id?/:uuid?",
    component: labs,
  },
  {
    path: "/nearby-test/:guest_id?/:uuid?",
    component: NearbyTests,
  },
  {
    path: "/nearby-tests-discountedlh/:guest_id?/:uuid?",
    component: NearbyTestsDiscountedlh,
  },
  {  path: "/nearby-profiles/:guest_id?/:uuid?",
     component: NearbyProfiles 
  },
  {  path: "/nearby-packages/:guest_id?/:uuid?",
    component: NearbyPackages 
  },
  {  path: "/tests-offered-labhazir/:guest_id?/:uuid?",
    component:  MedicalTestsList
  },
  {  path: "/nearby-radiology/:guest_id?/:uuid?",
  component: NearbyRadiology 
},
  {
    path: "/nearby-lab-detail/:lab_account_id/:guest_id?/:uuid?",
    component: NearbyLabDetail,
  },
  {
    path: "/:lab_account_id/offered-test-by-lab/:guest_id?/:uuid?",
    component: TestsOfferedbyLab,
  },
  {
    path: "/:lab_account_id/offered-profile-by-lab/:guest_id?/:uuid?",
    component: ProfilesOfferedbyLab,
  },
  {
    path: "/:lab_account_id/offered-package-by-lab/:guest_id?/:uuid?",
    component: PackagesOfferedbyLab,
  },
  {
    path: "/:lab_account_id/offered-radiology-by-lab/:guest_id?/:uuid?",
    component: RadiologyOfferedbyLab,
  },
  {
    path: "/:lab_account_id/lab-quality-certificates/:guest_id?/:uuid?",
    component: LabQualityCertificates,
  },
  {
    path: "/:lab_account_id/lab-sample-collectors/:guest_id?/:uuid?",
    component: LabSampleCollectors,
  },
  {
    path: "/:lab_account_id/lab-pathologists/:guest_id?/:uuid?",
    component: LabPathologists,
  },
  { path: "/test-descriptions/:test_id/:uuid?", component: TestDescriptions },  
  {
    path: "/test-appointments/:uuid?",
    component: TestAppointmentsList,
  },
];

const corporateAuthProtectedRoutes = [
  {
    path: "/corporate-profile",
    component: CorporateProfile,
  },
  {
    path: "/dashboard-corporate",
    component: DashboardCorporate,
  },
  {
    path: "/employee-data",
    component: EmployeeData,
  },
  {
    path: "/employee-list",
    component: EmployeeList,
  },
  {
    path: "/corporate-test-list",
    component: CorporateTestsList,
  },
  {
    path: "/corporate-offered-tests",
    component: CorporateOfferedTestsList,
  },
];

const authProtectedRoutes = [
  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/login" /> },
];

export {
  authProtectedRoutes,
  labAuthProtectedRoutes,
  b2bclientAuthProtectedRoutes,
  donorAuthProtectedRoutes,
  sampleCollectorAuthProtectedRoutes,
  b2badminAuthProtectedRoutes,
  auditorAuthProtectedRoutes,
  financeOfficerAuthProtectedRoutes,
  financeAdminAuthProtectedRoutes,
  registrationAdminAuthProtectedRoutes,
  marketerAdminAuthProtectedRoutes,
  csrAdminAuthProtectedRoutes,
  csrAuthProtectedRoutes,
  auditorAdminAuthProtectedRoutes,
  hrAdminAuthProtectedRoutes,
  patientAuthProtectedRoutes,
  patientPublicRoutes,
  corporateAuthProtectedRoutes,
  publicRoutes,
};