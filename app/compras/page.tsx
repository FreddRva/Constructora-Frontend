import { ProcurementForm } from "./ProcurementForm";
import { ProcurementList } from "./ProcurementList";

export default function ProcurementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Proveedores y Órdenes de Compra</h1>
        <p className="text-sm text-slate-600">
          Gestión de compras de materiales, proveedores autorizados y control de entregas.
        </p>
      </div>

      <ProcurementForm />
      <ProcurementList />
    </div>
  );
}
