import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ClientApprovals() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
    if (!profile) return <div>Access Denied</div>;

    // Fetch Proposals waiting for approval (or signed)
    const { data: proposals } = await supabase
        .from("proposals")
        .select("*")
        .eq("org_id", profile.org_id)
        .in("status", ["sent", "accepted", "signed"])
        .order("created_at", { ascending: false });

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Approvals</h1>
                <p className="text-slate-500">Review and sign pending proposals.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {proposals && proposals.length > 0 ? proposals.map(proposal => (
                    <div key={proposal.id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{proposal.title}</h3>
                                <span className={`badge ${proposal.status === 'accepted' || proposal.status === 'signed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                        'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                                    }`}>
                                    {proposal.status?.replace('_', ' ')}
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm mb-2">Valid until: {new Date(new Date(proposal.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                            <p className="font-bold text-slate-900 dark:text-white">${proposal.total?.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                            {(proposal.status === 'sent' || proposal.status === 'draft') && (
                                <a href={`/dashboard/billing/proposals/${proposal.id}`} className="btn-primary text-sm whitespace-nowrap">
                                    Review & Sign
                                </a>
                            )}
                            <a href={`/dashboard/billing/proposals/${proposal.id}`} className="btn-secondary text-sm whitespace-nowrap">
                                View Details
                            </a>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-12 bg-white dark:bg-surface-dark rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">approval</span>
                        <p className="text-slate-500">No proposals pending approval.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
