import { metadata } from '../metadata/blog_entries';

export async function load() {
	return {
		entries: metadata.blog_entries.sort((a, b) => {
			return new Date(a.published) < new Date(b.published) ? 1 : -1;
		})
	};
}
