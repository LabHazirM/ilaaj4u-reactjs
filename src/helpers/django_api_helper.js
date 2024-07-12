import { identity } from "@fullcalendar/core";
import axios from "axios";
import bankAccount from "pages/BankAccounts/bank-account";
import discountLabHazirs from "store/discount-labhazir/reducer";
import { del, get, post, put } from "./api_helper";
import authHeader from "./django-token-access/auth-token-header";
import * as url from "./url_helper";
import { message } from "antd";

function getHeader(token) {
  // If there is some token then return the header with token
  if (token) {
    return {
      Authorization: "Token " + token,
      "Content-Type":
        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
    };
  } else {
    return {
      "Content-Type":
        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
    };
  }
}

// Post Register Information to create account
export const postRegister = user => {
console.log("django user", user)

  return axios
    .post(url.POST_REGISTER, user)
    .then(response => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    }
)
    
    .catch(err => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 400:
            message = err.response.data;
            break;
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
      
    }
    );
};

// Post Patient Information
export const postPatientInformation = (id, patient) => {
  let formData = new FormData();
  formData.append("name", patient.name);
  formData.append("phone", patient.phone);
  formData.append("email", patient.email);
  formData.append("city_id", patient.city_id);
  formData.append("address", patient.address);
  formData.append("url", patient.url);
  formData.append("is_assosiatewith_anycorporate", patient.is_assosiatewith_anycorporate);
  formData.append("corporate_id", patient.corporate_id);
  formData.append("employee_id_card", patient.employee_id_card);
  console.log(url, patient.city_id)
  return axios
    .post(`${url.POST_PATIENT_INFORMATION}/${id}`, formData, {
      headers: getHeader(authHeader()),
    })
    .then(response => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch(err => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 400:
            message = err.response.data;
            break;
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};
// Post Patient Information
export const postB2bClientInformation = (id, b2bclient) => {
  let formData = new FormData();
  formData.append("email", b2bclient.email);
  formData.append("business_name", b2bclient.name);
  formData.append("landline", b2bclient.landline);
  formData.append("website_url", b2bclient.website_url);
  formData.append("city_id", b2bclient.city_id);
  formData.append("business_logo", b2bclient.business_logo);
  // formData.append("city", b2bclient.city);
  // formData.append("district", b2bclient.district);

  return axios
    .post(`${url.POST_B2BCLIENT_INFORMATION}/${id}`, formData, {
      headers: getHeader(authHeader()),
    })
    .then(response => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch(err => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 400:
            message = err.response.data;
            break;
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Post Patient Information
export const postDonorInformation = (id, donor) => {
  let formData = new FormData();
  formData.append("name", donor.name);
  formData.append("phone", donor.phone);
  formData.append("email", donor.email);
  formData.append("type", donor.type);
  formData.append("cnic", donor.cnic);
  // formData.append("province", donor.province);
  formData.append("city_id", donor.city_id);
  // formData.append("district", donor.district);
  formData.append("company_name", donor.company_name);
  formData.append("is_income_tax_payable", donor.is_income_tax_payable);
  formData.append("national_taxation_no", donor.national_taxation_no);
  formData.append("is_blocked", donor.is_blocked);

  return axios
    .post(`${url.POST_DONOR_INFORMATION}/${id}`, formData, {
      headers: getHeader(authHeader()),
    })
    .then(response => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch(err => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 400:
            message = err.response.data;
            break;
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Post Lab Information
export const postLabInformation = (id, lab) => {
  let formData = new FormData();
  formData.append("name", lab.name);
  formData.append("type", lab.type);
  formData.append("branch_name", lab.branch_name);
  formData.append("main_lab_account_id", lab.main_lab_account_id);
  formData.append("email", lab.email);
  formData.append("logo", lab.logo);
  // formData.append("owner_name", lab.owner_name);
  // formData.append("registration_no", lab.registration_no);
  // formData.append("health_dept_certificate", lab.health_dept_certificate);
  formData.append("national_taxation_no", lab.national_taxation_no);
  // formData.append("is_iso_certified", lab.is_iso_certified);
  // formData.append("iso_certificate", lab.iso_certificate);
  formData.append("lab_experience", lab.lab_experience);
  formData.append("is_homesampling_offered", lab.is_homesampling_offered);
  formData.append("home_sampling_charges", lab.home_sampling_charges);
  formData.append("state_sampling_charges", lab.state_sampling_charges);
  formData.append("state_sampling_time", lab.state_sampling_time);
  // formData.append("phone", lab.phone);
  formData.append("landline", lab.landline);
  formData.append("address", lab.address);
  // formData.append("province", lab.province);
  // formData.append("district", lab.district);
  formData.append("city_id", lab.city_id);
  // formData.append("office", lab.office);
  // formData.append("complaint_handling_email", lab.complaint_handling_email);
  // formData.append("complaint_handling_phone", lab.complaint_handling_phone);
  formData.append(
    "is_digital_payment_accepted",
    lab.is_digital_payment_accepted
  );
  formData.append(
    "is_registering_for_first_time",
    lab.is_registering_for_first_time
  );
  formData.append("registered_by", lab.registered_by);
  formData.append("lab_staff_name", lab.lab_staff_name);
  formData.append("lab_staff_designation", lab.lab_staff_designation);
  formData.append("marketer_name", lab.marketer_name);
  formData.append("marketer_cnic", lab.marketer_cnic);
  formData.append("marketer_email", lab.marketer_email);
  formData.append("marketer_phone", lab.marketer_phone);
  formData.append("marketer_city", lab.marketer_city);

  return axios
    .post(`${url.POST_LAB_INFORMATION}/${id}`, formData, {
      headers: getHeader(authHeader()),
    })
    .then(response => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch(err => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 400:
            message = err.response.data;
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Post Lab Information
export const postCorporateInformation = (id, corporate) => {
  let formData = new FormData();
  formData.append("name", corporate.name);
  formData.append("logo", corporate.logo);
  formData.append("national_taxation_no", corporate.national_taxation_no);
  formData.append("email", corporate.email);
  formData.append("phone", corporate.phone);
  formData.append("landline", corporate.landline);
  formData.append("address", corporate.address);
  formData.append("city_id", corporate.city_id);
  formData.append("website_url", corporate.website_url);
  formData.append("payment_terms", corporate.payment_terms);
  return axios
    .post(`${url.POST_CORPORATE_INFORMATION}/${id}`, formData, {
      headers: getHeader(authHeader()),
    })
    .then(response => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch(err => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 400:
            message = err.response.data;
            break;
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
export const postLogin = user => {
  let formData = new FormData();
  formData.append("username", user.username);
  formData.append("password", user.password);
  formData.append("guest_id", user.guest_id);

  console.log("django api", user)
  return axios.post(url.POST_LOGIN, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Get Labs Request -------------
export const getLabs = () =>
  get(url.GET_LABS, {
    headers: getHeader(authHeader()),
  });
export const getDonorsA = () =>
  get(url.GET_DONORSA, {
    headers: getHeader(authHeader()),
  });
//////////////////////////
export const getLabsListing = () => {
  get(url.GET_LABS_LISTING, {
    headers: getHeader(authHeader()),
  })
  .then(response => {
    console.log('Response data:', response.data);
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });
};

export const getMainLabs = () =>
  get(url.GET_MAIN_LABS, {
    headers: getHeader(authHeader()),
  });
export const getDonors = () =>
  get(url.GET_DONORS, {
    headers: getHeader(authHeader()),
  });

// ------------- Offered Test Requests START -------------
export const getTests = () =>
  get(url.GET_TESTS, {
    headers: getHeader(authHeader()),
  });

export const getUnits = () =>
  get(url.GET_UNITS, {
    headers: getHeader(authHeader()),
  });

export const getOfferedTests = id =>
  get(`${url.GET_OFFERED_TESTS}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getCorporateTests = id =>
  get(`${url.GET_CORPORATE_TESTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

// List of Corporate 
export const getLabCorporate = id =>
  get(`${url.GET_LABCORPORATE}/${id}`, {
    headers: getHeader(authHeader()),
  });

  // List of Corporate 

export const getACorporate = () =>
  get(url.GET_ACORPORATE, {
    headers: getHeader(authHeader()),
  });

export const getRFeeCorporate = () =>
  get(url.GET_RFeeCORPORATE, {
    headers: getHeader(authHeader()),
  });

export const updateACorporateStatus = offeredTest => {
  let formData = new FormData();
  formData.append("plateform_charges", offeredTest.plateform_charges);
  // formData.append("is_active", offeredTest.is_active);

  return axios.put(`${url.UPDATE_ACORPORATE_STATUS}/${offeredTest.id}`, formData, {
    headers: getHeader(authHeader()),
  });
  };

// List of Accepted Corporate 
export const getALabCorporate = id =>
  get(`${url.GET_ALABCORPORATE}/${id}`, {
    headers: getHeader(authHeader()),
  });

// List of Corporate Employee
export const getEmployeeCorporate = id =>
  get(`${url.GET_EMPLOYEECORPORATE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getLabsCorporate = id =>
  get(`${url.GET_LABSCORPORATE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getOfferedTestsReferrel = id =>
  get(`${url.GET_OFFEREDTEST_REFERRELFEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getCOfferedTestsReferrel = id =>
  get(`${url.GET_COFFEREDTEST_REFERRELFEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getCOfferedProfilesReferrel = id =>
  get(`${url.GET_COFFEREDPROFILE_REFERRELFEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getCOfferedPackagesReferrel = id =>
  get(`${url.GET_COFFEREDPACKAGE_REFERRELFEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getCOfferedRadiologysReferrel = id =>
  get(`${url.GET_COFFEREDRADIOLOGY_REFERRELFEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getOfferedProfilesReferrel = id =>
  get(`${url.GET_OFFEREDPROFILE_REFERRELFEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getOfferedPackagesReferrel = id =>
  get(`${url.GET_OFFEREDPACKAGE_REFERRELFEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getOfferedRadiologysReferrel = id =>
  get(`${url.GET_OFFEREDRADIOLOGY_REFERRELFEE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewOfferedTest = (offeredTest, id) => {
  let formData = new FormData();
  formData.append("test_id", offeredTest.test_id);
  // formData.append("unit_id", offeredTest.unit_id);
  formData.append("duration_required", offeredTest.duration_required);
  formData.append("duration_type", offeredTest.duration_type);
  formData.append("sample_type", offeredTest.sample_type);
  formData.append("price", offeredTest.price);
  formData.append("is_eqa_participation", offeredTest.is_eqa_participation);
  formData.append(
    "is_home_sampling_available",
    offeredTest.is_home_sampling_available
  );
  formData.append("is_test_performed", offeredTest.is_test_performed);
  formData.append("is_active", offeredTest.is_active);
  console.log("api helper",offeredTest, id)
  return axios.post(`${url.ADD_NEW_OFFERED_TEST}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const addNewCorporateTest = (offeredTest, id) => {
  let formData = new FormData();
  formData.append("test_id", offeredTest.test_id);
  formData.append("price", offeredTest.price);
  formData.append("start_date", offeredTest.start_date);
  formData.append("end_date", offeredTest.end_date);
  console.log("api helper",offeredTest, id)
  return axios.post(`${url.ADD_NEW_CORPORATE_TEST}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const addNewCorporate = (offeredTest, id) => {
  let formData = new FormData();
  formData.append("corporate_id", offeredTest.corporate_id);
  formData.append("status", offeredTest.status);
  formData.append("allow_all", offeredTest.allow_all);
  console.log("api helper",offeredTest, id)
  return axios.post(`${url.ADD_NEW_CORPORATE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const addNewOfferedMainTest = (offeredTest, id) => {
  let formData = new FormData();
  formData.append("main_lab_tests", offeredTest.main_lab_tests);
  // formData.append("unit_id", offeredTest.unit_id);
 console.log("dataaaa",offeredTest )
  return axios.post(`${url.ADD_NEW_OFFERED_MAINTEST}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateOfferedTest = offeredTest => {
  let formData = new FormData();
  formData.append("id", offeredTest.id);
  formData.append("test_id", offeredTest.test_id);
  // formData.append("unit_id", offeredTest.unit_id);
  formData.append("duration_required", offeredTest.duration_required);
  formData.append("duration_type", offeredTest.duration_type);
  formData.append("sample_type", offeredTest.sample_type);
  formData.append("price", offeredTest.price);
  formData.append("is_eqa_participation", offeredTest.is_eqa_participation);
  formData.append(
    "is_home_sampling_available",
    offeredTest.is_home_sampling_available
  );
  formData.append("is_test_performed", offeredTest.is_test_performed);
  formData.append("is_active", offeredTest.is_active);

  return axios.put(`${url.UPDATE_OFFERED_TEST}/${offeredTest.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateCorporateTest = offeredTest => {
  let formData = new FormData();
  formData.append("id", offeredTest.id);
  formData.append("test_id", offeredTest.test_id);
  formData.append("price", offeredTest.price);
  formData.append("start_date", offeredTest.start_date);
  formData.append("end_date", offeredTest.end_date);
  // formData.append("is_active", offeredTest.is_active);

  return axios.put(`${url.UPDATE_CORPORATE_TEST}/${offeredTest.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateCorporateStatus = offeredTest => {
  let formData = new FormData();
  formData.append("status", offeredTest.status);
  formData.append("shared_percentage", offeredTest.shared_percentage);
  // formData.append("is_active", offeredTest.is_active);

  return axios.put(`${url.UPDATE_CORPORATE_STATUS}/${offeredTest.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const deleteOfferedTest = offeredTest =>
  del(`${url.DELETE_OFFERED_TEST}/${offeredTest.id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Home Sample Collector Requests START -------------
export const getSampleCollectors = id =>
  get(`${url.GET_SAMPLE_COLLECTORS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewSampleCollector = (sampleCollector, id) => {
  let formData = new FormData();
  formData.append("name", sampleCollector.name);
  formData.append("gender", sampleCollector.gender);
  formData.append("cnic", sampleCollector.cnic);
  formData.append("phone", sampleCollector.phone);
  formData.append("photo", sampleCollector.photo);
  formData.append("account_id", sampleCollector.account_id);

  return axios.post(`${url.ADD_NEW_SAMPLE_COLLECTOR}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateSampleCollector = sampleCollector => {
  let formData = new FormData();
  formData.append("id", sampleCollector.id);
  formData.append("name", sampleCollector.name);
  formData.append("gender", sampleCollector.gender);
  formData.append("cnic", sampleCollector.cnic);
  formData.append("phone", sampleCollector.phone);
  formData.append("photo", sampleCollector.photo);

  return axios.put(
    `${url.UPDATE_SAMPLE_COLLECTOR}/${sampleCollector.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const deleteSampleCollector = sampleCollector =>
  del(`${url.DELETE_SAMPLE_COLLECTOR}/${sampleCollector.id}`, {
    headers: getHeader(authHeader()),
  });

  // ------------- Live chat for csr and csr admin complaints -------------
export const getNotesComplaint = id =>
  get(`${url.GET_NOTES_COMPLAINT}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewNoteComplaint = (note, id) => {
  let formData = new FormData();
  formData.append("note", note.note);
  formData.append("complaint_id", note.complaint_id);

  console.log("heeeeeee",note, id)
  return axios.post(`${url.ADD_NEW_NOTE_COMPLAINT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
  };

  // ------------- Test Certificate Requests START -------------
export const getNotes = id =>
get(`${url.GET_NOTES}/${id}`, {
  headers: getHeader(authHeader()),
});

export const addNewNote = (note, id) => {
let formData = new FormData();
formData.append("note", note.note);
formData.append("appointment_id", note.appointment_id);

console.log("heeeeeee",note, id)
return axios.post(`${url.ADD_NEW_NOTE}/${id}`, formData, {
  headers: getHeader(authHeader()),
});
};
export const getMsgs = id =>
get(`${url.GET_MSGS}/${id}`, {
  headers: getHeader(authHeader()),
});

export const addNewMsg = (msg, id) => {
let formData = new FormData();
formData.append("msg", msg.msg);
formData.append("advertisement_id", msg.advertisement_id);

console.log("heeeeeee",msg, id)
return axios.post(`${url.ADD_NEW_MSG}/${id}`, formData, {
  headers: getHeader(authHeader()),
});
};
// ------------- Test Certificate Requests START -------------

export const addNewCollectionPointQuality = (qualityCertificate, id) => {
  let formData = new FormData();
  formData.append("main_lab_quality", qualityCertificate.main_lab_quality);
  // formData.append("unit_id", qualityCertificate.unit_id);
  console.log("main_lab_quality",qualityCertificate )
  return axios.post(`${url.ADD_NEW_COLLECTIONPOINT_QUALITY}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getQualityCertificates = id =>
  get(`${url.GET_QUALITY_CERTIFICATES}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewQualityCertificate = (qualityCertificate, id) => {
  let formData = new FormData();
  formData.append("name", qualityCertificate.name);
  formData.append("type", qualityCertificate.type);
  formData.append("certificate", qualityCertificate.certificate);
  formData.append("certificate_type", qualityCertificate.certificate_type);
  formData.append("sub_certificate_type", qualityCertificate.sub_certificate_type);
  formData.append("expiry_date", qualityCertificate.expiry_date);
  formData.append("start_date", qualityCertificate.start_date);
  formData.append("end_date", qualityCertificate.end_date);

  return axios.post(`${url.ADD_NEW_QUALITY_CERTIFICATE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateQualityCertificate = qualityCertificate => {
  let formData = new FormData();
  formData.append("id", qualityCertificate.id);
  formData.append("name", qualityCertificate.name);
  formData.append("type", qualityCertificate.type);
  formData.append("certificate", qualityCertificate.certificate);
  formData.append("certificate_type", qualityCertificate.certificate_type);
  formData.append("expiry_date", qualityCertificate.expiry_date);
  formData.append("start_date", qualityCertificate.start_date);
  formData.append("end_date", qualityCertificate.end_date);

  return axios.put(
    `${url.UPDATE_QUALITY_CERTIFICATE}/${qualityCertificate.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const deleteQualityCertificate = qualityCertificate =>
  del(`${url.DELETE_QUALITY_CERTIFICATE}/${qualityCertificate.id}`, {
    headers: getHeader(authHeader()),
  });
  
export const getActivityLog = id =>
  get(`${url.GET_ACTIVITY_LOG}/${id}`, {
    headers: getHeader(authHeader()),
  });
  
  // export const getNotification = id =>
  // get(`${url.GET_NOTIFICATION}/${id}`, {
  //   headers: getHeader(authHeader()),
  // });
  export const getNotification = (id,previousApiCallTime) => {
    let formData = new FormData();
    formData.append("previousApiCallTime", previousApiCallTime);
    formData.append("id", id);
   console.log("data",previousApiCallTime )
    return axios.post(`${url.GET_NOTIFICATION}/${id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };

export const getSampleNotification = (id,previousApiCallTime) => {
    let formData = new FormData();
    formData.append("previousApiCallTime", previousApiCallTime);
    formData.append("id", id);
   console.log("data",previousApiCallTime )
    return axios.post(`${url.GET_SAMPLE_NOTIFICATION}/${id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };


export const getMarketerNotification = (id,previousApiCallTime) => {
  let formData = new FormData();
  formData.append("previousApiCallTime", previousApiCallTime);
  formData.append("id", id);
 console.log("data",previousApiCallTime )
  return axios.post(`${url.GET_MARKETER_NOTIFICATION}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getCsrAdminNotification = (id,previousApiCallTime) => {
  let formData = new FormData();
  formData.append("previousApiCallTime", previousApiCallTime);
  formData.append("id", id);
 console.log("data",previousApiCallTime )
  return axios.post(`${url.GET_CSR_ADMIN_NOTIFICATION}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getRegAdminNotification = (id,previousApiCallTime) => {
  let formData = new FormData();
  formData.append("previousApiCallTime", previousApiCallTime);
  formData.append("id", id);
 console.log("data",previousApiCallTime )
  return axios.post(`${url.GET_REG_ADMIN_NOTIFICATION}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getCsrOfficerNotification = (id,previousApiCallTime) => {
  let formData = new FormData();
  formData.append("previousApiCallTime", previousApiCallTime);
  formData.append("id", id);
 console.log("data",previousApiCallTime )
  return axios.post(`${url.GET_CSR_OFFICER_NOTIFICATION}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
// ------------- Finanace START Activity Log-------------

export const getActivityLogFinance = id =>
  get(`${url.GET_ACTIVITY_LOG_FINANCE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getLcList = ()=>
  get(`${url.GET_LC_LIST}`, {
    headers: getHeader(authHeader()),
  })
  export const getCorporateList = ()=>
get( `${url.GET_CORPORATE_LIST}`, {
  headers: getHeader(authHeader()),
});
// ------------- Corporate START Activity Log-------------

export const getCorporateCommit = id =>
  get(`${url.GET_CORPORATE_COMMIT}/${id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Marketer Admin Activity Log -------------

export const getActivityLogMarketer = id =>
  get(`${url.GET_ACTIVITY_LOG_MARKETER}/${id}`, {
    headers: getHeader(authHeader()),
  });

  export const getLabActivityLogMarketer = id =>
  get(`${url.GET_LAB_ACTIVITY_LOG_MARKETER}/${id}`, {
    headers: getHeader(authHeader()),
  });
// ------------- Pathologists START -------------
export const getPathologists = id =>
  get(`${url.GET_PATHOLOGISTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewPathologist = (pathologist, id) => {
  let formData = new FormData();
  formData.append("name", pathologist.name);
  formData.append("email", pathologist.email);
  formData.append("phone", pathologist.phone);
  formData.append("landline", pathologist.landline);
  formData.append("designation", pathologist.designation);
  formData.append("photo", pathologist.photo);
  formData.append("qualification", pathologist.qualification);
  formData.append("speciality", pathologist.speciality); //
  formData.append("pmdc_reg_no", pathologist.pmdc_reg_no);
  formData.append(
    "is_available_for_consultation",
    pathologist.is_available_for_consultation
  );
  formData.append(
    "is_available_on_whatsapp",
    pathologist.is_available_on_whatsapp
  );
  formData.append("is_associated_with_pap", pathologist.is_associated_with_pap);

  return axios.post(`${url.ADD_NEW_PATHOLOGIST}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updatePathologist = pathologist => {
  let formData = new FormData();
  formData.append("id", pathologist.id);
  formData.append("name", pathologist.name);
  formData.append("email", pathologist.email);
  formData.append("phone", pathologist.phone);
  formData.append("landline", pathologist.landline);
  formData.append("designation", pathologist.designation);
  formData.append("photo", pathologist.photo);
  formData.append("qualification", pathologist.qualification);
  formData.append("speciality", pathologist.speciality); //
  formData.append("pmdc_reg_no", pathologist.pmdc_reg_no);
  formData.append(
    "is_available_for_consultation",
    pathologist.is_available_for_consultation
  );
  formData.append(
    "is_available_on_whatsapp",
    pathologist.is_available_on_whatsapp
  );
  formData.append("is_associated_with_pap", pathologist.is_associated_with_pap);

  return axios.put(`${url.UPDATE_PATHOLOGIST}/${pathologist.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const deletePathologist = pathologist =>
  del(`${url.DELETE_PATHOLOGIST}/${pathologist.id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Forget Password Requests START -------------
export const postForgetPwd = data => {
  let formData = new FormData();
  formData.append("email", data.email);

  return axios.post(url.POST_FORGET_PASSWORD, formData, {
    headers: getHeader(authHeader()),
  });
};

export const postConfirmPwd = (user, token) => {
  let formData = new FormData();
  formData.append("password", user.password);
  formData.append("token", token);

  return axios.post(url.POST_CONFIRM_PASSWORD, formData, {
    headers: getHeader(authHeader()),
  });
};

export const postChangePwd = user => {
  let formData = new FormData();
  formData.append("old_password", user.old_password);
  formData.append("new_password", user.new_password);

  return axios.post(url.POST_CHANGE_PASSWORD, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Test Appointment Requests START -------------
export const addNewCollectionPointTestAppointment = (testAppointment, id) => {
  let formData = new FormData();
  formData.append("main_lab_appointments", testAppointment.main_lab_appointments);
  // formData.append("unit_id", testAppointment.unit_id);
 console.log("dataaaa",testAppointment )
  return axios.post(`${url.ADD_NEW_COLLECTIONPOINT_TESTAPPOINTMENT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getTestAppointmentsPendingList = id =>
  get(`${url.GET_TEST_APPOINTMENTS_PENDING_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getTestAppointmentsInProcessList = id =>
  get(`${url.GET_TEST_APPOINTMENTS_IN_PROCESS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getTestAppointmentsCompletedList = id =>
  get(`${url.GET_TEST_APPOINTMENTS_COMPLETED_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateTestAppointment = testAppointment => {
  let formData = new FormData();

  formData.append("id", testAppointment.id);
  formData.append("status", testAppointment.status);
  formData.append("process", testAppointment.process);

  if (testAppointment.process == "pending") {
    formData.append(
      "estimated_sample_collection_at",
      testAppointment.estimated_sample_collection_at
    );
    // formData.append(
    //   "estimated_result_uploading_at",
    //   testAppointment.estimated_result_uploading_at
    // );
  } else if (testAppointment.process == "rescheduling") {
    formData.append("rescheduled_by", testAppointment.rescheduledBy);
    formData.append("assigned_to", testAppointment.assigned_to);
    formData.append(
      "estimated_sample_collection_at",
      testAppointment.estimated_sample_collection_at
    );

    if (testAppointment.reschedule_reason == "Other") {
      formData.append("reschedule_reason", testAppointment.reason);
    } else {
      formData.append("reschedule_reason", testAppointment.reschedule_reason);
    }
  } else {
    if (
      testAppointment.patient_unique_id &&
      testAppointment.patient_unique_id.length > 0
    ) {
      formData.append("patient_unique_id", testAppointment.patient_unique_id);
    }

    formData.append("is_rescheduled", testAppointment.isRescheduled);
    formData.append("result_type", testAppointment.result_type);
    formData.append("url", testAppointment.url);
    formData.append("result", testAppointment.result);

    if (testAppointment.assigned_to && testAppointment.assigned_to == null) {
      formData.append("assigned_to", "");
    } else {
      formData.append("assigned_to", testAppointment.assigned_to);
    }
  }

  // console.log("formData: ", formData);
  console.log("testAppointment: ", testAppointment);

  // formData.append("id", testAppointment.id);
  // formData.append("patient_unique_id", testAppointment.patient_unique_id);
  // formData.append("patient_id", testAppointment.patient_id);
  // formData.append("booked_at", testAppointment.booked_at);
  // formData.append(
  //   "appointment_requested_at",
  //   testAppointment.appointment_requested_at
  // );

  return axios.put(
    `${url.UPDATE_TEST_APPOINTMENT}/${testAppointment.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

// ------------- Lab Profile Requests START -------------
export const getLabProfile = id =>
  get(`${url.GET_LAB_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateLabProfile = (labProfile, id) => {
  let formData = new FormData();
  formData.append("account_id", id);
  formData.append("name", labProfile.name);
  formData.append("logo", labProfile.logo);
  formData.append("lab_experience", labProfile.lab_experience);
  formData.append("email", labProfile.email);
  formData.append("landline", labProfile.landline);
  formData.append("address", labProfile.address);
  formData.append("city", labProfile.city);
  formData.append("district", labProfile.district);
  formData.append("province", labProfile.province);

  return axios.put(`${url.UPDATE_LAB_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Lab Settings Requests START -------------
export const getLabSettings = id =>
  get(`${url.GET_LAB_SETTINGS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateLabSettings = (labSettings, id) => {
  let formData = new FormData();

  formData.append("account_id", id);
  formData.append("is_247_opened", labSettings.is_247_opened);
  formData.append("opening_time", labSettings.opening_time);
  formData.append("closing_time", labSettings.closing_time);
  formData.append("opening_day", labSettings.opening_day);
  formData.append("closing_day", labSettings.closing_day);
  formData.append("health_dept_certified", labSettings.health_dept_certified);
  formData.append("lab_experience", labSettings.lab_experience);
  formData.append("registration_no", labSettings.registration_no);
  formData.append("license_no", labSettings.license_no);
  formData.append("is_homesampling_offered", labSettings.is_homesampling_offered);
  formData.append(
    "health_dept_certificate",
    labSettings.health_dept_certificate
  );
  formData.append("phone", labSettings.phone);
  formData.append("type", labSettings.type);
  formData.append(
    "complaint_handling_email",
    labSettings.complaint_handling_email
  );
  formData.append(
    "complaint_handling_phone",
    labSettings.complaint_handling_phone
  );
  formData.append("home_sampling_charges", labSettings.home_sampling_charges);
  formData.append("state_sampling_charges", labSettings.state_sampling_charges);
  formData.append("state_sampling_time", labSettings.state_sampling_time);

  formData.append(
    "is_digital_payment_accepted",
    labSettings.is_digital_payment_accepted
  );
  formData.append("is_active", labSettings.is_active);
  formData.append("bank", labSettings.bank);
  formData.append("account_number", labSettings.account_number);
  formData.append("branch_code", labSettings.branch_code);
  console.log("labsettings",labSettings)

  return axios.put(`${url.UPDATE_LAB_SETTINGS}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getLabPayments = id =>
  get(`${url.GET_LAB_PAYMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateLabPayments = (labPayments, id) => {
  let formData = new FormData();

  formData.append("test_appointment_id", id);
  formData.append("counter_discount", labPayments.counter_discount);
  formData.append("amount_received", labPayments.amount_received);
  formData.append("received_by", labPayments.received_by);
  return axios.put(`${url.UPDATE_LAB_PAYMENTS}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Patient Test Appointment Requests START -------------
export const getPatientTestAppointmentsList = id =>
  get(`${url.GET_PATIENT_TEST_APPOINTMENTS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Patient Profile Requests START -------------
export const getPatientProfile = id =>
  get(`${url.GET_PATIENT_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updatePatientProfile = (patientProfile, id) => {
  let formData = new FormData();
  formData.append("account_id", id);
  formData.append("name", patientProfile.name);
  formData.append("phone", patientProfile.phone);

  return axios.put(`${url.UPDATE_PATIENT_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Get Region Wise Advertisement
export const getRegionWiseAdvertisement = locationDetails => {
  let formData = new FormData();
  formData.append("latitude", locationDetails.latitude);
  formData.append("longitude", locationDetails.longitude);
  formData.append("search_type", locationDetails.search_type);
  formData.append("address", locationDetails.address);
  formData.append("city", locationDetails.city);

  // console.log("donorSetting: ", locationDetails)

  return axios.post(`${url.GET_REGION_WISE_ADVERTISEMENT}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Get Nearby Labs
export const getNearbyLabs = locationDetails => {
  let formData = new FormData();
  formData.append("latitude", locationDetails.latitude);
  formData.append("longitude", locationDetails.longitude);
  formData.append("search_type", locationDetails.search_type);
  formData.append("km", locationDetails.km);
  formData.append("name", locationDetails.name);
  formData.append("LabType", locationDetails.LabType);
  formData.append("address", locationDetails.address);
  formData.append("city", locationDetails.city);
  formData.append("guest_id", locationDetails.guest_id);
  formData.append("locationAccessAllowed", locationDetails.locationAccessAllowed);
  formData.append("corporatepatient", locationDetails.corporatepatient);
  console.log("In near by lsbd: ", locationDetails)


  return axios.post(`${url.GET_NEARBY_LABS}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Get Corporate Nearby Labs
export const getCorporateLabs = locationDetails => {
  let formData = new FormData();
  formData.append("latitude", locationDetails.latitude);
  formData.append("longitude", locationDetails.longitude);
  formData.append("search_type", locationDetails.search_type);
  formData.append("km", locationDetails.km);
  formData.append("name", locationDetails.name);
  formData.append("LabType", locationDetails.LabType);
  formData.append("address", locationDetails.address);
  formData.append("city", locationDetails.city);
  formData.append("guest_id", locationDetails.guest_id);
  formData.append("locationAccessAllowed", locationDetails.locationAccessAllowed);
  formData.append("corporatepatient", locationDetails.corporatepatient);
  console.log("In near by lsbd: ", locationDetails)


  return axios.post(`${url.GET_CORPORATE_LABS}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Get Nearby Tests
export const getNearbyTests = data => {
  let formData = new FormData();

  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);
  formData.append("search_type", data.search_type);
  formData.append("km", data.km);
  formData.append("page", data.page);
  formData.append("LabType", data.LabType);
  formData.append("address", data.address);
  formData.append("city", data.city);
  formData.append("test_name", data.test_name);
  formData.append("locationAccessAllowed", data.locationAccessAllowed);
  formData.append("name", data.name);
  formData.append("locationAccessAllowed", data.locationAccessAllowed);
  console.log("donorSetting: ", data)

  console.log("In near by lsbd: ", data)


  return axios.post(`${url.GET_NEARBY_TESTS}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Get Nearby Tests
export const getNearbyTestsDiscounted = data => {
  let formData = new FormData();

  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);
  formData.append("search_type", data.search_type);
  formData.append("km", data.km);
  formData.append("page", data.page);
  formData.append("LabType", data.LabType);
  formData.append("address", data.address);
  formData.append("city", data.city);
  formData.append("test_name", data.test_name);
  console.log("donorSetting: ", data)

  console.log("In near by lsbd: ", data)


  return axios.post(`${url.GET_NEARBY_TESTS_DISCOUNTEDLH}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Get Nearby Tests
export const getNearbyProfiles = data => {
  let formData = new FormData();

  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);
  formData.append("search_type", data.search_type);
  formData.append("address", data.address);
  formData.append("page", data.page);
  formData.append("city", data.city);
  formData.append("km", data.km);
  formData.append("LabType", data.LabType);
  formData.append("test_name", data.test_name);
  console.log("donorSetting: ", data);
  formData.append("name", data.name);
  formData.append("locationAccessAllowed", data.locationAccessAllowed);

  return axios.post(`${url.GET_NEARBY_PROFILES}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getTestss = () =>
  get(url.GET_TESTSS, {
    headers: getHeader(authHeader()),
  });

export const getProfiles = () =>
  get(url.GET_PROFILES, {
    headers: getHeader(authHeader()),
  });

export const getPackages = () =>
  get(url.GET_PACKAGES, {
    headers: getHeader(authHeader()),
  });
// Get Nearby Packages
export const getNearbyPackages = data => {
  let formData = new FormData();

  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);
  formData.append("search_type", data.search_type);
  formData.append("address", data.address);
  formData.append("city", data.city);
  formData.append("km", data.km);
  formData.append("page", data.page);
  formData.append("LabType", data.LabType);
  formData.append("test_name", data.test_name);
  console.log("packages: ", data);
  formData.append("name", data.name);
  formData.append("locationAccessAllowed", data.locationAccessAllowed);

  // console.log("in packages", data);

  return axios.post(`${url.GET_NEARBY_PACKAGES}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getRadiology = () =>
  get(url.GET_RADIOLOGY, {
    headers: getHeader(authHeader()),
  });
export const getTestsList = id =>
  get(`${url.GET_TESTS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getCorporateTestsList = id =>
  get(`${url.GET_CORPORATE_TESTS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });
// Get Nearby Packages
export const getNearbyRadiology = data => {
  let formData = new FormData();

  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);
  formData.append("search_type", data.search_type);
  formData.append("address", data.address);
  formData.append("city", data.city);
  formData.append("km", data.km);
  formData.append("page", data.page);
  formData.append("LabType", data.LabType);
  formData.append("test_name", data.test_name);
  console.log("radiology: ", data);
  formData.append("name", data.name);
  formData.append("locationAccessAllowed", data.locationAccessAllowed);


  return axios.post(`${url.GET_NEARBY_RADIOLOGY}`, formData, {
    headers: getHeader(authHeader()),
  });
};
// ------------- Corporate Profile Requests START -------------
export const getCorporateProfile = id =>
  get(`${url.GET_CORPORATE_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getCorporateProfileforpayment = id =>
  get(`${url.GET_CORPORATE_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

  export const updateCorporateProfile = (CorporateProfile, id) => {
    console.log('Updating corporate profile:', CorporateProfile, id);
    
    let formData = new FormData();
    formData.append("name", CorporateProfile.name);
    formData.append("logo", CorporateProfile.logo);
    formData.append("email", CorporateProfile.email);
    formData.append("phone", CorporateProfile.phone);
    formData.append("landline", CorporateProfile.landline);
    formData.append("address", CorporateProfile.address);
    formData.append("city", CorporateProfile.city);
    formData.append("payment_terms", CorporateProfile.payment_terms);
    formData.append("national_taxation_no", CorporateProfile.national_taxation_no);
  
    return axios.put(`${url.UPDATE_CORPORATE_PROFILE}/${id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
  

// export const updateB2bProfile = (b2bProfile, id) => {
//   let formData = new FormData();
//   // formData.append("account_id", id);
//   formData.append("business_name", b2bProfile.business_name);
//   formData.append("email", b2bProfile.email);
//   formData.append("landline", b2bProfile.landline);
//   formData.append("website_url", b2bProfile.website_url);
//   formData.append("business_logo", b2bProfile.business_logo)

//   return axios.put(`${url.UPDATE_B2B_PROFILE}/${id}`, formData, {
//     headers: getHeader(authHeader()),
//   });
// };

// ----------------- Patient Feedback -----------------
export const addNewPatientFeedback = patientFeedback => {
  let formData = new FormData();
  //formData.append("test_appointment_id", patientFeedback.id);
  formData.append("rating", patientFeedback.rating);
  formData.append("review", patientFeedback.review);

  return axios.post(
    `${url.ADD_NEW_PATIENT_FEEDBACK}/${patientFeedback.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};
// ----------------- Complaints -----------------
export const addNewComplaint = complaint => {
  let formData = new FormData();
  formData.append("complainant", complaint.complainant);
  formData.append("complainee", complaint.complainee);
  formData.append("lab_id", complaint.lab_id);
  formData.append("labhazir_complainee", complaint.labhazir_complainee);
  formData.append("name", complaint.name);
  formData.append("email", complaint.email);
  formData.append("city", complaint.city);
  formData.append("phone", complaint.phone);
  formData.append("subject", complaint.subject);
  formData.append("message", complaint.message);
 console.log("data",complaint )
  return axios.post(`${url.ADD_NEW_COMPLAINT}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getUnhandledComplaints = id =>
  get(`${url.GET_UNHANDLED_COMPLAINTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

  export const updateUnhandledComplaints = data => {
    let formData = new FormData();
    formData.append("status", data.status);
    console.log("Form data: ", formData);
  
    return axios.put(`${url.UPDATE_UNHANDLED_COMPLAINTS}/${data.id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
// export const updateUnhandledComplaints = id => {
//   let formData = new FormData();

//   return axios.put(`${url.UPDATE_UNHANDLED_COMPLAINTS}/${id}`, formData, {
//     headers: getHeader(authHeader()),
//   });
// };

export const getHandledComplaints = id =>
  get(`${url.GET_HANDLED_COMPLAINTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

  export const getCsrAppointments = id =>
  get(`${url.GET_CSR_APPOINTMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

  export const updateCsrAppointments = csrAppointment => {
    let formData = new FormData();
    // formData.append("comment", data.comment);
    formData.append("status", csrAppointment.status);
    // formData.append("appointment_option", csrAppointment.appointment_option);
    // formData.append("staff", csrAppointment.staff);
    // formData.append("comments", csrAppointment.comments);
    console.log("Form data: ", csrAppointment);
  
    return axios.put(`${url.UPDATE_CSR_APPOINTMENTS}/${csrAppointment.id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };

export const getCsrComplaints = id =>
  get(`${url.GET_CSR_COMPLAINTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

  export const updateCsrComplaints = csrcomplaint => {
    let formData = new FormData();
    // formData.append("comment", data.comment);
    formData.append("appointment_requested_at", csrcomplaint.appointment_requested_at);
    formData.append("appointment_option", csrcomplaint.appointment_option);
    formData.append("staff", csrcomplaint.staff);
    formData.append("comments", csrcomplaint.comments);
    console.log("Form data: ", csrcomplaint);
  
    return axios.put(`${url.UPDATE_CSR_COMPLAINTS}/${csrcomplaint.id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
// Get Quotes
export const getQuotes = (city_id, test_id, search_type, address, longitude, latitude, km, locationAccessAllowed) => {
  let formData = new FormData();
  formData.append("city_id", city_id);
  formData.append("test_id", test_id);
  formData.append("search_type", search_type);
  formData.append("longitude", longitude);
  formData.append("latitude", latitude);
  formData.append("address", address);
  formData.append("km", km);
  formData.append("locationAccessAllowed", locationAccessAllowed);
  console.log("In near by lsbd: ", city_id, test_id, search_type, address, longitude, latitude, km)
  return axios.post(`${url.GET_QUOTES}`, formData, {
    headers: getHeader(authHeader()),
  });
};
// ------------- Cart START -------------
export const getCarts = id =>
  get(`${url.GET_CARTS}/${id}`, {
    
  headers: getHeader(authHeader()),
  });    


export const emptyCart = id =>
  del(`${url.EMPTY_CART}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const deleteCart = cart =>
  del(`${url.DELETE_CART}/${cart.id}`, {
    headers: getHeader(authHeader()),
  });

export const addToCart = (cart, id) => {
  let formData = new FormData();
  // formData.append("account_id", cart.patient_id);
  // formData.append("lab_id", cart.lab_id);
  formData.append("lab_id", cart.lab_id !== undefined ? cart.lab_id : cart.lab_id_id);
  formData.append("offered_test_id", cart.id);
  formData.append("amount", cart.price);
  formData.append("guest_id", cart.guest_id);
  formData.append("invoice_discount", cart.discount);
  formData.append("invoice_labhazir_discount", cart.discount_by_labhazir);
  // formData.append("amount", cart.price);



  console.log("cart items in django apiiii", cart, cart.lab_id_id)

  return axios.post(`${url.ADD_TO_CART}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Get Home Sampled Tests
export const getHomeSampledTests = id =>
  get(`${url.GET_HOME_SAMPLED_TESTS}/${id}`, {
    headers: getHeader(authHeader()),
  });
  
  export const getDonationCheck = id =>
  get(`${url.GET_DONATION_CHECK}/${id}`, {
    headers: getHeader(authHeader()),
  });
// Get Checkout Items
export const getCheckoutItems = (id, is_home_sampling_availed, is_state_sampling_availed) => {
  let formData = new FormData();
  formData.append("is_home_sampling_availed", is_home_sampling_availed);
  formData.append("is_state_sampling_availed", is_state_sampling_availed);
  console.log("different values", id, is_home_sampling_availed);
  console.log("different values", id, is_state_sampling_availed);


  return axios.post(`${url.GET_CHECKOUT_ITEMS}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Add checkout data
export const addCheckoutData = (checkoutData, id) => {
  let formData = new FormData();
  formData.append("uuid", checkoutData.uuid);
  formData.append("csr_id", checkoutData.csr_id);
  formData.append("booked_by", checkoutData.booked_by);
  formData.append("patient_name", checkoutData.patient_name);
  formData.append("patient_age", checkoutData.patient_age);
  formData.append("patient_phone", checkoutData.patient_phone);
  formData.append("patient_gender", checkoutData.patient_gender);
  formData.append("patient_address", checkoutData.patient_address);
  formData.append("ageFormat", checkoutData.ageFormat);
  // formData.append("patient_city", checkoutData.patient_city);
  // formData.append("patient_district", checkoutData.patient_district);
  // formData.append(
  //   "relationsip_with_patient",
  //   checkoutData.relationsip_with_patient
  // );
  formData.append(
    "appointment_requested_at",
    checkoutData.appointment_requested_at
  );
  formData.append(
    "is_home_sampling_availed",
    checkoutData.is_home_sampling_availed
  );
  formData.append(
    "is_state_sampling_availed",
    checkoutData.is_state_sampling_availed
  );
  formData.append("payment_method", checkoutData.payment_method);
  formData.append("card_number", checkoutData.card_number);
  formData.append("name_on_card", checkoutData.name_on_card);
  formData.append("expiry_date", checkoutData.expiry_date);
  formData.append("cvv_code", checkoutData.cvv_code);

  console.log("add different with address data with home sampling", checkoutData);

  return axios.post(`${url.ADD_CHECKOUT_DATA}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Get Invoice Detail
export const getInvoiceDetail = id =>
  get(`${url.GET_INVOICE_DETAIL}/${id}`, {
    headers: getHeader(authHeader()),
  });

// FEEDBACK
export const getFeedbacks = id =>
  get(`${url.GET_FEEDBACKS}/${id}`, {
    headers: getHeader(authHeader()),
  });



// FEEDBACK
export const getLabsRating =() =>
  get(`${url.GET_LABS_RATING}`, {
    headers: getHeader(authHeader()),
  });
// export const updatePaymentInfo = id => {
//   let formData = new FormData();

//   return axios.put(`${url.UPDATE_PAYMENT_INFO}/${id}`, formData, {
//     headers: getHeader(authHeader()),
//   });
// };

//testing
export const getLabsTesting =() =>
  get(`${url.GET_LABS_TESTING}`, {
    headers: getHeader(authHeader()),
  });


// Get Test Description
export const getTestDescriptions = id =>
  get(`${url.GET_TEST_DESCRIPTIONS}/${id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- B2B client -------------
export const getB2bReferredPatientsList = id =>
  get(`${url.GET_B2B_REFERRED_PATIENTS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });
// ------------- B2B client -------------
export const getB2bLabSharesList = id =>
  get(`${url.GET_B2B_LAB_SHARES_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getB2bSharesLabList = id =>
  get(`${url.GET_B2B_SHARES_LAB_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const updateLabShare = b2bLabShare => {
  let formData = new FormData();
  // formData.append("account_id", id);
  formData.append("b2b_shares", b2bLabShare.b2b_shares);

  return axios.put(`${url.UPDATE_LAB_SHARE}/${b2bLabShare.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateAllLabShare = b2bLabShare => {
  let formData = new FormData();
  // formData.append("account_id", id);
  formData.append("b2b_shares", b2bLabShare.b2b_shares);

  return axios.put(
    `${url.UPDATE_ALL_LAB_SHARE}/${b2bLabShare.b2b_id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};
export const addNewLabShare = (b2bLabShare, id) => {
  let formData = new FormData();
  formData.append("lab_id", b2bLabShare.lab_id);
  formData.append("b2b_shares", b2bLabShare.b2b_shares);


  return axios.post(`${url.ADD_NEW_LAB_SHARE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};


// ------------- B2B List -------------
export const getB2bAllClientsList = () =>
  get(`${url.GET_B2B_ALL_CLIENTS_LIST}`, {
    headers: getHeader(authHeader()),
  });
// Get Nearby Tests
export const getPatientsList = data => {
  let formData = new FormData();

  formData.append("phone", data.phone);
  // formData.append("longitude", data.longitude);
  // formData.append("search_type", data.search_type);
  // formData.append("km", data.km);
  // formData.append("LabType", data.LabType);
  // formData.append("address", data.address);
  // formData.append("city", data.city);
  // formData.append("test_name", data.test_name);
  // console.log("donorSetting: ", data)

  console.log("In patients: ", data)


  return axios.post(`${url.GET_PATIENTS_LIST}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Lab Profile Requests START -------------
export const getB2bProfile = id =>
  get(`${url.GET_B2B_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateB2bProfile = (b2bProfile, id) => {
  let formData = new FormData();
  // formData.append("account_id", id);
  formData.append("business_name", b2bProfile.business_name);
  formData.append("email", b2bProfile.email);
  formData.append("landline", b2bProfile.landline);
  formData.append("website_url", b2bProfile.website_url);
  formData.append("business_logo", b2bProfile.business_logo)

  return axios.put(`${url.UPDATE_B2B_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Bank STATEMENTS -------------
export const getBankStatements = id =>
  get(`${url.GET_BANK_STATEMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- ACCOUNT STATEMENTS -------------
export const getB2bAccountStatements = id =>
  get(`${url.GET_B2B_ACCOUNT_STATEMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getCLabAccountStatements = id =>
  get(`${url.GET_CLAB_ACCOUNT_STATEMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });
// ------------- Donor Settings Requests START -------------
  export const addNewB2bPayment = (b2bPayment, id) => {
    let formData = new FormData();
    // formData.append("lab_id", donorPayment.lab_id);
    formData.append("payment_method", b2bPayment.payment_method);
    formData.append("address_type", b2bPayment.address_type);
    formData.append("address", b2bPayment.address);
    formData.append("amount", b2bPayment.amount);
    formData.append("paid_at", b2bPayment.paid_at);
    formData.append("deposited_at", b2bPayment.deposited_at);
    formData.append("deposit_bank", b2bPayment.deposit_bank);
    formData.append("cheque_no", b2bPayment.cheque_no);
    formData.append("cheque_image", b2bPayment.cheque_image);
    formData.append("deposit_slip", b2bPayment.deposit_slip);
    formData.append("is_cleared", b2bPayment.is_cleared);
    formData.append("cleared_at", b2bPayment.cleared_at);
    formData.append("is_settled", b2bPayment.is_settled);

  
    return axios.post(`${url.ADD_NEW_B2B_PAYMENT}/${id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };

// ------------- Donor Profile Requests START -------------
export const getDonorProfile = id =>
  get(`${url.GET_DONOR_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateDonorProfile = (donorProfile, id) => {
  let formData = new FormData();
  // formData.append("account_id", id);
  formData.append("name", donorProfile.name);
  formData.append("phone", donorProfile.phone);
  formData.append("email", donorProfile.email);
  formData.append("type", donorProfile.type);
  formData.append("cnic", donorProfile.cnic);
  formData.append("company_name", donorProfile.company_name);
  formData.append("is_income_tax_payable", donorProfile.is_income_tax_payable);
  formData.append("is_blocked", donorProfile.is_blocked);


  return axios.put(`${url.UPDATE_DONOR_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Donor -------------
export const getDonorReferredAppointmentsList = id =>
  get(`${url.GET_DONOR_REFERRED_APPOINTMENTS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Donor Settings Requests START -------------
export const getDonorSettings = id =>
  get(`${url.GET_DONOR_SETTINGS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateDonorSettings = (donorSetting, id) => {
  let formData = new FormData();

  formData.append("account_id", id);
  formData.append("donation_to", donorSetting.donation_to);
  formData.append("province", donorSetting.province);
  formData.append("district", donorSetting.district);
  formData.append("city", donorSetting.city);


  console.log("donorSetting: ", donorSetting);

  return axios.put(`${url.UPDATE_DONOR_SETTINGS}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- ACCOUNT STATEMENTS -------------
export const getDonorAccountStatements = id =>
  get(`${url.GET_DONOR_ACCOUNT_STATEMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

  export const getDonorsAccountStatements = id =>
  get(`${url.GET_DONORS_ACCOUNT_STATEMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });


// ------------- Donor Settings Requests START -------------
  export const addNewDonorPayment = (donorPayment, id) => {
    let formData = new FormData();
    // formData.append("lab_id", donorPayment.lab_id);
    formData.append("payment_method", donorPayment.payment_method);
    formData.append("address_type", donorPayment.address_type);
    formData.append("address", donorPayment.address);
    formData.append("amount", donorPayment.amount);
    formData.append("paid_at", donorPayment.paid_at);
    formData.append("deposited_at", donorPayment.deposited_at);
    formData.append("deposit_bank", donorPayment.deposit_bank);
    formData.append("cheque_no", donorPayment.cheque_no);
    formData.append("cheque_image", donorPayment.cheque_image);
    formData.append("deposit_slip", donorPayment.deposit_slip);
    formData.append("is_cleared", donorPayment.is_cleared);
    formData.append("cleared_at", donorPayment.cleared_at);
    formData.append("is_settled", donorPayment.is_settled);

  
    return axios.post(`${url.ADD_NEW_DONOR_PAYMENT}/${id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };

  // Add Bank

  export const updateBank = bank => {
    let formData = new FormData();
    formData.append("name", bank.name);
    formData.append("phone", bank.phone);
    formData.append("email", bank.email);
    formData.append("registered_at", bank.registered_at);
    formData.append("registered_by", bank.registered_by);

    // formData.append("expiry_date", bank.expiry_date);
  
    return axios.put(
      `${url.UPDATE_BANK}/${bank.id}`,
      formData,
      {
        headers: getHeader(authHeader()),
      }
    );
  };

  export const addNewCreateBank = (createBank, id) => {
    let formData = new FormData();
    // formData.append("lab_id", createBank.lab_id);
    formData.append("name", createBank.name);
    formData.append("phone", createBank.phone);
    formData.append("email", createBank.email);
    formData.append("registered_at", createBank.registered_at);
    formData.append("registered_by", createBank.registered_by);

  
    return axios.post(`${url.ADD_NEW_CREATE_BANK}/${id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };

  export const addNewCemployeeData = (cemployeeData, id) => {
    let formData = new FormData();
    formData.append("name", cemployeeData.name);
    formData.append("employee_code", cemployeeData.employee_code);
    formData.append("type", cemployeeData.type);

    return axios.post(`${url.ADD_NEW_CEMPLOYEE_DATA}/${id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
  export const deletecedata = cemployee =>
    del(`${url.DELETE_CEDATA}/${cemployee.id}`, {
      headers: getHeader(authHeader()),
    });

  export const addNewCemployeefile = (cemployeeData) => {
    let formData = new FormData();
    formData.append("excel_file", cemployeeData.excel_file);

    console.log("django api helper", cemployeeData)
  
    return axios.post(`${url.ADD_NEW_CEMPLOYEE_FILE}`, formData, {
      headers: getHeader(authHeader()),
    });
  };

  

  export const updateCemployee = cemployeeData => {
    let formData = new FormData();
    formData.append("name", cemployeeData.name);
    formData.append("employee_code", cemployeeData.employee_code);
    formData.append("status", cemployeeData.status);
  
    return axios.put(
      `${url.UPDATE_CEMPLOYEE}/${cemployeeData.id}`,
      formData,
      {
        headers: getHeader(authHeader()),
      }
    );
  };

  // List of Banks
  export const getBanks = () =>
  get(url.GET_BANKS, {
    headers: getHeader(authHeader()),
  });

  // List of Bank Accounts 
  export const getBankAccounts = () =>
  get(url.GET_BANK_ACCOUNTS, {
    headers: getHeader(authHeader()),
  });

  // Add Bank Account

  export const addNewBankAccount = (bankAccount, id) => {
    let formData = new FormData();
    // formData.append("lab_id", bankAccount.lab_id);
    formData.append("bank_id", bankAccount.bank_id);
    formData.append("account_no", bankAccount.account_no);
    formData.append("account_type", bankAccount.account_type);
    formData.append("categorey", bankAccount.categorey);
    formData.append("currency", bankAccount.currency);
    formData.append("opening_balance", bankAccount.opening_balance);
    formData.append("creating_at", bankAccount.creating_at);
    formData.append("status", bankAccount.status);  
    formData.append("city", bankAccount.city);
    formData.append("address", bankAccount.address);
    formData.append("branch_no", bankAccount.branch_no);
  
    return axios.post(`${url.ADD_NEW_BANK_ACCOUNT}/${id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
// ------------- ACCOUNT STATEMENTS -------------
export const getAccountStatements = id =>
  get(`${url.GET_ACCOUNT_STATEMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Staff Profile Requests START -------------
export const getStaffProfile = id =>
  get(`${url.GET_STAFF_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateStaffProfile = (labProfile, id) => {
  let formData = new FormData();
  formData.append("account_id", id);
  formData.append("name", labProfile.name);
  formData.append("phone", labProfile.phone);
  formData.append("roles", labProfile.roles);

  return axios.put(`${url.UPDATE_STAFF_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const addStaff = (id, staff) => {
  let formData = new FormData();
  formData.append("name", staff.name);
  formData.append("email", staff.email);
  formData.append("cnic", staff.cnic);
  formData.append("phone", staff.phone);
  formData.append("roles", staff.roles);
  formData.append("city_id", staff.city_id);
  formData.append("photo", staff.photo);
  console.log("data",staff, id);
  return axios.post(`${url.ADD_STAFF}/${id}`, formData, {
    headers: getHeader(authHeader()),
    })
    .then(response => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    }) 
    .catch(err => {
      let message;
      if (console.log("django staffffffffffff",err.response && err.response.status)) {
        switch (err.response.status) {
          case 400:
            message = err.response.data;
            break;
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    }, console.log("staff messga e", message));
};
export const updateStaff = staff => {
  let formData = new FormData();
  formData.append("name", staff.name);
  // formData.append("email", staff.email);
  formData.append("cnic", staff.cnic);
  formData.append("phone", staff.phone);
  formData.append("roles", staff.roles);
  // formData.append("city", staff.city);
  // formData.append("territory_office", staff.territory_office);

  return axios.put(`${url.UPDATE_STAFF}/${staff.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const deleteStaff = staff =>
  del(`${url.DELETE_STAFF}/${staff.id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Sample Collector Profile Requests START -------------
export const getSampleCollectorProfile = id =>
  get(`${url.GET_SAMPLE_COLLECTOR_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateSampleCollectorProfile = (sampleCollectorProfile, id) => {
  let formData = new FormData();
  formData.append("account_id", id);
  formData.append("name", sampleCollectorProfile.name);
  formData.append("phone", sampleCollectorProfile.phone);
  // formData.append("", sampleCollectorProfile.roles);

  return axios.put(`${url.UPDATE_SAMPLE_COLLECTOR_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Sample Collector Test Appointment Requests START -------------
export const getSampleCollectionInProcessList = id =>
  get(`${url.GET_SAMPLE_COLLECTION_IN_PROCESS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getSampleCollectionCompletedList = id =>
  get(`${url.GET_SAMPLE_COLLECTION_COMPLETED_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateSampleCollectionStatus = data => {
  let formData = new FormData();
  formData.append("id", data.id);
  formData.append("collection_status", data.collection_status);
  formData.append("payment_method", data.payment_method);
  // formData.append("amount_recieved_by_collector", data.amount_recieved_by_collector);
  formData.append("is_exact_amount_collected", data.is_exact_amount_collected);

  return axios.put(
    `${url.UPDATE_SAMPLE_COLLECTION_STATUS}/${data.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

// ------------- STAFF Requests START -------------
export const getCSRList = () =>
  get(`${url.GET_CSR_LIST}`, {
    headers: getHeader(authHeader()),
  });
  export const getMARKETERSList = () =>
  get(`${url.GET_MARKETERS_LIST}`, {
    headers: getHeader(authHeader()),
  });
export const getAuditorList = () =>
  get(`${url.GET_AUDITOR_LIST}`, {
    headers: getHeader(authHeader()),
  });

export const getFinanceOfficerList = () =>
  get(`${url.GET_FINANCE_OFFICER_LIST}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Registration Admin requests START -------------

export const getPendingCorporate = () =>
  get(`${url.GET_PENDING_CORPORATE}`, {
    headers: getHeader(authHeader()),
  });
  export const getApprovedCorporate = () =>
  get(`${url.GET_APPROVED_CORPORATE}`, {
    headers: getHeader(authHeader()),
  });
  export const getUnapprovedCorporate = () =>
  get(`${url.GET_UNAPPROVED_CORPORATE}`, {
    headers: getHeader(authHeader()),
  });
export const getPendingLabs = () =>
  get(`${url.GET_PENDING_LABS}`, {
    headers: getHeader(authHeader()),
  });

export const getApprovedLabs = () =>
  get(`${url.GET_APPROVED_LABS}`, {
    headers: getHeader(authHeader()),
  });

export const getUnapprovedLabs = () =>
  get(`${url.GET_UNAPPROVED_LABS}`, {
    headers: getHeader(authHeader()),
  });

  export const approveUnapproveCorporate = data => {
    let formData = new FormData();
    formData.append("corporate_id", data.corporate_id);
    formData.append("is_approved", data.isApproved);
  
    return axios.put(`${url.APPROVE_UNAPPROVE_CORPORATE}/${data.id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
export const approveUnapproveLab = data => {
  let formData = new FormData();
  formData.append("lab_id", data.labId);
  formData.append("is_approved", data.isApproved);

  return axios.put(`${url.APPROVE_UNAPPROVE_LAB}/${data.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getPendingB2BClients = () =>
  get(`${url.GET_PENDING_B2B_CLIENTS}`, {
    headers: getHeader(authHeader()),
  });

export const getApprovedB2BClients = () =>
  get(`${url.GET_APPROVED_B2B_CLIENTS}`, {
    headers: getHeader(authHeader()),
  });

export const getUnapprovedB2BClients = () =>
  get(`${url.GET_UNAPPROVED_B2B_CLIENTS}`, {
    headers: getHeader(authHeader()),
  });

export const approveUnapproveB2BClient = data => {
  let formData = new FormData();
  formData.append("b2b_id", data.b2bId);
  formData.append("is_approved", data.isApproved);

  return axios.put(`${url.APPROVE_UNAPPROVE_B2B_CLIENT}/${data.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
// Pending offered test labs list

export const getLabsListPendingFee = ()=>
  get(`${url.GET_LABS_LIST_PENDING_FEE}`, {
    headers: getHeader(authHeader()),
  });
export const getLabsListApprovedFee = ()=>
  get(`${url.GET_LABS_LIST_APPROVED_FEE}`, {
    headers: getHeader(authHeader()),
  });


export const getSharedPercentagePendingFeeTests = id =>
  get(`${url.GET_SHARED_PERCENTAGE_PENDING_FEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getSharedPercentageApprovedFeeTests = id =>
  get(`${url.GET_SHARED_PERCENTAGE_APPROVED_FEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const updateSharedPercentagePendingFeeTest = data => {
    let formData = new FormData();
  
    formData.append("shared_percentage", data.shared_percentage);
  
    return axios.put(`${url.UPDATE_SHARED_PERCENTAGE_PENDING_FEE}/${data.id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
  
export const updateSharedPercentageAllPendingFeeTest = data => {
    let formData = new FormData();
    // formData.append("account_id", id);
    formData.append("shared_percentage", data.shared_percentage);
    // formData.append("shared_percentage", data.shared_percentage);
  
    return axios.put(`${url.UPDATE_SHARED_PERCENTAGE_ALL_PENDING_FEE}/${data.lab_id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };



// ------------- Donors requests START -------------

export const getPendingDonors = () =>
  get(`${url.GET_PENDING_DONORS}`, {
    headers: getHeader(authHeader()),
  });

export const getApprovedDonors = () =>
  get(`${url.GET_APPROVED_DONORS}`, {
    headers: getHeader(authHeader()),
  });

export const getUnapprovedDonors = () =>
  get(`${url.GET_UNAPPROVED_DONORS}`, {
    headers: getHeader(authHeader()),
  });

export const approveUnapproveDonor = data => {
  let formData = new FormData();
  formData.append("donor_id", data.donorId);
  formData.append("is_approved", data.isApproved);

  return axios.put(`${url.APPROVE_UNAPPROVE_DONOR}/${data.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- CSR Admin requests START -------------
export const getPendingComplaints = () =>
  get(`${url.GET_PENDING_COMPLAINTS}`, {
    headers: getHeader(authHeader()),
  });
  export const getPendingComplaintsLabhazir = () =>
  get(`${url.GET_PENDING_COMPLAINTS_LABHAZIR}`, {
    headers: getHeader(authHeader()),
  });
  
export const getInProcessComplaints = () =>
  get(`${url.GET_INPROCESS_COMPLAINTS}`, {
    headers: getHeader(authHeader()),
  });

export const getInProcessComplaintsLabhazir = () =>
  get(`${url.GET_INPROCESS_COMPLAINTS_LABHAZIR }`, {
    headers: getHeader(authHeader()),
  });

export const getResolvedComplaints = () =>
  get(`${url.GET_RESOLVED_COMPLAINTS}`, {
    headers: getHeader(authHeader()),
  });

  export const getResolvedComplaintsLabhazir = () =>
  get(`${url.GET_RESOLVED_COMPLAINTS_LABHAZIR}`, {
    headers: getHeader(authHeader()),
  });

export const assignComplaint = data => {
  let formData = new FormData();
  formData.append("id", data.id);
  // formData.append("office", data.office);
  formData.append("assigned_to", data.assignedTo);
  formData.append("is_it_urgent", data.is_it_urgent);


  return axios.put(`${url.ASSIGN_COMPLAINT}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- CSR Admin requests START -------------
export const getPendingAudits = () =>
  get(`${url.GET_PENDING_AUDITS}`, {
    headers: getHeader(authHeader()),
  });

export const getInProcessAudits = () =>
  get(`${url.GET_INPROCESS_AUDITS}`, {
    headers: getHeader(authHeader()),
  });

export const getPassedAudits = () =>
  get(`${url.GET_PASSED_AUDITS}`, {
    headers: getHeader(authHeader()),
  });
  export const getFailedAudits = () =>
  get(`${url.GET_FAILED_AUDITS}`, {
    headers: getHeader(authHeader()),
  });

export const assignAudit = data => {
  let formData = new FormData();
  formData.append("id", data.id);
  formData.append("assigned_to", data.assignedTo);

  return axios.put(`${url.ASSIGN_AUDIT}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Advertisements Requests START -------------
export const getAdvertisements = () =>
  get(`${url.GET_ADVERTISEMENTS}`, {
    headers: getHeader(authHeader()),
  });

export const getAcceptedLabAdvertisements = () =>
  get(`${url.GET_ACCEPTED_LAB_ADVERTISEMENTS}`, {
    headers: getHeader(authHeader()),
  });

export const addNewAdvertisement = (advertisement, id) => {
  let formData = new FormData();
  formData.append("title", advertisement.title);
  formData.append("poster", advertisement.poster);
  formData.append("posted_at", advertisement.posted_at);
  formData.append("posted_till", advertisement.posted_till);
  // formData.append("region_type", advertisement.region_type);
  // formData.append("province", advertisement.province);
  formData.append("city_id", advertisement.city_id);
  // formData.append("district", advertisement.district);

  console.log("advertisement", advertisement, id)

  return axios.post(`${url.ADD_NEW_ADVERTISEMENT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateAdvertisement = advertisement => {
  let formData = new FormData();
  formData.append("id", advertisement.id);
  formData.append("title", advertisement.title);
  formData.append("poster", advertisement.poster);
  formData.append("posted_at", advertisement.posted_at);
  formData.append("posted_till", advertisement.posted_till);
  // formData.append("region_type", advertisement.region_type);
  // formData.append("province", advertisement.province);
  formData.append("city_id", advertisement.city_id);
  // formData.append("district", advertisement.district);

  return axios.put(
    `${url.UPDATE_ADVERTISEMENT}/${advertisement.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const deleteAdvertisement = advertisement =>
  del(`${url.DELETE_ADVERTISEMENT}/${advertisement.id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Discount LabHazir Requests START -------------
export const getDiscountLabHazirs = id =>
  get(`${url.GET_DISCOUNT_LABHAZIR}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateDiscountLabHazir = data => {
  let formData = new FormData();

  formData.append("discount", data.discount);

  if (data.discount > 0) {
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
  }

  return axios.put(`${url.UPDATE_DISCOUNT_LABHAZIR}/${data.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateDiscountAllLabHazir = data => {
  let formData = new FormData();
  // formData.append("account_id", id);
  formData.append("discount", data.discount);

  if (data.discount > 0) {
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
  }

  return axios.put(`${url.UPDATE_DISCOUNT_ALL_LABHAZIR}/${data.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Discount LabHazir Lab Requests START -------------

export const getLabsList = ()=>
get(`${url.GET_LABS_LIST}`, {
  headers: getHeader(authHeader()),
});
export const getDonorsList = ()=>
get(`${url.GET_DONORS_LIST}`, {
  headers: getHeader(authHeader()),
});
/////////////////////////
export const getLabsLists = ()=>
get(`${url.GET_LABS_LIST}`, {
  headers: getHeader(authHeader()),
});
export const getDonorsLists = ()=>
get(`${url.GET_DONORS_LIST}`, {
  headers: getHeader(authHeader()),
});


export const getClList = () =>
  get(`${url.GET_CL_LIST}`, {
    headers: getHeader(authHeader()),
  })
    .then(response => {
      console.log("Dataaaaaaaaaaaa in helper:", response); // Logging the response data
      return response;
    })
    .catch(error => {
      console.error("Error:", error); // Logging the error
      throw error; // Re-throwing the error for the caller to handle
    });
    
export const getDiscountLabHazirToLabs = id =>
  get(`${url.GET_DISCOUNT_LABHAZIRTOLABS}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const updateDiscountLabHazirToLab = data => {
    let formData = new FormData();
  
    formData.append("discount_by_labhazir", data.discount_by_labhazir);
  
    if (data.discount_by_labhazir > 0) {
      formData.append("start_date_by_labhazir", data.start_date_by_labhazir);
      formData.append("end_date_by_labhazir", data.end_date_by_labhazir);
    }
  
    return axios.put(`${url.UPDATE_DISCOUNT_LABHAZIRTOLAB}/${data.id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
  
export const updateDiscountAllLabHazirToLab = data => {
    let formData = new FormData();
    // formData.append("account_id", id);
    formData.append("discount_by_labhazir", data.discount_by_labhazir);
    // formData.append("shared_percentage", data.shared_percentage);
  
    if (data.discount_by_labhazir > 0) {
      formData.append("start_date_by_labhazir", data.start_date_by_labhazir);
      formData.append("end_date_by_labhazir", data.end_date_by_labhazir);
    }
  
    return axios.put(`${url.UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB}/${data.lab_id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };

// export const getReferrelFeeLabs = id =>
//   get(`${url.GET_REFERREL_FEES}/${id}`, {
//     headers: getHeader(authHeader()),
//   });
// export const getPutReferrelFeeLabs = () =>
//   get(`${url.GET_PUT_REFERREL_FEES}`, {
//     headers: getHeader(authHeader()),
//   });
// Get Nearby Labs

export const getPutReferrelFeeLabs = data => {
  let formData = new FormData();

  formData.append("test_name", data.test_name);

  console.log("In registration admin: ", data)


  return axios.post(`${url.GET_PUT_REFERREL_FEES}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const getReferrelFeeLabs = () =>
  get(`${url.GET_REFERREL_FEES}`, {
    headers: getHeader(authHeader()),
  });
  
export const updateReferrelFeeLab = referrelLabFee => {
    let formData = new FormData();
  
    formData.append("shared_percentage", referrelLabFee.shared_percentage);
  
    return axios.put(`${url.UPDATE_REFERREL_FEE}/${referrelLabFee.id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
export const updateReferrelAllFeeLab = referrelLabFee => {
    let formData = new FormData();
    // formData.append("account_id", id);
    formData.append("shared_percentage", referrelLabFee.shared_percentage);

    return axios.put(`${url.UPDATE_REFERREL_ALL_FEE}/${referrelLabFee.lab_id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
  

//discount lab
export const getDiscountLab = id =>
  get(`${url.GET_DISCOUNT_LAB}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const updateDiscountLab = data => {
  let formData = new FormData();

  formData.append("discount", data.discount);

  if (data.discount > 0) {
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
  }

  return axios.put(`${url.UPDATE_DISCOUNT_LAB}/${data.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateDiscountAllLab = data => {
  let formData = new FormData();
  // formData.append("account_id", id);
  formData.append("discount", data.discount);

  if (data.discount > 0) {
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
  }

  return axios.put(`${url.UPDATE_DISCOUNT_ALL_LAB}/${data.lab_id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Assigned Audits Requests START -------------
export const getAssignedAudits = id =>
  get(`${url.GET_ASSIGNED_AUDITS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateAssignedAudits = data => {
  let formData = new FormData();
  formData.append("audit_report", data.auditReport);
  formData.append("audit_status", data.audit_status);
  formData.append("comment", data.comment);
  console.log("Form data: ", formData);

  return axios.put(`${url.UPDATE_ASSIGNED_AUDITS}/${data.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const getLabAudits = id =>
  get(`${url.GET_LAB_AUDITS}/${id}`, {
    headers: getHeader(authHeader()),
  });

  export const addNewAudit = (audit, id) => {
    let formData = new FormData();
    formData.append("lab_id", audit.lab_id);
    formData.append("reason_of_reaudit", audit.reason_of_reaudit);

    return axios.post(`${url.ADD_NEW_AUDIT}/${id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };

export const getAuditorsCompletedAudits = id =>
  get(`${url.GET_AUDITORS_COMPLETED_AUDITS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getInPayment = id =>
  get(`${url.GET_IN_PAYMENT}/${id}`, {
    headers: getHeader(authHeader()),
  });
// ------------- Lab Advertisements Requests START -------------
export const getLabAdvertisements = id =>
  get(`${url.GET_LAB_ADVERTISEMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewLabAdvertisement = (advertisement, id) => {
  let formData = new FormData();
  formData.append("title", advertisement.title);
  formData.append("poster", advertisement.poster);
  formData.append("posted_at", advertisement.posted_at);
  formData.append("posted_till", advertisement.posted_till);
  // formData.append("region_type", advertisement.region_type);
  // formData.append("province", advertisement.province);
  // formData.append("city_id", advertisement.city_id);

  formData.append("km", advertisement.km);

  console.log("advertisement",advertisement, id)
  // formData.append("amount", advertisement.amount);


  return axios.post(`${url.ADD_NEW_LAB_ADVERTISEMENT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateLabAdvertisement = advertisement => {
  let formData = new FormData();
  formData.append("id", advertisement.id);
  formData.append("title", advertisement.title);
  formData.append("poster", advertisement.poster);
  formData.append("km", advertisement.km);
  formData.append("posted_till", advertisement.posted_till);
  formData.append("posted_at", advertisement.posted_at);
  formData.append("number_of_days", advertisement.number_of_days);
  formData.append("amount", advertisement.amount);

console.log("api helper",advertisement )


  return axios.put(`${url.UPDATE_LAB_ADVERTISEMENT}/${advertisement.id}`,
  formData,
    {
      headers: getHeader(authHeader()),
    }
  )
  };

  export const getB2bClients = () =>
  get(url.GET_B2B_CLIENTS, {
    headers: getHeader(authHeader()),
  });

  // ------------- inPayments Settings Requests START -------------

  export const getAllLabsList = () =>
  get(`${url.GET_ALL_LABS_LIST}`, {
    headers: getHeader(authHeader()),
  });

  export const addNewInPayment = (inPayment, id) => {
    let formData = new FormData();
    formData.append("payment_for", inPayment.payment_for);
    formData.append("lab_id", inPayment.lab_id);
    formData.append("test_appointment_id",   inPayment.test_appointment_id);
    formData.append("donor_id", inPayment.donor_id);
    formData.append("advertisement_id", inPayment.advertisement_id);
    formData.append("payment_method", inPayment.payment_method);
    formData.append("recieved_by", inPayment.recieved_by);
    formData.append("handover_to", inPayment.handover_to);
    formData.append("amount", inPayment.amount);
    formData.append("tax", inPayment.tax);
    formData.append("paid_at", inPayment.paid_at);
    formData.append("cheque_payment_date", inPayment.cheque_payment_date);
    formData.append("cheque_no", inPayment.cheque_no); 
    formData.append("cheque_image", inPayment.cheque_image);
    formData.append("refered_no", inPayment.refered_no);
    formData.append("payment_status", inPayment.payment_status);

    return axios.post(`${url.ADD_NEW_IN_PAYMENT}/${id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };

// ------------- PAYMENT IN STATUS---------------------
export const updatePaymentStatus = paymentStatus => {
  let formData = new FormData();
  formData.append("id", paymentStatus.id);
  formData.append("deposit_at", paymentStatus.deposit_at);
  // formData.append("bankaccount_id", paymentStatus.bankaccount_id);
  // formData.append("deposit_slip", paymentStatus.deposit_slip);
  formData.append("payment_status", paymentStatus.payment_status);
  return axios.put(
    `${url.UPDATE_PAYMENT_STATUS}/${paymentStatus.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const updatePaymentInStatus = paymentInStatus => {
  let formData = new FormData();
  formData.append("is_cleared",  paymentInStatus.is_cleared);
  formData.append("cleared_at",  paymentInStatus.cleared_at);
  formData.append("cheque_image",  paymentInStatus.cheque_image);
  return axios.put(
    `${url.UPDATE_PAYMENTIN_STATUS}/${paymentInStatus.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};
export const updatePaymentInBouncedStatus = paymentInBouncedStatus => {
  let formData = new FormData();
  // formData.append("id", paymentInBouncedStatus.id);
  formData.append("deposited_at", paymentInBouncedStatus.deposited_at);
  formData.append("bankaccount_id", paymentInBouncedStatus.bankaccount_id);
  formData.append("deposit_slip", paymentInBouncedStatus.deposit_slip);
  formData.append("payment_status", paymentInBouncedStatus.payment_status);
  formData.append("verified_by", paymentInBouncedStatus.verified_by);

  console.log("payment in django api helper",paymentInBouncedStatus)
  return axios.put(
    `${url.UPDATE_PAYMENTINBOUNCED_STATUS}/${paymentInBouncedStatus.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

// ------------- Lab Advertisements Requests START -------------
export const deleteLabAdvertisement = advertisement =>
  del(`${url.DELETE_LAB_ADVERTISEMENT}/${advertisement.id}`, {
    headers: getHeader(authHeader()),
  });
export const getPaymentStatuss = id =>
  get(`${url.GET_PAYMENT_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
});
export const getDepositStatuss = id =>
  get(`${url.GET_DEPOSIT_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
});
export const getClearStatuss = id =>
  get(`${url.GET_CLEAR_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
});
export const getPaymentOutClearStatuss = id =>
  get(`${url.GET_PAYMENTOUT_CLEAR_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
});



// ------------- Registration Admin requests START -------------

export const getClearedInPayments = id =>
  get(`${url.GET_CLEARED_IN_PAYMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getApprovedInPayments = id =>
  get(`${url.GET_APPROVED_IN_PAYMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getUnapprovedInPayments = id =>
  get(`${url.GET_UNAPPROVED_IN_PAYMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

  export const updateApproveUnapproveInPayment = data => {
    let formData = new FormData();
    formData.append("id", data.id);
    formData.append("is_approved", data.is_approved);
  
    return axios.put(`${url.UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT}/${data.id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };


// ------------- Advertisement Price List Requests START -------------
export const getAdvertisementPriceLists = () =>
  get(`${url.GET_ADVERTISEMENT_PRICE_LISTS}`, {
    headers: getHeader(authHeader()),
  });

export const addNewAdvertisementPriceList = (advertisementPriceList, id) => {
  let formData = new FormData();
  formData.append("amount", advertisementPriceList.amount);
  formData.append("number_of_days", advertisementPriceList.number_of_days);
  formData.append("entered_at", advertisementPriceList.entered_at);

  return axios.post(`${url.ADD_NEW_ADVERTISEMENT_PRICE_LIST}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Donation Appointments
export const getAllDonationAppointments = id =>
  get(`${url.GET_ALL_DONATION_APPOINTMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });


// BANK ACCOUNTS
export const getBankaccounts = id =>
  get(`${url.GET_BANKACCOUNTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateBankaccount = bankAccount => {
  let formData = new FormData();
  formData.append("id", bankAccount.id);
  formData.append("account_no", bankAccount.account_no);
  formData.append("status", bankAccount.status);

  return axios.put(`${url.UPDATE_BANKACCOUNT}/${bankAccount.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// export const deleteBankaccount = pathologist =>
//   del(`${url.DELETE_BANKACCOUNT}/${pathologist.id}`, {
//     headers: getHeader(authHeader()),
//   });

export const getOutPayment = id =>
get(`${url.GET_OUT_PAYMENT}/${id}`, {
  headers: getHeader(authHeader()),
});
export const getLabsMof = ()=>
get(`${url.GET_LABS_MOF}`, {
  headers: getHeader(authHeader()),
});

export const getLabsc = id =>
  get(`${url.GET_LABS_C}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getListDonationAppointment = ()=>
get(`${url.GET_LIST_DONATIONAPPOINTMENT}`, {
  headers: getHeader(authHeader()),
});

export const getListCLabs = ()=>
get(`${url.GET_LIST_CLABS}`, {
  headers: getHeader(authHeader()),
});

export const getListInvoice = ()=>
get(`${url.GET_LIST_INVOICE}`, {
  headers: getHeader(authHeader()),
});

// ------------- inPayments Settings Requests START -------------
export const addNewOutPayment = ( outPayment, id) => {
  let formData = new FormData();
  formData.append("payment_for",  outPayment.payment_for);
  formData.append("transection_type", outPayment.transection_type);
  formData.append("lab_id",   outPayment.lab_id);
  formData.append("test_appointment_id",   outPayment.test_appointment_id);
  formData.append("b2b_id",   outPayment.b2b_id);
  formData.append("payment_method",   outPayment.payment_method);
  formData.append("bankaccount_id",   outPayment.bankaccount_id);
  formData.append("tax", outPayment.tax);
  formData.append("amount",   outPayment.amount);
  formData.append("payment_at",  outPayment.payment_at);
  formData.append("cheque_no",  outPayment.cheque_no);
  formData.append("deposit_copy",   outPayment.deposit_copy);
  formData.append("refered_no",   outPayment.refered_no);
  formData.append("status",   outPayment.status);
  // formData.append("is_cleared",  outPayment.is_cleared);
  // formData.append("cleared_at",   outPayment.cleared_at);
  formData.append("comments",  outPayment.comments);

  console.log("django api helper", outPayment, id)


  return axios.post(`${url.ADD_NEW_OUT_PAYMENT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const addNewCorporatePayment = ( outPayment, id) => {
  let formData = new FormData();
  formData.append("payment_for",  outPayment.payment_for);
  formData.append("lab_id",   outPayment.lab_id);
  formData.append("test_appointment_id",   outPayment.test_appointment_id);
  formData.append("payment_method",   outPayment.payment_method);
  formData.append("tax", outPayment.tax);
  formData.append("amount",   outPayment.amount);
  formData.append("payment_at",  outPayment.payment_at);
  formData.append("cheque_no",  outPayment.cheque_no);
  formData.append("cheque_image",   outPayment.cheque_image);
  formData.append("payment_status",   outPayment.payment_status);
  // formData.append("is_cleared",  outPayment.is_cleared);
  // formData.append("cleared_at",   outPayment.cleared_at);
  formData.append("comments",  outPayment.comments);

  console.log("django api helper", outPayment, id)


  return axios.post(`${url.ADD_NEW_CORPORATE_PAYMENT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// update corporate out payment
export const updatePaymentOutCCreatedStatuss = paymentOutCreatedStatuss => {
  let formData = new FormData();
  // formData.append("payment_for",  paymentOutCreatedStatuss.payment_for);
  // formData.append("lab_id",   paymentOutCreatedStatuss.lab_id);
  // formData.append("b2b_id",   paymentOutCreatedStatuss.b2b_id);
  // formData.append("test_appointment_id",   paymentOutCreatedStatuss.test_appointment_id);
  // formData.append("tax", paymentOutCreatedStatuss.tax);
  formData.append("amount",   paymentOutCreatedStatuss.amount);
  formData.append("cheque_no",  paymentOutCreatedStatuss.cheque_no);
  formData.append("payment_at",  paymentOutCreatedStatuss.payment_at);
  formData.append("cheque_image",   paymentOutCreatedStatuss.cheque_image);
  formData.append("payment_method",   paymentOutCreatedStatuss.payment_method);
  // formData.append("bankaccount_id",   paymentOutCreatedStatuss.bankaccount_id);
  // formData.append("bank_id",   paymentOutCreatedStatuss.bank_id);
  // formData.append("refered_no",   paymentOutCreatedStatuss.refered_no);
  // formData.append("cleared_at",   paymentOutCreatedStatuss.cleared_at);
  formData.append("payment_status",  paymentOutCreatedStatuss.payment_status);
  formData.append("comments",  paymentOutCreatedStatuss.comments);

  return axios.put(
    `${url.UPDATE_PAYMENTOUTCCREATED_STATUS}/${paymentOutCreatedStatuss.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

// ------------- invoice adjustment Settings Requests START -------------
export const addNewInvoiceAdjustment = ( outPayment, id) => {
  let formData = new FormData();
  formData.append("invoice_id", outPayment.invoice_id);
  formData.append("tax", outPayment.tax);
  formData.append("total_adjustment", outPayment.total_adjustment);
  formData.append("price_discount", outPayment.price_discount);
  formData.append("others", outPayment.others);
  formData.append("status", outPayment.status);
  formData.append("comments", outPayment.comments);

  console.log("django api helper", outPayment, id)


  return axios.post(`${url.ADD_NEW_INVOICE_ADJUSTMENT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Bank Transfer Payments Settings Requests START -------------
export const addNewBankTransfer = ( bankTransfer, id) => {
  let formData = new FormData();
  formData.append("transfer_type",  bankTransfer.transfer_type);
  formData.append("mode",   bankTransfer.mode);
  formData.append("deposit_type",   bankTransfer.deposit_type);
  formData.append("withdraw_type", bankTransfer.withdraw_type)
  formData.append("amount",   bankTransfer.amount);
  formData.append("bankaccount_id",   bankTransfer.bankaccount_id);
  formData.append("from_bankaccount_id",   bankTransfer.from_bankaccount_id);
  formData.append("deposit_copy",   bankTransfer.deposit_copy);
  formData.append("payment_copy",  bankTransfer.payment_copy);
  formData.append("cheque_no",  bankTransfer.cheque_no);
  formData.append("clearence_datetime",   bankTransfer.clearence_datetime);
  formData.append("deposit_datetime",   bankTransfer.deposit_datetime);
  formData.append("payment_datetime",   bankTransfer.payment_datetime);
  formData.append("status",  bankTransfer.status);
  formData.append("comments",  bankTransfer.comments);

  console.log("django api helper", bankTransfer, id)


  return axios.post(`${url.ADD_NEW_BANK_TRANSFER}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getBankTransfer = id =>
get(`${url.GET_BANK_TRANSFER}/${id}`, {
  headers: getHeader(authHeader()),
});

export const updateBankTransfer = bankTransfer => {
  let formData = new FormData();
  formData.append("clearence_datetime",  bankTransfer.clearence_datetime);
  return axios.put(
    `${url.UPDATE_BANK_TRANSFER}/${bankTransfer.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};


export const getPaymentOutStatuss = id =>
  get(`${url.GET_PAYMENTOUT_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getBouncedStatuss = id =>
  get(`${url.GET_BOUNCED_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getBouncedInStatuss = id =>
  get(`${url.GET_BOUNCEDIN_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
  });

// corporate out payment 
// export const getCCreatedOutStatuss = id =>
//   get(`${url.GET_CCREATEDOUT_STATUSS}/${id}`, {
//     headers: getHeader(authHeader()),
//   });
export const getCCreatedOutStatuss = id =>
  get(`${url.GET_CCREATEDOUT_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
  })
  .then(response => {
    console.log("api response is :" ,response); // Log the response to the console
    return response; // Optionally return the response if needed
  })
  .catch(error => {
    console.error('Error fetching API:', error); // Log any errors to the console
    throw error; // Optionally rethrow the error if needed
  });

export const getCreatedOutStatuss = id =>
  get(`${url.GET_CREATEDOUT_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
  });
// ------------- PAYMENT IN STATUS---------------------
export const updatePaymentOutStatus = paymentOutStatus => {
  let formData = new FormData();
  formData.append("is_cleared",  paymentOutStatus.is_cleared);
  formData.append("cleared_at",  paymentOutStatus.cleared_at);
  return axios.put(
    `${url.UPDATE_PAYMENTOUT_STATUS}/${paymentOutStatus.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const updatePaymentOutCreatedStatuss = paymentOutCreatedStatuss => {
  let formData = new FormData();
  // formData.append("payment_for",  paymentOutCreatedStatuss.payment_for);
  // formData.append("lab_id",   paymentOutCreatedStatuss.lab_id);
  // formData.append("b2b_id",   paymentOutCreatedStatuss.b2b_id);
  formData.append("amount",   paymentOutCreatedStatuss.amount);
  formData.append("cheque_no",  paymentOutCreatedStatuss.cheque_no);
  formData.append("payment_at",  paymentOutCreatedStatuss.payment_at);
  formData.append("deposit_copy",   paymentOutCreatedStatuss.deposit_copy);
  formData.append("payment_method",   paymentOutCreatedStatuss.payment_method);
  // formData.append("bankaccount_id",   paymentOutCreatedStatuss.bankaccount_id);
  // formData.append("bank_id",   paymentOutCreatedStatuss.bank_id);
  // formData.append("refered_no",   paymentOutCreatedStatuss.refered_no);
  // formData.append("cleared_at",   paymentOutCreatedStatuss.cleared_at);
  formData.append("status",  paymentOutCreatedStatuss.status);
  formData.append("comments",  paymentOutCreatedStatuss.comments);

  return axios.put(
    `${url.UPDATE_PAYMENTOUTCREATED_STATUS}/${paymentOutCreatedStatuss.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};
    
export const updateAdvertisementPriceList = advertisementPriceList => {
  let formData = new FormData();
  formData.append("amount", advertisementPriceList.amount);
  formData.append("number_of_days", advertisementPriceList.number_of_days);
  formData.append("entered_at", advertisementPriceList.entered_at);

  return axios.put(
    `${url.UPDATE_ADVERTISEMENT_PRICE_LIST}/${advertisement.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const deleteAdvertisementPriceList = advertisementPriceList =>
  del(`${url.DELETE_ADVERTISEMENT_PRICE_LIST}/${advertisementPriceList.id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Lab Advertisements Requests TO labhazir START -------------
export const getLabAdvertisementRequests = id =>
  get(`${url.GET_LAB_ADVERTISEMENT_REQUESTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateLabAdvertisementRequest = advertisement => {
  let formData = new FormData();
   formData.append("id", advertisement.id);
  formData.append("request_status", advertisement.request_status);
  formData.append("declined_reason", advertisement.declined_reason);
  formData.append("responded_at", advertisement.responded_at);

  console.log("django api helper", advertisement)

  return axios.put(
    `${url.UPDATE_LAB_ADVERTISEMENT_REQUEST}/${advertisement.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const deletePaymentout = paymentout =>
  del(`${url.DELETE_PAYMENTOUT}/${paymentout.id}`, {
    headers: getHeader(authHeader()),
  });


// ------------- Accepeted Lab Advertisements Requests TO labhazir START -------------
export const getLabAdvertisementRequestsAccepted= () =>
  get(`${url.GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Advertisements Live START -------------
export const getAdvertisementLives=() =>
  get(`${url.GET_ADVERTISEMENT_LIVES}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Advertisements Live START -------------
// export const getAdvLive=() =>
//   get(`${url.GET_ADV_LIVE}`, {
//     headers: getHeader(authHeader()),
//   });
// Get Region Wise Advertisement
export const getAdvLive = locationDetails => {
  let formData = new FormData();
  formData.append("latitude", locationDetails.latitude);
  formData.append("longitude", locationDetails.longitude);
  formData.append("search_type", locationDetails.search_type);
  formData.append("address", locationDetails.address);
  formData.append("city", locationDetails.city);

  console.log("labhaziradvLives: ", locationDetails)


  return axios.post(`${url.GET_ADV_LIVE}`, formData, {
    headers: getHeader(authHeader()),
  });
};

//------------ Get Advertisement Invoice Detail-------------
export const getAdvInvoice = id =>
  get(`${url.GET_ADV_INVOICE}/${id}`, {
    headers: getHeader(authHeader()),
  },
  console.log(id)
);

//------------ Get Territories List-------------
  export const getTerritoriesList = ()=>
  get(`${url.GET_TERRITORIES_LIST}`, {
    headers: getHeader(authHeader()),
  });

//------------ Get Territories List-------------
export const getCorporatesList = ()=>
get(`${url.GET_CORPORATES_LIST}`, {
  headers: getHeader(authHeader()),
});

//------------ Get Names List-------------
  export const getLabNamesList = ()=>
  get(`${url.GET_LAB_NAMES_LIST}`, {
    headers: getHeader(authHeader()),
  });


//------------ Get Medical Test List-------------
export const onlyMedicalTestList = ()=>
get(`${url.GET_ONLY_MEDICAL_LIST}`, {
  headers: getHeader(authHeader()),
});


//------------ Get CSR Central Territories List-------------
export const getCsrCentralList = ()=>
get(`${url.GET_CSR_CENTRAL_TERRITORY_LIST}`, {
  headers: getHeader(authHeader()),
});

//------------ Get CSR SOUTH Territories List-------------
export const getCsrSouthList = ()=>
get(`${url.GET_CSR_SOUTH_TERRITORY_LIST}`, {
  headers: getHeader(authHeader()),
});

//------------ Get CSR NORTH Territories List-------------
export const getCsrNorthList = ()=>
get(`${url.GET_CSR_NORTH_TERRITORY_LIST}`, {
  headers: getHeader(authHeader()),
});

//------------ Get AUDITOR Central Territories List-------------
export const getAuditorCentralList = ()=>
get(`${url.GET_AUDITOR_CENTRAL_TERRITORY_LIST}`, {
  headers: getHeader(authHeader()),
});

//------------ Get Auditor SOUTH Territories List-------------
export const getAuditorSouthList = ()=>
get(`${url.GET_AUDITOR_SOUTH_TERRITORY_LIST}`, {
  headers: getHeader(authHeader()),
});

//------------ Get Auditor NORTH Territories List-------------
export const getAuditorNorthList = ()=>
get(`${url.GET_AUDITOR_NORTH_TERRITORY_LIST}`, {
  headers: getHeader(authHeader()),
});