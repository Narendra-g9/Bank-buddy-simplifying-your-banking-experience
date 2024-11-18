import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import api from "../../api/Api";
import { useState } from "react";
import ForgetPassword from "../from/ForgetPassword";

const Login = () => {
  const addForm = useForm();
  const navigate = useNavigate();

  const handleSubmit = addForm.handleSubmit(async (data) => {
    try {
      const response = await api.post("user/login", {
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("role", response.data.role);

      navigate("/user");
      toast.success("Login Successful");
    } catch (error) {
      console.error(error);
      toast.error("Login Failed. Please check your credentials.");
    }
  });

  const [forgetModalPassword, setForgetModalPassword] = useState(false);

  const toggleModal = () => {
    setForgetModalPassword(!forgetModalPassword);
  };

  return (
    <>
      <div>
        {/* <Navbar /> */}
        <div>
          <div className="py-6">
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
                  YourBank
                </h2>
                <p className="text-xl text-gray-600 text-center">
                  Welcome back!
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="border-b w-1/5 lg:w-1/4" />
                  <a
                    href="#"
                    className="text-xs text-center text-gray-500 uppercase"
                  >
                    Login with Email
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

                <div className="mt-4 flex items-center justify-between">
                  <span className="border-b w-1/5 md:w-1/4" />
                  <Link
                    to="/register"
                    className="text-xs text-gray-500 uppercase"
                  >
                    or sign up
                  </Link>
                  <span className="border-b w-1/5 md:w-1/4" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="border-b w-1/5 md:w-1/4" />
                  <p
                    className="text-xs text-gray-500 uppercase cursor-pointer"
                    onClick={toggleModal}
                  >
                    Forget Password
                  </p>
                  <span className="border-b w-1/5 md:w-1/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {forgetModalPassword && <ForgetPassword close={toggleModal} />}
    </>
  );
};

export default Login;
