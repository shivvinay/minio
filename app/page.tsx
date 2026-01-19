"use client";

import React, { useRef, useState } from "react";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async () => {
    if (!file) return;

    try {
      setStatus("Getting upload URL...");

      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, key } = await res.json();

      setStatus("Uploading...");

      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      setStatus("Upload successful ✅");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";

      return {
      
      url:`https://minio.vayams.in/vayam/${key}`,
      mimeType: file.type,
      size: file.size,
      name: file.name,
    };

      
    } catch (error) {
      console.error(error);
      setStatus("Error uploading file ❌");
    }

    
  };

  const mongoUploadFile = async (data: any) => {
    if (!file) return;

    try {
      setStatus("Uploading to MongoDB...");

    
      const res = await fetch("/api/craete-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
          //name: file.name,
          //url:`https://{process.env.MINIO_ENDPOINT}/{vayam}/${file.name}`,
          //mimeType: file.type,
          //size: file.size
        //),
      });
      if (!res.ok) {
        throw new Error("Failed to upload file to MongoDB");
      }} catch (error) {
      console.error(error);
      setStatus("Error uploading file to MongoDB ❌");
    }
    setStatus("Upload to MongoDB successful ✅");
  }

  const uploadHandle = async () => {
      const fileData = await uploadFile();
      await mongoUploadFile(fileData);
    };

  return (
    <div className="p-4 text-white bg-black min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4 w-96">
        <h1 className="text-xl font-bold">UPLOAD PAGE</h1>
        <p>Upload your files here</p>

        <input
          ref={inputRef}
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-black"
        />

        <button
          type="button"
          onClick={uploadHandle}
         //disabled={!file}
          className="bg-orange-600 rounded-3xl py-2"
        >
          Upload
        </button>

        <p>{status}</p>
      </div>
    </div>
  );
}
  
export default UploadPage
