import { get } from "svelte/store";
import type { LookingAt } from "../common/local/LocalPlayer.svelte";
import { points, timeSinceLastFire } from "../stores/player";
import { blocks, type Block } from "../stores/world";

export type Weapon = {
    name: string;
    damage: number;
    cost: number;
    reward: number;
    fireRate: number;
    fullAuto: boolean;
    dropOffDistance: {
        end: number;
    };
};

export const weapons: Record<"Pickaxe" | "Pistol", Weapon> = {
    Pickaxe: {
        name: "Pickaxe",
        damage: 1,
        cost: 0,
        reward: 1,
        fireRate: 0.05,
        fullAuto: true,
        dropOffDistance: {
            end: 5
        }
    },
    Pistol: {
        name: "Pistol",
        damage: 5,
        cost: 1,
        reward: 0,
        fireRate: 0.5,
        fullAuto: false,
        dropOffDistance: {
            end: 30
        }
    }
};

export function attemptToFireWeapon({
    lookingAt,
    weapon
}: {
    lookingAt: LookingAt;
    weapon: Weapon;
}) {
    // If weapon has a cost to firing and no points
    if (weapon.cost > 0 && get(points) === 0) return;

    points.update(p => p - weapon.cost);
    timeSinceLastFire.set(0);

    // Only continue with block hit detection if hitting something
    if (!lookingAt || lookingAt.distance > weapon.dropOffDistance.end) return;

    blocks.update(blocks => {
        const { blockId } = lookingAt;

        if (!blocks[blockId]) return blocks;

        blocks[blockId].health -= weapon.damage;

        // Block has been broken
        if (blocks[blockId].health <= 0) {
            delete blocks[blockId];
            points.update(p => p + weapon.reward);

            // TODO Recalculate what the player is looking at
        }

        return blocks;
    });
}
