import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from "fs"

export const GET = (async ({ params }) => {
	const stream = await fs.createReadStream(`.pixel-fight/${params.id}.vox`)
	const readableStream = new ReadableStream(stream.pipe)
	const response = new Response()
	return response
}) satisfies RequestHandler;
