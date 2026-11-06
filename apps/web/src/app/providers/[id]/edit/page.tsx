import { notFound } from "next/navigation";
import { getProviderById } from "@/features/providers/provider-api";
import ProvidersEditForm from "@/features/providers/ProvidersEditForm";

interface ProviderEditPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProviderEditPage({ params }: ProviderEditPageProps) {
    const { id } = await params;

    const providerId = Number(id);

    if (!Number.isSafeInteger(providerId) || providerId <= 0) {
        notFound();
    }

    let provider;

    try {
        provider = await getProviderById(providerId);
    } catch (err: unknown) {
        if (err instanceof Error && err.message.includes("404")) {
            notFound();
        }

        throw err;
    }

    return <ProvidersEditForm provider={provider} />;
}