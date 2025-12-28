"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const ProposalSchema = z.object({
    client_id: z.string().min(1, "Client is required"),
    project_id: z.string().optional().nullable(),
    title: z.string().min(1, "Title is required"),
    valid_until: z.string().optional().nullable(),
    content: z.string().optional(),
    items: z.string().optional(), // JSON string of items
});

export async function createProposal(prevState: any, formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("org_id")
        .eq("id", user.id)
        .single();

    if (!profile?.org_id) return { error: "Organization not found" };

    const itemsJson = formData.get("items") as string;
    let items = [];
    try {
        items = itemsJson ? JSON.parse(itemsJson) : [];
    } catch (e) {
        return { error: "Invalid items data" };
    }

    const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const rawData = {
        client_id: formData.get("client_id"),
        project_id: formData.get("project_id") || null,
        title: formData.get("title"),
        valid_until: formData.get("valid_until") || null,
        content: formData.get("content"),
    };

    const validated = ProposalSchema.safeParse({ ...rawData, items: itemsJson });
    if (!validated.success) return { error: validated.error.flatten().fieldErrors };

    // Insert Proposal
    const { data: proposal, error: proposalError } = await supabase
        .from("proposals")
        .insert({
            ...validated.data,
            items: undefined,
            org_id: profile.org_id,
            status: "draft",
            subtotal,
            tax,
            total
        })
        .select()
        .single();

    if (proposalError) return { error: proposalError.message };

    // Insert Items
    if (items.length > 0) {
        const { error: itemsError } = await supabase
            .from("proposal_items")
            .insert(items.map((item: any) => ({
                proposal_id: proposal.id,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                amount: Number(item.quantity) * Number(item.unit_price)
            })));

        if (itemsError) console.error("Error inserting items:", itemsError);
    }

    revalidatePath("/dashboard/billing"); // We might group proposals under billing or a new tab
    redirect(`/dashboard/billing/proposals/${proposal.id}`); // Redirect to detail/preview
}

export async function signProposal(proposalId: string, signatureData: string) {
    const supabase = createClient();

    // In a real app, strict auth checks here to ensure the signer is authorized
    // For now, we assume if they have the ID and can call this action, they are signing.
    // (Ideally this is called by an authenticated client user)

    const { error } = await supabase
        .from("proposals")
        .update({
            status: "accepted",
            signature_data: signatureData,
            signed_at: new Date().toISOString()
        })
        .eq("id", proposalId);

    if (error) throw new Error(error.message);
    revalidatePath(`/dashboard/billing/proposals/${proposalId}`);
    return { success: true };
}
