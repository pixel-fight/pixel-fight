import { Vector3, type Vector3Tuple, type Mesh, type Object3D } from 'three';
import { CulledMesher } from './CulledMesher.js';
import { VoxelMesh } from './VoxelMesh.js';
import type { TextureManager } from './TextureManager';

export type ChunkEventHandler = (event: any) => void;
export type ChunkData = {
	dims: Vector3Tuple;
	voxels: Int32Array;
	high: number[];
	low: number[];
};

export class Chunk {
	data: ChunkData;
	dims: Vector3Tuple;
	voxels: Int32Array;
	vmesh: null | {
		data: unknown;
		geometry: unknown;
		meshed: unknown;
		surfaceMesh: unknown;
	};
	surfaceMesh: null | Mesh;
	realPosition: Vector3;
	chunkPosition: Vector3Tuple;
	id: string;
	chunkBits: number;

	constructor(data: ChunkData, pos: Vector3, chunkBits: number) {
		this.data = data;
		this.dims = data.dims;
		this.voxels = data.voxels;
		this.vmesh = null;
		this.surfaceMesh = null;
		this.realPosition = pos;
		this.chunkPosition = [pos.x, pos.y, pos.z];
		this.id = this.chunkPosition.join('|');
		this.chunkBits = chunkBits;
	}

	voxelIndexFromCoordinates(x: number, y: number, z: number) {
		const bits = this.chunkBits;
		const mask = (1 << bits) - 1;
		return (x & mask) + ((y & mask) << bits) + ((z & mask) << (bits * 2));
	}

	voxelAtCoordinates(pt: Vector3) {
		const vidx = this.voxelIndexFromCoordinates(pt.x, pt.y, pt.z);
		return this.voxels[vidx];
	}

	setVoxelAtCoordinates(pt: Vector3, val: number) {
		const vidx = this.voxelIndexFromCoordinates(pt.x, pt.y, pt.z);
		const v = this.voxels[vidx];
		this.voxels[vidx] = val;
		return v;
	}

	dispose() {
		if (this.vmesh) {
			delete this.vmesh.data;
			delete this.vmesh.geometry;
			delete this.vmesh.meshed;
			delete this.vmesh.surfaceMesh;
		}
	}
}

const SCALE = new Vector3(1.0, 1.0, 1.0);

export type VoxelChunkGenerator = (low: number[], high: number[], ps: Vector3) => ChunkData;
export class ChunkManager {
	listeners: Record<string, ChunkEventHandler[]>;
	distance: number;
	chunkSize: number;
	blockSize: number;
	generateVoxelChunk: VoxelChunkGenerator;
	chunks: Record<string, Chunk>;
	mesher: CulledMesher;
	textureManager: TextureManager;
	chunkBits: number;
	CHUNK_CACHE: Record<string, ChunkData>;

	constructor(opts: {
		chunkDistance: number;
		chunkSize: number;
		blockSize: number;
		mesher: CulledMesher;
		textureManager: TextureManager;
		generateVoxelChunk: VoxelChunkGenerator;
	}) {
		this.listeners = {};
		this.distance = opts.chunkDistance || 2;
		this.chunkSize = opts.chunkSize || 32;
		this.blockSize = opts.blockSize || 1;
		this.generateVoxelChunk = opts.generateVoxelChunk;
		this.chunks = {};
		this.mesher = opts.mesher || new CulledMesher();
		this.textureManager = opts.textureManager;

		// @ts-expect-error
		if (this.chunkSize & (this.chunkSize - 1 !== 0))
			throw new Error('chunkSize must be a power of 2');
		if (!this.textureManager) throw new Error('missing texture manager');

		//TODO: count the number of bits wide the chunksize is. seems like we could just use Math.log()
		//ex: if chunksize is 16 the bits is 4
		//I think bits is just used for efficient multiplication and division.
		let bits = 0;
		for (let size = this.chunkSize; size > 0; size >>= 1) bits++;
		this.chunkBits = bits - 1;
		this.CHUNK_CACHE = {};
	}

