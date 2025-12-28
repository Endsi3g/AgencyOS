import Header from "@/components/layout/Header";
import NewProposalForm from "./proposal-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewProposalPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch necessary data for dropdowns
    const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user?.id).single();

    let clients: any[] = [];
    let projects: any[] = [];

    if (profile?.org_id) {
        const { data: c } = await supabase.from("clients").select("id, name").eq("org_id", profile.org_id);
        const { data: p } = await supabase.from("projects").select("id, name").eq("org_id", profile.org_id);
        clients = c || [];
        projects = p || [];
    }

    return (
        <>
            <Header title="Create Proposal" breadcrumb="Billing" />
            <main className="max-w-[1000px] mx-auto p-6 w-full">
                <NewProposalForm clients={clients} projects={projects} />
            </main>
        </>
    );
}
