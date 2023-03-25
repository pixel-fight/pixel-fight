<script lang="ts">
	import { Canvas } from '@threlte/core'
	import { World } from '@threlte/rapier'
	import Scene from './common/Level1.svelte'
</script>

<Canvas>
	<World>
		<Scene />
	</World>
</Canvas>