"use client";

import ESignature from "@/components/billing/ESignature";
import { signProposal } from "../actions";
import { useState } from "react";

export default function SignatureSection({ proposalId, existingSignature, signedAt, status }: { proposalId: string, existingSignature?: string, signedAt?: string, status: string }) {
    const [signature, setSignature] = useState<string | null>(existingSignature || null);
    const [isSigning, setIsSigning] = useState(false);

    if (status === 'accepted' && signature) {
        return (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                <div className="flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-400 font-semibold">
                    <span className="material-symbols-outlined">check_circle</span>
                    <span>Proposal Accepted</span>
                </div>
                <div className="mb-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Signature</p>
                    <img src={signature} alt="Client Signature" className="h-12 object-contain" />
                </div>
                {signedAt && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-500">
                        Signed on {new Date(signedAt).toLocaleString()}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div>
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed">
                By signing below, you agree to the terms and conditions outlined in this proposal. Upon acceptance, this document becomes a binding agreement.
            </p>

            <div className="max-w-md">
                <ESignature
                    onSign={(data) => setSignature(data)}
                    onClear={() => setSignature(null)}
                />
            </div>

            <div className="mt-6">
                <button
                    onClick={async () => {
                        if (!signature) return;
                        setIsSigning(true);
                        await signProposal(proposalId, signature);
                        setIsSigning(false);
                    }}
                    disabled={!signature || isSigning}
                    className="btn-primary"
                >
                    {isSigning ? "Processing..." : "Accept Proposal"}
                </button>
            </div>
        </div>
    );
}
