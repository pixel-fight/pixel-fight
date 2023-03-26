import { get } from "svelte/store";
import { points, timeSinceLastFire } from "../stores/player";
import { blocks, type Block } from "../stores/world";

export type Weapon = {
    name: string;
    damage: number;
    cost: number;
    reward: number;
    fireRate: number;
    fullAuto: boolean;
};

export const weapons: { [key: string]: Weapon } = {
    Pickaxe: {
        name: "Pickaxe",
        damage: 1,
        cost: 0,
        reward: 1,
        fireRate: 0.05,
        fullAuto: true
    },
    Pistol: {
        name: "Pistol",
        damage: 5,
        cost: 1,
        reward: 0,
        fireRate: 0.5,
        fullAuto: false
    }
};

export function fireWeapon({ blockId, weapon }: { blockId: string; weapon: Weapon }) {
    // If weapon has a cost to firing and no points
    if (weapon.cost > 0 && get(points) === 0) return;

    blocks.update(blocks => {
        if (!blocks[blockId]) return blocks;

        blocks[blockId].health -= weapon.damage;

        // Block has been broken
        if (blocks[blockId].health <= 0) {
            delete blocks[blockId];

            let pointsUpdate = weapon.reward - weapon.cost;
            points.update(p => p + pointsUpdate);

            // Recalculate what the player is looking at
        }

        return blocks;
    });

    timeSinceLastFire.set(0);
}
