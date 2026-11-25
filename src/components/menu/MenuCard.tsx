import { Check, Plus, SlidersHorizontal } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { MenuItem } from "../../types/order";
import { formatCOP } from "../../utils/formatters";
import { Button } from "../ui/Button";

interface MenuCardProps {
	item: MenuItem;
	onAdd: (item: MenuItem) => void;
	onCustomize: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
	item,
	onAdd,
	onCustomize,
}) => {
	const [added, setAdded] = useState(false);

	const handleQuickAdd = () => {
		onAdd(item);
		setAdded(true);
		window.setTimeout(() => setAdded(false), 1200);
	};

	return (
		<article className="group flex flex-col bg-[#16161A] border border-white/10 rounded-xl overflow-hidden transition-transform duration-150 hover:-translate-y-0.5 hover:border-white/20">
			<div className="aspect-[4/3] w-full bg-black overflow-hidden">
				<img
					src={item.image}
					alt={item.name}
					referrerPolicy="no-referrer"
					className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
				/>
			</div>

			<div className="flex-1 flex flex-col p-5">
				<div className="flex items-center justify-between gap-2 text-xs text-neutral-400 mb-1.5">
					<span className="capitalize">{item.category}</span>
					{item.servings && (
						<>
							<span aria-hidden="true">·</span>
							<span className="ml-auto">{item.servings}</span>
						</>
					)}
				</div>

				<div className="flex items-baseline justify-between gap-3 mb-2">
					<h4 className="font-semibold text-base text-white leading-snug">
						{item.name}
					</h4>
					<span className="font-mono text-base font-semibold text-[#F5B800] tabular-nums shrink-0">
						{formatCOP(item.price)}
					</span>
				</div>

				<p className="text-sm text-neutral-400 leading-relaxed mb-5 flex-1">
					{item.description}
				</p>

				<div className="flex items-center gap-2.5 pt-4 border-t border-white/10">
					<Button
						variant={added ? "success" : "primary"}
						size="md"
						fullWidth={!item.supportsCustomization}
						onClick={handleQuickAdd}
						className={
							item.supportsCustomization ? "flex-1 rounded-lg" : "rounded-lg"
						}
					>
						{added ? (
							<>
								<Check className="w-4 h-4 shrink-0" />
								<span>Agregado</span>
							</>
						) : (
							<>
								<Plus className="w-4 h-4 shrink-0" />
								<span>Agregar</span>
							</>
						)}
					</Button>

					{item.supportsCustomization && (
						<button
							type="button"
							onClick={() => onCustomize(item)}
							className="p-2.5 rounded-lg border border-white/15 text-neutral-200 hover:text-white hover:border-[#F5B800] transition-colors cursor-pointer shrink-0"
							title="Agregar y elegir salsas o adiciones"
							aria-label={`Personalizar ${item.name}`}
						>
							<SlidersHorizontal className="w-4 h-4" />
						</button>
					)}
				</div>
			</div>
		</article>
	);
};
