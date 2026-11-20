export type ScreenId =
  | 'onboarding'
  | 'menu'
  | 'dish-detail'
  | 'planner'
  | 'tracker'
  | 'profile';

export type QueueStatus = 'free' | 'medium' | 'rush';

export type DishCategory = 'all' | 'combo160' | 'soup' | 'main' | 'bakery';

export type PaymentMethod = 'MBank' | 'O!Деньги' | 'Элкарт' | 'Студенческий баланс';

export type OrderStage = 1 | 2 | 3; // 1: Принят, 2: Готовится, 3: Ожидает на стойке

export interface University {
  id: string;
  shortName: string;
  fullName: string;
  domain: string;
  buildings: {
    id: string;
    name: string;
    canteenName: string;
    hours: string;
    breakNotice: string;
  }[];
  bellSchedule: {
    id: string;
    time: string;
    label: string;
    shortLabel: string;
    occupancyPercent: number;
    spotsLeft: number;
    featuredDishId: string;
    discountBadge?: string;
    statusText: string;
  }[];
}

export interface DishAddon {
  id: string;
  label: string;
  price: number;
  tag?: string;
}

export interface Dish {
  id: string;
  name: string;
  shortName: string;
  category: Exclude<DishCategory, 'all' | 'combo160'>;
  description: string;
  ingredients: string[];
  allergens: string[];
  weight: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  price: number;
  originalPrice: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  orderedToday: number;
  badgeTop?: string;
  badgeBottom?: string;
  isHotNow?: boolean;
  image: string;
}

export interface ActiveOrder {
  id: string;
  secretCode: string;
  dishId: string;
  title: string;
  subtitle: string;
  canteenLocation: string;
  slotTime: string;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  addons: string[];
  stage: OrderStage;
  createdAtTime: string;
  etaMinutes: number;
  warmHoldSeconds: number;
  isGroupOrder?: boolean;
  groupParticipants?: number;
}

export interface OrderHistoryItem {
  id: string;
  dateLabel: string;
  title: string;
  totalPrice: number;
  savedAmount: number;
  paymentMethod: PaymentMethod;
  canteen: string;
}

export interface ChatMessage {
  id: string;
  sender: 'cook' | 'student';
  authorName: string;
  text: string;
  timestamp: string;
}

export interface DietaryPreferences {
  halal: boolean;
  noMayo: boolean;
  nutAllergy: boolean;
  noLactose: boolean;
  samsaAlert: boolean;
}

export interface StudentProfile {
  name: string;
  shortName: string;
  studentId: string;
  faculty: string;
  group: string;
  universityId: string;
  buildingId: string;
  email: string;
  isVerified: boolean;
  verificationMethod: 'photo' | 'email' | null;
  balance: number;
  cashbackPercent: number;
  savedSom: number;
  savedMinutes: number;
  trustRating: number;
  promoCode: string;
  dietary: DietaryPreferences;
  favorites: string[];
  avatar: string;
}

export interface GroupMember {
  id: string;
  initials: string;
  name: string;
  color: string;
  selected: boolean;
}

export interface GroupCartItem {
  dishId: string;
  name: string;
  unitPrice: number;
  qty: number;
  image: string;
}

export interface TomorrowPoll {
  mantiVotes: number;
  lagmanVotes: number;
  userChoice: 'manti' | 'lagman' | null;
}
