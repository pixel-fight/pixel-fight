import { describe, it } from 'vitest';
import fs from 'fs';
import parseMagicaVoxel from 'parse-magica-voxel';

describe('vox', () => {
	it('should read a file', async () => {
		const buffer = fs.readFileSync('.pixel-fight/Basic-World.vox');
		parseMagicaVoxel(buffer);
	});
});
