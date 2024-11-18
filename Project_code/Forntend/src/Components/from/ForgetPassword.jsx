import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../api/Api";
import { toast } from "react-toastify";

const ForgetPassword = ({ close }) => {
  const addForm = useForm();
  const [Password, setPassword] = useState(false);
  const [TimeOut, setTimeOut] = useState(60);

  const OTPFun = async () => {
    addForm.trigger();

    const value = addForm.getValues("email");
    if (value.trim() === "") {
      return;
    }

    try {
      await api.post("sendotp", { email: value });
      Timer();
      setPassword(true);
      toast.success("OTP sent successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "An error occurred");
    }
  };

  const Timer = () => {
    let time = 60;
    const interval = setInterval(() => {
      const counter = time - 1;
      time = counter;
      setTimeOut(counter);

      if (counter <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const ChangePassword = addForm.handleSubmit(async () => {
    try {
      const email = addForm.getValues("email");
      const otp = addForm.getValues("OTP");
      const password = addForm.getValues("Password");

      await api.post("otpverify", { email, otp, password });
      toast.success("Password change successful");
      close();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "An error occurred");
    }
  });

  return (
    <div className="fixed top-0 w-screen h-full bg-[#000000ad] left-0 z-[1000] component-form">
      <div className="flex justify-center items-center w-screen h-screen">
        <form
          className="mx-auto md:w-1/3 w-[95%] p-10 max-h-[95%] overflow-y-scroll bg-white"
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <p className="flex justify-end text-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              onClick={close}
              className="cursor-pointer"
              fill="red"
            >
              <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
            </svg>
          </p>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              {...addForm.register("email", {
                required: "Email is required",
              })}
              required
              disabled={Password}
            />
            {addForm.formState.errors.email?.message && (
              <p className="text-red-700 font-[500]">
                {addForm.formState.errors.email?.message}
              </p>
            )}
          </div>

          {!Password && (
            <button
              className="bg-blue-600 text-white font-bold p-2 rounded"
              type="button"
              onClick={OTPFun}
            >
              Get OTP
            </button>
          )}

          {Password && (
            <>
              <div className="mb-5">
                <label
                  htmlFor="OTP"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  OTP
                </label>
                <input
                  type="number"
                  id="OTP"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  {...addForm.register("OTP", {
                    required: "OTP is required",
                  })}
                  required
                />
                {addForm.formState.errors.OTP?.message && (
                  <p className="text-red-700 font-[500]">
                    {addForm.formState.errors.OTP?.message}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="Password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="Password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  {...addForm.register("Password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  required
                />
                {addForm.formState.errors.Password?.message && (
                  <p className="text-red-700 font-[500]">
                    {addForm.formState.errors.Password?.message}
                  </p>
                )}
              </div>

              <p className="text-sm font-semibold my-3">
                OTP will expire in <span>{TimeOut}</span>s{" "}
                {TimeOut === 0 && (
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={OTPFun}
                  >
                    Resend OTP
                  </span>
                )}
              </p>

              <button
                className="bg-blue-600 text-white font-bold p-2 rounded"
                type="button"
                onClick={ChangePassword}
              >
                Submit
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
