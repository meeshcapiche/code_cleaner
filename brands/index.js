import { districtadministration } from "./districtadministration.js";
import { einfinder } from "./einfinder.js";
import { hrexecutive } from "./hrexecutive.js";
import { thinkadvisor } from "./thinkadvisor.js";
import { universitybusiness } from "./universitybusiness.js";

export const brands = [
  thinkadvisor,
  universitybusiness,
  districtadministration,
  hrexecutive,
  einfinder
];

export const brandPresets = Object.fromEntries(brands.map(brand => [brand.id, brand]));
