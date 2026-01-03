// ============================================
// FILE: convex/schema.ts
// ============================================

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	// Organizations
	organizations: defineTable({
		name: v.string(),
		slug: v.string(),
		logo: v.optional(v.string()),
		coverImage: v.optional(v.string()),
		description: v.string(),
		tagline: v.optional(v.string()),
		address: v.string(),
		phone: v.string(),
		email: v.string(),
		clerkOrgId: v.string(),
		settings: v.object({
			basePrice: v.number(),
			customizationFeeRange: v.object({
				min: v.number(),
				max: v.number(),
			}),
			allowNegotiation: v.boolean(),
			progressStages: v.array(v.string()),
			deliveryFee: v.number(),
			currency: v.string(),
			businessHours: v.optional(
				v.object({
					monday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
					tuesday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
					wednesday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
					thursday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
					friday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
					saturday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
					sunday: v.object({ open: v.string(), close: v.string(), closed: v.boolean() }),
				})
			),
		}),
		stats: v.object({
			totalDesigns: v.number(),
			completedOrders: v.number(),
			averageRating: v.number(),
			totalReviews: v.number(),
			responseTime: v.number(),
		}),
		badges: v.array(v.string()),
		isActive: v.boolean(),
		isPremium: v.boolean(),
		verified: v.boolean(),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_slug", ["slug"])
		.index("by_clerk_org_id", ["clerkOrgId"])
		.index("by_active", ["isActive"])
		.searchIndex("search_name", {
			searchField: "name",
			filterFields: ["isActive"],
		}),

	// Users
	users: defineTable({
		clerkId: v.string(),
		email: v.string(),
		name: v.string(),
		phone: v.optional(v.string()),
		avatar: v.optional(v.string()),
		role: v.union(
			v.literal("super_admin"),
			v.literal("org_admin"),
			v.literal("manager"),
			v.literal("worker"),
			v.literal("customer")
		),
		organizationId: v.optional(v.id("organizations")),
		preferences: v.object({
			notifications: v.object({
				email: v.boolean(),
				push: v.boolean(),
				sms: v.boolean(),
			}),
			language: v.string(),
			currency: v.string(),
			measurementUnit: v.union(v.literal("cm"), v.literal("inches")),
		}),
		savedMeasurements: v.optional(
			v.object({
				chest: v.optional(v.number()),
				waist: v.optional(v.number()),
				hips: v.optional(v.number()),
				shoulder: v.optional(v.number()),
				length: v.optional(v.number()),
				sleeve: v.optional(v.number()),
				neck: v.optional(v.number()),
				inseam: v.optional(v.number()),
				unit: v.union(v.literal("cm"), v.literal("inches")),
			})
		),
		stats: v.optional(
			v.object({
				totalOrders: v.number(),
				completedOrders: v.number(),
				totalSpent: v.number(),
				savedStyles: v.number(),
				tasksCompleted: v.optional(v.number()),
				efficiency: v.optional(v.number()),
			})
		),
		isActive: v.boolean(),
		lastActiveAt: v.number(),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_clerk_id", ["clerkId"])
		.index("by_email", ["email"])
		.index("by_organization", ["organizationId"])
		.index("by_role", ["role"])
		.searchIndex("search_name", {
			searchField: "name",
			filterFields: ["isActive", "role"],
		}),

	// Styles (Fashion Designs)
	styles: defineTable({
		organizationId: v.id("organizations"),
		title: v.string(),
		description: v.string(),
		category: v.string(),
		subCategory: v.string(),
		gender: v.union(
			v.literal("men"),
			v.literal("women"),
			v.literal("kids"),
			v.literal("unisex")
		),
		images: v.array(
			v.object({
				url: v.string(),
				publicId: v.string(),
				width: v.number(),
				height: v.number(),
				alt: v.optional(v.string()),
			})
		),
		videos: v.optional(v.array(v.object({ url: v.string(), publicId: v.string() }))),
		basePrice: v.number(),
		currency: v.string(),
		isNegotiable: v.boolean(),
		customizationOptions: v.optional(
			v.array(
				v.object({
					name: v.string(),
					type: v.union(v.literal("color"), v.literal("fabric"), v.literal("size"), v.literal("other")),
					options: v.array(v.string()),
					priceImpact: v.number(),
				})
			)
		),
		measurements: v.object({
			required: v.array(v.string()),
			optional: v.array(v.string()),
		}),
		tags: v.array(v.string()),
		isActive: v.boolean(),
		isFeatured: v.boolean(),
		stats: v.object({
			views: v.number(),
			likes: v.number(),
			orders: v.number(),
			shares: v.number(),
		}),
		seo: v.optional(
			v.object({
				metaTitle: v.optional(v.string()),
				metaDescription: v.optional(v.string()),
				keywords: v.optional(v.array(v.string())),
			})
		),
		createdBy: v.id("users"),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_organization", ["organizationId"])
		.index("by_category", ["category"])
		.index("by_active", ["isActive"])
		.index("by_featured", ["isFeatured"])
		.index("by_created_at", ["createdAt"])
		.searchIndex("search_title", {
			searchField: "title",
			filterFields: ["isActive", "category", "gender"],
		}),

	// Orders
	orders: defineTable({
		orderNumber: v.string(),
		customerId: v.id("users"),
		organizationId: v.id("organizations"),
		styleId: v.id("styles"),
		measurements: v.object({
			chest: v.optional(v.number()),
			waist: v.optional(v.number()),
			hips: v.optional(v.number()),
			shoulder: v.optional(v.number()),
			length: v.optional(v.number()),
			sleeve: v.optional(v.number()),
			neck: v.optional(v.number()),
			inseam: v.optional(v.number()),
			custom: v.optional(v.record(v.string(), v.number())),
			unit: v.union(v.literal("cm"), v.literal("inches")),
		}),
		additionalNotes: v.optional(v.string()),
		customizationRequests: v.optional(v.string()),
		selectedOptions: v.optional(
			v.array(
				v.object({
					optionName: v.string(),
					selectedValue: v.string(),
				})
			)
		),
		pricing: v.object({
			basePrice: v.number(),
			customizationFee: v.number(),
			deliveryFee: v.number(),
			discount: v.number(),
			tax: v.number(),
			total: v.number(),
			currency: v.string(),
		}),
		negotiatedPrice: v.optional(v.number()),
		status: v.union(
			v.literal("pending"),
			v.literal("confirmed"),
			v.literal("in_progress"),
			v.literal("completed"),
			v.literal("delivered"),
			v.literal("cancelled"),
			v.literal("refunded")
		),
		paymentStatus: v.union(
			v.literal("unpaid"),
			v.literal("partial"),
			v.literal("paid"),
			v.literal("refunded")
		),
		currentStage: v.optional(
			v.union(
				v.literal("cutting"),
				v.literal("sewing"),
				v.literal("finishing")
			)
		),
		progress: v.object({
			cutting: v.object({
				status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed")),
				startedAt: v.optional(v.number()),
				completedAt: v.optional(v.number()),
				notes: v.optional(v.string()),
				images: v.optional(v.array(v.string())),
			}),
			sewing: v.object({
				status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed")),
				startedAt: v.optional(v.number()),
				completedAt: v.optional(v.number()),
				notes: v.optional(v.string()),
				images: v.optional(v.array(v.string())),
			}),
			finishing: v.object({
				status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed")),
				startedAt: v.optional(v.number()),
				completedAt: v.optional(v.number()),
				notes: v.optional(v.string()),
				images: v.optional(v.array(v.string())),
			}),
		}),
		assignedWorkers: v.optional(v.array(v.id("users"))),
		assignedBy: v.optional(v.id("users")),
		assignedAt: v.optional(v.number()),
		delivery: v.object({
			address: v.string(),
			phone: v.string(),
			alternatePhone: v.optional(v.string()),
			instructions: v.optional(v.string()),
			estimatedDate: v.optional(v.number()),
			actualDate: v.optional(v.number()),
			status: v.union(
				v.literal("pending"),
				v.literal("packed"),
				v.literal("in_transit"),
				v.literal("out_for_delivery"),
				v.literal("delivered"),
				v.literal("failed")
			),
			trackingNumber: v.optional(v.string()),
			courierService: v.optional(v.string()),
		}),
		timeline: v.array(
			v.object({
				event: v.string(),
				description: v.string(),
				timestamp: v.number(),
				actor: v.optional(v.id("users")),
			})
		),
		rating: v.optional(
			v.object({
				value: v.number(),
				review: v.optional(v.string()),
				images: v.optional(v.array(v.string())),
				createdAt: v.number(),
			})
		),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_order_number", ["orderNumber"])
		.index("by_customer", ["customerId"])
		.index("by_organization", ["organizationId"])
		.index("by_status", ["status"])
		.index("by_payment_status", ["paymentStatus"])
		.index("by_created_at", ["createdAt"])
		.index("by_assigned_workers", ["assignedWorkers"]),

	// Customer Organizations (Auto-created relationships)
	customerOrganizations: defineTable({
		customerId: v.id("users"),
		organizationId: v.id("organizations"),
		firstOrderId: v.id("orders"),
		stats: v.object({
			totalOrders: v.number(),
			completedOrders: v.number(),
			totalSpent: v.number(),
			averageOrderValue: v.number(),
			lastOrderDate: v.optional(v.number()),
		}),
		preferences: v.optional(
			v.object({
				favoriteCategories: v.array(v.string()),
				preferredMeasurementUnit: v.union(v.literal("cm"), v.literal("inches")),
			})
		),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_customer", ["customerId"])
		.index("by_organization", ["organizationId"])
		.index("by_customer_and_org", ["customerId", "organizationId"]),

	// Assignments (Worker Tasks)
	assignments: defineTable({
		orderId: v.id("orders"),
		workerId: v.id("users"),
		stage: v.union(v.literal("cutting"), v.literal("sewing"), v.literal("finishing")),
		assignedBy: v.id("users"),
		status: v.union(
			v.literal("pending"),
			v.literal("accepted"),
			v.literal("in_progress"),
			v.literal("completed"),
			v.literal("rejected")
		),
		priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
		notes: v.optional(v.string()),
		estimatedDuration: v.optional(v.number()),
		actualDuration: v.optional(v.number()),
		progressUpdates: v.array(
			v.object({
				message: v.string(),
				images: v.optional(v.array(v.string())),
				timestamp: v.number(),
			})
		),
		assignedAt: v.number(),
		acceptedAt: v.optional(v.number()),
		startedAt: v.optional(v.number()),
		completedAt: v.optional(v.number()),
		updatedAt: v.number(),
	})
		.index("by_order", ["orderId"])
		.index("by_worker", ["workerId"])
		.index("by_status", ["status"])
		.index("by_assigned_by", ["assignedBy"]),

	// Messages (Chat persistence)
	messages: defineTable({
		conversationId: v.string(),
		senderId: v.id("users"),
		receiverId: v.id("users"),
		orderId: v.optional(v.id("orders")),
		content: v.string(),
		type: v.union(
			v.literal("text"),
			v.literal("image"),
			v.literal("file"),
			v.literal("system")
		),
		fileUrl: v.optional(v.string()),
		fileName: v.optional(v.string()),
		fileSize: v.optional(v.number()),
		metadata: v.optional(v.any()),
		isRead: v.boolean(),
		isEdited: v.boolean(),
		editedAt: v.optional(v.number()),
		deletedAt: v.optional(v.number()),
		replyTo: v.optional(v.id("messages")),
		reactions: v.optional(
			v.array(
				v.object({
					userId: v.id("users"),
					emoji: v.string(),
					timestamp: v.number(),
				})
			)
		),
		createdAt: v.number(),
	})
		.index("by_conversation", ["conversationId"])
		.index("by_sender", ["senderId"])
		.index("by_receiver", ["receiverId"])
		.index("by_order", ["orderId"])
		.index("by_created_at", ["createdAt"]),
    
      // Conversations
  conversations: defineTable({
    participants: v.array(v.id("users")),
    orderId: v.optional(v.id("orders")),
    type: v.union(v.literal("direct"), v.literal("order"), v.literal("group")),
    lastMessage: v.optional(
      v.object({
        content: v.string(),
        senderId: v.id("users"),
        timestamp: v.number(),
      })
    ),
    unreadCounts: v.record(v.string(), v.number()),
    isArchived: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_participants", ["participants"])
    .index("by_order", ["orderId"])
    .index("by_updated_at", ["updatedAt"]),

  // Huddles (Video/Audio Call Records)
  huddles: defineTable({
    roomName: v.string(),
    orderId: v.optional(v.id("orders")),
    participants: v.array(v.id("users")),
    startedBy: v.id("users"),
    type: v.union(v.literal("audio"), v.literal("video")),
    status: v.union(v.literal("active"), v.literal("ended")),
    duration: v.optional(v.number()),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
  })
    .index("by_room_name", ["roomName"])
    .index("by_order", ["orderId"])
    .index("by_started_by", ["startedBy"])
    .index("by_status", ["status"]),

  // Invitations
  invitations: defineTable({
    organizationId: v.id("organizations"),
    email: v.string(),
    role: v.union(
      v.literal("org_admin"),
      v.literal("manager"),
      v.literal("worker")
    ),
    invitedBy: v.id("users"),
    token: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("expired"),
      v.literal("cancelled")
    ),
    message: v.optional(v.string()),
    expiresAt: v.number(),
    acceptedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_email", ["email"])
    .index("by_token", ["token"])
    .index("by_status", ["status"]),

  // Payments
  payments: defineTable({
    orderId: v.id("orders"),
    customerId: v.id("users"),
    organizationId: v.id("organizations"),
    amount: v.number(),
    currency: v.string(),
    paymentMethod: v.string(),
    provider: v.string(),
    transactionRef: v.string(),
    providerRef: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("successful"),
      v.literal("failed"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
    metadata: v.optional(v.any()),
    paidAt: v.optional(v.number()),
    failureReason: v.optional(v.string()),
    refundedAmount: v.optional(v.number()),
    refundedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order", ["orderId"])
    .index("by_customer", ["customerId"])
    .index("by_organization", ["organizationId"])
    .index("by_transaction_ref", ["transactionRef"])
    .index("by_status", ["status"]),

  // Notifications
  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
    orderId: v.optional(v.id("orders")),
    styleId: v.optional(v.id("styles")),
    senderId: v.optional(v.id("users")),
    isRead: v.boolean(),
    readAt: v.optional(v.number()),
    actionUrl: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("normal"), v.literal("high")),
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_is_read", ["isRead"])
    .index("by_created_at", ["createdAt"]),

  // Worker Portfolio
  workerPortfolio: defineTable({
    workerId: v.id("users"),
    orderId: v.optional(v.id("orders")),
    title: v.string(),
    description: v.string(),
    images: v.array(
      v.object({
        url: v.string(),
        publicId: v.string(),
        alt: v.optional(v.string()),
      })
    ),
    category: v.string(),
    tags: v.array(v.string()),
    isPublic: v.boolean(),
    isFeatured: v.boolean(),
    stats: v.object({
      views: v.number(),
      likes: v.number(),
    }),
    completedAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_worker", ["workerId"])
    .index("by_is_public", ["isPublic"])
    .index("by_completed_at", ["completedAt"]),

  // Saved Styles (Customer favorites)
  savedStyles: defineTable({
    userId: v.id("users"),
    styleId: v.id("styles"),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_style", ["styleId"])
    .index("by_user_and_style", ["userId", "styleId"]),

  // Reviews
  reviews: defineTable({
    orderId: v.id("orders"),
    organizationId: v.id("organizations"),
    styleId: v.id("styles"),
    customerId: v.id("users"),
    rating: v.number(),
    title: v.optional(v.string()),
    content: v.string(),
    images: v.optional(v.array(v.string())),
    pros: v.optional(v.array(v.string())),
    cons: v.optional(v.array(v.string())),
    isVerified: v.boolean(),
    response: v.optional(
      v.object({
        content: v.string(),
        respondedBy: v.id("users"),
        respondedAt: v.number(),
      })
    ),
    helpfulCount: v.number(),
    reportCount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("flagged")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order", ["orderId"])
    .index("by_organization", ["organizationId"])
    .index("by_style", ["styleId"])
    .index("by_customer", ["customerId"])
    .index("by_status", ["status"]),
});