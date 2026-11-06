"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateProvider } from "./provider-api";
import type { Provider } from "./provider-api";

interface ProvidersEditFormProps {
    provider: Provider;
}

export default function ProvidersEditForm({ provider }: ProvidersEditFormProps) {
    const [name, setName] = useState(provider.name);
    const [email, setEmail] = useState(provider.email);
    const [phone, setPhone] = useState(provider.phone || "");
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
        event.preventDefault();

        void submitChanges();

    }

    async function submitChanges(): Promise<void> {
        setIsSubmitting(true);
        setError(null);

        try {
            await updateProvider(provider.id, { 
                name: name.trim(), 
                email: email.trim(),
                phone: phone.trim() || null 
            });

            router.push(`/providers/${provider.id}`);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message :  "Unable to update the provider.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="mx-auto max-w-4xl px-6 py-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Edit Provider
                </h1>
                <p className="mt-2 text-gray-600">
                    Update the details of the provider below.
                </p>
            </header>
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="provider-name" className="mb-1 block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            id="provider-name"
                            name="name"
                            type="text"
                            required
                            maxLength={150}
                            autoComplete="organization"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                    <div>
                        <label htmlFor="provider-email" className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="provider-email"
                            name="email"
                            type="email"
                            required
                            maxLength={254}
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                    <div>
                        <label htmlFor="provider-phone" className="mb-1 block text-sm font-medium text-gray-700">
                            Phone (optional)
                        </label>
                        <input
                            id="provider-phone"
                            name="phone"
                            type="tel"
                            maxLength={30}
                            autoComplete="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {error && (
                        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-blue-700 px-5 py-2.5 font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                        <Link
                            href={`/providers/${provider.id}`}
                            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Cancel
                        </Link>
                    </div>
                </form>
            </section>
        </main>
    );
}