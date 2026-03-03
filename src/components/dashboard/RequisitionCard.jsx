import React from 'react'
import ImageComponent from '../ImageComponent'
import { formatCreatedAt } from '../../utils/UTCtoLocal';
import { currencyFormatter } from '../../utils/currencyFormatter';

const RequisitionCard = ({ details = null }) => {

    console.log(details);

    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">

            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        {details?.meta?.name ?? "Dummy Company"}
                        <span
                            className={`inline-block ml-2 px-3 py-1 rounded-full text-xs font-semibold ${details?.priority?.toLowerCase() === "high"
                                ? "bg-red-100 text-red-700"
                                : details?.priority?.toLowerCase() === "normal"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700 invisible"
                                }`}
                        >
                            {details?.priority}
                        </span>
                    </h2>
                    <p className="text-sm text-gray-500">{details?.title}</p>
                </div>
                <div>
                    <ImageComponent
                        src={details?.meta?.image}
                        dummyImage={3}
                        className={"w-14 h-14"}
                    />
                </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="">
                        # <span className="text-gray-500 font-semibold hover:text-blue-600 cursor-pointer">{details?.rfq_no}</span>
                    </p>
                </div>
                <div>
                    <p className="text-gray-500">Status</p>
                    <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${details?.status === "open"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        {details?.status}
                    </span>
                </div>
                <div>
                    <p className="text-gray-500">Grand Total</p>
                    <p className="font-semibold">{currencyFormatter(details?.grand_total)}</p>
                </div>
                <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-semibold">{details?.meta?.location}</p>
                </div>
            </div>

            {/* Note */}
            {details?.note && (
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">Note:</span> {details?.note}
                    </p>
                </div>
            )}

            {/* Items */}
            <div className="mt-4">
                <p className="text-gray-700 font-semibold mb-2">Items</p>
                <div className="max-h-40 overflow-y-auto">
                    <ul className="space-y-1">
                        {details?.items?.map((item) => (
                            <li
                                key={item.id}
                                className="flex justify-between bg-gray-50 rounded-lg px-3 py-2"
                            >
                                <span>{item.product_name}</span>
                                <span className="text-gray-600">
                                    {item.qty} {item.uom} • {currencyFormatter(item.price_limit)} / {item.uom}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-xs text-gray-500 border-t pt-3 flex justify-between">
                <span>Created {formatCreatedAt(details?.createdAt)}</span>
                {details?.submission_deadline && (
                    <span className="font-bold text-danger">Deadline: {new Date(details?.submission_deadline).toLocaleDateString()}</span>
                )}
            </div>
        </div>

    )
}

export default RequisitionCard