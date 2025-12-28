import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/app/(auth)/actions";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Optional: Verify role is client
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== 'client') {
        // Decide constraint later, for now allow shared access or redirect
        // redirect("/dashboard"); 
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
            <header className="bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/portal/dashboard" className="flex items-center gap-2">
                            <div className="size-8 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined">grid_view</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Client Portal</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-1">
                            <Link href="/portal/dashboard" className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                                Dashboard
                            </Link>
                            <Link href="/portal/projects" className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                                Projects
                            </Link>
                            <Link href="/portal/invoices" className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                                Invoices
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                {user.email?.slice(0, 2).toUpperCase()}
                            </div>
                        </div>
                        <form action={signOut}>
                            <button className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {children}
            </main>

            <footer className="bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 py-6 mt-auto">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} Agency OS. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
