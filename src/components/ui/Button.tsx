import type React from "react";

type ButtonVariant =
	| "primary"
	| "danger"
	| "dark"
	| "outline"
	| "outlineDark"
	| "success";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
	primary: "bg-[#F5B800] text-[#0E0E10] hover:bg-[#e5ad00]",
	danger: "bg-[#D92525] text-white hover:bg-[#b91c1c]",
	dark: "bg-[#0E0E10] text-white hover:bg-neutral-800",
	outline:
		"border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400",
	outlineDark:
		"border border-white/25 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20",
	success: "bg-emerald-600 text-white hover:bg-emerald-700",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
	sm: "px-3.5 py-2 text-xs rounded-lg",
	md: "px-5 py-2.5 text-sm rounded-xl",
	lg: "px-7 py-3.5 text-sm sm:text-base rounded-xl",
};

export const Button: React.FC<ButtonProps> = ({
	variant = "primary",
	size = "md",
	fullWidth = false,
	className = "",
	type = "button",
	children,
	...props
}) => {
	const isFlexible = fullWidth || className.includes("flex-1");

	return (
		<button
			type={type}
			className={`inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap disabled:opacity-45 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#F5B800] ${
				isFlexible ? "min-w-0" : "shrink-0"
			} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${
				fullWidth ? "w-full" : ""
			} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};
