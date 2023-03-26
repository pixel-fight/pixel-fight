<script lang="ts">
    import { useFrame, useParent, useThrelte } from "@threlte/core";
    import { Camera, Raycaster, Vector3 } from "three";
    import type { LookingAt } from "../common/local/LocalPlayer.svelte";

    export let lookingAt: LookingAt = undefined;

    const raycaster = new Raycaster();
    const pointer = new Vector3();

    const camera = useParent();
    const { scene } = useThrelte();

    useFrame(() => {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;

        pointer.x = (x / window.innerWidth) * 2 - 1;
        pointer.y = -(y / window.innerHeight) * 2 + 1;
        pointer.z = 0.5;

        raycaster.setFromCamera(pointer, $camera as Camera);
        const intersects = raycaster.intersectObjects(scene.children);

        const intersect = intersects[0];

        // If currently looking at a block in the world, store it
        if (intersect?.object.userData.blockId !== undefined) {
            lookingAt = {
                blockId: intersect.object.userData.blockId,
                distance: intersect.distance
            };
        } else {
            lookingAt = undefined;
        }
    });
</script>
