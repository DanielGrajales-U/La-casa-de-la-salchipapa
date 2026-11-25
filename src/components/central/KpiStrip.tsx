import { Bell, CheckCircle2, Flame } from "lucide-react";
import type React from "react";
import { formatCOP } from "../../utils/formatters";

interface KpiStripProps {
	nuevos: number;
	enCocina: number;
	listos: number;
	totalSales: number;
	validCount: number;
}

export const KpiStrip: React.FC<KpiStripProps> = ({
	nuevos,
	enCocina,
	listos,
	totalSales,
	validCount,
}) => {
	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 bg-white border border-neutral-200 rounded-xl divide-y lg:divide-y-0 lg:divide-x divide-neutral-200 mb-6 overflow-hidden">
			<div className="p-5">
				<div className="flex items-center justify-between text-xs font-medium text-neutral-500 mb-1.5">
					<span>Nuevos por aceptar</span>
					<Bell className="w-4 h-4 text-[#D92525]" />
				</div>
				<p className="font-mono text-2xl sm:text-3xl font-bold text-[#0E0E10] tabular-nums">
					{nuevos}
				</p>
			</div>

			<div className="p-5">
				<div className="flex items-center justify-between text-xs font-medium text-neutral-500 mb-1.5">
					<span>En cocina</span>
					<Flame className="w-4 h-4 text-amber-600" />
				</div>
				<p className="font-mono text-2xl sm:text-3xl font-bold text-[#0E0E10] tabular-nums">
					{enCocina}
				</p>
			</div>

			<div className="p-5">
				<div className="flex items-center justify-between text-xs font-medium text-neutral-500 mb-1.5">
					<span>Listos para entrega</span>
					<CheckCircle2 className="w-4 h-4 text-blue-600" />
				</div>
				<p className="font-mono text-2xl sm:text-3xl font-bold text-[#0E0E10] tabular-nums">
					{listos}
				</p>
			</div>

			<div className="p-5">
				<div className="flex items-center justify-between text-xs font-medium text-neutral-500 mb-1.5">
					<span>Ventas del turno ({validCount})</span>
				</div>
				<p className="font-mono text-2xl sm:text-3xl font-bold text-[#0E0E10] tabular-nums">
					{formatCOP(totalSales)}
				</p>
			</div>
		</div>
	);
};
