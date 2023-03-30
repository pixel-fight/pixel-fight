<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
</script>

<Canvas>
	<World>
		<slot />
	</World>
</Canvas>
