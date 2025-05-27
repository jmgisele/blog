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
		I'm a software developer based in Philadelphia! Professionally, I make web apps.
		Unprofessionally, I dabble in Rust and systems programming. I like strong type systems,
		designing creative frontends, and learning a little bit about a lot of things.
	</p>
	<p>
		I'm currently looking for work. Feel free to shoot me an email at
		<span>
			<span class="email">
				<RainbowLink href="mailto:james.may.gisele@protonmail.com" add_class="main-email"
					>james.may.gisele@protonmail.com</RainbowLink
				>
			</span></span
		>
		if you'd like to get in touch.
	</p>
	<hr />
	<div class="all-posts">
		<ul>
			{#each data.entries as entry}
				<li class="li-box">
					<Star />
					<span>
						<span class="entry-spacer"> {`  `}</span>
						<span class="date">{new Date(entry.published).toDateString()}</span>
						<span class="entry-spacer"> {`    `}</span>
					</span>
					<span class="entry-title">
						<RainbowLink href={`${base}/blog/${entry.slug}`} target="">{entry.title}</RainbowLink>
					</span>
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
		justify-content: space-between;
		flex-wrap: wrap;
		padding-bottom: 1em;
	}

	.entry-spacer {
		white-space: pre;
	}

	.entry-title {
		padding: 0px;
		margin: 0px;
		flex-basis: 70%;
		text-align: right;
	}

	@media screen and (max-width: 768px) {
		.li-box {
			justify-content: center;
			flex-wrap: unset;
		}
		.entry-title {
			flex-basis: 80%;
			text-align: unset;
		}
	}
</style>
