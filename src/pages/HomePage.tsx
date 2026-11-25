import { ArrowDown, UtensilsCrossed } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { Footer } from "../components/layout/Footer";
import { FeaturedDishCarousel } from "../components/menu/FeaturedDishCarousel";
import { MenuCard } from "../components/menu/MenuCard";
import { Button } from "../components/ui/Button";
import {
	SegmentedControl,
	type SegmentOption,
} from "../components/ui/SegmentedControl";
import { TornEdgeDivider } from "../components/ui/TornEdgeDivider";
import { MENU_ITEMS, RESTAURANT_INFO } from "../data/catalog";
import type { AppView, CategoryId, MenuItem } from "../types/order";

interface HomePageProps {
	onAddToCart: (item: MenuItem, goToCart?: boolean) => void;
	onNavigate: (view: AppView) => void;
}

type CategoryFilter = "todas" | CategoryId;

const CATEGORY_OPTIONS: SegmentOption<CategoryFilter>[] = [
	{ id: "todas", label: "Todo el Menú" },
	{ id: "salchipapas", label: "Salchipapas" },
	{ id: "hamburguesas", label: "Hamburguesas" },
	{ id: "perros", label: "Perros" },
	{ id: "gaseosas", label: "Gaseosas" },
];

export const HomePage: React.FC<HomePageProps> = ({
	onAddToCart,
	onNavigate,
}) => {
	const [selectedCategory, setSelectedCategory] =
		useState<CategoryFilter>("todas");

	const featuredItems = useMemo(
		() => MENU_ITEMS.filter((item) => item.featured),
		[],
	);

	const filteredItems = useMemo(
		() =>
			selectedCategory === "todas"
				? MENU_ITEMS
				: MENU_ITEMS.filter((item) => item.category === selectedCategory),
		[selectedCategory],
	);

	const scrollToMenu = () => {
		const el = document.getElementById("menu-de-hoy");
		if (el) el.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div className="min-h-screen bg-[#0E0E10] text-neutral-100">
			{/* HERO */}
			<section className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-24 pb-20">
				<img
					src="/src/assets/images/hero_salchipapa_feast_1795635656116.jpg"
					alt="Salchipapa, hamburguesa especial y perro caliente de La Casa de la Salchipapa"
					referrerPolicy="no-referrer"
					className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01]"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#0E0E10]"
				/>

				<div className="relative z-10 max-w-4xl mx-auto text-center">
					<p className="font-display italic text-2xl sm:text-3xl text-[#F5B800] tracking-normal mb-3">
						Auténtico sabor de Tuluá, Valle
					</p>
					<h1 className="font-display font-bold text-white text-4xl sm:text-6xl lg:text-7xl leading-[1.06] tracking-tight mb-6">
						La Casa de la <span className="text-[#F5B800]">Salchipapa</span>
					</h1>
					<p className="text-neutral-200 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
						Salchipapas generosas, perros especiales y hamburguesas al mejor
						precio del sector. Arma tu pedido con salsas y adiciones exactas sin
						esperar respuesta por WhatsApp.
					</p>

					<div className="flex flex-wrap items-center justify-center gap-4">
						<Button
							variant="primary"
							size="lg"
							onClick={scrollToMenu}
							className="shadow-xl shadow-black/30"
						>
							Ver el menú y pedir
						</Button>
						<Button
							variant="outlineDark"
							size="lg"
							onClick={() => onNavigate("carrito")}
						>
							Armar mi pedido
						</Button>
					</div>
				</div>

				<button
					type="button"
					onClick={scrollToMenu}
					className="relative z-10 mt-16 flex flex-col items-center gap-2 text-xs tracking-widest text-neutral-300 hover:text-[#F5B800] transition-colors cursor-pointer"
					aria-label="Desplazar hacia el menú"
				>
					<ArrowDown className="w-4 h-4" />
					<span>DESCUBRE EL MENÚ</span>
				</button>

				<TornEdgeDivider fillClass="text-white" />
			</section>

			{/* NUESTRA HISTORIA */}
			<section className="relative bg-white text-[#141417] py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-stretch">
						<div className="lg:col-span-5 flex flex-col justify-center">
							<span className="font-display italic text-3xl sm:text-4xl text-[#D92525] leading-none mb-2">
								Comienza con
							</span>
							<h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#0E0E10] mb-6">
								Nuestra Historia
							</h2>
							<p className="text-neutral-600 text-base leading-relaxed mb-5">
								En el corazón de Tuluá nos ganamos el cariño del barrio con una
								fórmula sencilla: porciones abundantes, ingredientes frescos,
								salsas de la casa y precios que se pueden disfrutar cualquier
								noche de la semana.
							</p>
							<p className="text-neutral-600 text-base leading-relaxed mb-8">
								Ahora pedir es todavía más rápido: eliges exactamente tus
								salsas, tus adiciones y si lo quieres a domicilio o para
								recoger, y tu comanda entra directo a nuestra cocina sin
								confusiones.
							</p>

							<div className="flex flex-wrap items-center gap-6">
								<Button
									variant="primary"
									onClick={scrollToMenu}
									className="rounded-lg"
								>
									Explorar carta
								</Button>
								<button
									type="button"
									onClick={() => onNavigate("central")}
									className="text-sm font-semibold text-[#D92525] hover:text-[#a81b1b] underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap"
								>
									Ver Central de Cocina
								</button>
							</div>
						</div>

						<div className="lg:col-span-7 flex flex-col gap-8">
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-neutral-200">
								<div>
									<p className="font-display font-bold text-base text-[#0E0E10] mb-1.5">
										01. Sabor generoso
									</p>
									<p className="text-sm text-neutral-600 leading-relaxed">
										Desde la Tradicional de $5.500 hasta la Yumbo familiar para
										3 personas.
									</p>
								</div>
								<div>
									<p className="font-display font-bold text-base text-[#0E0E10] mb-1.5">
										02. Pedido sin errores
									</p>
									<p className="text-sm text-neutral-600 leading-relaxed">
										Define tus salsas y adiciones en un clic, sin largos
										mensajes por chat.
									</p>
								</div>
								<div>
									<p className="font-display font-bold text-base text-[#0E0E10] mb-1.5">
										03. Directo a cocina
									</p>
									<p className="text-sm text-neutral-600 leading-relaxed">
										Tu orden llega organizada a nuestra pantalla para despachar
										más rápido.
									</p>
								</div>
							</div>

							<div className="relative overflow-hidden rounded-xl bg-neutral-100 aspect-[16/10]">
								<img
									src="/src/assets/images/story_fastfood_board_1795635657704.jpg"
									alt="Ingredientes frescos, papas crocantes, salchichas a la plancha, queso fundido y salsas"
									referrerPolicy="no-referrer"
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
					</div>
				</div>

				<TornEdgeDivider fillClass="text-[#0E0E10]" />
			</section>

			{/* MENÚ DE HOY */}
			<section
				id="menu-de-hoy"
				className="bg-[#0E0E10] text-neutral-100 py-20 sm:py-24 px-4 sm:px-6 lg:px-8"
			>
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-14">
						<p className="font-display italic text-2xl sm:text-3xl text-[#F5B800] mb-1">
							Especialidades de la casa
						</p>
						<h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
							Menú de Hoy
						</h2>
					</div>

					<FeaturedDishCarousel
						items={featuredItems}
						onOrderDish={(item) => onAddToCart(item, true)}
					/>

					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
						<div>
							<h3 className="font-display font-bold text-2xl text-white">
								Carta Completa
							</h3>
							<p className="text-sm text-neutral-400 mt-0.5">
								Precios reales del local · Personaliza salsas y adiciones en tu
								carrito
							</p>
						</div>

						<SegmentedControl<CategoryFilter>
							options={CATEGORY_OPTIONS}
							value={selectedCategory}
							onChange={(value) => setSelectedCategory(value)}
							surface="dark"
							ariaLabel="Categorías del menú"
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredItems.map((item) => (
							<MenuCard
								key={item.id}
								item={item}
								onAdd={(dish) => onAddToCart(dish, false)}
								onCustomize={(dish) => onAddToCart(dish, true)}
							/>
						))}
					</div>
				</div>
			</section>

			{/* BANNER CTA */}
			<section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-white/10">
				<img
					src="/src/assets/images/hero_salchipapa_feast_1795635656116.jpg"
					alt="Comida rápida preparada al instante en La Casa de la Salchipapa"
					referrerPolicy="no-referrer"
					className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-[#0E0E10]/70 to-[#0E0E10]/85"
				/>

				<div className="relative z-10 max-w-3xl mx-auto text-center">
					<p className="font-display italic text-2xl sm:text-3xl text-white mb-1">
						Más rápido que escribir por WhatsApp
					</p>
					<h2 className="font-display font-bold text-3xl sm:text-5xl text-[#F5B800] tracking-tight mb-5">
						Tu antojo en un solo paso
					</h2>
					<p className="text-neutral-200 text-base max-w-xl mx-auto leading-relaxed mb-8">
						Organiza tus salsas, elige tus adiciones y confirma tu dirección o
						recogida en tienda. Nuestro equipo recibe la comanda lista para
						preparar al instante.
					</p>

					<div className="flex flex-wrap items-center justify-center gap-4">
						<Button
							variant="primary"
							size="lg"
							onClick={() => onNavigate("carrito")}
						>
							Ir a organizar mi pedido
						</Button>
						<Button
							variant="outlineDark"
							size="lg"
							onClick={() => onNavigate("central")}
						>
							<UtensilsCrossed className="w-4 h-4" />
							<span>Abrir Central de Pedidos</span>
						</Button>
					</div>
				</div>
			</section>

			<Footer restaurant={RESTAURANT_INFO} onNavigate={onNavigate} />
		</div>
	);
};
