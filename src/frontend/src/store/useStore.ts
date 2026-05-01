import type { User } from "@/types";
import { DEFAULT_DONATION_ADDRESS } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BurpeeStore {
  users: User[];
  currentUserId: string | null;
  addUser: (
    username: string,
    displayName: string,
    donationAmount: number,
  ) => void;
  setCurrentUser: (id: string) => void;
  completeToday: (id: string) => void;
  missedToday: (id: string) => void;
  markDonated: (id: string) => void;
  removeUser: (id: string) => void;
  updateDonationAmount: (id: string, amount: number) => void;
  updateUser: (id: string, partial: Partial<User>) => void;
  resetStreak: (id: string) => void;
  deleteUser: (id: string) => void;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildAvatarUrl(username: string) {
  const clean = username.replace(/^@/, "");
  return `https://unavatar.io/twitter/${clean}`;
}

function createCurrentUser(id: string): User {
  return {
    id,
    username: "",
    displayName: "You",
    avatarUrl: "",
    streakDays: 0,
    bestStreak: 0,
    penaltyICP: 0,
    donationAmount: 0.5,
    donationAddress: DEFAULT_DONATION_ADDRESS,
    challengeLevel: 2,
    missedToday: false,
    donatedToday: false,
    completedToday: false,
    activityHistory: [false, false, false, false, false, false, false],
  };
}

export const useStore = create<BurpeeStore>()(
  persist(
    (set) => ({
      users: [],
      currentUserId: null,

      addUser: (username, displayName, donationAmount) => {
        const newUser: User = {
          id: generateId(),
          username: username.replace(/^@/, ""),
          displayName,
          avatarUrl: buildAvatarUrl(username),
          streakDays: 0,
          bestStreak: 0,
          penaltyICP: 0,
          donationAmount,
          donationAddress: DEFAULT_DONATION_ADDRESS,
          challengeLevel: 2,
          missedToday: false,
          donatedToday: false,
          completedToday: false,
          activityHistory: [false, false, false, false, false, false, false],
        };
        set((state) => ({
          users: [...state.users, newUser],
        }));
      },

      setCurrentUser: (id) => set({ currentUserId: id }),

      completeToday: (id) =>
        set((state) => ({
          users: state.users.map((u) => {
            if (u.id !== id || u.completedToday) return u;
            const newStreak = u.streakDays + 1;
            const history = [...u.activityHistory.slice(1), true];
            return {
              ...u,
              streakDays: newStreak,
              bestStreak: Math.max(u.bestStreak, newStreak),
              completedToday: true,
              missedToday: false,
              activityHistory: history,
            };
          }),
        })),

      missedToday: (id) =>
        set((state) => ({
          users: state.users.map((u) => {
            if (u.id !== id || u.missedToday || u.completedToday) return u;
            const history = [...u.activityHistory.slice(1), false];
            return {
              ...u,
              missedToday: true,
              penaltyICP: u.penaltyICP + u.donationAmount,
              streakDays: 0,
              activityHistory: history,
            };
          }),
        })),

      markDonated: (id) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id
              ? { ...u, donatedToday: true, penaltyICP: 0, missedToday: false }
              : u,
          ),
        })),

      removeUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
          currentUserId:
            state.currentUserId === id ? null : state.currentUserId,
        })),

      updateDonationAmount: (id, amount) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, donationAmount: amount } : u,
          ),
        })),

      updateUser: (id, partial) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, ...partial } : u,
          ),
        })),

      resetStreak: (id) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, streakDays: 0 } : u,
          ),
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
          currentUserId:
            state.currentUserId === id ? null : state.currentUserId,
        })),
    }),
    {
      name: "burpee-streak-store",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // If no currentUserId after hydration, bootstrap a new user
        if (!state.currentUserId) {
          const newId = generateId();
          const newUser = createCurrentUser(newId);
          state.users = [newUser];
          state.currentUserId = newId;
        }
      },
    },
  ),
);
