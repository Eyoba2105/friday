# Telegram Bot Setup Guide

## 1. Create Telegram Bot

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot`
3. Choose a name: `Friday Bingo`
4. Choose a username: `friday_bingo_bot` (must end with 'bot')
5. Save the bot token provided

## 2. Configure Mini App

1. Send `/newapp` to BotFather
2. Select your bot: `@friday_bingo_bot`
3. App name: `Friday Bingo`
4. Description: `Play exciting bingo games and win big prizes!`
5. Upload an app photo (bingo-themed)
6. Web App URL: `https://your-vercel-app.vercel.app`
7. Short name: `fridaybingo`

## 3. Set Bot Commands

Send this to BotFather using `/setcommands`:

```
playgame - 🎮 Launch Friday Bingo game
balance - 💰 Check your balance
deposit - 💳 Add money to your account
withdraw - 💸 Withdraw your winnings
help - ❓ Show help and commands
```

## 4. Environment Variables

Add these to your Vercel project:

### Telegram Configuration
```
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
ADMIN_IDS=your_telegram_user_id,another_admin_id
VERCEL_URL=https://your-app.vercel.app
```

### Firebase Configuration
```
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-service-account-private-key
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
```

## 5. Set Webhook

After deploying to Vercel, set the webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-vercel-app.vercel.app/api/webhook"}'
```

## 6. Firebase Service Account

1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Download the JSON file
4. Extract these values for Vercel environment variables:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

## 7. Get Your Telegram User ID

1. Message [@userinfobot](https://t.me/userinfobot)
2. Copy your user ID
3. Add it to `ADMIN_IDS` environment variable

## 8. Test the Bot

1. Find your bot on Telegram
2. Send `/start` to register
3. Send `/playgame` to launch the mini app
4. Test deposit and withdrawal flows

## Bot Commands Reference

### Player Commands
- `/start` - Register and get welcome bonus
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
- `/addbalance <username> <amount>` - Add balance to user
- `/transactions` - View recent transactions

## Payment Integration

### CBE Bank
- Users upload PDF receipts
- Bot parses transaction details
- Validates uniqueness and adds balance

### Telebirr
- Users send SMS text or transaction link
- Bot scrapes transaction data
- Validates and processes deposit

## Security Notes

- All transactions are validated for uniqueness
- Admin approval required for withdrawals
- Balance checks before allowing bets
- Secure webhook validation
- Input sanitization on all user inputs

## Troubleshooting

### Common Issues

1. **Bot not responding**: Check webhook URL and bot token
2. **Firebase errors**: Verify service account credentials
3. **Mini app not loading**: Check CORS settings and app URL
4. **Payment processing fails**: Verify parsing logic and transaction validation

### Debug Commands

Check webhook status:
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

Test webhook locally:
```bash
ngrok http 3000
# Then set webhook to ngrok URL
```

## Production Checklist

- [ ] Bot token configured
- [ ] Mini app URL set in BotFather
- [ ] Firebase service account configured
- [ ] Webhook URL set and responding
- [ ] Admin user IDs configured
- [ ] Payment processing tested
- [ ] Error handling implemented
- [ ] Logging configured for monitoring