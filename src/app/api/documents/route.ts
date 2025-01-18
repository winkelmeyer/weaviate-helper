import { NextResponse } from 'next/server';
import weaviate from 'weaviate-ts-client';

if (!process.env.WEAVIATE_INSTANCE_URL) {
  throw new Error('WEAVIATE_INSTANCE_URL is not set');
}
if (!process.env.WEAVIATE_API_KEY) {
  throw new Error('WEAVIATE_API_KEY is not set');
}

const client = weaviate.client({
  scheme: 'https',
  host: process.env.WEAVIATE_INSTANCE_URL,
  apiKey: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
  ...(process.env.OPENAI_API_KEY && {
    headers: {
      'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY
    }
  })
});

export const GET = async () => {
  try {
    const result = await client.data
      .getter()
      .withClassName('Document')
      .withLimit(100)
      .do();
      
    return NextResponse.json(result.objects);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export const POST = async (request: Request) => {
  try {
    const documents = await request.json();
    const batchSize = 100;
    let batcher = client.batch.objectsBatcher();
    let count = 0;

    for (const doc of documents) {
      console.log("🚀 ~ POST ~ doc:", doc)
      batcher = batcher.withObject({
        class: 'Document',
        properties: doc
      });

      count++;
      if (count === batchSize) {
        await batcher.do();
        batcher = client.batch.objectsBatcher();
        count = 0;
      }
    }

    // Insert any remaining documents
    if (count > 0) {
      await batcher.do();
    }

    return NextResponse.json({ message: 'Documents inserted successfully' });
  } catch (error) {
    console.error('Error inserting documents:', error);
    return NextResponse.json({ error: 'Failed to insert documents' }, { status: 500 });
  }
} 