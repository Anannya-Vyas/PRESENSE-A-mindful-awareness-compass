# Presense - A Mindful Presence Tracking App

Presense explores the idea of making attention visible. The system detects when a person's attention drifts away from the present moment and gently reminds them to come back through awareness.

## The Presence Compass

At the center of the system is the Presence Compass, which shows where attention currently resides across four territories of the mind:

- **Past (Purple)**: Nostalgia, regret, memories, "should have" thoughts
- **Future (Blue)**: Planning, anxiety, "what if" scenarios, anticipation  
- **Internal (Green)**: Daydreaming, self-talk, analysis, logical thinking
- **External (Orange)**: Distractions, notifications, noise, other people
- **Center (Gray)**: Present moment awareness, mindfulness

## Features

- **Interactive Compass**: Click anywhere on the compass to check in with your current mental state
- **AI-Powered Nudges**: Receive personalized, gentle reminders using Google Gemini AI
- **Distance Tracking**: The further from center, the more you've drifted from presence
- **Check-in History**: Track your mental states throughout the day
- **Beautiful UI**: Glass morphism design with smooth animations

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- PostgreSQL database (we recommend [Neon](https://neon.tech) for free hosting)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd miniproject_app
npm install
```

### 2. Database Setup
1. **Create a free Neon database** at [https://neon.tech](https://neon.tech)
2. **Copy your connection string** from the Neon dashboard
3. **Create a `.env` file** in the root directory:
```env
# Get your free Neon database from: https://neon.tech
DATABASE_URL="postgresql://username:password@hostname:5432/presense_db?sslmode=require"

# Get your JWT secret from: https://jwt.io/
JWT_SECRET="your-super-secret-jwt-key-here"

# Gemini API Key (optional - will use fallback nudges if not provided)
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here

# App Configuration
REACT_APP_APP_URL=http://localhost:3000
```

### 3. Database Migrations
5. Start the development server:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## How to Use

1. **Check In**: Click anywhere on the compass to indicate where your mind is
2. **Receive Nudges**: Get AI-powered gentle reminders to return to presence
3. **Track Patterns**: View your check-in history to notice attention patterns
4. **Practice Awareness**: Use the nudges to gently return to the present moment

## AI Integration

The app uses Google's Gemini API to generate contextual, mindful nudges based on:

- Your current mental territory (quadrant)
- Distance from center (how far you've drifted)
- Time of day
- Previous check-in patterns

**Fallback Mode**: If no API key is provided, the app uses thoughtful pre-written nudges.

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Custom CSS with glass morphism design
- **AI**: Google Gemini API
- **Build Tool**: Create React App with CRACO
- **Animations**: CSS transitions and transforms

## Project Structure

```
src/
├── components/
│   └── PresenceCompassCSS.tsx    # Main compass component
├── services/
│   └── aiService.ts              # AI integration service
├── styles.css                    # Custom CSS styles
├── App.tsx                      # Main app component
└── index.css                     # Global styles
```

## Design Philosophy

- **Gentle, Not Forceful**: Nudges guide awareness rather than demanding focus
- **Beautiful & Calm**: Soothing visual design that doesn't add to mental clutter
- **Pattern Awareness**: Help users understand their attention patterns without judgment
- **Present Moment Focus**: The goal is experiencing moments, not productivity

## Available Scripts

```bash
npm start       # Runs the app in development mode
npm run build   # Builds the app for production
npm test        # Launches the test runner
```

## Contributing

This app is part of a mindfulness project focused on presence and awareness. Contributions that align with the gentle, non-judgmental philosophy are welcome.

## License

This project is open source and available under the MIT License.

---

**Built with for moments of presence**
