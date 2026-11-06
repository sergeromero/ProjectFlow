import { notFound } from "next/navigation";
import Link from "next/link";
import { getProviderById } from "@/features/providers/provider-api";

interface ProviderDetailsPageProps{
    params: Promise<{ id: string }>;
}

export default async function ProviderDetailsPage({ params }: ProviderDetailsPageProps) {
  const { id } = await params;
  const providerId = Number(id);

  if (!Number.isSafeInteger(providerId) || providerId <= 0 ) {
    notFound();
  }

  let provider;

  try {
    provider = await getProviderById(providerId);
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
                Provider Details
            </h1>
            <p className="mt-2 text-gray-600">
                View provider information.
            </p>
        </header>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                    {provider.name}
                </h2>
            </div>
            <dl className="grid gap-6 sm:grid-cols-2">
                <div>
                    <dt className="text-sm font-medium text-gray-500">
                        Provider ID
                    </dt>
                    <dd className="mt-1 text-gray-900">
                        {provider.id}
                    </dd>
                </div>
                <div>
                    <dt className="text-sm font-medium text-gray-500">
                        Email
                    </dt>
                    <dd className="mt-1 text-gray-900">
                        {provider.email}
                    </dd>
                </div>
                <div>
                    <dt className="text-sm font-medium text-gray-500">
                        Phone
                    </dt>
                    <dd className="mt-1 text-gray-500">
                        {provider.phone || "Not provided"}
                    </dd>
                </div>
                <div>
                    <dt className="text-sm font-medium text-gray-500">
                        Created
                    </dt>
                    <dd className="mt-1 text-gray-900">
                        {new Date(provider.createdAt).toLocaleString()}
                    </dd>
                </div>
                <div>
                    <dt className="text-sm font-medium text-gray-500">
                        Last Updated
                    </dt>
                    <dd className="mt-1 text-gray-900">
                        {new Date(provider.updatedAt).toLocaleString()}
                    </dd>
                </div>
            </dl>
        </section>

        <div className="mt-6 flex items-center gap-3">
            <Link
                href={`/providers/${provider.id}/edit`}
                className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">
                Edit Provider
            </Link>
            <Link
                href={`/providers`}
                className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
                Back to Providers
            </Link>
        </div>
    </main>
  );
}