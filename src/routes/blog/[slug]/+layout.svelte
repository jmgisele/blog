<script>
	import BasicWrapper from '../../../lib/wrappers/BasicWrapper.svelte';
	import BodyWrapper from '../../../lib/wrappers/BodyWrapper.svelte';

	import { page } from '$app/stores';
</script>

<BasicWrapper>
	<BodyWrapper bottomLinks="true">
		{#if $page.data.component}
			<svelte:component this={$page.data.component} />
		{/if}
		<slot />
	</BodyWrapper>
</BasicWrapper>
