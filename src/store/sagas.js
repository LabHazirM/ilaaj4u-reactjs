import { all, fork } from "redux-saga/effects";

//public
import LayoutSaga from "./layout/saga";
import dashboardSaga from "./dashboard/saga";

import AccountSaga from "./auth/register/saga";
import PatientInformationSaga from "./auth/patientinformation/saga";
import B2bClientInformationSaga from "./auth/b2bclientinformation/saga";
import DonorInformationSaga from "./auth/donorinformation/saga";
import LabInformationSaga from "./auth/labinformation/saga";
import CorporateInformationSaga from "./auth/corporateinformation/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ConfirmSaga from "./auth/confirmpwd/saga";
import ChangeSaga from "./auth/changepwd/saga";
import LabProfileSaga from "./auth/labprofile/saga";
import B2bProfileSaga from "./auth/b2bprofile/saga";
import DonorProfileSaga from "./auth/donorprofile/saga";
import StaffProfileSaga from "./auth/staffprofile/saga";
import SampleCollectorProfileSaga from "./auth/samplecollectorprofile/saga";
import LabSettingsSaga from "./auth/labsettings/saga";
import PaymentsSaga from "./auth/payments/saga";
import DonorSettingsSaga from "./auth/donorsettings/saga";
import PatientProfileSaga from "./auth/patientprofile/saga";
import CorporateProfileSaga from "./auth/corporateprofile/saga";
import LabMarketSaga from "./labmarket/saga";
import TestMarketSaga from "./testmarket/saga";
import ProfileMarketSaga from "./profilemarket/saga";
import PackageMarketSaga from "./packagemarket/saga";
import RadiologyMarketSaga from "./radiologymarket/saga";
import TestsSaga from "./test-list/saga";
import offeredTestsSaga from "./offered-tests/saga";
import pathologistsSaga from "./pathologists/saga";
import activitylogSaga from "./activtylog/saga";
import activitylogfinanceSaga from "./activtylogfinance/saga";
import activitylogmarketerSaga from "./activtylogmarketer/saga";
import sampleNotificationSaga from "./samplenotification/saga";
import marketerNotificationSaga from "./marketernotification/saga";
import csrAdminNotificationSaga from "./csradminnotification/saga";
import regAdminNotificationSaga from "./regadminnotification/saga";
import csrOfficerNotificationSaga from "./csrofficernotification/saga";
import bankaccountsSaga from "./bankaccounts/saga";
import cartsSaga from "./carts/saga";
import quotesSaga from "./quotes/saga";
import LabsListPendingFeeSaga from "./labs-list-pending/saga";
import sharedPercentagePendingFeeTestsSaga from "./shared-percentage-pending-fee/saga";
import sampleCollectorsSaga from "./sample-collectors/saga";
import sampleCollectorDatasSaga from "./sample-collector-test-appointments/saga";
import qualityCertificatesSaga from "./quality-certificates/saga";
import paymentStatussSaga from "./payment-statuss/saga";
import msgsSaga from "./chat-box/saga";
import advertisementsSaga from "./advertisements/saga";
import advertisementLivesSaga from "./advertisement-live/saga";
///////////
import advertisementPriceListsSaga from "./advertisement-price-lists/saga";
import labAdvertisementsSaga from "./lab-advertisements/saga";
import labAdvertisementRequestsSaga from "./lab-advertisement-requests/saga";
import discountLabHazirsSaga from "./discount-labhazir/saga";
import discountLabHazirToLabsSaga from "./discount-labhazir-to-lab/saga";
import referrelFeeLabsSaga from "./referrel-fee-to-lab/saga";
import labsListSaga from "./labs-list/saga";
import labslisttsaga from "./labs-listttt/saga";
import TerritoriesListSaga from "./territories-list/saga";
import LabNamesListSaga from "./lab-names/saga";
import onlyMedicalTestListSaga from "./only-medical-tests-list/saga";
import csrTerritoryListSaga from "./csr-territory-list/saga";
import auditorTerritoryListSaga from "./auditor-territory-list/saga";
import discountLabSaga from "./discount-lab/saga";
import feedbacksSaga from "./feedbacks/saga";
import labsRatingSaga from "./labs-rating/saga";
import labsTestingSaga from "./labs-testing/saga";
import testAppointmentsSaga from "./test-appointments/saga";
import patientTestAppointmentsSaga from "./patient-test-appointments/saga";
import B2bReferredPatientsSaga from "./b2b-referred-patients/saga";
import DonorReferredAppointmentsSaga from "./donor-referred-appointments/saga";
import donorPaymentSaga from "./donorcheckout/saga";
import b2bPaymentSaga from "./b2bcheckout/saga";
import B2bLabSharesSaga from "./b2b-lab-shares/saga";
import B2bAllClientsSaga from "./b2b-all-clients/saga";
import patientFeedbackSaga from "./patient-feedback/saga";
import checkoutSaga from "./checkout/saga";
import createBankSaga from "./createbank/saga";
import cemployeeDataSaga from "./corporatedata/saga";
import bankAccountSaga from "./bankaccount/saga";
import invoiceSaga from "./invoices/saga";
import advinvoiceSaga from "./adv-invoice/saga";
import inPaymentSaga from "./inpayments/saga";
import outPaymentSaga from "./outpayments/saga";
import bankTransferSaga from "./banktransferdetails/saga";
import complaintsSaga from "./complaints/saga";
import csrcomplaintsSaga from "./csr-complaints/saga";
import csrappointmentsSaga from "./csr-admin-appointments/saga";
import notesSaga from "./csr-comments/saga";
import PatientsSaga from "./patients-list/saga";
import testDescriptionsSaga from "./test-descriptions/saga";
import AccountStatementsSaga from "./account-statements/saga";
import DonorAccountStatementsSaga from "./donor-account-statements/saga";
import DonorsAccountStatementsSaga from "./donors-account-statements/saga";
import B2bAccountStatementsSaga from "./b2b-account-statements/saga";
import BankAccountStatementsSaga from "./bank-account-statements/saga";

