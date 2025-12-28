import { inviteUser } from "../../actions";
import SubmitButton from "@/components/ui/SubmitButton"; // Assuming we have one or I should make one inline/import
import Header from "@/components/layout/Header";
import Link from "next/link";

// Inline submit button if not available or import from register/page
import { useFormStatus } from "react-dom";

function InviteButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="btn-primary w-full flex justify-center">
            {pending ? "Sending..." : "Send Invitation"}
        </button>
    );
}

export default function InviteUserPage() {
    return (
        <>
            <Header title="Invite User" />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-xl mx-auto">
                    <Link href="/dashboard/admin/users" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        Back to Users
                    </Link>

                    <div className="card p-8">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Invite New Team Member</h2>

                        <form action={inviteUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                <input name="fullName" type="text" className="input-field" required placeholder="John Doe" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                                <input name="email" type="email" className="input-field" required placeholder="john@example.com" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                                <select name="role" className="input-field" defaultValue="user">
                                    <option value="user">User (Employee)</option>
                                    <option value="admin">Admin</option>
                                    <option value="client">Client</option>
                                    <option value="manager">Manager</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <InviteButton />
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}
