const { Telegraf, Markup } = require('telegraf');
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.database();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Translations
const translations = {
  en: {
    welcome: "🎉 Welcome to Friday Bingo!\n\nYou've received 50 Birr as a welcome bonus. Start playing now!",
    balance: "💰 Your current balance: {amount} Birr",
    playGame: "🎮 Click below to start playing Friday Bingo!",
    deposit: "💳 Choose your payment method:",
    withdraw: "💸 Enter withdrawal details:",
    help: "🎯 Friday Bingo Commands:\n\n/playgame - Start playing bingo\n/balance - Check your balance\n/deposit - Add money to your account\n/withdraw - Withdraw your winnings\n/help - Show this help message",
    invalidAmount: "❌ Please enter a valid amount",
    insufficientBalance: "❌ Insufficient balance",
    depositSuccess: "✅ Deposit successful! {amount} Birr added to your account",
    withdrawalPending: "⏳ Withdrawal request submitted. Please wait for admin approval.",
  },
  am: {
    welcome: "🎉 እንኳን ወደ ዓርብ ቢንጎ በደህና መጣህ!\n\n50 ብር የመጀመሪያ ሽልማት ተቀብለሃል። አሁኑኑ መጫወት ጀምር!",
    balance: "💰 የአንተ ሂሳብ: {amount} ብር",
    playGame: "🎮 ዓርብ ቢንጎ ለመጫወት ከታች ጠቅ አድርግ!",
    deposit: "💳 የክፍያ ዘዴህን ምረጥ:",
    withdraw: "💸 የማውጣት ዝርዝሮችን አስገባ:",
    help: "🎯 የዓርብ ቢንጎ ትዕዛዞች:\n\n/playgame - ቢንጎ መጫወት ጀምር\n/balance - ሂሳብህን ተመልከት\n/deposit - ወደ መለያህ ገንዘብ አክል\n/withdraw - ያሸነፍከውን አውጣ\n/help - ይህንን የእርዳታ መልእክት አሳይ",
    invalidAmount: "❌ እባክህ ትክክለኛ መጠን አስገባ",
    insufficientBalance: "❌ በቂ ሂሳብ የለም",
    depositSuccess: "✅ ማስገባት ተሳክቷል! {amount} ብር ወደ መለያህ ታክሏል",
    withdrawalPending: "⏳ የማውጣት ጥያቄ ተልኳል። የአስተዳዳሪ ፈቃድ እየጠበቀ ነው።",
  }
};

// User language preference
const userLanguages = new Map();

const t = (userId, key, params = {}) => {
  const lang = userLanguages.get(userId) || 'en';
  let text = translations[lang][key] || translations.en[key];
  
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param]);
  });
  
  return text;
};

// Bot commands
bot.start(async (ctx) => {
  const userId = ctx.from.id.toString();
  const username = ctx.from.username || ctx.from.first_name;
  
  // Check if user exists
  const userRef = db.ref(`users/${userId}`);
  const snapshot = await userRef.once('value');
  
  if (!snapshot.exists()) {
    // Create new user with welcome bonus
    await userRef.set({
      id: userId,
      username: username,
      balance: 50,
      totalWins: 0,
      totalGames: 0,
      createdAt: Date.now()
    });
  }
  
  ctx.reply(t(userId, 'welcome'));
});

bot.command('playgame', (ctx) => {
  const userId = ctx.from.id.toString();
  
  ctx.reply(
    t(userId, 'playGame'),
    Markup.inlineKeyboard([
      Markup.button.webApp('🎮 Play Friday Bingo', process.env.VERCEL_URL || 'https://your-app.vercel.app')
    ])
  );
});

bot.command('balance', async (ctx) => {
  const userId = ctx.from.id.toString();
  
  const userRef = db.ref(`users/${userId}`);
  const snapshot = await userRef.once('value');
  const user = snapshot.val();
  
  if (user) {
    ctx.reply(t(userId, 'balance', { amount: user.balance }));
  } else {
    ctx.reply('❌ User not found. Please use /start first.');
  }
});

