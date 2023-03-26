import { writable, type Writable } from "svelte/store";
import type { ColorRepresentation } from "three";

export type Block = {
    position: {
        x: number;
        y: number;
        z: number;
    };
    geometry: {
        width: number;
        height: number;
        depth: number;
    };
    material: {
        color: ColorRepresentation;
    };
};

export const blocks: Writable<{ [key: string]: Block }> = writable({
    a: {
        position: {
            y: 1.275,
            x: 30 + 0.7 + 0.15,
            z: 0
        },
        geometry: {
            width: 60,
            height: 2.55,
            depth: 0.15
        },
        material: {
            color: 0xff0000
        }
    },
    b: {
        position: {
            y: 1.275,
            x: -(30 + 0.7 + 0.15),
            z: 0
        },
        geometry: {
            width: 60,
            height: 2.55,
            depth: 0.15
        },
        material: {
            color: 0xff0000
        }
    }
});
