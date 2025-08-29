declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

export const initTelegramWebApp = () => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
  }
  return tg;
};

export const hapticFeedback = {
  light: () => window.Telegram?.WebApp.HapticFeedback.impactOccurred('light'),
  medium: () => window.Telegram?.WebApp.HapticFeedback.impactOccurred('medium'),
  heavy: () => window.Telegram?.WebApp.HapticFeedback.impactOccurred('heavy'),
  success: () => window.Telegram?.WebApp.HapticFeedback.notificationOccurred('success'),
  error: () => window.Telegram?.WebApp.HapticFeedback.notificationOccurred('error'),
  warning: () => window.Telegram?.WebApp.HapticFeedback.notificationOccurred('warning'),
  selection: () => window.Telegram?.WebApp.HapticFeedback.selectionChanged(),
};

export const getTelegramUser = () => {
  return window.Telegram?.WebApp.initDataUnsafe?.user;
};