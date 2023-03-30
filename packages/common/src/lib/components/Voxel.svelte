<script lang="ts">
	import type { Position } from '@threlte/core';
	import { useChunker } from './ChunkProvider.svelte';
	import { onMount } from 'svelte';
	import { Vector3 } from 'three';

	const { createBlock, removeBlock } = useChunker();

	export let position: Position;
	export let value: number;

	$: vector = new Vector3(position.x, position.y, position.z);

	onMount(() => {
		createBlock(vector, value);
		console.log(vector, value);
		return () => removeBlock(vector);
	});
</script>
