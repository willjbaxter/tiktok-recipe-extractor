# tiktok-recipe-extractor
Transform TikTok cooking videos into structured, easy-to-follow recipe formats

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Configuration

To use Google's Gemini API, you need to provide your Gemini API key.

1. Open the `src/components/panels/configPanel.tsx` file.
2. Enter your Gemini API key in the designated field.

### Obtaining a Gemini API Key

1. Visit [Google Gemini API](https://developers.google.com/gemini) to sign up and obtain your API key.
2. Once you have the API key, add it to your `.env` file as follows:

    ```env
    GEMINI_API_KEY=your_gemini_api_key
    ```

3. Ensure that your `.env` file is included in `.gitignore` to keep your API key secure.
