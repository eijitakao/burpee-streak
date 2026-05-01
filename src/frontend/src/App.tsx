import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { buildAvatarUrl, useStore } from "@/store/useStore";
import { CHALLENGE_LEVELS, DEFAULT_DONATION_ADDRESS } from "@/types";
import type { User } from "@/types";
import {
  AlertCircle,
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  Flame,
  Pencil,
  RotateCcw,
  Star,
  Trash2,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiX } from "react-icons/si";
import { toast } from "sonner";

// ─── i18n ────────────────────────────────────────────────────────────────────
type Lang = "en" | "ja";

const T = {
  en: {
    appName: "BURPEE STREAK",
    rulesBanner: "Daily burpees → post on X → donate if you miss",
    currentStreak: "Current Streak",
    bestStreak: "Best Streak",
    recentActivity: "Recent Activity",
    today: "Today",
    completeToday: "Complete Today",
    postOnX: "Post on X",
    missedToday: "Missed Today",
    completedTodayState: "Completed today!",
    missedState: "Missed — Penalty:",
    donateButton: "Pay Penalty",
    you: "You",
    leaderboard: "LEADERBOARD",
    players: "players",
    noPlayers: "No players yet. Be the first.",
    addUserTitle: "Add Participant",
    addUserDesc: "Enter their X (Twitter) username to add them.",
    displayNameLabel: "Display Name",
    displayNamePlaceholder: "John Smith",
    usernameLabel: "X Username",
    usernamePlaceholder: "@username",
    donationAmountLabel: "Donation amount per miss (ICP)",
    cancel: "Cancel",
    add: "Add",
    penaltyTitle: "Donation Required",
    penaltyDesc:
      "You missed today's burpees. Please donate your pledged amount.",
    penaltyAmount: "Penalty Amount",
    donationAddress: "Donation Address",
    donated: "I Donated",
    donationCompleted: "Donation completed ✓",
    donationSetting: "Pledge per miss",
    editDonation: "Edit pledge",
    days: "Days",
    donated_total: "ICP donated",
    xPostTemplate: (days: number) => `#BurpeeStreak Day ${days} — Done!`,
    completedToast: (days: number) => `Day ${days} streak achieved! 🔥`,
    donatedToast: "Donation completed ✓",
    addedToast: (name: string) => `${name} has been added!`,
    days_abbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    editProfile: "Edit Profile",
    editProfileTitle: "Edit Your Profile",
    editProfileDesc:
      "Update your display name, handle, avatar, donation settings, and challenge level.",
    avatarUrlLabel: "Avatar URL",
    avatarUrlPlaceholder: "https://...",
    donationAddressLabel: "Your Donation Address",
    challengeLevelLabel: "Challenge Level",
    save: "Save",
    resetStreak: "Reset Streak",
    resetStreakTitle: "Reset your streak?",
    resetStreakDesc:
      "Your streak will be reset to 0. Your best streak is preserved.",
    resetStreakConfirm: "Yes, Reset",
    deleteData: "Delete My Data",
    deleteDataTitle: "Delete all your data?",
    deleteDataDesc:
      "This will permanently remove your profile and all progress. This cannot be undone.",
    deleteDataConfirm: "Yes, Delete",
    copyAddress: "Copy address",
    copied: "Copied!",
    level: "Level",
  },
  ja: {
    appName: "BURPEE STREAK",
    rulesBanner: "毎日バーピーしてX投稿、失敗したら寄付",
    currentStreak: "現在のストリーク",
    bestStreak: "自己ベスト",
    recentActivity: "最近の活動",
    today: "今日",
    completeToday: "今日のチャレンジを完了",
    postOnX: "今日の成果をポストする",
    missedToday: "今日は未達成",
    completedTodayState: "今日は完了済み！",
    missedState: "未達成 — ペナルティ:",
    donateButton: "寄付する",
    you: "あなた",
    leaderboard: "リーダーボード",
    players: "人",
    noPlayers: "まだ参加者がいません。最初のプレイヤーになろう！",
    addUserTitle: "ユーザーを追加",
    addUserDesc: "X(Twitter) のユーザー名を入力してください。",
    displayNameLabel: "表示名",
    displayNamePlaceholder: "田中 健太郎",
    usernameLabel: "X ユーザー名",
    usernamePlaceholder: "@username",
    donationAmountLabel: "ミス時の寄付金額 (ICP)",
    cancel: "キャンセル",
    add: "追加",
    penaltyTitle: "寄付が必要です",
    penaltyDesc: "今日のバーピーをミスしました。寄付しましょう。",
    penaltyAmount: "ペナルティ金額",
    donationAddress: "寄付先アドレス",
    donated: "寄付しました",
    donationCompleted: "寄付完了 ✓",
    donationSetting: "ミス時の寄付額",
    editDonation: "寄付額を編集",
    days: "日",
    donated_total: "ICP 寄付済み",
    xPostTemplate: (days: number) => `#バーピー${days}日目 今日も完了`,
    completedToast: (days: number) => `${days}日連続達成！🔥`,
    donatedToast: "寄付完了 ✓",
    addedToast: (name: string) => `${name} がリストに追加されました！`,
    days_abbr: ["日", "月", "火", "水", "木", "金", "土"],
    editProfile: "プロフィール編集",
    editProfileTitle: "プロフィールを編集",
    editProfileDesc:
      "表示名、ハンドル、アバター、寄付設定、チャレンジレベルを更新します。",
    avatarUrlLabel: "アバター URL",
    avatarUrlPlaceholder: "https://...",
    donationAddressLabel: "寄付先アドレス",
    challengeLevelLabel: "チャレンジレベル",
    save: "保存",
    resetStreak: "ストリークをリセット",
    resetStreakTitle: "ストリークをリセットしますか？",
    resetStreakDesc:
      "ストリークが0にリセットされます。自己ベストは保持されます。",
    resetStreakConfirm: "リセットする",
    deleteData: "データを削除",
    deleteDataTitle: "すべてのデータを削除しますか？",
    deleteDataDesc:
      "プロフィールと進捗がすべて完全に削除されます。この操作は元に戻せません。",
    deleteDataConfirm: "削除する",
    copyAddress: "アドレスをコピー",
    copied: "コピー済み！",
    level: "レベル",
  },
} as const;

