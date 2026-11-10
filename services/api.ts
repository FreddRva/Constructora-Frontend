import {
  Project,
  ProjectInput,
  InventoryItem,
  InventoryInput,
  Budget,
  BudgetInput,
  Worker,
  WorkerInput,
  Purchase,
  PurchaseInput,
} from "@/types";

function getServiceUrl(envUrl: string | undefined, port: number): string {
  if (envUrl) return envUrl;
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:${port}`;
  }
  return `http://localhost:${port}`;
}

const PROJECT_API = () =>
  getServiceUrl(process.env.NEXT_PUBLIC_PROJECT_API, 8081);
const INVENTORY_API = () =>
  getServiceUrl(process.env.NEXT_PUBLIC_INVENTORY_API, 8082);
const BUDGET_API = () =>
  getServiceUrl(process.env.NEXT_PUBLIC_BUDGET_API, 8083);
const STAFF_API = () =>
  getServiceUrl(process.env.NEXT_PUBLIC_STAFF_API, 8084);
const PROCUREMENT_API = () =>
  getServiceUrl(process.env.NEXT_PUBLIC_PROCUREMENT_API, 8085);

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Error en la petición al servidor");
  }
  return data;
}

export const projectApi = {
  getAll: () => request<Project[]>(`${PROJECT_API()}/projects`),
  create: (body: ProjectInput) =>
    request<Project>(`${PROJECT_API()}/projects`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: number, body: ProjectInput) =>
    request<Project>(`${PROJECT_API()}/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  remove: (id: number) =>
    request<{ message: string }>(`${PROJECT_API()}/projects/${id}`, {
      method: "DELETE",
    }),
};

export const inventoryApi = {
  getAll: () => request<InventoryItem[]>(`${INVENTORY_API()}/inventory`),
  create: (body: InventoryInput) =>
    request<InventoryItem>(`${INVENTORY_API()}/inventory`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  createKit: (kitType: "obra_gruesa" | "acabados", projectId: number) =>
    request<InventoryItem[]>(
      `${INVENTORY_API()}/inventory/kit/${kitType}?project_id=${projectId}`,
      {
        method: "POST",
      },
    ),
  update: (id: number, body: InventoryInput) =>
    request<InventoryItem>(`${INVENTORY_API()}/inventory/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  remove: (id: number, ) =>
    request<{ message: string }>(`${INVENTORY_API()}/inventory/${id}`, {
      method: "DELETE",
    }),
};

export const budgetApi = {
  getAll: () => request<Budget[]>(`${BUDGET_API()}/budgets`),
  create: (body: BudgetInput) =>
    request<Budget>(`${BUDGET_API()}/budgets`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: number, body: BudgetInput) =>
    request<Budget>(`${BUDGET_API()}/budgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  remove: (id: number) =>
    request<{ message: string }>(`${BUDGET_API()}/budgets/${id}`, {
      method: "DELETE",
    }),
};

export const staffApi = {
  getAll: () => request<Worker[]>(`${STAFF_API()}/staff`),
  create: (body: WorkerInput) =>
    request<Worker>(`${STAFF_API()}/staff`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: number, body: WorkerInput) =>
    request<Worker>(`${STAFF_API()}/staff/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  remove: (id: number) =>
    request<{ message: string }>(`${STAFF_API()}/staff/${id}`, {
      method: "DELETE",
    }),
};

export const procurementApi = {
  getAll: () => request<Purchase[]>(`${PROCUREMENT_API()}/purchases`),
  create: (body: PurchaseInput) =>
    request<Purchase>(`${PROCUREMENT_API()}/purchases`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: number, body: PurchaseInput) =>
    request<Purchase>(`${PROCUREMENT_API()}/purchases/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  remove: (id: number) =>
    request<{ message: string }>(`${PROCUREMENT_API()}/purchases/${id}`, {
      method: "DELETE",
    }),
};
