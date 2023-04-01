<script>
	import Highlight from 'svelte-highlight';
	import github from 'svelte-highlight/styles/github';
	import { ini, javascript } from 'svelte-highlight/languages';
	import nvidia_meme from '../assets/images/nvidia.jpg';
	const blacklist = `# !! DO NOT DO THIS 
blacklist hid-asus 
blacklist asus-nb-wmi 
blacklist nvidiafb 
blacklist rivafb 
blacklist i2c_nvidia_gpu`;

	const zsh = `#!/bin/zsh
DISPLAY=:1 WAYLAND_DISPLAY=wayland-1 swaylock
`;
	const lock = `[Unit]
Description=Lock the screen upon resume from suspend

[Service]
User=[my_username]
Environment=WAYLAND_DISPLAY=wayland-1
Environment=XDG_RUNTIME_DIR=/run/user/1000
Environment=DISPLAY=:1
ExecStart=/usr/bin/swaylock
ExecStartPost=/usr/bin/sleep 1

[Install]
WantedBy=suspend.target`;
</script>

<svelte:head>
	{@html github}
</svelte:head>

<h1>Linux Clusterfuck: Or, How To Configure Swaylock To Run on ACPI Events</h1>
<h2>12 February 2023</h2>
<h3>in which i scream</h3>
<h5>
	note: skip to <a href="#solution">here</a> if you just want the solution without all the drama
</h5>
<p>
	I got back from a not-so-relaxing trip early this past Wednesday morning. I obviously went right
	tf to bed, got up around noon and puttered around for a bit, then finally opened up my laptop
	(running Arch) and ran a <span class="hljs">paru -Syu</span>. After a few days of having Other
	Priorities there were quite a few packages to install, but no worries; I monitored the output as
	it ran and everything looked fine. And it was! Until. . . .
</p>
<h3>it was not fine</h3>
<p>
	My suspend was broken :) Or rather, <a href="https://github.com/swaywm/swaylock">swaylock</a> was
	broken, likely due to a bug in a recent update to my Wayland compositor,
	<a href="https://github.com/hyprwm/Hyprland">Hyprland</a>. If I closed my laptop, waited for it to
	suspend, and opened it back up, I was greeted with a
	<span class="hljs">swaylock</span>
	screen that was completely frozen. If I was lucky, I could <span class="hljs">tty</span> into restarting
	my display manager and logging back in. If I wasn't, Hyprland itself crashed and I could only force
	reboot.
</p>
<p>
	Now, I hear what you're saying, Linux oldhats. First of all, I should have backed my system up
	before updating so many packages all at once. Preferably, I should <i>also</i> have been using a backup
	utility built for Arch, rather than (yikes) logging into an X11 Plasma session just to use a very janky
	and unreliable Timeshift (built for Ubuntu). And to you I say: you're absolutely correct full stop
	I've learned my lesson and am taking recomendations for Arch friendly backup software (preferably ones
	with a GUI or very helpful man pages). Unfortunately, in this case, due to entirely my own hubris and
	laziness, I was stuck without a recent (&lt 2 days) backup to rely upon.
</p>
<p>
	The second obvious response to "it was a Hyprland bug screwing with swaylock" is "how on earth did
	you determine that?" and
	<i>that</i> question has a much more <span class="strikethrough">hellish</span> interesting answer.
</p>
<p>
	Mostly, this post is for my own benefit 1 month - 3 years from now when I have to go spelunking in
	the <span class="hljs">systemd</span>
	and <span class="hljs">/etc/modprobe</span> caverns again to fix some other basic functionality. But
	if you're here reading with me, maybe you'll learn a bit about what ~not~ to do when troubleshooting.
</p>
<h3>it's always NVIDIA optimus</h3>
<p>
	Anyone that's bought a budget gaming/creative laptop in the past ~5 years has signed the contract
	with the devil that is NVIDIA Optimus.
</p>
<div class="center-image-flex">
	<img
		src={nvidia_meme}
		alt="the TRADE OFFER meme. i receive: approximately one grand; you receive: a steady stream of GPU bugs. bottom text: nvidia optimus babey"
		id="meme"
	/>
</div>
<p>
	For those not familiar, <a href="https://en.wikipedia.org/wiki/Nvidia_Optimus">NVIDIA Optimus</a> is
	where your laptop comes with two GPUS: an integrated (usually Intel) GPU that's great for battery life
	and not much else but is generally well-behaved, and a dedicated GPU (NVIDIA) for graphically intensive
	tasks that is poorly behaved, does not work, causes only headaches, and is also extremely necessary
	for eg games or screensharing.
</p>
<p>
	Because NVIDIA does shit its own very proprietary way, Linux support for NVIDIA chips is always a
	headache. I'm told it's much better than it was ~5yrs ago, and to that I say, Jesus, it really
	must have been terrible.
