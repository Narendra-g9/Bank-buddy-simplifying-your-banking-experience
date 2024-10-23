import { useForm } from "react-hook-form";

export interface FormInputsTypes {
  inputs: InputTypes[];
  endPoint: string;
  close: () => void;
  heading: string;
  payment?: boolean;
  select?: boolean;
  options?: Array<string>;
}

export interface InputTypes {
  inputType?: string;
  inputName: string;
  pattern: RegExp | string;
  patternMessage: string;
  maxLength: number;
  minLength: number;
  key: string;
}

import { useState } from "react";
import api from "../../api/Api";
import { toast } from "react-toastify";
const Form = ({
  endPoint,
  heading,
  inputs,
  close,
  payment,
  select,
  options,
}: FormInputsTypes) => {
  const addForm = useForm();

  const [Modal, setModal] = useState<boolean>(false);

  const add = addForm.handleSubmit(async () => {
    const data = inputs.reduce((acc, item) => {
      const key = item.key;

      acc[key] = addForm.getValues(item.inputName);
      return acc;
    }, {} as Record<string, any>);

    let final;
    if (select) {
      const finalData = { ...data, loanType: addForm.getValues("LoanType") };
      final = finalData;
      console.log(finalData);
    } else {
      final = data;
    }

    try {
      let res = await api.post(`${endPoint}`, final);
      if (payment) {
        setModal(true);
        setTimeout(() => {
          close();
        }, 2000);
      } else {
        close();
      }
      toast.success(res.data.msg);
    } catch (error: any) {
      toast.error(error.response.data.msg);
      console.log(error, "error");
    }
  });

  return (
    <div className="fixed top-0 w-full h-screen bg-[#000000ad] left-0 z-[10000] component-form">
      <div className="flex justify-center items-center w-screen h-screen">
        {!Modal && (
          <form
            className=" mx-auto w-1/3 p-10 max-h-[95%] overflow-y-scroll bg-white"
            autoComplete="off"
          >
            <p className="flex justify-end text-2xl ">
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
            <p className=" text-center text-4xl font-bold mb-3">{heading}</p>
            {inputs &&
              inputs.map((item: InputTypes, index: number) => (
                <div className="mb-5" key={index + 1}>
                  <div className="">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {item.inputName}
                    </label>
                    <input
                      type={item.inputType ? item.inputType : "text"}
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      {...addForm.register(item.inputName, {
                        required: `${item.inputName} is Required`,
                        maxLength: {
                          value: item.maxLength,
                          message: `Max Length is ${item.maxLength}`,
                        },
                        minLength: {
                          value: item.minLength,
                          message: `Min Length is ${item.minLength}`,
                        },
                        pattern: {
                          value: new RegExp(item.pattern),
                          message: item.patternMessage,
                        },
                      })}
                      required
                    />
                  </div>
                  {addForm.formState.errors[item.inputName]?.message && (
                    <p className="text-red-700 font-[500]">
                      {addForm.formState.errors[
                        item.inputName
                      ]?.message?.toString()}
                    </p>
                  )}
                </div>
              ))}
            {select && options && (
              <div className="mb-5">
                <div className="">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Loan Type
                  </label>
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...addForm.register("LoanType", {
                      required: "Loan type is Required",
                    })}
                  >
                    {options.map((item: string, index: number) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                {addForm.formState.errors.LoanType?.message && (
                  <p className="text-red-700 font-[500]">
                    {addForm.formState.errors.LoanType?.message?.toString()}
                  </p>
                )}
              </div>
            )}

            {payment ? (
              <button
                type="button"
                onClick={add}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm  w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Proceed To Pay
              </button>
            ) : (
              <button
                type="button"
                onClick={add}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm  w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            )}
          </form>
        )}
        {Modal && (
          <div className="w-[400px] bg-white flex flex-col items-center p-3 payment">
            <i
              className="fa fa-check-circle text-5xl text-green-500"
              aria-hidden="true"
            />
            <h2 className="text-3xl text-center">
              {" "}
              Your payment was successful{" "}
            </h2>
            <p className="text-center text-xl">
              {" "}
              Thank you for your payment. we will <br />
              be in contact with more details shortly{" "}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
