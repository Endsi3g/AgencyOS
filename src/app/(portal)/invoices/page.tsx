import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ClientInvoices() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
    if (!profile) return <div>Access Denied</div>;

    // Fetch Invoices
    const { data: invoices } = await supabase
        .from("invoices")
        .select("*, clients(name)")
        .eq("org_id", profile.org_id)
        .order("created_at", { ascending: false });

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Invoices</h1>
                <p className="text-slate-500">Manage your billing and payments.</p>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {invoices && invoices.length > 0 ? invoices.map(invoice => (
                            <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">#{invoice.id.slice(0, 8)}</td>
                                <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{new Date(invoice.created_at).toLocaleDateString()}</td>
                                <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{new Date(invoice.due_date).toLocaleDateString()}</td>
                                <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">${invoice.total.toLocaleString()}</td>
                                <td className="p-4">
                                    <span className={`badge ${invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                            invoice.status === 'overdue' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                                                'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                                        }`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="btn-secondary text-xs h-8 px-3">View</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500">
                                    No invoices found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
