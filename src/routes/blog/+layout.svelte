<script>
	import { onMount } from 'svelte';
	import footnoteInit from '../../lib/text_styling/footnoteInit';

	onMount(() => {
		footnoteInit('a.footnote', 'a.bottom');
	});
</script>

<slot />
