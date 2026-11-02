import { notFound } from "next/navigation";
import { getCustomerById } from "@/features/customers/customer-api";
import CustomerEditForm from "@/features/customers/CustomerEditForm";

interface CustomerEditPageProps {
    params: Promise<{ id: string }>;
}

export default async function CustomerEditPage({ params }: CustomerEditPageProps) {
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

    return <CustomerEditForm customer={customer} />;
}