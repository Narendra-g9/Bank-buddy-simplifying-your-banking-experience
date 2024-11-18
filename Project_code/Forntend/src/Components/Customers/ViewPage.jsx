import React, { useEffect, useState } from "react";
import ViewProfile from "./ViewProfile";
import BankStatement from "./BankStatement";

const ViewPage = () => {
  const [activeForm, setActiveForm] = useState("profile");

  useEffect(() => {}, [activeForm]);

  return (
    <div>
      <div className="flex space-x-4 mb-6">
        <button
          className={`p-2 rounded-md ${
            activeForm === "profile"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setActiveForm("profile")}
        >
          Profile
        </button>
        <button
          className={`p-2 rounded-md ${
            activeForm === "statement"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setActiveForm("statement")}
        >
          Bank Statement
        </button>
      </div>
      {activeForm === "profile" && <ViewProfile />}
      {activeForm === "statement" && <BankStatement />}
    </div>
  );
};

export default ViewPage;
