<script>
	import BasicWrapper from '../../../lib/wrappers/BasicWrapper.svelte';
	import BodyWrapper from '../../../lib/wrappers/BodyWrapper.svelte';
</script>

<BasicWrapper>
	<BodyWrapper bottomLinks="true">
		<slot />
	</BodyWrapper>
</BasicWrapper>
