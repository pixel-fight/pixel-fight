<script lang="ts">
	import { onMount } from "svelte"
	import { Group, Vector3 } from "three"
	import { ChunkManager, TextureManager, CulledMesher, generateChunkInfoFromFunction } from "$lib/voxels"
	import { useThrelte } from "@threlte/core"
	
	const ctx = useThrelte()

	let canvas: HTMLCanvasElement
	export let chunkManager: ChunkManager | undefined = undefined
	export let world: (i: number, j: number, k: number) => number

	// function to generate a flat world
	const flat = (i: number, j: number, k: number) => {
		//an gap in the floor made of air
		// if(j <1 && k < -5 && k > -10 ) return 0
		//the floor is brick, from depth 0 to -10
		if(j < 1 && j > -10) return 1
	
		//move back 10
		k+=20
		// a dome
		if((i*i + j*j + k*k) < 80) {
			return 2
		}
		//nothing else in the world
		return 0
	}

	onMount(() => {
		chunkManager = new ChunkManager({
			chunkDistance:1,
			blockSize:1,
			mesher: new CulledMesher(),
			chunkSize: 128,
			generateVoxelChunk: (low, high) => generateChunkInfoFromFunction(low, high, world ?? flat),
			container: new Group(),
			textureManager: new TextureManager({
				aoEnabled: true,
				canvas,
				names: [
					"red",
					"blue",
					"green"
				]
			}),
		});
		chunkManager.textureManager.loadTextures([
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
		]).then(() =>{
			chunkManager!.rebuildAllMeshes()
			chunkManager!.requestMissingChunks(new Vector3(0,0,0))
			ctx.scene.add(chunkManager!.container)
			console.log("added")
		})

		
		return () => {
			ctx.scene.remove(chunkManager!.container)
		}
	})

	function createBlock(pos: Vector3, name: string) {
		const type = chunkManager!.textureManager.getBlockTypeForName(name)
		setBlock(pos, type)
	}

	function removeBlock(pos: Vector3) {
		pos.floor()
		setBlock(pos, 0)
	}

	function setBlock(pos: Vector3, value: number) {
		pos.floor()
		chunkManager!.setVoxelAtCoordinates(pos, value)
	}
</script>

<canvas bind:this={canvas} />

<style>
	canvas {
		/* display: none; */
	}
</style>
