<script lang="ts">
	import { OrbitControls, T } from '@threlte/core'
	import Voxel from "$lib/components/Voxel.svelte"
	import type { PageData } from './$types';
	
	export const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
	  const hex = x.toString(16)
	  return hex.length === 1 ? '0' + hex : hex
	}).join('')
	
	export let data: PageData
	
</script>

<T.PerspectiveCamera makeDefault position={[256, 256, 256]}>
	<OrbitControls enableZoom={true} target={{ x:0, y: 0, z: 0 }} />
</T.PerspectiveCamera>

<T.DirectionalLight castShadow position={[3, 10, 10]} />
<T.DirectionalLight position={[-3, 10, -10]} intensity={0.2} />
<T.AmbientLight intensity={0.2} />

<!-- Cube -->
<T.Group scale={1}>
	{#each data.XYZI.slice(0, 4000) as {x, y, z, c}}
		{@const color = data.RGBA[c]}
		<Voxel position={{ x, y, z }} color={rgbToHex(color.r, color.g, color.b)} />
	{/each}
</T.Group>

<!-- Floor -->
<!-- <T.Mesh>
	<T.CircleGeometry args={[256, 30]} />
	<T.MeshStandardMaterial color="purple" />
</T.Mesh> -->