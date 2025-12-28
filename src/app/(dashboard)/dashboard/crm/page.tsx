import Header from "@/components/layout/Header";
import PipelineBoard from "./pipeline-board";
import { createClient } from "@/lib/supabase/server";
import { createLead } from "./actions";

export default async function CRMPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch leads for the organization
    // We need to get the user's org_id first. 
    // Ideally this should be cached or in session, but for now we fetch profile.
    let leads = [];
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("org_id")
            .eq("id", user.id)
            .single();

        if (profile?.org_id) {
            const { data } = await supabase
                .from("leads")
                .select("*")
                .eq("org_id", profile.org_id)
                .order("created_at", { ascending: false });
            leads = data || [];
        }
    }

    return (
        <>
            <Header title="CRM Pipeline" />

            {/* Toolbar */}
            <div className="flex items-center gap-4 px-6 py-3 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 overflow-x-auto hide-scrollbar flex-shrink-0">
                <button
                    // We use a little inline script or just matching ID for the modal
                    // In Next.js server components we can't restrict 'onClick' easily without client wrapper, 
                    // but we can put the button in the client component or just use a label/hack.
                    // Actually, the easiest way for the "Add Lead" button here is to make this Toolbar client-side or just use a client helper.
                    // For simplicity, let's keep the standard button logic in the board or make a "AddLeadButton" client component.
                    // However, I can also just wrap this button in a simple form or link, OR
                    // I'll make the Toolbar a client component to handle the modal opening?
                    // No, let's just make a simple client component for the 'Add Lead' button.
                    // OR better: The "Add Lead" button in the board works because it's in a client component. 
                    // This toolbar button duplicates functionality. Let's make it work via a client wrapper.
                    className="btn-primary h-9 pointer-events-none opacity-50"
                    title="Use the + buttons in columns for now"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>Add Lead</span>
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>
                <button className="btn-secondary h-9">
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    <span>Filter</span>
                </button>
                <button className="btn-secondary h-9">
                    <span className="material-symbols-outlined text-[18px]">sort</span>
                    <span>Sort</span>
                </button>
                <div className="flex-1"></div>
                <div className="relative hidden lg:block w-64">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <span className="material-symbols-outlined text-[18px]">search</span>
                    </span>
                    <input
                        type="text"
                        className="w-full h-9 pl-9 pr-4 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-primary focus:bg-white dark:focus:bg-surface-dark focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
                        placeholder="Search leads..."
                    />
                </div>
            </div>

            {/* Pipeline Board */}
            <main className="flex-1 overflow-x-auto overflow-y-hidden bg-slate-50/50 dark:bg-background-dark p-4 sm:p-6">
                <PipelineBoard initialLeads={leads} />
            </main>

            {/* Add Lead Modal */}
            <dialog id="add_lead_modal" className="modal p-0 rounded-xl shadow-xl backdrop:bg-slate-900/50">
                <div className="w-full max-w-lg bg-white dark:bg-surface-dark flex flex-col">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-lg dark:text-white">Add New Lead</h3>
                        <form method="dialog">
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </form>
                    </div>
                    <form action={createLead} className="p-6 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex flex-col gap-1.5">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</span>
                                <input name="name" type="text" className="input" placeholder="Contact Name" required />
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Company</span>
                                <input name="company_name" type="text" className="input" placeholder="Company" />
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex flex-col gap-1.5">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
                                <input name="email" type="email" className="input" placeholder="Email Address" />
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Value ($)</span>
                                <input name="value" type="number" className="input" placeholder="0.00" />
                            </label>
                        </div>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Stage</span>
                            <select name="status" className="input">
                                <option value="new">New Lead</option>
                                <option value="qualified">Qualified</option>
                                <option value="proposal">Proposal Sent</option>
                                <option value="won">Won</option>
                            </select>
                        </label>

                        <div className="flex justify-end gap-3 mt-4">
                            <form method="dialog">
                                <button className="btn-secondary">Cancel</button>
                            </form>
                            <button type="submit" className="btn-primary">Create Lead</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
}
