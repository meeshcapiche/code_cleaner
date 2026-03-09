import { einfinder } from "./einfinder.js";
import { thinkadvisor } from "./thinkadvisor.js";

export const brands = [
  thinkadvisor,
  einfinder
];

export const brandPresets = Object.fromEntries(brands.map(brand => [brand.id, brand]));
