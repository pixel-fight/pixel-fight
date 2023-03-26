<script lang="ts">
    import { Canvas } from "@threlte/core";
    import { World } from "@threlte/rapier";
    import { onMount } from "svelte";
    import Scene from "./common/Level1.svelte";
    import LocalGameUi from "./common/local/LocalGameUI.svelte";
</script>

<Canvas size={{ height: window.innerHeight, width: window.innerWidth }}>
    <World>
        <Scene />
    </World>
</Canvas>

<LocalGameUi />
