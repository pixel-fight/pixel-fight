<script lang="ts" context="module">
	import { TextureManager } from '$lib/voxels';
	import { type InjectionKey, getContext, setContext } from 'optional-default-site-kit';
	import { onMount } from 'svelte';
	import type { Texture } from 'three';

	export class TextureProvider {
		textureManager: TextureManager;

		constructor() {
			this.textureManager = new TextureManager({
				canvas: document.createElement('canvas'),
				aoEnabled: true
			});
		}
	}

	export const textureProviderKey: InjectionKey<TextureProvider> = 'textureProvider';

	export function useTextureProvider(): TextureProvider {
		const context = getContext(textureProviderKey);
		if (!context) throw new Error('Invalid TextureProvider context');
		return context;
	}
</script>

<script lang="ts">
	export let textures: { src: string }[];

	let loaded = false;

	const textureProvider = new TextureProvider();
	setContext(textureProviderKey, textureProvider);

	// Load textures and mark as ready when ready
	onMount(async () => {
		await textureProvider.textureManager.loadTextures(textures);
		loaded = true;
	});
</script>

{#if loaded}
	<slot />
{/if}
