import Link from "next/link";

export default function ForgotPasswordPage() {
    return (
        <>
            {/* Navbar */}
            <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
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
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-500 hidden sm:block">Remember your password?</span>
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
                                <span className="material-symbols-outlined text-2xl">lock_reset</span>
                            </div>
                            <h1 className="text-3xl font-black leading-tight tracking-[-0.033em]">Forgot Password?</h1>
                            <p className="text-slate-500 text-base font-normal leading-normal">
                                No worries, we&apos;ll send you reset instructions.
                            </p>
                        </div>

                        {/* Form */}
                        <form className="flex flex-col gap-6">
                            {/* Email Input */}
                            <label className="flex flex-col gap-2">
                                <span className="text-base font-medium leading-normal text-slate-700 dark:text-slate-200">Email Address</span>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        className="input pl-11"
                                        placeholder="name@company.com"
                                        required
                                    />
                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        mail
                                    </span>
                                </div>
                            </label>

                            {/* Actions */}
                            <div className="flex flex-col gap-4">
                                <button
                                    type="submit"
                                    className="btn-primary w-full h-12 text-base font-bold"
                                >
                                    Send Reset Link
                                </button>
                                <Link
                                    href="/login"
                                    className="group flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm font-bold tracking-[0.015em] transition-colors h-10 rounded-lg"
                                >
                                    <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
                                    <span>Back to log in</span>
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* Bottom Helper */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-700 text-center">
                        <p className="text-sm text-slate-500">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="font-bold text-primary hover:underline">Sign up</Link>
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
