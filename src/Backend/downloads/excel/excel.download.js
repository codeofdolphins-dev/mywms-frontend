import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../";
import { errorAlert, successAlert } from "../../../utils/alerts";

class Excel {
    TQSampleOpeningStockExcelDownload(key = []) {
        const QueryClient = useQueryClient()
        return useMutation({
            mutationFn: async (params) => {
                const res = await API.post(
                    "/download/excel/inventory/sample-opening-stock",
                    params,
                    { responseType: "blob" }
                );
                return res
            },
            onSuccess: (res) => {
                successAlert("Excel generated successfully");

                if (key.length > 0) {
                    QueryClient.invalidateQueries(key);
                }


                // Extract filename from header
                const disposition = res.headers["content-disposition"];
                const filename = disposition?.split("filename=")[1]?.replace(/"/g, "") || "sample_opening_stock.xlsx";

                // Create downloadable file
                const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();

                a.remove();
                window.URL.revokeObjectURL(url);
            },
            onError: async (error) => {
                console.log(error);
                if (error.response?.data instanceof Blob) {
                    try {
                        const errorText = await error.response.data.text();
                        const errorData = JSON.parse(errorText);
                        errorAlert(errorData.message || "An error occurred");
                    } catch (e) {
                        errorAlert("An error occurred");
                    }
                } else {
                    errorAlert(error.response?.data?.message || "An error occurred");
                }
            }
        })
    }
}

const excel = new Excel();
export default excel;