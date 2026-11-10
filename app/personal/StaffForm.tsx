"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workerSchema, WorkerFormValues } from "@/lib/schemas";
import { useStaff, useProjects } from "@/hooks/useConstructoraQueries";
import { useConstructoraStore } from "@/store/useConstructoraStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Save, X } from "lucide-react";

export function StaffForm() {
  const { createMutation, updateMutation } = useStaff();
  const { data: projects = [] } = useProjects();
  const { editingWorker, setEditingWorker } = useConstructoraStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkerFormValues>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      name: "",
      role: "Maestro de Obra",
      phone: "",
      daily_wage: 100,
      project_id: 0,
      status: "Activo",
    },
  });

  useEffect(() => {
    if (editingWorker) {
      reset({
        name: editingWorker.name,
        role: editingWorker.role,
        phone: editingWorker.phone,
        daily_wage: editingWorker.daily_wage,
        project_id: editingWorker.project_id,
        status: editingWorker.status as WorkerFormValues["status"],
      });
    }
  }, [editingWorker, reset]);

  const onSubmit = (values: WorkerFormValues) => {
    if (editingWorker) {
      updateMutation.mutate(
        { id: editingWorker.id, data: values },
        {
          onSuccess: () => {
            setEditingWorker(null);
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
        {editingWorker ? `Editar Trabajador #${editingWorker.id}` : "Registrar Personal / Trabajador"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="block text-xs font-medium text-slate-700">Nombre Completo</label>
          <input
            {...register("name")}
            placeholder="Ej. Ing. Carlos Mendoza"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Cargo / Especialidad</label>
          <select
            {...register("role")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          >
            <option value="Ingeniero Residente">Ingeniero Residente</option>
            <option value="Maestro de Obra">Maestro de Obra</option>
            <option value="Operario Albañil">Operario Albañil</option>
            <option value="Operario Electricista">Operario Electricista</option>
            <option value="Operario Fierrero">Operario Fierrero</option>
            <option value="Ayudante General">Ayudante General</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Teléfono de Contacto</label>
          <input
            {...register("phone")}
            placeholder="Ej. 987-654-321"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Jornal Diario (S/)</label>
          <input
            type="number"
            step="0.01"
            {...register("daily_wage", { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Obra Asignada</label>
          <select
            {...register("project_id", { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          >
            <option value={0}>Disponible / Sin asignar</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.id} - {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Estado</label>
          <select
            {...register("status")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          >
            <option value="Activo">Activo</option>
            <option value="En Descanso">En Descanso</option>
          </select>
        </div>

        <div className="flex items-center gap-2 md:col-span-3">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {editingWorker ? <Save className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
            {editingWorker ? "Guardar Cambios" : "Registrar Trabajador"}
          </Button>
          {editingWorker && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingWorker(null);
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

