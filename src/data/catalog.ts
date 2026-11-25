import restaurantData from './restaurantData.json';
import { AdditionOption, MenuItem, RestaurantInfo, SauceOption } from '../types/order';

export const RESTAURANT_INFO = restaurantData.restaurant as RestaurantInfo;
export const MENU_ITEMS = restaurantData.menuItems as MenuItem[];
export const SAUCES = restaurantData.sauces as SauceOption[];
export const ADDITIONS = restaurantData.additions as AdditionOption[];
