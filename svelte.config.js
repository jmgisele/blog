import adapter from '@sveltejs/adapter-node';
// import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ out: 'build', fallback: 'error.html', precompress: false, strict: true }),
		paths: {
			base: dev ? '' : '/'
		}
	}
};

export default config;

// const config = {
// 	kit: {
// 		adapter: adapter({
// 			// default options are shown. On some platforms
// 			// these options are set automatically — see below
// 			pages: 'build',
// 			assets: 'build',
// 			fallback: 'error.html',
// 			precompress: false,
// 			strict: true
// 		}),
// 		paths: {
// 			base: dev ? '' : '/blog'
// 		}
// 	}
// };

// export default config;
