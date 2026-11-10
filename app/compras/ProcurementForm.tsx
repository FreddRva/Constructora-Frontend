"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseSchema, PurchaseFormValues } from "@/lib/schemas";
import { useProcurement, useProjects } from "@/hooks/useConstructoraQueries";
import { useConstructoraStore } from "@/store/useConstructoraStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { PlusCircle, Save, X } from "lucide-react";

export function ProcurementForm() {
  const { createMutation, updateMutation } = useProcurement();
  const { data: projects = [] } = useProjects();
  const { editingPurchase, setEditingPurchase } = useConstructoraStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplier_name: "",
      ruc: "",
      item_name: "",
      quantity: 1,
      unit_price: 0,
      project_id: 0,
      status: "Pendiente",
      invoice_url: "",
    },
  });

  const invoiceUrlValue = useWatch({ control, name: "invoice_url" });

  useEffect(() => {
    if (editingPurchase) {
      reset({
        supplier_name: editingPurchase.supplier_name,
        ruc: editingPurchase.ruc,
        item_name: editingPurchase.item_name,
        quantity: editingPurchase.quantity,
        unit_price: editingPurchase.unit_price,
        project_id: editingPurchase.project_id,
        status: editingPurchase.status as PurchaseFormValues["status"],
        invoice_url: editingPurchase.invoice_url,
      });
    }
  }, [editingPurchase, reset]);

  const onSubmit = (values: PurchaseFormValues) => {
    if (editingPurchase) {
      updateMutation.mutate(
        { id: editingPurchase.id, data: values },
        {
          onSuccess: () => {
            setEditingPurchase(null);
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
        {editingPurchase ? `Editar Orden de Compra #${editingPurchase.id}` : "Registrar Compra a Proveedor"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="block text-xs font-medium text-slate-700">Proveedor</label>
          <input
            {...register("supplier_name")}
            placeholder="Ej. UNACEM / Aceros Arequipa"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          {errors.supplier_name && (
            <p className="mt-1 text-xs text-red-600">{errors.supplier_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">RUC / Documento Fiscal</label>
          <input
            {...register("ruc")}
            placeholder="Ej. 20100137390"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          {errors.ruc && <p className="mt-1 text-xs text-red-600">{errors.ruc.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Material o Equipo Comprado</label>
          <input
            {...register("item_name")}
            placeholder="Ej. Cemento Portland Tipo I (Bolsas)"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          {errors.item_name && (
            <p className="mt-1 text-xs text-red-600">{errors.item_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Cantidad</label>
          <input
            type="number"
            step="0.01"
            {...register("quantity", { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Precio Unitario (S/)</label>
          <input
            type="number"
            step="0.01"
            {...register("unit_price", { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Estado de Entrega</label>
          <select
            {...register("status")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700">Obra Destino</label>
          <select
            {...register("project_id", { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          >
            <option value={0}>Almacén General</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.id} - {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <FileUpload
            label="Factura o Guía de Remisión"
            value={invoiceUrlValue}
            onChange={(url) => setValue("invoice_url", url)}
          />
        </div>

        <div className="flex items-center gap-2 md:col-span-3">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {editingPurchase ? <Save className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
            {editingPurchase ? "Actualizar Orden" : "Registrar Orden de Compra"}
          </Button>
          {editingPurchase && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingPurchase(null);
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

