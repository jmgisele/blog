<script>
	import { base } from '$app/paths';
	import BasicWrapper from '../lib/wrappers/BasicWrapper.svelte';
	import Navbar from '../lib/navigation/Navbar.svelte';
	import Star from '../lib/icons/Star.svelte';
	import IconFooter from '../lib/icons/IconFooter.svelte';
	import RainbowLink from '../lib/text_styling/RainbowLink.svelte';

	export let data;
</script>

<svelte:head>
	<title>James Gisele | Blog</title>
</svelte:head>

<BasicWrapper backArrow={false} body_id="home-body">
	<h1>James Gisele</h1>
	<Navbar />
	<p>
		I'm a software developer based in Philly! This blog is under construction right now, so kindly
		bear with the dead links and wonky styles :)
	</p>
	<p>
		My professional work has thus far been in full-stack web development. I like to dabble in Rust
		and graphicsey stuff on the side, so expect that to be most of the content here.
	</p>
	<p>
		I'm currently looking for work! Feel free to shoot me an email at
		<span>
			<address class="email">
				<RainbowLink href="mailto:james.may.gisele@protonmail.com" add_class="main-email"
					>james.may.gisele@protonmail.com</RainbowLink
				>
			</address></span
		>
		if you'd like to get in touch.
	</p>
	<hr />
	<div class="all-posts">
		<ul>
			{#each data.entries as entry}
				<li class="li-box">
					<Star />
					<span class="entry-spacer"> {`  `}</span>
					<span class="date">{new Date(entry.published).toDateString()}</span>
					<span class="entry-spacer"> {`    `}</span>
					<RainbowLink href={`${base}/blog/${entry.slug}`} add_class="entry-title"
						>{entry.title}</RainbowLink
					>
				</li>
			{/each}
		</ul>
	</div>
	<hr />
	<IconFooter />
	<p>
		This blog is made in
		<RainbowLink href="https://kit.svelte.dev/" target="_blank" rel="noopener noreferrer"
			>SvelteKit</RainbowLink
		>
		with

		<RainbowLink href="https://github.com/catppuccin" target="_blank" rel="noopener noreferrer"
			>Catppuccin</RainbowLink
		>

		colors.
	</p>
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
