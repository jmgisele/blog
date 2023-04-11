<script>
	import { onMount } from 'svelte';
	import init from '../assets/wgpu_pkg/wgpu_1';

	import two_d from '../assets/images/rust_software/two_d.png';
	import camera from '../assets/images/rust_software/camera.png';
	import light from '../assets/images/rust_software/light.png';
	import no_order from '../assets/images/rust_software/no_order.png';
	import with_order from '../assets/images/rust_software/with_order.png';
	import chaos from '../assets/images/rust_software/chaos.png';
	import not_triangle from '../assets/images/rust_software/not_triangle.png';
	import clipped from '../assets/images/rust_software/clipped.png';
	import teapot from '../assets/images/rust_software/teapot.png';
	import long_teapot from '../assets/images/rust_software/long_teapot.gif';

	import RainbowLink from '../lib/text_styling/RainbowLink.svelte';
	import RainbowButton from '../lib/text_styling/RainbowButton.svelte';
	import footnoteInit from '../lib/text_styling/footnoteInit';

	onMount(() => {
		footnoteInit('a.footnote', 'a.bottom');
	});

	let kates = false;
	const start_the_kates = () => {
		kates = true;
		init();
	};
	const stop_the_kates = () => {
		kates = false;
	};
</script>

<h1>Child's Play: Writing a Software Renderer in Rust</h1>
<h2>04 April 2023</h2>
<h3>It's not actually that hard!</h3>
<h5>
	(tldr check out my <RainbowLink href="#list">list</RainbowLink> of vetted introductory graphics resources)
</h5>
<p>
	So, I'm finally getting around to writing up what it is I actually spent the past three months at <RainbowLink
		href="https://www.recurse.com/">Recurse</RainbowLink
	>
	working on. For the most part, I've been dabbling in graphicsey stuff in Rust, and it's been an absolute
	blast! Well. Mostly. Except for the whole part where nearly everything in Rust graphics world is pre-1.0
	release and therefore often limited-scope and buggy. And the part with all the
	<RainbowLink href="https://wiki.archlinux.org/title/Wayland">Wayland-</RainbowLink> and Linux NVIDIA-
	specific bugs in common low-level graphics crates, causing me at one point to give in and install i3
	(an X11 WM) just to get
	<RainbowLink href="https://nannou.cc/">nannou</RainbowLink>
	running at all. Aand the part where I still can't get
	<RainbowLink href="https://www.w3.org/TR/webgpu/">WebGPU</RainbowLink>, the very new browser
	graphics API, working in Firefox Nightly or Chrome Canary on Arch (taking advice on this one!).
</p>
<p>
	But we're not here to talk about any of that today! Instead, I'll bring you back with me to late
	January. Back before I had ever heard of "padding my buffers" <RainbowLink
		href="https://github.com/gfx-rs/wgpu/issues/2832">(. . .)</RainbowLink
	>
	or encountered <span class="hljs">'Error in Surface::configure: parent device is lost'</span>
	<RainbowLink href="https://github.com/gfx-rs/wgpu/issues/2519">(. . .)</RainbowLink> or seen deeply
	nested closures used to recreate the CSS box model in Rust
	<RainbowLink href="https://github.com/jmgisele/double-slit/blob/main/src/ui.rs#L145"
		>(. . .)</RainbowLink
	>.
</p>
<p>
	No, for today we're going back to the "childlike delight" stage of my new hobby. Shortly after
	<RainbowLink href="/blog/hello_world/">writing about</RainbowLink> how much I missed math, but was
	entirely unsure what kind of "math" I wanted to be doing, I discovered
	<RainbowLink href="https://www.youtube.com/watch?v=jvPPXbo87ds&t=2726s">this video</RainbowLink> by
	Freya Holmér on splines and was like "oh, cool, making pretty pictures happen on screen involves lots
	of math. Let's do that!"
</p>
<h3>baby's first MVP (model view projection)</h3>
<p>
	For my first Rust project and my first graphicsey project, I decided to write a software renderer.
	I was inspired by <RainbowLink href="https://www.youtube.com/watch?v=ih20l3pJoeU&t=1667s"
		>this fantastic series</RainbowLink
	>
	by youtuber javidx9 on creating a 3D graphics engine using C++, Visual Studio, and the Windows console.
	I had no interest in learning C++ or reinstalling Windows, however, so I decided to port the engine
	to Rust.