	on(type: string, cb: ChunkEventHandler) {
		if (!this.listeners[type]) this.listeners[type] = [];
		this.listeners[type].push(cb);
	}

	emit(type: string, evt: any) {
		if (!this.listeners[type]) this.listeners[type] = [];
		this.listeners[type].forEach((cb) => cb(evt));
	}

	clear() {
		Object.keys(this.chunks).forEach((key) => {
			const chunk = this.chunks[key];
			// TODO fix this
			// this.container.remove(chunk.surfaceMesh!);
			chunk.surfaceMesh!.geometry.dispose();
			this.CHUNK_CACHE[chunk.id] = chunk.data;
			chunk.dispose();
		});
		this.chunks = {};
	}

	// position in chunk indexes?
	nearbyChunks(position: Vector3, distance?: number) {
		const current = this.chunkAtPosition(position);
		const x = current[0];
		const y = current[1];
		const z = current[2];
		const dist = distance || this.distance;
		const nearby = [];
		for (let cx = x - dist; cx !== x + dist; ++cx) {
			for (let cy = y - dist; cy !== y + dist; ++cy) {
				for (let cz = z - dist; cz !== z + dist; ++cz) {
					nearby.push([cx, cy, cz]);
				}
			}
		}
		return nearby;
	}

	//get missing chunks. position is in world coords
	requestMissingChunks(pos: Vector3) {
		this.nearbyChunks(pos).map((chunkIndex) => {
			if (!this.chunks[chunkIndex.join('|')]) {
				this.rebuildMesh(
					this.generateChunk(new Vector3(chunkIndex[0], chunkIndex[1], chunkIndex[2]))
				);
			}
		});
	}

	getBounds(x: number, y: number, z: number) {
		const bits = this.chunkBits;
		const low = [x << bits, y << bits, z << bits];
		const high = [(x + 1) << bits, (y + 1) << bits, (z + 1) << bits];
		return [low, high] as [number[], number[]];
	}

	//make a chunk at the position in chunk coords
	generateChunk(pos: Vector3) {
		const [low, high] = this.getBounds(pos.x, pos.y, pos.z);
		const id = [pos.x, pos.y, pos.z].join('|');
		let chunkData: ChunkData;
		if (this.CHUNK_CACHE[id]) {
			chunkData = this.CHUNK_CACHE[id];
		} else {
			chunkData = this.generateVoxelChunk(low, high, pos);
		}
		const chunkObj = new Chunk(chunkData, pos, this.chunkBits);
		this.chunks[chunkObj.id] = chunkObj;
		return chunkObj;
	}

	makeChunkFromData(
		info: {
			high: number[];
			low: number[];
			position: Vector3Tuple;
			dims: Vector3Tuple;
		},
		voxels: Int32Array
	) {
		const pos = new Vector3(info.position[0], info.position[1], info.position[2]);
		const chunkData: ChunkData = {
			low: info.low,
			high: info.high,
			dims: info.dims,
			voxels
		};
		const chunk = new Chunk(chunkData, pos, this.chunkBits);
		this.chunks[chunk.id] = chunk;
		return chunk;
	}

	chunkIndexAtCoordinates(x: number, y: number, z: number) {
		const bits = this.chunkBits;
		const cx = x >> bits;
		const cy = y >> bits;
		const cz = z >> bits;
		return [cx, cy, cz];
	}

	//position in world coords
	chunkAtPosition(position: Vector3) {
		const pt = position.divideScalar(this.blockSize).floor();
		return this.chunkIndexAtCoordinates(pt.x, pt.y, pt.z);
	}

	voxelIndexFromCoordinates(x: number, y: number, z: number) {
		const bits = this.chunkBits;
		const mask = (1 << bits) - 1;
		return (x & mask) + ((y & mask) << bits) + ((z & mask) << (bits * 2));
	}

