'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Document {
    id: string;
    properties: {
        fileName: string;
        content: string;
        mimeType: string;
        size: number;
        uploadedAt: string;
    };
}

export function DocumentList() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch('/api/documents');
                if (!response.ok) {
                    throw new Error('Failed to fetch documents');
                }
                const data = await response.json();
                setDocuments(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch documents');
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    if (loading) {
        return <div className="text-center py-4">Loading documents...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    if (documents.length === 0) {
        return <div className="text-center py-4">No documents found</div>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
                <Card key={doc.id}>
                    <CardHeader>
                        <CardTitle className="text-lg">{doc.properties.fileName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <p className="text-muted-foreground">
                                Size: {(doc.properties.size / 1024).toFixed(1)} KB
                            </p>
                            <p className="text-muted-foreground">
                                Type: {doc.properties.mimeType}
                            </p>
                            <p className="text-muted-foreground">
                                Uploaded: {new Date(doc.properties.uploadedAt).toLocaleDateString()}
                            </p>
                            <div className="mt-4">
                                <p className="font-medium">Content Preview:</p>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {doc.properties.content}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}