// ============================================
// FILE: src/types/index.ts
// ============================================

import { Id } from "convex/_generated/dataModel";

// ============================================
// User Types
// ============================================

export type UserRole = "super_admin" | "org_admin" | "manager" | "worker" | "customer";

export type MeasurementUnit = "cm" | "inches";

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  language: string;
  currency: string;
  measurementUnit: MeasurementUnit;
}

export interface SavedMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  shoulder?: number;
  length?: number;
  sleeve?: number;
  neck?: number;
  inseam?: number;
  unit: MeasurementUnit;
}

export interface UserStats {
  totalOrders: number;
  completedOrders: number;
  totalSpent: number;
  savedStyles: number;
  tasksCompleted?: number;
  efficiency?: number;
}

export interface User {
  _id: Id<"users">;
  _creationTime: number;
  clerkId: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  organizationId?: Id<"organizations">;
  preferences: UserPreferences;
  savedMeasurements?: SavedMeasurements;
  stats?: UserStats;
  isActive: boolean;
  lastActiveAt: number;
  createdAt: number;
  updatedAt: number;
}

// ============================================
// Organization Types
// ============================================

export interface BusinessHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

export interface OrganizationSettings {
  basePrice: number;
  customizationFeeRange: {
    min: number;
    max: number;
  };
  allowNegotiation: boolean;
  progressStages: string[];
  deliveryFee: number;
  currency: string;
  businessHours?: BusinessHours;
}

export interface OrganizationStats {
  totalDesigns: number;
  completedOrders: number;
  averageRating: number;
  totalReviews: number;
  responseTime: number;
}

export interface Organization {
  _id: Id<"organizations">;
  _creationTime: number;
  name: string;
  slug: string;
  logo?: string;
  coverImage?: string;
  description: string;
  tagline?: string;
  address: string;
  phone: string;
  email: string;
  clerkOrgId: string;
  settings: OrganizationSettings;
  stats: OrganizationStats;
  badges: string[];
  isActive: boolean;
  isPremium: boolean;
  verified: boolean;
  createdAt: number;
  updatedAt: number;
}

// ============================================
// Style Types
// ============================================

export type StyleCategory = "traditional" | "modern" | "casual" | "formal" | "business" | "wedding" | "party";
export type StyleGender = "men" | "women" | "kids" | "unisex";
export type CustomizationType = "color" | "fabric" | "size" | "other";

export interface StyleImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  alt?: string;
}

export interface StyleVideo {
  url: string;
  publicId: string;
}

export interface CustomizationOption {
  name: string;
  type: CustomizationType;
  options: string[];
  priceImpact: number;
}

export interface StyleMeasurements {
  required: string[];
  optional: string[];
}

export interface StyleStats {
  views: number;
  likes: number;
  orders: number;
  shares: number;
}

export interface StyleSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface Style {
  _id: Id<"styles">;
  _creationTime: number;
  organizationId: Id<"organizations">;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  gender: StyleGender;
  images: StyleImage[];
  videos?: StyleVideo[];
  basePrice: number;
  currency: string;
  isNegotiable: boolean;
  customizationOptions?: CustomizationOption[];
  measurements: StyleMeasurements;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  stats: StyleStats;
  seo?: StyleSEO;
  createdBy: Id<"users">;
  createdAt: number;
  updatedAt: number;
}

// ============================================
// Order Types
// ============================================

export type OrderStatus = "pending" | "confirmed" | "in_progress" | "completed" | "delivered" | "cancelled" | "refunded";
export type PaymentStatus = "unpaid" | "partial" | "paid" | "refunded";
export type ProgressStage = "cutting" | "sewing" | "finishing";
export type StageStatus = "pending" | "in_progress" | "completed";
export type DeliveryStatus = "pending" | "packed" | "in_transit" | "out_for_delivery" | "delivered" | "failed";

export interface OrderMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  shoulder?: number;
  length?: number;
  sleeve?: number;
  neck?: number;
  inseam?: number;
  custom?: Record<string, number>;
  unit: MeasurementUnit;
}

export interface SelectedOption {
  optionName: string;
  selectedValue: string;
}

export interface OrderPricing {
  basePrice: number;
  customizationFee: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
}

export interface ProgressStageData {
  status: StageStatus;
  startedAt?: number;
  completedAt?: number;
  notes?: string;
  images?: string[];
}

export interface OrderProgress {
  cutting: ProgressStageData;
  sewing: ProgressStageData;
  finishing: ProgressStageData;
}

export interface OrderDelivery {
  address: string;
  phone: string;
  alternatePhone?: string;
  instructions?: string;
  estimatedDate?: number;
  actualDate?: number;
  status: DeliveryStatus;
  trackingNumber?: string;
  courierService?: string;
}

export interface TimelineEvent {
  event: string;
  description: string;
  timestamp: number;
  actor?: Id<"users">;
}

