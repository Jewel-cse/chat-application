import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Input,
  InputProps,
  Progress,
} from '@nextui-org/react';
import { IoCloseSharp } from 'react-icons/io5';
import { TbUpload } from 'react-icons/tb';
import { AiOutlineFilePdf } from 'react-icons/ai';
import Image from 'next/image';

//any one work with pdf or other then must send the props filetype
//other wise it will say image type by default

interface FileUploadProps extends InputProps {
  onFileUpload?: (files: FileList) => void;
  initialImagePath?: string;
  filetype?: string;
  mode: string;
  height?: number; //as pixels
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  initialImagePath,
  filetype,
  mode,
  height = 160,
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [filePreviews, setFilePreviews] = useState<
    { src: string; type: string }[]
  >(
    initialImagePath && filetype
      ? [{ src: initialImagePath, type: filetype }]
      : [],
  );

  const [loading, setLoading] = useState<boolean[]>([]);

  const handleDragEnter = (e: React.DragEvent<HTMLInputElement>) => {
    if (mode === 'view') return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLInputElement>) => {
    if (mode === 'view') return;
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLInputElement>) => {
    if (mode === 'view') return;
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFiles(files);
      previewFiles(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mode === 'view') return;
    const files = e.target.files;

    if (files && files.length > 0) {
      // setFilePreviews()
      uploadFiles(files);
      previewFiles(files);
    }
  };

  const uploadFiles = (files: FileList) => {
    Array.from(files).forEach((file, index) => {
      const totalSize = file.size;
      const chunkSize = 1024 * 1024;
      let uploaded = 0;

      const uploadInterval = setInterval(() => {
        uploaded += chunkSize;
        const progress = (uploaded / totalSize) * 100;

        setUploadProgress(progress);

        if (progress >= 100) {
          clearInterval(uploadInterval);
          setTimeout(() => {
            setUploadProgress(null);
            if (onFileUpload) onFileUpload(files);
          }, 500);
        }
      }, 500);
    });
  };

  const previewFiles = (files: FileList) => {
    const previews: { src: string; type: string }[] = [];
    const loadingState: boolean[] = [];

    Array.from(files).forEach((file, index) => {
      loadingState.push(true);
      setLoading([...loadingState]);

      const reader = new FileReader();
      reader.onload = () => {
        previews.push({ src: reader.result as string, type: file.type });
        setFilePreviews([...previews]);

        loadingState[index] = false;
        setLoading([...loadingState]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeletePreview = (index: number) => {
    if (mode === 'view') return;
    const updatedPreviews = [...filePreviews];
    updatedPreviews.splice(index, 1);
    setFilePreviews(updatedPreviews);
  };

  const addNewtab = (src: string) => {
    window.open(src, '_blank');
  };

  return (
    <Card>
      <CardBody>
        <div className="relative  w-[160px]" style={{ height: `${height}px` }}>
          <div
            className={`h-full w-full border-2 border-dashed border-blue-300 text-center text-xs ${
              isDragging ? 'bg-blue-100' : ''
            } ${mode === 'view' ? 'cursor-not-allowed opacity-50' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Input
              id="file-input"
              type="file"
              {...props}
              onChange={handleFileInputChange}
              className="hidden"
              multiple
              disabled={mode === 'view'}
            />
            <label
              htmlFor={props.id || 'file-input'}
              className={`flex h-full w-full cursor-pointer flex-col items-center justify-center text-gray-500 ${
                mode === 'view' ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {mode !== 'view' && (
                <>
                  <p>Drag & drop your files here</p>
                  <TbUpload className="text-1xl my-2" />
                  <span>Browse for files</span>
                </>
              )}
            </label>
          </div>

          {filePreviews.length > 0 && (
            <div className="absolute inset-0 flex flex-wrap items-center justify-center border-2 border-dashed border-blue-500 bg-white bg-opacity-90">
              {filePreviews.map((preview, index) => (
                <div key={index} className="relative h-full w-full ">
                  <div className="relative h-full w-full">
                    {loading[index] ? (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200">
                        <span className="loader" />
                        {'Loading...'}
                      </div>
                    ) : (
                      // now we can show the specific file image or pdf
                      <>
                        {preview.type === 'pdf' ||
                        preview.type === 'application/pdf' ? (
                          <div className="flex h-full w-full flex-col items-center justify-center p-2">
                            <div
                              className="pdf-thumbnail "
                              onClick={() => addNewtab(preview.src)}
                              style={{
                                cursor: 'pointer',
                              }}
                            >
                              <AiOutlineFilePdf className="text-5xl text-red-600" />
                              <p className="text-sm">PDF File</p>
                            </div>
                          </div>
                        ) : (
                          <Image
                            src={preview.src}
                            alt={`Image Preview`}
                            className="flex h-full w-full flex-col items-center justify-center object-contain"
                            fill
                            sizes="100%"
                            onClick={() => addNewtab(preview.src)}
                            style={{
                              cursor: 'pointer',
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                  {mode !== 'view' && (
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      onClick={() => handleDeletePreview(index)}
                      className="absolute right-1 top-1 z-10 rounded-full p-1 text-red-700"
                    >
                      <IoCloseSharp className="text-xl" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {uploadProgress !== null && (
            <Progress
              value={uploadProgress}
              maxValue={100}
              className="absolute bottom-0 left-0 right-0"
              color="primary"
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default FileUpload;
