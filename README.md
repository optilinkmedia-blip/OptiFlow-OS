# OptiFlow OS

OptiFlow OS is an autonomous full-stack affiliate content generation engine. 
It uses Gemini (`@google/genai`) and other optional integrations to discover keywords, generate content, and publish automatically.

## Integrations Status

**Fully Live / Implemented:**
- **Google Gemini**: Live (Used for generating SEO content, clusters, and images).
- **Apify / Pinterest Scraper**: Live (Used for scraping real-time search volume and trends).
- **WordPress**: Live (Posts articles automatically if configured with a Site URL, Username, and Application Password).
- **Pinterest**: Live (Creates real pins on a given board ID using the Pinterest v5 API).

**Simulated / Not Fully Implemented (Coming Soon):**
- **Telegram**: Simulated. The UI implies Telegram broadcasts, but there is no real Telegram Bot API call currently made.
- **Mailchimp**: Ping test implemented, but actual subscriber syncing or broadcasting is simulated.
- **SEO Mastermind / RapidAPI fallback**: Ping test implemented.

## Setup

See `.env.example` for required environment variables. 
The system requires `GEMINI_API_KEY` for basic functionality.
