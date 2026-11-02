"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateCustomer } from "./customer-api";
import type { Customer } from "./customer-api";


interface CustomerEditFormProps {
    customer: Customer;
}

export default function CustomerEditForm({ customer }: CustomerEditFormProps) {
    const router = useRouter();

    const [name, setName] = useState(customer.name);
    const [email, setEmail] = useState(customer.email);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
        event.preventDefault();

        void submitChanges();
    }

    async function submitChanges(): Promise<void> {
        setError(null);
        setIsSubmitting(true);

        try {
            await updateCustomer(customer.id, {
                name: name.trim(),
                email: email.trim()
            });

            router.push(`/customers/${customer.id}`);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to update the customer.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="mx-auto max-w-4xl px-6 py-10">
            <header className="mb-8">
                <h1 className="text=2xl font-bold tracking-tight text-gray-900">
                    Edit Customer
                </h1>
                <p className="mt-2 text-gray-600">
                    Update the customer's information.
                </p>
            </header>

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="customer-name" className="mb-1 block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input id="customer-name"
                                name="name"
                                type="text"
                                required
                                maxLength={150}
                                autoComplete="organization"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"/>
                    </div>
                    <div>
                        <label htmlFor="customer-email" className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input id="customer-email"
                                name="email"
                                type="email"
                                required
                                maxLength={254}
                                autoComplete="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"/>
                    </div>

                    {error && (
                        <div role="alert"
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button type="submit"
                                disabled={isSubmitting}
                                className="rounded-lg bg-blue-700 px-5 py-2.5 font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                            {isSubmitting ? "Saving" : "Save Changes"}
                        </button>

                        <Link href={`/customers/${customer.id}`}
                                className="rounded-lg border border-gray-300 px-5 py-2.5 text-smfont-medium text-gray-700 hover:bg-gray-50">
                            Cancel
                        </Link>
                    </div>
                </form>
            </section>
        </main>
    );
}