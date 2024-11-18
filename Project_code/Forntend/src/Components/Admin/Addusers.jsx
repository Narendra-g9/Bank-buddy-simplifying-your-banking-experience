import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../api/Api";
import { toast } from "react-toastify";

// Validation schema
const schema = yup.object().shape({
  firstname: yup.string().required("First name is required"),
  lastname: yup.string().required("Last name is required"),
  otherName: yup.string().nullable(),
  gender: yup.string().required("Gender is required"),
  address: yup.string().required("Address is required"),
  stateofOrigin: yup.string().required("State of Origin is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  alternativePhoneNumber: yup.string().nullable(),
});

const Addusers = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post("user/register", data);
      toast.success("Registration Successful");
      reset();
    } catch (error) {
      console.log(error);
    }
    // Perform your form submission logic here
  };

  return (
    <div className="py-6">
      <div className="flex justify-center bg-white rounded-lg-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div className="w-full p-8 lg:w-3/4">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            Add User
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-3">
              {/* First Name */}
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  First Name
                </label>
                <input
                  {...register("firstname")}
                  className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${
                    errors.firstname ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 px-4 block w-full appearance-none`}
                />
                {errors.firstname && (
                  <p className="text-red-500 text-sm">
                    {errors.firstname.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Last Name
                </label>
                <input
                  {...register("lastname")}
                  className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${
                    errors.lastname ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 px-4 block w-full appearance-none`}
                />
                {errors.lastname && (
                  <p className="text-red-500 text-sm">
                    {errors.lastname.message}
                  </p>
                )}
              </div>

              {/* Other Name */}
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Other Name
                </label>
                <input
                  {...register("otherName")}
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none"
                />
              </div>

              {/* Gender */}
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Gender
                </label>
                <select
                  {...register("gender")}
                  className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${
                    errors.gender ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 px-4 block w-full appearance-none`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Address
                </label>
                <input
                  {...register("address")}
                  className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 px-4 block w-full appearance-none`}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* State of Origin */}
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  State of Origin
                </label>
                <input
                  {...register("stateofOrigin")}
                  className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${
                    errors.stateofOrigin ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 px-4 block w-full appearance-none`}
                />
                {errors.stateofOrigin && (
                  <p className="text-red-500 text-sm">
                    {errors.stateofOrigin.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 px-4 block w-full appearance-none`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  {...register("password")}
                  type="password"
                  className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 px-4 block w-full appearance-none`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Phone Number
                </label>
                <input
                  {...register("phoneNumber")}
                  className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 px-4 block w-full appearance-none`}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Alternative Phone Number */}
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Alternative Phone Number
                </label>
                <input
                  {...register("alternativePhoneNumber")}
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none"
                />
              </div>

              {/* Submit Button */}
              <div className="mt-8 col-span-2">
                <button className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded-lg hover:bg-gray-600">
                  Add Users
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addusers;
