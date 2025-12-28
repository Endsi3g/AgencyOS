"use client";

import { useOptimistic, useState } from "react";
import { updateLeadStatus } from "./actions"; // We'll create this next
import Link from "next/link";
import { Database } from "@/lib/supabase/types";

type Lead = Database['public']['Tables']['leads']['Row'];

const PIPELINE_STAGES = [
    { id: "new", label: "New Lead", color: "bg-slate-100 text-slate-700" },
    { id: "qualified", label: "Qualified", color: "bg-blue-100 text-blue-700" },
    { id: "proposal", label: "Proposal Sent", color: "bg-indigo-100 text-indigo-700" },
    { id: "won", label: "Won", color: "bg-emerald-100 text-emerald-700" },
];

export default function PipelineBoard({ initialLeads }: { initialLeads: Lead[] }) {
    const [optimisticLeads, addOptimisticLead] = useOptimistic(
        initialLeads,
        (state, { id, status }: { id: string; status: string }) => {
            return state.map((lead) =>
                lead.id === id ? { ...lead, status } : lead
            );
        }
    );

    const handleDragStart = (e: React.DragEvent, leadId: string) => {
        e.dataTransfer.setData("leadId", leadId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent, status: string) => {
        e.preventDefault();
        const leadId = e.dataTransfer.getData("leadId");

        // Optimistic update
        addOptimisticLead({ id: leadId, status });

        // Server action
        try {
            await updateLeadStatus(leadId, status);
        } catch (error) {
            console.error("Failed to update lead status:", error);
            // Revert would happen automatically if we re-fetched, but useOptimistic syncs with valid state anyway
        }
    };

    return (
        <div className="h-full flex gap-6 items-start min-w-[320px]">
            {PIPELINE_STAGES.map((stage) => {
                const stageLeads = optimisticLeads.filter((lead) => lead.status === stage.id);
                const stageValue = stageLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);

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
                                    {stageLeads.length}
                                </span>
                            </div>
                            <div className="text-xs font-medium text-slate-400">
                                ${stageValue.toLocaleString()}
                            </div>
                        </div>

                        {/* Cards */}
                        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 hide-scrollbar">
                            {stageLeads.map((lead) => (
                                <div
                                    key={lead.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, lead.id)}
                                    className="bg-white dark:bg-surface-dark p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-move group"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                            {lead.name}
                                        </h4>
                                        <Link href={`/dashboard/crm/${lead.id}`} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-500 dark:hover:text-slate-300 transition-opacity">
                                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                                        </Link>
                                    </div>
                                    {lead.company_name && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{lead.company_name}</p>
                                    )}
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                                        <span className="text-xs text-slate-400 truncate max-w-[120px]">{lead.email}</span>
                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                            ${(lead.value || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {/* Add Lead Button Placeholder */}
                            <button
                                onClick={() => (document.getElementById('add_lead_modal') as HTMLDialogElement)?.showModal()}
                                className="w-full py-2 flex items-center justify-center gap-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg text-sm transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 border-dashed"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Add Lead
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
