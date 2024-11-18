import { useEffect, useState } from "react";
import api from "../../api/Api";

// Dummy data (BankAccount)
const ViewProfile = () => {
  const [personalDetails, setPersonalDetails] = useState();

  const fetchUser = async () => {
    try {
      const res = await api.get(`getprofileaccount`);
      let response = res.data.userDetails;
      setPersonalDetails(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="">
      {/* <button className=' text-xl font-serif items-end justify-end h-10 border rounded-lg bg-blue-500 text-white p-1 absolute right-7 '>Download Statement</button> */}
      <div className="max-w-lg mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">View Profile</h2>
        <div className="flex justify-center mb-6">
          <div className="flex justify-center">
            {personalDetails && (
              <div className="">
                <h3 className="text-xl font-semibold mb-2">Personal Details</h3>
                <div className="mb-4 ">
                  <p>
                    <strong>First Name:</strong> {personalDetails.accUser.firstname}
                  </p>
                  <p>
                    <strong>Last Name:</strong> {personalDetails.accUser.lastname}
                  </p>
                  <p>
                    <strong>Email:</strong> {personalDetails.accUser.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {personalDetails.accUser.phoneNumber}
                  </p>
                  <p>
                    <strong>Address:</strong> {personalDetails.accUser.address}
                  </p>
                  {/* <p><strong>Date of Birth:</strong> {personalDetails?.dateOfBirth}</p> */}
                </div>

                <h3 className="text-xl font-semibold mb-2">Bank Details</h3>
                <div>
                  {/* <p>
                    <strong>Account Holder:</strong>
                    {personalDetails.accUser.firstname} {personalDetails.accUser.lastname}
                  </p> */}
                  <p>
                    <strong>Account Number:</strong> {personalDetails.accNumber}
                  </p>
                  {/* <p><strong>Bank Name:</strong> {personalDetails.bankName}</p> */}
                  {/* <p><strong>IFSC Code:</strong> {personalDetails.ifscCode}</p> */}
                </div>
                <img
                  src={personalDetails.qrCode}
                  alt="Profile"
                  className="rounded-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
