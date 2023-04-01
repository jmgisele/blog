<script>
	import { theme, toggleTheme } from '../../stores/global_theme';
	import ThemeToggle from '../icons/ThemeToggle.svelte';
	import BackArrow from '../icons/BackArrow.svelte';
	import Navbar from '../navigation/Navbar.svelte';
	import IconFooter from '../icons/IconFooter.svelte';

	export let backArrow = true;
	export let body_id = '';
</script>

<div class="body-wrapper {$theme}">
	<div class="main-body" id={body_id}>
		<ThemeToggle checked={$theme === 'light-theme'} {toggleTheme} />

		{#if backArrow}
			<BackArrow />
		{/if}

		<slot />
	</div>
</div>

<style>
	.body-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh;
		width: 100%;
		background-color: var(--base);
	}

	.main-body {
		padding: 1rem;
		box-sizing: border-box;
		margin: 1rem;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		background-color: var(--mantle);
		width: 100%;
		max-width: min(100vw, 56rem);
	}

	#home-body {
		padding: 2rem 2rem;
	}
</style>