</p>
<p>I've been around this rodeo before, though, so off I went a-googling and a-journald-ing.</p>
<h4>kernel params</h4>
<p>
	First off, let's check what NVIDIA has to say on the subject. They've got an <a
		href="http://us.download.nvidia.com/XFree86/Linux-x86_64/515.57/README/powermanagement.html"
	>
		entire book on NVIDIA-on-Linux with a relevant section on suspend.
	</a>
	They say to check that your GPU supports it (mine does) and then check the kernel params
	<span class="hljs">NVreg_EnableS0ixPowerManagement</span> and make sure it's set to
	<span class="hljs">1</span>. Mine was set to
	<span class="hljs">0</span>! Surely, that was the issue, and we can wrap it up here. Right?
</p>
<h4>systemd hell</h4>
<p>
	of course not. That did absolutely nothing. Next up: make sure the relevant systemd services are
	running. i enabled and restarted <span class="hljs">nvidia-resume.service</span>,
	<span class="hljs">nvidia-suspend.service</span>, and
	<span class="hljs">nvidia-hibernate.service</span>. I even discovered a bug with
	<span class="hljs">nvidia-powerd.service</span> in the process, and disabled and masked it so I could
	play Hollow Knight without my logs being spammed (as much, lol). No juice.
</p>
<p>
	At this point, I went through my journald logs more painfully. There was no <span
		class="hljs hljs-error">"ERROR: Process xyz dumped core"</span
	>
	or <span class="hljs hljs-error">"ERROR: Your lock utility fucked up"</span> screaming at me, so whatever
	it was was failing silently. A smart, experienced unix dev probably would have started looking at recently
	upgraded packages at this point. I am not that user.
</p>
<p>
	So, I started messing with my lock service itself. Here's the entirety of the <span class="hljs"
		>systemd</span
	>
	service I was using to lock my screen, <span class="hljs">lock.service</span>:
</p>
<Highlight language={ini} code={lock} />
<p>
	This does pretty much what it says it does. <a href="https://wiki.archlinux.org/title/Systemd"
		>Systemd</a
	>
	is, among other things, a service manager for Linux systems which controls and allows configuration
	of daemons/services/other systemy things I don't yet fully understand. This file (if configured correctly
	and enabled) literally just tells the system
	<b>"when suspend happens, execute swaylock on display 1."</b>
</p>
<p>
	First, I tried switching the <span class="hljs">suspend.target</span> to
	<span class="hljs">sleep.target</span>. Would not reccomend this. Instead of being able to switch
	over to a terminal session and restart my display manager, this crashed my entire system and I had
	to force-reboot to get back into my session.
</p>
<p>
	So, clearly the target was not the issue, or at least changing it was creating larger issues. I
	decided to do a sanity check and change the execution from <span class="hljs"
		>/usr/bin/swaylock</span
	>
	to <span class="hljs">echo "i am locked!"</span>. Luckily this did output a lovely
	<span class="hljs hljs-happy">i am locked!</span> happily to my journald logs every time I closed my
	laptop lid and caused a suspend event. And lo and behold -- when I cracked my laptop open again, the
	user session was NOT frozen!
</p>
<p>
	It was at this point when I started actually putting the pieces together. If <span class="hljs"
		>systemd</span
	>
	wasn't putting anything strange<span class="strikethrough">r than usual</span> in my logs on
	suspend/sleep events, and if my system was fine (just unlocked and therefore insecure) when I
	executed any other command from <span class="hljs">lock.service</span>. . . could it be? that my
	issue was not, in fact, with suspend at all?
</p>
<h3>except when it isn't NVIDIA optimus</h3>
<p>
	So I went digging in <span class="hljs">swaylock</span> to see if that was the issue. I
	re-installed <span class="hljs">swaylock</span>; realized I'd been using
	<span class="hljs">swaylock-effects</span> the whole time, so reinstalled that; realized there
	were a couple different git repos for <span class="hljs">swaylock-effects</span> which did not
	seem entirely reliably maintained, so switched back to <span class="hljs">swaylock</span>; checked
	the most recent commits to the <span class="hljs">swaylock</span> repo since I'd been encountering
	the issue, saw absolutely no changes committed in the past week; and concluded probably,
	<span class="hljs">swaylock</span> wasn't the issue.
</p>
<p>
	Somewhere in here, I also had the brilliant idea of disabling my <span class="hljs"
		>lock.service</span
	>, executing <span class="hljs">swaylock</span> from a terminal, and then closing my laptop lid.
	This worked <i>perfectly</i>, no freezing whatsoever. A
	<span class="strikethrough">less bonkers</span> lesser consumer of buggy software than I would have
	called it quits here and simply executed their lock service manually from here on out. But no, I had
	to have it automated, so on I went.