	//get voxel at point in world space
	voxelAtCoordinates(pt: Vector3) {
		const ckey = this.chunkIndexAtCoordinates(pt.x, pt.y, pt.z).join('|');
		const chunk = this.chunks[ckey];
		if (!chunk) return false;
		return chunk.voxelAtCoordinates(pt);
	}

	setVoxelAtCoordinates(pt: Vector3, val: number) {
		const ckey = this.chunkIndexAtCoordinates(pt.x, pt.y, pt.z).join('|');
		const chunk = this.chunks[ckey];
		if (!chunk) return false;
		const ret = chunk.setVoxelAtCoordinates(pt, val);
		this.rebuildMesh(chunk);
		return ret;
	}

	setBlockRange(pos: Vector3, dim: Vector3, data: number[]) {
		pos.floor();
		const ckey = this.chunkIndexAtCoordinates(pos.x, pos.y, pos.z).join('|');
		const chunk = this.chunks[ckey];
		const pt = pos.clone();
		if (chunk) {
			for (let y = 0; y < dim.y; y++) {
				for (let z = 0; z < dim.z; z++) {
					for (let x = 0; x < dim.x; x++) {
						const n = x + z * dim.x + y * dim.x * dim.z;
						const val = data[n];
						pt.x = pos.x + x;
						pt.y = pos.y + y;
						pt.z = pos.z + z;
						if (val !== -1) this.setVoxelAtCoordinates(pt, val);
					}
				}
			}
			this.rebuildMesh(chunk);
		}
	}

	//get voxel at position in world coordinates
	voxelAtPosition(pos: Vector3) {
		return this.voxelAtCoordinates(pos.divideScalar(this.blockSize).floor());
	}

	//report the number of chunks currently loaded into memory
	debug_getChunksLoadedCount() {
		return Object.keys(this.chunks).length;
	}

	/**
	 * remove chunks that are too far away
	 * _pos_ is the center of the chunks to look at
	 * _group_ is the ThreeJS group that the chunks are stored in
	 */
	removeFarChunks(pos: Vector3) {
		const nearbyChunks = this.nearbyChunks(pos, this.distance + 1).map((chunkPos) =>
			chunkPos.join('|')
		);
		Object.keys(this.chunks).map((chunkIndex) => {
			//skip the nearby chunks
			if (nearbyChunks.indexOf(chunkIndex) > -1) return;

			const chunk = this.chunks[chunkIndex];
			if (!chunk) return;
			// TODO replicate this
			// this.container.remove(chunk.surfaceMesh!);
			chunk.surfaceMesh!.geometry.dispose();
			this.CHUNK_CACHE[chunk.id] = chunk.data;
			chunk.dispose();
			delete this.chunks[chunkIndex];
		});
	}

	getBlock(x: number, y: number, z: number) {
		return this.voxelAtPosition(new Vector3(x, y, z));
	}

	rebuildMesh(chunk: Chunk) {
		// TODO replicate this
		// if (chunk.surfaceMesh) this.container.remove(chunk.surfaceMesh);
		chunk.surfaceMesh = new VoxelMesh(chunk, this.mesher, SCALE, this).createSurfaceMesh(
			this.textureManager.material
		);
		// TODO replicate this
		// this.container.add(chunk.surfaceMesh);
		const pos = chunk.realPosition.clone().multiplyScalar(this.chunkSize);
		console.log(chunk);
		chunk.surfaceMesh.position.copy(pos);
	}

	rebuildAllMeshes() {
		Object.keys(this.chunks).forEach((key) => this.rebuildMesh(this.chunks[key]));
	}

	updateCenterPosition(pos: Vector3) {
		this.requestMissingChunks(pos);
		// and remove the chunks that might be out of range now
		this.removeFarChunks(pos);
	}
}
