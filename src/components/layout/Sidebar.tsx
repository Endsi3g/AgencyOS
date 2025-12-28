import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { signOut } from "@/app/(auth)/actions";

interface SidebarProps {
    activeItem?: string;
    user?: User | null;
    role?: string | null;
}

const navItems = [
    { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
    { icon: "group", label: "CRM", href: "/dashboard/crm" },
    { icon: "work", label: "Projects", href: "/dashboard/projects" },
    { icon: "payments", label: "Billing", href: "/dashboard/billing" },
    { icon: "schedule", label: "Time Tracking", href: "/dashboard/time-tracking" },
    { icon: "task_alt", label: "Team", href: "/dashboard/team" },
];

const secondaryItems = [
    { icon: "bar_chart", label: "Reports", href: "/dashboard/reports" },
    { icon: "settings", label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar({ activeItem = "Dashboard", user, role }: SidebarProps) {
    const isAdmin = role === 'admin' || role === 'owner';

    return (
        <aside className="hidden md:flex flex-col w-64 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark flex-shrink-0">
            {/* Logo */}
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <div className="size-6 text-primary">
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
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-base font-bold leading-none tracking-tight text-slate-900 dark:text-white">Agency OS</h1>
                        <p className="text-slate-500 text-xs font-medium mt-1">Creative Suite</p>
                    </div>
                </div>
            </div>

            {/* Primary Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-1">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={item.label === activeItem ? "nav-link-active" : "nav-link group"}
                    >
                        <span
                            className={`material-symbols-outlined text-[20px] ${item.label === activeItem ? "" : "text-slate-400 group-hover:text-primary transition-colors"
                                }`}
                        >
                            {item.icon}
                        </span>
                        <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                ))}

                <div className="my-4 border-t border-slate-100 dark:border-slate-800"></div>

                {secondaryItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={item.label === activeItem ? "nav-link-active" : "nav-link group"}
                    >
                        <span
                            className={`material-symbols-outlined text-[20px] ${item.label === activeItem ? "" : "text-slate-400 group-hover:text-primary transition-colors"
                                }`}
                        >
                            {item.icon}
                        </span>
                        <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                ))}

                {isAdmin && (
                    <>
                        <div className="my-4 border-t border-slate-100 dark:border-slate-800"></div>
                        <Link
                            href="/dashboard/admin"
                            className={activeItem === "Admin" ? "nav-link-active" : "nav-link group"}
                        >
                            <span className={`material-symbols-outlined text-[20px] ${activeItem === "Admin" ? "" : "text-slate-400 group-hover:text-primary transition-colors"}`}>
                                admin_panel_settings
                            </span>
                            <span className="text-sm font-medium">Admin</span>
                        </Link>
                    </>
                )}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div
                        className="size-8 rounded-full bg-cover bg-center bg-primary/20 flex items-center justify-center text-primary font-bold text-xs"
                    >
                        {user?.email?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user?.email || "No Email"}</p>
                    </div>
                    <form action={signOut}>
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
}
