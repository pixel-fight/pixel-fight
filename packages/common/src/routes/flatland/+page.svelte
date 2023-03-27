<script lang="ts">
	import { Chunker, Voxel } from "$lib"
	import { T, OrbitControls, Group } from "@threlte/core"
	import type { Group as ThreeGroup } from "three"
	
	let group: ThreeGroup
	
	// function to generate a flat world
	const flatland = (i: number, j: number, k: number) => {
		//the floor is brick, from depth 0 to -10
		if(j < 1 && j > -10) return 1
	
		//move back 10
		k+=20

		// draw a dome
		if((i*i + j*j + k*k) < 80) {
			return 2
		}

		//nothing else in the world
		return 0
	}
</script>

<T.PerspectiveCamera makeDefault position={[256, 256, 256]} fov={24}>
	<OrbitControls target={{ y: 0 }} />
</T.PerspectiveCamera>

<T.DirectionalLight castShadow position={[3, 10, 10]} />
<T.DirectionalLight position={[-3, 10, -10]} intensity={0.2} />
<T.AmbientLight intensity={0.2} />

<Group bind:group />
	
{#if group}
	<Chunker container={group} world={flatland} textures={[
			{
				src: '/textures/kenneynl/tiles/grass_top.png'
			},
			{
				src: '/textures/kenneynl/tiles/dirt.png'
			},
			{
				src: '/textures/kenneynl/tiles/lava.png',
			},
			{
				src: '/textures/kenneynl/tiles/stone.png',
			},
			{
				src: '/textures/kenneynl/tiles/sand.png',
			},
			{
				src: '/textures/tnt.png',
			},
			{
				src: '/textures/heart.png',
			},
			{
				src: '/textures/tnt.png',
			},
		]}>
		{#each [...Array(5).keys()].map(_ => Math.floor(Math.random() * 6)) as value, index}
			<Voxel position={{ x: 0, y: index, z: 0 }} {value} />
		{/each}
	</Chunker>
{/if}

