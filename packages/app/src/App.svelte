<script lang="ts">
    import { Canvas } from "@threlte/core";
    import { World } from "@threlte/rapier";
    import { onMount } from "svelte";
    import Level2 from "./common/Level2.svelte";
    import LocalGameUi from "./common/local/LocalGameUI.svelte";
</script>

<Canvas size={{ height: window.innerHeight, width: window.innerWidth }}>
    <World>
        <Level2 />
    </World>
</Canvas>

<LocalGameUi />
