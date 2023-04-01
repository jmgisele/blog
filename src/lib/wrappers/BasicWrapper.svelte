<script>
	import { theme, toggleTheme } from '../../stores/global_theme';
	import ThemeToggle from '../icons/ThemeToggle.svelte';
	import BackArrow from '../icons/BackArrow.svelte';
	import Navbar from '../navigation/Navbar.svelte';

	export let backArrow = true;
	export let body_id = '';
	export let navbar = false;
</script>

<div class="body-wrapper {$theme}">
	<div class="main-body" id={body_id}>
		<ThemeToggle checked={$theme === 'light-theme'} {toggleTheme} />

		{#if backArrow}
			<BackArrow />
		{/if}
		{#if navbar}
			<div class="nav-container">
				<Navbar />
			</div>
			<hr />
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

	#home-body {
		padding: 2rem 2rem;
	}
</style>
