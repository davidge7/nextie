# Nextie - AI-Powered Development Suite

A modern development suite built with Next.js 14 that combines multiple AI-powered tools to enhance developer productivity.

## Core Features

### 🤖 AI Chat Assistant
- Real-time chat interface with Gemini AI
- Support for multiple AI models
- Response time tracking
- Dark/Light mode with smooth transitions
- Animated backgrounds and mouse follower effects
- Sleek, modern UI with Tailwind CSS

### 📝 Code Reviewer
- AI-powered code analysis using Gemini
- Support for multiple programming languages
- GitHub repository integration
- Severity-based feedback categorization
- Real-time code analysis
- Detailed suggestions with line references

### 🎨 Design Features
- Responsive design for all screen sizes
- Dynamic theme switching
- Glassmorphism effects
- Animated UI elements
- Interactive components

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS, Lucide Icons
- **AI Integration**: Google Gemini AI
- **HTTP Client**: Axios
- **Language**: TypeScript
- **Development**: ESLint, PostCSS

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
