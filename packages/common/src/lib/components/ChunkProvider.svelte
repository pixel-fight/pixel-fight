<script lang="ts" context="module">
	import { type InjectionKey, getContext, setContext } from 'optional-default-site-kit';
	import { ChunkManager, TextureManager } from '$lib/voxels';

	export class ChunkProvider {
		chunkManager: ChunkManager;
		textureManager: TextureManager;

		constructor({
			world,
			textureManager
		}: {
			world: (i: number, j: number, k: number) => number;
			textureManager: TextureManager;
		}) {
			this.textureManager = textureManager;

			this.chunkManager = new ChunkManager({
				chunkDistance: 1,
				blockSize: 1,
				mesher: new CulledMesher(),
				chunkSize: 128,
				generateVoxelChunk: (low, high) => generateChunkInfoFromFunction(low, high, world),
				textureManager
			});
		}

		setBlock(pos: THREE.Vector3, value: number) {
			pos.floor();
			this.chunkManager.setVoxelAtCoordinates(pos, value);
		}

		createBlock(pos: THREE.Vector3, value: number) {
			this.setBlock(pos, value);
		}

		removeBlock(pos: THREE.Vector3) {
			this.setBlock(pos, 0);
		}
	}

	export const chunkerContextKey: InjectionKey<ChunkProvider> = 'chunker';

	export function useChunker(): ChunkProvider {
		const context = getContext(chunkerContextKey);
		if (!context) throw new Error('Invalid Chunker context');
		return context;
	}
</script>

<script lang="ts">
	import { AutoColliders, RigidBody } from '@threlte/rapier';

	import { CulledMesher, generateChunkInfoFromFunction } from '$lib';

	import Chunk from './Chunk.svelte';
	import { useTextureProvider } from './TextureProvider.svelte';
	import { Vector3 } from 'three';

	export let world: (i: number, j: number, k: number) => number;

	const { textureManager } = useTextureProvider();

	// Initialize a new Chunk Manager
	const chunkProvider = new ChunkProvider({ world, textureManager });
	setContext(chunkerContextKey, chunkProvider);

	const { chunkManager } = chunkProvider;
	chunkManager.rebuildAllMeshes();
	chunkManager.requestMissingChunks(new Vector3(0, 0, 0));
</script>

<!-- Render all chunks -->
{#each Object.entries(chunkProvider.chunkManager.chunks) as [id, chunk]}
	<Chunk {chunk} />
{/each}

<style>
	canvas {
		display: none;
	}
</style>
