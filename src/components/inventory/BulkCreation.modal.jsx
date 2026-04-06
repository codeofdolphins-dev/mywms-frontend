import React, { useRef, useState, useCallback } from 'react';
import { FiDownload, FiFile, FiTrash2, FiInfo, FiUploadCloud, FiLink } from 'react-icons/fi';
import { BsFiletypeCsv, BsFiletypeXlsx } from 'react-icons/bs';
import AddModal from '../Add.modal';
import SampleFileForm from './SampleFile.form';

const ACCEPTED_TYPES = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const ACCEPTED_EXTENSIONS = ['.csv', '.xlsx', '.xls'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const BulkCreationModal = ({ onCancel, onImport }) => {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState('');

    const [isShow, setIsShow] = useState(false);

    /** validate & set file */
    const handleFile = useCallback((selectedFile) => {
        setError('');
        if (!selectedFile) return;

        // check extension
        const ext = '.' + selectedFile.name.split('.').pop().toLowerCase();
        if (!ACCEPTED_EXTENSIONS.includes(ext)) {
            setError(`Unsupported file type "${ext}". Please use .csv, .xlsx, or .xls`);
            return;
        }
        // check size
        if (selectedFile.size > MAX_FILE_SIZE) {
            setError('File size exceeds 100MB limit.');
            return;
        }

        setFile(selectedFile);
        setUrl('');
    }, []);

    /** drag events */
    const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) handleFile(droppedFile);
    };

    /** browse click */
    const handleBrowse = () => fileInputRef.current?.click();

    /** file input change */
    const handleInputChange = (e) => {
        const selected = e.target.files?.[0];
        if (selected) handleFile(selected);
        e.target.value = ''; // reset for re-selection
    };

    /** remove selected file */
    const removeFile = () => { setFile(null); setError(''); };

    /** format file size */
    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    /** get file icon */
    const getFileIcon = (fileName) => {
        const ext = fileName?.split('.').pop().toLowerCase();
        if (ext === 'csv') return <BsFiletypeCsv size={28} className="text-success" />;
        return <BsFiletypeXlsx size={28} className="text-primary" />;
    };

    return (
        <>
            <div className="p-5 pt-4">
                {/* Subtitle */}
                <p className="text-sm mb-5">
                    Upload file to import inventory data for sample file click <span onClick={() => setIsShow(true)} className="text-primary hover:underline cursor-pointer">Here</span>.
                </p>

                {/* ─── Drag & Drop Zone ──────────────────────────────── */}
                {!file ? (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                        relative border-2 border-dashed rounded-xl 
                        flex flex-col items-center justify-center 
                        py-12 px-6 text-center cursor-pointer
                        transition-all duration-300 ease-in-out
                        ${isDragOver
                                ? 'border-primary bg-primary/[0.04] scale-[1.01]'
                                : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50/50'
                            }
                    `}
                        onClick={handleBrowse}
                    >
                        {/* upload icon */}
                        <div className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center mb-4
                        transition-all duration-300
                        ${isDragOver ? 'bg-primary/15 text-primary scale-110' : 'bg-gray-100 text-gray-400'}
                    `}>
                            <FiUploadCloud size={28} />
                        </div>

                        <p className="text-sm font-semibold text-gray-700 mb-1">
                            Drag CSV file to import
                        </p>

                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleBrowse(); }}
                            className="btn btn-sm btn-primary rounded-lg mt-3 !px-5 !py-2"
                        >
                            <FiDownload size={14} className="mr-2" />
                            Browse Files
                        </button>

                        <p className="text-[11px] text-gray-400 mt-5">
                            Max file size: 100MB. Supported file types: .csv, .xlsx, .xls
                        </p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            className="hidden"
                            onChange={handleInputChange}
                        />
                    </div>
                ) : (
                    /* ─── Selected File Preview ──────────────────────── */
                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                                {getFileIcon(file.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{formatSize(file.size)}</p>
                            </div>
                            <button
                                type="button"
                                onClick={removeFile}
                                className="w-8 h-8 rounded-lg bg-danger/10 text-danger flex items-center justify-center hover:bg-danger hover:text-white transition-all duration-200"
                            >
                                <FiTrash2 size={14} />
                            </button>
                        </div>

                        {/* progress bar (cosmetic) */}
                        <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-success rounded-full transition-all duration-700 w-full" />
                        </div>
                        <p className="text-[11px] text-success font-semibold mt-1.5">Ready to import</p>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="mt-3 flex items-center gap-2 text-danger text-xs bg-danger/5 rounded-lg px-3 py-2">
                        <FiInfo size={14} className="shrink-0" />
                        {error}
                    </div>
                )}

                {/* ─── Footer ────────────────────────────────────────── */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="btn btn-sm !px-5 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-primary !px-6 rounded-lg"
                            onClick={() => {
                                if (file) {
                                    onImport?.({ type: 'file', value: file });
                                } else if (url.trim()) {
                                    onImport?.({ type: 'url', value: url.trim() });
                                }
                            }}
                        >
                            Import
                        </button>
                    </div>
                </div>
            </div>

            {/*  */}
            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title="Sample File"
                maxWidth='50'
                // placement='start'
            >
                <SampleFileForm />
            </AddModal>
        </>
    );
};

export default BulkCreationModal;