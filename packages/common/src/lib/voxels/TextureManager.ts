import { NearestFilter, ShaderMaterial, Texture, type Material, type IUniform } from 'three';

/*

* get what I have working w/o the atlas function
* switch to 17 x 17 to address lines
* manually create mip-maps as additional smaller textures

* check out sample3D texture polyfill

*/

type UV = [[number, number], [number, number], [number, number], [number, number]];

type PackedImage = {
	index: number;
	image: HTMLImageElement;
	x: number;
	y: number;
	w: number;
	h: number;
};

type Uniforms = {
	uTime: IUniform<number>;
	textureSamp: IUniform<Texture>;
	texturesEnabled: IUniform<Boolean>;
};

export interface TextureInfo {
	src: string;
}

export class TextureManager {
	canvas: HTMLCanvasElement;
	aoEnabled: boolean;
	texturesEnabled: boolean;
	texture: Texture;
	texturePath: string;
	tiles: PackedImage[];
	animated: Record<string, unknown>;
	material: Material;

	constructor(opts: { canvas: HTMLCanvasElement, aoEnabled?: boolean }) {
		this.canvas = opts.canvas
		this.canvas.setAttribute('id', 'texture');
		this.aoEnabled = opts.aoEnabled ?? false;
		this.canvas.width = 128;
		this.canvas.height = 128;
		this.canvas.style.width = '512px';
		this.canvas.style.height = '512px';
		this.tiles = [];
		this.animated = {};
		const ctx = this.canvas.getContext('2d')!;

		this.texturesEnabled = true;
		ctx.fillStyle = 'red';
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.texture = new Texture(this.canvas);
		this.texture.needsUpdate = true;
		this.texture.magFilter = NearestFilter;
		this.texture.minFilter = NearestFilter;
		this.texturePath = './textures/';
		this.material = new ShaderMaterial({
			uniforms: {
				uTime: { value: 0.0 },
				textureSamp: { value: this.texture },
				texturesEnabled: { value: this.texturesEnabled }
			} satisfies Uniforms,
			vertexColors: true,
			vertexShader: `
            attribute vec2 repeat;
            attribute vec4 subrect;
            attribute float frameCount;
            attribute float occlusion;
            varying vec2 vUv;
            varying vec2 vRepeat;
            varying vec4 vSubrect;
            varying float vFrameCount;
            varying float vOcclusion;
            void main() {
                vUv = uv;
                vSubrect = subrect;
                vRepeat = repeat;
                vFrameCount = frameCount;
                vOcclusion = occlusion;
                vec4 mvPosition = modelViewMatrix * vec4(position,1.0);
                gl_Position = projectionMatrix * mvPosition;
            } 
            `,
			fragmentShader: `
                uniform sampler2D textureSamp;
                uniform float uTime;
                uniform bool texturesEnabled;
                varying vec2 vUv;
                varying vec2 vRepeat;
                varying vec4 vSubrect;
                varying float vFrameCount;
                varying float vOcclusion;
                void main() {
                    vec2 fuv = vUv;
                    vec4 sr = vSubrect;
                    //sr.z = sub rect width
                    //sr.w = sub rect height
                    float frameCount = 3.0;
                    // float cframe = mod(uTime,frameCount);
                    float cframe = mod(uTime,vFrameCount);
                    float cframe2 = floor(cframe); 
                    sr.x = sr.x + cframe2*sr.z;
                    fuv.x = sr.x + fract(vUv.x*vRepeat.x)*sr.z;
                    fuv.y = sr.y + fract(vUv.y*vRepeat.y)*sr.w;
                    vec4 color = vec4(1.0,1.0,1.0,1.0);
                    
                    if(texturesEnabled) {
                        color = texture2D(textureSamp, fuv);
                    }
                    color = color*(vOcclusion);
                    gl_FragColor = vec4(color.xyz,1.0);
                }
            `
		});
	}

	packImage(img: HTMLImageElement, index: number) {
		const info: PackedImage = {
			index: index,
			image: img,
			x: 0,
			y: 0,
			w: 16,
			h: 16
		};
		info.x = ((info.index * 16) % 128) + info.index * 2 + 1;
		info.y = Math.floor(info.index / 8) * 16 + 1;
		const ctx = this.canvas.getContext('2d')!;
		ctx.imageSmoothingEnabled = false;
		//draw image center
		ctx.drawImage(img, info.x, info.y, info.w, info.h);
		//left edge
		ctx.drawImage(img, 0, 0, 1, info.h, info.x - 1, info.y, 1, info.h);
		//right edge
		ctx.drawImage(img, info.w - 1, 0, 1, info.h, info.x + info.w, info.y, 1, info.h);
		//top edge
		ctx.drawImage(img, 0, 0, info.w, 1, info.x, info.y - 1, info.w, 1);
		ctx.drawImage(img, 0, info.h - 1, info.w, 1, info.x, info.y + info.h, info.w, 1);

		ctx.fillStyle = 'yellow';
		// ctx.fillRect(info.x,info.y,info.w,info.h)
		this.texture.needsUpdate = true;
		return info;
	}

	isEnabled() {
		return true;
	}

	update(ttime: number) {
		const time = ttime / 1000;
		const { uniforms } = this.material as any & { uniforms: Uniforms };
		uniforms.uTime.value = time;
		uniforms.texturesEnabled.value = this.texturesEnabled;
	}

	lookupUVsForBlockType(typeNum: number): UV {
		const info = this.tiles[typeNum];
		if (!info) {
			const x = 0 / 8.0;
			const x2 = 1 / 8.0;
			const y = 0;
			const y2 = 1 / 8.0;
			return [
				[x, y],
				[x2, y],
				[x2, y2],
				[x, y2]
			];
		}

		const x = info.x / 128;
		const y = info.y / 128;
		const x2 = (info.x + info.w) / 128;
		const y2 = (info.y + info.h) / 128;
		return [
			[x, y],
			[x2, y],
			[x2, y2],
			[x, y2]
		];
	}

	lookupInfoForBlockType(_: number) {
		return {
			animated: false
		};
	}

	async loadTextures(
		infos: TextureInfo[]
	) {
		const packedImages: PackedImage[] = []

		for (const [index, { src }] of infos.entries()) {
			console.log('loading', src);

			const packedImage = await new Promise<PackedImage>((res, rej) => {
				const img = new Image();
				img.setAttribute("crossorigin", "anonymous")
				img.id = src;
				img.src = src;
				img.onload = () => {
					res(this.packImage(img, index));
					console.log('loaded', src);
				};
				img.onerror = (e) => {
					console.error(`Couldn't load texture from url ${src}`);
					rej(e);
				};
			});
			
			packedImages.push(packedImage)
		}

		this.tiles = packedImages
		this.texture.needsUpdate = true;
	}
}
