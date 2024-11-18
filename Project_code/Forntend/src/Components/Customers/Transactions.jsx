import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../../api/Api";

// Transactions Component
const Transactions = () => {
  const [activeForm, setActiveForm] = useState("credit");
  const [TransactionsData, setTransactionsData] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (activeForm === "credit") {
        await api.post("creditamount", { amount: data.amount });
        let Balance = getValues("accountBalance");
        let newBalance = Number(Balance) + Number(data.amount);
        setValue("accountBalance", newBalance.toString());
        setValue("amount", 0);
      } else if (activeForm === "debit") {
        await api.post("debitamount", { amount: data.amount });
        let Balance = getValues("accountBalance");
        if (Number(data.amount) > Number(Balance)) {
          return toast.error("Insufficient Balance");
        }
        let newBalance = Number(Balance) - Number(data.amount);
        setValue("accountBalance", newBalance.toString());
        setValue("amount", 0);
      } else {
        await api.post("transferamount", {
          amount: data.amount,
          destinationAccount: data.destinationAccount,
        });

        let Balance = getValues("accountBalance");
        if (Number(data.amount) > Number(Balance)) {
          return toast.error("Insufficient Balance");
        }
        let newBalance = Number(Balance) - Number(data.amount);
        setValue("accountBalance", newBalance.toString());
        setValue("amount", 0);
        setValue("destinationAccount", "");
        setValue("accountName", "");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get("getprofileaccount");

      let response = res.data.userDetails;
      console.log(response);

      setValue("accountNumber", response.accNumber);
      setValue("name", response.accHolder);
      setValue("accountBalance", response.accBalance.toString());
      setValue("amount", 0);
    } catch (error) {
      console.log(error);
    }
  };

  const TransactionsFun = async () => {
    try {
      let res;
      if (activeForm === "credit") {
        res = await api.get("credittransactions");
      } else if (activeForm === "debit") {
        res = await api.get("debittransactions");
      } else {
        res = await api.get("transfertransactions");
      }
      if (res.data?.length > 0) {
        setTransactionsData(res.data);
      } else {
        setTransactionsData([]);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const accountDetailsTransfer = async () => {
    console.log("function called");

    try {
      let account = getValues("destinationAccount");
      const res = await api.get(`getAccountdetails/${account}`);
      console.log(res.data);
      setValue("accountName", res.data);
    } catch (error) {
      toast.error("No Account Found");
      console.log(error, "error");
    }
  };

  const balance = getValues("accountBalance");
  useMemo(() => {
    TransactionsFun();
  }, [activeForm, balance]);

  useEffect(() => {
    fetchUser();
    TransactionsFun();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Transactions</h2>

      {/* Button Group */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`p-2 rounded-md ${
            activeForm === "credit"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setActiveForm("credit")}
        >
          Credit
        </button>
        <button
          className={`p-2 rounded-md ${
            activeForm === "debit"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setActiveForm("debit")}
        >
          Debit
        </button>
        <button
          className={`p-2 rounded-md ${
            activeForm === "transfer"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setActiveForm("transfer")}
        >
          Transfer
        </button>
      </div>

      {/* Form Fields */}
      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded-lg shadow-md mb-8 w-96"
        >
          <div className="grid grid-cols-1 gap-4">
            {/* Account Number (Read-only) */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Account Number
              </label>
              <input
                {...register("accountNumber")}
                readOnly
                className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${
                  errors.accountNumber ? "border-red-500" : "border-gray-300"
                } rounded-lg py-2 px-4 block w-full`}
                placeholder="Account number"
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-sm">
                  {errors.accountNumber.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Account Holder Name
              </label>
              <input
                {...register("name")}
                readOnly
                className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${
                  errors.accountNumber ? "border-red-500" : "border-gray-300"
                } rounded-lg py-2 px-4 block w-full`}
                placeholder="Account number"
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-sm">
                  {errors.accountNumber.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Account Balance
              </label>
              <input
                {...register("accountBalance")}
                readOnly
                className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${
                  errors.accountNumber ? "border-red-500" : "border-gray-300"
                } rounded-lg py-2 px-4 block w-full`}
                placeholder="Account number"
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-sm">
                  {errors.accountNumber.message}
                </p>
              )}
            </div>
            {/* Amount */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Amount
              </label>
              <input
                type="number"
                {...register("amount", {
                  min: {
                    value: 1,
                    message: "Minimum 1 Rupee is Required",
                  },
                })}
                className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${
                  errors.amount ? "border-red-500" : "border-gray-300"
                } rounded-lg py-2 px-4 block w-full`}
                placeholder="Enter amount"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}
            </div>

            {activeForm === "transfer" && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Destination Account
                </label>
                <input
                  {...register("destinationAccount", {
                    required: "Account number is Required",
                  })}
                  className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${
                    errors.destinationAccount
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg py-2 px-4  w-3/4`}
                  placeholder="Enter destination account number"
                />
                <button
                  className="w-1/4 bg-blue-800 text-white rounded-lg py-2 px-4 "
                  type="button"
                  onClick={() => {
                    if (Number(getValues("amount")) <= 0) {
                      return toast.error("Enter Amount");
                    }

                    accountDetailsTransfer();
                  }}
                >
                  fetch
                </button>
                {errors.destinationAccount && (
                  <p className="text-red-500 text-sm">
                    {errors.destinationAccount.message}
                  </p>
                )}
              </div>
            )}

            {activeForm === "transfer" && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Account Holder Name
                </label>
                <input
                  {...register("accountName")}
                  readOnly
                  className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${
                    errors.accountNumber ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 px-4 block w-full`}
                  placeholder="Account number"
                />
                {errors.accountNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.accountNumber.message}
                  </p>
                )}
              </div>
            )}
            <div className="mb-4 flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-lg py-2 px-4 w-full"
              >
                {activeForm === "credit"
                  ? "Deposit"
                  : activeForm === "debit"
                  ? "Withdraw"
                  : "Transfer"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Transactions History */}
      <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
      {TransactionsData.length === 0 ? (
        <p>No Transactions Found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">S.No</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {TransactionsData.map((transaction, index) => (
                <tr key={index}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{transaction.amount}</td>
                  <td className="border p-2">{transaction.date}</td>
                  <td className="border p-2">{transaction.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;
