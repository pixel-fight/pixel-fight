<script lang="ts">
	import { Canvas, OrbitControls, T } from '@threlte/core'
	import { degToRad } from 'three/src/math/MathUtils'
	import Voxel from "$lib/components/Voxel.svelte"
	import type { PageData } from './$types';
	import type { VoxelData } from "parse-magica-voxel"
	
	
	export let data: VoxelData
	
	export const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
	  const hex = x.toString(16)
	  return hex.length === 1 ? '0' + hex : hex
	}).join('')
</script>

<T.Group scale={1}>
	{#each data.XYZI as {x, y, z, c}}
		{@const color = data.RGBA[c]}
		<Voxel position={{ x, y, z }} color={rgbToHex(color.r, color.g, color.b)} />
	{/each}
</T.Group>