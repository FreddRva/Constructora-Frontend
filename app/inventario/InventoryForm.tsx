"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inventorySchema, InventoryFormValues } from "@/lib/schemas";
import { useInventory, useProjects } from "@/hooks/useConstructoraQueries";
import { useConstructoraStore } from "@/store/useConstructoraStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { PlusCircle, Save, X, Layers } from "lucide-react";

export function InventoryForm() {
  const { createMutation, createKitMutation, updateMutation } = useInventory();
  const { data: projects = [] } = useProjects();
  const { editingItem, setEditingItem } = useConstructoraStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: "",
      category: "MATERIAL",
      unit: "Bolsas",
      stock: 10,
      condition: "Consumible",
      project_id: 0,
      image_url: "",
    },
  });

  const selectedCategory = useWatch({ control, name: "category" });
  const imageUrlValue = useWatch({ control, name: "image_url" });

  useEffect(() => {
    if (!editingItem) {
      if (selectedCategory === "HERRAMIENTA") {
        setValue("unit", "Unidad");
        setValue("condition", "Operativo");
      } else {
        setValue("unit", "Bolsas");
        setValue("condition", "Consumible");
      }
    }
  }, [selectedCategory, editingItem, setValue]);

  useEffect(() => {
    if (editingItem) {
      reset({
        name: editingItem.name,
        category: editingItem.category,
        unit: editingItem.unit,
        stock: editingItem.stock,
        condition: editingItem.condition,
        project_id: editingItem.project_id,
        image_url: editingItem.image_url,
      });
    }
  }, [editingItem, reset]);

  const onSubmit = (values: InventoryFormValues) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data: values },
        {
          onSuccess: () => {
            setEditingItem(null);
            reset();
          },
        }
      );
    } else {
      createMutation.mutate(values, { onSuccess: () => reset() });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {editingItem ? `Editar Recurso #${editingItem.id}` : "Registrar Material o Herramienta"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">Tipo de Recurso</label>
            <select
              {...register("category")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            >
              <option value="MATERIAL">Material (Cemento, Ladrillos, Arena...)</option>
              <option value="HERRAMIENTA">Herramienta (Taladro, Mezcladora...)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Nombre</label>
            <input
              {...register("name")}
              placeholder="Ej. Cemento Sol / Taladro Bosch"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Unidad de Medida</label>
            <input
              {...register("unit")}
              placeholder="Bolsas, m3, Unidad..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Stock Disponible</label>
            <input
              type="number"
              step="0.01"
              {...register("stock", { valueAsNumber: true })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />
            {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Estado / Condición</label>
            <input
              {...register("condition")}
              placeholder="Consumible / Operativo / Mantenimiento"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Asignar a Proyecto</label>
            <select
              {...register("project_id", { valueAsNumber: true })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            >
              <option value={0}>Almacén Central (Sin asignar)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.id} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <FileUpload
              label="Foto o Ficha Técnica del Recurso"
              value={imageUrlValue}
              onChange={(url) => setValue("image_url", url)}
            />
          </div>

          <div className="flex items-center gap-2 md:col-span-3">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {editingItem ? <Save className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
              {editingItem ? "Actualizar Recurso" : "Guardar en Inventario"}
            </Button>
            {editingItem && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingItem(null);
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

      <Card className="border-amber-200 bg-amber-50/60">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Layers className="h-4 w-4 text-amber-600" />
              Kits Rápidos por Etapa de Obra
            </h3>
            <p className="text-xs text-slate-600">
              Registra automáticamente el paquete base de <strong>Material + Herramienta</strong> según la fase constructiva.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={createKitMutation.isPending}
              onClick={() => createKitMutation.mutate({ kitType: "obra_gruesa", projectId: 0 })}
            >
              + Cargar Kit Obra Gruesa
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={createKitMutation.isPending}
              onClick={() => createKitMutation.mutate({ kitType: "acabados", projectId: 0 })}
            >
              + Cargar Kit Acabados
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
