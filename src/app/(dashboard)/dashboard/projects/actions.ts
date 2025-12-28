"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const ProjectSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    client_id: z.string().optional().nullable(),
    status: z.string().default("planning"),
    start_date: z.string().optional().nullable(),
    end_date: z.string().optional().nullable(),
    budget: z.coerce.number().optional().nullable(),
});

export async function createProject(prevState: any, formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("org_id")
        .eq("id", user.id)
        .single();

    if (!profile?.org_id) return { error: "Organization not found" };

    const rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
        client_id: formData.get("client_id") || null,
        status: formData.get("status") || "planning",
        start_date: formData.get("start_date") || null,
        end_date: formData.get("end_date") || null,
        budget: formData.get("budget") || null,
    };

    const validatedFields = ProjectSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { error } = await supabase.from("projects").insert({
        ...validatedFields.data,
        org_id: profile.org_id,
        manager_id: user.id // Default to creator as manager
    });

    if (error) return { error: error.message };

    revalidatePath("/dashboard/projects");
    return { success: true };
}

export async function updateProjectStatus(projectId: string, newStatus: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from("projects")
        .update({ status: newStatus })
        .eq("id", projectId);

    if (error) throw new Error(error.message);

    revalidatePath("/dashboard/projects");
}

export async function updateProject(projectId: string, formData: FormData) {
    const supabase = createClient();
    const rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
        status: formData.get("status"),
        budget: formData.get("budget"),
    };

    // Simple update for now
    const { error } = await supabase
        .from("projects")
        .update(rawData)
        .eq("id", projectId);

    if (error) return { error: error.message };

    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true };
}

export async function deleteProject(projectId: string) {
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", projectId);
    if (error) throw new Error(error.message);

    revalidatePath("/dashboard/projects");
    redirect("/dashboard/projects");
}

// --- Task Actions ---

const TaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional().nullable(),
    status: z.string().default("backlog"),
    priority: z.string().default("medium"),
    due_date: z.string().optional().nullable(),
    estimated_hours: z.coerce.number().optional().nullable(),
    assignee_id: z.string().optional().nullable(),
});

export async function createTask(projectId: string, prevState: any, formData: FormData) {
    const supabase = createClient();
    const rawData = {
        title: formData.get("title"),
        description: formData.get("description"),
        status: formData.get("status") || "backlog",
        priority: formData.get("priority") || "medium",
        due_date: formData.get("due_date") || null,
        estimated_hours: formData.get("estimated_hours") || null,
        assignee_id: formData.get("assignee_id") || null,
    };

    const validatedFields = TaskSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { error } = await supabase.from("tasks").insert({
        ...validatedFields.data,
        project_id: projectId,
    });

    if (error) return { error: error.message };

    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true };
}

export async function updateTaskStatus(taskId: string, newStatus: string, projectId: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", taskId);

    if (error) throw new Error(error.message);
    revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function deleteTask(taskId: string, projectId: string) {
    const supabase = createClient();
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) throw new Error(error.message);
    revalidatePath(`/dashboard/projects/${projectId}`);
}

// --- Time Tracking Actions ---

export async function logTime(taskId: string, formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const duration = Number(formData.get("duration")); // In minutes
    const notes = formData.get("notes") as string;
    const date = formData.get("date") as string || new Date().toISOString();

    if (!duration || duration <= 0) return { error: "Invalid duration" };

    const { error } = await supabase.from("time_entries").insert({
        task_id: taskId,
        user_id: user.id,
        duration,
        notes,
        date
    });

    if (error) return { error: error.message };

    // Ideally traverse up to find project ID for revalidation, or just revalidate path if we knew it
    // For now we assume this is called contexts where we might not easily know project ID without fetch
    // BUT usually this is called from the Task UI inside a Project Page.
    // Let's rely on the client to refresh or revalidate based on where it's called.
    // Or we pass projectId to the action.
    const path = formData.get("path") as string;
    if (path) revalidatePath(path);

    return { success: true };
}
