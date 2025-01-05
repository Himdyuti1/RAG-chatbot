/* eslint-disable react/prop-types */
import  { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import instance from '../axios';


// eslint-disable-next-line no-unused-vars
const PDFUploader = ({ chatId, chats, setChats }) => {
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState("Process");
    const [isDisable, setIsDisable] = useState(false);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: "application/pdf",
        onDrop: (acceptedFiles) => {
            setFiles((prevFiles) => [
                ...prevFiles,
                ...acceptedFiles.map((file) => ({
                    file,
                    name: file.name,
                    id: file.name + Date.now(), // Unique identifier for each file
                })),
            ]);
        },
    });

    const handleProcess = async () => {
        setStatus("Processing...");
        setIsDisable(true);
        
        const formData = new FormData();
        files.forEach(({file}) => {
            formData.append("files", file);
        });
        formData.append("collection_name", chatId);
        try{
            await instance.post("/process_pdfs", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat.id === chatId ? { ...chat, isUploader: false } : chat
                )
            );
        }
        catch(error){
            console.warn(error);
        }
    };

    const removeFile = (id) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100">
            <div
                {...getRootProps()}
                className={`border-4 border-dashed p-10 w-3/4 text-center ${
                    isDragActive ? "border-blue-500" : "border-gray-300"
                }`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-gray-600">Drop the files here...</p>
                ) : (
                    <p className="text-gray-600">
                        Drag & drop some PDFs here, or click to select files
                    </p>
                )}
            </div>

            {/* File List */}
            <ul className="mt-4 w-3/4">
                {files.map((file) => (
                    <li
                        key={file.id}
                        className="flex justify-between items-center bg-white border p-2 mb-2 rounded shadow-sm"
                    >
                        <span>{file.name}</span>
                        <button
                            onClick={() => removeFile(file.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>

            {/* Process Button */}
            <button
                className={`mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                    files.length === 0 && "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleProcess}
                disabled={files.length === 0 || isDisable}
            >
                {status}
            </button>
        </div>
    );
};

export default PDFUploader;
