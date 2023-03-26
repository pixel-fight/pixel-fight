<script lang="ts">
    import { AmbientLight, DirectionalLight, Mesh } from "@threlte/core";
    import { AutoColliders, CollisionGroups } from "@threlte/rapier";
    import { BoxGeometry, Material, MeshStandardMaterial } from "three";
    import LocalPlayer from "./local/LocalPlayer.svelte";

    import { get } from "svelte/store";

    import { blocks } from "../stores/world";
</script>

<DirectionalLight shadow position={{ y: 20, x: 8, z: -3 }} />
<AmbientLight intensity={1} />

<CollisionGroups groups={[0]}>
    <LocalPlayer position={{ x: 0, y: 3, z: 0 }} />

    <!-- WALLS -->
    <AutoColliders shape={"cuboid"}>
        {#each Object.entries($blocks) as [blockId, block] (blockId)}
            {#if get(block).visible}
                <Mesh
                    receiveShadow
                    castShadow
                    position={get(block).position}
                    geometry={new BoxGeometry(
                        get(block).geometry.width,
                        get(block).geometry.height,
                        get(block).geometry.depth
                    )}
                    material={new MeshStandardMaterial(get(block).material)}
                    interactive
                    userData={{ blockId }}
                />
            {/if}
        {/each}
    </AutoColliders>
</CollisionGroups>
