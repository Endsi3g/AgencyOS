"use client";

import { useFormStatus } from "react-dom";
import { createInvoice } from "../../actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

function SubmitButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending} className="btn-primary">{pending ? "Generating..." : "Generate Invoice"}</button>
}

export default function NewInvoiceForm({ clients, projects }: { clients: any[], projects: any[] }) {
    const router = useRouter();
    const [items, setItems] = useState([{ description: "", quantity: 1, unit_price: 0 }]);

    const addItem = () => setItems([...items, { description: "", quantity: 1, unit_price: 0 }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const calculateTotal = () => {
        const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);
        const tax = subtotal * 0.1;
        return { subtotal, tax, total: subtotal + tax };
    };

    const totals = calculateTotal();

    return (
        <form
            action={async (formData) => {
                formData.set("items", JSON.stringify(items));
                await createInvoice(null, formData);
                router.push("/dashboard/billing");
            }}
            className="flex flex-col gap-6"
        >
            {/* ... Form Fields ... */}
            <div className="grid grid-cols-2 gap-6 p-6 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Client</span>
                        <select name="client_id" className="input" required>
                            <option value="">Select Client...</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Project (Optional)</span>
                        <select name="project_id" className="input">
                            <option value="">Select Project...</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </label>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Issue Date</span>
                            <input name="issue_date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="input" required />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Due Date</span>
                            <input name="due_date" type="date" className="input" required />
                        </label>
                    </div>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                        <select name="status" className="input">
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                            <option value="paid">Paid</option>
                        </select>
                    </label>
                </div>
            </div>

            {/* Line Items */}
            <div className="p-6 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Line Items</h3>
                    <button type="button" onClick={addItem} className="text-sm text-primary font-medium hover:underline">+ Add Item</button>
                </div>
                <div className="flex flex-col gap-3">
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-3 items-start">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Description"
                                    className="input"
                                    value={item.description}
                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="w-24">
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    className="input text-center"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="w-32">
                                <input
                                    type="number"
                                    placeholder="Price"
                                    className="input text-right"
                                    min="0"
                                    step="0.01"
                                    value={item.unit_price}
                                    onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))}
                                    required
                                />
                            </div>
                            <button type="button" onClick={() => removeItem(index)} className="p-2 text-slate-400 hover:text-red-500">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Subtotal</span>
                            <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Tax (10%)</span>
                            <span className="font-medium">${totals.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-slate-200 dark:border-slate-700 pt-2">
                            <span>Total</span>
                            <span>${totals.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
                <SubmitButton />
            </div>
        </form>
    );
}
