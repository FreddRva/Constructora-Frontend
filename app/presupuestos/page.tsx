import { BudgetForm } from "./BudgetForm";
import { BudgetList } from "./BudgetList";

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Presupuestos de Obra</h1>
        <p className="text-sm text-slate-600">
          Planificación financiera y desglose de costos de materiales, mano de obra y equipos.
        </p>
      </div>

      <BudgetForm />
      <BudgetList />
    </div>
  );
}
