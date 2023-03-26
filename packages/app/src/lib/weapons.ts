import { get } from "svelte/store";
import { points } from "../stores/player";
import { blocks, type Block } from "../stores/world";

export type Weapon = {
    name: string;
    damage: number;
    cost: number;
};

export const weapons = {
    Pickaxe: {
        name: "Pickaxe",
        damage: 20,
        cost: 0,
        reward: 1
    },
    Pistol: {
        name: "Pistol",
        damage: 35,
        cost: 1,
        reward: 0
    }
};

export function fireWeapon({ blockId, weapon }: { blockId: string; weapon: Weapon }) {
    // If weapon has a cost to firing and no points
    if (weapon.cost > 0 && get(points) === 0) return;

    blocks.update(blocks => {
        blocks[blockId].health -= weapon.damage;

        if (blocks[blockId].health <= 0) {
            delete blocks[blockId];
            points.update(p => p - weapon.cost);
        }

        return blocks;
    });
}
