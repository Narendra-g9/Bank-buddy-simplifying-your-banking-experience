// src/components/HomePage.js

import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import api from "../../api/Api";

const HomePage = () => {
  const [activeItem, setActiveItem] = useState("");

  const [EmailData, setEmailData] = useState<string>("");
  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    let role = localStorage.getItem("role");

    if (role !== "2") {
      navigate("/");
    }
  }, []);
  const menuItems = [
    {
      name: "Transactions",
      id: "transactions",
      path: "transactions",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="M240-80q-50 0-85-35t-35-85v-120h120v-560l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-560H320v440h360v120q0 17 11.5 28.5T720-160ZM360-600v-80h240v80H360Zm0 120v-80h240v80H360Zm320-120q-17 0-28.5-11.5T640-640q0-17 11.5-28.5T680-680q17 0 28.5 11.5T720-640q0 17-11.5 28.5T680-600Zm0 120q-17 0-28.5-11.5T640-520q0-17 11.5-28.5T680-560q17 0 28.5 11.5T720-520q0 17-11.5 28.5T680-480ZM240-160h360v-80H200v40q0 17 11.5 28.5T240-160Zm-40 0v-80 80Z" />
        </svg>
      ),
    },

    {
      name: "View",
      id: "view",
      path: "view",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-480H200v480Zm80-280v-80h400v80H280Zm0 160v-80h240v80H280Z" />
        </svg>
      ),
    },

    {
      name: "Debit Card",
      id: "Customer-Debit",
      path: "Customer-Debit",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          fill="currentcolor"
          width="20px"
          height="24px"
        >
          <path d="M512 80c8.8 0 16 7.2 16 16l0 32L48 128l0-32c0-8.8 7.2-16 16-16l448 0zm16 144l0 192c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16l0-192 480 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24l48 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0z" />
        </svg>
      ),
    },
    {
      name: "Loan",
      id: "loan",
      path: "/user/load",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="24px"
          height="24px"
          x="0"
          y="0"
          viewBox="0 0 511.983 511.983"
          fill="currentColor"
        >
          <g>
            <path
              d="M282.895 216.928c7.262 0 13.169 4.947 13.169 11.027 0 5.522 4.478 10 10 10s10-4.478 10-10c0-13.849-9.752-25.606-23.169-29.583v-1.39c0-5.522-4.478-10-10-10s-10 4.478-10 10v1.39c-13.417 3.978-23.168 15.734-23.168 29.583 0 17.108 14.879 31.026 33.168 31.026 7.262 0 13.169 4.947 13.169 11.027s-5.907 11.026-13.169 11.026c-7.261 0-13.168-4.946-13.168-11.026 0-5.522-4.478-10-10-10s-10 4.478-10 10c0 13.849 9.751 25.605 23.168 29.582v1.39c0 5.522 4.478 10 10 10s10-4.478 10-10v-1.39c13.417-3.977 23.169-15.733 23.169-29.582 0-17.108-14.88-31.027-33.169-31.027-7.261 0-13.168-4.946-13.168-11.026s5.907-11.027 13.168-11.027z"
              fill="white"
              opacity="1"
              data-original="white"
              className=""
            ></path>
            <path
              d="M510.478 334.046a38.183 38.183 0 0 0-28.795-26.813c-8.863-1.887-18.081-.51-25.953 3.674 4.558-28.345 2.164-57.666-7.215-84.997-1.793-5.224-7.482-8.001-12.705-6.213-5.224 1.793-8.005 7.481-6.213 12.705 11.078 32.277 11.168 67.685.315 100.001l-79.691 70.777a80.362 80.362 0 0 1-16.04 11.074 38.43 38.43 0 0 0-.436-20.09 38.462 38.462 0 0 0-20.244-23.766l-70.596-33.813c-30.864-14.783-66.988-16.493-99.11-4.7l-7.176 2.635c-19.918-56.267-6.054-118.668 36.6-161.321l70.598-70.597h78.157l59.817 59.817c3.906 3.904 10.236 3.904 14.143 0 3.905-3.905 3.905-10.237 0-14.143L338.78 91.125l20.661-59.458c2.77-7.971-.289-16.667-7.439-21.149-7.148-4.481-16.31-3.442-22.277 2.522l-.123.123c-4.133 4.135-10.861 4.135-14.994 0-17.551-17.549-46.106-17.549-63.657 0-2.002 2.003-4.665 3.105-7.497 3.105s-5.495-1.103-7.497-3.105c-5.973-5.973-15.14-7.007-22.294-2.512-7.153 4.494-10.2 13.202-7.409 21.176l20.751 59.304-67.928 67.927c-25.139 25.14-41.85 56.836-48.324 91.661-5.679 30.54-3.219 61.681 7.076 90.702l-15.765 5.788c-5.246-6.82-13.481-11.228-22.73-11.228H28.667C12.86 335.982 0 348.842 0 364.648v118.666c0 15.807 12.86 28.667 28.667 28.667h263.564c41.398 0 80.547-15.89 110.234-44.743l97.919-95.165a38.18 38.18 0 0 0 10.094-38.027zM243.453 36.269c8.174 0 15.859-3.183 21.64-8.963 9.752-9.752 25.62-9.752 35.372 0 5.78 5.78 13.466 8.963 21.64 8.963 5.804 0 11.36-1.604 16.164-4.604l-17.7 50.938H245.21l-17.798-50.862c4.776 2.95 10.286 4.528 16.041 4.528zM20 483.315V364.648c0-4.779 3.888-8.667 8.667-8.667h50.666c4.779 0 8.667 3.888 8.667 8.667v118.666c0 4.779-3.888 8.667-8.667 8.667H28.667c-4.779.001-8.667-3.887-8.667-8.666zm466.445-125.583-97.919 95.165c-25.934 25.204-60.132 39.085-96.295 39.085H106.657a28.552 28.552 0 0 0 1.343-8.667V366.336l42.688-15.674c27.087-9.945 57.552-8.503 83.578 3.963l70.596 33.813c4.761 2.28 8.206 6.325 9.7 11.389s.797 10.333-1.964 14.833a18.375 18.375 0 0 1-21.263 7.914l-93.786-29.824c-5.262-1.672-10.886 1.236-12.561 6.5-1.673 5.263 1.236 10.887 6.5 12.561l93.786 29.823a38.505 38.505 0 0 0 11.679 1.818c.468 0 .934-.028 1.4-.045 24.051-.346 47.136-9.274 65.147-25.271l98.107-87.134a18.324 18.324 0 0 1 15.913-4.205c6.703 1.426 11.839 6.208 13.738 12.793 1.902 6.583.102 13.365-4.813 18.142z"
              fill="white"
              opacity="1"
              data-original="white"
              className=""
            ></path>
            <path
              d="M418.739 198.99c2.63 0 5.21-1.06 7.069-2.93a10.06 10.06 0 0 0 2.931-7.07c0-2.63-1.07-5.2-2.931-7.07a10.076 10.076 0 0 0-7.069-2.93c-2.631 0-5.2 1.07-7.07 2.93a10.093 10.093 0 0 0-2.93 7.07c0 2.64 1.069 5.21 2.93 7.07a10.025 10.025 0 0 0 7.07 2.93z"
              fill="white"
              opacity="1"
              data-original="white"
              className=""
            ></path>
          </g>
        </svg>
      ),
    },
    {
      name: "Customer Service",
      id: "customer-service",
      path: "customer-service",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </svg>
      ),
    },
    {
      name: "Logout",
      id: "logout",
      path: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
        </svg>
      ),
      action: handleLogout,
    },
  ];

  const email = async () => {
    try {
      let res = await api.get("getEmail");

      setEmailData(res.data.email);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    email();
  }, []);
  return (
    <>
      <nav
        className="p-4 text-white flex justify-between"
        style={{
          background:
            "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
        }}
      >
        <h1 className="text-xl font-bold">User Dashboard</h1> <p>{EmailData}</p>
      </nav>
      <div className="flex flex-col md:flex-row h-screen bg-gray-100">
        {/* Sidebar */}
        <div
          className="= text-black w-full md:w-1/6 p-4"
          style={{
            background:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
          }}
        >
          {/* <h2 className="text-lg font-semibold mb-4 text-white">Sidebar</h2> */}
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={`flex cursor-pointer text-lg p-2 rounded hover:bg-gray-300 items-center ${
                    activeItem === item.name
                      ? "bg-blue-600 text-white"
                      : "text-white"
                  }`}
                  onClick={() => {
                    setActiveItem(item.name);
                    if (item.action) {
                      item.action();
                    }
                  }}
                >
                  {item.icon} {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
