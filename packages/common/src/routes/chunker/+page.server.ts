import fs from 'fs';
import parseMagicaVoxel, { type VoxelData } from 'parse-magica-voxel';
import type { PageServerLoad } from './$types';

// const bananaGunSmol = '.pixel-fight/banana_gun_smol.vox'
const bananaGun = '.pixel-fight/banana-gun.vox'
// const basicWorld2Smol = '.pixel-fight/basic_world_2_smol.vox'
// const basicWorld2Smol50 = ".pixel-fight/basic_world_2_smol_50.vox"
// const hotWorld = '.pixel-fight/hot_world_16_16_16.vox';

export const load = (() => {
	const buffer = fs.readFileSync(bananaGun);
	console.log(buffer);
	const data = parseMagicaVoxel(buffer);
	console.log(data);
	return data as VoxelData;
}) satisfies PageServerLoad;
