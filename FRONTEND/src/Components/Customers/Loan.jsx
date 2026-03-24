import Table from "../table/Table";

const Loan = () => {
  return (
    <div>
      <Table endpoint="getmyloans" />
    </div>
  );
};

export default Loan;
