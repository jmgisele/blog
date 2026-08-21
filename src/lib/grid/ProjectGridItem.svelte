<script>
	import ChainLink from "../text_styling/ChainLink.svelte";

	export let project;

</script>


<div>
	<img
		src={project.src}
		alt={project.alt}
		class="graphics-image"
		/>
	<div class="link-box"><h2 class="project-title">{project.title}</h2>
		<div class="inside-link-box">
			{#each project.links as item}

	<ChainLink href={item.link} title={item.title}></ChainLink>
{/each}
		</div>
	</div>
	<slot name="description"></slot>
</div>

<style>
	.link-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: .2rem;
	}

	.inside-link-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-bottom: 0.3rem;
		gap: .1rem;
	}

	.project-title {
		font-size: 1rem;
		margin: 0;
		padding: 0;
		line-height: 1.0;
	}

	img {
		max-width: min(100%, 30rem);
		max-height: 14rem;
		padding: 1.5rem 0rem;
	}
</style>