export interface OrderRating {
  value: number;
  review?: string;
  images?: string[];
  createdAt: number;
}

export interface Order {
  _id: Id<"orders">;
  _creationTime: number;
  orderNumber: string;
  customerId: Id<"users">;
  organizationId: Id<"organizations">;
  styleId: Id<"styles">;
  measurements: OrderMeasurements;
  additionalNotes?: string;
  customizationRequests?: string;
  selectedOptions?: SelectedOption[];
  pricing: OrderPricing;
  negotiatedPrice?: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  currentStage?: ProgressStage;
  progress: OrderProgress;
  assignedWorkers?: Id<"users">[];
  assignedBy?: Id<"users">;
  assignedAt?: number;
  delivery: OrderDelivery;
  timeline: TimelineEvent[];
  rating?: OrderRating;
  createdAt: number;
  updatedAt: number;
}

// ============================================
// Assignment Types
// ============================================

export type AssignmentStatus = "pending" | "accepted" | "in_progress" | "completed" | "rejected";
export type AssignmentPriority = "low" | "medium" | "high" | "urgent";

export interface ProgressUpdate {
  message: string;
  images?: string[];
  timestamp: number;
}

export interface Assignment {
  _id: Id<"assignments">;
  _creationTime: number;
  orderId: Id<"orders">;
  workerId: Id<"users">;
  stage: ProgressStage;
  assignedBy: Id<"users">;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  notes?: string;
  estimatedDuration?: number;
  actualDuration?: number;
  progressUpdates: ProgressUpdate[];
  assignedAt: number;
  acceptedAt?: number;
  startedAt?: number;
  completedAt?: number;
  updatedAt: number;
}

// ============================================
// Message & Chat Types
// ============================================

export type MessageType = "text" | "image" | "file" | "system";
export type ConversationType = "direct" | "order" | "group";

export interface MessageReaction {
  userId: Id<"users">;
  emoji: string;
  timestamp: number;
}

export interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  conversationId: string;
  senderId: Id<"users">;
  receiverId: Id<"users">;
  orderId?: Id<"orders">;
  content: string;
  type: MessageType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  isEdited: boolean;
  editedAt?: number;
  deletedAt?: number;
  replyTo?: Id<"messages">;
  reactions?: MessageReaction[];
  createdAt: number;
}

export interface ConversationLastMessage {
  content: string;
  senderId: Id<"users">;
  timestamp: number;
}

export interface Conversation {
  _id: Id<"conversations">;
  _creationTime: number;
  participants: Id<"users">[];
  orderId?: Id<"orders">;
  type: ConversationType;
  lastMessage?: ConversationLastMessage;
  unreadCounts: Record<string, number>;
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
}

// ============================================
// Huddle Types
// ============================================

export type HuddleType = "audio" | "video";
export type HuddleStatus = "active" | "ended";

export interface Huddle {
  _id: Id<"huddles">;
  _creationTime: number;
  roomName: string;
  orderId?: Id<"orders">;
  participants: Id<"users">[];
  startedBy: Id<"users">;
  type: HuddleType;
  status: HuddleStatus;
  duration?: number;
  startedAt: number;
  endedAt?: number;
}

// ============================================
// Invitation Types
// ============================================

export type InvitationRole = "org_admin" | "manager" | "worker";
export type InvitationStatus = "pending" | "accepted" | "expired" | "cancelled";

export interface Invitation {
  _id: Id<"invitations">;
  _creationTime: number;
  organizationId: Id<"organizations">;
  email: string;
  role: InvitationRole;
  invitedBy: Id<"users">;
  token: string;
  status: InvitationStatus;
  message?: string;
  expiresAt: number;
  acceptedAt?: number;
  createdAt: number;
}

// ============================================
// Payment Types
// ============================================

export type PaymentStatusType = "pending" | "processing" | "successful" | "failed" | "cancelled" | "refunded";

export interface Payment {
  _id: Id<"payments">;
  _creationTime: number;
  orderId: Id<"orders">;
  customerId: Id<"users">;
  organizationId: Id<"organizations">;
  amount: number;
  currency: string;
  paymentMethod: string;
  provider: string;
  transactionRef: string;
  providerRef?: string;
  status: PaymentStatusType;
  metadata?: Record<string, unknown>;
  paidAt?: number;
  failureReason?: string;
  refundedAmount?: number;
  refundedAt?: number;
  createdAt: number;
  updatedAt: number;
}

// ============================================
// Notification Types
// ============================================

export type NotificationPriority = "low" | "normal" | "high";

export interface Notification {
  _id: Id<"notifications">;
  _creationTime: number;
  userId: Id<"users">;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  orderId?: Id<"orders">;
  styleId?: Id<"styles">;
  senderId?: Id<"users">;
  isRead: boolean;
  readAt?: number;
  actionUrl?: string;
  priority: NotificationPriority;
  expiresAt?: number;
  createdAt: number;
}

