# Friday Bingo - Telegram Mini App & Bot

A real-time multiplayer Bingo game built for Telegram with betting functionality, multi-language support (English/Amharic), and Firebase integration.

## 🎯 Features

- **Real-time Multiplayer Bingo**: Live game synchronization across all players
- **Telegram Integration**: Native Telegram Mini App with bot commands
- **Betting System**: Room-based betting with balance management
- **Multi-language**: Complete Amharic and English translations
- **Payment Processing**: CBE and Telebirr payment integration
- **Admin Controls**: Room and user management commands
- **100 Unique Cards**: Pre-generated bingo cards with proper validation

## 🚀 Quick Start

### 1. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Realtime Database
3. Copy your Firebase configuration
4. Update the `.env` file with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 2. Telegram Bot Setup

1. Create a new bot with [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Set up the mini app:
   ```
   /newapp
   @your_bot_username
   Friday Bingo
   Description: Play exciting bingo games and win big!
   Photo: (upload a bingo-themed image)
   Web App URL: https://your-vercel-app.vercel.app
   ```

4. Update bot configuration:
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_WEBHOOK_SECRET=your_webhook_secret
   ```

### 3. Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy the frontend

### 4. Set up Bot Webhook

1. Deploy the bot to Vercel Functions
2. Set webhook URL:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-vercel-app.vercel.app/api/webhook
   ```

## 🎮 Game Flow

### Player Journey

1. **Start**: Player uses `/playgame` command
2. **Registration**: Auto-register with +50 balance for new users
3. **Room Selection**: Choose from available rooms or demo room
4. **Card Selection**: Pick from available bingo cards
5. **Betting**: Place bet (deducted from balance)
6. **Game Play**: Mark numbers as they're drawn
7. **Bingo Call**: Call bingo when pattern is complete
8. **Payout**: Winner receives 90% of total pot

### Admin Controls

- `/createroom <name> <bet_amount> <max_players>` - Create new room
- `/editroom <room_id> <field> <value>` - Edit room settings
- `/addbalance <username> <amount>` - Add balance to user
- `/removebalance <username> <amount>` - Remove balance from user
- `/roomstatus` - View all rooms and their status

## 💰 Payment System

### Deposit Flow (`/deposit`)

1. Player chooses payment method (CBE/Telebirr)
2. Player provides SMS receipt or transaction details
3. Bot validates transaction uniqueness
4. If valid, balance is added automatically

### Withdrawal Flow (`/withdraw`)

1. Player provides bank details and amount
2. Bot checks sufficient balance
3. Admin receives notification with approval button
4. After admin approval, player is notified

## 🏗 Architecture

### Frontend (Mini App)
- **React + TypeScript**: Type-safe component architecture
- **TailwindCSS**: Utility-first styling with custom design system
- **Firebase SDK**: Real-time database integration
- **React Router**: Client-side routing for SPA experience

### Backend (Telegram Bot)
- **Node.js + Telegraf**: Modern Telegram bot framework
- **Firebase Admin**: Server-side database operations
- **Puppeteer**: Web scraping for Telebirr validation
- **PDF-Parse**: CBE receipt processing
- **Express**: Webhook handling

### Database Schema (Firebase)
```
/users/{userId}
  - id: string
  - username: string
  - balance: number
  - totalWins: number
  - totalGames: number
  - createdAt: timestamp

/rooms/{roomId}
  - id: string
  - name: string
  - betAmount: number
  - maxPlayers: number
  - isActive: boolean
  - isDemo: boolean
  - createdAt: timestamp

/games/{roomId}
  - id: string
  - roomId: string
  - status: 'waiting' | 'countdown' | 'playing' | 'ended'
  - drawnNumbers: number[]
  - players: { [userId]: GamePlayer }
  - startTime?: timestamp
  - endTime?: timestamp
  - winner?: string

/transactions/{transactionId}
  - id: string
  - userId: string
  - type: 'deposit' | 'withdraw' | 'bet' | 'win'
  - amount: number
  - status: 'pending' | 'completed' | 'failed'
  - details: object
  - createdAt: timestamp
```

## 🔧 Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Deploy Bot
```bash
# Deploy to Vercel Functions
vercel --prod
```

## 📱 Bot Commands

### Player Commands
- `/start` - Welcome message and registration
- `/playgame` - Launch the bingo mini app
- `/balance` - Check current balance
- `/deposit` - Deposit money (CBE/Telebirr)
- `/withdraw` - Withdraw winnings
- `/help` - Show available commands

### Admin Commands
- `/admin` - Access admin panel
- `/createroom <name> <amount> <players>` - Create new room
- `/rooms` - List all rooms
- `/users` - List all users
- `/addbalance <username> <amount>` - Add balance
- `/transactions` - View recent transactions

## 🌐 Language Support

The app supports both English and Amharic with complete translations for:
- All UI elements and messages
- Bot command responses
- Error messages and notifications
- Game status updates
- Payment flow instructions

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) - Main actions and branding
- **Secondary**: Purple (#8B5CF6) - Accent elements
- **Success**: Green (#10B981) - Wins and confirmations
- **Warning**: Yellow (#F59E0B) - Alerts and pending states
- **Error**: Red (#EF4444) - Errors and failures
- **Gold**: Custom gold palette for premium elements

### Typography
- **Font**: Inter (300, 400, 500, 600, 700, 800)
- **Headings**: 120% line height
- **Body**: 150% line height
- **Spacing**: 8px base system

### Components
- **Cards**: Rounded corners (12px), subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Animations**: Smooth transitions (200-300ms)
- **Responsive**: Mobile-first with proper breakpoints

## 🔐 Security

- Input validation on all user inputs
- Transaction uniqueness verification
- Balance checks before betting
- Admin command authorization
- Secure webhook validation

## 📊 Game Rules

### Bingo Cards
- 100 unique pre-generated cards
- Standard BINGO format: B(1-15), I(16-30), N(31-45), G(46-60), O(61-75)
- Center square is always FREE
- Players must mark 24 numbers for valid bingo

### Game Flow
1. Minimum 2 players required to start
2. 30-second countdown before game begins
3. 25 numbers drawn over 50 seconds (2s intervals)
4. Players mark numbers in real-time
5. First valid bingo wins 90% of total pot
6. 10% house edge retained

### Betting
- Demo room: Free play, no real money
- Betting rooms: Fixed bet amounts per room
- Balance deducted immediately upon joining
- Winnings distributed automatically

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Add environment variables
3. Deploy automatically on push

### Bot (Vercel Functions)
1. Bot runs as serverless functions
2. Webhook handles Telegram updates
3. Firebase handles persistent state

## 📞 Support

For technical support or questions about the Friday Bingo system, contact the development team.

**Author**: BOLT4L
**Version**: 1.0.0
**License**: Private