import React, { useEffect, useState } from "react";
import api from "../../api/Api";

const ViewUsers = () => {
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users
  const usersFun = async () => {
    try {
      const res = await api.get("getallusers");
      setUserData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Filter users based on search term
  const filteredUsers = userData.filter((user) => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    usersFun();
  }, []);

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 text-center uppercase font-serif ">
          View Users
        </h2>

        {/* Search Input */}
        <div className="mt-4 mb-6">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-4 w-56 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* User Table */}
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2">First Name</th>
              <th className="border border-gray-200 p-2">Last Name</th>
              <th className="border border-gray-200 p-2">Other Name</th>
              <th className="border border-gray-200 p-2">Gender</th>
              <th className="border border-gray-200 p-2">Address</th>
              <th className="border border-gray-200 p-2">State of Origin</th>
              <th className="border border-gray-200 p-2">Email</th>
              <th className="border border-gray-200 p-2">Phone Number</th>
              <th className="border border-gray-200 p-2">Alternative Phone</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-200 p-2">{user.firstname}</td>
                  <td className="border border-gray-200 p-2">{user.lastname}</td>
                  <td className="border border-gray-200 p-2">{user.otherName || "-"}</td>
                  <td className="border border-gray-200 p-2">{user.gender}</td>
                  <td className="border border-gray-200 p-2">{user.address}</td>
                  <td className="border border-gray-200 p-2">{user.stateofOrigin}</td>
                  <td className="border border-gray-200 p-2">{user.email}</td>
                  <td className="border border-gray-200 p-2">{user.phoneNumber}</td>
                  <td className="border border-gray-200 p-2">{user.alternativePhoneNumber || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="border border-gray-200 p-2 text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewUsers;
