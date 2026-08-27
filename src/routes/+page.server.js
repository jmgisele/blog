import { metadata } from '../metadata/blog_entries';

export async function load() {
	return {
		entries: metadata.blog_entries
			.filter(e => !e.title.includes("Luddite")) // don't worry you can still see these posts if you go to the direct url :') 
			.sort((a, b) => {
			return new Date(a.published) < new Date(b.published) ? 1 : -1;
		})
	};
}
