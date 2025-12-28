import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import UserRow from "./UserRow";

export default async function UserManagementPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== 'admin' && profile?.role !== 'owner') {
        redirect("/dashboard/admin");
    }

    // Fetch All Users
    const { data: users } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <>
            <Header title="User Management" />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard/admin" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                            Back to Admin
                        </Link>
                        <Link href="/dashboard/admin/users/invite" className="btn-primary flex items-center gap-1">
                            <span className="material-symbols-outlined">add</span>
                            Invite User
                        </Link>
                    </div>

                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 text-xs uppercase tracking-wide text-slate-500 font-semibold">User</th>
                                        <th className="px-6 py-4 text-xs uppercase tracking-wide text-slate-500 font-semibold">Role</th>
                                        <th className="px-6 py-4 text-xs uppercase tracking-wide text-slate-500 font-semibold">Joined</th>
                                        <th className="px-6 py-4 text-xs uppercase tracking-wide text-slate-500 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {users?.map((u) => (
                                        <UserRow key={u.id} user={u} />
                                    ))}
                                    {(!users || users.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
