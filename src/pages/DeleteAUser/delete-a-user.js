import React, { useState } from 'react';
import axios from 'axios';

const DeleteAccountRequest = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setError('');
     const account_id = localStorage.getItem("authUser")
    ? JSON.parse(localStorage.getItem("authUser")).user_id
    : "";
    console.log('Account ID:', account_id); // ✅ This will print the user ID

    if (!account_id) {
      setError('Account ID not found.');
      return;
    }

    try {
      await axios.post('https://labhazirapi.com/api/patient/delete-account-request-email', {
        account_id,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to send request. Please try again.');
    }
  };


  return (
    <div className="page-content flex flex-col items-center justify-center h-screen px-4">
      {!submitted ? (
        <>
        <h2 className="text-2xl font-bold mb-6">
            Request for Delete Account
          </h2>
          <p className="font-size-12"> By clicking confirm, your request will be sent to our admin. You will be notified once it is reviewed.</p>
          <h6 className="text-2xl font-bold mb-6 text-left">
            Are you sure you want to delete your account?
          </h6>

          {error && <p className="text-danger font-size-12">{error}</p>}
           <br>
           </br>
          <div className="d-flex justify-content-center">
            <button
              onClick={handleConfirm}
              className="btn btn-primary btn-responsive"
            >
              Confirm Delete Request
            </button>
          </div>
        </>
      ) : (
        <h2 className="text-xl font-semibold text-green-700 text-center">
          Your request has been sent. The admin will contact you shortly.
        </h2>
      )}
    </div>
  );
};

export default DeleteAccountRequest;
