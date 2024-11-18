import { useEffect, useState } from "react";
import Form from "../from/Form"; // Assuming you have a Form component
import api from "../../api/Api";
import { toast } from "react-toastify";

const Table = ({ endpoint }) => {
  const [Modal, setModal] = useState(false);
  const [data, setData] = useState([]);

  const role = localStorage.getItem("role");

  const Loans = {
    inputs: [
      {
        inputName: "Loan Amount",
        inputType: "number",
        pattern: "",
        patternMessage: "Username must be alphanumeric and between 3-15 characters.",
        maxLength: 20,
        minLength: 1,
        key: "amount",
      },
      {
        inputName: "Tenure",
        pattern: "",
        patternMessage: "Username must be alphanumeric and between 3-15 characters.",
        maxLength: 15,
        minLength: 1,
        key: "term",
      },
      {
        inputName: "Interest",
        inputType: "number",
        pattern: "",
        patternMessage: "Please enter a valid email address.",
        maxLength: 50,
        minLength: 1,
        key: "interestRate",
      },
    ],
    endPoint: "applyloan",
    close: () => {
      setModal(false);
    },
    heading: "Add Employee",
  };

  const fetchData = async () => {
    try {
      const res = await api.get(endpoint);
      console.log(res.data);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loanStatus = async (id, status) => {
    try {
      await api.patch(`loans/status/${id}`, { status: status });
      toast.success(`Loan ${status}`);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [Modal]);

  return (
    <>
      <div>
        {role !== "1" && (
          <button
            className="bg-blue-500 p-2 text-xl rounded-md text-white mb-3"
            onClick={() => setModal(true)}
          >
            Raise Loan Request
          </button>
        )}
      </div>
      <div>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border border-gray-300">Date</th>
              <th className="py-2 px-4 border border-gray-300">Loan Id</th>
              <th className="py-2 px-4 border border-gray-300">Loan Amount</th>
              <th className="py-2 px-4 border border-gray-300">Tenure</th>
              <th className="py-2 px-4 border border-gray-300">Interest</th>
              <th className="py-2 px-4 border border-gray-300">Loan Type</th>
              <th className="py-2 px-4 border border-gray-300">Status</th>
              {role === "1" && (
                <th className="py-2 px-4 border border-gray-300">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.createdAt}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">{item._id}</td>
                  <td className="py-2 px-4 border border-gray-300">{item.amount}</td>
                  <td className="py-2 px-4 border border-gray-300">{item.term}</td>
                  <td className="py-2 px-4 border border-gray-300">{item.interestRate}</td>
                  <td className="py-2 px-4 border border-gray-300">{item.loanType}</td>
                  <td className="py-2 px-4 border border-gray-300">{item.status}</td>
                  {role === "1" && (
                    <td className="py-2 px-4 border border-gray-300">
                      {item.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            className="bg-blue-500 text-white p-2 rounded-md"
                            onClick={() => loanStatus(item._id, "accepted")}
                          >
                            Accept
                          </button>
                          <button
                            className="bg-red-500 text-white p-2 rounded-md"
                            onClick={() => loanStatus(item._id, "rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {Modal && (
        <Form
          close={Loans.close}
          endPoint={Loans.endPoint}
          heading="Raise Loan Request"
          inputs={Loans.inputs}
          select={true}
          options={[
            "Home",
            "Education",
            "Gold",
            "Vehicle",
            "Personal",
            "Business",
            "Medical",
            "Agricultural",
            "Travel",
            "Debt Consolidation",
          ]}
        />
      )}
    </>
  );
};

export default Table;
