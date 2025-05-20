<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let active = null;

	const activeStore = writable(active);

	setContext('accordionState', activeStore);
</script>

<ul class="accordion">
	<slot></slot>
</ul>
