// ============================================
// FILE: src/app/sign-in/[[...sign-in]]/page.tsx
// ============================================

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-50 to-background p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
					<p className="text-muted-foreground">
						Sign in to access your StyleHub account
					</p>
				</div>
				<SignIn
					appearance={{
						elements: {
							rootBox: "mx-auto",
							card: "shadow-large",
						},
					}}
					redirectUrl="/dashboard"
				/>
			</div>
		</div>
	);
}
