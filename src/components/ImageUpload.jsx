import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { uploadImages } from '../features/images/imageSlice';
import { X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageUpload = () => {
  const [files, setFiles] = useState([]);
  const [titles, setTitles] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();

  const handleFileChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    setTitles(prevTitles => {
      const newTitles = { ...prevTitles };
      selectedFiles.forEach((file) => {
        newTitles[file.name] = '';
      });
      return newTitles;
    });
  }, []);

  const handleTitleChange = useCallback((fileName, title) => {
    setTitles(prevTitles => ({ ...prevTitles, [fileName]: title }));
  }, []);

  const handleRemoveFile = useCallback((fileName) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    setTitles(prevTitles => {
      const newTitles = { ...prevTitles };
      delete newTitles[fileName];
      return newTitles;
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`image`, file);
      formData.append(`title`, titles[file.name] || `Untitled ${index + 1}`);
    });
    try {
      await dispatch(uploadImages(formData)).unwrap();
      toast.success('Images uploaded successfully!');
      setFiles([]);
      setTitles({});
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(typeof error === 'string' ? error : 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  }, [files, titles, dispatch]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-55 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*" />
        </label>
      </div>
      
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {files.map((file, index) => (
          <div key={file.name} className="col">
            <div className="position-relative">
              <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  className="w-100 h-100 object-fit-cover rounded"
                />
              </div>
              <input
                type="text"
                placeholder="Enter title"
                value={titles[file.name] || ''}
                onChange={(e) => handleTitleChange(file.name, e.target.value)}
                className="form-control mt-2"
              />
              <button
                type="button"
                onClick={() => handleRemoveFile(file.name)}
                className="btn btn-sm position-absolute top-0 end-0 m-2"
                style={{ backgroundColor: '#A9A9A9', color: 'white' }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {files.length > 0 && (
        <button
          type="submit"
          disabled={isUploading}
          className={`btn w-100 ${isUploading ? 'disabled' : ''}`}
          style={{ backgroundColor: '#A9A9A9', color: 'white' }}
        >
          {isUploading ? 'Uploading...' : `Upload ${files.length} ${files.length === 1 ? 'Image' : 'Images'}`}
        </button>
      )}
    </form>
  );
};

export default ImageUpload;