</p>
<p>
	At this point, it didn't seem like the issue was with <span class="hljs">swaylock</span>,
	especially as nobody else was having the issue on the <span class="hljs">swaylock</span> github.
	That left the probable culprit to <span class="hljs">Hyprland</span>, the very-pretty but
	deeply-still-in-development Wayland compositor (aka window manager for those of us who aren't
	pedants) I use. And lo and behold--- when I checked the <span class="hljs">Hyprland</span> github,
	someone 12 hours before had created an issue for what looked like the same bug.
</p>
<p>
	A <span class="strikethrough">saner</span> smarter person than me would have waited for Hyprland devs
	to respond with a potential patch, which they did within ~24 hours of that issue appearing on GH. But
	I still wasn't confident of this being the source of the issue, with all the different moving pieces,
	none of which were giving me very much to go on log-wise.
</p>
<h3 id="solution">james' beautiful workaround</h3>
<p class="disclaimer hljs">
	Note: I do not make any promises as to the security of below method. My threat model is
	essentially "some guy who doesn't know computers breaks into my house and picks up my laptop,
	which is not open." I do not take this laptop to public places and then leave it around for people
	to try to break into. If that's your threat model, swaylock is probably not a good bet for you, as <a
		href="https://github.com/swaywm/wlroots/issues/2706"
		>swaylock is known to have / have had quite nonideal practices when crashing</a
	> (such as simply allowing access to your session lol)
</p>
<p>ALRIGHTY, strap in.</p>
<p>
	My brilliant strategy is to hook into the "lid close" <span class="hljs">ACPI</span> event, rather
	than the sleep event via <span class="hljs">systemd</span>. The first go-to for "I can't figure
	out why my <span class="hljs">systemd</span> service isn't working and I need to hook into an ACPI
	event" is <span class="hljs">acpid</span>, a
	<a href="https://wiki.archlinux.org/title/Acpid">very old, very fiddly util</a> that allows you to
	define handlers for a variety of ACPI events. This works fine except. . . we need access to the
	user-level Wayland session (Hyprland, in my case), and acpid as a root level process has a harder
	time with that. If you try to execute a user-level graphical process such as
	<span class="hljs">kitty</span>
	or <span class="hljs">swaylock</span> from a script executed by <span class="hljs">acpid</span>,
	you get a <span class="hljs hljs-error"> "Failed to open X11 display"</span> error, meaning acpid doesn't
	know how to find the display to render to, or some such.
</p>
<p>
	Enter (dramatic drumroll)
	<a href="https://gitlab.com/jokeyrhyme/user-acpid-rs">user-acpid-rs</a>, a companion project to
	<span class="hljs">acpid</span> with exactly two stars on Gitlab, one of which is from me,
	yesterday, at about 3am. The first small mercy is that <span class="hljs">user-acpid</span> is
	small, just a single file. The second is it's written in extremely readable fashion in
	<b>Rust</b>, which I've been spending the last few weeks at <a href="www.recurse.com">Recurse</a>
	picking up.
</p>
<p>
	<b>
		If you're a Rustacean, into systems programming, or even if you are deeply neither, I'd go give
		<span class="hljs">user-acpid</span> a look
	</b> -- it's simple, readable, and does exactly what it says on the tin. If you want to customize it
	to other ACPI events, it also looks extensible, though for my purposes the lid close handler is fine.
</p>
<p>
	Install acpid, then install user-acpid, the latter preferably in a root dir (eg <span class="hljs"
		>/usr/bin/</span
	>
	not <span class="hljs">~/.local/</span> ) though cargo will make this difficult and you will have
	to work around it and no, <span class="hljs">sudo cargo install my-acpid-rs</span> will not cut
	it, even if you were silly enough to try <span class="hljs">sudo</span>ing a package manager
	<span class="strikethrough"> which I would certainly never do</span>. (I think I ran
	<span class="hljs">cargo build --release</span>
	and then just copied the relevant executable to somewhere in my <span class="hljs">$PATH.</span>)
</p>
<p>
	Next, copy the <span class="hljs">user-acpid.service</span> file from the user-acpid repo into
	<span class="hljs">~/.config/systemd/user/</span> and customize the referenced install location as
	needed.
</p>
<p>
	FINALLY, create a bash or zsh or whatever-shell-you-use script in <span class="hljs"
		>~/.config/user-acpid/</span
	>
	named <span class="hljs">button-lid-close</span> and add whatever you want to execute on lid close
	to that file. In my case that's:
</p>
<Highlight language={ini} code={zsh} />
<p>
	<span class="hljs">chmod +x</span> that baby, run:
</p>

<p>
	<span class="hljs">systemctl daemon-reload</span>
</p>
<p>
	<span class="hljs">systemctl enable --now acpid.service</span>
