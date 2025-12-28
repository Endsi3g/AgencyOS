"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { signup } from "../actions";

const initialState = {
    error: null as string | null,
    success: null as string | null,
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="btn-primary w-full h-12 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {pending && <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>}
            {pending ? "Creating Account..." : "Create Account"}
        </button>
    );
}

export default function RegisterPage() {
    const [state, formAction] = useFormState(signup, initialState);

    return (
        <>
            {/* Navbar */}
            <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <Link href="/" className="flex items-center gap-3">
                    <div className="size-8 text-primary">
                        <svg className="w-full h-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0)">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                                    fill="currentColor"
                                />
                            </g>
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">Agency OS</h2>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-500 hidden sm:block">Already have an account?</span>
                    <Link href="/login" className="text-sm font-semibold text-primary hover:text-blue-600 transition-colors">
                        Log In
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Card Container */}
                <div className="w-full max-w-[480px] bg-white dark:bg-surface-dark rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200 dark:border-slate-700 relative z-20 overflow-hidden">
                    <div className="p-8 sm:p-10 flex flex-col gap-8">
                        {/* Heading */}
                        <div className="flex flex-col gap-3 text-center">
                            <div className="mx-auto size-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-2 text-primary">
                                <span className="material-symbols-outlined text-2xl">person_add</span>
                            </div>
                            <h1 className="text-3xl font-black leading-tight tracking-[-0.033em]">Create Account</h1>
                            <p className="text-slate-500 text-base font-normal">
                                Get started with your Agency OS workspace
                            </p>
                        </div>

                        {/* Error/Success Message */}
                        {state?.error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center border border-red-100 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
                                {state.error}
                            </div>
                        )}
                        {state?.success && (
                            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm font-medium text-center border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400">
                                {state.success}
                            </div>
                        )}

                        {/* Form */}
                        <form action={formAction} className="flex flex-col gap-5">
                            {/* Full Name */}
                            <label className="flex flex-col gap-2">
                                <span className="text-base font-medium text-slate-700 dark:text-slate-200">Full Name</span>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        name="fullName"
                                        className="input pl-11"
                                        placeholder="John Doe"
                                        required
                                    />
                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        person
                                    </span>
                                </div>
                            </label>

                            {/* Email */}
                            <label className="flex flex-col gap-2">
                                <span className="text-base font-medium text-slate-700 dark:text-slate-200">Work Email</span>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        name="email"
                                        className="input pl-11"
                                        placeholder="name@company.com"
                                        required
                                    />
                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        mail
                                    </span>
                                </div>
                            </label>

                            {/* Password */}
                            <label className="flex flex-col gap-2">
                                <span className="text-base font-medium text-slate-700 dark:text-slate-200">Password</span>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        name="password"
                                        className="input pl-11"
                                        placeholder="Create a strong password"
                                        required
                                    />
                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        lock
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400">Must be at least 4 characters</p>
                            </label>

                            {/* Terms */}
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300 text-primary focus:ring-primary mt-0.5"
                                    required
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                                    {" "}and{" "}
                                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                                </span>
                            </label>

                            {/* Submit */}
                            <SubmitButton />
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
                            <span className="text-sm text-slate-400">or sign up with</span>
                            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
                        </div>

                        {/* Social Login */}
                        <div className="flex gap-4">
                            <button className="btn-secondary flex-1 h-11">
                                <svg className="size-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </button>
                            <button className="btn-secondary flex-1 h-11">
                                <span className="material-symbols-outlined">business</span>
                                Microsoft
                            </button>
                        </div>
                    </div>

                    {/* Bottom Helper */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-700 text-center">
                        <p className="text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link href="/login" className="font-bold text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
