/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions from "../actions.js";
import type * as assignments from "../assignments.js";
import type * as conversations from "../conversations.js";
import type * as huddles from "../huddles.js";
import type * as invitations from "../invitations.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as orders from "../orders.js";
import type * as organisations from "../organisations.js";
import type * as payments from "../payments.js";
import type * as reviews from "../reviews.js";
import type * as savedStyles from "../savedStyles.js";
import type * as security from "../security.js";
import type * as styles from "../styles.js";
import type * as users from "../users.js";
import type * as workerPortfolio from "../workerPortfolio.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  actions: typeof actions;
  assignments: typeof assignments;
  conversations: typeof conversations;
  huddles: typeof huddles;
  invitations: typeof invitations;
  messages: typeof messages;
  notifications: typeof notifications;
  orders: typeof orders;
  organisations: typeof organisations;
  payments: typeof payments;
  reviews: typeof reviews;
  savedStyles: typeof savedStyles;
  security: typeof security;
  styles: typeof styles;
  users: typeof users;
  workerPortfolio: typeof workerPortfolio;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
