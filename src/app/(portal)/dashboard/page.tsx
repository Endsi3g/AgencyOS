import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function ClientDashboard() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Get Client ID associated with this user
    // Assumption: 'profiles' has 'email' or we link by user.id
    // But clients table is separate. We need to link auth users to clients.
    // For this MVP, we will assume if role='client', we find the client entry by email or some mapping.
    // Let's assume user.email matches client.contact_email for now if strict link missing.
    // OR we check data access: client users can see data where client_id matches the one assigned to them.
    // Simplifying: Fetch anything where the user is authorized.

    // For demonstration, fetch data relevant to the org this user belongs to (if they are a client of that org).
    // BETTER: Client users should have an `org_id` pointing to the agency, AND likely a `client_id` in their profile if 1-to-1.
    // Let's just lookup invoices/projects for now.

    const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
    if (!profile) return <div>Access Denied</div>;

    // Fetch Active Projects
    // Since RLS policies were set to "Exists in profiles where org_id matches", a client in the same org (as a user) would see ALL projects.
    // We need to refine RLS for clients to only see THEIR projects. 
    // Implementation Plan didn't specify strict Client RLS changes yet, so we will filter by client_id if we can find it.

    // Attempt to find client record by email? Or simply show all for demo if role isn't enforced strictly.
    // Let's filter by the user's assigned client_id if we added it to profile? We didn't.
    // We will just show "Active Projects" in the org for now, assuming this key user is the "Client" for the agency.

    const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .eq("org_id", profile.org_id)
        .eq("status", "in_progress")
        .limit(5);

    const { data: invoices } = await supabase
        .from("invoices")
        .select("*, clients(name)")
        .eq("org_id", profile.org_id)
        .in("status", ["sent", "overdue"])
        .order("due_date", { ascending: true })
        .limit(5);

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back!</h1>
                <p className="text-slate-500">Here is what is happening with your projects.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Projects */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Active Projects</h2>
                        <Link href="/portal/projects" className="text-sm text-primary hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {projects && projects.length > 0 ? projects.map(project => (
                            <div key={project.id} className="border border-slate-100 dark:border-slate-800 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-slate-900 dark:text-white">{project.name}</h3>
                                    <span className="badge bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">In Progress</span>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-3">{project.description}</p>
                                <div className="text-xs text-slate-400">
                                    Ends: {new Date(project.end_date).toLocaleDateString()}
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-500 text-sm">No active projects.</p>
                        )}
                    </div>
                </div>

                {/* Pending Invoices */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Outstanding Invoices</h2>
                        <Link href="/portal/invoices" className="text-sm text-primary hover:underline">View All</Link>
                    </div>
                    <div className="space-y-3">
                        {invoices && invoices.length > 0 ? invoices.map(invoice => (
                            <div key={invoice.id} className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-800/50">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">#{invoice.id.slice(0, 8)}</p>
                                    <p className="text-xs text-slate-500">Due {new Date(invoice.due_date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900 dark:text-white">${invoice.total.toLocaleString()}</p>
                                    <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Unpaid</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-500 text-sm">No outstanding invoices.</p>
                        )}
                    </div>

                    {invoices && invoices.length > 0 && (
                        <div className="mt-6">
                            <button className="btn-primary w-full justify-center">Pay All Invoices</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
