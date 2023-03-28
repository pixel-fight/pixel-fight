<script lang="ts">
    import { T, OrbitControls, Group } from "@threlte/core";
    import type { Group as ThreeGroup } from "three";
    import { Chunker, Voxel } from "@pixel-fight/common";

    import { AmbientLight, DirectionalLight, Mesh } from "@threlte/core";
    import { AutoColliders, CollisionGroups, RigidBody } from "@threlte/rapier";
    import { BoxGeometry, Material, MeshStandardMaterial } from "three";
    import LocalPlayer from "./local/LocalPlayer.svelte";

    let group: ThreeGroup;

    // function to generate a flat world
    const flatland = (i: number, j: number, k: number) => {
        //the floor is brick, from depth 0 to -10
        if (j < 1 && j > -10) return 1;

        //move back 10
        k += 20;

        // draw a dome
        if (i * i + j * j + k * k < 80) {
            return 2;
        }

        //nothing else in the world
        return 0;
    };
</script>

<DirectionalLight shadow position={{ y: 3, x: 8, z: -3 }} />
<AmbientLight intensity={1} />

<CollisionGroups groups={[0]}>
    <LocalPlayer position={{ x: 0, y: 6, z: 0 }} />

    <RigidBody>
        <AutoColliders shape={"cuboid"}>
            <Group bind:group>
                {#if group}
                    <Chunker
                        world={flatland}
                        textures={[
                            {
                                src: "http://localhost:5174/textures/kenneynl/tiles/grass_top.png"
                            },
                            {
                                src: "http://localhost:5174/textures/kenneynl/tiles/dirt.png"
                            },
                            {
                                src: "http://localhost:5174/textures/kenneynl/tiles/lava.png"
                            },
                            {
                                src: "http://localhost:5174/textures/kenneynl/tiles/stone.png"
                            },
                            {
                                src: "http://localhost:5174/textures/kenneynl/tiles/sand.png"
                            },
                            {
                                src: "http://localhost:5174/textures/tnt.png"
                            },
                            {
                                src: "http://localhost:5174/textures/heart.png"
                            },
                            {
                                src: "http://localhost:5174/textures/tnt.png"
                            }
                        ]}
                        container={group}
                    >
                        {#each [...Array(5).keys()].map( _ => Math.floor(Math.random() * 6) ) as value, index}
                            <Voxel position={{ x: 0, y: index, z: 0 }} {value} />
                        {/each}
                    </Chunker>
                {/if}
            </Group>
        </AutoColliders>
    </RigidBody>
</CollisionGroups>
