
// ============================================
// FILE: src/lib/validators.ts
// ============================================

import { z } from "zod";

/**
 * Email validation schema
 */
export const emailSchema = z.string().email("Invalid email address");

/**
 * Phone number validation schema
 */
export const phoneSchema = z
  .string()
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number must not exceed 15 digits")
  .regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number format");

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

/**
 * URL validation schema
 */
export const urlSchema = z.string().url("Invalid URL format");

/**
 * Slug validation schema
 */
export const slugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters")
  .max(50, "Slug must not exceed 50 characters")
  .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens");

/**
 * Price validation schema
 */
export const priceSchema = z
  .number()
  .positive("Price must be positive")
  .max(10000000, "Price is too high");

/**
 * Measurement validation schema
 */
export const measurementSchema = z
  .number()
  .positive("Measurement must be positive")
  .max(500, "Measurement is too large");

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  return phoneSchema.safeParse(phone).success;
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  return urlSchema.safeParse(url).success;
}