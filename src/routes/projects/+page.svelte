<script>
	import RainbowLink from '../../lib/text_styling/RainbowLink.svelte';
	import BasicWrapper from '../../lib/wrappers/BasicWrapper.svelte';
	import BodyWrapper from '../../lib/wrappers/BodyWrapper.svelte';

	import long_teapot from '../../assets/images/rust_software/long_teapot.gif';
	import slit from '../../assets/images/double_slit.png';
	import shel from '../../assets/images/shelmaala.png';
	import gyopo from  '../../assets/images/gyopo.png';
	import kobo from '../../assets/images/kobo.jpg';
	import pocketbook from '../../assets/images/pocketbook.jpg';
	import ProjectGridItem from '../../lib/grid/ProjectGridItem.svelte';

	const projects = [
		{
			title: 'GYOPO',
			src: gyopo,
			links: [ { link: "https://gyopo.us", title: "gyopo website"}],
			alt: "Screenshot of the GYOPO website",
		},
		{
			title: 'Shel Maala - Online Learning Platform',
			src: shel,
			links: [ { link: "https://www.shelmaala.org/", title: "shel maala learning platform"}],
			alt: "screenshot of an e-learning website titled 'Shel Maala.' website is dark blue with gold and maroon accents and a pomegranate motif.",
		},
		{
			title: "Networked Embedded EInk TODO app (why not)",
			src: kobo,
			alt: 'picture of a souped up 2011 kobo ereader displaying a basic todo application',
			links: [{link: '/blog/embedded_todo', title: 'blog post on embedded todo app'},{link: 'https://github.com/jmgisele/embedded-todo-eink-rust', title: 'github repo for my absurd todo app'}]
		},
		// {
		// 	title: "FrumReader aka KO(desh)Reader aka Pealim scraper (shh don't tell)",
		// 	src: pocketbook,
		// 	alt: 'picture of a pocketbook e-ink reader with the OSS KoReader application installed and the output of a Pealim scraper displayed',
		// 	links: [{link: 'https://www.github.com', title: 'github repo for frumreader'}]
		// },
		{
			title: 'Double Slit Simulator',
			src: slit,
			links: [ { link: "https://jmgisele.github.io/double-slit/", title: "double slit wgpu"}, { link: "https://github.com/jmgisele/double-slit", title: "double slit repo" }],
			alt: "screencap of a simulation of the double slit experiment. simulation is in 70s green and reddish brown with adjustments for wavelength, slit separation, slit width, distance to display screen, and light or particles. display screen is shown with a particulate interference pattern.",
		},
		{
			title: 'Rust Software Renderer',
			src: long_teapot,
			alt: "gif of a software renderer rendering a rotating mesh of a pink utah teapot, with basic shading on a plain blue background",
			links: [{link: "`${base}/blog/software_renderer`", title: "blog post about software renderer"}, {link:"https://github.com/jmgisele/childs-play" }]
		},

	]
</script>

<BasicWrapper>
	<BodyWrapper navbar="true" bottomLinks="true" currentPage="projects">
		<section class="project-grid">
			<ProjectGridItem project={projects[0]}>
				<p slot="description">
					Sanity CMS-powered arts site with ecommerce functionality. Design by <RainbowLink href="https://lukas.eigler-harding.com/">Lukas Eigler-Harding</RainbowLink>
				</p>
			</ProjectGridItem>
			<ProjectGridItem project={projects[1]}>
				<p slot="description">
					Decap CMS-based site with ecommerce integration for online learning platform.
				</p>
			</ProjectGridItem>

			<ProjectGridItem project={projects[2]}>
				<p slot="description">
					Obligatory "didn't stop to think if I should". <RainbowLink target='' href="/blog/embedded_todo">Full writeup here.</RainbowLink>
				</p>
			</ProjectGridItem>
			<!-- <ProjectGridItem project={projects[3]}> -->
				<!-- 	<p slot="description"> -->
					<!-- 		Hooked my PocketBook (which I <b>do</b> actually use as an ereader) up so that when I long-press on a word, can search via on-demand scraping the Pealim site. Yet to come: hooking it up somehow to Sefaria's API if I can, adding a robust system for recognizing words I've searched in the past. -->
					<!-- 	</p> -->
				<!-- </ProjectGridItem> -->
			<ProjectGridItem project={projects[3]}>
				<p slot="description">
					Project I whipped up while learning Rust and attending a <RainbowLink href="https://www.recurse.com/">Recurse Center</RainbowLink> retreat. A bit rough around the edges. It's a simulator for
					<RainbowLink
						href="https://en.wikipedia.org/wiki/Double-slit_experiment"
						> the double slit experiment</RainbowLink
																					>.
					Don't think too hard about the underlying physics of color and light, please...
				</p>
			</ProjectGridItem>
			<ProjectGridItem project={projects[4]}>
				<p slot="description">
					Basic software renderer I wrote to get a handle on the basics of rasterization.
					Modeled off of javidx9's
					<RainbowLink
						href="https://www.youtube.com/watch?v=ih20l3pJoeU&t">excellent</RainbowLink
																																						>
					C++ graphics engine tutorial. <RainbowLink href=[projects[4].links[0].link]
			 																							 >Blog post here! </RainbowLink>
				</p>
			</ProjectGridItem>
		</section>
	</BodyWrapper>
</BasicWrapper>

<style>

	.project-grid {
		display: grid;
		gap: 2rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		@media screen and (max-width: 768px) {
			grid-template-columns: minmax(0, 1fr);
		}
	}

</style>
