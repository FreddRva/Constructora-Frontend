"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormValues } from "@/lib/schemas";
import { useProjects } from "@/hooks/useConstructoraQueries";
import { useConstructoraStore } from "@/store/useConstructoraStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { PlusCircle, Save, X } from "lucide-react";

export function ProjectForm() {
  const { createMutation, updateMutation } = useProjects();
  const { editingProject, setEditingProject } = useConstructoraStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      client: "",
      location: "",
      start_date: "",
      end_date: "",
      status: "Planificación",
      progress: 0,
      image_url: "",
    },
  });

  const imageUrlValue = useWatch({ control, name: "image_url" });

  useEffect(() => {
    if (editingProject) {
      reset({
        name: editingProject.name,
        client: editingProject.client,
        location: editingProject.location,
        start_date: editingProject.start_date,
        end_date: editingProject.end_date,
        status: editingProject.status as ProjectFormValues["status"],
        progress: editingProject.progress,
        image_url: editingProject.image_url,
      });
    }
  }, [editingProject, reset]);

  const onSubmit = (values: ProjectFormValues) => {
    if (editingProject) {
      updateMutation.mutate(
        { id: editingProject.id, data: values },
        {
          onSuccess: () => {
            setEditingProject(null);
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
        {editingProject ? `Editar Proyecto #${editingProject.id}` : "Nuevo Proyecto / Obra"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-700">Nombre del Proyecto</label>
          <input
            {...register("name")}
            placeholder="Ej. Edificio Residencial Los Olivos"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Cliente</label>
          <input
            {...register("client")}
            placeholder="Ej. Inmobiliaria del Sur S.A."
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          {errors.client && <p className="mt-1 text-xs text-red-600">{errors.client.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Ubicación</label>
          <input
            {...register("location")}
            placeholder="Ej. Av. Javier Prado 1420, Lima"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">Fecha Inicio</label>
            <input
              type="date"
              {...register("start_date")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">Fecha Estimada Fin</label>
            <input
              type="date"
              {...register("end_date")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Estado</label>
          <select
            {...register("status")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          >
            <option value="Planificación">Planificación</option>
            <option value="En Ejecución">En Ejecución</option>
            <option value="Pausado">Pausado</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Avance (%)</label>
          <input
            type="number"
            step="1"
            {...register("progress", { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          {errors.progress && <p className="mt-1 text-xs text-red-600">{errors.progress.message}</p>}
        </div>

        <div className="md:col-span-2">
          <FileUpload
            label="Plano o Imagen del Proyecto"
            value={imageUrlValue}
            onChange={(url) => setValue("image_url", url)}
          />
        </div>

        <div className="flex items-center gap-2 md:col-span-2">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {editingProject ? <Save className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
            {editingProject ? "Guardar Cambios" : "Crear Proyecto"}
          </Button>
          {editingProject && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingProject(null);
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
