import {
	Check,
	Clock,
	Copy,
	MapPin,
	Phone,
	Store,
	XCircle,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { Order, OrderStatus } from "../../types/order";
import {
	buildWhatsAppOrderSummary,
	formatClockTime,
	formatCOP,
	formatTimeAgo,
	getCartItemLineTotal,
} from "../../utils/formatters";
import { Button } from "../ui/Button";
import { ORDER_STATUS_META } from "./orderStatusMeta";

interface OrderTicketCardProps {
	order: Order;
	onUpdateStatus: (orderId: string, nextStatus: OrderStatus) => void;
}

export const OrderTicketCard: React.FC<OrderTicketCardProps> = ({
	order,
	onUpdateStatus,
}) => {
	const [copied, setCopied] = useState(false);
	const meta = ORDER_STATUS_META[order.status];

	const handleCopy = () => {
		navigator.clipboard?.writeText(buildWhatsAppOrderSummary(order));
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1800);
	};

	const actionVariant =
		order.status === "nuevo"
			? "danger"
			: order.status === "en_cocina"
				? "primary"
				: "dark";

	return (
		<article className="flex flex-col bg-white border border-neutral-200 rounded-xl overflow-hidden">
			<div className="px-5 py-4 border-b border-neutral-200 flex items-start justify-between gap-3">
				<div>
					<div className="flex items-center gap-2">
						<span className="font-mono text-base font-bold text-[#0E0E10] tabular-nums">
							{order.orderNumber}
						</span>
						<span aria-hidden="true" className="text-neutral-300">
							·
						</span>
						<span className={`text-xs font-semibold ${meta.textClass}`}>
							{meta.label}
						</span>
					</div>
					<div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
						<Clock className="w-3.5 h-3.5 shrink-0" />
						<span className="tabular-nums">
							{formatClockTime(order.createdAt)}
						</span>
						<span aria-hidden="true">·</span>
						<span>{formatTimeAgo(order.createdAt)}</span>
					</div>
				</div>

				<div className="text-right shrink-0">
					<span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-800">
						{order.customer.deliveryType === "domicilio" ? (
							<>
								<MapPin className="w-3.5 h-3.5 text-[#D92525]" />
								<span>Domicilio</span>
							</>
						) : (
							<>
								<Store className="w-3.5 h-3.5 text-[#0E0E10]" />
								<span>Recoger</span>
							</>
						)}
					</span>
					<p className="font-mono text-sm font-bold text-[#0E0E10] tabular-nums mt-0.5">
						{formatCOP(order.total)}
					</p>
				</div>
			</div>

			<div className="px-5 py-3.5 bg-neutral-50 border-b border-neutral-200 text-xs space-y-1">
				<div className="flex items-center justify-between gap-2">
					<span className="font-semibold text-neutral-900 text-sm">
						{order.customer.name}
					</span>
					<span className="font-mono text-neutral-600 flex items-center gap-1">
						<Phone className="w-3 h-3" />
						{order.customer.phone}
					</span>
				</div>

				{order.customer.deliveryType === "domicilio" ? (
					<p className="text-neutral-700">
						{order.customer.address}
						{order.customer.neighborhood && ` · ${order.customer.neighborhood}`}
					</p>
				) : (
					<p className="text-neutral-600">
						El cliente pasa a recoger en el local.
					</p>
				)}

				{order.customer.reference && (
					<p className="text-neutral-500">Ref: {order.customer.reference}</p>
				)}

				<p className="text-neutral-700 pt-1">
					Pago:{" "}
					<span className="font-semibold uppercase">
						{order.customer.paymentMethod}
					</span>
					{order.customer.paymentMethod === "efectivo" &&
						order.customer.cashPaidWith &&
						order.customer.cashPaidWith > order.total && (
							<span className="font-mono text-[#D92525] font-semibold ml-1.5 tabular-nums">
								(Paga {formatCOP(order.customer.cashPaidWith)} · Cambio{" "}
								{formatCOP(order.customer.cashPaidWith - order.total)})
							</span>
						)}
				</p>
			</div>

			<div className="flex-1 px-5 py-4 space-y-3.5">
				{order.items.map((item) => (
					<div
						key={item.cartItemId}
						className="pb-3 last:pb-0 border-b last:border-b-0 border-neutral-100"
					>
						<div className="flex items-baseline justify-between gap-2">
							<p className="text-sm font-bold text-[#0E0E10]">
								<span className="font-mono text-[#D92525] mr-1.5 tabular-nums">
									{item.quantity}x
								</span>
								{item.name}
							</p>
							<span className="font-mono text-xs text-neutral-500 tabular-nums shrink-0">
								{formatCOP(getCartItemLineTotal(item))}
							</span>
						</div>

						{item.supportsCustomization && (
							<div className="mt-1.5 pl-5 space-y-1 text-xs">
								<p className="text-neutral-700">
									<span className="text-neutral-500">Salsas: </span>
									<span className="font-medium">
										{item.selectedSauces.length > 0
											? item.selectedSauces.join(", ") +
												(item.saucesOnSide ? " — APARTE" : "")
											: "Sin salsas"}
									</span>
								</p>

								{item.selectedAdditions.length > 0 && (
									<p className="text-[#0E0E10] font-semibold">
										<span className="text-[#D92525]">Adiciones: </span>
										{item.selectedAdditions.map((a) => a.name).join(", ")}
									</p>
								)}
							</div>
						)}

						{item.note && (
							<p className="mt-1 pl-5 text-xs text-amber-800 font-medium">
								Nota: {item.note}
							</p>
						)}
					</div>
				))}
			</div>

			<div className="px-5 py-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center gap-2">
				{meta.nextStatus && meta.nextLabel ? (
					<Button
						variant={actionVariant}
						size="sm"
						onClick={() => onUpdateStatus(order.id, meta.nextStatus!)}
						className="flex-1 py-2.5"
					>
						{meta.nextLabel}
					</Button>
				) : (
					<span className="flex-1 text-xs font-medium text-neutral-500">
						{order.status === "entregado"
							? "Pedido completado"
							: "Pedido cancelado"}
					</span>
				)}

				<button
					type="button"
					onClick={handleCopy}
					className="p-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:border-[#0E0E10] hover:text-[#0E0E10] transition-colors cursor-pointer shrink-0"
					title="Copiar comanda"
					aria-label={`Copiar comanda ${order.orderNumber}`}
				>
					{copied ? (
						<Check className="w-4 h-4 text-emerald-600" />
					) : (
						<Copy className="w-4 h-4" />
					)}
				</button>

				{order.status !== "entregado" && order.status !== "cancelado" && (
					<button
						type="button"
						onClick={() => onUpdateStatus(order.id, "cancelado")}
						className="p-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-500 hover:border-red-300 hover:text-[#D92525] transition-colors cursor-pointer shrink-0"
						title="Cancelar pedido"
						aria-label={`Cancelar pedido ${order.orderNumber}`}
					>
						<XCircle className="w-4 h-4" />
					</button>
				)}
			</div>
		</article>
	);
};
