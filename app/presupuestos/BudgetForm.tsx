"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema, BudgetFormValues } from "@/lib/schemas";
import { useBudgets, useProjects } from "@/hooks/useConstructoraQueries";
import { useConstructoraStore } from "@/store/useConstructoraStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { PlusCircle, Save, X } from "lucide-react";

export function BudgetForm() {
  const { createMutation, updateMutation } = useBudgets();
  const { data: projects = [] } = useProjects();
  const { editingBudget, setEditingBudget } = useConstructoraStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      project_id: 0,
      material_cost: 0,
      labor_cost: 0,
      equipment_cost: 0,
      notes: "",
      document_url: "",
    },
  });

  const documentUrlValue = useWatch({ control, name: "document_url" });

  useEffect(() => {
    if (editingBudget) {
      reset({
        project_id: editingBudget.project_id,
        material_cost: editingBudget.material_cost,
        labor_cost: editingBudget.labor_cost,
        equipment_cost: editingBudget.equipment_cost,
        notes: editingBudget.notes,
        document_url: editingBudget.document_url,
      });
    }
  }, [editingBudget, reset]);

  const onSubmit = (values: BudgetFormValues) => {
    if (editingBudget) {
      updateMutation.mutate(
        { id: editingBudget.id, data: values },
        {
          onSuccess: () => {
            setEditingBudget(null);
            reset();
          },
        }
      );
    } else {
      createMutation.mutate(values, { onSuccess: () => reset() });
    }
  };

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        {editingBudget ? `Editar Presupuesto #${editingBudget.id}` : "Registrar Presupuesto de Obra"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-700">Proyecto Asociado</label>
          <select
            {...register("project_id", { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          >
            <option value={0}>-- Seleccione un Proyecto --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.id} - {p.name} ({p.client})
              </option>
            ))}
          </select>
          {errors.project_id && (
            <p className="mt-1 text-xs text-red-600">{errors.project_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Costo de Materiales (S/)</label>
          <input
            type="number"
            step="0.01"
            {...register("material_cost", { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          {errors.material_cost && (
            <p className="mt-1 text-xs text-red-600">{errors.material_cost.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Costo de Mano de Obra (S/)</label>
          <input
            type="number"
            step="0.01"
            {...register("labor_cost", { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          {errors.labor_cost && (
            <p className="mt-1 text-xs text-red-600">{errors.labor_cost.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Costo de Equipos (S/)</label>
          <input
            type="number"
            step="0.01"
            {...register("equipment_cost", { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          {errors.equipment_cost && (
            <p className="mt-1 text-xs text-red-600">{errors.equipment_cost.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Notas / Partida</label>
          <input
            {...register("notes")}
            placeholder="Ej. Presupuesto inicial etapa de cimentación"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
        </div>

        <div>
          <FileUpload
            label="Documento o PDF de Sustento"
            value={documentUrlValue}
            onChange={(url) => setValue("document_url", url)}
          />
        </div>

        <div className="flex items-center gap-2 md:col-span-2">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {editingBudget ? <Save className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
            {editingBudget ? "Actualizar Presupuesto" : "Registrar Presupuesto"}
          </Button>
          {editingBudget && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingBudget(null);
                reset();
              }}
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