</p>
<h4>a lesson in choosing your degrees of freedom (potential sources of bugginess)</h4>
<p>
	Porting an existing codebase was a
	<i>very</i>
	good first project! Graphics is <i>hard</i>. I was coming from the web development world
	primarily, where the browser does a lot of the heavy lifting for you in so, so many domains, from
	memory management to multiplatform support to "how render font" (a perhaps
	<RainbowLink href="https://faultlore.com/blah/text-hates-you/">surprisingly difficult</RainbowLink
	> problem!). Picking up Rust is also hard if you're coming from exclusively high-level languages; you
	have to spend a while macerating in borrow-checker soup to get any sort of intuition for Rust's memory
	model. Choosing a project where I had a source-of-truth for what something should look like was
	<i>extremely</i> helpful; it helped narrow down which bugs were due to (my incomprehension of) which
	tech.
</p>
<p>
	javidx9's series has WIP files on github for each video, which was invaluable in making sure my
	renderer was having the "right" issues at each point in its iteration. Graphics programming
	generally involves a "pipeline" with various coordinate systems and transformations/calculations
	associated with each step in this pipeline. For an experienced graphics dev, it's often evident
	what stage the issue is happening in based on what the symptoms are: screwy shapes = vertex or
	projection issue, screwy colors = fragment or lighting issue, to drastically oversimplify. For a
	newb, it's difficult to figure out what each phase even
	<i>does</i> spatially, let alone figure out which stage is causing which problem. So, a project where
	there was a well-defined SOT was invaluable.
</p>
<h4>shaders are cool and also they are hard</h4>
<p>
	javidx9's series was also fantastic because it ignored much of the tech that makes graphics
	programming powerful and also notoriously difficult to learn --- talking to the GPU --- in favor
	of explaining how 3D rendering works conceptually. By making a software renderer, I got to learn
	about the basics of 3D graphics --- model/world/view/clip coordinates, projection, clipping,
	cameras, z buffers, light sources, painting textures --- without having to worry about the
	particularities of talking to the GPU. Programs that run on the GPU (aka shaders) are notoriously
	difficult to debug for important performance-related reasons; building an intuition for how this
	stuff "works" while the Rust compiler had my back was very helpful for when i moved on to shader
	programming and had fewer <span class="hljs">print</span> statements to rely on.
</p>
<p>
	But simultaneously. . .there's, like, a reason people made GPUs, lol. There are only so many
	performance gains to be made and only so many vertices one can render when using the CPU
	exclusively to carry out all the many calculations required to paint a 3D frame. The renderer I
	wrote is moderately performant only for low-poly .obj files; if I eventually add in textures, it
	will be even less performant. Writing a software renderer was both very satisfying and also not
	something I can seriously build on after a certain point.
</p>
<h3>ok but like. what is it. how does it work</h3>
<h5>
	what follows is a very high level overview of what my engine implements, glossing over some
	details. if you're here more for a list of stuff that I found helpful, scroll to the <RainbowLink
		href="#list">end!</RainbowLink
	>
</h5>
<h4>first things first: stuff i didn't do</h4>
<p>
	I decided I did not want to deal with implementing "make window happen cross-platform" or "listen
	for user keypresses," so I used <RainbowLink href="https://github.com/emoon/minifb"
		>minifb</RainbowLink
	> for that.
	<RainbowLink href="https://github.com/rust-windowing/winit">Winit</RainbowLink> seems to be the standard
	for Rust, but at the time its current release had a NVIDIA-Wayland bug that required patching manually,
	and I decided I'd just use a crate that worked as-is, thanks.
</p>
<p>
	Controversially perhaps, I also decided I did not want to deal with figuring out how to draw a
	line between two points. (If that interests you, check <RainbowLink
		href="https://rust-tutorials.github.io/triangle-from-scratch/">this project</RainbowLink
	>
	out!) I messed around trying to get several Rust graphics crates hooked up (there are a LOT to choose
	from), but <RainbowLink href="https://github.com/jrmuizel/raqote">raqote</RainbowLink>'s API was
	simple and it can draw lines real good, which is what I needed. If you're trying to decide which
	graphics crate to use, first of all--- good luck! there are so many! Second of all maybe take a
	look at
	<RainbowLink href="https://wiki.alopex.li/AGuideToRustGraphicsLibraries2019"
		>this post</RainbowLink
	> if you're doing something serious, it's got a good overview though it's a couple years old. Also,
	this
	<RainbowLink href="https://github.com/ocboogie/rust-graphics-crates">github</RainbowLink>
	readme. Also,
	<RainbowLink
		href="https://www.reddit.com/r/rust/comments/gggirx/getting_started_into_graphics_programming_where/"
		>this</RainbowLink
	>
	reddit thread. Like I said, there's a lot! (Trivia: One of the core
	<RainbowLink href="https://raphlinus.github.io/rust/graphics/2018/10/11/2d-graphics.html"
		>people behind</RainbowLink
	>
	<RainbowLink href="https://github.com/linebender/piet">piet</RainbowLink>
	is a Recurser I recently learned, which is pretty cool!)
