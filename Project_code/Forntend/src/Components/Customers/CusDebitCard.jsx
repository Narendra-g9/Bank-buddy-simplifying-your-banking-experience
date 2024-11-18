import { useEffect, useState } from "react";
import api from "../../api/Api";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import "./CusDebitCard.css";

const CusDebitCard = () => {
  const [cardsExist, setCardExist] = useState(false);
  const [data, setData] = useState(null);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const content = document.getElementById("table");
    console.log(content);

    if (content)
      doc.html(content, {
        callback: (doc) => {
          doc.save("Bank-statements.pdf");
        },
        x: 10,
        y: 10,
        width: 200,
        windowWidth: content.scrollWidth,
      });
  };

  const cardCheckFun = async () => {
    try {
      let res = await api.get("isDebitCard");

      setCardExist(res.data.success);
      await Details();
    } catch (error) {
      console.log(error);
    }
  };

  const applyDebitCards = async () => {
    try {
      await api.post("apply/debitcard");
      toast.success("Debit Card Applied Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    }
  };

  const Details = async () => {
    try {
      let res = await api.get("getDebitCard");
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(data);

  useEffect(() => {
    cardCheckFun();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <p className="text-2xl font-bold text-blue-500">Debit Card</p>
        {!cardsExist && (
          <button
            className="bg-blue-500 p-2 text-white rounded-md font-bold"
            onClick={applyDebitCards}
          >
            Apply Debit card
          </button>
        )}
      </div>
      {cardsExist && (
        <>
          <div className="flex justify-end my-3">
            <button
              className="bg-blue-500 p-2 flex text-white rounded-md font-bold"
              onClick={downloadPDF}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white "
                width={20}
                height={20}
                viewBox="0 0 512 512"
              >
                <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
              </svg>
              Download
            </button>
          </div>

          <div className="" id="table">
            <div>
              <div className="debit-card">
                <img src="/yourbank logo.png" className="master-card-logo" />
                <div className="card-number-block">
                  {data && (
                    <>
                      <input
                        type="text"
                        pattern="^\d{4}$"
                        maxLength={4}
                        className="number-block"
                        defaultValue={`${data.cardNumber[0]}${data.cardNumber[1]}${data.cardNumber[2]}`}
                        disabled
                      />
                      <input
                        type="text"
                        pattern="^\d{4}$"
                        maxLength={4}
                        className="number-block"
                        defaultValue={`${data.cardNumber[3]}${data.cardNumber[4]}${data.cardNumber[5]}`}
                        disabled
                      />
                      <input
                        type="text"
                        pattern="^\d{4}$"
                        maxLength={4}
                        className="number-block"
                        defaultValue={`${data.cardNumber[6]}${data.cardNumber[7]}${data.cardNumber[8]}`}
                        disabled
                      />
                      <input
                        type="text"
                        pattern="^\d{4}$"
                        maxLength={4}
                        className="number-block"
                        defaultValue={`${data.cardNumber[9]}${data.cardNumber[10]}${data.cardNumber[11]}`}
                        disabled
                      />
                    </>
                  )}
                </div>
                <div className="card-holder-block">
                  <div className="block-lebel">Card Holder</div>
                  <input
                    type="text"
                    pattern="[A-Z ]+"
                    className="card-holder-name"
                    defaultValue={data && data.cardHolder}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CusDebitCard;
