// ============================================
// FILE: src/lib/constants.ts
// ============================================

export const APP_NAME = "StyleHub";
export const APP_DESCRIPTION = "Professional Tailoring Management Platform";

export const CURRENCIES = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "USD", name: "US Dollar", symbol: "$" },
];

export const MEASUREMENT_UNITS = [
  { value: "cm", label: "Centimeters (cm)" },
  { value: "inches", label: "Inches (in)" },
];

export const CATEGORIES = [
  { value: "traditional", label: "Traditional" },
  { value: "modern", label: "Modern" },
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
  { value: "business", label: "Business" },
  { value: "wedding", label: "Wedding" },
  { value: "party", label: "Party" },
];

export const GENDERS = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
  { value: "unisex", label: "Unisex" },
];

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "warning" },
  { value: "confirmed", label: "Confirmed", color: "info" },
  { value: "in_progress", label: "In Progress", color: "info" },
  { value: "completed", label: "Completed", color: "success" },
  { value: "delivered", label: "Delivered", color: "success" },
  { value: "cancelled", label: "Cancelled", color: "error" },
  { value: "refunded", label: "Refunded", color: "error" },
];

export const PAYMENT_STATUSES = [
  { value: "unpaid", label: "Unpaid", color: "error" },
  { value: "partial", label: "Partial", color: "warning" },
  { value: "paid", label: "Paid", color: "success" },
  { value: "refunded", label: "Refunded", color: "error" },
];

export const PROGRESS_STAGES = [
  { value: "cutting", label: "Cutting", icon: "scissors" },
  { value: "sewing", label: "Sewing", icon: "thread" },
  { value: "finishing", label: "Finishing", icon: "sparkles" },
];

export const DELIVERY_STATUSES = [
  { value: "pending", label: "Pending", color: "warning" },
  { value: "packed", label: "Packed", color: "info" },
  { value: "in_transit", label: "In Transit", color: "info" },
  { value: "out_for_delivery", label: "Out for Delivery", color: "info" },
  { value: "delivered", label: "Delivered", color: "success" },
  { value: "failed", label: "Failed", color: "error" },
];

export const PRIORITY_LEVELS = [
  { value: "low", label: "Low", color: "gray" },
  { value: "medium", label: "Medium", color: "blue" },
  { value: "high", label: "High", color: "orange" },
  { value: "urgent", label: "Urgent", color: "red" },
];

export const ROLES = [
  { value: "customer", label: "Customer" },
  { value: "worker", label: "Worker" },
  { value: "manager", label: "Manager" },
  { value: "org_admin", label: "Organization Admin" },
  { value: "super_admin", label: "Super Admin" },
];

export const REQUIRED_MEASUREMENTS = [
  { key: "chest", label: "Chest" },
  { key: "waist", label: "Waist" },
  { key: "shoulder", label: "Shoulder" },
  { key: "length", label: "Length" },
];

export const OPTIONAL_MEASUREMENTS = [
  { key: "hips", label: "Hips" },
  { key: "sleeve", label: "Sleeve" },
  { key: "neck", label: "Neck" },
  { key: "inseam", label: "Inseam" },
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

export const TOAST_DURATION = 4000;