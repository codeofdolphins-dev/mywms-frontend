import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../..";
import { errorAlert, successAlert } from "../../../utils/alerts";

class PDF {
    TQRequisitionPDFDownload(key = []) {
        const QueryClient = useQueryClient()
        return useMutation({
            mutationFn: async (reqNo) => {
                const res = await API.post(
                    "/download/pdf/requisition/details",
                    reqNo,
                    {
                        responseType: "blob",
                    }
                );
                return res
            },
            onSuccess: (res) => {
                successAlert("PDF generated successfully");

                if (key.length > 0) {
                    QueryClient.invalidateQueries(key);
                }


                // Extract filename from header
                const disposition = res.headers["content-disposition"];
                const filename = disposition?.split("filename=")[1]?.replace(/"/g, "") || "requisition.pdf";

                // Create downloadable file
                const blob = new Blob([res.data], { type: "application/pdf" });
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();

                a.remove();
                window.URL.revokeObjectURL(url);
            },
            onError: (error) => {
                errorAlert(error.response.data?.message);
            }
        })
    }

    TQProformaInvoicePDFDownload(key = []) {
        const QueryClient = useQueryClient()
        return useMutation({
            mutationFn: async (params) => {
                const res = await API.post(
                    "/download/pdf/proforma-invoice/details",
                    params,
                    {
                        responseType: "blob",
                    }
                );
                return res
            },
            onSuccess: (res) => {
                successAlert("PDF generated successfully");

                if (key.length > 0) {
                    QueryClient.invalidateQueries(key);
                }


                // Extract filename from header
                const disposition = res.headers["content-disposition"];
                const filename = disposition?.split("filename=")[1]?.replace(/"/g, "") || "requisition.pdf";

                // Create downloadable file
                const blob = new Blob([res.data], { type: "application/pdf" });
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();

                a.remove();
                window.URL.revokeObjectURL(url);
            },
            onError: (error) => {
                errorAlert(error.response.data?.message);
            }
        })
    }
}

const pdf = new PDF();
export default pdf;