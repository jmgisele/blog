import { error } from '@sveltejs/kit';
import { metadata } from '../../../metadata/blog_entries';

let entries = metadata.blog_entries;

export async function load({ params }) {
	const post = entries.filter((entry) => entry.slug === params.slug);
	if (!post.length) {
		throw error(404, {
			message: 'Not found'
		});
	}
}
