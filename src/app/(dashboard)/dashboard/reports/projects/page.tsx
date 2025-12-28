import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";

export default async function ProjectReportPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
    if (!profile?.org_id) return <div>Access Denied</div>;

    // Fetch Projects
    const { data: projects } = await supabase
        .from("projects")
        .select("*, tasks:tasks(status, created_at)")
        .eq("org_id", profile.org_id);

    // Fetch All Tasks for Workload (Deep query)
    const { data: allTasks } = await supabase
        .from("tasks")
        .select("status, assignee_id, projects!inner(org_id), profiles:assignee_id(full_name, email)")
        .eq("projects.org_id", profile.org_id);

    // Calculate Project Completion
    const projectStats = projects?.map(p => {
        const totalTasks = p.tasks.length;
        const completedTasks = p.tasks.filter((t: any) => t.status === 'done').length;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        return { ...p, progress, totalTasks, completedTasks };
    }) || [];

    // Sort by progress descending
    projectStats.sort((a, b) => b.progress - a.progress);

    // Status Distribution
    const statusCount = {
        planning: projects?.filter(p => p.status === 'planning').length || 0,
        in_progress: projects?.filter(p => p.status === 'in_progress').length || 0,
        completed: projects?.filter(p => p.status === 'completed').length || 0,
        on_hold: projects?.filter(p => p.status === 'on_hold').length || 0,
    };

    // Calculate Team Workload
    const workload: Record<string, { name: string, email: string, total: number, completed: number }> = {};

    allTasks?.forEach((task: any) => {
        if (!task.assignee_id) return;
        const id = task.assignee_id;
        if (!workload[id]) {
            workload[id] = {
                name: task.profiles?.full_name || task.profiles?.email || "Unknown",
                email: task.profiles?.email || "",
                total: 0,
                completed: 0
            };
        }
        workload[id].total++;
        if (task.status === 'done') workload[id].completed++;
    });

    const teamWorkload = Object.values(workload).sort((a, b) => b.total - a.total);

    return (
        <>
            <Header title="Project Report" />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto flex flex-col gap-8">
                    {/* Navigation Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-slate-800">
                        <Link href="/dashboard/reports/financial" className="px-6 py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium text-sm transition-colors">Financials</Link>
                        <Link href="/dashboard/reports/projects" className="px-6 py-3 border-b-2 border-primary text-primary font-medium text-sm">Projects</Link>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="card p-4 flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><span className="material-symbols-outlined">folder</span></div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Total Projects</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">{projects?.length || 0}</p>
                            </div>
                        </div>
                        <div className="card p-4 flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><span className="material-symbols-outlined">check_circle</span></div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Completed</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">{statusCount.completed}</p>
                            </div>
                        </div>
                        <div className="card p-4 flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><span className="material-symbols-outlined">timelapse</span></div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">In Progress</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">{statusCount.in_progress}</p>
                            </div>
                        </div>
                        <div className="card p-4 flex items-center gap-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><span className="material-symbols-outlined">pause</span></div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Planning / Hold</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">{statusCount.planning + statusCount.on_hold}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Project Progress */}
                        <div className="card p-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Project Progress</h3>
                            <div className="space-y-6">
                                {projectStats.slice(0, 5).map(project => (
                                    <div key={project.id}>
                                        <div className="flex justify-between items-end mb-1">
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{project.name}</h4>
                                                <p className="text-xs text-slate-500">{project.completedTasks} / {project.totalTasks} tasks completed</p>
                                            </div>
                                            <span className="text-sm font-bold text-primary">{project.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-500"
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {projectStats.length === 0 && (
                                    <p className="text-slate-500 text-center py-4">No projects found.</p>
                                )}
                            </div>
                        </div>

                        {/* Team Workload */}
                        <div className="card p-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Team Workload</h3>
                            <div className="flex flex-col gap-4">
                                {teamWorkload.map((member, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{member.name}</h4>
                                                <span className="text-xs text-slate-500">{member.completed} / {member.total} Tasks</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 rounded-full"
                                                    style={{ width: `${(member.completed / member.total) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {teamWorkload.length === 0 && (
                                    <p className="text-slate-500 text-center py-4">No task data available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
