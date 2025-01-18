import { NextResponse } from 'next/server';
import weaviate from 'weaviate-client';

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

export async function GET() {
  try {
    const result = await client.data.getter()
      .withClassName('Document')
      .withLimit(100)
      .do();

    return NextResponse.json(result.objects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
} 