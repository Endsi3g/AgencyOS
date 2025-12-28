import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";

export default async function AdminDashboard() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== 'admin' && profile?.role !== 'owner') {
        // Strict check for admin
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">gpp_bad</span>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h1>
                <p className="text-slate-500 mb-6">You do not have permission to view the Admin Dashboard.</p>
                <Link href="/dashboard" className="btn-primary">Return to Dashboard</Link>
            </div>
        );
    }

    // Fetch System Stats
    const { count: userCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true });
    const { count: orgCount } = await supabase.from("organizations").select("*", { count: 'exact', head: true });

    return (
        <>
            <Header title="Admin Dashboard" />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                    <span className="material-symbols-outlined text-xl">group</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Users</p>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{userCount || 0}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="card p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <span className="material-symbols-outlined text-xl">business</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Organizations</p>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{orgCount || 0}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="card p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 text-slate-600 rounded-lg">
                                    <span className="material-symbols-outlined text-xl">settings</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">System Status</p>
                                    <h3 className="text-2xl font-bold text-emerald-600">Healthy</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="card p-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                            <div className="flex flex-col gap-2">
                                <Link href="/dashboard/admin/users" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">manage_accounts</span>
                                        <span className="font-medium text-slate-700 dark:text-slate-200">Manage Users</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                                </Link>
                                <Link href="/dashboard/settings" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">tune</span>
                                        <span className="font-medium text-slate-700 dark:text-slate-200">Global Settings</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
