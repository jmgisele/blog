<script>
	import { page } from '$app/stores';
	import BasicWrapper from '../lib/wrappers/BasicWrapper.svelte';
</script>

<svelte:head>
	<title>{$page.status} {$page.error.message}</title>
</svelte:head>

<BasicWrapper>
	<h1>{$page.status} {$page.error.message}</h1>
</BasicWrapper>

<style>
	h1 {
		text-align: center;
	}
</style>
