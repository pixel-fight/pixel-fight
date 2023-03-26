<script lang="ts">
    import { AmbientLight, DirectionalLight, Mesh } from "@threlte/core";
    import { AutoColliders, CollisionGroups } from "@threlte/rapier";
    import { BoxGeometry, Material, MeshStandardMaterial } from "three";
    import LocalPlayer from "./local/LocalPlayer.svelte";

    import { blocks } from "../stores/world";
</script>

<DirectionalLight shadow position={{ y: 20, x: 8, z: -3 }} />
<AmbientLight intensity={1} />
<CollisionGroups groups={[0, 15]}>
    <AutoColliders shape={"cuboid"} position={{ y: -0.5 }}>
        <Mesh
            receiveShadow
            geometry={new BoxGeometry(100, 1, 100)}
            material={new MeshStandardMaterial()}
        />
    </AutoColliders>
</CollisionGroups>

<CollisionGroups groups={[0]}>
    <LocalPlayer position={{ z: 2 }} />

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
                material={new MeshStandardMaterial(block.material)}
                interactive
                userData={{ blockId }}
            />
        {/each}
    </AutoColliders>
</CollisionGroups>
