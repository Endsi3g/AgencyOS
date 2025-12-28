"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const LeadSchema = z.object({
    name: z.string().min(1, "Name is required"),
    company_name: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    value: z.coerce.number().optional(),
    status: z.string().default("new"),
});

export async function createLead(prevState: any, formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get user's org_id from profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("org_id")
        .eq("id", user.id)
        .single();

    if (!profile?.org_id) {
        return { error: "Organization not found" };
    }

    const rawData = {
        name: formData.get("name"),
        company_name: formData.get("company_name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        value: formData.get("value"),
        status: formData.get("status") || "new",
    };

    const validatedFields = LeadSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { error } = await supabase.from("leads").insert({
        ...validatedFields.data,
        org_id: profile.org_id, // valid UUID
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/crm");
    return { success: true };
}

export async function updateLeadStatus(leadId: string, newStatus: string) {
    const supabase = createClient();

    const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", leadId);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/dashboard/crm");
}

export async function updateLead(leadId: string, prevState: any, formData: FormData) {
    const supabase = createClient();
    const rawData = {
        name: formData.get("name"),
        company_name: formData.get("company_name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        value: formData.get("value"),
        status: formData.get("status"),
    };

    const validatedFields = LeadSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { error } = await supabase
        .from("leads")
        .update(validatedFields.data)
        .eq("id", leadId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/dashboard/crm/${leadId}`);
    revalidatePath("/dashboard/crm");
    return { success: true };
}

export async function deleteLead(leadId: string) {
    const supabase = createClient();
    const { error } = await supabase.from("leads").delete().eq("id", leadId);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/dashboard/crm");
    redirect("/dashboard/crm");
}

export async function addActivity(leadId: string, formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const description = formData.get("description") as string;
    const type = formData.get("type") as string || "note";

    if (!description) return { error: "Description required" };

    const { error } = await supabase.from("activities").insert({
        lead_id: leadId,
        description,
        type,
        created_by: user.id
        // client_id can be added if we were on a client page
    });

    if (error) return { error: error.message };

    revalidatePath(`/dashboard/crm/${leadId}`);
    return { success: true };
}
