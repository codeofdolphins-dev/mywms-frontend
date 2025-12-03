import React from "react";
import BrowseTable from "../../components/BrowseTable";

const RequisitionBrowse = ({ }) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-5xl font-bold my-3">Requisitions</h1>
        <button
          className="btn btn-primary"
        >Create Requisition</button>
      </div>
      <p className="my-3">manage and view all requisitions</p>
      <BrowseTable />
    </div>
  );
};

export default RequisitionBrowse;
