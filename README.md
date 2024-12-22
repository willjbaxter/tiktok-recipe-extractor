# TikTok Recipe Extractor

Transform TikTok cooking videos into structured, easy-to-follow recipe formats.

## 🛠️ **Getting Started**

### 🚀 **Installation**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/willjbaxter/tiktok-recipe-extractor.git
   cd tiktok-recipe-extractor
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   - **Create a `.env` File:**

     ```bash
     cp .env.example .env
     ```

   - **Add Your Gemini API Key:**

     Open `.env` and replace the placeholder with your actual Gemini API key.

     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

### 🛠️ **Running the Development Server**

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 🌐 **Deployment**

The recommended way to deploy your Next.js app is to use the Vercel Platform.

#### **Steps:**

1. **Push Your Code to GitHub:**

   ```bash
   git add .
   git commit -m "Configure environment variables and secure API keys"
   git push origin main
   ```

2. **Set Up Environment Variables on Vercel:**

   - Navigate to your project on Vercel.
   - Go to **Settings** > **Environment Variables**.
   - Add `GEMINI_API_KEY` with your actual API key.

3. **Deploy:**

   Vercel will automatically deploy your application using the provided environment variables.

## 🔑 **Configuration**

### **Gemini API Key**

To use Google's Gemini API, you need to provide your Gemini API key.

1. **Obtain a Gemini API Key:**

   - Visit [Google Gemini API](https://developers.google.com/gemini) to sign up and obtain your API key.

2. **Add to `.env` File:**

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Ensure Security:**

   - Keep your `.env` file out of version control by ensuring it's listed in `.gitignore`.
   - Do not share your API keys publicly.

## 📚 **Additional Information**

- **Next.js Documentation:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **Axios Documentation:** [https://axios-http.com/docs/intro](https://axios-http.com/docs/intro)
- **Dotenv Documentation:** [https://github.com/motdotla/dotenv](https://github.com/motdotla/dotenv)
- **Google Gemini API Documentation:** [https://developers.google.com/gemini](https://developers.google.com/gemini)

## 🤝 **Contributing**

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## 📄 **License**

[MIT](LICENSE)