bot.command('deposit', (ctx) => {
  const userId = ctx.from.id.toString();
  
  ctx.reply(
    t(userId, 'deposit'),
    Markup.inlineKeyboard([
      [Markup.button.callback('🏦 CBE Bank', 'deposit_cbe')],
      [Markup.button.callback('📱 Telebirr', 'deposit_telebirr')]
    ])
  );
});

bot.command('withdraw', async (ctx) => {
  const userId = ctx.from.id.toString();
  
  // Check user balance
  const userRef = db.ref(`users/${userId}`);
  const snapshot = await userRef.once('value');
  const user = snapshot.val();
  
  if (!user || user.balance <= 0) {
    ctx.reply(t(userId, 'insufficientBalance'));
    return;
  }
  
  ctx.reply(t(userId, 'withdraw'));
  // Set user state for withdrawal flow
  await db.ref(`userStates/${userId}`).set({ action: 'withdraw', step: 'amount' });
});

bot.command('help', (ctx) => {
  const userId = ctx.from.id.toString();
  ctx.reply(t(userId, 'help'));
});

// Admin commands
bot.command('admin', async (ctx) => {
  const userId = ctx.from.id.toString();
  const adminIds = process.env.ADMIN_IDS?.split(',') || [];
  
  if (!adminIds.includes(userId)) {
    ctx.reply('❌ Access denied. Admin only.');
    return;
  }
  
  ctx.reply(
    '🔧 Admin Panel',
    Markup.inlineKeyboard([
      [Markup.button.callback('🏠 Manage Rooms', 'admin_rooms')],
      [Markup.button.callback('👥 Manage Users', 'admin_users')],
      [Markup.button.callback('💰 Transactions', 'admin_transactions')]
    ])
  );
});

bot.command('createroom', async (ctx) => {
  const userId = ctx.from.id.toString();
  const adminIds = process.env.ADMIN_IDS?.split(',') || [];
  
  if (!adminIds.includes(userId)) {
    ctx.reply('❌ Access denied. Admin only.');
    return;
  }
  
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 3) {
    ctx.reply('Usage: /createroom <name> <bet_amount> <max_players>');
    return;
  }
  
  const [name, betAmount, maxPlayers] = args;
  const roomId = `room_${Date.now()}`;
  
  await db.ref(`rooms/${roomId}`).set({
    id: roomId,
    name: name,
    betAmount: parseInt(betAmount),
    maxPlayers: parseInt(maxPlayers),
    isActive: true,
    isDemo: false,
    createdAt: Date.now()
  });
  
  ctx.reply(`✅ Room "${name}" created successfully!`);
});

// Callback handlers
bot.action('deposit_cbe', (ctx) => {
  ctx.editMessageText(
    '🏦 CBE Bank Deposit\n\nPlease send your SMS receipt as a PDF file or screenshot.',
    Markup.inlineKeyboard([
      [Markup.button.callback('« Back', 'deposit_back')]
    ])
  );
  
  // Set user state
  db.ref(`userStates/${ctx.from.id}`).set({ action: 'deposit', method: 'cbe' });
});

bot.action('deposit_telebirr', (ctx) => {
  ctx.editMessageText(
    '📱 Telebirr Deposit\n\nPlease send your SMS receipt text or transaction link.',
    Markup.inlineKeyboard([
      [Markup.button.callback('« Back', 'deposit_back')]
    ])
  );
  
  // Set user state
  db.ref(`userStates/${ctx.from.id}`).set({ action: 'deposit', method: 'telebirr' });
});

bot.action('deposit_back', (ctx) => {
  const userId = ctx.from.id.toString();
  
  ctx.editMessageText(
    t(userId, 'deposit'),
    Markup.inlineKeyboard([
      [Markup.button.callback('🏦 CBE Bank', 'deposit_cbe')],
      [Markup.button.callback('📱 Telebirr', 'deposit_telebirr')]
    ])
  );
});

// Handle text messages (for deposit/withdraw flows)
bot.on('text', async (ctx) => {
  const userId = ctx.from.id.toString();
  const userStateRef = db.ref(`userStates/${userId}`);
  const stateSnapshot = await userStateRef.once('value');
  const userState = stateSnapshot.val();
  
  if (!userState) return;
  
  if (userState.action === 'deposit') {
    await handleDepositFlow(ctx, userState);
  } else if (userState.action === 'withdraw') {
    await handleWithdrawFlow(ctx, userState);
  }
});

