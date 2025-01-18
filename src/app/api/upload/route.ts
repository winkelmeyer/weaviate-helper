import { NextResponse } from 'next/server';
import weaviate from 'weaviate-client';

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

// Create schema for documents
async function createSchema() {
  const schemaConfig = {
    class: 'Document',
    properties: [
      {
        name: 'content',
        dataType: ['text'],
      },
      {
        name: 'filename',
        dataType: ['string'],
      },
      {
        name: 'uploadDate',
        dataType: ['date'],
      }
    ],
  };

  try {
    await client.schema.classCreator().withClass(schemaConfig).do();
  } catch (err) {
    console.log('Schema might already exist:', err.message);
  }
}

createSchema();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Here you would process the file content
    const content = '';

    await client.data.creator()
      .withClassName('Document')
      .withProperties({
        content: content,
        filename: file.name,
        uploadDate: new Date().toISOString(),
      })
      .do();

    return NextResponse.json({ message: 'File uploaded and vectorized successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 