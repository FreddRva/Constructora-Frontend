import { create } from "zustand";
import { Project, InventoryItem, Budget, Worker, Purchase } from "@/types";

interface ConstructoraState {
  selectedProjectFilter: number;
  setSelectedProjectFilter: (id: number) => void;

  inventoryCategoryFilter: "ALL" | "MATERIAL" | "HERRAMIENTA";
  setInventoryCategoryFilter: (cat: "ALL" | "MATERIAL" | "HERRAMIENTA") => void;

  editingProject: Project | null;
  setEditingProject: (p: Project | null) => void;

  editingItem: InventoryItem | null;
  setEditingItem: (item: InventoryItem | null) => void;

  editingBudget: Budget | null;
  setEditingBudget: (b: Budget | null) => void;

  editingWorker: Worker | null;
  setEditingWorker: (w: Worker | null) => void;

  editingPurchase: Purchase | null;
  setEditingPurchase: (p: Purchase | null) => void;
}

export const useConstructoraStore = create<ConstructoraState>((set) => ({
  selectedProjectFilter: 0,
  setSelectedProjectFilter: (id) => set({ selectedProjectFilter: id }),

  inventoryCategoryFilter: "ALL",
  setInventoryCategoryFilter: (cat) => set({ inventoryCategoryFilter: cat }),

  editingProject: null,
  setEditingProject: (p) => set({ editingProject: p }),

  editingItem: null,
  setEditingItem: (item) => set({ editingItem: item }),

  editingBudget: null,
  setEditingBudget: (b) => set({ editingBudget: b }),

  editingWorker: null,
  setEditingWorker: (w) => set({ editingWorker: w }),

  editingPurchase: null,
  setEditingPurchase: (p) => set({ editingPurchase: p }),
}));
