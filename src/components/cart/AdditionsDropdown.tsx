import { ChevronDown } from "lucide-react";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import type { AdditionOption } from "../../types/order";
import { formatCOP } from "../../utils/formatters";

interface AdditionsDropdownProps {
	additions: AdditionOption[];
	selectedAdditions: AdditionOption[];
	onChange: (nextAdditions: AdditionOption[]) => void;
}

export const AdditionsDropdown: React.FC<AdditionsDropdownProps> = ({
	additions,
	selectedAdditions,
	onChange,
}) => {
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleClose = useCallback(() => setOpen(false), []);
	useClickOutside(containerRef, open, handleClose);

	const toggleAddition = (option: AdditionOption) => {
		const exists = selectedAdditions.some((a) => a.id === option.id);
		const next = exists
			? selectedAdditions.filter((a) => a.id !== option.id)
			: [...selectedAdditions, option];
		onChange(next);
	};

	const additionsCost = selectedAdditions.reduce((acc, a) => acc + a.price, 0);

	const summary =
		selectedAdditions.length === 0
			? "Ninguna"
			: selectedAdditions
					.slice(0, 2)
					.map((a) => a.name)
					.join(", ") +
				(selectedAdditions.length > 2
					? ` +${selectedAdditions.length - 2}`
					: "");

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left text-xs sm:text-sm transition-colors cursor-pointer ${
					open
						? "border-[#0E0E10] bg-neutral-50 text-[#0E0E10]"
						: "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300"
				}`}
				aria-expanded={open}
			>
				<span className="truncate">
					<span className="text-neutral-500 font-normal">Adiciones: </span>
					<span className="font-medium">{summary}</span>
					{additionsCost > 0 && (
						<span className="font-mono text-xs text-[#D92525] ml-1 tabular-nums">
							(+{formatCOP(additionsCost)})
						</span>
					)}
				</span>
				<ChevronDown
					className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-150 ${
						open ? "rotate-180" : ""
					}`}
				/>
			</button>

			{open && (
				<div className="absolute left-0 right-0 sm:w-72 mt-1.5 z-30 bg-white border border-neutral-200 rounded-xl shadow-xl p-3">
					<div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
						<span className="text-xs font-semibold text-neutral-700">
							Agregar adiciones
						</span>
						{selectedAdditions.length > 0 && (
							<button
								type="button"
								onClick={() => onChange([])}
								className="text-xs text-neutral-500 hover:text-neutral-800 cursor-pointer"
							>
								Limpiar
							</button>
						)}
					</div>

					<div className="space-y-1 max-h-56 overflow-y-auto pr-1">
						{additions.map((option) => (
							<label
								key={option.id}
								className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer text-xs text-neutral-800 select-none"
							>
								<span className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={selectedAdditions.some((a) => a.id === option.id)}
										onChange={() => toggleAddition(option)}
										className="w-3.5 h-3.5 rounded accent-[#D92525]"
									/>
									<span className="font-medium">{option.name}</span>
								</span>
								<span className="font-mono text-neutral-600 tabular-nums">
									+{formatCOP(option.price)}
								</span>
							</label>
						))}
					</div>

					<div className="mt-2.5 pt-2 border-t border-neutral-100 flex justify-end">
						<button
							type="button"
							onClick={handleClose}
							className="text-xs font-semibold text-[#0E0E10] hover:underline cursor-pointer"
						>
							Listo
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
