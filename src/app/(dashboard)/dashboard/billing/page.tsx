import Header from "@/components/layout/Header";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function getInvoices() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
    if (!profile?.org_id) return [];

    const { data } = await supabase
        .from("invoices")
        .select(`
            *,
            clients (name),
            projects (name)
        `)
        .eq("org_id", profile.org_id)
        .order("issue_date", { ascending: false });

    return data || [];
}

export default async function BillingPage() {
    const invoices = await getInvoices();

    // Calculate stats
    const totalOutstanding = invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((acc, curr) => acc + (curr.total || 0), 0);
    const paidThisMonth = invoices.filter(i => i.status === 'paid' && new Date(i.issue_date).getMonth() === new Date().getMonth()).reduce((acc, curr) => acc + (curr.total || 0), 0);
    const overdue = invoices.filter(i => i.status === 'overdue').reduce((acc, curr) => acc + (curr.total || 0), 0);
    const draft = invoices.filter(i => i.status === 'draft').reduce((acc, curr) => acc + (curr.total || 0), 0);

    return (
        <>
            <Header title="Billing & Invoicing" />

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
                    {/* Header Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Invoices
                            </h2>
                            <p className="text-slate-500 mt-1">Manage your quotes, invoices, and subscriptions</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard/billing/proposals/new" className="btn-secondary">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                New Proposal
                            </Link>
                            <Link href="/dashboard/billing/invoices/new" className="btn-primary">
                                <span className="material-symbols-outlined text-[18px]">receipt</span>
                                New Invoice
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="card p-4">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Outstanding</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">${totalOutstanding.toLocaleString()}</p>
                        </div>
                        <div className="card p-4">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Paid This Month</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${paidThisMonth.toLocaleString()}</p>
                        </div>
                        <div className="card p-4">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Overdue</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">${overdue.toLocaleString()}</p>
                        </div>
                        <div className="card p-4">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Draft</p>
                            <p className="text-2xl font-bold text-slate-600 dark:text-slate-300">${draft.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Invoices Table */}
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Client</th>
                                        <th className="p-4 hidden md:table-cell">Project</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 hidden sm:table-cell">Due Date</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                    {invoices.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-slate-500">
                                                No invoices found. Create your first one!
                                            </td>
                                        </tr>
                                    ) : (
                                        invoices.map((invoice) => (
                                            <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="p-4 text-slate-600 dark:text-slate-300">
                                                    {new Date(invoice.issue_date).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 font-medium text-slate-900 dark:text-white">
                                                    {invoice.clients?.name || 'Unknown'}
                                                </td>
                                                <td className="p-4 text-slate-500 dark:text-slate-400 hidden md:table-cell">
                                                    {invoice.projects?.name || '-'}
                                                </td>
                                                <td className="p-4 font-bold text-slate-900 dark:text-white">
                                                    ${(invoice.total || 0).toLocaleString()}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium lowercase
                                                        ${invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                                                            invoice.status === 'sent' ? 'bg-blue-50 text-blue-700' :
                                                                invoice.status === 'overdue' ? 'bg-red-50 text-red-700' :
                                                                    'bg-slate-100 text-slate-600'}`}>
                                                        <span className="size-1.5 rounded-full bg-current"></span>
                                                        {invoice.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                                                    {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="text-slate-400 hover:text-primary p-1">
                                                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                        </button>
                                                        <button className="text-slate-400 hover:text-primary p-1">
                                                            <span className="material-symbols-outlined text-[20px]">download</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Proposals Table */}
                    <div className="card overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Recent Proposals</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <th className="p-4">Title</th>
                                        <th className="p-4">Client</th>
                                        <th className="p-4">Created</th>
                                        <th className="p-4">Value</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                    {proposals.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-slate-500">
                                                No proposals found. Create one to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        proposals.map((proposal: any) => (
                                            <tr key={proposal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="p-4 font-medium text-slate-900 dark:text-white">
                                                    {proposal.title}
                                                </td>
                                                <td className="p-4 text-slate-600 dark:text-slate-300">
                                                    {proposal.clients?.name || 'Unknown'}
                                                </td>
                                                <td className="p-4 text-slate-500 dark:text-slate-400">
                                                    {new Date(proposal.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 font-medium text-slate-900 dark:text-white">
                                                    ${(proposal.total || 0).toLocaleString()}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium lowercase
                                                        ${proposal.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' :
                                                            proposal.status === 'sent' ? 'bg-blue-50 text-blue-700' :
                                                                'bg-amber-50 text-amber-700'}`}>
                                                        <span className="size-1.5 rounded-full bg-current"></span>
                                                        {proposal.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Link href={`/dashboard/billing/proposals/${proposal.id}`} className="text-primary hover:underline text-xs font-medium">
                                                        View & Sign
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
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
