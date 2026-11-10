"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HardHat,
  LayoutDashboard,
  FolderKanban,
  Package,
  Calculator,
  Users,
  ShoppingCart,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Resumen", icon: LayoutDashboard },
  { href: "/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/inventario", label: "Inventario", icon: Package },
  { href: "/presupuestos", label: "Presupuestos", icon: Calculator },
  { href: "/personal", label: "Personal", icon: Users },
  { href: "/compras", label: "Compras", icon: ShoppingCart },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white text-slate-900 shadow-xs">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-lg bg-amber-500 p-2 text-white">
            <HardHat className="h-6 w-6" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Constructora ERP
            </span>
            <p className="text-xs text-slate-500">
              Sistema de Gestión de Obras y Operaciones
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-amber-500 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
