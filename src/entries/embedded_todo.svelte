<script>
import RainbowLink from "../lib/text_styling/RainbowLink.svelte";

</script>

<h1>The World Needs a Networked TODO App Running On 2011 Embedded EInk </h1>
<h2> And I'm here to provide.</h2>
<p>
	If your goal in life is to get off your phone, the best way to do that is likely to get off your phone. As a less painful (?) alternative, I've cooked up this horrible little recipe for myself so that even when I am <i>not</i> on my phone, I can continue being haunted by the presence of the unfinished tasks in my life.
</p>
<h3>Context</h3>
<p>This is the crowning jewel of a multiyear project to "look at my phone less, but make it convenient, but also make it <i>stupid</i> complicated." </p>

<p>
	The basics: My home server has an org-mode TODO text file that has all of my daily habits and random non-day-job tasks in it. I've got it hosted on a WebDAV server and hooked up on my machine and phone so I can update it from anywhere and sync it easily. My phone and home computer connect to my home server via Tailscale (which rocks), so things are nice and locked down, but I still have access outside the home without paying for an external cloud hosting or dealing with auth and malicious traffic and what have you.
</p>
<p>
	The desire was to be able to see my todos (and eventually update them) without looking at my phone directly. That way I can easily see the information "Gee James, you haven't given the cat insulin yet, have you" without looking at my phone, which is a guaranteed "doomscroll instead of giving the cat insulin" machine. Eink is involved because eink is cool and embedded hacking is cool! And eink just <i>feels</i> less like a screen with all the negative emotional associations thereof. I'm using a Kobo Wireless ereader model from 2011 as an ultracheap eink monitor. The early models of the Kobo are nice for this kind of stuff because they shipped a trimmed-down linux system completely un-locked-down. See
	<RainbowLink href="https://www.mobileread.com/forums/showthread.php?t=222123">here</RainbowLink>, <RainbowLink href="https://wordpress.panaceas.org/wp/index.php/2015/12/28/kobo-glo-sic-hd-hacking-part-1">here</RainbowLink>, <RainbowLink href="https://www.mobileread.com/forums/showthread.php?t=336433">here</RainbowLink>, <RainbowLink href="https://www.mobileread.com/forums/showthread.php?t=194376">here</RainbowLink>, and <RainbowLink href="http://blog.ringerc.id.au/search/label/kobo">here</RainbowLink> for the shoulders of kindly giants I'm standing on.
</p>
<p>
	For now, I focused on the "see" my todos part. I was able to get compiled Rust executables running on my ereader via messing around with some community cross-compilation toolchains. Lacking any easy way to input anything, however, it ended up being easier to just run everything on my home server and then send it over to the ereader with telcat, rather than try to debug anything running on the device itself.
</p>

<h3>How it works</h3>

<p>
	My .org todo files and habits live on a WebDAV server on my home server, which is to say "they're just plain files on that machine but I can edit them from elsewhere." I've got a simple bash script that runs on my home server via systemd and notify-send. Whenever the file with my habits/todos changes on disk, that systemd service runs a Rust script that:
</p>
<ul>
	<li>
		parses and generates an image based on the todo org file,
	</li>
	<li>
		copies the raw image over to a 2011 Kobo Ereader (aka "xtreme budget e-ink monitor") via netcat,
	</li>
	<li>
		displays that image via the Kobo's built-in rendering executable, nickel,
	</li>
	<li>
		and writes to a log file for easier debugging.
	</li>
</ul>
<p>
	I had to do some imaging and flashing of the kobo linux install to make this sync up right, but it's probably not worth talking about that in detail here because every model of the Kobo seems fairly idiosyncratic. The stuff I configured in the edited image was hardcoding my wifi name and password so as to not have to type them in with only a four button manual navigation system, and turning off the "wifi turns off automatically for battery reasons" function--- the battery is shot so I have it plugged in permanently anyway. As I mentioned, I was able to also get Rust programs compiled for the kobo and writing simple "hello world"s to the file system, but with the resources of my home server being orders of magnitude more powerful and easier to debug on when things weren't working, it didn't seem worthwhile to continue down that route. I think I finally quit at "getting fonts on the ereader," which my Rust program needed in order to make the final image render look pretty :)
</p>
<p>
	As it is, my workflow: I mark a TODO done on my phone or my computer, and ~2-4 seconds later I can see the updated status on my "e ink monitor." Because eink only uses power to change the image, and not to keep it rendered, that display sits there perfectly content on the corner of my desk in easy-line-of-sight and no-strain-of-eyes until I next update the file powering it. I'm quite pleased with this!! (And yes, it does say I'm overdue on my cat's insulin right now!)
</p>
<h3> Dreams for future development</h3>
<p>
	The dream would be to purchase an ereader with a touch screen (so, you know, like a 2012 one rather than my 2011 one) and figure out how to get some form of emacs or an org mode client like <RainbowLink href="https://www.orgzlyrevived.com">Orgzly Revived</RainbowLink> up on it. This is totally possible, people have <RainbowLink href="https://marek-g.github.io/posts/projects/archive/kobo_as_linux_tablet">ported ancient Debian isos</RainbowLink> onto Kobos a few models later than the one I've got. But: I'd need a device with a touchscreen. Reverse engineering a full four-button-based input system for the Kobo Wireless I've got, which does not have a touch screen and whose refresh rate and ghosting levels leave much to be desired, is not worth the pain. It is certainly beyond my current hardware and reverse-engineering skill levels to boot.
</p>
<h3>Some thoughts on personal or "houseplant" software</h3>
<p>
	The writeup above is certainly not detailed enough to replicate my steps. The source code I've put up <RainbowLink href="https://github.com/jmgisele/embedded-todo-eink-rust">here</RainbowLink> has a very barebones Rust script I can't imagine is of use to anyone else; to be honest, I kind of doubt anyone else with the skills has a functioning kobo eink reader from 2011 sitting around. Nevertheless: This sort of hacking --- amateurish, not replicable, intrinsically hobby-size, solving one problem for one human and rather poorly --- is deeply satisfying and rewarding.
</p>
<p>I work in the "writing software" industry; the projects I work on during work hours can have an immense impact on the quality of life of other human beings on this planet. By the time I left a previous job (several years ago) an application I had built had 400 years (!) of continuous human attention logged in it. This is the sort of realization that can drive a person mad if carried to its conclusions. When the software I build fails to meet my expectations of quality, this usually has real repercussions on other peoples' lives. That's scary!
</p>
<p> Coding side projects for myself is a really nice respite from that sort of high-pressure work which touches other peoples' lives in humbling and terrifying ways. It's a relief to know that the silly things I'm hacking on are purely for the joy and the demonstration that stupid fun shit is still possible, professionalization and commoditization of the software industry be damned. I'm getting at something similar to what a fellow Recurse alum <RainbowLink href="https://hannahilea.com/blog/houseplant-programming/">calls "houseplant software:"</RainbowLink>  "tiny software just for yourself." In addition to Hannah Robertson's points --- which are very good, please go read that post if you haven't --- I'd add it's a delight to just see what's possible when commercialization and 'seriousness' and professional responsibility are out of the picture entirely.
</p>
<p>It's a delight to be able to practically exploit the effects of an earlier era's "ship fast and worry about security later" ethos. It's a delight to sort out the toolchain for porting a Rust executable --- a language that was only invented in 2015! --- to a 2011 embedded device which predates the availability of even touch screens on eink. It's a TOTAL delight to uncover years of forum posts of other people idly spending their free hours poking around the corners of these devices, making similarly personal applications with similarly humble goals.
</p>

