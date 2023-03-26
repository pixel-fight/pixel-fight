<script lang="ts">
	import { Three } from '@threlte/core'
	import type { Position } from '@threlte/core'
	import {
		BoxGeometry,
		MeshStandardMaterial,
		Mesh
	} from "three"

	export let color: string | undefined
	export let position: Position | undefined
</script>

<Three type={Mesh} position.x={position?.x} position.y={position?.y} position.z={position?.z}>
	<slot />
	<Three type={BoxGeometry} />
	<Three type={MeshStandardMaterial} {color} />
</Three>
