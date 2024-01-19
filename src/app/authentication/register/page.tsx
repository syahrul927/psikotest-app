import { getProviders } from "next-auth/react";
import Link from "next/link";
import { UserRegisterForm } from "~/app/_components/user-register-form";

const RegisterPage = async () => {
	const providers = await getProviders();
	return (
		<div className="container relative w-full h-screen flex-col items-center flex justify-center">
			<div className="lg:p-8 border bg-background max-w-xl w-full rounded-lg">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 ">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">
							Create an account
						</h1>
						<p className="text-sm text-muted-foreground">
							Enter your email below to create your account
						</p>
					</div>
					<UserRegisterForm providers={providers} />
					<p className="px-8 text-center text-sm text-muted-foreground">
						By clicking continue, you agree to our{" "}
						<Link
							href="/terms"
							className="underline underline-offset-4 hover:text-primary"
						>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link
							href="/privacy"
							className="underline underline-offset-4 hover:text-primary"
						>
							Privacy Policy
						</Link>
						.
					</p>
				</div>
			</div>
		</div>
	);
};
export default RegisterPage;
