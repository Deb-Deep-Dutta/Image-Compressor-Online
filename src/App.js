
import React, { useState } from 'react';

const ImageCompressor = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [error, setError] = useState(null);
  const [quality, setQuality] = useState('50');

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.name && file.size) {
        if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml' || file.type === 'image/gif') {
          setSelectedImage(file);
          setError(null);
        } else {
          setError('Only JPEG, PNG, SVG and GIF files are allowed');
        }
      } else {
        setError('Invalid file');
      }
    }
  };

  const handleCompressImage = () => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        setCompressedImage(blob);
      }, 'image/jpeg', quality / 100);
    };
    img.src = URL.createObjectURL(selectedImage);
  };

  const handleUploadNewImage = () => {
    setSelectedImage(null);
    setCompressedImage(null);
    setError(null);
  };

  const handleQualityChange = (event) => {
    setQuality(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Image Compressor Online</h1>
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer relative">
          <input
            type="file"
            accept=".jpg, .jpeg, .png, .svg, .gif"
            onChange={handleImageChange}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
          {selectedImage ? (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected Image"
              className="w-full h-full object-cover"
            />
          ) : (
            <div>
              <p className="text-gray-600">Drag and drop or click to upload.</p>
              <p className="text-gray-600">JPEG, PNG, SVG or GIF files</p>
            </div>
          )}
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {selectedImage && (
          <div className="mt-4">
            <select
              value={quality}
              onChange={handleQualityChange}
              className="w-full p-2 bg-gray-200 rounded-lg"
            >
              <option value="80">Highest quality (80% quality)</option>
              <option value="50">Average compression (50% quality)</option>
              <option value="10">Least size (10% quality)</option>
            </select>
            <button
              onClick={handleCompressImage}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg mt-2"
            >
              Compress Image
            </button>
            {compressedImage && (
              <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg mt-4">
                <img
                  src={URL.createObjectURL(compressedImage)}
                  alt="Compressed Image"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(compressedImage);
                    link.download = 'compressed-image.jpg';
                    link.click();
                  }}
                  className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-lg mt-2"
                >
                  Download Compressed Image
                </button>
              </div>
            )}
          </div>
        )}
        {selectedImage && (
          <div className="mt-4">
            <button
              onClick={handleUploadNewImage}
              className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg"
            >
              Upload New Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCompressor;