"use client";

import { useOptimistic, useState } from "react";
import { updateTaskStatus, createTask, deleteTask } from "./actions"; // Import from parent actions
import { Database } from "@/lib/supabase/types";
import { useFormStatus } from "react-dom";
import TimeTrackerModal from "./time-tracker-modal";

type Task = Database['public']['Tables']['tasks']['Row'] & {
    profiles?: { full_name: string | null; email: string | null } | null;
};

const TASK_STAGES = [
    { id: "backlog", label: "To Do", color: "bg-slate-100 text-slate-700" },
    { id: "progress", label: "In Progress", color: "bg-blue-100 text-blue-700" },
    { id: "review", label: "In Review", color: "bg-indigo-100 text-indigo-700" },
    { id: "done", label: "Done", color: "bg-emerald-100 text-emerald-700" },
];

function SubmitButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending} className="btn-primary w-full">{pending ? "Adding..." : "Add Task"}</button>
}

export default function TaskBoard({ initialTasks, projectId, members }: { initialTasks: Task[], projectId: string, members?: any[] }) {
    const [optimisticTasks, addOptimisticTask] = useOptimistic(
        initialTasks,
        (state, { id, status }: { id: string; status: string }) => {
            return state.map((t) =>
                t.id === id ? { ...t, status } : t
            );
        }
    );

    const [activeStage, setActiveStage] = useState<string | null>(null);
    const [loggingTimeTask, setLoggingTimeTask] = useState<{ id: string, title: string } | null>(null);

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        e.dataTransfer.setData("taskId", taskId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent, status: string) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");

        addOptimisticTask({ id: taskId, status });

        try {
            await updateTaskStatus(taskId, status, projectId);
        } catch (error) {
            console.error("Failed to update task status:", error);
        }
    };

    const handleDelete = async (taskId: string) => {
        if (confirm("Delete this task?")) {
            await deleteTask(taskId, projectId);
        }
    }

    return (
        <>
            <div className="h-full flex gap-6 items-start min-w-[320px]">
                {TASK_STAGES.map((stage) => {
                    const stageTasks = optimisticTasks.filter((t) => (t.status || 'backlog') === stage.id);

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
                                        {stageTasks.length}
                                    </span>
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 hide-scrollbar">
                                {stageTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task.id)}
                                        className="bg-white dark:bg-surface-dark p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-move group relative"
                                    >
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setLoggingTimeTask({ id: task.id, title: task.title })}
                                                className="size-6 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-emerald-500"
                                                title="Log Time"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">timer</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(task.id)}
                                                className="size-6 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500"
                                                title="Delete Task"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                            </button>
                                        </div>

                                        <div className="flex items-start justify-between mb-2 pr-12">
                                            <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-sm 
                        ${task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                    task.priority === 'low' ? 'bg-slate-100 text-slate-600' :
                                                        'bg-blue-50 text-blue-600'}`}>
                                                {task.priority || 'NORMAL'}
                                            </span>
                                        </div>
                                        <h4 className={`text-sm font-semibold leading-snug mb-1 ${stage.id === "done" ? "text-slate-500 line-through" : "text-slate-900 dark:text-white"}`}>
                                            {task.title}
                                        </h4>
                                        {task.description && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{task.description}</p>
                                        )}

                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                                            <div className="flex items-center gap-2">
                                                {task.profiles?.full_name ? (
                                                    <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold" title={task.profiles.full_name}>
                                                        {task.profiles.full_name.charAt(0)}
                                                    </div>
                                                ) : (
                                                    <div className="size-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                                        <span className="material-symbols-outlined text-[14px]">person</span>
                                                    </div>
                                                )}
                                                {task.due_date && (
                                                    <span className={`text-xs font-medium flex items-center gap-0.5 ${new Date(task.due_date) < new Date() && stage.id !== 'done' ? 'text-red-600' : 'text-slate-400'}`}>
                                                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                        {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Task Button */}
                                {stage.id !== 'done' && (
                                    <button
                                        onClick={() => {
                                            setActiveStage(stage.id);
                                            (document.getElementById('add_task_modal') as HTMLDialogElement)?.showModal();
                                        }}
                                        className="w-full py-2 flex items-center justify-center gap-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg text-sm transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 border-dashed"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                        New Task
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Task Modal */}
            <dialog id="add_task_modal" className="modal p-0 rounded-xl shadow-xl backdrop:bg-slate-900/50">
                <div className="w-full max-w-lg bg-white dark:bg-surface-dark flex flex-col">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-lg dark:text-white">Add Task</h3>
                        <form method="dialog">
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </form>
                    </div>
                    <form
                        action={async (formData) => {
                            await createTask(projectId, null, formData);
                            (document.getElementById('add_task_modal') as HTMLDialogElement)?.close();
                        }}
                        className="p-6 flex flex-col gap-4"
                    >
                        <input type="hidden" name="status" value={activeStage || 'backlog'} />

                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Task Title</span>
                            <input name="title" type="text" className="input" placeholder="What needs to be done?" required />
                        </label>

                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex flex-col gap-1.5">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</span>
                                <select name="priority" className="input">
                                    <option value="low">Low</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Due Date</span>
                                <input name="due_date" type="date" className="input" />
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex flex-col gap-1.5">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Est. Hours</span>
                                <input name="estimated_hours" type="number" step="0.5" className="input" placeholder="0" />
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Assignee</span>
                                <select name="assignee_id" className="input">
                                    <option value="">Unassigned</option>
                                    {/* Simple placeholder for members - real app would pass full list */}
                                    {members?.map(m => (
                                        <option key={m.id} value={m.id}>{m.full_name || m.email}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</span>
                            <textarea name="description" className="input min-h-[80px] py-2" placeholder="Details..." />
                        </label>

                        <div className="flex justify-end gap-3 mt-4">
                            <form method="dialog">
                                <button className="btn-secondary">Cancel</button>
                            </form>
                            <SubmitButton />
                        </div>
                    </form>
                </div>
            </dialog>

            {/* Time Tracker Modal */}
            {loggingTimeTask && (
                <TimeTrackerModal
                    taskId={loggingTimeTask.id}
                    taskTitle={loggingTimeTask.title}
                    onClose={() => setLoggingTimeTask(null)}
                />
            )}
        </>
    );
}
