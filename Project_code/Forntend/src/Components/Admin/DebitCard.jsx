import { useEffect, useState } from "react";
import api from "../../api/Api";
import { toast } from "react-toastify";

const DebitCard = () => {
  const [data, setData] = useState([]);

  const DebitCardData = async () => {
    try {
      let res = await api.get("getallDebitCards");
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const StatusChange = async (id, status) => {
    try {
      await api.patch("updatedebit", { status: status, debitid: id });
      toast.success(`Debit Card Successfully ${status}`);
      DebitCardData();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    DebitCardData();
  }, []);

  return (
    <div>
      <p className="text-2xl font-semibold text-blue-500">Debit cards</p>
      <div>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border border-gray-300">Date</th>
              <th className="py-2 px-4 border border-gray-300">Account Holder</th>
              <th className="py-2 px-4 border border-gray-300">Account Number</th>
              <th className="py-2 px-4 border border-gray-300">Account Balance</th>
              <th className="py-2 px-4 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 &&
              data.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.date} {item.time}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.cardHolder}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.accNumber}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.accBalance}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    <div className="flex gap-5">
                      <button
                        className="bg-blue-500 text-white p-1 font-semibold rounded-md"
                        onClick={() => StatusChange(item._id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white p-1 font-semibold rounded-md"
                        onClick={() => StatusChange(item._id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DebitCard;
