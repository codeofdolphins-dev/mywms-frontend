import React from "react";
import BrowseTable from "@/components/BrowseTable";

const Browse = ({
  pageName = "Unknown",
}) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-5xl font-bold my-3">{pageName}</h1>
        <button
          className="btn btn-primary"
        >Create {pageName}</button>
      </div>
      <p className="my-3">manage and view all {pageName.toLowerCase()}</p>
      <BrowseTable />
    </div>
  );
};

export default Browse;
