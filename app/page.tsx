"use client";

import Link from "next/link";
import {
  useProjects,
  useInventory,
  useBudgets,
  useStaff,
  useProcurement,
} from "@/hooks/useConstructoraQueries";
import { Card } from "@/components/ui/card";
import {
  FolderKanban,
  Package,
  Calculator,
  Users,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const { data: projects = [] } = useProjects();
  const { data: inventory = [] } = useInventory();
  const { data: budgets = [] } = useBudgets();
  const { data: staff = [] } = useStaff();
  const { data: purchases = [] } = useProcurement();

  const totalBudget = budgets.reduce((acc, b) => acc + b.total_cost, 0);
  const totalPurchases = purchases.reduce((acc, p) => acc + p.total_amount, 0);
  const materialsCount = inventory.filter((i) => i.category === "MATERIAL").length;
  const toolsCount = inventory.filter((i) => i.category === "HERRAMIENTA").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Panel General de Operaciones
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Resumen ejecutivo de obras activas, recursos en almacén, presupuestos, personal y compras.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Obras Registradas
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">Proyectos y Obras</h2>
            </div>
            <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
              <FolderKanban className="h-6 w-6" />
            </div>
          </div>
          <p className="my-4 text-3xl font-extrabold text-slate-900">{projects.length}</p>
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline"
          >
            Administrar proyectos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Almacén y Equipos
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">Inventario</h2>
            </div>
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <Package className="h-6 w-6" />
            </div>
          </div>
          <div className="my-4">
            <p className="text-3xl font-extrabold text-slate-900">{inventory.length}</p>
            <p className="text-xs text-slate-500">
              {materialsCount} Materiales · {toolsCount} Herramientas
            </p>
          </div>
          <Link
            href="/inventario"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
          >
            Ver materiales y herramientas <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Control Financiero
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">Presupuestos</h2>
            </div>
            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
              <Calculator className="h-6 w-6" />
            </div>
          </div>
          <div className="my-4">
            <p className="text-3xl font-extrabold text-emerald-700">
              S/ {totalBudget.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500">{budgets.length} presupuestos registrados</p>
          </div>
          <Link
            href="/presupuestos"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
          >
            Gestionar costos y partidas <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Recursos Humanos
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">Personal y Obreros</h2>
            </div>
            <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="my-4">
            <p className="text-3xl font-extrabold text-slate-900">{staff.length}</p>
            <p className="text-xs text-slate-500">Ingenieros, maestros y operarios</p>
          </div>
          <Link
            href="/personal"
            className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:underline"
          >
            Gestionar personal de obra <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>

        <Card className="flex flex-col justify-between md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Abastecimiento y Logística
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Proveedores y Órdenes de Compra
              </h2>
            </div>
            <div className="rounded-xl bg-orange-100 p-3 text-orange-700">
              <ShoppingCart className="h-6 w-6" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-4">
            <p className="text-3xl font-extrabold text-orange-700">
              S/ {totalPurchases.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500">
              en {purchases.length} órdenes de compra registradas
            </p>
          </div>
          <Link
            href="/compras"
            className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 hover:underline"
          >
            Administrar proveedores y compras <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>
      </div>
    </div>
  );
}
