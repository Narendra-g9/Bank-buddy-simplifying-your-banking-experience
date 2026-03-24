import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "../../api/Api";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const addForm = useForm();
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = addForm.handleSubmit(async (data) => {
    try {
      const response = await api.post("admin/login", {
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("role", response.data.role);

      window.location.href = "admin";
      toast.success("Login Successful");
    } catch (error) {
      console.log(error);
      toast.error("Login Failed");
    }
  });

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      const response = await api.post("admin/forgotpassword", { email });
      toast.success("OTP sent to your email");
      setOtpSent(true);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || "Failed to send OTP");
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await api.post("admin/resetpassword", {
        email,
        otp,
        newPassword,
      });
      toast.success(response.data.msg);
      setForgotPasswordMode(false);
      setOtpSent(false);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || "Failed to reset password");
    }
  };

  if (forgotPasswordMode) {
    return (
      <div className="flex h-screen items-center">
        <div className="py-6 w-full">
          <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
            <div
              className="hidden lg:block lg:w-1/2 bg-cover"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80")',
              }}
            />
            <div className="w-full p-8 lg:w-1/2">
              <h2 className="text-2xl font-semibold text-gray-700 text-center">
                Reset Password
              </h2>
              <p className="text-lg text-gray-600 text-center">Admin Account</p>

              <div className="mt-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              {!otpSent ? (
                <div className="mt-8">
                  <button
                    onClick={handleForgotPassword}
                    className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
                  >
                    Send OTP
                  </button>
                  <button
                    onClick={() => setForgotPasswordMode(false)}
                    className="bg-gray-400 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-500 mt-3"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <>
                  <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      OTP
                    </label>
                    <input
                      className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      New Password
                    </label>
                    <input
                      className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Confirm Password
                    </label>
                    <input
                      className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                    />
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={handleResetPassword}
                      className="bg-green-600 text-white font-bold py-2 px-4 w-full rounded hover:bg-green-700"
                    >
                      Reset Password
                    </button>
                    <button
                      onClick={() => {
                        setForgotPasswordMode(false);
                        setOtpSent(false);
                        setEmail("");
                        setOtp("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                      className="bg-gray-400 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-500 mt-3"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center">
      <div className="py-6 w-full">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
          <div
            className="hidden lg:block lg:w-1/2 bg-cover"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80")',
            }}
          />
          <div className="w-full p-8 lg:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-700 text-center">
              Admin
            </h2>
            <p className="text-xl text-gray-600 text-center">Welcome back!</p>

            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4" />
              <a
                href="#"
                className="text-xs text-center text-gray-500 uppercase"
              >
                login with Email
              </a>
              <span className="border-b w-1/5 lg:w-1/4" />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="email"
                {...addForm.register("email", { required: true })}
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordMode(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="password"
                {...addForm.register("password", { required: true })}
              />
            </div>
            <div className="mt-8">
              <button
                onClick={handleSubmit}
                className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
