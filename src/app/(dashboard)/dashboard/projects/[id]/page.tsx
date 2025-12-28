import Header from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TaskBoard from "../task-board";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
    const supabase = createClient();

    // Fetch project details
    const { data: project } = await supabase
        .from("projects")
        .select("*, clients(name)")
        .eq("id", params.id)
        .single();

    if (!project) notFound();

    // Fetch tasks
    const { data: tasks } = await supabase
        .from("tasks")
        .select("*, profiles(full_name, email)")
        .eq("project_id", project.id)
        .order("created_at", { ascending: false });

    // Fetch members (for assignment)
    // In a real app, this would be filtered by org or project team. 
    // For now, fetch all profiles in org.
    const { data: members } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("org_id", project.org_id);

    return (
        <>
            <Header title={project.name} breadcrumb="Projects" />

            {/* Project Header/Stats */}
            <div className="px-6 py-4 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider 
                                ${project.status === 'active' ? 'bg-blue-100 text-blue-700' :
                                    project.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                        'bg-slate-100 text-slate-700'}`}>
                                {project.status}
                            </span>
                            {project.clients?.name && (
                                <span className="text-sm text-slate-500 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">domain</span>
                                    {project.clients.name}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">{project.description}</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Deadline</p>
                            <p className="text-sm font-medium">{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'None'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Budget</p>
                            <p className="text-sm font-medium">${(project.budget || 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs (Tasks, Files, etc) - For now just Tasks */}
            <div className="flex items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <button className="px-4 py-3 text-sm font-medium text-primary border-b-2 border-primary">
                    Tasks
                </button>
                <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                    Files
                </button>
                <button className="px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                    Time Logs
                </button>
            </div>

            <main className="flex-1 overflow-x-auto overflow-y-hidden bg-slate-50/50 dark:bg-background-dark p-4 sm:p-6">
                <TaskBoard
                    initialTasks={tasks || []}
                    projectId={project.id}
                    members={members || []}
                />
            </main>
        </>
    );
}
