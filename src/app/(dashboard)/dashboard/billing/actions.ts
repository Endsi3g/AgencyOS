"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const InvoiceSchema = z.object({
    client_id: z.string().min(1, "Client is required"),
    project_id: z.string().optional().nullable(),
    issue_date: z.string().min(1, "Issue date is required"),
    due_date: z.string().min(1, "Due date is required"),
    status: z.string().default("draft"),
    items: z.string().optional(), // JSON string of items
});

export async function createInvoice(prevState: any, formData: FormData) {
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

    // Calculate totals on server to be safe
    const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);
    const tax = subtotal * 0.1; // Example 10% tax
    const total = subtotal + tax;

    const rawData = {
        client_id: formData.get("client_id"),
        project_id: formData.get("project_id") || null,
        issue_date: formData.get("issue_date"),
        due_date: formData.get("due_date"),
        status: formData.get("status") || "draft",
    };

    const validated = InvoiceSchema.safeParse({ ...rawData, items: itemsJson });
    if (!validated.success) return { error: validated.error.flatten().fieldErrors };

    // Insert Invoice
    const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
            ...validated.data,
            items: undefined, // Don't insert into invoices table
            org_id: profile.org_id,
            subtotal,
            tax,
            total
        })
        .select()
        .single();

    if (invoiceError) return { error: invoiceError.message };

    // Insert Items
    if (items.length > 0) {
        const { error: itemsError } = await supabase
            .from("invoice_items")
            .insert(items.map((item: any) => ({
                invoice_id: invoice.id,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                amount: Number(item.quantity) * Number(item.unit_price)
            })));

        if (itemsError) {
            // Should rollback/delete invoice in real app, but for now just error
            console.error("Error inserting items:", itemsError);
            return { error: "Created invoice but failed to add items" };
        }
    }

    revalidatePath("/dashboard/billing");
    return { success: true };
}

export async function updateInvoiceStatus(invoiceId: string, status: string) {
    const supabase = createClient();
    await supabase.from("invoices").update({ status }).eq("id", invoiceId);
    revalidatePath("/dashboard/billing");
}

export async function deleteInvoice(invoiceId: string) {
    const supabase = createClient();
    await supabase.from("invoices").delete().eq("id", invoiceId);
    revalidatePath("/dashboard/billing");
}