</p>
<h4>so we've got a window and a framebuffer. now what</h4>
<p>Oh, you <b>know</b> what's next! It's <i>triangles</i> time baybee!</p>
<p>
	Turns out that if you can draw triangles that form a rotating cube, you're like, halfway to
	implementing skyrim.<a class="footnote" href="#skyrim">^</a><span
		class="anchor"
		id="skyrim-note"
	/>
	The math is roughly the same because almost everything in computer graphics is represented as triangles,
	points, and lines, which was kinda shocking to me originally tbh. Ok, probably there are <RainbowLink
		href="https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles"
		>huge exceptions to this rule</RainbowLink
	> but polygon-based rendering is extremely common.
</p>
<p>
	So, you've got a list of triangles representing a shape (say, a cube) and you'd like them to show
	up on a screen and resemble that shape (say, a cube). Unfortunately for you, the cube is
	represented in three-dimensional space (it's a cube, not a square!) and your screen is
	two-dimensional. So, we
</p>
<h4>project to 2D</h4>
<div class="center-image-flex">
	<img
		src={two_d}
		alt="a cube projected to two dimensions, that looks more like a square"
		class="graphics-image"
	/>
</div>
<p>
	So, that looks pretty nice. Two obvious problems, though: the cube isn't centered very well, and
	you can't actually tell it's a cube. From the angle we're at, it looks like more of a square.
	Wouldn't it be nice if we could change where we're positioned with respect to the cube, so we can
	get a nice viewport? We could even use a nifty name for the matrix math we use to get there,
	something intuitive, maybe
</p>
<h4>a camera system</h4>
<div class="center-image-flex">
	<img
		src={camera}
		alt="a cube projected to two dimensions, centered and looking cubely"
		class="graphics-image"
	/>
</div>
<p>
	Ahh, that's more like it! I don't feel like going into the math, so <RainbowLink
		href="https://www.3dgep.com/understanding-the-view-matrix/">here</RainbowLink
	> is a great link if that's what you're into. TLDR-- in the real world, you generally move cameras
	around the scene to get different viewing angles, look at different objects, etc. With this engine
	(as with many others), you actually do the reverse -- you "move" the vertexes representing your scene
	around the camera, defined at the origin of this coordinate system, to "look at" different parts of
	the scene. You define where your camera is (the origin), which direction you're looking, how near and
	far you can "see" objects, and a frame of view -- and then rotate the world so its coordinates are
	relative to this coordinate system. I promise it makes more sense with the math!
</p>
<p>
	So this is great. Except....Things look a little flat, don't they? Every face of the triangle is
	shaded the same. In the real world, things look a little more dimensional. To get that dimension
	from our engine, we'll have to add in some
</p>
<h4>light</h4>
<div class="center-image-flex">
	<img
		src={light}
		alt="a cube, with different colors on different faces of the cube to simulate light"
		class="graphics-image"
	/>
</div>
<p>
	Okay lol, so that doesn't actually look fantastic, but we're getting somewhere! The lightsource
	here is modeled as a uniform directional light "behind" the camera, so it's adding light based on
	how much this lightsource is "shining" on the surface. This calculation is done using normal
	vectors to each triangle's surface, producing "flat" shading with a basic directional light. A
	more realistic form of shading for round surfaces could be implemented by using the normal at each
	vertex and interpolating across them for each triangle face, and a more realistic one by taking
	into account the width of a potential lightsource rather than modeling it as a single vector. If
	you're excited by that math, have another <RainbowLink
		href={'https://cglearn.codelight.eu/pub/computer-graphics/shading-and-lighting'}
		>link</RainbowLink
	> to some fun different lighting strategies.
</p>
<p>
	Okay, so we're looking pretty good! Let's try and graduate to something a little more complex.
	Say. . . a spaceship? Nabbed directly from the excellent javidx9 series github?
</p>
<div class="center-image-flex">
	<img
		src={no_order}
		alt="a basic spaceship mesh, with some weird/inaccurate shapes on the wings as an artifact of unsophisticated rendering strategies"
		class="graphics-image"
	/>
</div>
<p>
	Alright alright. So our light source is definitely working. But clearly we've got some new
	problems. If we take a look at the wings of our spaceship, you see all sorts of chaos. There are a
	few things happening here, so we'll take them one at a time.
</p>
<h4>z-buffer ordering</h4>
<p>
	One of the things causing the weirdnesses seen above is the fact that we're not drawing our
	triangles in any particular order at the moment. Our engine draws all triangles at whatever order
	they're fed into it by the code. As it is, a triangle waaay at the "back" of the spaceship (aka
	one with large z-values in view space) can be drawn after a triangle at the "front" of the
	spaceship, replacing its pixels with its own and causing weird artifacts such as the one seen on
	the left wing.
