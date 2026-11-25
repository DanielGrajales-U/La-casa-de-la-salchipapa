import type React from "react";

export interface SegmentOption<T extends string> {
	id: T;
	label: string;
	icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
	options: readonly SegmentOption<T>[];
	value: T;
	onChange: (value: T) => void;
	surface?: "light" | "dark";
	fullWidth?: boolean;
	ariaLabel?: string;
}

export function SegmentedControl<T extends string>({
	options,
	value,
	onChange,
	surface = "light",
	fullWidth = false,
	ariaLabel,
}: SegmentedControlProps<T>) {
	const containerClass =
		surface === "dark"
			? "bg-[#17171B] border border-white/10"
			: "bg-neutral-100 border border-neutral-200/80";

	return (
		<div
			role="tablist"
			aria-label={ariaLabel}
			className={`${fullWidth ? "grid" : "inline-flex flex-wrap"} items-center gap-1 p-1 rounded-xl ${containerClass}`}
			style={
				fullWidth
					? { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }
					: undefined
			}
		>
			{options.map((option) => {
				const isActive = option.id === value;
				const activeClass =
					surface === "dark"
						? "bg-[#F5B800] text-[#0E0E10] font-semibold"
						: "bg-[#0E0E10] text-white font-semibold shadow-sm";
				const inactiveClass =
					surface === "dark"
						? "text-neutral-300 hover:text-white font-medium"
						: "text-neutral-600 hover:text-[#0E0E10] font-medium";

				return (
					<button
						key={option.id}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={() => onChange(option.id)}
						className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
							isActive ? activeClass : inactiveClass
						}`}
					>
						{option.icon}
						<span>{option.label}</span>
					</button>
				);
			})}
		</div>
	);
}
