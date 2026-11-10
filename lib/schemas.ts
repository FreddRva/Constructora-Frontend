import { z } from "zod";

// 1. Esquema de validación para Proyectos
export const projectSchema = z.object({
  name: z.string().min(2, "El nombre del proyecto es obligatorio"),
  client: z.string().min(2, "El nombre del cliente es obligatorio"),
  location: z.string().min(2, "La ubicación es obligatoria"),
  start_date: z.string().min(1, "Seleccione la fecha de inicio"),
  end_date: z.string().min(1, "Seleccione la fecha estimada de fin"),
  status: z.enum(["Planificación", "En Ejecución", "Pausado", "Finalizado"]),
  progress: z.number().min(0, "Mínimo 0%").max(100, "Máximo 100%"),
  image_url: z.string(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export const inventorySchema = z.object({
  name: z.string().min(2, "El nombre del recurso es obligatorio"),
  category: z.enum(["MATERIAL", "HERRAMIENTA"]),
  unit: z.string().min(1, "La unidad es obligatoria (ej. Bolsas, m3, Unidad)"),
  stock: z.number().min(0, "El stock no puede ser negativo"),
  condition: z.string().min(1, "El estado/condición es obligatorio"),
  project_id: z.number().min(0),
  image_url: z.string(),
});

export type InventoryFormValues = z.infer<typeof inventorySchema>;

export const budgetSchema = z.object({
  project_id: z.number().min(1, "Debe seleccionar un proyecto"),
  material_cost: z.number().min(0, "El costo no puede ser negativo"),
  labor_cost: z.number().min(0, "El costo no puede ser negativo"),
  equipment_cost: z.number().min(0, "El costo no puede ser negativo"),
  notes: z.string(),
  document_url: z.string(),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;

export const workerSchema = z.object({
  name: z.string().min(2, "El nombre completo es obligatorio"),
  role: z.string().min(2, "El cargo o especialidad es obligatorio"),
  phone: z.string().min(3, "Ingrese un teléfono de contacto"),
  daily_wage: z.number().min(0, "El jornal no puede ser negativo"),
  project_id: z.number().min(0),
  status: z.enum(["Activo", "En Descanso"]),
});

export type WorkerFormValues = z.infer<typeof workerSchema>;

export const purchaseSchema = z.object({
  supplier_name: z.string().min(2, "El nombre del proveedor es obligatorio"),
  ruc: z.string().min(8, "Ingrese el RUC o documento fiscal"),
  item_name: z.string().min(2, "El material o equipo comprado es obligatorio"),
  quantity: z.number().min(1, "La cantidad debe ser al menos 1"),
  unit_price: z.number().min(0, "El precio unitario no puede ser negativo"),
  project_id: z.number().min(0),
  status: z.enum(["Pendiente", "Entregado", "Cancelado"]),
  invoice_url: z.string(),
});

export type PurchaseFormValues = z.infer<typeof purchaseSchema>;