</p>
<p>
	Z-buffer ordering algorithms in modern GPUs have to be relatively sophisticated (consider if
	triangle A is "in front" of half of triangle B, but "behind" the other half?), but for now we'll
	stick with ordering by a simple average of Z-values. This gets us something a lot nicer looking:
</p>
<div class="center-image-flex">
	<img
		src={with_order}
		alt="a basic spaceship mesh, which is mostly clear of obvious visual artifacts due to z-buffer ordering"
		class="graphics-image"
	/>
</div>
<p>
	A lot better. There's still one triangle on the right wing with the issue mentioned above, where
	half the triangle should be rendered "above" and the other half "below" another triangle; but this
	is looking a lot bigger.
</p>
<p>Let's take a closer look, to make sure everything is actually working as intended.</p>
<div class="center-image-flex">
	<img
		src={chaos}
		alt="a basic spaceship mesh, except you can't tell because all you see are horrible janky overlapping triangles"
		class="graphics-image"
	/>
</div>
<p>Haha. Oh no</p>
<h4>clipping</h4>
<p>
	So, what's happened here is actually not that complicated, though it's a slightly more
	sophisticated fix than simply re-ordering our paints.
</p>
<p>
	The first thing you'll notice with the engine at this point is that it starts sloooowing down as
	you get closer . One day I'll do a WASM port and update this post so you can see for yourself, but
	for now, imagine about 1 frame per second update rate.
</p>
<p>
	When an object goes off screen or gets too close to the camera, the matrix math we're currently
	using means that the object's coordinates get verrry large. The reason behind this for objects
	close to the camera is pretty intuitive. Hold your hand up directly in front of your eyes.
	Hopefully, your hand looks big. Now put your hand behind your head. How big does your hand look?
	"What kind of question is that," you say, "I can't see it!" Same goes for the view matrix, albeit
	in a math-ey way - objects too close to or behind the camera have unwanted behavior. In the
	process of projecting the triangles, you divide by their z distance from the camera. When this z
	distance gets very small, the numbers get very large, and it's a lot slower to do tons of
	calculations on very large numbers. (This is where you start to get memory problems in
	non-memory-safe applications.) Also - why should we even be doing calculations on vertices that
	are off-screen anyway?
</p>
<p>
	This is where clipping comes in. We only want to be rendering things that are within our view
	volume. But in order to do that, we'll have to do a bunch of math, because currently all we can
	render with our engine is <i>triangles</i>. What do you get when you chop a triangle with a plane
	or two?
</p>
<div class="center-image-flex">
	<img
		src={not_triangle}
		alt="cube mesh, slightly off-center so that the window clips the triangles forming the cube into quadrilaterals"
		class="graphics-image"
	/>
</div>
<h5>not a triangle</h5>
<p>
	Again, I'm skipping over the math, but there are several algorithms you can use to detect whether
	a vertex needs to be clipped and then turn the remaining vertices into new triangles by adding
	vertices to the mix. The math can be found <RainbowLink
		href={'https://gabrielgambetta.com/computer-graphics-from-scratch/11-clipping.html'}
		>here</RainbowLink
	>, if you're interested. Let's see how things are performing with clipping for both the front view
	plane (close to camera) and the window edges:
</p>
<div class="center-image-flex">
	<img
		src={clipped}
		alt="cube mesh, slightly off-center so that the window clips the triangles, with added triangles so that every shape in the mesh is represented as a triangle"
		class="graphics-image"
	/>
</div>
<p>
	There we go! We're back to triangles, and our performance issues have disappeared -- our
	application is positively snappy.
</p>

<h4>final touches</h4>
<p>
	As a final touch, let's render something a little fancier. Mesh courtesy of <RainbowLink
		href={'https://graphics.stanford.edu/courses/cs148-10-summer/as3/code/as3/teapot.obj'}
		>Stanford:</RainbowLink
	>
</p>
<div class="center-image-flex">
	<img src={teapot} alt="impeccably rendered mesh of utah teapot" class="graphics-image" />
</div>
<p>
	and to really seal the deal, I'll turn off the polygon lines, add a little rotation, and get you a
	gif:
