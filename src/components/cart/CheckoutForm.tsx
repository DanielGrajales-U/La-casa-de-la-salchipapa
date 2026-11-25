import { ArrowRight, MapPin, Store } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type {
	CustomerInfo,
	DeliveryType,
	PaymentMethod,
} from "../../types/order";
import { formatCOP } from "../../utils/formatters";
import { Button } from "../ui/Button";
import { SegmentedControl } from "../ui/SegmentedControl";

interface CheckoutFormProps {
	subtotal: number;
	hasItems: boolean;
	deliveryFeeConfig: number;
	freeDeliveryThreshold: number;
	onSubmit: (customer: CustomerInfo) => void;
}

const DELIVERY_OPTIONS: {
	id: DeliveryType;
	label: string;
	icon: React.ReactNode;
}[] = [
	{
		id: "domicilio",
		label: "Domicilio",
		icon: <MapPin className="w-4 h-4 shrink-0" />,
	},
	{
		id: "recoger",
		label: "Recoger",
		icon: <Store className="w-4 h-4 shrink-0" />,
	},
];

const PAYMENT_METHODS: PaymentMethod[] = ["efectivo", "nequi", "daviplata"];

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
	subtotal,
	hasItems,
	deliveryFeeConfig,
	freeDeliveryThreshold,
	onSubmit,
}) => {
	const [deliveryType, setDeliveryType] = useState<DeliveryType>("domicilio");
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [neighborhood, setNeighborhood] = useState("");
	const [reference, setReference] = useState("");
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo");
	const [cashPaidWith, setCashPaidWith] = useState("");
	const [error, setError] = useState<string | null>(null);

	const qualifiesFreeDelivery = subtotal >= freeDeliveryThreshold;
	const deliveryFee =
		!hasItems || deliveryType === "recoger" || qualifiesFreeDelivery
			? 0
			: deliveryFeeConfig;
	const total = subtotal + deliveryFee;

	const parsedCash = Number(cashPaidWith.replace(/\D/g, "")) || 0;
	const changeDue = parsedCash > total ? parsedCash - total : 0;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!hasItems) {
			setError("Agrega al menos un producto antes de confirmar tu pedido.");
			return;
		}
		if (!name.trim()) {
			setError("Ingresa el nombre de quien recibe el pedido.");
			return;
		}
		if (!phone.trim() || phone.replace(/\D/g, "").length < 7) {
			setError("Ingresa un número de teléfono o WhatsApp válido.");
			return;
		}
		if (deliveryType === "domicilio" && !address.trim()) {
			setError("Ingresa la dirección de entrega en Tuluá.");
			return;
		}

		onSubmit({
			name: name.trim(),
			phone: phone.trim(),
			deliveryType,
			address: deliveryType === "domicilio" ? address.trim() : "",
			neighborhood: deliveryType === "domicilio" ? neighborhood.trim() : "",
			reference: reference.trim(),
			paymentMethod,
			cashPaidWith:
				paymentMethod === "efectivo" && parsedCash > 0 ? parsedCash : undefined,
		});
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="lg:sticky lg:top-24 bg-white border border-neutral-200 rounded-2xl p-6 space-y-5"
		>
			<div className="pb-4 border-b border-neutral-100">
				<h2 className="font-display font-bold text-xl text-[#0E0E10]">
					Datos de entrega y pago
				</h2>
				<p className="text-xs text-neutral-500 mt-0.5">
					Sin registro · Tu pedido entra directo a la cocina
				</p>
			</div>

			<SegmentedControl<DeliveryType>
				options={DELIVERY_OPTIONS}
				value={deliveryType}
				onChange={(value) => setDeliveryType(value)}
				fullWidth
				ariaLabel="Modalidad de entrega"
			/>

			<div className="space-y-3.5">
				<div>
					<label className="block text-xs font-semibold text-neutral-700 mb-1">
						Nombre de quien recibe *
					</label>
					<input
						type="text"
						required
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Ej: Daniela Gómez"
						className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10]"
					/>
				</div>

				<div>
					<label className="block text-xs font-semibold text-neutral-700 mb-1">
						Teléfono / WhatsApp *
					</label>
					<input
						type="tel"
						required
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						placeholder="Ej: 315 842 9104"
						className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm font-mono text-neutral-900 placeholder:font-sans placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10]"
					/>
				</div>

				{deliveryType === "domicilio" && (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-semibold text-neutral-700 mb-1">
									Dirección *
								</label>
								<input
									type="text"
									required
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									placeholder="Ej: Calle 26 # 31-14"
									className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10]"
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-neutral-700 mb-1">
									Barrio (Tuluá)
								</label>
								<input
									type="text"
									value={neighborhood}
									onChange={(e) => setNeighborhood(e.target.value)}
									placeholder="Ej: Sajonia, Victoria..."
									className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10]"
								/>
							</div>
						</div>

						<div>
							<label className="block text-xs font-semibold text-neutral-700 mb-1">
								Referencia (opcional)
							</label>
							<input
								type="text"
								value={reference}
								onChange={(e) => setReference(e.target.value)}
								placeholder="Casa reja blanca, apartamento 201..."
								className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10]"
							/>
						</div>
					</>
				)}

				<div>
					<label className="block text-xs font-semibold text-neutral-700 mb-1.5">
						Forma de pago
					</label>
					<div className="grid grid-cols-3 gap-2">
						{PAYMENT_METHODS.map((method) => (
							<button
								key={method}
								type="button"
								onClick={() => setPaymentMethod(method)}
								className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-colors cursor-pointer ${
									paymentMethod === method
										? "border-[#0E0E10] bg-[#0E0E10] text-white"
										: "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
								}`}
							>
								{method}
							</button>
						))}
					</div>
				</div>

				{paymentMethod === "efectivo" && (
					<div>
						<label className="block text-xs font-semibold text-neutral-700 mb-1">
							¿Con cuánto pagas? (para llevar vueltas exactas)
						</label>
						<input
							type="text"
							inputMode="numeric"
							value={cashPaidWith}
							onChange={(e) => setCashPaidWith(e.target.value)}
							placeholder="Ej: 50000"
							className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm font-mono text-neutral-900 placeholder:font-sans placeholder:text-neutral-400 focus:outline-none focus:border-[#0E0E10]"
						/>
						{changeDue > 0 && (
							<p className="text-xs text-emerald-700 font-medium mt-1 font-mono tabular-nums">
								El domiciliario llevará {formatCOP(changeDue)} de cambio.
							</p>
						)}
					</div>
				)}
			</div>

			<div className="pt-4 border-t border-neutral-200 space-y-2 text-sm">
				<div className="flex justify-between text-neutral-600">
					<span>Subtotal</span>
					<span className="font-mono tabular-nums">{formatCOP(subtotal)}</span>
				</div>
				<div className="flex justify-between text-neutral-600">
					<span>
						Domicilio{" "}
						{deliveryType === "domicilio" &&
							!qualifiesFreeDelivery &&
							hasItems && (
								<span className="text-xs text-neutral-400">
									(Gratis desde {formatCOP(freeDeliveryThreshold)})
								</span>
							)}
					</span>
					<span className="font-mono tabular-nums">
						{deliveryFee === 0 ? "Gratis" : formatCOP(deliveryFee)}
					</span>
				</div>
				<div className="flex justify-between text-lg font-bold text-[#0E0E10] pt-2 border-t border-neutral-100">
					<span>Total</span>
					<span className="font-mono tabular-nums">{formatCOP(total)}</span>
				</div>
			</div>

			{error && (
				<p className="text-xs font-medium text-[#D92525] bg-red-50 border border-red-200 rounded-lg px-3 py-2">
					{error}
				</p>
			)}

			<Button
				type="submit"
				variant="primary"
				size="lg"
				fullWidth
				disabled={!hasItems}
			>
				<span>Confirmar pedido</span>
				<ArrowRight className="w-4 h-4" />
			</Button>
		</form>
	);
};