// Handle document uploads (for CBE receipts)
bot.on('document', async (ctx) => {
  const userId = ctx.from.id.toString();
  const userStateRef = db.ref(`userStates/${userId}`);
  const stateSnapshot = await userStateRef.once('value');
  const userState = stateSnapshot.val();
  
  if (userState?.action === 'deposit' && userState.method === 'cbe') {
    await handleCBEReceipt(ctx);
  }
});

async function handleDepositFlow(ctx, userState) {
  const userId = ctx.from.id.toString();
  const text = ctx.message.text;
  
  if (userState.method === 'telebirr') {
    // Process Telebirr SMS or link
    const transactionData = await processTelebirrTransaction(text);
    if (transactionData) {
      await processDeposit(userId, transactionData.amount, transactionData.transactionId);
      ctx.reply(t(userId, 'depositSuccess', { amount: transactionData.amount }));
    } else {
      ctx.reply('❌ Invalid transaction. Please check your SMS and try again.');
    }
  }
  
  // Clear user state
  await db.ref(`userStates/${userId}`).remove();
}

async function handleWithdrawFlow(ctx, userState) {
  const userId = ctx.from.id.toString();
  const text = ctx.message.text;
  
  if (userState.step === 'amount') {
    const amount = parseInt(text);
    if (isNaN(amount) || amount <= 0) {
      ctx.reply(t(userId, 'invalidAmount'));
      return;
    }
    
    // Check balance
    const userRef = db.ref(`users/${userId}`);
    const snapshot = await userRef.once('value');
    const user = snapshot.val();
    
    if (user.balance < amount) {
      ctx.reply(t(userId, 'insufficientBalance'));
      await db.ref(`userStates/${userId}`).remove();
      return;
    }
    
    // Update state for account details
    await db.ref(`userStates/${userId}`).update({ step: 'account', amount });
    ctx.reply('💳 Please provide your bank account number or Telebirr number:');
    
  } else if (userState.step === 'account') {
    const account = text;
    
    // Create withdrawal request
    const withdrawalId = `withdrawal_${Date.now()}`;
    await db.ref(`withdrawals/${withdrawalId}`).set({
      id: withdrawalId,
      userId: userId,
      username: ctx.from.username || ctx.from.first_name,
      amount: userState.amount,
      account: account,
      status: 'pending',
      createdAt: Date.now()
    });
    
    // Notify admins
    const adminIds = process.env.ADMIN_IDS?.split(',') || [];
    for (const adminId of adminIds) {
      try {
        await ctx.telegram.sendMessage(
          adminId,
          `💸 New Withdrawal Request\n\nUser: ${ctx.from.username || ctx.from.first_name}\nAmount: ${userState.amount} Birr\nAccount: ${account}`,
          Markup.inlineKeyboard([
            [Markup.button.callback('✅ Approve', `approve_withdrawal_${withdrawalId}`)],
            [Markup.button.callback('❌ Reject', `reject_withdrawal_${withdrawalId}`)]
          ])
        );
      } catch (error) {
        console.error('Error notifying admin:', error);
      }
    }
    
    ctx.reply(t(userId, 'withdrawalPending'));
    await db.ref(`userStates/${userId}`).remove();
  }
}

