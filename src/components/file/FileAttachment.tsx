import React, { useState } from 'react';

interface FileAttachmentProps {
  id:string;
  label?: string;
  value?:File;
  onFileSelect?: (file: File | null) => void;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({
  id,
  label,
  onFileSelect,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 p-1 md:flex-row">
      {label && (
        <label className="custom-textfield-label-style-1">{label}</label>
      )}
      <input
        id={id}
        type="file"
        onChange={handleFileChange}
        className="custom-textfield-style-1
                           file:rounded-md file:border-1  file:border-gray-200 file:bg-blue-50 file:text-sm
                           file:font-semibold file:text-blue-700
                           hover:file:bg-blue-100"
        style={{
          height: 30,
          paddingLeft: '0rem',
          paddingRight: '0rem',
          paddingTop: '0rem',
          paddingBottom: '0rem',
        }}
        // value={selectedFile?selectedFile:null}
      />
      {/* {selectedFile && (
                <div className="mt-2 text-sm text-gray-600">
                    <p><strong>File Name:</strong> {selectedFile.name}</p>
                    <p><strong>File Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
            )} */}
    </div>
  );
};

export default FileAttachment;