import StaffSaga from "./staff/saga";
import AuditsSaga from "./auditor/saga";
import RegistrationAdminSaga from "./registration-admin/saga";
import FinanceAdminSaga from "./finance-admin/saga";
import CSRAdminSaga from "./csr-admin/saga";
import AuditorAdminSaga from "./auditor-admin/saga";


export default function* rootSaga() {
  yield all([
    //public
    fork(DonorsAccountStatementsSaga),
    fork(dashboardSaga),
    fork(LayoutSaga),
    fork(AccountSaga),
    fork(PatientInformationSaga),
    fork(B2bClientInformationSaga),
    fork(DonorInformationSaga),
    fork(LabInformationSaga),
    fork(CorporateInformationSaga),
    fork(AuthSaga),
    fork(msgsSaga),
    fork(outPaymentSaga),
    fork(createBankSaga),
    fork(cemployeeDataSaga),
    fork(bankAccountSaga),
    fork(inPaymentSaga),
    fork(FinanceAdminSaga),
    fork(ForgetSaga),
    fork(ConfirmSaga),
    fork(ChangeSaga),
    fork(LabProfileSaga),
    fork(B2bProfileSaga),
    fork(DonorProfileSaga),
    fork(referrelFeeLabsSaga),
    fork(LabSettingsSaga),
    fork(LabNamesListSaga),
    fork(PatientProfileSaga),
    fork(StaffProfileSaga),
    fork(SampleCollectorProfileSaga),
    fork(CorporateProfileSaga),
    fork(LabMarketSaga),
    fork(PaymentsSaga),
    fork(TestMarketSaga),
    fork(ProfileMarketSaga),
    fork(PackageMarketSaga),
    fork(RadiologyMarketSaga),
    fork(TestsSaga),
    fork(offeredTestsSaga),
    fork(pathologistsSaga),
    fork(activitylogSaga),
    fork(activitylogfinanceSaga),
    fork(activitylogmarketerSaga),
    fork(sampleNotificationSaga),
    fork(marketerNotificationSaga),
    fork(csrAdminNotificationSaga),
    fork(cartsSaga),
    fork(quotesSaga),
    fork(bankTransferSaga),
    fork(LabsListPendingFeeSaga),
    fork(sharedPercentagePendingFeeTestsSaga),
    fork(sampleCollectorsSaga),
    fork(sampleCollectorDatasSaga),
    fork(qualityCertificatesSaga),
    fork(advertisementsSaga),
    fork(advertisementPriceListsSaga),
    fork(labAdvertisementsSaga),
    fork(advertisementLivesSaga),
    fork(labAdvertisementRequestsSaga),
    fork(discountLabHazirsSaga),
    fork(discountLabHazirToLabsSaga),
    fork(labsListSaga),
    fork(labslisttsaga),
    // fork(TerritoriesSaga),
    fork(TerritoriesListSaga),
    fork(onlyMedicalTestListSaga),
    fork(csrOfficerNotificationSaga),
    fork(csrTerritoryListSaga),
    fork(auditorTerritoryListSaga),
    fork(discountLabSaga),
    fork(feedbacksSaga),
    fork(labsRatingSaga),
    fork(labsTestingSaga),
    fork(complaintsSaga),
    fork(csrcomplaintsSaga),
    fork(csrappointmentsSaga),
    fork(notesSaga),
    fork(PatientsSaga),
    fork(donorPaymentSaga),
    fork(regAdminNotificationSaga),
    fork(DonorSettingsSaga),
    fork(paymentStatussSaga),
    fork(B2bAccountStatementsSaga),
    fork(BankAccountStatementsSaga),
    fork(testDescriptionsSaga),
    fork(testAppointmentsSaga),
    fork(patientTestAppointmentsSaga),
    fork(B2bReferredPatientsSaga),
    fork(DonorReferredAppointmentsSaga),
    fork(B2bLabSharesSaga),
    fork(B2bAllClientsSaga),
    fork(patientFeedbackSaga),
    fork(b2bPaymentSaga),
    fork(checkoutSaga),
    fork(bankaccountsSaga),
    fork(invoiceSaga),
    fork(advinvoiceSaga),
    fork(AccountStatementsSaga),
    fork(DonorAccountStatementsSaga),
    fork(StaffSaga),
    fork(RegistrationAdminSaga),
    fork(CSRAdminSaga),
    fork(AuditorAdminSaga),
    fork(AuditsSaga),
  ]);
}