async function handleCBEReceipt(ctx) {
  const userId = ctx.from.id.toString();
  
  try {
    // Get file info
    const file = await ctx.telegram.getFile(ctx.message.document.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
    
    // Process PDF receipt (simplified - you'd implement actual PDF parsing)
    const transactionData = await processCBEReceipt(fileUrl);
    
    if (transactionData) {
      await processDeposit(userId, transactionData.amount, transactionData.transactionId);
      ctx.reply(t(userId, 'depositSuccess', { amount: transactionData.amount }));
    } else {
      ctx.reply('❌ Could not process receipt. Please try again or contact support.');
    }
  } catch (error) {
    console.error('Error processing CBE receipt:', error);
    ctx.reply('❌ Error processing receipt. Please try again.');
  }
  
  // Clear user state
  await db.ref(`userStates/${userId}`).remove();
}

async function processTelebirrTransaction(text) {
  // Extract transaction details from SMS text
  // This is a simplified implementation - you'd implement actual parsing
  const amountMatch = text.match(/(\d+(?:\.\d{2})?)\s*(?:birr|ETB)/i);
  const transactionMatch = text.match(/(?:ref|transaction|tx)[\s:]*([A-Z0-9]+)/i);
  
  if (amountMatch && transactionMatch) {
    const amount = parseFloat(amountMatch[1]);
    const transactionId = transactionMatch[1];
    
    // Check if transaction already used
    const transactionRef = db.ref(`transactions/${transactionId}`);
    const snapshot = await transactionRef.once('value');
    
    if (snapshot.exists()) {
      return null; // Transaction already used
    }
    
    return { amount, transactionId };
  }
  
  return null;
}

async function processCBEReceipt(fileUrl) {
  // Simplified CBE receipt processing
  // In production, you'd use PDF parsing and OCR
  return {
    amount: 100, // Extracted from PDF
    transactionId: `CBE_${Date.now()}`
  };
}

async function processDeposit(userId, amount, transactionId) {
  // Record transaction
  await db.ref(`transactions/${transactionId}`).set({
    id: transactionId,
    userId: userId,
    type: 'deposit',
    amount: amount,
    status: 'completed',
    createdAt: Date.now()
  });
  
  // Update user balance
  const userRef = db.ref(`users/${userId}`);
  const snapshot = await userRef.once('value');
  const user = snapshot.val();
  
  await userRef.update({
    balance: user.balance + amount
  });
}

// Admin withdrawal approval
bot.action(/approve_withdrawal_(.+)/, async (ctx) => {
  const withdrawalId = ctx.match[1];
  const withdrawalRef = db.ref(`withdrawals/${withdrawalId}`);
  const snapshot = await withdrawalRef.once('value');
  const withdrawal = snapshot.val();
  
  if (!withdrawal) {
    ctx.answerCbQuery('❌ Withdrawal not found');
    return;
  }
  
  // Update withdrawal status
  await withdrawalRef.update({ status: 'completed' });
  
  // Deduct from user balance
  const userRef = db.ref(`users/${withdrawal.userId}`);
  const userSnapshot = await userRef.once('value');
  const user = userSnapshot.val();
  
  await userRef.update({
    balance: user.balance - withdrawal.amount
  });
  
  // Notify user
  try {
    await ctx.telegram.sendMessage(
      withdrawal.userId,
      `✅ Withdrawal approved!\n\n${withdrawal.amount} Birr has been processed to your account.`
    );
  } catch (error) {
    console.error('Error notifying user:', error);
  }
  
  ctx.editMessageText(`✅ Withdrawal approved for ${withdrawal.username}`);
});

bot.action(/reject_withdrawal_(.+)/, async (ctx) => {
  const withdrawalId = ctx.match[1];
  const withdrawalRef = db.ref(`withdrawals/${withdrawalId}`);
  const snapshot = await withdrawalRef.once('value');
  const withdrawal = snapshot.val();
  
  if (!withdrawal) {
    ctx.answerCbQuery('❌ Withdrawal not found');
    return;
  }
  
  // Update withdrawal status
  await withdrawalRef.update({ status: 'rejected' });
  
  // Notify user
  try {
    await ctx.telegram.sendMessage(
      withdrawal.userId,
      `❌ Withdrawal request rejected. Please contact support for more information.`
    );
  } catch (error) {
    console.error('Error notifying user:', error);
  }
  
  ctx.editMessageText(`❌ Withdrawal rejected for ${withdrawal.username}`);
});

// Language selection
bot.action('lang_en', async (ctx) => {
  userLanguages.set(ctx.from.id.toString(), 'en');
  ctx.answerCbQuery('Language set to English');
});

bot.action('lang_am', async (ctx) => {
  userLanguages.set(ctx.from.id.toString(), 'am');
  ctx.answerCbQuery('ቋንቋ ወደ አማርኛ ተቀይሯል');
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('❌ An error occurred. Please try again later.');
});

// Webhook handler for Vercel
module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body);
      res.status(200).json({ ok: true });
    } else {
      res.status(200).json({ status: 'Bot is running' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};