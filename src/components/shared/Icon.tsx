import type { LucideIcon } from 'lucide-react';
import {
  Home, Users, Plus, Bell, User, Mail, Lock, CheckCircle2,
  AlertCircle, Info, AlertTriangle, X, ChevronLeft, ChevronRight,
  Settings, LogOut, Receipt, Wallet, Camera, Sun, Moon,
  CreditCard, Shield, HelpCircle, Star
} from 'lucide-react';

export type IconName =
  | 'home' | 'users' | 'plus' | 'bell' | 'user' | 'mail' | 'lock'
  | 'success' | 'error' | 'info' | 'warning' | 'close' | 'back'
  | 'forward' | 'settings' | 'logout' | 'receipt' | 'wallet' | 'camera'
  | 'sun' | 'moon' | 'card' | 'shield' | 'help' | 'star';

const iconMap: Record<IconName, LucideIcon> = {
  home: Home,
  users: Users,
  plus: Plus,
  bell: Bell,
  user: User,
  mail: Mail,
  lock: Lock,
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
  close: X,
  back: ChevronLeft,
  forward: ChevronRight,
  settings: Settings,
  logout: LogOut,
  receipt: Receipt,
  wallet: Wallet,
  camera: Camera,
  sun: Sun,
  moon: Moon,
  card: CreditCard,
  shield: Shield,
  help: HelpCircle,
  star: Star
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const Icon = ({ name, size = 24, className = '', strokeWidth = 2 }: IconProps) => {
  const LucideComponent = iconMap[name];

  if (!LucideComponent) {
    console.warn(`Icon "${name}" bulunamadı.`);
    return null;
  }

  return (
    <LucideComponent
      size={size}
      className={className}
      strokeWidth={strokeWidth}
    />
  );
};
