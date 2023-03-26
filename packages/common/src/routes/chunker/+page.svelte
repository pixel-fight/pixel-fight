<script lang="ts">
	import { T, OrbitControls } from "@threlte/core"
	import type { PageData } from './$types';
	import { Chunker }from "$lib"
	
	export let data: PageData
	
	const map = new Map(data.XYZI.map(d => [[d.x, d.y, d.z].join("|"), d]))
	console.log({ map })

</script>

<T.PerspectiveCamera makeDefault position={[256, 256, 256]} fov={24}>
	<OrbitControls target={{ y: 0 }} />
</T.PerspectiveCamera>

<T.DirectionalLight castShadow position={[3, 10, 10]} />
<T.DirectionalLight position={[-3, 10, -10]} intensity={0.2} />
<T.AmbientLight intensity={0.2} />

<Chunker textures={[
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
]} world={(i,j,k) => {
	return map.has([i,j,k].join("|")) 
		? 1
		: 0
}} />
