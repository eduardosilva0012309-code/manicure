import {
  BookOpen, Sparkles, AlertCircle, Scroll, ShieldCheck, Brush, Wrench,
  Droplet, FlaskConical, Archive, Hand, Gift, ArrowRight, ShoppingBag,
  Star, CheckCircle2, Shield, Lock, Mail, ChevronLeft, ChevronRight,
  Plus, Trash2, GripVertical, Eye, Save, RotateCcw, LogOut, Upload,
  Palette, Type, Image as ImageIcon, Layout, Settings, Menu, X,
  ChevronDown, Monitor, Tablet, Smartphone, Pencil, Check, Clock,
  Award, PlayCircle, Users, Heart, Zap, Globe, FileText, BarChart3, MousePointer,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen, Sparkles, AlertCircle, Scroll, ShieldCheck, Brush, Wrench,
  Droplet, FlaskConical, Archive, Hand, Gift, ArrowRight, ShoppingBag,
  Star, CheckCircle2, Shield, Lock, Mail, ChevronLeft, ChevronRight,
  Plus, Trash2, GripVertical, Eye, Save, RotateCcw, LogOut, Upload,
  Palette, Type, Image: ImageIcon, Layout, Settings, Menu, X,
  ChevronDown, Monitor, Tablet, Smartphone, Pencil, Check, Clock,
  Award, PlayCircle, Users, Heart, Zap, Globe, FileText, BarChart3, MousePointer,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? BookOpen;
}
