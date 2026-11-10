export interface Project {
  id: number;
  name: string;
  client: string;
  location: string;
  start_date: string;
  end_date: string;
  status: string;
  progress: number;
  image_url: string;
}

export type ProjectInput = Omit<Project, "id">;

export interface InventoryItem {
  id: number;
  name: string;
  category: "MATERIAL" | "HERRAMIENTA";
  unit: string;
  stock: number;
  condition: string;
  project_id: number;
  image_url: string;
}

export type InventoryInput = Omit<InventoryItem, "id">;

export interface Budget {
  id: number;
  project_id: number;
  material_cost: number;
  labor_cost: number;
  equipment_cost: number;
  total_cost: number;
  notes: string;
  document_url: string;
}

export type BudgetInput = Omit<Budget, "id" | "total_cost">;

export interface Worker {
  id: number;
  name: string;
  role: string;
  phone: string;
  daily_wage: number;
  project_id: number;
  status: string;
}

export type WorkerInput = Omit<Worker, "id">;

export interface Purchase {
  id: number;
  supplier_name: string;
  ruc: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  project_id: number;
  status: string;
  invoice_url: string;
}

export type PurchaseInput = Omit<Purchase, "id" | "total_amount">;
