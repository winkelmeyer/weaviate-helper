'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, FileText } from "lucide-react";
import axios from 'axios';

interface Document {
  properties: {
    filename: string;
    uploadDate: string;
  };
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/api/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('/api/upload', formData);
      setSelectedFile(null);
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Document Vectorization System</h1>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <Input
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="max-w-[300px]"
            />
            {selectedFile && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-gray-600">
                  Selected: {selectedFile.name}
                </p>
                <Button onClick={handleUpload}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload and Vectorize
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Uploaded Documents</h2>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border-b last:border-b-0"
              >
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{doc.properties.filename}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(doc.properties.uploadDate).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 