// ============================================
// Portfolio Types
// ============================================

export interface PortfolioImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface PortfolioStats {
  views: number;
  likes: number;
}

export interface WorkerPortfolio {
  _id: Id<"workerPortfolio">;
  _creationTime: number;
  workerId: Id<"users">;
  orderId?: Id<"orders">;
  title: string;
  description: string;
  images: PortfolioImage[];
  category: string;
  tags: string[];
  isPublic: boolean;
  isFeatured: boolean;
  stats: PortfolioStats;
  completedAt: number;
  createdAt: number;
  updatedAt: number;
}

// ============================================
// Review Types
// ============================================

export type ReviewStatus = "pending" | "approved" | "rejected" | "flagged";

export interface ReviewResponse {
  content: string;
  respondedBy: Id<"users">;
  respondedAt: number;
}

export interface Review {
  _id: Id<"reviews">;
  _creationTime: number;
  orderId: Id<"orders">;
  organizationId: Id<"organizations">;
  styleId: Id<"styles">;
  customerId: Id<"users">;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  pros?: string[];
  cons?: string[];
  isVerified: boolean;
  response?: ReviewResponse;
  helpfulCount: number;
  reportCount: number;
  status: ReviewStatus;
  createdAt: number;
  updatedAt: number;
}

// ============================================
// Customer Organization Types
// ============================================

export interface CustomerOrganizationStats {
  totalOrders: number;
  completedOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: number;
}

export interface CustomerOrganizationPreferences {
  favoriteCategories: string[];
  preferredMeasurementUnit: MeasurementUnit;
}

export interface CustomerOrganization {
  _id: Id<"customerOrganizations">;
  _creationTime: number;
  customerId: Id<"users">;
  organizationId: Id<"organizations">;
  firstOrderId: Id<"orders">;
  stats: CustomerOrganizationStats;
  preferences?: CustomerOrganizationPreferences;
  createdAt: number;
  updatedAt: number;
}

// ============================================
// Saved Style Types
// ============================================

export interface SavedStyle {
  _id: Id<"savedStyles">;
  _creationTime: number;
  userId: Id<"users">;
  styleId: Id<"styles">;
  notes?: string;
  createdAt: number;
}

// ============================================
// Form Types
// ============================================

export interface CreateOrganizationInput {
  name: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  tagline?: string;
}

export interface CreateStyleInput {
  organizationId: Id<"organizations">;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  gender: StyleGender;
  basePrice: number;
  currency: string;
  isNegotiable: boolean;
  tags: string[];
  measurements: StyleMeasurements;
}

export interface CreateOrderInput {
  styleId: Id<"styles">;
  measurements: OrderMeasurements;
  additionalNotes?: string;
  customizationRequests?: string;
  selectedOptions?: SelectedOption[];
  deliveryAddress: string;
  deliveryPhone: string;
  deliveryInstructions?: string;
}

export interface UpdateOrderProgressInput {
  orderId: Id<"orders">;
  stage: ProgressStage;
  status: StageStatus;
  notes?: string;
  images?: string[];
}

export interface AssignWorkerInput {
  orderId: Id<"orders">;
  workerId: Id<"users">;
  stage: ProgressStage;
  priority: AssignmentPriority;
  notes?: string;
  estimatedDuration?: number;
}

export interface SendMessageInput {
  conversationId: string;
  receiverId: Id<"users">;
  content: string;
  type: MessageType;
  orderId?: Id<"orders">;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// Filter & Search Types
// ============================================

export interface StyleFilters {
  category?: string;
  gender?: StyleGender;
  minPrice?: number;
  maxPrice?: number;
  organizationId?: Id<"organizations">;
  tags?: string[];
  search?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  customerId?: Id<"users">;
  organizationId?: Id<"organizations">;
  dateFrom?: number;
  dateTo?: number;
  search?: string;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

// ============================================
// Flutterwave Types
// ============================================

export interface FlutterwaveCustomer {
  email: string;
  phone_number: string;
  name: string;
}

export interface FlutterwaveConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  customer: FlutterwaveCustomer;
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
  callback: (response: FlutterwaveResponse) => void;
  onclose: () => void;
}

export interface FlutterwaveResponse {
  status: string;
  transaction_id: string;
  tx_ref: string;
  flw_ref: string;
}

// ============================================
// Cloudinary Types
// ============================================

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export interface CloudinaryUploadOptions {
  folder: string;
  transformation?: Record<string, unknown>[];
  resource_type?: "image" | "video" | "raw";
}

// ============================================
// Dashboard Stats Types
// ============================================

export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalRevenue: number;
  pendingPayments: number;
  activeWorkers: number;
  totalCustomers: number;
  averageOrderValue: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrderStatusDistribution {
  status: OrderStatus;
  count: number;
  percentage: number;
}

// ============================================
// Export all types
// ============================================

export type {
  Id,
};