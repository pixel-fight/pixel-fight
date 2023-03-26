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

<Chunker position={{ x: 0, y: 0, z: 0 }} world={(i,j,k) => 1}>
	
	{#each [1,2,3] as z}
		<Voxel position={{ x: 0, y: 0, z}} value={1} />
	{/each}
</Chunker>
