<script>
	import BasicWrapper from '../lib/wrappers/BasicWrapper.svelte';
</script>

<svelte:head>
	<title>James Gisele | Blog</title>
</svelte:head>

<BasicWrapper backArrow={false} body_id="home-body">
	<h1>James Gisele</h1>
</BasicWrapper>

<style>
	h1 {
		line-height: 1.5rem;
	}
	.email {
		display: inline;
	}

	.all-posts {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}

	.date {
		color: var(--sky);
	}

	ul {
		list-style: none;
		padding: 0;
		font-size: 1.2rem;
	}

	.li-box {
		display: flex;
		flex-direction: row;
		justify-content: left;
		padding-bottom: 1em;
	}

	.entry-spacer {
		white-space: pre;
	}
</style>
