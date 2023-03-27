<script lang="ts">
	import { Chunker, rgbToHex } from "$lib"
	import { T, OrbitControls } from "@threlte/core"
	import { page } from "$app/stores"
	
	let props: {
		textures: { src: string }[]
		world(i: number, j: number, k: number): number
	} | undefined
	
	async function getWorldMap() {
		
		$page.params.id
	}
	
	// const map = new Map(data.XYZI.map((pos) => [[pos.x,pos.y, pos.z].join(), pos]))
	
	const world = (i: number, j: number, k: number) => {
		const coord = map.get([i,j,k].join())
		
		if (coord) {
			const { c } = coord
			return c
		}

		return 0
	}
	
	// const textures = data.RGBA.map(rgb => ({
	// 	src: `http://localhost:5173/api/texture/${rgbToHex(rgb.r, rgb.g, rgb.b)}-16x16.png`
	// }))
	
	// console.log({ textures })
</script>

<T.PerspectiveCamera makeDefault position={[256, 256, 256]} fov={24}>
	<OrbitControls target={{ y: 0 }} />
</T.PerspectiveCamera>

<T.DirectionalLight castShadow position={[3, 10, 10]} />
<T.DirectionalLight position={[-3, 10, -10]} intensity={0.2} />
<T.AmbientLight intensity={0.2} />

<!-- <Chunker {world} {textures} /> -->
