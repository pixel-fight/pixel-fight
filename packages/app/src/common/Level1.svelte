<script lang="ts">
    import { AmbientLight, DirectionalLight, Mesh } from "@threlte/core";
    import { AutoColliders, CollisionGroups } from "@threlte/rapier";
    import { BoxGeometry, Material, MeshStandardMaterial } from "three";
    import LocalPlayer from "./local/LocalPlayer.svelte";

    import { get } from "svelte/store";

    import { blocks } from "../stores/world";
</script>

<DirectionalLight shadow position={{ y: 3, x: 8, z: -3 }} />
<AmbientLight intensity={1} />

<CollisionGroups groups={[0]}>
    <LocalPlayer position={{ x: 0, y: 30, z: 0 }} />

    <!-- WALLS -->
    <AutoColliders shape={"cuboid"}>
        {#each Object.entries($blocks) as [blockId, block]}
            <Mesh
                receiveShadow
                castShadow
                position={block.position}
                geometry={new BoxGeometry(
                    block.geometry.width,
                    block.geometry.height,
                    block.geometry.depth
                )}
                material={new MeshStandardMaterial({
                    color: block.material.color,
                    opacity: block.health / 100,
                    transparent: true
                })}
                interactive
                userData={{ blockId }}
            />
        {/each}
    </AutoColliders>
</CollisionGroups>
