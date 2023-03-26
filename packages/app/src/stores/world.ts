import { writable, type Writable } from "svelte/store";
import type { ColorRepresentation } from "three";

export type Block = {
    health: number;
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

function makeid(length: number): string {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const b: { [key: string]: Block } = {};
for (let x = -8; x <= 8; x++) {
    for (let z = -8; z <= 8; z++) {
        b[makeid(16)] = {
            health: 5,
            position: {
                x,
                y: 0,
                z
            },
            geometry: {
                width: 1,
                height: 1,
                depth: 1
            },
            material: {
                color: 0x00ff00
            }
        };
    }
}

export const blocks: Writable<{ [key: string]: Block }> = writable(b);
