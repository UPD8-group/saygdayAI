import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import * as cheerio from 'cheerio';

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── POST /api/train ──────────────────────────────────────────────────────────
// Accepts { url, clientId } in the request body.
// 1. Fetches the target URL and extracts readable text via cheerio.
// 2. TODO: Split text into fixed-size chunks (e.g. 500 tokens each).
// 3. TODO: Generate vector embeddings for each chunk (e.g. via OpenAI Embeddings API).
// 4. TODO: Upsert embeddings + metadata into a Vector DB namespace keyed by clientId
//          (e.g. Pinecone index or Supabase pgvector table).
app.post('/api/train', async (req, res) => {
  const { url, clientId } = req.body;

  if (!url || !clientId) {
    return res.status(400).json({ error: 'url and clientId are required.' });
  }

  let pageText = '';

  try {
    // Fetch the target webpage
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SayGdayBot/1.0 (+https://saygday.ai)' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // Use cheerio to parse HTML and extract clean text
    const $ = cheerio.load(html);

    // Remove non-content elements that add noise
    $('script, style, nav, header, footer, [aria-hidden="true"]').remove();

    // Extract and clean the main body text
    pageText = $('body')
      .text()
      .replace(/\s+/g, ' ')   // collapse whitespace
      .trim();

  } catch (err) {
    return res.status(502).json({ error: `Scraping failed: ${err.message}` });
  }

  // ── PLACEHOLDER: Text chunking ─────────────────────────────────────────────
  // Example implementation (replace with your preferred tokeniser):
  //
  //   const CHUNK_SIZE = 500;   // characters (swap for token count when ready)
  //   const chunks = [];
  //   for (let i = 0; i < pageText.length; i += CHUNK_SIZE) {
  //     chunks.push(pageText.slice(i, i + CHUNK_SIZE));
  //   }
  //
  const chunkCount = Math.ceil(pageText.length / 500); // mock value

  // ── PLACEHOLDER: Vector embedding & upsert ────────────────────────────────
  // Example implementation using OpenAI + Pinecone:
  //
  //   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  //   const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  //   const index = pinecone.index('saygday').namespace(clientId);
  //
  //   for (const [i, chunk] of chunks.entries()) {
  //     const { data } = await openai.embeddings.create({
  //       model: 'text-embedding-3-small',
  //       input: chunk,
  //     });
  //     await index.upsert([{ id: `${clientId}-chunk-${i}`, values: data[0].embedding, metadata: { chunk } }]);
  //   }

  // Mock success response (remove when real embedding logic is wired up)
  return res.json({
    success: true,
    clientId,
    url,
    charCount: pageText.length,
    chunkCount,
    message: `Successfully scraped and queued ${chunkCount} chunks for embedding. Plug in your Vector DB to complete the pipeline.`,
  });
});

// ─── POST /api/chat ───────────────────────────────────────────────────────────
// Accepts { message, clientId } in the request body.
// 1. TODO: Embed the user message using the same model as the training step.
// 2. TODO: Query the Vector DB namespace for clientId to retrieve top-k similar chunks.
// 3. TODO: Pass retrieved chunks + user message as context to an LLM (e.g. Claude / GPT-4o).
// 4. Return the LLM reply to the widget.
app.post('/api/chat', async (req, res) => {
  const { message, clientId } = req.body;

  if (!message || !clientId) {
    return res.status(400).json({ error: 'message and clientId are required.' });
  }

  // ── PLACEHOLDER: RAG retrieval ────────────────────────────────────────────
  // Example implementation:
  //
  //   const queryEmbedding = await openai.embeddings.create({ model: 'text-embedding-3-small', input: message });
  //   const results = await pinecone.index('saygday').namespace(clientId).query({
  //     vector: queryEmbedding.data[0].embedding,
  //     topK: 5,
  //     includeMetadata: true,
  //   });
  //   const context = results.matches.map(m => m.metadata.chunk).join('\n\n');
  //
  //   const completion = await openai.chat.completions.create({
  //     model: 'gpt-4o',
  //     messages: [
  //       { role: 'system', content: `You are a helpful assistant for a business. Use this context:\n\n${context}` },
  //       { role: 'user', content: message },
  //     ],
  //   });
  //   const reply = completion.choices[0].message.content;

  // Mock RAG response keyed by clientId (replace with real LLM call above)
  const mockResponses = {
    CUSTOMER_ID_123: `G'day! Thanks for reaching out. Based on what I know about this business, I'd be happy to help with: "${message}". (This is a mock response — connect your Vector DB and LLM to go live!)`,
  };

  const reply =
    mockResponses[clientId] ||
    `G'day! I'm the AI assistant for client ${clientId}. You asked: "${message}". Train me with your website content to get real answers!`;

  return res.json({ reply, clientId });
});

// ─── Export as a Netlify serverless function ──────────────────────────────────
export const handler = serverless(app);
