import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import api from "../../api/Api";

const HomePage = () => {
  const [activeItem, setActiveItem] = useState("");
  const [EmailData, setEmailData] = useState("");
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
              d="M510.478 334.046a38.183 38.183 38.183 0 0 0-28.795-26.813c-8.863-1.887-18.081-.51-25.953 3.674 4.558-28.345 2.164-57.666-7.215-84.997-1.793-5.224-7.482-8.001-12.705-6.213-5.224 1.793-8.005 7.481-6.213 12.705 11.078 32.277 11.168 67.685.315 100.001l-79.691 70.777a80.362 80.362 0 0 1-16.04 11.074 38.43 38.43 0 0 0-.436-20.09 38.462 38.462 0 0 0-20.244-23.766l-70.596-33.813c-30.864-14.783-66.988-16.493-99.11-4.7l-7.176 2.635c-19.918-56.267-6.054-118.668 36.6-161.321l70.598-70.597h78.157l59.073 95.9c8.639 13.916 16.25 29.029 22.088 45.276 3.843 9.469 7.507 19.264 10.747 28.874 5.515 13.71 3.658 28.146-5.69 39.506z"
              fill="white"
              opacity="1"
              data-original="white"
              className=""
            ></path>
          </g>
        </svg>
      ),
    },
  ];

  return (
    <div className="home-container">
      <div className="sidebar">
        <div className="logo">
          <img src="/images/logo1.jpg" alt="Logo" className="logo-image" />
        </div>
        <div className="menu">
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.id}
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
              onClick={() => setActiveItem(item.id)}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default HomePage;
