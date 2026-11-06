"use client";

import { useCallback, useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import Link from "next/link";
import { createProvider, getProviders } from "./provider-api";
import type { Provider } from "./provider-api";

export default function ProviderManagement() {
    const [providers, setProviders] = useState<Provider[]>([]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const loadProviders = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await getProviders();
            setProviders(result);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to load providers.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadProviders();
    }, [loadProviders]);

    function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
        event.preventDefault();

        void submitProvider();
    }

    async function submitProvider(): Promise<void> {
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        try {
            const request = {
                name: name.trim(),
                email: email.trim(),
                ...(phone.trim() ? { phone: phone.trim() } : {})
            };

            const provider = await createProvider(request);

            setSuccess(`Provider "${provider.name}" was created successfully.`);
            setName("");
            setEmail("");
            setPhone("");

            await loadProviders();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to create the provider.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="mx-auto max-w-5xl px-6 py-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Provider Management
                </h1>
                <p className="mt-2 text-gray-600">
                    Create providers and view your existing provider records.
                </p>
            </header>

            {/* Provider creation form */}
            <section aria-labelledby="create-provider-heading"
                    className="mb-10 roundel-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 id="create-provider-heading" className="mb-5 text-xl font-semibold text-gray-900">
                    Create Provider
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="provider-name"
                                className="mb-1 block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input id="provider-name"
                                name="name"
                                type="text"
                                required
                                maxLength={150}
                                autoComplete="organization"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                placeholder="Enter provider name" />
                    </div>
                    <div>
                        <label htmlFor="provider-email"
                                className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input id="provider-email"
                                name="email"
                                type="email"
                                required
                                maxLength={254}
                                autoComplete="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                placeholder="provider@example.com" />
                    </div>
                    <div>
                        <label htmlFor="provider-phone"
                                className="mb-1 block text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <input id="provider-phone"
                                name="phone"
                                type="tel"
                                maxLength={30}
                                autoComplete="tel"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                placeholder="5145551234" />
                    </div>
                    <button type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-blue-700 px-5 py-2.5 font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                        {isSubmitting ? "Creating ..." : "Create Provider"}
                    </button>
                </form>
            </section>

            {/* Feedback messages */}
            {success && (
                <div role="status"
                    className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
                    {success}
                </div>
            )}

            {error && (
                <div role="alert"
                    className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                    {error}
                </div>
            )}

            {/* Provider List */}
            <section aria-labelledby="provider-list-heading">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 id="provider-list-heading" className="text-xl font-semibold text-gray-900">
                        Providers
                    </h2>
                    <button type="button"
                            onClick={() => void loadProviders()}
                            disabled={isLoading}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60">
                        Refresh
                    </button>
                </div>

                {isLoading ? (
                    <p role="status" className="py-8 text-gray-600">
                        Loading providers ...
                    </p>
                ) : providers.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center">
                        <p className="font-medium text-gray-900">
                            No providers found.
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                            Create your first provider using the form above.
                        </p>
                    </div>                        
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                        Phone
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {providers.map((provider) => (
                                    <tr key={provider.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                            <Link href={`/providers/${provider.id}`}
                                                    className="text-blue-700 hover:text-blue-900 hover:underline">
                                                {provider.name}
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {provider.email}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {provider.phone || "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>                        
                )}
            </section>
        </main>
    );
}