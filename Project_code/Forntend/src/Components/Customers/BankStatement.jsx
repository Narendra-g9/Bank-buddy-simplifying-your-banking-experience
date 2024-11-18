import { useEffect, useState } from "react";
import api from "../../api/Api";
import { useForm } from "react-hook-form";
import { jsPDF } from "jspdf";

const BankStatement = () => {
  // Declare the form and state variables
  const addForm = useForm();
  const [TransactionsData, setTransactionsData] = useState();

  // Function to search transactions by date
  const searchByDate = async () => {
    try {
      // Get the "from" and "to" dates from the form
      let from = addForm.getValues("from");
      let to = addForm.getValues("to");

      // If both dates are present, fetch transactions within that range
      if (from && to) {
        const res = await api.get(`/transactions?startDate=${from}&endDate=${to}`);
        setTransactionsData(res.data.combinedTransactions);
        addForm.setValue("balance", res.data.accountBalance);
      } else {
        // If no dates are provided, fetch all transactions
        const res = await api.get(`/transactions?startDate=&endDate=`);
        setTransactionsData(res.data.combinedTransactions);
        addForm.setValue("balance", res.data.accountBalance);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to download the bank statement as a PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    const content = document.getElementById("table");

    if (content)
      doc.html(content, {
        callback: (doc) => {
          doc.save("Bank-statements.pdf");
        },
        x: 10,
        y: 10,
        width: 190,
        windowWidth: content.scrollWidth,
      });
  };

  // Fetch the transactions on component mount
  useEffect(() => {
    searchByDate();
  }, []);

  return (
    <div>
      <div className="bg-white shadow-md rounded-md p-4 mx-auto mt-16">
        <form>
          <div className="flex items-center justify-end gap-2">
            <div className="">
              <label htmlFor="available" className="w-full">
                Available Balance
              </label>
              <input
                type="text"
                id="available"
                readOnly
                className="w-full border rounded-lg h-10 p-1"
                {...addForm.register("balance")}
                disabled
              />
            </div>
            <div className="">
              <label htmlFor="fromDate" className="w-full">
                From Date
              </label>
              <input
                type="date"
                id="fromDate"
                className="w-full border rounded-lg h-10 p-1"
                {...addForm.register("from")}
              />
            </div>
            <div className="">
              <label htmlFor="toDate" className="w-full">
                To Date
              </label>
              <input
                type="date"
                className="w-full border h-10 rounded-lg p-1"
                id="toDate"
                {...addForm.register("to")}
              />
            </div>
            <div className="mt-5">
              <button
                className="bg-green-500 p-2 h-10 rounded-lg text-white"
                type="button"
                onClick={searchByDate}
              >
                Search
              </button>
            </div>
            <div className="mt-5">
              <button
                className="bg-blue-500 p-2 h-10 rounded-lg text-white"
                type="button"
                onClick={downloadPDF}
              >
                Download
              </button>
            </div>
          </div>
        </form>
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>

        <table
          className="min-w-full bg-white border border-gray-300 rounded-lg mb-4"
          id="table"
        >
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border border-gray-300">Date</th>
              <th className="py-2 px-4 border border-gray-300">Transaction Id</th>
              <th className="py-2 px-4 border border-gray-300">Type</th>
              <th className="py-2 px-4 border border-gray-300">Amount</th>
              <th className="py-2 px-4 border border-gray-300">Transfer Account</th>
              <th className="py-2 px-4 border border-gray-300">Transfer Holder Name</th>
            </tr>
          </thead>
          <tbody>
            {TransactionsData &&
              TransactionsData.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.transactionDate} {item.transactionTime}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">{item._id}</td>
                  <td className="py-2 px-4 border border-gray-300">{item.type}</td>
                  <td className="py-2 px-4 border border-gray-300">{item.amount}</td>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.destinationAccount === "" ? "-" : item.destinationAccount}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.destinationAccount === "" ? "-" : item.username}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {TransactionsData && TransactionsData.length < 1 && (
          <p className="text-center">No Data Found</p>
        )}
      </div>
    </div>
  );
};

export default BankStatement;
