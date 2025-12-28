"use client";

import { useFormStatus } from "react-dom";
import { addActivity } from "./actions";
import { useRef } from "react";

type Activity = {
    id: string;
    description: string | null;
    type: string;
    created_at: string;
    created_by: string | null;
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="btn-primary"
        >
            {pending ? "Adding..." : "Add Note"}
        </button>
    );
}

export default function ActivityTimeline({
    activities,
    leadId
}: {
    activities: Activity[];
    leadId: string;
}) {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">history</span>
                Activity Timeline
            </h2>

            {/* Add Activity Form */}
            <div className="mb-8">
                <form
                    ref={formRef}
                    action={async (formData) => {
                        await addActivity(leadId, formData);
                        formRef.current?.reset();
                    }}
                    className="flex flex-col gap-3"
                >
                    <textarea
                        name="description"
                        placeholder="Log a call, meeting node, or update..."
                        className="input min-h-[80px] py-2 resize-y"
                        required
                    />
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <label className="cursor-pointer">
                                <input type="radio" name="type" value="note" className="peer sr-only" defaultChecked />
                                <span className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 peer-checked:bg-slate-900 peer-checked:text-white dark:peer-checked:bg-white dark:peer-checked:text-slate-900 transition-all">
                                    Note
                                </span>
                            </label>
                            <label className="cursor-pointer">
                                <input type="radio" name="type" value="call" className="peer sr-only" />
                                <span className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 transition-all">
                                    Call
                                </span>
                            </label>
                            <label className="cursor-pointer">
                                <input type="radio" name="type" value="email" className="peer sr-only" />
                                <span className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 peer-checked:bg-purple-600 peer-checked:text-white peer-checked:border-purple-600 transition-all">
                                    Email
                                </span>
                            </label>
                            <label className="cursor-pointer">
                                <input type="radio" name="type" value="meeting" className="peer sr-only" />
                                <span className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 peer-checked:bg-orange-600 peer-checked:text-white peer-checked:border-orange-600 transition-all">
                                    Meeting
                                </span>
                            </label>
                        </div>
                        <SubmitButton />
                    </div>
                </form>
            </div>

            <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-px before:bg-slate-200 dark:before:bg-slate-700">
                {activities.map((activity) => (
                    <div key={activity.id} className="relative pl-10 group">
                        <div className={`
                absolute left-0 top-1 size-10 rounded-full border flex items-center justify-center z-10 bg-white dark:bg-surface-dark
                ${activity.type === 'call' ? 'border-blue-200 text-blue-600' :
                                activity.type === 'email' ? 'border-purple-200 text-purple-600' :
                                    activity.type === 'meeting' ? 'border-orange-200 text-orange-600' :
                                        'border-slate-200 text-slate-500'}
            `}>
                            <span className="material-symbols-outlined text-[20px]">
                                {activity.type === 'call' ? 'call' :
                                    activity.type === 'email' ? 'mail' :
                                        activity.type === 'meeting' ? 'groups' :
                                            'sticky_note_2'}
                            </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{activity.type}</span>
                                <span className="text-xs text-slate-400">
                                    {new Date(activity.created_at).toLocaleDateString()} at {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{activity.description}</p>
                        </div>
                    </div>
                ))}

                {activities.length === 0 && (
                    <div className="relative pl-10">
                        <div className="absolute left-0 top-1 size-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center z-10">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">add_circle</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                            <p className="text-sm text-slate-500">Lead created. No activities logged yet.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
