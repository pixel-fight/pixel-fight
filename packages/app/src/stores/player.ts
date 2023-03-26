import { writable } from "svelte/store";
import { weapons, type Weapon } from "../lib/weapons";

export const points = writable(10);
export const weapon: Weapon = weapons.Pistol;
