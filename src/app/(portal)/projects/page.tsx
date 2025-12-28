import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ClientProjects() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
    if (!profile) return <div>Access Denied</div>;

    // Fetch Active Projects
    const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .eq("org_id", profile.org_id)
        .order("created_at", { ascending: false });

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
                <p className="text-slate-500">View and track all your active projects.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {projects && projects.length > 0 ? projects.map(project => (
                    <div key={project.id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{project.name}</h3>
                                <div className={`badge ${project.status === 'in_progress' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                        project.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                    }`}>
                                    {project.status?.replace('_', ' ')}
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm mb-2">{project.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                                <span>Started: {new Date(project.created_at).toLocaleDateString()}</span>
                                {project.end_date && <span> • Due: {new Date(project.end_date).toLocaleDateString()}</span>}
                            </div>
                        </div>
                        {/* Actions (if any) */}
                        <button className="btn-secondary text-sm">View Details</button>
                    </div>
                )) : (
                    <div className="text-center py-12 bg-white dark:bg-surface-dark rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">folder_off</span>
                        <p className="text-slate-500">No projects found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
