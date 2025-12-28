"use client";

import { useFormStatus } from "react-dom";
import { updateLead, deleteLead } from "./actions";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define a type for the lead prop that matches what's passed from the page
// We can be loose here or strict. For speed, I'll define the shape I expect.
type LeadData = {
    id: string;
    name: string;
    company_name: string | null;
    email: string | null;
    phone: string | null;
    value: number | null;
    status: string | null;
};

function SubmitButton({ label, loadingLabel }: { label: string; loadingLabel: string }) {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="btn-primary">
            {pending ? loadingLabel : label}
        </button>
    );
}

export default function LeadHeader({ lead }: { lead: LeadData }) {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
            await deleteLead(lead.id);
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col sm:flex-row justify-between items-start gap-4 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{lead.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 underline-offset-4">
                        {lead.company_name && (
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[18px]">business</span>
                                {lead.company_name}
                            </div>
                        )}
                        {lead.email && (
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[18px]">mail</span>
                                <a href={`mailto:${lead.email}`} className="hover:text-primary transition-colors">{lead.email}</a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto self-end sm:self-auto">
                    <div className="flex items-center gap-2 mr-auto sm:mr-0">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize 
                ${lead.status === 'won' ? 'bg-emerald-100 text-emerald-700' :
                                lead.status === 'new' ? 'bg-slate-100 text-slate-700' :
                                    'bg-blue-100 text-blue-700'}`}>
                            {lead.status?.replace('_', ' ')}
                        </span>
                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                            ${(lead.value || 0).toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn-secondary h-9 px-3"
                        >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                            <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="btn-secondary h-9 px-3 text-red-600 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:border-red-900/50"
                        >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <dialog className="modal p-0 rounded-xl shadow-xl backdrop:bg-slate-900/50 open fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                    <div className="w-full max-w-lg bg-white dark:bg-surface-dark flex flex-col max-h-[90vh] overflow-y-auto min-w-[320px] sm:min-w-[480px]">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-surface-dark z-10">
                            <h3 className="font-bold text-lg dark:text-white">Edit Lead</h3>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form
                            action={async (formData) => {
                                const result = await updateLead(lead.id, null, formData);
                                if (result?.success) {
                                    setIsEditing(false);
                                } else {
                                    // Handle error (e.g., toast)
                                    alert("Failed to update: " + JSON.stringify(result?.error));
                                }
                            }}
                            className="p-6 flex flex-col gap-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</span>
                                    <input name="name" defaultValue={lead.name} type="text" className="input" required />
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Company</span>
                                    <input name="company_name" defaultValue={lead.company_name || ""} type="text" className="input" />
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
                                    <input name="email" defaultValue={lead.email || ""} type="email" className="input" />
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</span>
                                    <input name="phone" defaultValue={lead.phone || ""} type="tel" className="input" />
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Value ($)</span>
                                    <input name="value" defaultValue={lead.value || ""} type="number" className="input" />
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Stage</span>
                                    <select name="status" defaultValue={lead.status || "new"} className="input">
                                        <option value="new">New Lead</option>
                                        <option value="qualified">Qualified</option>
                                        <option value="proposal">Proposal Sent</option>
                                        <option value="won">Won</option>
                                    </select>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
                                <SubmitButton label="Save Changes" loadingLabel="Saving..." />
                            </div>
                        </form>
                    </div>
                </dialog>
            )}
        </>
    );
}
