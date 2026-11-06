const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";

export interface Provider {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProviderRequest {
    name: string;
    email: string;
    phone?: string;
}

export interface UpdateProviderRequest { 
    name?: string;
    email?: string;
    phone?: string | null;
}

async function  getErrorMessage(response: Response): Promise<string> {
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

    }

    return `The request failed with status ${response.status}`;
}

export async function getProviders(): Promise<Provider[]> {
    const response = await fetch(`${API_BASE_URL}/providers`);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json() as Promise<Provider[]>;
}

export async function createProvider(request: CreateProviderRequest): Promise<Provider> {
    const response = await fetch(`${API_BASE_URL}/providers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json() as Promise<Provider>;
}

export async function getProviderById(id: number): Promise<Provider> {
    const response = await fetch(`${API_BASE_URL}/providers/${id}`, { cache: "no-store" });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json() as Promise<Provider>;
}

export async function updateProvider(id: number, request: UpdateProviderRequest): Promise<Provider> {
    const response = await fetch(`${API_BASE_URL}/providers/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json() as Promise<Provider>;
}