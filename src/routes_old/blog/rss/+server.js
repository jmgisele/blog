import { metadata } from '../../../metadata/blog_entries';

export function GET() {
	const body = render_xml(metadata.blog_entries);
	const headers = {
		'Cache-Control': `max-age=0, s-max-age=${600}`,
		'Content-Type': 'application/xml'
	};

	return new Response(body, {
		headers: headers
	});
}

const render_xml = (posts) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
<title>James Gisele</title>
<link>http://blog.jamesgisele.com/</link>
<description>Blog of James Gisele</description>
<language>en-us</language>
<docs>http://blogs.law.harvard.edu/tech/rss</docs>
<managingEditor>james.may.gisele@protonmail.com</managingEditor>
${posts
	.map(
		(post) =>
			`<item>
			<guid>https://www.blog.jamesgisele.com/blog/${post.slug}</guid>
			<title>${post.title}</title>
			<link>https://www.blog.jamesgisele.com/blog/${post.slug}</link>
			<description>${post.description}</description>
			<pubDate>${new Date(post.published).toUTCString()}</pubDate>
			</item>`
	)
	.join('')}
</channel>
</rss>
`;