// ─── Avatar ──────────────────────────────────────────────────────────────────
function AvatarDisplay({
  src,
  alt,
  size = 48,
}: { src: string; alt: string; size?: number }) {
  const [error, setError] = useState(false);
  return (
    <div
      className="rounded-full overflow-hidden bg-muted border-2 border-border flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {!error && src ? (
        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground font-bold text-lg">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

// ─── ActivityCalendar ────────────────────────────────────────────────────────
function ActivityCalendar({
  history,
  lang,
}: { history: boolean[]; lang: Lang }) {
  const t = T[lang];
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 6 + i);
    return d;
  });

  return (
    <div className="flex gap-1 justify-between">
      {dates.map((date, i) => {
        const isToday = i === 6;
        const done = history[i];
        const dayName = t.days_abbr[date.getDay()];
        return (
          <div
            key={date.toISOString()}
            className="flex flex-col items-center gap-1 flex-1"
          >
            <span className="text-xs text-muted-foreground font-medium">
              {dayName}
            </span>
            <span className="text-xs text-muted-foreground">
              {date.getDate()}
            </span>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${
                  isToday
                    ? done
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted border-2 border-accent text-muted-foreground"
                    : done
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
            >
              {done ? "✓" : "×"}
            </div>
            {isToday && (
              <span className="text-[10px] text-accent font-bold">
                {t.today}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── CopyButton ──────────────────────────────────────────────────────────────
function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1 rounded hover:bg-muted transition-smooth text-muted-foreground hover:text-foreground flex-shrink-0"
      aria-label={label}
      data-ocid="donation.copy_address_button"
    >
      {copied ? (
        <ClipboardCheck size={14} className="text-primary" />
      ) : (
        <Clipboard size={14} />
      )}
    </button>
  );
}

// ─── ConfirmDialog ────────────────────────────────────────────────────────────
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  destructive = false,
  ocid,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  destructive?: boolean;
  ocid: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-ocid={`${ocid}.dialog`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            data-ocid={`${ocid}.cancel_button`}
          >
            Cancel
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            className="flex-1"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            data-ocid={`${ocid}.confirm_button`}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── EditProfileSheet ────────────────────────────────────────────────────────
function EditProfileSheet({
  open,
  onClose,
  user,
  lang,
  onDeleteUser,
}: {
  open: boolean;
  onClose: () => void;
  user: User;
  lang: Lang;
  onDeleteUser: () => void;
}) {
  const updateUser = useStore((s) => s.updateUser);
  const resetStreak = useStore((s) => s.resetStreak);

  const [displayName, setDisplayName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username);
  const [donationAddress, setDonationAddress] = useState(
    user.donationAddress || DEFAULT_DONATION_ADDRESS,
  );
  const [donationAmount, setDonationAmount] = useState(
    String(user.donationAmount),
  );
  const [challengeLevel, setChallengeLevel] = useState(user.challengeLevel);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const t = T[lang];

  // Sync fields when user changes
  useEffect(() => {
    setDisplayName(user.displayName);
    setUsername(user.username);
    setDonationAddress(user.donationAddress || DEFAULT_DONATION_ADDRESS);
    setDonationAmount(String(user.donationAmount));
    setChallengeLevel(user.challengeLevel);
  }, [user]);

  const handleSave = () => {
    const amount = Number.parseFloat(donationAmount);
    const cleanUsername = username.replace(/^@/, "").trim() || user.username;
    updateUser(user.id, {
      displayName: displayName.trim() || user.displayName,
      username: cleanUsername,
      avatarUrl: buildAvatarUrl(cleanUsername),
      donationAddress: donationAddress.trim() || DEFAULT_DONATION_ADDRESS,
      donationAmount:
        !Number.isNaN(amount) && amount > 0 ? amount : user.donationAmount,
      challengeLevel,
    });
    toast.success("Profile updated ✓");
    onClose();
  };

  const handleReset = () => {
    resetStreak(user.id);
    toast.success("Streak reset to 0");
    setShowResetConfirm(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          className="max-h-[90dvh] overflow-y-auto"
          data-ocid="edit_profile.dialog"
        >
          <DialogHeader>
            <DialogTitle>{t.editProfileTitle}</DialogTitle>
            <DialogDescription>{t.editProfileDesc}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            {/* Display Name */}
            <div>
              <label
                className="text-sm font-medium mb-1 block"
                htmlFor="ep-displayname"
              >
                {t.displayNameLabel}
              </label>
              <Input
                id="ep-displayname"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t.displayNamePlaceholder}
                data-ocid="edit_profile.display_name_input"
              />
            </div>

            {/* X Username */}
            <div>
              <label
                className="text-sm font-medium mb-1 block"
                htmlFor="ep-username"
              >
                {t.usernameLabel}
              </label>
              <Input
                id="ep-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.usernamePlaceholder}
                data-ocid="edit_profile.username_input"
              />
            </div>

            {/* Donation amount */}
            <div>
              <label
                className="text-sm font-medium mb-1 block"
                htmlFor="ep-donation"
              >
                {t.donationAmountLabel}
              </label>
              <Input
                id="ep-donation"
                type="number"
                min="0.01"
                step="0.01"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                data-ocid="edit_profile.donation_amount_input"
              />
            </div>

            {/* Donation Address */}
            <div>
              <label
                className="text-sm font-medium mb-1 block"
                htmlFor="ep-address"
              >
                {t.donationAddressLabel}
              </label>
              <Input
                id="ep-address"
                value={donationAddress}
                onChange={(e) => setDonationAddress(e.target.value)}
                className="font-mono text-xs"
                data-ocid="edit_profile.donation_address_input"
              />
            </div>

            {/* Challenge Level */}
            <div>
              <p className="text-sm font-medium mb-2">
                {t.challengeLevelLabel}
              </p>
              <div
                className="grid grid-cols-5 gap-1.5"
                data-ocid="edit_profile.challenge_level_selector"
              >
                {CHALLENGE_LEVELS.map((cl) => (
                  <button
                    key={cl.level}
                    type="button"
                    onClick={() => setChallengeLevel(cl.level)}
                    className={`flex flex-col items-center py-2 rounded-lg border text-xs font-semibold transition-smooth
                      ${
                        challengeLevel === cl.level
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-muted text-muted-foreground border-transparent hover:border-border"
                      }`}
                    data-ocid={`edit_profile.level_${cl.level}`}
                  >
                    <span>Lv{cl.level}</span>
                    <span className="font-normal opacity-75">{cl.reps}</span>
                    {cl.level === 2 && (
                      <span className="text-[9px] text-primary font-bold mt-0.5">
                        ★
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border pt-3 flex flex-col gap-2">
              {/* Reset streak */}
              <Button
                variant="outline"
                className="w-full gap-2 text-muted-foreground"
                onClick={() => setShowResetConfirm(true)}
                data-ocid="edit_profile.reset_streak_button"
              >
                <RotateCcw size={14} />
                {t.resetStreak}
              </Button>
              {/* Delete data */}
              <Button
                variant="ghost"
                className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setShowDeleteConfirm(true)}
                data-ocid="edit_profile.delete_data_button"
              >
                <Trash2 size={14} />
                {t.deleteData}
              </Button>
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              data-ocid="edit_profile.cancel_button"
            >
              {t.cancel}
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              data-ocid="edit_profile.save_button"
            >
              {t.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showResetConfirm}
        onOpenChange={setShowResetConfirm}
        title={t.resetStreakTitle}
        description={t.resetStreakDesc}
        confirmLabel={t.resetStreakConfirm}
        onConfirm={handleReset}
        ocid="reset_streak"
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title={t.deleteDataTitle}
        description={t.deleteDataDesc}
        confirmLabel={t.deleteDataConfirm}
        onConfirm={onDeleteUser}
        destructive
        ocid="delete_data"
      />
    </>
  );
}

// ─── UserCard ────────────────────────────────────────────────────────────────
function UserCard({
  user,
  isCurrentUser,
  lang,
  onOpenEdit,
}: {
  user: User;
  isCurrentUser: boolean;
  lang: Lang;
  onOpenEdit?: () => void;
}) {
  const completeToday = useStore((s) => s.completeToday);
  const missedToday = useStore((s) => s.missedToday);
  const markDonated = useStore((s) => s.markDonated);
  const [showDonation, setShowDonation] = useState(false);
  const [streakAnimKey, setStreakAnimKey] = useState(0);
  const t = T[lang];

  const isMissedPending = user.missedToday && !user.donatedToday;

  const challengeInfo = CHALLENGE_LEVELS.find(
    (cl) => cl.level === user.challengeLevel,
  );

  const handleComplete = () => {
    completeToday(user.id);
    setStreakAnimKey((k) => k + 1);
    toast.success(`🔥 ${t.completedToast(user.streakDays + 1)}`);
  };

  const handlePost = () => {
    const handle = user.username
      ? user.username.startsWith("@")
        ? user.username
        : `@${user.username}`
      : "@me";
    const text = encodeURIComponent(
      `${handle} ${t.xPostTemplate(user.streakDays)}`,
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const handleMissed = () => {
    missedToday(user.id);
    setShowDonation(true);
  };

  const handleDonated = () => {
    markDonated(user.id);
    setShowDonation(false);
    toast.success(t.donationCompleted);
  };

  const donationAddr = user.donationAddress || DEFAULT_DONATION_ADDRESS;

  return (
    <>
      <div
        className={`rounded-xl shadow-card p-5 mx-auto w-full max-w-sm transition-smooth border
          ${isMissedPending ? "missed-highlight" : "bg-card border-transparent"}`}
        data-ocid="user.card"
      >
        {/* Avatar + name + badges */}
        <div className="flex flex-col items-center gap-2 mb-4 relative">
          {isCurrentUser && onOpenEdit && (
            <button
              type="button"
              onClick={onOpenEdit}
              className="absolute top-0 right-0 p-1.5 rounded-full bg-muted text-muted-foreground hover:bg-secondary transition-smooth"
              aria-label={t.editProfile}
              data-ocid="user.edit_profile_button"
            >
              <Pencil size={13} />
            </button>
          )}
          <AvatarDisplay
            src={user.avatarUrl}
            alt={user.displayName}
            size={72}
          />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <p className="font-semibold text-base leading-tight">
                {user.displayName}
              </p>
              {isCurrentUser && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 bg-accent/20 text-accent border-accent/30 border"
                  data-ocid="user.you_badge"
                >
                  {t.you}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {user.username ? `@${user.username}` : ""}
            </p>
            {challengeInfo && (
              <p className="text-xs font-semibold text-primary mt-0.5">
                Lv{challengeInfo.level} · {challengeInfo.reps} reps/day
              </p>
            )}
          </div>
        </div>

        {/* Streak number */}
        <div className="flex flex-col items-center mb-4">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-0.5">
            Day
          </p>
          <motion.span
            key={streakAnimKey}
            className="text-6xl font-bold streak-highlight leading-none"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {user.streakDays}
          </motion.span>
          <p className="text-xs text-muted-foreground mt-1">
            {t.currentStreak}
          </p>
          <p className="text-xs text-muted-foreground">
            {t.bestStreak}: {user.bestStreak} {t.days}
          </p>
        </div>

        {/* Activity calendar */}
        <div className="mb-4 p-3 bg-muted/40 rounded-lg">
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            {t.recentActivity}
          </p>
          <ActivityCalendar history={user.activityHistory} lang={lang} />
        </div>

        {/* Missed penalty inline section */}
        {isMissedPending && (
          <div className="mb-3 p-3 rounded-lg border border-destructive/30 bg-destructive/5 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-destructive text-sm font-semibold">
              <AlertCircle size={14} />
              {t.missedState} {user.donationAmount} ICP
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                {t.donationAddress}
              </p>
              <div className="flex items-start gap-1.5">
                <p className="font-mono text-xs break-all select-all text-foreground flex-1">
                  {donationAddr}
                </p>
                <CopyButton text={donationAddr} label={t.copyAddress} />
              </div>
            </div>
            <Button
              size="sm"
              className="w-full gap-2 text-sm"
              onClick={() => setShowDonation(true)}
              data-ocid="user.donate_button"
            >
              <CheckCircle2 size={14} />
              {t.donated}
            </Button>
          </div>
        )}

        {/* Donation pledge row — only for current user */}
        {isCurrentUser && (
          <div className="flex items-center justify-between px-1 mb-3">
            <span className="text-xs text-muted-foreground">
              {t.donationSetting}
            </span>
            <span className="text-xs font-semibold streak-highlight">
              {user.donationAmount} ICP / miss
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {!user.completedToday && !user.missedToday ? (
            <>
              <Button
                className="w-full font-bold py-3 text-base gap-2"
                onClick={handleComplete}
                disabled={!isCurrentUser}
                title={
                  !isCurrentUser
                    ? "Only the user themselves can complete their streak"
                    : undefined
                }
                data-ocid="user.complete_button"
              >
                <Flame size={18} />
                {t.completeToday}
              </Button>
              <Button
                variant="outline"
                className="w-full font-bold py-3 text-base gap-2"
                onClick={handlePost}
                data-ocid="user.post_button"
              >
                <SiX size={14} />
                {t.postOnX}
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground gap-2 text-sm"
                onClick={handleMissed}
                disabled={!isCurrentUser}
                title={
                  !isCurrentUser
                    ? "Only the user themselves can mark as missed"
                    : undefined
                }
                data-ocid="user.missed_button"
              >
                <AlertCircle size={15} />
                {t.missedToday}
              </Button>
            </>
          ) : user.completedToday ? (
            <>
              <div
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-muted text-muted-foreground font-semibold text-sm"
                data-ocid="user.completed_state"
              >
                <CheckCircle2 size={16} className="text-primary" />
                {t.completedTodayState}
              </div>
              <Button
                variant="outline"
                className="w-full font-bold py-3 text-base gap-2"
                onClick={handlePost}
                data-ocid="user.post_button"
              >
                <SiX size={14} />
                {t.postOnX}
              </Button>
            </>
          ) : user.donatedToday ? (
            <div
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-muted text-muted-foreground font-semibold text-sm"
              data-ocid="user.donated_state"
            >
              <CheckCircle2 size={16} className="text-primary" />
              {t.donationCompleted}
            </div>
          ) : null}
        </div>
      </div>

      {/* Donation confirmation dialog */}
      <Dialog open={showDonation} onOpenChange={setShowDonation}>
        <DialogContent data-ocid="donation.dialog">
          <DialogHeader>
            <DialogTitle>{t.penaltyTitle}</DialogTitle>
            <DialogDescription>{t.penaltyDesc}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">
                {t.penaltyAmount}
              </p>
              <p className="text-2xl font-bold streak-highlight">
                {user.donationAmount} ICP
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">
                  {t.donationAddress}
                </p>
                <CopyButton text={donationAddr} label={t.copyAddress} />
              </div>
              <p className="font-mono text-xs break-all select-all text-foreground">
                {donationAddr}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowDonation(false)}
              data-ocid="donation.cancel_button"
            >
              {t.cancel}
            </Button>
            <Button
              className="flex-1"
              onClick={handleDonated}
              data-ocid="donation.confirm_button"
            >
              {t.donated}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── LeaderboardRow ──────────────────────────────────────────────────────────
function LeaderboardRow({
  user,
  rank,
  isCurrentUser,
  lang,
}: {
  user: User;
  rank: number;
  isCurrentUser: boolean;
  lang: Lang;
}) {
  const t = T[lang];
  const challengeInfo = CHALLENGE_LEVELS.find(
    (cl) => cl.level === user.challengeLevel,
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-smooth
        ${
          isCurrentUser
            ? "bg-primary/10 border-primary/30 shadow-xs"
            : user.missedToday && !user.donatedToday
              ? "missed-highlight border"
              : "bg-card border-transparent hover:border-border"
        }`}
      data-ocid={`leaderboard.item.${rank}`}
    >
      {/* Rank */}
      <div className="w-7 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-semibold text-muted-foreground">
          #{rank}
        </span>
      </div>

      {/* Avatar */}
      <AvatarDisplay src={user.avatarUrl} alt={user.displayName} size={36} />

      {/* Name + level */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <p className="font-semibold text-sm leading-tight truncate">
            {user.displayName}
          </p>
          {isCurrentUser && (
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4 bg-accent/20 text-accent border-accent/30 border flex-shrink-0"
            >
              {t.you}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {user.username ? `@${user.username}` : ""}
          {challengeInfo ? ` · Lv${challengeInfo.level}` : ""}
        </p>
      </div>

      {/* Badges + ICP + streak */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {user.missedToday && !user.donatedToday && (
          <Badge variant="destructive" className="text-xs px-1.5 py-0">
            Missed
          </Badge>
        )}
        {user.completedToday && (
          <CheckCircle2 size={14} className="text-primary" />
        )}
        <div className="flex flex-col items-end">
          <span className="font-bold text-sm streak-highlight tabular-nums">
            {user.penaltyICP.toFixed(1)}
            <span className="text-xs font-normal text-muted-foreground ml-0.5">
              ICP
            </span>
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {user.streakDays} {t.days}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const users = useStore((s) => s.users);
  const currentUserId = useStore((s) => s.currentUserId);
  const deleteUser = useStore((s) => s.deleteUser);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  const currentUser = users.find((u) => u.id === currentUserId) ?? null;
  const t = T[lang];

  // Sort by total ICP donated (penaltyICP) descending; tie-break alphabetically
  const sortedUsers = [...users].sort((a, b) => {
    if (b.penaltyICP !== a.penaltyICP) return b.penaltyICP - a.penaltyICP;
    return a.displayName.localeCompare(b.displayName);
  });

  // Other users (leaderboard entries)
  const leaderboardUsers = sortedUsers;

  const leaderboardRef = useRef<HTMLDivElement>(null);

  const handleDeleteCurrentUser = () => {
    if (!currentUser) return;
    deleteUser(currentUser.id);
    setEditProfileOpen(false);
    toast.success("Your data has been deleted.");
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="app.page"
    >
      {/* Rules Banner */}
      <div
        className="bg-accent/10 border-b border-accent/20 py-1.5 px-4 text-center"
        data-ocid="rules.banner"
      >
        <p className="text-xs font-medium text-accent">{t.rulesBanner}</p>
      </div>

      {/* Header */}
      <header
        className="bg-card border-b border-border shadow-subtle sticky top-0 z-20"
        data-ocid="header"
      >
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={20} className="fill-primary text-primary" />
            <span className="font-bold text-lg tracking-tight">
              BURPEE <span className="streak-highlight">STREAK</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setLang((l) => (l === "en" ? "ja" : "en"))}
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground hover:bg-secondary transition-smooth"
              data-ocid="header.lang_toggle"
              aria-label="Toggle language"
            >
              {lang === "en" ? "日本語" : "EN"}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        className="flex-1 max-w-lg mx-auto w-full px-4 py-5 flex flex-col gap-6"
        data-ocid="main.section"
      >
        {/* Current user card */}
        {currentUser && (
          <UserCard
            user={currentUser}
            isCurrentUser={true}
            lang={lang}
            onOpenEdit={() => setEditProfileOpen(true)}
          />
        )}

        {/* Leaderboard */}
        <div className="flex flex-col gap-3" data-ocid="leaderboard.section">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-primary" />
              <h2 className="font-bold text-base">{t.leaderboard}</h2>
            </div>
            <span className="text-xs text-muted-foreground">
              {leaderboardUsers.length} {t.players}
            </span>
          </div>

          {leaderboardUsers.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 text-center"
              data-ocid="leaderboard.empty_state"
            >
              <Trophy size={32} className="text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-sm font-medium">
                {t.noPlayers}
              </p>
            </div>
          ) : (
            <>
              {/* Column hint */}
              <div className="flex items-center justify-between px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                <span>Rank / Name</span>
                <span>{t.donated_total}</span>
              </div>

              <div ref={leaderboardRef} className="flex flex-col gap-1.5">
                <AnimatePresence mode="popLayout">
                  {leaderboardUsers.map((user, i) => (
                    <LeaderboardRow
                      key={user.id}
                      user={user}
                      rank={i + 1}
                      isCurrentUser={user.id === currentUserId}
                      lang={lang}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="bg-card border-t border-border py-4 mt-auto"
        data-ocid="footer"
      >
        <div className="max-w-lg mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {currentUser && (
        <EditProfileSheet
          open={editProfileOpen}
          onClose={() => setEditProfileOpen(false)}
          user={currentUser}
          lang={lang}
          onDeleteUser={handleDeleteCurrentUser}
        />
      )}

      <Toaster position="top-center" richColors />
    </div>
  );
}
