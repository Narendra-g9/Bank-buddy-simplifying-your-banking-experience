import HomePage from "./Components/Customers/HomePage";
import Transactions from "./Components/Customers/Transactions";
import AdminHome from "./Components/Admin/AdminHome";
import Addusers from "./Components/Admin/Addusers";
import ViewUsers from "./Components/Admin/ViewUsers";
import UserForm from "./Components/Home/UserForm";
import Login from "./Components/Home/Login";
import Dashboard from "./Components/Home/Dashboard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AboutUs from "./Components/Home/AboutUs";
import ServicesPage from "./Components/Home/ServicesPage";
import ViewPage from "./Components/Customers/ViewPage";
import ContactUs from "./Components/Customers/ContactUs";
import Loan from "./Components/Customers/Loan";
import AdminLoan from "./Components/Admin/Loan";
import AdminLogin from "./Components/Admin/Login";
import CusDebitCard from "./Components/Customers/CusDebitCard";
import DebitCard from "./Components/Admin/DebitCard";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<UserForm />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<ServicesPage />} />
          </Route>

          <Route path="/user" element={<HomePage />}>
            <Route path="transactions" element={<Transactions />} />
            <Route path="view" element={<ViewPage />} />
            <Route path="Customer-Debit" element={<CusDebitCard />} />
            <Route path="customer-service" element={<ContactUs />} />
            <Route path="/user/load" element={<Loan />} />
          </Route>

          <Route path="/admin-login" element={<AdminLogin />} />

          <Route path="admin" element={<AdminHome />}>
            <Route path="add-user" element={<Addusers />} />
            <Route path="view-users" element={<ViewUsers />} />
            <Route path="/admin/loan" element={<AdminLoan />} />
            <Route path="debit-card" element={<DebitCard />} />
          </Route>
        </Routes>
        <ToastContainer />
      </Router>
    </div>
  );
};

export default App;
