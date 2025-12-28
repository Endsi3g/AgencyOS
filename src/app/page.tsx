import Link from "next/link";

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation */}
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
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Agency OS</h2>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-semibold text-primary hover:text-blue-600 transition-colors"
                    >
                        Log In
                    </Link>
                    <Link
                        href="/register"
                        className="btn-primary"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                        <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                        The Future of Agency Management
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                        One Platform.
                        <br />
                        <span className="text-primary">Infinite Possibilities.</span>
                    </h1>

                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Agency OS consolidates your CRM, project management, billing, and client portal into one powerful platform.
                        Say goodbye to tool fragmentation.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        <Link href="/register" className="btn-primary h-12 px-8 text-base">
                            Start Free Trial
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </Link>
                        <Link href="/dashboard" className="btn-secondary h-12 px-8 text-base">
                            <span className="material-symbols-outlined text-[20px]">play_circle</span>
                            View Demo
                        </Link>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: "group", label: "CRM & Pipeline", desc: "Manage leads & deals" },
                            { icon: "view_kanban", label: "Projects", desc: "Kanban & timelines" },
                            { icon: "payments", label: "Billing", desc: "Invoices & proposals" },
                            { icon: "dashboard", label: "Client Portal", desc: "Self-service hub" },
                        ].map((feature) => (
                            <div
                                key={feature.icon}
                                className="card p-6 text-center hover:border-primary/30"
                            >
                                <div className="size-12 mx-auto mb-4 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[24px]">{feature.icon}</span>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">{feature.label}</h3>
                                <p className="text-sm text-slate-500">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 py-6">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">© 2024 Agency OS. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="text-sm text-slate-500 hover:text-primary">Terms</Link>
                        <Link href="/privacy" className="text-sm text-slate-500 hover:text-primary">Privacy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
