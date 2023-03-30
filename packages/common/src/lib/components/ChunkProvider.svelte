<script lang="ts" context="module">
	import { type InjectionKey, getContext, setContext } from 'optional-default-site-kit';
	import { ChunkManager } from '$lib/voxels';

	export class ChunkProvider {
		declare chunkManager: ChunkManager;
		declare isReadyToMount: boolean;

		constructor({ world }: { world: (i: number, j: number, k: number) => number }) {
			this.isReadyToMount = false;

			this.chunkManager = new ChunkManager({
				chunkDistance: 1,
				blockSize: 1,
				mesher: new CulledMesher(),
				chunkSize: 128,
				generateVoxelChunk: (low, high) => generateChunkInfoFromFunction(low, high, world),
				textureManager: new TextureManager({
					aoEnabled: true,
					canvas: document.createElement('canvas')
				})
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

	import { TextureManager, CulledMesher, generateChunkInfoFromFunction } from '$lib';

	import Chunk from './Chunk.svelte';

	export let world: (i: number, j: number, k: number) => number;

	// Initialize a new Chunk Manager
	const chunkProvider = new ChunkProvider({ world });
	setContext(chunkerContextKey, chunkProvider);

	let colliders: any[];
	$: console.log(colliders);
</script>

<!-- Render all chunks -->
{#each [0] as chunk}
	<RigidBody>
		<AutoColliders shape="convexHull" bind:colliders>
			<Chunk bind:chunk />
		</AutoColliders>
	</RigidBody>
{/each}

<style>
	canvas {
		display: none;
	}
</style>
