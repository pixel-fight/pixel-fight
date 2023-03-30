<script lang="ts">
	import type { Group as ThreeGroup } from 'three';

	import { AmbientLight, DirectionalLight, Mesh } from '@threlte/core';
	import { AutoColliders, CollisionGroups, RigidBody } from '@threlte/rapier';
	import LocalPlayer from '../../../../../packages/app/src/common/local/LocalPlayer.svelte';
	import Chunker from '$lib/components/ChunkProvider.svelte';
	import TextureProvider from '$lib/components/TextureProvider.svelte';

	let group: ThreeGroup;

	// function to generate a flat world
	const flatland = (i: number, j: number, k: number) => {
		//the floor is brick, from depth 0 to -10
		if (j < 1 && j > -10) return 1;

		//move back 10
		k += 20;

		// draw a dome
		if (i * i + j * j + k * k < 80) {
			return 2;
		}

		//nothing else in the world
		return 0;
	};
</script>

<TextureProvider
	textures={[
		{
			src: '/textures/kenneynl/tiles/grass_top.png'
		},
		{
			src: '/textures/kenneynl/tiles/dirt.png'
		},
		{
			src: '/textures/kenneynl/tiles/lava.png'
		},
		{
			src: '/textures/kenneynl/tiles/stone.png'
		},
		{
			src: '/textures/kenneynl/tiles/sand.png'
		},
		{
			src: '/textures/tnt.png'
		},
		{
			src: '/textures/heart.png'
		},
		{
			src: '/textures/tnt.png'
		}
	]}
>
	<DirectionalLight shadow position={{ y: 3, x: 8, z: -3 }} />
	<AmbientLight intensity={1} />

	<CollisionGroups groups={[0]}>
		<LocalPlayer position={{ x: 0, y: 6, z: 0 }} />

		<Chunker world={flatland} />
	</CollisionGroups>
</TextureProvider>
