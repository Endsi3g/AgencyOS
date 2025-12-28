"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const inviteSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    role: z.enum(["admin", "user", "client", "owner"]),
});

export async function inviteUser(prevState: any, formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Check admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== 'admin' && profile?.role !== 'owner') {
        return { error: "Permission denied" };
    }

    const rawData = {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        role: formData.get("role"),
    };

    const validated = inviteSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    // Mock Invitation: In a real app, this would use Supabase Admin API to invite user
    // or send an email with a registration link.
    // For this demo, we'll simulates success.

    // Check if user already exists in profiles
    const { data: existing } = await supabase.from("profiles").select("id").eq("email", validated.data.email).single();
    if (existing) {
        return { error: "User with this email already exists." };
    }

    // We can't insert into profiles easily because id refers to auth.users.id
    // So we just return success message.

    return { success: true, message: `Invitation sent to ${validated.data.email}` };
}

export async function updateUserRole(userId: string, newRole: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Check admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== 'admin' && profile?.role !== 'owner') {
        throw new Error("Permission denied");
    }

    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId);

    if (error) throw new Error(error.message);

    revalidatePath("/dashboard/admin/users");
}

export async function deleteUser(userId: string) {
    // Requires Admin API usually to delete from auth.users.
    // Here we might just delete from profiles if cascade? 
    // Or just mark inactive. 
    // We'll skip implementation or mock it.
    throw new Error("Delete not implemented in this demo");
}
