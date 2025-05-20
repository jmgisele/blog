<script>
	import IconFooter from '../icons/IconFooter.svelte';
	import Navbar from '../navigation/Navbar.svelte';

	export let bottomLinks = false;
	export let navbar = false;
</script>

<div class="content-body">
	{#if navbar}
		<div class="nav-container">
			<Navbar />
		</div>
		<hr />
	{/if}
	<slot />
	{#if bottomLinks}
		<hr />
		<IconFooter />
		<div class="bottom-padding"></div>
	{/if}
</div>

<style>
	.nav-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		width: 100%;
	}

	@media screen and (max-width: 768px) {
		.nav-container {
			flex-direction: column;
			align-items: flex-end;
		}
	}
	.content-body {
		padding: 0 2em;
	}

	.bottom-padding {
		height: 2rem;
	}
</style>
