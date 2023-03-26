<script lang="ts">
    import { points } from "../../stores/player";
</script>

<div class="ui-wrapper">
    <div class="ui">
        <!-- Top left -->

        <!-- Top right -->

        <!-- Bottom left -->
        <div class="bl">Points: {$points}</div>

        <!-- Bottom right -->

        <!-- Absolute center -->
        <div class="center" />
    </div>
</div>

<style scoped>
    .ui-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;

        /* Don't capture mouse on UI */
        pointer-events: none;
    }

    .ui {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .ui .bl {
        position: absolute;
        bottom: 0;
        left: 0;
        margin: 1rem;
        font-size: 32px;
    }

    .ui .center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        width: 4px;
        aspect-ratio: 1;
        border: 1px solid #000;
    }
</style>
