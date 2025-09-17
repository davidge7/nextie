# Next.js Chat Application with Gemini AI

A modern chat application built with Next.js 13+ that integrates with Google's Gemini AI API to provide intelligent responses.

## Features

- 🚀 Built with Next.js 13+ App Router
- 🤖 Integration with Google's Gemini AI
- 🎨 Dark/Light mode support
- ⚡ Real-time chat interface
- 🔒 Secure API handling
- 📱 Responsive design

## Prerequisites

- Node.js 18.x or later
- npm or yarn package manager
- Google Gemini API key

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_API_BASE_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

## Project Structure

```
```
├── 📄 eslint.config.mjs
├── 🟨 next-env.d.ts
├── 🟨 next.config.ts
├── 🗂️ package-lock.json
├── 🗂️ package.json
├── 📄 postcss.config.mjs
├── 📁 public
│ ├── 🖼️ file.svg
│ ├── 🖼️ globe.svg
│ ├── 🖼️ next.svg
│ ├── 🖼️ vercel.svg
│ ├── 🖼️ window.svg
├── 📜 README.md
├── 📁 src
│ ├── 📁 app
│ │ ├── 📁 about
│ │ │ ├── 🟦 page.tsx
│ │ ├── 📁 api
│ │ │ ├── 📁 chat
│ │ │ │ ├── 🟨 route.ts
│ │ │ ├── 📁 github
│ │ │ │ ├── 🟨 route.ts
│ │ │ ├── 📁 review
│ │ │ │ ├── 🟨 route.ts
│ │ ├── 📁 blog
│ │ │ ├── 🟦 page.tsx
│ │ ├── 📁 chat
│ │ │ ├── 🟦 page.tsx
│ │ ├── 📁 code-reviewer
│ │ │ ├── 🟦 page.tsx
│ │ ├── 📁 contact
│ │ │ ├── 🟦 page.tsx
│ │ ├── 📄 favicon.ico
│ │ ├── 🖼️ favicon.png
│ │ ├── 🎨 globals.css
│ │ ├── 🟦 layout.tsx
│ │ ├── 🟦 page.tsx
│ ├── 📁 components
│ │ ├── 🟦 CodeInput.tsx
│ │ ├── 🟦 ErrorMessage.tsx
│ │ ├── 🟦 Loader.tsx
│ │ ├── 🟦 ReviewOutput.tsx
│ │ ├── 🟦 SuggestionCard.tsx
│ ├── 📁 lib
│ │ ├── 🟨 constants.ts
│ │ ├── 🟨 types.ts
├── 🗂️ tsconfig.json

```
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nextie
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Routes

### POST /api/chat
Handles chat messages and communicates with Gemini AI.

Request body:
```json
{
  "message": "Your message here"
}
```

Response:
```json
{
  "reply": "AI response here"
}
```

## Technologies Used

- Next.js 13+
- React
- Axios
- Google Gemini AI
- Environment Variables
- TypeScript/JavaScript

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Security Considerations

- Never commit your `.env` file
- Keep your API keys secure
- Use environment variables for sensitive data

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and feature requests, please create an issue in the repository.

## Acknowledgments

- Next.js team for the fantastic framework
- Google for the Gemini AI API
- Contributors and maintainers

---

Created with ♥ using [Next.js](https://nextjs.org)
