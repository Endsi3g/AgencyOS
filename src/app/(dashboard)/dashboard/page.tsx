import Header from "@/components/layout/Header";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Profile & Role Check
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, org_id")
        .eq("id", user.id)
        .single();

    if (profile?.role === 'client') {
        redirect("/portal/dashboard");
    }

    if (!profile?.org_id) return <div>Organization not found</div>;

    // Fetch Stats in Parallel
    const [
        { data: paidInvoices },
        { data: pipelineLeads },
        { count: activeProjectsCount },
        { data: activities },
        { data: projects }
    ] = await Promise.all([
        supabase.from("invoices").select("total").eq("org_id", profile.org_id).eq("status", "paid"),
        supabase.from("leads").select("value, status").eq("org_id", profile.org_id),
        supabase.from("projects").select("*", { count: 'exact', head: true }).eq("org_id", profile.org_id).eq("status", "in_progress"),
        supabase.from("activities").select("*, profiles(full_name)").eq("client_id", null).order("created_at", { ascending: false }).limit(5), // Assuming general activities
        supabase.from("projects").select("*, clients(name)").eq("org_id", profile.org_id).eq("status", "in_progress").limit(5)
    ]);

    // Calculate Totals
    const totalRevenue = paidInvoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;
    const pipelineValue = pipelineLeads?.reduce((sum, lead) => sum + (lead.value || 0), 0) || 0;

    // Funnel Data
    const funnelCounts = {
        new: pipelineLeads?.filter(l => l.status === 'new').length || 0,
        contacted: pipelineLeads?.filter(l => ['contacted', 'discussion'].includes(l.status)).length || 0,
        proposal: pipelineLeads?.filter(l => ['proposal', 'negotiation'].includes(l.status)).length || 0,
        won: pipelineLeads?.filter(l => l.status === 'won').length || 0
    };
    const maxFunnel = Math.max(...Object.values(funnelCounts), 1); // Avoid division by zero

    return (
        <>
            <Header title="Reports" />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-[1400px] mx-auto flex flex-col gap-6 sm:gap-8">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Executive Overview
                            </h2>
                            <p className="text-slate-500 mt-1 text-base">Key performance metrics.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="btn-secondary">
                                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                                <span>This Month</span>
                            </button>
                            <button className="btn-primary shadow-lg shadow-blue-500/20">
                                <span className="material-symbols-outlined text-[20px]">download</span>
                                <span className="hidden sm:inline">Export Report</span>
                                <span className="sm:hidden">Export</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon="attach_money"
                            iconBg="bg-emerald-50 text-emerald-600"
                            label="Total Revenue"
                            value={`$${totalRevenue.toLocaleString()}`}
                            change="+12%" // Placeholder
                            changeColor="text-emerald-600 bg-emerald-50"
                            accentColor="bg-emerald-500"
                        />
                        <StatCard
                            icon="leaderboard"
                            iconBg="bg-blue-50 text-blue-600"
                            label="Pipeline Value"
                            value={`$${pipelineValue.toLocaleString()}`}
                            change="+5%" // Placeholder
                            changeColor="text-blue-600 bg-blue-50"
                            accentColor="bg-blue-500"
                        />
                        <StatCard
                            icon="folder_open"
                            iconBg="bg-indigo-50 text-indigo-600"
                            label="Active Projects"
                            value={activeProjectsCount?.toString() || "0"}
                            change="0%"
                            changeColor="text-slate-500 bg-slate-100"
                            accentColor="bg-indigo-500"
                        />
                        <StatCard
                            icon="pie_chart"
                            iconBg="bg-purple-50 text-purple-600"
                            label="Profit Margin"
                            value="32%" // Placeholder or calculate if cost data exists
                            change="+2.4%"
                            changeColor="text-emerald-600 bg-emerald-50"
                            accentColor="bg-purple-500"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pipeline Funnel */}
                        <div className="card p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pipeline Funnel</h3>
                                    <p className="text-sm text-slate-500">Conversion rates per stage</p>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>
                            <div className="flex-1 flex flex-col justify-end gap-2">
                                <div className="grid grid-cols-4 gap-2 sm:gap-4 items-end h-48 w-full px-2">
                                    {[
                                        { label: "New", count: funnelCounts.new, bg: "bg-blue-100" },
                                        { label: "Contacted", count: funnelCounts.contacted, bg: "bg-blue-300" },
                                        { label: "Proposal", count: funnelCounts.proposal, bg: "bg-blue-500" },
                                        { label: "Won", count: funnelCounts.won, bg: "bg-primary" },
                                    ].map((bar) => (
                                        <div key={bar.label} className="flex flex-col justify-end h-full gap-2 group cursor-pointer relative" title={`${bar.count} Leads`}>
                                            <div
                                                className={`w-full ${bar.bg} rounded-t-md relative group-hover:brightness-90 transition-all`}
                                                style={{ height: `${(bar.count / maxFunnel) * 100}%`, minHeight: '4px' }}
                                            />
                                            <p className="text-[10px] sm:text-xs font-semibold text-center text-slate-500">{bar.label}</p>
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold bg-slate-800 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                {bar.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Team Utilization (Static for now as we don't have utilization data) */}
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Team Utilization</h3>
                                    <p className="text-sm text-slate-500">Capacity for current sprint</p>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                                    Sprint 24
                                </div>
                            </div>
                            <div className="flex flex-col gap-6">
                                {[
                                    { label: "Design", value: 85, color: "bg-primary" },
                                    { label: "Dev", value: 92, color: "bg-sky-400" },
                                    { label: "Copy", value: 45, color: "bg-primary/60" },
                                    { label: "Strategy", value: 60, color: "bg-primary/30" },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center gap-4">
                                        <div className="w-16 sm:w-20 text-sm font-medium text-slate-600 dark:text-slate-400">
                                            {item.label}
                                        </div>
                                        <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.color} rounded-full`}
                                                style={{ width: `${item.value}%` }}
                                            />
                                        </div>
                                        <div className="w-10 text-right text-sm font-bold text-slate-900 dark:text-white">
                                            {item.value}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                        {/* Active Projects Table */}
                        <div className="xl:col-span-2 card p-6 overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Projects</h3>
                                <Link href="/dashboard/projects" className="text-sm font-medium text-primary hover:text-primary-dark">
                                    View All
                                </Link>
                            </div>
                            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
                                <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-0">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                                            <th className="pb-3 font-semibold pl-1">Project Name</th>
                                            <th className="pb-3 font-semibold">Client</th>
                                            <th className="pb-3 font-semibold">Status</th>
                                            <th className="pb-3 font-semibold">Due Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {projects?.map((project) => (
                                            <tr key={project.id} className="group border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-4 pl-1">
                                                    <div className="font-medium text-slate-900 dark:text-white">{project.name}</div>
                                                </td>
                                                <td className="py-4 text-slate-600 dark:text-slate-400">
                                                    {project.clients?.name}
                                                </td>
                                                <td className="py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                                                        {project.status?.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-slate-600 dark:text-slate-400">{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}</td>
                                            </tr>
                                        ))}
                                        {!projects?.length && (
                                            <tr><td colSpan={4} className="py-4 text-center text-slate-500">No active projects</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                    <span className="material-symbols-outlined">filter_list</span>
                                </button>
                            </div>
                            <div className="relative pl-2">
                                <div className="absolute left-4 top-2 bottom-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                                <div className="flex flex-col gap-6">
                                    {activities?.map((activity, i) => (
                                        <div key={activity.id} className="relative flex gap-4">
                                            <div className="relative z-10 flex-none size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border-2 border-white dark:border-surface-dark">
                                                <span className="material-symbols-outlined text-[16px]">
                                                    {activity.type === 'note' ? 'comment' :
                                                        activity.type === 'status_change' ? 'swap_horiz' :
                                                            'history'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col pt-1">
                                                <p className="text-sm text-slate-900 dark:text-white">
                                                    <span className="font-semibold">{activity.profiles?.full_name || 'User'}</span> {activity.description}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5">{new Date(activity.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {!activities?.length && <p className="text-slate-500 text-sm pl-4">No recent activity</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

function StatCard({
    icon,
    iconBg,
    label,
    value,
    change,
    changeColor,
    accentColor,
}: {
    icon: string;
    iconBg: string;
    label: string;
    value: string;
    change: string;
    changeColor: string;
    accentColor: string;
}) {
    return (
        <div className="card p-5 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                    <span className="material-symbols-outlined text-[24px]">{icon}</span>
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${changeColor} px-2 py-1 rounded-full`}>
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    {change}
                </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
            <div
                className={`absolute bottom-0 left-0 w-full h-1 ${accentColor} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}
            />
        </div>
    );
}
