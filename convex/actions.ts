// ============================================
// FILE: convex/actions.ts
// ============================================

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * Action: Send email invitation
 */
export const sendInvitationEmail = action({
	args: {
		email: v.string(),
		organizationName: v.string(),
		inviterName: v.string(),
		role: v.string(),
		invitationUrl: v.string(),
	},
	handler: async (ctx, args) => {
		const resendApiKey = process.env.RESEND_API_KEY;
		if (!resendApiKey) {
			throw new Error("RESEND_API_KEY not configured");
		}

		try {
			const response = await fetch("https://api.resend.com/emails", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${resendApiKey}`,
				},
				body: JSON.stringify({
					from: "StyleHub <noreply@stylehub.app>",
					to: args.email,
					subject: `You're invited to join ${args.organizationName}`,
					html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { text-align: center; padding: 40px 0; }
                  .content { background: #f7f7f5; padding: 30px; border-radius: 12px; }
                  .button { display: inline-block; background: #1a1a1a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
                  .footer { text-align: center; color: #8B8B88; font-size: 14px; margin-top: 30px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>StyleHub</h1>
                  </div>
                  <div class="content">
                    <h2>You're invited!</h2>
                    <p>Hi there,</p>
                    <p>${args.inviterName} has invited you to join <strong>${args.organizationName}</strong> on StyleHub as a <strong>${args.role}</strong>.</p>
                    <p>Click the button below to accept the invitation and get started:</p>
                    <center>
                      <a href="${args.invitationUrl}" class="button">Accept Invitation</a>
                    </center>
                    <p style="margin-top: 30px;">This invitation will expire in 7 days.</p>
                  </div>
                  <div class="footer">
                    <p>StyleHub - Professional Tailoring Management Platform</p>
                  </div>
                </div>
              </body>
            </html>
          `,
				}),
			});

			if (!response.ok) {
				const error = await response.text();
				throw new Error(`Failed to send email: ${error}`);
			}

			const data = await response.json();
			return { success: true, emailId: data.id };
		} catch (error) {
			console.error("Error sending invitation email:", error);
			throw error;
		}
	},
});

/**
 * Action: Send order confirmation email
 */
export const sendOrderConfirmationEmail = action({
	args: {
		email: v.string(),
		customerName: v.string(),
		orderNumber: v.string(),
		orderTotal: v.string(),
		estimatedDelivery: v.string(),
		orderUrl: v.string(),
	},
	handler: async (ctx, args) => {
		const resendApiKey = process.env.RESEND_API_KEY;
		if (!resendApiKey) {
			throw new Error("RESEND_API_KEY not configured");
		}

		try {
			const response = await fetch("https://api.resend.com/emails", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${resendApiKey}`,
				},
				body: JSON.stringify({
					from: "StyleHub <orders@stylehub.app>",
					to: args.email,
					subject: `Order Confirmation - ${args.orderNumber}`,
					html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { text-align: center; padding: 40px 0; }
                  .content { background: #f7f7f5; padding: 30px; border-radius: 12px; }
                  .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                  .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e5e0; }
                  .button { display: inline-block; background: #1a1a1a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
                  .footer { text-align: center; color: #8B8B88; font-size: 14px; margin-top: 30px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>✓ Order Confirmed</h1>
                  </div>
                  <div class="content">
                    <p>Hi ${args.customerName},</p>
                    <p>Thank you for your order! We've received your order and will start working on it shortly.</p>
                    <div class="order-info">
                      <div class="info-row">
                        <strong>Order Number:</strong>
                        <span>${args.orderNumber}</span>
                      </div>
                      <div class="info-row">
                        <strong>Total:</strong>
                        <span>${args.orderTotal}</span>
                      </div>
                      <div class="info-row" style="border-bottom: none;">
                        <strong>Estimated Delivery:</strong>
                        <span>${args.estimatedDelivery}</span>
                      </div>
                    </div>
                    <center>
                      <a href="${args.orderUrl}" class="button">Track Your Order</a>
                    </center>
                  </div>
                  <div class="footer">
                    <p>StyleHub - Professional Tailoring Management Platform</p>
                  </div>
                </div>
              </body>
            </html>
          `,
				}),
			});

			if (!response.ok) {
				const error = await response.text();
				throw new Error(`Failed to send email: ${error}`);
			}

			const data = await response.json();
			return { success: true, emailId: data.id };
		} catch (error) {
			console.error("Error sending order confirmation email:", error);
			throw error;
		}
	},
});

/**
 * Action: Send order status update email
 */
export const sendOrderStatusEmail = action({
	args: {
		email: v.string(),
		customerName: v.string(),
		orderNumber: v.string(),
		status: v.string(),
		statusMessage: v.string(),
		orderUrl: v.string(),
	},
	handler: async (ctx, args) => {
		const resendApiKey = process.env.RESEND_API_KEY;
		if (!resendApiKey) {
			throw new Error("RESEND_API_KEY not configured");
		}

		try {
			const response = await fetch("https://api.resend.com/emails", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${resendApiKey}`,
				},
				body: JSON.stringify({
					from: "StyleHub <orders@stylehub.app>",
					to: args.email,
					subject: `Order Update - ${args.orderNumber}`,
					html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { text-align: center; padding: 40px 0; }
                  .content { background: #f7f7f5; padding: 30px; border-radius: 12px; }
                  .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; background: #10B981; color: white; font-weight: 600; }
                  .button { display: inline-block; background: #1a1a1a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
                  .footer { text-align: center; color: #8B8B88; font-size: 14px; margin-top: 30px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Order Update</h1>
                  </div>
                  <div class="content">
                    <p>Hi ${args.customerName},</p>
                    <p>Your order <strong>${args.orderNumber}</strong> has been updated:</p>
                    <center style="margin: 30px 0;">
                      <span class="status-badge">${args.status}</span>
                    </center>
                    <p>${args.statusMessage}</p>
                    <center>
                      <a href="${args.orderUrl}" class="button">View Order Details</a>
                    </center>
                  </div>
                  <div class="footer">
                    <p>StyleHub - Professional Tailoring Management Platform</p>
                  </div>
                </div>
              </body>
            </html>
          `,
				}),
			});

			if (!response.ok) {
				const error = await response.text();
				throw new Error(`Failed to send email: ${error}`);
			}

			const data = await response.json();
			return { success: true, emailId: data.id };
		} catch (error) {
			console.error("Error sending order status email:", error);
			throw error;
		}
	},
});

/**
 * Action: Initialize Flutterwave payment
 */
export const initializePayment = action({
	args: {
		orderId: v.id("orders"),
		amount: v.number(),
		currency: v.string(),
		customerEmail: v.string(),
		customerName: v.string(),
		customerPhone: v.string(),
	},
	handler: async (ctx, args) => {
		const flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;
		if (!flutterwaveSecretKey) {
			throw new Error("FLUTTERWAVE_SECRET_KEY not configured");
		}

		// Generate transaction reference
		const timestamp = Date.now().toString(36).toUpperCase();
		const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
		const txRef = `TXN-${timestamp}-${randomStr}`;

		try {
			const response = await fetch("https://api.flutterwave.com/v3/payments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${flutterwaveSecretKey}`,
				},
				body: JSON.stringify({
					tx_ref: txRef,
					amount: args.amount,
					currency: args.currency,
					redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify`,
					payment_options: "card,banktransfer,ussd,mobilemoney",
					customer: {
						email: args.customerEmail,
						name: args.customerName,
						phonenumber: args.customerPhone,
					},
					customizations: {
						title: "StyleHub",
						description: `Payment for order`,
						logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
					},
					meta: {
						orderId: args.orderId,
					},
				}),
			});

			if (!response.ok) {
				const error = await response.text();
				throw new Error(`Failed to initialize payment: ${error}`);
			}

			const data = await response.json();

			if (data.status !== "success") {
				throw new Error(data.message || "Payment initialization failed");
			}

			// Create payment record
			await ctx.runMutation(api.payments.createPayment, {
				orderId: args.orderId,
				amount: args.amount,
				currency: args.currency,
				transactionRef: txRef,
				providerRef: data.data.id.toString(),
				paymentMethod: "flutterwave",
			});

			return {
				success: true,
				paymentUrl: data.data.link,
				transactionRef: txRef,
			};
		} catch (error) {
			console.error("Error initializing payment:", error);
			throw error;
		}
	},
});

/**
 * Action: Verify Flutterwave payment
 */
export const verifyPayment = action({
	args: {
		transactionId: v.string(),
		txRef: v.string(),
	},
	handler: async (ctx, args) => {
		const flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;
		if (!flutterwaveSecretKey) {
			throw new Error("FLUTTERWAVE_SECRET_KEY not configured");
		}

		try {
			const response = await fetch(
				`https://api.flutterwave.com/v3/transactions/${args.transactionId}/verify`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${flutterwaveSecretKey}`,
					},
				}
			);

			if (!response.ok) {
				const error = await response.text();
				throw new Error(`Failed to verify payment: ${error}`);
			}

			const data = await response.json();

			if (data.status !== "success") {
				throw new Error(data.message || "Payment verification failed");
			}

			const paymentData = data.data;

			// Update payment status
			await ctx.runMutation(api.payments.updatePaymentStatus, {
				transactionRef: args.txRef,
				status: paymentData.status === "successful" ? "successful" : "failed",
				providerRef: paymentData.id.toString(),
				metadata: {
					amount: paymentData.amount,
					currency: paymentData.currency,
					paymentType: paymentData.payment_type,
				},
			});

			return {
				success: paymentData.status === "successful",
				status: paymentData.status,
				amount: paymentData.amount,
				currency: paymentData.currency,
			};
		} catch (error) {
			console.error("Error verifying payment:", error);
			throw error;
		}
	},
});

/**
 * Action: Upload image to Cloudinary
 */
export const uploadToCloudinary = action({
	args: {
		file: v.string(), // base64 encoded
		folder: v.string(),
		resourceType: v.optional(v.union(
			v.literal("image"),
			v.literal("video"),
			v.literal("raw")
		)),
	},
	handler: async (ctx, args) => {
		const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
		const apiKey = process.env.CLOUDINARY_API_KEY;
		const apiSecret = process.env.CLOUDINARY_API_SECRET;

		if (!cloudName || !apiKey || !apiSecret) {
			throw new Error("Cloudinary credentials not configured");
		}

		try {
			const formData = new FormData();
			formData.append("file", args.file);
			formData.append("folder", args.folder);
			formData.append("api_key", apiKey);

			// Generate signature
			const timestamp = Math.round(Date.now() / 1000);
			formData.append("timestamp", timestamp.toString());

			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${cloudName}/${args.resourceType || "image"}/upload`,
				{
					method: "POST",
					body: formData,
				}
			);

			if (!response.ok) {
				const error = await response.text();
				throw new Error(`Failed to upload to Cloudinary: ${error}`);
			}

			const data = await response.json();

			return {
				success: true,
				publicId: data.public_id,
				url: data.secure_url,
				width: data.width,
				height: data.height,
				format: data.format,
			};
		} catch (error) {
			console.error("Error uploading to Cloudinary:", error);
			throw error;
		}
	},
});

/**
 * Action: Delete image from Cloudinary
 */
export const deleteFromCloudinary = action({
	args: {
		publicId: v.string(),
		resourceType: v.optional(v.union(
			v.literal("image"),
			v.literal("video"),
			v.literal("raw")
		)),
	},
	handler: async (ctx, args) => {
		const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
		const apiKey = process.env.CLOUDINARY_API_KEY;
		const apiSecret = process.env.CLOUDINARY_API_SECRET;

		if (!cloudName || !apiKey || !apiSecret) {
			throw new Error("Cloudinary credentials not configured");
		}

		try {
			const timestamp = Math.round(Date.now() / 1000);
			const signature = `public_id=${args.publicId}&timestamp=${timestamp}${apiSecret}`;

			const formData = new FormData();
			formData.append("public_id", args.publicId);
			formData.append("timestamp", timestamp.toString());
			formData.append("api_key", apiKey);
			formData.append("signature", signature);

			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${cloudName}/${args.resourceType || "image"}/destroy`,
				{
					method: "POST",
					body: formData,
				}
			);

			if (!response.ok) {
				const error = await response.text();
				throw new Error(`Failed to delete from Cloudinary: ${error}`);
			}

			const data = await response.json();

			return {
				success: data.result === "ok",
				result: data.result,
			};
		} catch (error) {
			console.error("Error deleting from Cloudinary:", error);
			throw error;
		}
	},
});
