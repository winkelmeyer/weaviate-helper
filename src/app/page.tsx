'use client';

import { useState } from 'react';
import { DocumentList } from '@/components/DocumentList';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage({ text: 'Please select files to upload', type: 'error' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const documents = await Promise.all(
        files.map(async (file) => {
          const text = await file.text();
          return {
            fileName: file.name,
            content: text,
            mimeType: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString()
          };
        })
      );

      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documents)
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setMessage({ text: 'Files uploaded successfully!', type: 'success' });
      setFiles([]);
    } catch (error) {
      setMessage({ text: 'Failed to upload files. Please try again.', type: 'error' });
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

    return (
        <main className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Document Upload</h1>
                
                <div className="grid gap-8">
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                                id="fileInput"
                                accept=".txt,.pdf,.doc,.docx"
                            />
                            <label
                                htmlFor="fileInput"
                                className="cursor-pointer text-blue-500 hover:text-blue-600"
                            >
                                Click to select files or drag them here
                            </label>
                            
                            {files.length > 0 && (
                                <div className="mt-4">
                                    <p className="font-semibold">Selected files:</p>
                                    <ul className="mt-2 text-sm">
                                        {files.map((file, index) => (
                                            <li key={index} className="text-gray-600">
                                                {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={uploading || files.length === 0}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                                uploading || files.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        >
                            {uploading ? 'Uploading...' : 'Upload Files'}
                        </button>

                        {message && (
                            <div
                                className={`p-4 rounded-md ${
                                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}
                            >
                                {message.text}
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4">Uploaded Documents</h2>
                        <DocumentList />
                    </div>
                </div>
            </div>
        </main>
  );
} 