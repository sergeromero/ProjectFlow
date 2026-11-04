const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";

export interface Customer {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string
}

export interface CreateCustomerRequest {
    name: string;
    email: string;
}

export interface UpdateCustomerRequest {
    name?: string;
    email?: string;
}

async function getErrorMessage(response: Response): Promise<string> {
    try {
        const body: unknown = await response.json();

        if (typeof body === "object" && body !== null && "message" in body) {
            const message = body.message;

            if (Array.isArray(message)) {
                return message.join(" ");
            }

            if (typeof message === "string") {
                return message;
            }
        }
    } catch {
        //The response did not contain a readable JSON error body
    }

    return `The request failed with status ${response.status}`;
}

export async function getCustomers(): Promise<Customer[]> { 
    const response = await fetch(`${API_BASE_URL}/customers`);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json() as Promise<Customer[]>;
}

export async function createCustomer(request: CreateCustomerRequest): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json() as Promise<Customer>;
}

export async function getCustomerById(id: number): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, { cache: "no-store" });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json() as Promise<Customer>;
}

export async function updateCustomer(id: number, request: UpdateCustomerRequest): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json() as Promise<Customer>;
}

export async function deactivateCustomer(id: number): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}/deactivate`, {
        method: "PATCH"
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json() as Promise<Customer>;
}