import Header from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import SignatureSection from "./signature-section";

export default async function ProposalDetailPage({ params }: { params: { id: string } }) {
    const supabase = createClient();

    const { data: proposal } = await supabase
        .from("proposals")
        .select(`
            *,
            clients (name, email, address),
            proposal_items (*)
        `)
        .eq("id", params.id)
        .single();

    if (!proposal) notFound();

    return (
        <>
            <Header title="Proposal Details" breadcrumb="Billing" />

            <main className="max-w-[900px] mx-auto p-6 lg:p-10 w-full mb-20">
                {/* Paper View */}
                <div className="bg-white dark:bg-surface-dark shadow-sm border border-slate-200 dark:border-slate-800 rounded-lg p-10 min-h-[1000px]">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{proposal.title}</h1>
                            <p className="text-slate-500 text-sm">Proposal #{proposal.id.slice(0, 8).toUpperCase()}</p>
                            <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium uppercase
                                ${proposal.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {proposal.status}
                            </span>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Agency OS</h2>
                            <p className="text-sm text-slate-500">123 Creative Studio Blvd</p>
                            <p className="text-sm text-slate-500">New York, NY 10012</p>
                        </div>
                    </div>

                    {/* Client Info */}
                    <div className="mb-12">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prepared For</h3>
                        <p className="font-semibold text-lg text-slate-900 dark:text-white">{proposal.clients?.name}</p>
                        {proposal.clients?.email && <p className="text-slate-500">{proposal.clients.email}</p>}
                        {proposal.clients?.address && <p className="text-slate-500">{proposal.clients.address}</p>}
                    </div>

                    {/* Content / Scope */}
                    <div className="mb-12 prose dark:prose-invert max-w-none">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Scope of Work</h3>
                        <div className="whitespace-pre-wrap text-slate-600 dark:text-slate-300">
                            {proposal.content || "No detailed scope provided."}
                        </div>
                    </div>

                    {/* Items */}
                    <div className="mb-12">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Investment</h3>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-slate-500">
                                    <th className="pb-3 font-medium">Description</th>
                                    <th className="pb-3 font-medium text-center">Qty</th>
                                    <th className="pb-3 font-medium text-right">Price</th>
                                    <th className="pb-3 font-medium text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {proposal.proposal_items.map((item: any) => (
                                    <tr key={item.id}>
                                        <td className="py-3 text-slate-700 dark:text-slate-300">{item.description}</td>
                                        <td className="py-3 text-center text-slate-500">{item.quantity}</td>
                                        <td className="py-3 text-right text-slate-500">${(item.unit_price || 0).toLocaleString()}</td>
                                        <td className="py-3 text-right font-medium text-slate-900 dark:text-white">${(item.amount || 0).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3} className="pt-4 text-right text-slate-500">Subtotal</td>
                                    <td className="pt-4 text-right font-medium text-slate-900 dark:text-white">${(proposal.subtotal || 0).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3} className="pt-1 text-right text-slate-500">Tax (10%)</td>
                                    <td className="pt-1 text-right font-medium text-slate-900 dark:text-white">${(proposal.tax || 0).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3} className="pt-4 text-right font-bold text-slate-900 dark:text-white text-lg">Total</td>
                                    <td className="pt-4 text-right font-bold text-slate-900 dark:text-white text-lg">${(proposal.total || 0).toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Signature Section */}
                    <div className="mt-12 pt-8 border-t-2 border-slate-100 dark:border-slate-800 break-inside-avoid">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Acceptance</h3>

                        <SignatureSection
                            proposalId={proposal.id}
                            existingSignature={proposal.signature_data}
                            signedAt={proposal.signed_at}
                            status={proposal.status}
                        />

                    </div>
                </div>
            </main>
        </>
    );
}
