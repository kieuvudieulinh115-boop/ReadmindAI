import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Grade, Badge, ReadingHistoryItem } from '../types';
import { INITIAL_BADGES } from '../data/badges';

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password?: string) => Promise<boolean>;
  register: (name: string, identifier: string, password: string, grade: Grade, avatar: string) => Promise<boolean>;
  loginAsGuest: (grade?: Grade, name?: string) => void;
  logout: () => void;
  updateProfile: (updatedFields: Partial<User>) => void;
  completeReading: (textId: string, textTitle: string, accuracy: number, wpm: number, quizScore?: number) => void;
  addXP: (amount: number, reason?: string) => void;
  addCoins: (amount: number, reason?: string) => void;
  spendCoins: (amount: number, itemId: string) => boolean;
  equipItem: (itemId: string, itemType: 'frame' | 'title') => boolean;
  unequipItem: (itemType: 'frame' | 'title') => void;
  unlockBadge: (badgeId: string) => void;
  recordEssaySubmission: (submission: import('../types').EssaySubmission) => void;
}

const STORAGE_KEY_USER = 'readmind_current_user';
const STORAGE_KEY_ACCOUNTS = 'readmind_accounts';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.coins === undefined) parsed.coins = 80;
        if (!parsed.unlockedItems) parsed.unlockedItems = [];
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load user', e);
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  // Helper to hash password mockingly using Base64 / SHA-safe representation
  const secureHash = (pwd: string) => {
    let hash = 0;
    for (let i = 0; i < pwd.length; i++) {
      const char = pwd.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return 'rm_h_' + Math.abs(hash).toString(36);
  };

  const getStoredAccounts = (): Record<string, any> => {
    try {
      const accs = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      return accs ? JSON.parse(accs) : {};
    } catch {
      return {};
    }
  };

  const login = async (identifier: string, password?: string): Promise<boolean> => {
    const accounts = getStoredAccounts();
    const cleanId = identifier.trim().toLowerCase();
    const matched = accounts[cleanId];

    if (!matched) {
      const newUser: User = {
        id: 'user_' + Date.now(),
        name: identifier.includes('@') ? identifier.split('@')[0] : identifier,
        username: identifier,
        email: identifier.includes('@') ? identifier : undefined,
        grade: 8,
        avatar: '🐱',
        xp: 150,
        coins: 100,
        streak: 1,
        completedTextIds: ['lop8-lacotheusauchuvang'],
        quizScores: { 'lop8-lacotheusauchuvang': 90 },
        badges: INITIAL_BADGES.slice(0, 2),
        unlockedItems: [],
        history: [{
          textId: 'lop8-lacotheusauchuvang',
          textTitle: 'Lá cờ thêu sáu chữ vàng',
          grade: 8,
          accuracy: 94,
          wpm: 125,
          completedAt: new Date(Date.now() - 86400000).toISOString(),
          quizScore: 90
        }],
        isGuest: false,
        createdAt: new Date().toISOString()
      };

      accounts[cleanId] = {
        passwordHash: password ? secureHash(password) : 'none',
        userData: newUser
      };
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
      setUser(newUser);
      return true;
    }

    if (password && matched.passwordHash !== 'none') {
      if (matched.passwordHash !== secureHash(password)) {
        return false;
      }
    }

    const loadedUser = matched.userData;
    if (loadedUser.coins === undefined) loadedUser.coins = 100;
    if (!loadedUser.unlockedItems) loadedUser.unlockedItems = [];
    setUser(loadedUser);
    return true;
  };

  const register = async (name: string, identifier: string, password: string, grade: Grade, avatar: string): Promise<boolean> => {
    const accounts = getStoredAccounts();
    const cleanId = identifier.trim().toLowerCase();

    const newUser: User = {
      id: 'user_' + Date.now(),
      name: name.trim() || 'Học sinh ReadMind',
      username: cleanId,
      email: identifier.includes('@') ? identifier : undefined,
      grade,
      avatar: avatar || '🐱',
      xp: 100,
      coins: 80,
      streak: 1,
      completedTextIds: [],
      quizScores: {},
      badges: [INITIAL_BADGES[0]],
      unlockedItems: [],
      history: [],
      isGuest: false,
      createdAt: new Date().toISOString()
    };

    accounts[cleanId] = {
      passwordHash: secureHash(password),
      userData: newUser
    };

    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
    setUser(newUser);
    return true;
  };

  const loginAsGuest = (grade: Grade = 8, name = 'Bạn nhỏ ham đọc') => {
    const guestUser: User = {
      id: 'guest_' + Date.now(),
      name,
      username: 'khach_trainghiem',
      grade,
      avatar: '🦉',
      xp: 60,
      coins: 80,
      streak: 1,
      completedTextIds: [],
      quizScores: {},
      badges: [INITIAL_BADGES[0]],
      unlockedItems: [],
      history: [],
      isGuest: true,
      createdAt: new Date().toISOString()
    };
    setUser(guestUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedFields: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      if (!prev.isGuest) {
        const accounts = getStoredAccounts();
        if (accounts[prev.username]) {
          accounts[prev.username].userData = updated;
          localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
        }
      }
      return updated;
    });
  };

  const completeReading = (textId: string, textTitle: string, accuracy: number, wpm: number, quizScore?: number) => {
    setUser(prev => {
      if (!prev) return null;
      const alreadyCompleted = prev.completedTextIds.includes(textId);
      const newCompleted = alreadyCompleted ? prev.completedTextIds : [...prev.completedTextIds, textId];
      const newHistoryItem: ReadingHistoryItem = {
        textId,
        textTitle,
        grade: prev.grade,
        accuracy,
        wpm,
        completedAt: new Date().toISOString(),
        quizScore
      };

      const newScores = { ...prev.quizScores };
      if (quizScore !== undefined) {
        newScores[textId] = Math.max(newScores[textId] || 0, quizScore);
      }

      const xpEarned = alreadyCompleted ? 15 : 50 + (quizScore ? Math.round(quizScore / 2) : 0);
      // Anti-exploit: Không cộng thêm xu khi đọc lại bài đã hoàn thành
      const coinsEarned = alreadyCompleted ? 0 : 25 + (quizScore ? Math.round(quizScore / 5) : 0);

      // Check badge triggers
      const updatedBadges = [...prev.badges];
      const hasVoiceBadge = updatedBadges.some(b => b.id === 'voice-star');
      if (!hasVoiceBadge && accuracy >= 85) {
        const badgeDef = INITIAL_BADGES.find(b => b.id === 'voice-star');
        if (badgeDef) {
          updatedBadges.push({ ...badgeDef, unlockedAt: new Date().toISOString() });
        }
      }

      const hasQuizBadge = updatedBadges.some(b => b.id === 'quiz-master');
      if (!hasQuizBadge && quizScore === 100) {
        const badgeDef = INITIAL_BADGES.find(b => b.id === 'quiz-master');
        if (badgeDef) {
          updatedBadges.push({ ...badgeDef, unlockedAt: new Date().toISOString() });
        }
      }

      const hasBookLover = updatedBadges.some(b => b.id === 'book-lover');
      if (!hasBookLover && newCompleted.length >= 5) {
        const badgeDef = INITIAL_BADGES.find(b => b.id === 'book-lover');
        if (badgeDef) {
          updatedBadges.push({ ...badgeDef, unlockedAt: new Date().toISOString() });
        }
      }

      const updatedUser = {
        ...prev,
        xp: prev.xp + xpEarned,
        coins: (prev.coins || 0) + coinsEarned,
        completedTextIds: newCompleted,
        quizScores: newScores,
        history: [newHistoryItem, ...prev.history],
        badges: updatedBadges
      };

      if (!prev.isGuest) {
        const accounts = getStoredAccounts();
        if (accounts[prev.username]) {
          accounts[prev.username].userData = updatedUser;
          localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
        }
      }

      return updatedUser;
    });
  };

  const addXP = (amount: number) => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, xp: prev.xp + amount };
    });
  };

  const addCoins = (amount: number) => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, coins: (prev.coins || 0) + amount };
    });
  };

  const spendCoins = (amount: number, itemId: string): boolean => {
    if (!user || (user.coins || 0) < amount) return false;
    // Check if user already owns this item
    if ((user.unlockedItems || []).includes(itemId)) {
      return false;
    }

    let success = false;
    setUser(prev => {
      if (!prev || (prev.coins || 0) < amount) return prev;
      success = true;
      const isFrame = itemId.startsWith('frame-');
      const isTitle = itemId.startsWith('title-');

      const updatedUser = {
        ...prev,
        coins: prev.coins - amount,
        unlockedItems: [...(prev.unlockedItems || []), itemId],
        // Auto-equip the newly purchased frame or title
        ...(isFrame ? { equippedFrameId: itemId } : {}),
        ...(isTitle ? { equippedTitleId: itemId } : {})
      };

      if (!prev.isGuest) {
        const accounts = getStoredAccounts();
        if (accounts[prev.username]) {
          accounts[prev.username].userData = updatedUser;
          localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
        }
      }

      return updatedUser;
    });

    return success;
  };

  const equipItem = (itemId: string, itemType: 'frame' | 'title'): boolean => {
    if (!user || !(user.unlockedItems || []).includes(itemId)) return false;
    setUser(prev => {
      if (!prev) return null;
      const updatedUser = {
        ...prev,
        ...(itemType === 'frame' ? { equippedFrameId: itemId } : { equippedTitleId: itemId })
      };
      if (!prev.isGuest) {
        const accounts = getStoredAccounts();
        if (accounts[prev.username]) {
          accounts[prev.username].userData = updatedUser;
          localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
        }
      }
      return updatedUser;
    });
    return true;
  };

  const unequipItem = (itemType: 'frame' | 'title') => {
    setUser(prev => {
      if (!prev) return null;
      const updatedUser = {
        ...prev,
        ...(itemType === 'frame' ? { equippedFrameId: undefined } : { equippedTitleId: undefined })
      };
      if (!prev.isGuest) {
        const accounts = getStoredAccounts();
        if (accounts[prev.username]) {
          accounts[prev.username].userData = updatedUser;
          localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
        }
      }
      return updatedUser;
    });
  };

  const unlockBadge = (badgeId: string) => {
    setUser(prev => {
      if (!prev) return null;
      if (prev.badges.some(b => b.id === badgeId)) return prev;
      const found = INITIAL_BADGES.find(b => b.id === badgeId);
      if (!found) return prev;
      return {
        ...prev,
        xp: prev.xp + 40,
        coins: (prev.coins || 0) + 20,
        badges: [...prev.badges, { ...found, unlockedAt: new Date().toISOString() }]
      };
    });
  };

  const recordEssaySubmission = (submission: import('../types').EssaySubmission) => {
    setUser(prev => {
      if (!prev) return null;
      const existingSubmissions = prev.essaySubmissions || [];
      const updatedSubmissions = [submission, ...existingSubmissions];

      // Anti-exploit check: không cộng thêm xu khi nộp lại cùng 1 bài đã được thưởng
      const alreadyRewarded = (prev.rewardedEssayPromptIds || []).includes(submission.promptId);
      const coinsToAward = alreadyRewarded ? 0 : (submission.coinsAwarded || 30);
      const xpToAward = submission.xpAwarded || (alreadyRewarded ? 20 : 50);

      submission.coinsAwarded = coinsToAward;
      submission.xpAwarded = xpToAward;

      const updatedCoins = (prev.coins || 0) + coinsToAward;
      const updatedXP = prev.xp + xpToAward;
      const updatedRewardedPrompts = alreadyRewarded
        ? (prev.rewardedEssayPromptIds || [])
        : [...(prev.rewardedEssayPromptIds || []), submission.promptId];

      // Check if student deserves essay badge
      const updatedBadges = [...prev.badges];
      const hasEssayBadge = updatedBadges.some(b => b.id === 'essay-master');
      if (!hasEssayBadge && submission.grading.score >= 8.0) {
        updatedBadges.push({
          id: 'essay-master',
          title: 'Cây Bút Nghị Luận Xuất Sắc',
          description: 'Đạt từ 8.0 điểm bài văn nghị luận',
          icon: '✍️',
          unlockedAt: new Date().toISOString()
        });
      }

      const updatedUser = {
        ...prev,
        xp: updatedXP,
        coins: updatedCoins,
        essaySubmissions: updatedSubmissions,
        rewardedEssayPromptIds: updatedRewardedPrompts,
        badges: updatedBadges
      };

      if (!prev.isGuest) {
        const accounts = getStoredAccounts();
        if (accounts[prev.username]) {
          accounts[prev.username].userData = updatedUser;
          localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
        }
      }

      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        loginAsGuest,
        logout,
        updateProfile,
        completeReading,
        addXP,
        addCoins,
        spendCoins,
        equipItem,
        unequipItem,
        unlockBadge,
        recordEssaySubmission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
