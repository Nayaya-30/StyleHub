
// ============================================
// FILE: src/app/sign-up/[[...sign-up]]/page.tsx
// ============================================

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-50 to-background p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-2">Get Started</h1>
					<p className="text-muted-foreground">
						Create your StyleHub account to begin
					</p>
				</div>
				<SignUp
					appearance={{
						elements: {
							rootBox: "mx-auto",
							card: "shadow-large",
						},
					}}
					redirectUrl="/onboarding"
				/>
			</div>
		</div>
	);
}