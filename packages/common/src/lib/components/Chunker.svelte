<script lang="ts" context="module">
	import { type InjectionKey, getContext, setContext } from 'optional-default-site-kit';
	import { ChunkManager } from '$lib/voxels';

	interface ChunkerContext {
		chunkManager: ChunkManager;
		createBlock(pos: THREE.Vector3, value: number): void;
		removeBlock(pos: THREE.Vector3): void;
		setBlock(pos: THREE.Vector3, value: number): void;
	}

	export const chunkerContextKey: InjectionKey<ChunkerContext> = 'chunker';

	export function useChunker() {
		const context = getContext(chunkerContextKey);

		if (!context) throw new Error('Invalid Chunker context');

		return context;
	}
</script>

<script lang="ts">
	import * as THREE from 'three';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
	import { TextureManager, CulledMesher, generateChunkInfoFromFunction } from '$lib';
	import { useThrelte } from '@threlte/core';
	import type { TextureInfo } from '$lib';
	import PfObject3D from './PFObject3D.svelte';

	const ctx = useThrelte();

	export let world: (i: number, j: number, k: number) => number;
	export let textures: TextureInfo[];

	let object: THREE.Object3D = new THREE.Object3D();

	let chunkManager: ChunkManager;

	function setBlock(pos: THREE.Vector3, value: number) {
		pos.floor();
		chunkManager!.setVoxelAtCoordinates(pos, value);
	}

	const context: ChunkerContext = {
		get chunkManager() {
			return chunkManager!;
		},
		setBlock,
		createBlock(pos, value) {
			setBlock(pos, value);
		},
		removeBlock(pos) {
			setBlock(pos, 0);
		}
	};

	let loaded = false;

	setContext(chunkerContextKey, context);

	chunkManager = new ChunkManager({
		chunkDistance: 1,
		blockSize: 1,
		mesher: new CulledMesher(),
		chunkSize: 128,
		generateVoxelChunk: (low, high) => generateChunkInfoFromFunction(low, high, world),
		container: object,
		textureManager: new TextureManager({
			aoEnabled: true,
			canvas: document.createElement('canvas')
		})
	});

	chunkManager.textureManager.loadTextures(textures).then(() => {
		chunkManager!.rebuildAllMeshes();
		chunkManager!.requestMissingChunks(new THREE.Vector3(0, 0, 0));
		// ctx.scene.add(chunkManager!.container)
		console.log('Chunker.added');
		loaded = true;
	});
</script>

{#if loaded}
	<RigidBody>
		<AutoColliders shape="convexHull">
			<PfObject3D bind:object>
				<slot />
			</PfObject3D>
		</AutoColliders>
	</RigidBody>
{/if}

<style>
	canvas {
		display: none;
	}
</style>
