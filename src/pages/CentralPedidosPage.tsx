import { ClipboardList, LayoutGrid, Plus, Search } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { KpiStrip } from "../components/central/KpiStrip";
import { OrdersTable } from "../components/central/OrdersTable";
import { OrderTicketCard } from "../components/central/OrderTicketCard";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import {
	SegmentedControl,
	type SegmentOption,
} from "../components/ui/SegmentedControl";
import type { DeliveryType, Order, OrderStatus } from "../types/order";

interface CentralPedidosPageProps {
	orders: Order[];
	onUpdateStatus: (orderId: string, nextStatus: OrderStatus) => void;
	onSimulateIncomingOrder: () => void;
}

type ViewMode = "cocina" | "dueno";
type StatusFilter = "activos" | "todos" | OrderStatus;

const VIEW_OPTIONS: SegmentOption<ViewMode>[] = [
	{
		id: "cocina",
		label: "Comandas Cocina",
		icon: <LayoutGrid className="w-4 h-4" />,
	},
	{
		id: "dueno",
		label: "Resumen Dueño",
		icon: <ClipboardList className="w-4 h-4" />,
	},
];

const STATUS_TABS: SegmentOption<StatusFilter>[] = [
	{ id: "activos", label: "Activos" },
	{ id: "nuevo", label: "Nuevos" },
	{ id: "en_cocina", label: "En cocina" },
	{ id: "listo", label: "Listos" },
	{ id: "entregado", label: "Entregados" },
	{ id: "todos", label: "Todos" },
];

export const CentralPedidosPage: React.FC<CentralPedidosPageProps> = ({
	orders,
	onUpdateStatus,
	onSimulateIncomingOrder,
}) => {
	const [viewMode, setViewMode] = useState<ViewMode>("cocina");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("activos");
	const [deliveryFilter, setDeliveryFilter] = useState<"todos" | DeliveryType>(
		"todos",
	);
	const [searchQuery, setSearchQuery] = useState("");

	const stats = useMemo(() => {
		const nuevos = orders.filter((o) => o.status === "nuevo").length;
		const enCocina = orders.filter((o) => o.status === "en_cocina").length;
		const listos = orders.filter((o) => o.status === "listo").length;
		const validOrders = orders.filter((o) => o.status !== "cancelado");
		const totalSales = validOrders.reduce((sum, o) => sum + o.total, 0);

		const byPayment = {
			efectivo: validOrders
				.filter((o) => o.customer.paymentMethod === "efectivo")
				.reduce((sum, o) => sum + o.total, 0),
			nequi: validOrders
				.filter((o) => o.customer.paymentMethod === "nequi")
				.reduce((sum, o) => sum + o.total, 0),
			daviplata: validOrders
				.filter((o) => o.customer.paymentMethod === "daviplata")
				.reduce((sum, o) => sum + o.total, 0),
		};

		const avgTicket =
			validOrders.length > 0 ? totalSales / validOrders.length : 0;

		return {
			nuevos,
			enCocina,
			listos,
			totalSales,
			byPayment,
			avgTicket,
			validCount: validOrders.length,
		};
	}, [orders]);

	const filteredOrders = useMemo(() => {
		return orders.filter((order) => {
			if (statusFilter === "activos") {
				if (order.status === "entregado" || order.status === "cancelado")
					return false;
			} else if (statusFilter !== "todos" && order.status !== statusFilter) {
				return false;
			}

			if (
				deliveryFilter !== "todos" &&
				order.customer.deliveryType !== deliveryFilter
			) {
				return false;
			}

			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const matches =
					order.orderNumber.toLowerCase().includes(q) ||
					order.customer.name.toLowerCase().includes(q) ||
					order.customer.phone.toLowerCase().includes(q) ||
					order.customer.neighborhood.toLowerCase().includes(q);
				if (!matches) return false;
			}

			return true;
		});
	}, [orders, statusFilter, deliveryFilter, searchQuery]);

	return (
		<div className="min-h-screen bg-[#F7F7F5] text-[#141417] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 mb-6 border-b border-neutral-200">
					<div>
						<p className="text-xs font-semibold uppercase tracking-wide text-[#D92525] mb-1">
							Operación en Tiempo Real · Tuluá
						</p>
						<h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0E0E10] tracking-tight">
							Central de Pedidos
						</h1>
						<p className="text-sm text-neutral-600 mt-1">
							Vista diseñada para que el dueño controle ventas y los cocineros
							preparen cada comanda sin revisar WhatsApp.
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<SegmentedControl<ViewMode>
							options={VIEW_OPTIONS}
							value={viewMode}
							onChange={(value) => setViewMode(value)}
							ariaLabel="Modo de visualización de pedidos"
						/>
						<Button variant="primary" onClick={onSimulateIncomingOrder}>
							<Plus className="w-4 h-4" />
							<span>Simular pedido nuevo</span>
						</Button>
					</div>
				</div>

				<KpiStrip
					nuevos={stats.nuevos}
					enCocina={stats.enCocina}
					listos={stats.listos}
					totalSales={stats.totalSales}
					validCount={stats.validCount}
				/>

				<div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
					<SegmentedControl<StatusFilter>
						options={STATUS_TABS}
						value={statusFilter}
						onChange={(value) => setStatusFilter(value)}
						ariaLabel="Filtrar por estado"
					/>

					<div className="flex flex-wrap items-center gap-2.5">
						<select
							value={deliveryFilter}
							onChange={(e) =>
								setDeliveryFilter(e.target.value as "todos" | DeliveryType)
							}
							aria-label="Filtrar por tipo de entrega"
							className="px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-medium text-neutral-700 focus:outline-none focus:border-[#0E0E10]"
						>
							<option value="todos">Domicilio y Recoger</option>
							<option value="domicilio">Solo Domicilio</option>
							<option value="recoger">Solo Recoger</option>
						</select>

						<div className="relative flex-1 sm:w-64">
							<Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Buscar #pedido, cliente o barrio..."
								className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10]"
							/>
						</div>
					</div>
				</div>

				{viewMode === "cocina" ? (
					filteredOrders.length === 0 ? (
						<EmptyState
							title="No hay pedidos en esta vista"
							description="Cambia el filtro de estado o simula un pedido entrante para probar el flujo de cocina."
							actionLabel="Mostrar todos los pedidos"
							onAction={() => setStatusFilter("todos")}
						/>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
							{filteredOrders.map((order) => (
								<OrderTicketCard
									key={order.id}
									order={order}
									onUpdateStatus={onUpdateStatus}
								/>
							))}
						</div>
					)
				) : (
					<OrdersTable
						orders={filteredOrders}
						byPayment={stats.byPayment}
						avgTicket={stats.avgTicket}
						onUpdateStatus={onUpdateStatus}
					/>
				)}
			</div>
		</div>
	);
};