</p>

<p>
	<span class="hljs">systemctl enable --user --now user-acpid.service</span> (&lt the flags are important
	on this one)
</p>
<p>
	and you should be GOOD to GO. Slap that screen down, open her up, and you should not only see
	swaylock up and running, you should also be able to <i>interact</i> and <i>unlock</i> your session.
	Wild stuff.
</p>
<h3>takeaways</h3>
<p>
	I honestly spared you (future me) a lot of the drama here, which is remarkable considering the
	length of this post. At one point, in order to figure out why some of my keyboard keys were't
	working (see below), I live-booted EndeavorOS from USB and went down a rabbit hole of figuring out
	how the files in <span class="hljs">/sys/</span>
	get generated. Between the "maybe it's not NVIDIA" and "definitely it's not NVIDIA" states, there was
	also a long series of "perhaps if I toggled this boot parameter" and "what about this tweak to the
	configuration for
	<span class="hljs">/etc/systemd/system/lock.service</span>" rabbitholes that got me nowhere. Some
	useful info from those rabbitholes is listed below, in case I come back to this in a year with the
	same poor instincts.
</p>
<p>
	Part of this whole kerfuffle was just my own imposter syndrome around unix system maintenance. I
	have a mistaken belief everything that goes wrong on my system is my fault for not reading
	carefully, for being more comfortable with a GUI for some tasks, etc. It seems like this was
	simply a bug introduced into my Wayland compositor a couple days ago. The lesson here is "back up
	freuqently and well, and install packages incrementally to a functioning system when things go
	wrong" not "you made a fatal mistake configuring your system."
</p>
<p>
	I've been running exclusively different flavors of linux for several years, but until now mostly
	stuck with the "it just works" distros with built-in display environments rather than customizing
	my system much. Baseline Pop!OS and Manjaro fuck, and are so much better than Windows that I
	didn't even bother to figure out whether there was something else I'd like something better. My
	current laptop's combo of hardware is very fidgety and has a large community of people dedicated
	to making it less so at <a href="https://asus-linux.org/">asus-linux</a>, for whom I am very
	grateful; they recommend Arch, which is why I switched. Despite really loving the setup I have
	now, I'm still in the growing pains moving from "KDE just handles that for me" to "chasing GH
	issues across 5 different repos and finagling systemctl for multiple hours."
</p>
<p>
	Obviously, hopefully Hyprland devs will patch this regression in behavior and all will be well and
	I will no longer need my workaround. Barring someone writing me about how insecure my current
	process is, though, I'm quite pleased with this workaround. It sets me up for handling any number
	of other ACPI events via custom hooks and doesn't rely on the as-established extreme unreliability
	of NVIDIA suspend/sleep/hibernate services.
</p>
<h3>what not to do</h3>
<p>
	In the process of sorting this all out, I did a bunch of whackamole with boot options via grub and
	modprobe (when I still believed the issue to be NVIDIA suspend related) that various characters on
	stackoverflow et al recommended. None of this helped and much of it hurt. If you have a NVIDIA
	and/or asus machine, I would highly recommend <b>NOT</b> adding the following lines to any
	<span class="hljs">/etc/modprobe.d</span>
	configuration files:
</p>
<Highlight language={javascript} code={blacklist} />
<p>
	After a reboot, my <span class="hljs">meta</span> key (🪟) just....fully stopped working.
	Unfortunately this key was bound to almost every functionality of my WM/compositor, so I freaked
	out thinking I'd nerfed my entire system. Eventually I decided out that my
	<span class="hljs">meta</span>
	key must simply have broken, and remapped my WM bindings to <span class="hljs">alt</span>. I
	happily configured my swaylock as described above and was mildly irritated by a brand new laptop
	with a broken key, but mostly just happy to have a functional, locking system again.
</p>
<p>
	Then I realized the backlight brightness keys weren't working. Nor the keyboard brightness keys.
	And when i went digging around for <span class="hljs">/sys/class/backlight/</span> to see what
	stuff was set to, I found there <i>was</i> no directory by that name. And in fact, most of
	<span class="hljs">/sys/</span> was empty of the expected files. Long story short
	<span class="hljs">asus-nb-wmi</span> is a
	<b>non-negotiable kernel module and it should not be blacklisted don't do it.</b>
</p>
<p>
	Hope you learned something if you made it this far, and to future me: just wait for the patch next
	time. . .It's not worth it!!
</p>

<style>
	#meme {
		max-height: 500px;
	}

	@media screen and (max-width: 768px) {
		#meme {
			max-height: 300px;
		}
	}

	.hljs-error {
		color: var(--red);
	}

	.hljs-happy {
		color: var(--mauve);
	}

	.disclaimer {
		font-style: italic;
	}
</style>
