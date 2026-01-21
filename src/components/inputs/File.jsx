import React, { useState, useRef, useId } from "react";

function FileUpload({
	label = "Product Image",
	labelPosition = "",
	helperText = "Accepted formats: JPG, PNG (Max 5MB)",
	onChange,
	...rest
}) {
	const _id = useId()
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
		<div className={`w-full ${labelPosition === "inline" ? "flex items-center justify-between" : ""} `}>
			{
				label && <label
					htmlFor={_id}
					className={`text-sm font-medium text-gray-700 mb-0 ${labelPosition === "inline" ? "w-1/3" : ""}`}
				>
					{label}
				</label>
			}

			<div className={labelPosition === "inline" ? "w-2/3" : ""}>
				<div
					className="flex items-center w-full border border-gray-300 rounded-md bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 cursor-pointer"
					onClick={() => inputRef.current?.click()}
				>
					<span className="mr-2 text-sm font-medium text-gray-700 whitespace-nowrap">
						Choose File
					</span>
					<span className="text-sm text-gray-500 truncate">{fileName}</span>

					<input
						id={_id}
						ref={inputRef}
						type="file"
						accept="image/jpeg,image/png"
						className="hidden"
						onChange={handleFileChange}
						{...rest}
					/>
				</div>
				<p className="text-xs text-gray-500">{helperText}</p>
			</div>
		</div>
	);
}

export default FileUpload;
