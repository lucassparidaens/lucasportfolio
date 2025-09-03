# Lucas AI - EVI Integration Setup

## 🎙️ Empathic Voice Interface Integratie

Deze handleiding legt uit hoe je de volledige EVI (Empathic Voice Interface) applicatie integreert in je Lucas AI portfolio.

## 📁 Project Structuur

```
lucasportfolio-2/
├── lucas-ai.html          # Hoofdpagina met EVI integratie
├── evi-chatbot/           # Volledige Next.js EVI applicatie
│   ├── app/
│   ├── components/
│   ├── utils/
│   ├── package.json
│   └── .env.example
└── EVI-SETUP.md          # Deze handleiding
```

## 🚀 Setup Instructies

### Stap 1: Hume AI API Keys Verkrijgen

1. Ga naar [Hume AI Portal](https://beta.hume.ai/settings/keys)
2. Maak een account aan of log in
3. Genereer je API Key en Secret Key

### Stap 2: Environment Variables Configureren

1. Ga naar de `evi-chatbot` directory:
   ```bash
   cd evi-chatbot
   ```

2. Kopieer het voorbeeld environment bestand:
   ```bash
   cp .env.example .env.local
   ```

3. Open `.env.local` en voeg je API keys toe:
   ```env
   HUME_API_KEY=jouw_api_key_hier
   HUME_SECRET_KEY=jouw_secret_key_hier
   NEXT_PUBLIC_HUME_CONFIG_ID=jouw_config_id_hier  # Optioneel
   ```

### Stap 3: EVI Server Starten

1. Installeer dependencies (als nog niet gedaan):
   ```bash
   npm install
   ```

2. Start de development server:
   ```bash
   npm run dev
   ```

3. De server draait nu op `http://localhost:3000`

### Stap 4: Portfolio Pagina Openen

1. Open `lucas-ai.html` in je browser
2. Scroll naar de "Probeer Lucas AI Live" sectie
3. De EVI interface wordt geladen in een iframe

## 🎯 Functionaliteiten

### EVI Interface Features:
- **🧠 Emotie Herkenning**: Detecteert emoties in je stem
- **🗣️ Natuurlijke Spraak**: AI reageert met natuurlijke spraak
- **⚡ Real-time Response**: Directe audio verwerking
- **📱 Responsive Design**: Werkt op alle apparaten

### Portfolio Integratie:
- **📡 Auto-detectie**: Controleert of EVI server draait
- **🔄 Retry Functionaliteit**: Herlaad knop bij problemen
- **💫 Loading States**: Mooie loading en error states
- **🎨 Consistent Styling**: Past bij je portfolio design

## 🛠️ Troubleshooting

### Server Start Problemen

**Probleem**: "Missing required environment variables"
**Oplossing**: Controleer je `.env.local` bestand en zorg dat alle keys correct zijn.

**Probleem**: "Port 3000 already in use"
**Oplossing**: 
```bash
# Stop alle processen op poort 3000
sudo lsof -t -i tcp:3000 | xargs kill -9

# Of gebruik een andere poort
npm run dev -- -p 3001
```

### Browser Console Errors

**Probleem**: CORS errors in iframe
**Oplossing**: Dit is normaal voor cross-origin requests. De iframe functionality werkt nog steeds.

**Probleem**: Microphone access denied
**Oplossing**: Zorg dat je HTTPS gebruikt of sta microphone toe in browser settings.

### API Key Problemen

**Probleem**: "Unable to get access token"
**Oplossing**: 
1. Controleer of je API keys correct zijn
2. Zorg dat je Hume account actief is
3. Check API rate limits

## 🔧 Customization

### Iframe URL Aanpassen

Om een andere poort te gebruiken, pas de iframe src aan in `lucas-ai.html`:

```html
<iframe 
    id="evi-iframe"
    src="http://localhost:3001"  <!-- Nieuwe poort -->
    title="Lucas AI - Empathic Voice Interface Demo"
    allow="microphone; camera; autoplay"
    allowfullscreen>
</iframe>
```

### Styling Aanpassen

De EVI sectie styling staat in `lucas-ai.html` in de `<style>` sectie onder:
```css
/* EVI Section Styling */
.evi-section { ... }
```

## 📖 Meer Informatie

- [Hume AI Documentation](https://hume.docs.buildwithfern.com/)
- [EVI GitHub Repository](https://github.com/lucassparidaens/new.git)
- [Next.js Documentation](https://nextjs.org/docs)

## 🎉 Success!

Als alles correct is geconfigureerd, heb je nu:
- ✅ Een werkende EVI chatbot in je portfolio
- ✅ Emotie herkenning via spraak
- ✅ Real-time AI conversaties
- ✅ Professional portfolio integratie

Happy coding! 🚀
