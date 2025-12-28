"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
});

const registerSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(4),
});

export async function login(prevState: any, formData: FormData) {
    const supabase = createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validatedFields = loginSchema.safeParse({ email, password });

    if (!validatedFields.success) {
        return { error: "Invalid email or password format." };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signup(prevState: any, formData: FormData) {
    const supabase = createClient();

    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validatedFields = registerSchema.safeParse({ fullName, email, password });

    if (!validatedFields.success) {
        return { error: "Invalid input. Please check your details." };
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    // If email confirmation is enabled, we might need to show a check email message.
    // For now, assuming auto-confirm or redirecting to dashboard if session exists.
    if (data.session) {
        revalidatePath("/", "layout");
        redirect("/dashboard");
    } else {
        // If no session, it likely means email confirmation is required
        return { success: "Please check your email to confirm your account." };
    }
}

export async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}
