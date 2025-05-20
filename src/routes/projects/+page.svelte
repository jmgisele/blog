<script>
	import { base } from '$app/paths';

	import RainbowLink from '../../lib/text_styling/RainbowLink.svelte';
	import BasicWrapper from '../../lib/wrappers/BasicWrapper.svelte';
	import BodyWrapper from '../../lib/wrappers/BodyWrapper.svelte';

	import long_teapot from '../../assets/images/rust_software/long_teapot.gif';
	import slit from '../../assets/images/double_slit.png';
	import shel from '../../assets/images/shelmaala.png';
	import raytracing from '../../assets/images/raytracing_1.png';
	import Accordion from '../../lib/accordion/Accordion.svelte';
	import AccordionItem from '../../lib/accordion/AccordionItem.svelte';

	let active = null;
</script>

<BasicWrapper>
	<BodyWrapper navbar="true" bottomLinks="true">
		<h1>Projects</h1>
		<Accordion bind:active>
			<AccordionItem title={'Shel Maala Online Learning Platform'} id="1">
				<div slot="body">
					<img
						src={shel}
						alt={"screenshot of an e-learning website titled 'Shel Maala.' website is dark blue with gold and maroon accents and a pomegranate motif."}
						class="graphics-image"
					/>
					<p>
						I'm wrapping up a collaborative buildout-slash-glowup for the lovely
						yeshiva-in-the-clouds <RainbowLink href="https://shel-maala-new.netlify.app/"
							>Shel Maala!</RainbowLink
						> Their old site was a static CMS built on <RainbowLink href="https://www.11ty.dev/"
							>Eleventy.</RainbowLink
						> The lovely co-rosh-yeshivas had an ambitious vision of being able to host their own educational
						courses with lessons and homework and course progress and such, and the even more ambitious
						vision of having it freely hosted. It's been a pleasure to build the site out, especially
						as I was given the freedom to get cute with the design. <RainbowLink
							href="https://shel-maala-new.netlify.app/">Check it out</RainbowLink
						> if you want to learn your alef bet!
					</p>
				</div>
			</AccordionItem>
			<AccordionItem title={"Raytracing in 'one' weekend"} id="2">
				<div slot="body">
					<img
						src={raytracing}
						alt={'screencap of a simulation of the double slit experiment. simulation is in 70s colors with adjustments for wavelength, slit separation, slit width, distance to display screen, and light or particles. display screen is shown with a particulate interference pattern.'}
						class="graphics-image"
					/>
					<p>
						More like in several weeks, an hour or two at a time for me lol. Another Rust buildout
						of a
						<RainbowLink href="https://raytracing.github.io/"
							>classic C++ graphics tutorial</RainbowLink
						>, this is the project I'm working on now. I'm intentionally moving rather slowly and
						trying to understand the math while some <RainbowLink href="https://www.recurse.com/"
							>Recurse</RainbowLink
						> friends and I make our way through the raytracing chapters of <RainbowLink
							href="https://www.realtimerendering.com/">Real Time Rendering</RainbowLink
						>. Hopefully by the end I'll get the chance to mess around with the more complicated
						algorithms in RTR, but for now I'm working on translating C++ headers to idiomatic Rust
						lol. Check out my progress <RainbowLink
							href="https://github.com/jmgisele/raytracing-rust">here!</RainbowLink
						>
					</p>
				</div>
			</AccordionItem>
			<AccordionItem title={'Double Slit Simulator'} id="3">
				<div slot="body">
					<p>
						I missed my undergrad physics program, or at least I missed the physics part, and
						decided to go back to the classics for my first GPU-based graphics project.
					</p>
					<img
						src={slit}
						alt={'screencap of a simulation of the double slit experiment. simulation is in 70s colors with adjustments for wavelength, slit separation, slit width, distance to display screen, and light or particles. display screen is shown with a particulate interference pattern.'}
						class="graphics-image"
					/>
					<p>
						This is a sim of <RainbowLink
							href="https://en.wikipedia.org/wiki/Double-slit_experiment"
							>the double slit experiment</RainbowLink
						>, a classic physics experiment demonstrating the wave-like/probablistic nature of
						particulate matter. (I also included a light double slit experiment, though for light
						the classical understanding of EM radiation as a wave makes the same predictions and
						thus is less exciting lol.) It's coded up in Bevy with shaders in WGSL and GLSL, and you
						can access a moderately buggy WASM version <RainbowLink
							href="https://jmgisele.github.io/double-slit/">here</RainbowLink
						>, or download the desktop version <RainbowLink
							href="https://github.com/jmgisele/double-slit">here</RainbowLink
						>. If you've got a physics background, probably at this point you're squinting and going
						"waaaiit a second. Electrons are not in the visible light spectrum, and their de Broglie
						wavelength is certainly smaller than the 400-700nm range. What kind of simulator is
						this!" To which I say: so true lol I need to add onto the caveats that the scale and
						visuals here are misleading. The equations themselves should be the correct ones for
						particle interference, but I need to go back and polish up the edges and add a bunch of
						"CAVEAT: electron interference patterns can't be seen by the naked eye" messages, etc.
					</p>
				</div>
			</AccordionItem>
			<AccordionItem title={'Rust Software Renderer'} id="4">
				<div slot="body">
					<h5>A basic software renderer, my first Rust project and my first graphics project.</h5>
					<p>
						You can check out my writeup <RainbowLink href={`${base}/blog/software_renderer`}
							>here!</RainbowLink
						> and take a look at the code <RainbowLink
							href="https://github.com/jmgisele/childs-play">here.</RainbowLink
						>
					</p>
					<div>
						<img
							src={long_teapot}
							alt="gif of a software renderer rendering a rotating mesh of a pink utah teapot, with basic shading on a plain blue background"
							class="graphics-image"
						/>
					</div>
					<p>
						It's a basic software renderer I wrote to get a handle on the basics of rasterization.
						Modeled off of javidx9's <RainbowLink
							href="https://www.youtube.com/watch?v=ih20l3pJoeU&t">excellent</RainbowLink
						> C++ graphics engine tutorial.
					</p>
				</div>
			</AccordionItem>
		</Accordion>
	</BodyWrapper>
</BasicWrapper>

<style>
	img {
		max-width: 100%;
		padding: 1.5rem 0rem;
	}
</style>
