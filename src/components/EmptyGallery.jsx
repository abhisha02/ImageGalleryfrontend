import React from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';

const EmptyGallery = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
      <ImageIcon size={64} className="text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Your gallery is empty</h3>
      <p className="text-gray-500 mb-4"><Upload size={16} className="inline-block mr-1" />Start adding images to create your collection </p>
      
    </div>
  );
};

export default EmptyGallery;