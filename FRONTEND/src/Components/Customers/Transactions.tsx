import React, { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../../api/Api";

// Validation schema using Yup

// Define the shape of the form data
export interface FormData {
  accountNumber: string; // We will handle this programmatically
  amount: number;
  destinationAccount?: string;
  accountBalance: string;
  name: string;
  accountName: string;
}

export interface AccountUser {
  _id: string;
  firstname: string;
  lastname: string;
  otherName: string;
  gender: string;
  address: string;
  stateofOrigin: string;
  email: string;
  phoneNumber: string;
  alternativePhoneNumber: string;
}

export interface BankAccount {
  _id: string;
  accNumber: string;
  accUser: AccountUser;
  accHolder: string;
  accBalance: number;
  qrCode: string;
}

export interface Transaction {
  _id: string;
  accountNumber: string;
  accUser: string;
  amount: number;
  date: string;
  __v: number;
  transactionDate: string;
  destinationAccount?: string;
  transactionTime: string;
}

const Transactions: React.FC = () => {
  const [activeForm, setActiveForm] = useState<"credit" | "debit" | "transfer">(
    "credit"
  );

  const [TransactionsData, setTransactionsData] = useState<Transaction[]>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (activeForm == "credit") {
        await api.post("creditamount", { amount: data.amount });
        let Balance = getValues("accountBalance");
        let newBalance = Number(Balance) + Number(data.amount);
        setValue("accountBalance", newBalance.toString());
        setValue("amount", 0);
      } else if (activeForm == "debit") {
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
        setValue("destinationAccount", " ");
        setValue("accountName", "");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get(`getprofileaccount`);

      let response: BankAccount = res.data.userDetails;
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
      if (activeForm == "credit") {
        res = await api.get("credittransactions");
      } else if (activeForm == "debit") {
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
                readOnly // Make this field read-only
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
                readOnly // Make this field read-only
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
                readOnly // Make this field read-only
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
                  {...register("accountName", {
                    required: "Search Details",
                  })}
                  readOnly // Make this field read-only
                  className={`bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border ${
                    errors.accountName ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-2 px-4 block w-full`}
                  placeholder="Account number"
                />
                {errors.accountName && (
                  <p className="text-red-500 text-sm">
                    {errors.accountName.message}
                  </p>
                )}
              </div>
            )}
            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-2 px-4 w-full rounded-lg hover:bg-blue-500"
              >
                Submit{" "}
                {/*  {activeForm.charAt(0).toUpperCase() + activeForm.slice(1)} */}
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* Transaction History Section */}
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

      {/* Displaying Transaction History Based on Active Form */}

      <>
        <h3 className="text-lg font-semibold mb-2">
          {activeForm == "credit" && "Credit History"}
          {activeForm == "debit" && "Debit History"}

          {activeForm == "transfer" && "Transfer History"}
        </h3>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border border-gray-300">Date</th>
              <th className="py-2 px-4 border border-gray-300">
                Transaction Id
              </th>
              <th className="py-2 px-4 border border-gray-300">Amount</th>

              {activeForm == "transfer" && (
                <th className="py-2 px-4 border border-gray-300">
                  Transfer Account
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {TransactionsData &&
              TransactionsData.map((item: Transaction, index: number) => (
                <tr key={index + 1}>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.transactionDate} {item.transactionTime}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {item._id}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.amount}
                  </td>
                  {item.destinationAccount && (
                    <td className="py-2 px-4 border border-gray-300">
                      {item.destinationAccount}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </>
    </div>
  );
};

export default Transactions;
