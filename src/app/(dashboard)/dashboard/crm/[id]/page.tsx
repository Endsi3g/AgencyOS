import Header from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import LeadHeader from "../lead-header";
import ActivityTimeline from "../activity-timeline";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: lead } = await supabase
        .from("leads")
        .select("*, activities(*)")
        .eq("id", params.id)
        .order("created_at", { referencedTable: "activities", ascending: false })
        .single();

    if (!lead) {
        notFound();
    }

    return (
        <>
            <Header title={lead.name} />
            <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background-dark p-4 sm:p-8">
                <div className="max-w-4xl mx-auto flex flex-col gap-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Link href="/dashboard/crm" className="hover:text-primary transition-colors">CRM</Link>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        <span className="font-medium text-slate-900 dark:text-white">{lead.name}</span>
                    </div>

                    {/* Interactive Header Card */}
                    <LeadHeader lead={lead} />

                    {/* Details & Activity Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Info - Activity Timeline */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <ActivityTimeline activities={lead.activities || []} leadId={lead.id} />
                        </div>

                        {/* Sidebar Info */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                                <h2 className="text-lg font-bold mb-4">Contact Info</h2>
                                <div className="space-y-3">
                                    {lead.phone && (
                                        <div>
                                            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Phone</label>
                                            <p className="text-sm font-medium">{lead.phone}</p>
                                        </div>
                                    )}
                                    {lead.email && (
                                        <div>
                                            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Email</label>
                                            <p className="text-sm font-medium">{lead.email}</p>
                                        </div>
                                    )}
                                    {lead.company_name && (
                                        <div>
                                            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Company</label>
                                            <p className="text-sm font-medium">{lead.company_name}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
