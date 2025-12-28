import Header from "@/components/layout/Header";
import ProjectBoard from "./project-board";
import { createClient } from "@/lib/supabase/server";
import { createProject } from "./actions";

export default async function ProjectsPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let projects: any[] = [];
    let clients: any[] = [];

    if (user) {
        // Fetch projects with client names
        // Note: Supabase JS select needs explicit join syntax
        const { data: profile } = await supabase
            .from("profiles")
            .select("org_id")
            .eq("id", user.id)
            .single();

        if (profile?.org_id) {
            const { data } = await supabase
                .from("projects")
                .select("*, clients(name)")
                .eq("org_id", profile.org_id)
                .order("created_at", { ascending: false });
            projects = data || [];

            // Fetch clients for the dropdown
            const { data: clientsData } = await supabase
                .from("clients")
                .select("id, name")
                .eq("org_id", profile.org_id);
            clients = clientsData || [];
        }
    }

    return (
        <>
            <Header title="Projects" breadcrumb="Overview" />

            {/* Toolbar */}
            <div className="flex items-center gap-4 px-6 py-3 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 overflow-x-auto hide-scrollbar flex-shrink-0">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white text-sm font-medium">
                        <span className="material-symbols-outlined text-[18px]">view_kanban</span>
                        <span>Board</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors">
                        <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                        <span>List</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        <span>Timeline</span>
                    </button>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>

                <div className="flex-1"></div>
                {/* This button is backup for the board button, but we should make it open the same modal */}
                <button
                    // This creates a small issue since the modal is inside the client component 'ProjectBoard' OR inside this page.
                    // Let's put the modal in this page for simplicity.
                    // But we can't invoke modal from here easily without JS. 
                    // Let's rely on the "Add Project" button inside the Board for now, or make a separate client "AddProjectBtn".
                    className="btn-primary h-9 opacity-50 cursor-not-allowed"
                    title="Use the button in the board columns"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>New Project</span>
                </button>
            </div>

            {/* Kanban Board */}
            <main className="flex-1 overflow-x-auto overflow-y-hidden bg-slate-50/50 dark:bg-background-dark p-4 sm:p-6">
                <ProjectBoard initialProjects={projects} />
            </main>

            {/* Add Project Modal */}
            <dialog id="add_project_modal" className="modal p-0 rounded-xl shadow-xl backdrop:bg-slate-900/50">
                <div className="w-full max-w-lg bg-white dark:bg-surface-dark flex flex-col">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-lg dark:text-white">New Project</h3>
                        <form method="dialog">
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </form>
                    </div>
                    <form action={createProject} className="p-6 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex flex-col gap-1.5 col-span-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Project Name</span>
                                <input name="name" type="text" className="input" placeholder="e.g. Website Redesign" required />
                            </label>
                        </div>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Client</span>
                            <select name="client_id" className="input">
                                <option value="">No Client (Internal)</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex flex-col gap-1.5">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</span>
                                <input name="start_date" type="date" className="input" />
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">End Date</span>
                                <input name="end_date" type="date" className="input" />
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex flex-col gap-1.5">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Budget ($)</span>
                                <input name="budget" type="number" className="input" placeholder="0.00" />
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                                <select name="status" className="input">
                                    <option value="planning">Planning</option>
                                    <option value="active">Active</option>
                                    <option value="on_hold">On Hold</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </label>
                        </div>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</span>
                            <textarea name="description" className="input min-h-[80px] py-2" placeholder="Brief project description..." />
                        </label>

                        <div className="flex justify-end gap-3 mt-4">
                            <form method="dialog">
                                <button className="btn-secondary">Cancel</button>
                            </form>
                            <button type="submit" className="btn-primary">Create Project</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
}
