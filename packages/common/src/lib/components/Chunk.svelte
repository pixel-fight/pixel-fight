<script lang="ts">
	import type { Chunk } from '../voxels/ChunkManager';

	import { Vector3 } from 'three';
	import { Mesh } from '@threlte/core';
	import { useTextureProvider } from './TextureProvider.svelte';
	import { CulledMesher, VoxelMesh } from '$lib/voxels';
	import { useChunker } from './ChunkProvider.svelte';
	import { AutoColliders, Collider, RigidBody } from '@threlte/rapier';
	import type { ThrelteRigidBody } from '@threlte/rapier/dist/types/types';

	export let chunk: Chunk;

	const { textureManager } = useTextureProvider();
	const { chunkManager } = useChunker();

	const mesher = new CulledMesher();
	const scale = new Vector3(1, 1, 1);

	// Create a new Voxel Mesh instance, wich calculates the geometry needed for the Chunk Mesh
	const voxelMesh = new VoxelMesh(chunk, mesher, scale, chunkManager);

	let colliders: any[] = [];
	let rigidBody: ThrelteRigidBody;

	$: console.log(colliders);
	$: console.log(rigidBody);
</script>

<RigidBody type="fixed" bind:rigidBody>
	<AutoColliders shape="convexHull" bind:colliders>
		<Mesh
			receiveShadow
			position={chunk.realPosition}
			geometry={voxelMesh.geometry}
			material={textureManager.material}
		/>
	</AutoColliders>
</RigidBody>
