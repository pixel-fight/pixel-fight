<script lang="ts">
    import { createEventDispatcher, onDestroy } from "svelte";
    import { Euler, Camera, Raycaster, Vector3, Mesh } from "three";
    import { useThrelte, useParent } from "@threlte/core";
    import type { LookingAt } from "../common/local/LocalPlayer.svelte";

    // Set to constrain the pitch of the camera
    // Range is 0 to Math.PI radians
    export let minPolarAngle = 0; // radians
    export let maxPolarAngle = Math.PI; // radians
    export let pointerSpeed = 1.0;

    export let lookingAt: LookingAt = undefined;

    const raycaster = new Raycaster();
    const pointer = new Vector3();

    let isLocked = false;

    const { renderer, invalidate, scene } = useThrelte();
    const domElement = renderer.domElement;
    const camera = useParent();
    const dispatch = createEventDispatcher();

    const _euler = new Euler(0, 0, 0, "YXZ");
    const _PI_2 = Math.PI / 2;

    if (!renderer) {
        throw new Error("Threlte Context missing: Is <PointerLockControls> a child of <Canvas>?");
    }
    if (!($camera instanceof Camera)) {
        throw new Error("Parent missing: <PointerLockControls> need to be a child of a <Camera>");
    }

    const onChange = () => {
        invalidate("PointerLockControls: change event");
        dispatch("change");
    };

    export const lock = () => domElement.requestPointerLock();
    export const unlock = () => document.exitPointerLock();

    domElement.addEventListener("mousemove", onMouseMove);
    domElement.ownerDocument.addEventListener("pointerlockchange", onPointerlockChange);
    domElement.ownerDocument.addEventListener("pointerlockerror", onPointerlockError);

    onDestroy(() => {
        domElement.removeEventListener("mousemove", onMouseMove);
        domElement.ownerDocument.removeEventListener("pointerlockchange", onPointerlockChange);
        domElement.ownerDocument.removeEventListener("pointerlockerror", onPointerlockError);
    });

    /**
     * @param {MouseEvent} event
     */
    function onMouseMove(event) {
        if (!isLocked) return;

        const { movementX, movementY } = event;

        _euler.setFromQuaternion($camera.quaternion);

        _euler.y -= movementX * 0.002 * pointerSpeed;
        _euler.x -= movementY * 0.002 * pointerSpeed;

        _euler.x = Math.max(_PI_2 - maxPolarAngle, Math.min(_PI_2 - minPolarAngle, _euler.x));

        $camera.quaternion.setFromEuler(_euler);

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

        onChange();
    }

    function onPointerlockChange() {
        if (document.pointerLockElement === domElement) {
            dispatch("lock");
            isLocked = true;
        } else {
            dispatch("unlock");
            isLocked = false;
        }
    }

    function onPointerlockError() {
        console.error("PointerLockControls: Unable to use Pointer Lock API");
    }
</script>
