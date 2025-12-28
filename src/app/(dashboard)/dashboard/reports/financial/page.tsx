import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";

export default async function FinancialReportPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
    if (!profile?.org_id) return <div>Access Denied</div>;

    // Fetch Invoices
    const { data: invoices } = await supabase
        .from("invoices")
        .select("total, created_at, status")
        .eq("org_id", profile.org_id)
        .order("created_at", { ascending: true });

    // Calculate Monthly Revenue (Mocking dates to recent)
    // Group by month
    const monthlyRevenue: Record<string, number> = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    invoices?.forEach(inv => {
        if (inv.status === 'paid') {
            const date = new Date(inv.created_at);
            const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
            monthlyRevenue[key] = (monthlyRevenue[key] || 0) + (inv.total || 0);
        }
    });

    // Top Revenue Sources (Clients) - Join needed or separate fetch
    const { data: clientRevenue } = await supabase
        .from("invoices")
        .select("total, clients(name)")
        .eq("org_id", profile.org_id)
        .eq("status", "paid");

    const clientTotals: Record<string, number> = {};
    clientRevenue?.forEach((item: any) => {
        const name = item.clients?.name || 'Unknown';
        clientTotals[name] = (clientTotals[name] || 0) + (item.total || 0);
    });

    const topClients = Object.entries(clientTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <>
            <Header title="Financial Report" />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto flex flex-col gap-8">
                    {/* Navigation Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-slate-800">
                        <Link href="/dashboard/reports/financial" className="px-6 py-3 border-b-2 border-primary text-primary font-medium text-sm">Financials</Link>
                        <Link href="/dashboard/reports/projects" className="px-6 py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium text-sm transition-colors">Projects</Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Revenue Overview */}
                        <div className="lg:col-span-2 card p-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Revenue Growth</h3>
                            <div className="h-64 flex items-end justify-between gap-2 px-2">
                                {Object.entries(monthlyRevenue).length > 0 ? Object.entries(monthlyRevenue).map(([month, total], i) => (
                                    <div key={month} className="flex flex-col items-center gap-2 group w-full">
                                        <div
                                            className="w-full bg-emerald-500 rounded-t-sm hover:bg-emerald-400 transition-colors relative min-h-[4px]"
                                            style={{ height: `${Math.min((total / 50000) * 100, 100)}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                ${total.toLocaleString()}
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium rotate-0 sm:rotate-0 truncate w-full text-center">{month.split(' ')[0]}</span>
                                    </div>
                                )) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        No recent revenue data
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="flex flex-col gap-4">
                            <div className="card p-6">
                                <p className="text-sm font-medium text-slate-500">Total Revenue (YTD)</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                                    ${invoices?.filter(i => i.status === 'paid').reduce((a, b) => a + (b.total || 0), 0).toLocaleString()}
                                </h3>
                                <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-medium">
                                    <span className="material-symbols-outlined text-lg">trending_up</span>
                                    +12.5% vs last year
                                </div>
                            </div>
                            <div className="card p-6">
                                <p className="text-sm font-medium text-slate-500">outstanding Invoices</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                                    ${invoices?.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((a, b) => a + (b.total || 0), 0).toLocaleString()}
                                </h3>
                                <div className="mt-4 flex items-center gap-2 text-amber-600 text-sm font-medium">
                                    <span className="material-symbols-outlined text-lg">pending</span>
                                    Pending Payment
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Clients */}
                    <div className="card p-6 mt-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Top Clients by Revenue</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th className="pb-3 text-xs uppercase tracking-wide text-slate-500 font-semibold">Client Name</th>
                                        <th className="pb-3 text-xs uppercase tracking-wide text-slate-500 font-semibold text-right">Total Revenue</th>
                                        <th className="pb-3 text-xs uppercase tracking-wide text-slate-500 font-semibold text-right">% of Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {topClients.map(([name, total]) => (
                                        <tr key={name}>
                                            <td className="py-4 font-medium text-slate-900 dark:text-white">{name}</td>
                                            <td className="py-4 text-right text-slate-600 dark:text-slate-300 font-bold">${total.toLocaleString()}</td>
                                            <td className="py-4 text-right text-slate-500 text-sm">
                                                {((total / (invoices?.reduce((a, b) => a + (b.total || 0), 0) || 1)) * 100).toFixed(1)}%
                                            </td>
                                        </tr>
                                    ))}
                                    {topClients.length === 0 && (
                                        <tr><td colSpan={3} className="py-8 text-center text-slate-500">No client data available</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
