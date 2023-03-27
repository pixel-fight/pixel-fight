import fs from 'fs';
import parseMagicaVoxel from 'parse-magica-voxel';
import glob from "tiny-glob"
import { basename } from "path"

for (const voxFile of await glob(".pixel-fight/*.vox"))  {
	console.log(`converting ${voxFile}`)
	try {
		const buffer = fs.readFileSync(voxFile)
		const data = parseMagicaVoxel(buffer)
		fs.writeFileSync(`static/worlds/${basename(voxFile).slice(0, -4)}.json`, JSON.stringify(data))
	} catch (error) {
		console.error(error)
	}
}