</p>
<div class="center-image-flex">
	<img
		src={long_teapot}
		alt="impeccably rendered mesh of utah teapot, now rotating!"
		class="graphics-image"
	/>
</div>

<p>
	Beautiful! We've still got a few glitches around the corners and the lid, but that looks about
	right.
</p>
<h3 id="list">shortlist of absolute beginners' graphics resources</h3>
<ul>
	<li>
		<h6>javidx9</h6>
		the original <RainbowLink href="https://www.youtube.com/watch?v=ih20l3pJoeU&t=1667s"
			>javidx9</RainbowLink
		> series that got me started. all his videos are really great!
	</li>
	<li>
		<h6>Computer Graphics From Scratch</h6>
		alternately - <RainbowLink
			href="https://www.gabrielgambetta.com/computer-graphics-from-scratch/"
			>Computer Graphics From Scratch</RainbowLink
		> I've heard great things about, and it covers largely the same material, if you're more of a books
		learner than a videos learner. It's in pseudocode which saves you the stress if you (like me) don't
		know C++, don't currently want to, and are struggling through C-dialect-heavy graphics resources.
	</li>
	<li>
		<h6>math refresh - 3blue1brown's linear algebra</h6>
		for a linear algebra refresh - 3blue1brown's linear algebra <RainbowLink
			href="https://www.youtube.com/watch?v=kjBOesZCoqc&list=PL0-GT3co4r2y2YErbmuJw2L5tW4Ew2O5B"
			>series</RainbowLink
		> is hard to beat.
	</li>
	<li>
		<h6>shader school</h6>
		<p>
			A <RainbowLink href={'https://github.com/stackgl/shader-school'}
				>10-years-but-still-running</RainbowLink
			> GLSL shader interactive course. Really really good, and you can still get it running on local!
			Don't try to get rid of the broken dependency loops tho that way lies madness. Thank you to fellow
			Recurser Petar for putting me onto this when I was trying and failing to brute force my way into
			understanding shaders.
		</p>
	</li>
	<li>
		<h6>shader toy</h6>
		<p>
			A <RainbowLink href={'https://www.shadertoy.com/'}>really excellent website</RainbowLink> for seeing
			the bonkers things people can do with shaders and hope one day you too can be that crazy skilled.
		</p>
	</li>
	<li>
		<h6>learn wgpu</h6>
		<RainbowLink href="https://sotrh.github.io/learn-wgpu/#what-is-wgpu">learn wgpu.</RainbowLink> honestly,
		this one's probably best if you're coming in with some graphics background. i tried moving to this
		right after writing the software renderer but found it confusing/buggy in places and entirely copy-this-boilerplate-ey
		in others. by the end i could change the sea of stone cubes in the tutorial to a sea of dancing kate
		bushes (see below), but not much else--- everything i'd written felt pretty opaque and difficult
		to reason about.
		<RainbowLink
			href="https://www.youtube.com/watch?v=knmuobQFNmM&list=PLWtPciJ1UMuBs_3G-jFrMJnM5ZMKgl37H"
			>chris biscardi has a good series</RainbowLink
		> walking through most of learn wgpu, but it seems even they bailed before reaching the end lol.
	</li>
	<li>
		<h6>x11 fun</h6>
		<p>
			someone linked <RainbowLink href={'https://magcius.github.io/xplain/article/index.html'}
				>this fun
			</RainbowLink> interactive book-tutorial on the X11 window system in the Recurse chat. It has a
			bunch of fun demos that helped me understand what aliasing/anti-aliasing are and why they occur,
			and has a bunch of fun legacy Linux stuff. Shoutout to whoever linked me to this!
		</p>
	</li>
</ul>
<h3>bonus for those who got this far</h3>
<div class="button-container">
	<RainbowButton
		on:click={kates ? stop_the_kates : start_the_kates}
		on:keypress={(e) => (e.code === 'Enter' && kates ? stop_the_kates : start_the_kates)}
	>
		toggle ye kates (may be slow on mobile)
	</RainbowButton>
</div>

{#if kates}
	<h5>the sea of kates (click in me! i've got a movable WASD camera!)</h5>
	<div class="wasm-container">
		<div id="wasm-example" />
	</div>
{/if}

<div class="footnote">
	<p>
		<a href="#skyrim-note" id="skyrim" class="bottom">^</a> this is a joke lol
	</p>
</div>

<style>
	.button-container {
		width: 300px;
	}

	.wasm-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}

	.graphics-image {
		margin: 20px 0px;
		width: 70%;
		max-width: 400px;
		border-radius: 10px;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
	}

	ul {
		list-style: none;
	}
</style>
