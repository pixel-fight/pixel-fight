<script lang="ts" context="module">
	import { type InjectionKey, getContext, setContext } from "optional-default-site-kit"
	import { ChunkManager } from "$lib/voxels"

	interface ChunkerContext {
		chunkManager: ChunkManager
		createBlock(pos: Vector3, value: number): void
		removeBlock(pos: Vector3): void
		setBlock(pos: Vector3, value: number): void
	}

	export const chunkerContextKey: InjectionKey<ChunkerContext> = "chunker"
	
	export function useChunker() {
		const context = getContext(chunkerContextKey)

		if (!context) throw new Error("Invalid Chunker context")

		return context
	}
</script>

<script lang="ts">
	import { onMount } from "svelte"
	import { Group, Vector3, Object3D } from "three"
	import { TextureManager, CulledMesher, generateChunkInfoFromFunction } from "$lib"
	import { useThrelte, Group as ThrelteGroup } from "@threlte/core"
	import type { TextureInfo } from "$lib"
	
	const ctx = useThrelte()

	export let world: (i: number, j: number, k: number) => number
	export let textures: TextureInfo[]
	export let container: Group

	let canvas: HTMLCanvasElement
	let chunkManager: ChunkManager

	function setBlock(pos: Vector3, value: number) {
		pos.floor()
		chunkManager!.setVoxelAtCoordinates(pos, value)
	}
	
	const context: ChunkerContext = {
		get chunkManager() {
			return chunkManager!
		},
		setBlock,
		createBlock(pos, value) {
			setBlock(pos, value)
		},
		removeBlock(pos) {
			setBlock(pos, 0)
		},
	}
	
	let loaded = false
	
	setContext(chunkerContextKey, context)

	onMount(() => {
		chunkManager = new ChunkManager({
			chunkDistance: 1,
			blockSize: 1,
			mesher: new CulledMesher(),
			chunkSize: 128,
			generateVoxelChunk: (low, high) => generateChunkInfoFromFunction(low, high, world),
			container,
			textureManager: new TextureManager({
				aoEnabled: true,
				canvas,
			}),
		});

		chunkManager.textureManager.loadTextures(textures).then(() =>{
			chunkManager!.rebuildAllMeshes()
			chunkManager!.requestMissingChunks(new Vector3(0,0,0))
			// ctx.scene.add(chunkManager!.container)
			console.log("Chunker.added")
			loaded = true
		})

		return () => ctx.scene.remove(chunkManager!.container)
	})
</script>

<canvas bind:this={canvas} />

{#if loaded}
	<slot />
{/if}

<style>
	canvas {
		display: none;
	}
</style>
