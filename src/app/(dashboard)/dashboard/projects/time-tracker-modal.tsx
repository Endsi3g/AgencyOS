"use client";

import { useFormStatus } from "react-dom";
import { logTime } from "./actions";
import { useRef } from "react";
import { usePathname } from "next/navigation";

function SubmitButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending} className="btn-primary">{pending ? "Saving..." : "Log Time"}</button>
}

export default function TimeTrackerModal({ taskId, taskTitle, onClose }: { taskId: string, taskTitle: string, onClose: () => void }) {
    const formRef = useRef<HTMLFormElement>(null);
    const pathname = usePathname();

    return (
        <dialog className="modal open p-0 rounded-xl shadow-xl backdrop:bg-slate-900/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="w-full max-w-md bg-white dark:bg-surface-dark flex flex-col">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-surface-dark rounded-t-xl">
                    <div>
                        <h3 className="font-bold text-lg dark:text-white">Log Time</h3>
                        <p className="text-xs text-slate-500 truncate max-w-[250px]">{taskTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form
                    action={async (formData) => {
                        await logTime(taskId, formData);
                        onClose();
                    }}
                    className="p-6 flex flex-col gap-4"
                >
                    <input type="hidden" name="path" value={pathname} />

                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</span>
                            <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="input" required />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Duration (min)</span>
                            <input name="duration" type="number" min="1" className="input" placeholder="e.g. 60" required />
                        </label>
                    </div>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</span>
                        <textarea name="notes" className="input min-h-[80px] py-2" placeholder="What did you work on?" />
                    </label>

                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </dialog>
    );
}
