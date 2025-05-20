import { metadata } from '../../../metadata/blog_entries';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	let entries = metadata.blog_entries;
	const post = entries.filter((entry) => entry.slug === params.slug)[0];
	if (!post) {
		throw error(404, {
			message: 'Not found'
		});
	}

	let component = await (async () =>
		(
			await import(`../../../entries/${params.slug}.svelte`)
		).default)();

	return {
		component
	};
}
