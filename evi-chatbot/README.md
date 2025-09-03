# Lucas EVI Chatbot (Next.js)

A Macintosh-styled Empathic Voice Interface (EVI) chatbot embedded in the portfolio under `lucas-ai.html`.

## Quick start

```bash
# from evi-chatbot/
npm install
npm run dev
```

- App will start at http://localhost:3000
- The portfolio page `lucas-ai.html` embeds this at `http://localhost:3000`

## Environment variables
Create a `.env.local` in `evi-chatbot/` with:

```
HUME_API_KEY=your_api_key
HUME_SECRET_KEY=your_secret_key
# Optional: Use a specific EVI config
NEXT_PUBLIC_HUME_CONFIG_ID=your_config_id
```

Get your keys from: https://beta.hume.ai/settings/keys

## Scripts
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm start` - run production server

## Notes
- The Start button in the chat header triggers the call inside the app.
- Microphone permissions are required for voice.
