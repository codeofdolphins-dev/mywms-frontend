import React, { useState, useRef } from "react";

function FileUpload({
  label = "Product Image",
  helperText = "Accepted formats: JPG, PNG (Max 5MB)",
  onChange,
}) {
  const [fileName, setFileName] = useState("No file chosen");
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : "No file chosen");

    // let parent (react-hook-form, etc.) know about the selected file
    if (onChange) {
      onChange(file);
    }
  };

  return (
    <div className="">
      {label && <label className="text-sm font-medium text-gray-700 mb-0"> {label} </label>}

      <div
        className="flex items-center w-full border border-gray-300 rounded-md bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <span className="mr-2 text-sm font-medium text-gray-700 whitespace-nowrap">
          Choose File
        </span>
        <span className="text-sm text-gray-500 truncate">{fileName}</span>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <p className="text-xs text-gray-500">{helperText}</p>
    </div>
  );
}

export default FileUpload;
