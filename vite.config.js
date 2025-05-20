import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: ['clsx']
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					'components': [
						'src/lib/accordion/AccordionItem.svelte',
						'src/lib/accordion/Accordion.svelte'
					]
				}
			}
		}
	},
});
