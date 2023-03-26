declare module 'parse-magica-voxel' {
	export interface VoxelData {
		'VOX ': any;
		SIZE: any;
		XYZI: {
			x: number;
			y: number;
			z: number;
			c: number;
		}[];
		nTRN: any;
		nGRP: any;
		nSHP: any;
		LAYR: any;
		RGBA: {
			r: number;
			g: number;
			b: number;
			a: number;
		}[];
		MATL: any;
		rOBJ: any;
		rCAM: any;
		NOTE: any;
	}

	export default (buffer: ArrayLike<number> | ArrayBufferLike) => VoxelData;
}
