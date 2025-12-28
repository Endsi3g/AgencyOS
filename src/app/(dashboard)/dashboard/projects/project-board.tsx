"use client";

import { useOptimistic } from "react";
import { updateProjectStatus } from "./actions";
import Link from "next/link";
import { Database } from "@/lib/supabase/types";

type Project = Database['public']['Tables']['projects']['Row'] & {
    clients?: { name: string } | null; // Joined client name
};

const PROJECT_STAGES = [
    { id: "planning", label: "Planning", color: "bg-slate-100 text-slate-700" },
    { id: "active", label: "Active", color: "bg-blue-100 text-blue-700" },
    { id: "on_hold", label: "On Hold", color: "bg-orange-100 text-orange-700" },
    { id: "completed", label: "Completed", color: "bg-emerald-100 text-emerald-700" },
];

export default function ProjectBoard({ initialProjects }: { initialProjects: Project[] }) {
    const [optimisticProjects, addOptimisticProject] = useOptimistic(
        initialProjects,
        (state, { id, status }: { id: string; status: string }) => {
            return state.map((p) =>
                p.id === id ? { ...p, status } : p
            );
        }
    );

    const handleDragStart = (e: React.DragEvent, projectId: string) => {
        e.dataTransfer.setData("projectId", projectId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent, status: string) => {
        e.preventDefault();
        const projectId = e.dataTransfer.getData("projectId");

        addOptimisticProject({ id: projectId, status });

        try {
            await updateProjectStatus(projectId, status);
        } catch (error) {
            console.error("Failed to update project status:", error);
        }
    };

    return (
        <div className="h-full flex gap-6 items-start min-w-[320px]">
            {PROJECT_STAGES.map((stage) => {
                const stageProjects = optimisticProjects.filter((p) => (p.status || 'planning') === stage.id);

                return (
                    <div
                        key={stage.id}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, stage.id)}
                        className="w-full sm:w-80 flex-shrink-0 flex flex-col h-full max-h-full rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                    >
                        {/* Column Header */}
                        <div className="p-3 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800 rounded-t-xl sticky top-0 z-10">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                                    {stage.label}
                                </h3>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stage.color}`}>
                                    {stageProjects.length}
                                </span>
                            </div>
                        </div>

                        {/* Cards */}
                        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 hide-scrollbar">
                            {stageProjects.map((project) => (
                                <div
                                    key={project.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, project.id)}
                                    className="bg-white dark:bg-surface-dark p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-move group"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                            {project.name}
                                        </h4>
                                        <Link href={`/dashboard/projects/${project.id}`} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-500 dark:hover:text-slate-300 transition-opacity">
                                            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                        </Link>
                                    </div>
                                    {project.clients?.name && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">domain</span>
                                            {project.clients.name}
                                        </p>
                                    )}
                                    {project.description && (
                                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">{project.description}</p>
                                    )}
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                            {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No deadline'}
                                        </span>
                                        {project.budget && (
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                                ${project.budget.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Add Project Button */}
                            <button
                                onClick={() => (document.getElementById('add_project_modal') as HTMLDialogElement)?.showModal()}
                                className="w-full py-2 flex items-center justify-center gap-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg text-sm transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 border-dashed"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                New Project
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
