import { notFound } from "next/navigation";
import { getCustomerById } from "@/features/customers/customer-api";

interface CustomerDetailsPageProps {
    params: Promise<{ id: string; }>;
}

export default async function CustomerDetailsPage ({ params }: CustomerDetailsPageProps) {
    const { id } = await params;

    const customerId = Number(id);

    if (!Number.isSafeInteger(customerId) || customerId <= 0) {
        notFound();
    }

    let customer;

    try {
        customer = await getCustomerById(customerId);
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes("404")) {
            notFound();
        }

        throw error;
    }

    return (
        <main className="mx-auto max-w-4xl px-6 py-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Customer Details
                </h1>
                <p className="mt-2 text-gray-600">
                    View customer information.
                </p>
            </header>

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        {customer.name}
                    </h2>

                    <span className={
                        customer.isActive
                        ? "mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                        : "mt-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                    }>
                        {customer.isActive ? "Active" : "Inactive"}
                    </span>
                </div>

                <dl className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Customer ID</dt>
                        <dd className="mt-1 text-gray-900">{customer.id}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-gray-900">{customer.email}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Created</dt>
                        <dd className="mt-1 text-gray-900">{new Date(customer.createdAt).toLocaleString()}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                        <dd className="mt-1 text-gray-900">{new Date(customer.updatedAt).toLocaleString()}</dd>
                    </div>
                </dl>
            </section>

            <div className="mt-6">
                <a href="/customers"
                    className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Back to Customers
                </a>
            </div>
        </main>
    );
}