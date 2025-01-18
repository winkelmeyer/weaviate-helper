# Document Upload with Weaviate

A Next.js application for uploading and managing documents using Weaviate Cloud.

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
WEAVIATE_INSTANCE_URL=your-instance-url.weaviate.cloud
WEAVIATE_API_KEY=your-api-key
OPENAI_API_KEY=your-openai-api-key  # Optional: Only if using OpenAI modules
```

4. Replace the placeholder values in `.env.local` with your actual credentials:
   - `WEAVIATE_INSTANCE_URL`: Your Weaviate Cloud instance URL
   - `WEAVIATE_API_KEY`: Your Weaviate Cloud API key
   - `OPENAI_API_KEY`: (Optional) Your OpenAI API key if using OpenAI modules

5. Run the development server:
```bash
npm run dev
```

## Environment Variables

- `WEAVIATE_INSTANCE_URL`: The URL of your Weaviate Cloud instance
- `WEAVIATE_API_KEY`: API key for authenticating with Weaviate Cloud
- `OPENAI_API_KEY`: (Optional) API key for OpenAI integration

Make sure to never commit your `.env.local` file to version control.
# weaviate-helper
