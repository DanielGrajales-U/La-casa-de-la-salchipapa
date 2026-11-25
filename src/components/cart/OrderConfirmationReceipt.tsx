import { Check, Copy, UtensilsCrossed } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { AppView, Order } from "../../types/order";
import {
	buildWhatsAppOrderSummary,
	formatCOP,
	getCartItemLineTotal,
} from "../../utils/formatters";
import { Button } from "../ui/Button";

interface OrderConfirmationReceiptProps {
	order: Order;
	onNavigate: (view: AppView) => void;
	onNewOrder: () => void;
}

export const OrderConfirmationReceipt: React.FC<
	OrderConfirmationReceiptProps
> = ({ order, onNavigate, onNewOrder }) => {
	const [copied, setCopied] = useState(false);

	const handleCopySummary = () => {
		navigator.clipboard?.writeText(buildWhatsAppOrderSummary(order));
		setCopied(true);
		window.setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="min-h-screen bg-[#F7F7F5] text-[#141417] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
			<div className="max-w-2xl mx-auto bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-sm">
				<div className="flex items-center justify-between gap-4 pb-6 border-b border-neutral-200">
					<div>
						<p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
							Pedido enviado a cocina
						</p>
						<h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0E0E10]">
							¡Gracias, {order.customer.name}!
						</h1>
					</div>
					<div className="text-right">
						<p className="text-xs text-neutral-500">Comanda</p>
						<p className="font-mono text-xl font-bold text-[#D92525] tabular-nums">
							{order.orderNumber}
						</p>
					</div>
				</div>

				<div className="py-6 space-y-3 border-b border-neutral-200 text-sm">
					<div className="flex justify-between gap-4">
						<span className="text-neutral-500">Modalidad</span>
						<span className="font-medium text-neutral-900">
							{order.customer.deliveryType === "domicilio"
								? `Domicilio · ${order.customer.address}${
										order.customer.neighborhood
											? `, ${order.customer.neighborhood}`
											: ""
									}`
								: "Recoger en local (La Casa de la Salchipapa)"}
						</span>
					</div>
					<div className="flex justify-between gap-4">
						<span className="text-neutral-500">Teléfono</span>
						<span className="font-mono text-neutral-900">
							{order.customer.phone}
						</span>
					</div>
					<div className="flex justify-between gap-4">
						<span className="text-neutral-500">Método de pago</span>
						<span className="font-medium text-neutral-900 capitalize">
							{order.customer.paymentMethod}
							{order.customer.cashPaidWith &&
								order.customer.cashPaidWith > order.total &&
								` (Paga con ${formatCOP(order.customer.cashPaidWith)})`}
						</span>
					</div>
				</div>

				<div className="py-6 border-b border-neutral-200">
					<h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-4">
						Resumen de productos
					</h2>
					<ul className="space-y-4">
						{order.items.map((item) => (
							<li
								key={item.cartItemId}
								className="flex justify-between gap-4 text-sm"
							>
								<div>
									<p className="font-semibold text-[#0E0E10]">
										{item.quantity}x {item.name}
									</p>
									{item.supportsCustomization && (
										<p className="text-xs text-neutral-600 mt-0.5">
											Salsas:{" "}
											{item.selectedSauces.length > 0
												? item.selectedSauces.join(", ") +
													(item.saucesOnSide ? " (aparte)" : "")
												: "Sin salsas"}
										</p>
									)}
									{item.selectedAdditions.length > 0 && (
										<p className="text-xs text-neutral-600">
											Adiciones:{" "}
											{item.selectedAdditions.map((a) => a.name).join(", ")}
										</p>
									)}
									{item.note && (
										<p className="text-xs text-neutral-500 italic">
											Nota: {item.note}
										</p>
									)}
								</div>
								<span className="font-mono font-semibold text-neutral-900 tabular-nums shrink-0">
									{formatCOP(getCartItemLineTotal(item))}
								</span>
							</li>
						))}
					</ul>
				</div>

				<div className="py-5 space-y-2 text-sm">
					<div className="flex justify-between text-neutral-600">
						<span>Subtotal</span>
						<span className="font-mono tabular-nums">
							{formatCOP(order.subtotal)}
						</span>
					</div>
					<div className="flex justify-between text-neutral-600">
						<span>Domicilio</span>
						<span className="font-mono tabular-nums">
							{order.deliveryFee === 0
								? "Gratis"
								: formatCOP(order.deliveryFee)}
						</span>
					</div>
					<div className="flex justify-between text-lg font-bold text-[#0E0E10] pt-2 border-t border-neutral-100">
						<span>Total a pagar</span>
						<span className="font-mono tabular-nums">
							{formatCOP(order.total)}
						</span>
					</div>
				</div>

				<div className="mt-6 flex flex-col sm:flex-row gap-3">
					<Button
						variant="dark"
						onClick={() => onNavigate("central")}
						className="flex-1 py-3"
					>
						<UtensilsCrossed className="w-4 h-4 text-[#F5B800]" />
						<span>Ver este pedido en Central de Cocina</span>
					</Button>
					<Button
						variant="outline"
						onClick={handleCopySummary}
						className="py-3"
					>
						{copied ? (
							<>
								<Check className="w-4 h-4 text-emerald-600" />
								<span>Resumen copiado</span>
							</>
						) : (
							<>
								<Copy className="w-4 h-4" />
								<span>Copiar para WhatsApp</span>
							</>
						)}
					</Button>
				</div>

				<div className="mt-4 text-center">
					<button
						type="button"
						onClick={onNewOrder}
						className="text-xs font-medium text-neutral-500 hover:text-[#0E0E10] underline underline-offset-4 cursor-pointer"
					>
						Volver al inicio y hacer otro pedido
					</button>
				</div>
			</div>
		</div>
	);
};
