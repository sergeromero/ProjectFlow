"use client";

import { useCallback, useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { createCustomer, getCustomers } from "./customer-api";
import type { Customer } from "./customer-api";

export default function CustomerManagement() {
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const loadCustomers = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await getCustomers();
            setCustomers(result);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to load customers.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadCustomers();
    }, [loadCustomers]);

    function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
        event.preventDefault();

        void submitCustomer();
    }

    async function submitCustomer(): Promise<void> {
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        try {
            const customer = await createCustomer({
                name: name.trim(),
                email: email.trim()
            });

            setSuccess(`Customer "${customer.name}" was created successfully.`);

            setName("");
            setEmail("");

            await loadCustomers();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to create the customer.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="mx-auto max-w-5xl px-6 py-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Customer Management
                </h1>

                <p className="mt-2 text-grey-600">
                    Create customers and view your existing customer records.
                </p>
            </header>

            {/* Customer creation form */}
            <section aria-labelledby="create-customer-heading" className="mb-10 rounded-xl border border-grey-200 bg-white p-6 shadow-sm">
                <h2 id="create-customer-heading" className="mb-5 text-xl font-semibold text-grey-900">
                    Create Customer
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="customer-name" className="mb-1 block text-sm font-medium text-grey-700">
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
                               className="w-full rounded-lg border border-grey-300 px-3 py-2 text-grey-900 outoutline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                               placeholder="Enter customer name" />                    
                    </div>
                    <div>
                        <label htmlFor="customer-email" className="mb-1 block text-sm font-medium text-grey-700">
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
                               className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                               placeholder="customer@example.com" />
                    </div>

                    <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-700 px-5 py-2.5 font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                        {isSubmitting ? "Creating ..." : "Create Customer"}
                    </button>
                </form>
            </section>

            {/* Feedback messages */}
            {success && (
                <div role="status" className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
                    {success}
                </div>
            )}

            {error && (
                <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                    {error}
                </div>                
            )}

            {/* Customer list */}
            <section aria-labelledby="customer-list-heading">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 id="customer-list-heading" className="text-xl font-semibold text-grey-900">
                        Customers
                    </h2>

                    <button type="button"
                            onClick={() => loadCustomers()}
                            disabled={isLoading}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60">
                        Refresh
                    </button>
                </div>

                {isLoading ? (
                    <p role="status" className="py-8 text-grey-600">
                        Loading customers ...
                    </p>
                ) : customers.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center">
                        <p className="font-medium text-grey-900">
                            No customers foound
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                            Create your first customer using the form above.
                        </p>
                    </div>                        
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-grey-200 bg-white shadow-sm">
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
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                            {customer.name}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {customer.email}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <span className={
                                                customer.isActive
                                                ? "rounded-full bg-green-100 px-3 py-1 font-medium text-green-800"
                                                : "rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700"
                                            }>
                                                {customer.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {isLoading && (
                    <p className="mt-3 text-sm text-gray-500">
                        {customers.length}{" "}
                        {customers.length === 1 ? "customer" : "customers"} displayed
                    </p>
                )}
            </section>
        </main>
    );
}