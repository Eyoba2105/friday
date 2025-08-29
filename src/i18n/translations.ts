export const translations = {
  en: {
    // Header
    language: 'Language',
    balance: 'Balance',
    
    // Landing Page
    welcomeTitle: 'Welcome to Friday Bingo',
    welcomeSubtitle: 'Join exciting bingo games and win big!',
    availableRooms: 'Available Rooms',
    demoRoom: 'Demo Room',
    noRooms: 'No active rooms available',
    
    // Room Details
    betAmount: 'Bet Amount',
    maxPlayers: 'Max Players',
    currentPlayers: 'Current Players',
    gameStatus: 'Game Status',
    joinGame: 'Join Game',
    spectateGame: 'Spectate',
    insufficientBalance: 'Insufficient Balance',
    alreadyJoined: 'Already Joined',
    
    // Game Status
    waiting: 'Waiting for Players',
    countdown: 'Game Starting Soon',
    playing: 'Game in Progress',
    ended: 'Game Ended',
    
    // Bingo Card
    selectCard: 'Select Your Card',
    cardSelected: 'Card Selected',
    yourCard: 'Your Card',
    markedNumbers: 'Marked Numbers',
    callBingo: 'BINGO!',
    
    // Game Messages
    waitingForPlayers: 'Waiting for more players to join...',
    gameStartsIn: 'Game starts in',
    seconds: 'seconds',
    numberDrawn: 'Number drawn',
    gameEnded: 'Game has ended',
    winner: 'Winner',
    noWinner: 'No winner this round',
    youWon: 'Congratulations! You won',
    youLost: 'Better luck next time',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    cancel: 'Cancel',
    back: 'Back',
    close: 'Close',
    
    // Amounts
    birr: 'Birr',
    free: 'Free',
  },
  am: {
    // Header
    language: 'ቋንቋ',
    balance: 'ሂሳብ',
    
    // Landing Page
    welcomeTitle: 'እንኳን ወደ ዓርብ ቢንጎ በደህና መጣህ',
    welcomeSubtitle: 'አስደሳች ቢንጎ ጨዋታዎች ተጫወት እና ታላቅ ሽልማት አሸንፍ!',
    availableRooms: 'ያሉ ክፍሎች',
    demoRoom: 'ማሳያ ክፍል',
    noRooms: 'ምንም ንቁ ክፍል የለም',
    
    // Room Details
    betAmount: 'የውድድር መጠን',
    maxPlayers: 'ከፍተኛ ተጫዋቾች',
    currentPlayers: 'አሁን ያሉ ተጫዋቾች',
    gameStatus: 'የጨዋታ ሁኔታ',
    joinGame: 'ጨዋታ ተቀላቀል',
    spectateGame: 'መመልከት',
    insufficientBalance: 'በቂ ሂሳብ የለም',
    alreadyJoined: 'አስቀድሞ ተቀላቅለሃል',
    
    // Game Status
    waiting: 'ተጫዋቾችን እየጠበቀ',
    countdown: 'ጨዋታ በቅርቡ ይጀምራል',
    playing: 'ጨዋታ በመካሄድ ላይ',
    ended: 'ጨዋታ ተጠናቋል',
    
    // Bingo Card
    selectCard: 'ካርድህን ምረጥ',
    cardSelected: 'ካርድ ተመርጧል',
    yourCard: 'የአንተ ካርድ',
    markedNumbers: 'የተመለከቱ ቁጥሮች',
    callBingo: 'ቢንጎ!',
    
    // Game Messages
    waitingForPlayers: 'ተጫዋቾች እስኪቀላቀሉ ድረስ እየጠበቀ...',
    gameStartsIn: 'ጨዋታ ይጀምራል በ',
    seconds: 'ሰከንዶች',
    numberDrawn: 'የወጣ ቁጥር',
    gameEnded: 'ጨዋታ ተጠናቋል',
    winner: 'አሸናፊ',
    noWinner: 'በዚህ ዙር አሸናፊ የለም',
    youWon: 'እንኳን ደስ ያለህ! አሸንፈሃል',
    youLost: 'በሚቀጥለው ጊዜ እድል ይሻልህ',
    
    // Common
    loading: 'እየጫን...',
    error: 'ስህተት',
    success: 'ተሳክቷል',
    confirm: 'አረጋግጥ',
    cancel: 'ሰርዝ',
    back: 'ተመለስ',
    close: 'ዝጋ',
    
    // Amounts
    birr: 'ብር',
    free: 'ነፃ',
  }
};

export type TranslationKey = keyof typeof translations.en;