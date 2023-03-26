import { writable } from "svelte/store";
import { weapons } from "../lib/weapons";

export const points = writable(10);
export const weapon = writable(weapons.Pickaxe);
export const isFiring = writable(false);
export const timeSinceLastFire = writable(0);
