<script>
	import { AmbientLight, DirectionalLight, Mesh } from '@threlte/core'
	import { AutoColliders, CollisionGroups } from '@threlte/rapier'
	import { BoxGeometry, MeshStandardMaterial } from 'three'
	// import Door from './Door.svelte'
	import LocalPlayer from './LocalPlayer.svelte';
</script>

<DirectionalLight shadow position={{ y: 20, x: 8, z: -3 }} />
<AmbientLight intensity={1} />

<CollisionGroups groups={[0, 15]}>
	<AutoColliders shape={'cuboid'} position={{ y: -0.5 }}>
		<Mesh
			receiveShadow
			geometry={new BoxGeometry(100, 1, 100)}
			material={new MeshStandardMaterial()}
		/>
	</AutoColliders>
</CollisionGroups>

<CollisionGroups groups={[0]}>
	<LocalPlayer position={{ z: 2 }} />
	<!-- <Door /> -->

	<!-- WALLS -->
	<AutoColliders shape={'cuboid'}>
		<Mesh
			receiveShadow
			castShadow
			position={{ y: 1.275, x: 30 + 0.7 + 0.15 }}
			geometry={new BoxGeometry(60, 2.55, 0.15)}
			material={new MeshStandardMaterial({
				color: 0xff0000
			})}
		/>
		<Mesh
			receiveShadow
			castShadow
			position={{ y: 1.275, x: -30 - 0.7 - 0.15 }}
			geometry={new BoxGeometry(60, 2.55, 0.15)}
			material={new MeshStandardMaterial({
				transparent: true,
				opacity: 0.5,
				color: 0x333333
			})}
		/>
	</AutoColliders>
</CollisionGroups>