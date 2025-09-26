import React, { useRef } from 'react';
import { toast } from 'react-hot-toast';

const Preview = ({ content, title }) => {
  const previewRef = useRef(null);

  const copiarTexto = () => {
    if (previewRef.current) {
      navigator.clipboard.writeText(previewRef.current.innerText);
      toast.success('Texto copiado!');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <button
          onClick={copiarTexto}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Copiar Texto
        </button>
      </div>
      <div
        ref={previewRef}
        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg max-h-96 overflow-y-auto"
      >
        <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
          {content}
        </pre>
      </div>
    </div>
  );
};

export default Preview;