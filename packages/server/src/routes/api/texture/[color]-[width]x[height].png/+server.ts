import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import sharp from 'sharp';
import { hexToRgb } from '@pixel-fight/common';

const parse = (number: string) => {
	const value = Number(number);
	if (!Number.isFinite(value)) return null;
	if (value > 256 || value < 0) return null;
	return value;
};

export const GET = (async ({ params, setHeaders }) => {
	const rgb = hexToRgb(params.color);
	const width = parse(params.width);
	const height = parse(params.height);

	if (width === null || height === null || rgb === null) throw error(400, 'Invalid color');

	setHeaders({
		'content-type': 'image/png'
	});

	const buffer = await sharp({
		create: {
			width,
			height,
			channels: 4,
			background: {
				...rgb,
				alpha: 1
			}
		}
	})
		.png()
		.toBuffer();

	return new Response(buffer);
}) satisfies RequestHandler;
