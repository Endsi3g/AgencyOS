"use client";

import { useState } from "react";
import { updateUserRole } from "../../actions";

interface UserRowProps {
    user: any;
}

export default function UserRow({ user }: UserRowProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Optimistic Role Update could be added here, but revalidatePath covers it.

    const handleRoleChange = async (newRole: string) => {
        setIsSaving(true);
        try {
            await updateUserRole(user.id, newRole);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            alert("Failed to update role");
        } finally {
            setIsSaving(false);
            setIsMenuOpen(false);
        }
    };

    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                        {user.email?.charAt(0).toUpperCase()}
                    </div>
                    {/* Only capture click outside to close */}
                    {isMenuOpen && (
                        <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                    )}
                    <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{user.full_name || "Unknown"}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <select
                            className="text-xs border rounded p-1 dark:bg-slate-800 dark:border-slate-700"
                            defaultValue={user.role}
                            onChange={(e) => handleRoleChange(e.target.value)}
                            disabled={isSaving}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="client">Client</option>
                            <option value="manager">Manager</option>
                        </select>
                        {isSaving && <span className="text-xs text-slate-400">Saving...</span>}
                    </div>
                ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'client' ? 'bg-emerald-100 text-emerald-800' :
                                'bg-slate-100 text-slate-800'
                        }`}>
                        {user.role || 'user'}
                    </span>
                )}
            </td>
            <td className="px-6 py-4 text-sm text-slate-500">
                {new Date(user.created_at).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 text-right relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-slate-400 hover:text-primary transition-colors p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <span className="material-symbols-outlined">more_vert</span>
                </button>

                {isMenuOpen && (
                    <div className="absolute right-8 top-8 w-48 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20 py-1 text-left">
                        <button
                            onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            Change Role
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 dark:hover:bg-slate-800 opacity-50 cursor-not-allowed"
                            title="Not implemented"
                        >
                            Delete User
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}
