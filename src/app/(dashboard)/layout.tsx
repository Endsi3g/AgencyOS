import Sidebar from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar user={user} role={profile?.role} />
            <div className="flex-1 flex flex-col min-w-0 h-full bg-background-light dark:bg-background-dark overflow-hidden">
                {children}
            </div>
        </div>
    );
}
