"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  projectApi,
  inventoryApi,
  budgetApi,
  staffApi,
  procurementApi,
} from "@/services/api";
import {
  ProjectInput,
  InventoryInput,
  BudgetInput,
  WorkerInput,
  PurchaseInput,
} from "@/types";

export function useProjects() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["projects"],
    queryFn: projectApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: ProjectInput) => projectApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProjectInput }) =>
      projectApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => projectApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  return { ...query, createMutation, updateMutation, deleteMutation };
}

export function useInventory() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: InventoryInput) => inventoryApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });

  const createKitMutation = useMutation({
    mutationFn: ({
      kitType,
      projectId,
    }: {
      kitType: "obra_gruesa" | "acabados";
      projectId: number;
    }) => inventoryApi.createKit(kitType, projectId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: InventoryInput }) =>
      inventoryApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => inventoryApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });

  return {
    ...query,
    createMutation,
    createKitMutation,
    updateMutation,
    deleteMutation,
  };
}

export function useBudgets() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["budgets"],
    queryFn: budgetApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: BudgetInput) => budgetApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: BudgetInput }) =>
      budgetApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => budgetApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }),
  });

  return { ...query, createMutation, updateMutation, deleteMutation };
}

export function useStaff() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["staff"],
    queryFn: staffApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: WorkerInput) => staffApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: WorkerInput }) =>
      staffApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => staffApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });

  return { ...query, createMutation, updateMutation, deleteMutation };
}

export function useProcurement() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["procurement"],
    queryFn: procurementApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: PurchaseInput) => procurementApi.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["procurement"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PurchaseInput }) =>
      procurementApi.update(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["procurement"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => procurementApi.remove(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["procurement"] }),
  });

  return { ...query, createMutation, updateMutation, deleteMutation };
}
