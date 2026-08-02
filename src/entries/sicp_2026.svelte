<script>
	import Highlight from 'svelte-highlight';
	import github from 'svelte-highlight/styles/github';
	import { ini, shell, scheme, lisp } from 'svelte-highlight/languages';
	import RainbowLink from '../lib/text_styling/RainbowLink.svelte';
	import racket_mode_init from '../assets/images/racket-mode-init.png';
	import racket_mode_repl from '../assets/images/racket-mode-repl.png';
	import geiser_repl_bad from '../assets/images/geiser-repl-bad.png';
	import geiser_repl_list_bad from '../assets/images/geiser-repl-list-bad.png';
	import geiser_repl_list_good from '../assets/images/geiser-repl-list-good.png';
  import tangle_success from '../assets/images/tangled-success.png'
  import sicp_tada from  '../assets/images/sicp-tada.png'
	const test_racket = `# lang sicp
  (inc 1)
`;
	
	const racket_hash_lang_mode = `(use-package racket-mode
  :mode (("\\.rkt\\'" . racket-hash-lang-mode)))
`;

	const emacs_ob_racket = `(add-to-list 'load-path "~/path/to/emacs-ob-racket/dir")
(package-initialize) ;; need to run this once after adding everything to load-path

(use-package eval-in-repl)
(use-package org-babel-eval-in-repl)

(use-package org
  :config
  (add-to-list 'auto-mode-alist '(".org" . org-mode))
	(add-to-list 'org-src-lang-modes '("racket" . racket)) ;; tell org to use racket-mode
	(org-babel-do-load-languages
	 'org-babel-load-languages
	 '(
		 (racket . t)
		 ))
 	(setq ob-racket-default-lang "sicp") ;; tell ob-racket to use sicp by default
	;; set these to keybindings you find convenient
	(define-key org-mode-map (kbd "<f5>") 'ober-eval-in-repl)
	(define-key org-mode-map (kbd "<f6>") 'ober-eval-block-in-repl))
`

	const print_right = `
(#%require (only racket/base                     
                   print-as-expression
                   print-pair-curly-braces
                   print-mpair-curly-braces))
  (print-as-expression      #f)
  (print-pair-curly-braces  #t)
  (print-mpair-curly-braces #f)
`

 const org_header_excercise_title_racket = `(defun org-header-exercise-title-racket()
 (let* ((org-nearest-heading
     (org-element-property
      :title
      (org-element-parent (org-element-parent (org-element-context)))))) ;; hacky but does the job ....
  (if
    (and org-nearest-heading
       (not (string-match file-name-invalid-regexp org-nearest-heading))
       (string-match "Exercise" org-nearest-heading))
    (concat
     "tangled_exercises/"
     (format "%s" org-nearest-heading)
     ".rkt")
   "no" )
  ))
`

  const bookmark_save = `(add-to-list 'load-path "/path/to/dir/with/bookmark-view")
(package-initialize) ;; again, needed only once per init file after all your load-paths
(global-set-key (kbd "C-c b s") 'bookmark-view-save) ;; set these to defaults you like
(global-set-key (kbd "C-c b o") 'bookmark-view-open)
`
</script>

<svelte:head>
	{@html github}
</svelte:head>

<h1>Getting a Working SICP environment in Emacs with Org Mode in 2026</h1>
<h2>02 August 2026</h2>
<h3>Harder than one might assume!</h3>
<p>
	I've been trying to work through <RainbowLink href="https://en.wikipedia.org/wiki/Structure_and_Interpretation_of_Computer_Programs">SICP</RainbowLink> this year. I haven't even gotten to the good stuff yet, but in my defense "this year" I was also hospitalized with septic shock and bought my first house. Nevertheless I've returned to this project in the past few weeks, and found what I left off with: a fairly broken Emacs config for the whole process.
</p>
<p>After starting/stopping/returning to my setup a few times over the course of several months, I've got a pretty good sense of what I want in terms of IDE/learning environment for making my way through the rest of the book. Here's the </p>
<h2>Vision</h2>
<ol>
	<li>
		Working REPL and language mode for the variant of scheme used in the SICP book
	</li>
	<li>
		Access to SICP from within emacs natively. No pdfs!
	</li>
	<li>
		Ability to embed SRC blocks within an emacs <RainbowLink href="https://orgmode.org/">.org</RainbowLink> file with syntax highlighting
	</li>
	<li>
		Ability to hit a keybinding and send that source block to my REPL
	</li>
	<li>
		Ability to hit a keybinding and export <b>all</b> source blocks which are under a header that contains "Exercise" to a file named after that heading in a subdirectory in the current working directory. Eg - any source block under the heading <i>Exercise 1</i> would be placed in the file <i>./local_dir/Exercise 1</i>. But a source block under the heading <i>Chapter 1 notes</i> would not! (Org users know this is called <RainbowLink href="https://orgmode.org/manual/Extracting-Source-Code.html">tangling!)</RainbowLink>
	</li>
	<li>
		Ability to "save" my window set up and place within SICP - on emacs loadup, or at any point while doing other things, I should be able to hit a keybinding and be dropped into a frame with my exact windows, buffers, and locations within those buffers as they were the last time I was working on SICP.
	</li>
</ol>
<p>This is not a complicated list of requirements! But nonetheless the state of the lisp/scheme/racket ecosystem within emacs in 2026 is how I assume it's been forever: fragmented. I am a rather amateur lisper and emacs user, so figuring out where things are going wrong and what defaults are getting me into a loop where was very challenging. Furthermore many things which "should" work and seem to have once worked fine are, in 2026, broken -- the interop between various emacs packages have broken down over the years. There are <i>no shortage</i> of similar blog posts online --- the overlap between emacs nerds and SICP enthusiasts is large --- but I kept finding that .emacs configurations that worked for folks in 2009, 2014, or 2024 did not in fact still work for me. Hopefully this information is of service to future SICPers struggling to get a working setup.
</p>
<p>I'm using vanilla GNU Emacs 30.2 on Arch Linux. Without further ado: Let's start with the easy things first.</p>
<h3>Getting the SICP language</h3>
<p> The SICP language is a Scheme. However, it is <b>not</b> actually exactly equivalent to the various MIT schemes available on the internet. I wanted a language which was exact to the one used in the book, so as not to waste my time going down syntax rabbit-holes where implementation details differed between my environment and the one the book assumed.</p>
<p>A working implementation of the SICP scheme is instead <RainbowLink href="https://docs.racket-lang.org/sicp-manual/Installation.html">provided</RainbowLink> as a package in the Racket language. Konstantinos Chousos has an excellent blog post on getting that up and running <RainbowLink href="https://web.archive.org/web/20250306110642/http://kchousos.github.io/posts/sicp-in-emacs/#fnref:2"> here</RainbowLink>. Here's a basic overview:
</p>
<ol>
	<li>
		Install racket through your package manager. On Arch this would be
		<Highlight language={shell} code={"$ pacman -Syu racket"} />
	</li>
	<li>
		Install the SICP package through raco, the racket package manager
		<Highlight language={shell} code={"$ raco pkg install sicp"} />
	</li>
	<li>
		Test your install! The "inc" function is not available within standard racket, only SICP. Write a test.rkt file with the following contents:
		<Highlight language={scheme} code={test_racket} />
		Run it using racket:
		<Highlight language={shell} code={"$ racket test.rkt"} />
		You should see <span class="hljs">2</span> - if so, you've successfully installed the SICP language. <span class="hljs">(inc 1)</span> is a very helpful litmus test as you get your environment up and running as to whether your REPL/racket program is using the right interpreter for your code.
	</li>
</ol>
<h3> Getting the SICP Book in Emacs</h3>
<p> Again, credit to <RainbowLink href="https://web.archive.org/web/20250306110642/http://kchousos.github.io/posts/sicp-in-emacs/#fnref:2">Konstantinos</RainbowLink> for pointing me this way. This one's easy - MELPA has a <RainbowLink href="https://melpa.org/#/sicp">sicp package</RainbowLink> that offers the full SICP book as an additional Info mode node. This is great for me --- I like info mode conventions -- but it's also available for free on the <RainbowLink href="https://web.archive.org/web/20250304102728/https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/index.html">SICP website</RainbowLink> as html and pdf if you prefer.
</p>
<Highlight language={lisp} code={"(use-package sicp)"} />
<h3>Working language environment in Emacs</h3>
<p> Here's where the difficulties begin.
	There are any number of different modes within emacs for editing files and spinning up REPLs in the wider lisp language family.
	Ideally, we'd probably use <RainbowLink href="https://www.racket-mode.com/">racket mode</RainbowLink>
	for everything. Racket (and therefore racket-mode) know how to deal with the <span class="hljs">#lang sicp</span> we have to sprinkle everywhere and don't require extra config to eg get the repl to print out variables how the SICP language should.</p>

<p> However, between 2011 and 2024 the racket-mode API surface seems to have changed in ways which make it interact poorly with evaluating racket source blocks from within org-mode. If you don't care about org-mode: That is amazing for you. You can just read the section on racket-mode and ignore the rest. If you want the nice bells and whistles I mentioned above where you can extract code easily from org-mode, evaluate it, etc: You'll have to put in a bit more work.</p>
<h4>racket-mode</h4>
<p>racket-mode is available as a MELPA package. The following should all go in your emacs setup file. I use vanilla emacs so if you're using Doom/straight.el/what have you to manage packages, edit accordingly. We also need to tell emacs to hook into it when we visit a .rkt mode file.
</p>

	<Highlight language={lisp} code={racket_hash_lang_mode} />
<p>
	We use  <span class="hljs">racket-hash-lang-mode</span> here because this tells racket-mode to go looking for a #lang line to tell how to lex (for syntax highlighting, indent, navigation).
</p>
<p>After re-evaling your init file, if you visit a .rkt file such as the test.rkt file created above, you should see a message "Waiting for backend to start...." at the top of your buffer indicating that racket-mode is going looking for your language backend:
</p>
<div class="center-image-flex">
	<img
		src={racket_mode_init}
		alt="pic of my emacs frame with the message 'Waiting for backend to start....' displayed at the top of the test.rkt buffer"
		id="racket-mode-init"
		class="desktop"
		/>
</div>
<p>Once that's complete you should see syntax highlighting. By running <span class="hljs">racket-run-and-switch-to-repl</span>, by default mapped to [F5], you should then see a Racket repl which successfully evaluates your SICP-flavored Scheme:

</p>
<div class="center-image-flex">
	<img
		src={racket_mode_repl}
		alt="pic of my emacs frame showing successul test.rkt eval in REPL"
		id="racket-mode-repl"
		class="desktop"
		/>
</div>
<p>Amazing! We've got a working environment now. This knocks out the first two items in the vision. Unfortunately, the rest are a bit more of a pain.
	<h3>Org Mode Interop</h3>
<p>First, let's get racket-mode support within .org src blocks. This can be done through the packages
	<RainbowLink href="https://github.com/kaz-yos/eval-in-repl">eval-in-repl</RainbowLink>,
	<RainbowLink href="https://github.com/diadochos/org-babel-eval-in-repl">org-babel-eval-in-repl</RainbowLink>,
	and
	<RainbowLink href="https://github.com/hasu/emacs-ob-racket">emacs-ob-racket</RainbowLink>:
</p>
<Highlight language={lisp} code={emacs_ob_racket} />
<p>Unfortunately, racket-mode support in eval-in-repl isn't currently working. I spent a good chunk of my spare time this past week trying valiantly to fix it but to no avail. I'm a thoroughly amateur emacser - my ability to use the built in debugger is limited and my ability to read elisp even more so. From what I can tell, the problem comes from the interop between racket-mode, which had a major overhaul of its api circa 2011 when the author evidently improved their understanding of the emacs window system, and eval-in-repl, which didn't get that memo.
	<RainbowLink href="https://github.com/kaz-yos/eval-in-repl/issues/48">This github issue gives an overview</RainbowLink>,
	but the fix here doesn't work for me.
	I <i>think</i> it's becuase eval-in-repl assumes the variable "racket-repl-buffer-name"
	gives the name of the specific buffer you're trying to evaluate,
	whereas racket-mode sets that variable to nil in order to
	send all code evaluated to the same repl.
</p>
<p> So, instead, we send things not to a racket-mode racket-repl, but to a Geiser repl. <RainbowLink href="https://elpa.nongnu.org/nongnu/doc/geiser.html">Geiser</RainbowLink> is <i>another</i> major mode for interacting with lisp-family-languages which is supposedly more powerful and fully-featured but whose major mode I never quite got playing nicely with racket's #lang lines. By default, eval-in-repl uses Geiser for its racket repl, so we don't really need to configure anything here. But it's very irritating to have two different REPLs, one for evaluating from a file and the other for evaluating from an org source block. In addition, Geiser requires some manual intervention to play nicely with the sicp language which we'll see below. If any readers have successfully mashed together the org-babel-eval and racket-mode packages, please do drop me a line.
</p>
<h4>Geiser Config</h4>
<p> With the above config loaded, if we open up an org file, add a source block, and hit the keybinding we configured above, we should be placed into a Geiser repl:
</p> 

<div class="center-image-flex">
	<img
		src={geiser_repl_bad}
		alt="pic of my emacs frame showing weird output in the Geiser REPL"
		id="geiser-repl-bad"
		class="desktop"
		/>
</div>
<p>Uh oh.
 <span class="hljs">inc: undefined;
 cannot reference an identifier before its definition</span>??
	Clearly Geiser doesn't understand that we mean to use the sicp language, not default vanilla racket. We've gotta manually run  <span class="hljs">(require sicp)</span> for that. Once we've done that, let's try again:
</p>
<div class="center-image-flex">
	<img
		src={geiser_repl_list_bad}
		alt="pic of my emacs frame showing weird list printing in the Geiser REPL"
		id="geiser-repl-list-bad"
		class="desktop"
		/>
</div>
<p> Better --- it can take an   <span class="hljs">(inc 1)</span> --- but what the heck is <span class="hljs">(mcons 1 (mcons 2 (mcons 3 (mcons 4 '()))))?</span>
</p>
<p>It turns out this is a quirk of how Racket-thru-Geiser is loading the SICP language - under the hood, the racket interpreter turns all our SICP conses (mutable by default) to Racket mconses (since normal Racket conses are immutable, <RainbowLink href="https://stackoverflow.com/questions/23411900/why-am-i-getting-mcons-cells-in-my-cons-list">I guess?</RainbowLink>). If we want Geiser to know to use our SICP printing rules, we can tell it so <RainbowLink href="https://www.reddit.com/r/Racket/comments/99e1qe/comment/e4queby">(thanks to random reddit user soegaard):
</RainbowLink>:
</p>

<Highlight language={scheme} code={print_right} />
<div class="center-image-flex">
	<img
		src={geiser_repl_list_good}
		alt="pic of my emacs frame showing correct list printing in the Geiser REPL"
		id="geiser-repl-list-good"
		class="desktop"
		/>
</div>
<p> THERE we go! Irritating to have to run these every new REPL, hopefully I can find a way to hook into the geiser repl to automate that. But for now, time to move on to</p>
<h4> Org Tangling </h4>
<p> We need some way of telling org how to tangle (read: export our source blocks to separate non-org files) our file appropriately. In combination with the config above, we can use the following line as the first line (all on one line pls!) of our relevant .org notes file, to tell org to use it for every source block in this file (note: you'll have to close and open the file after adding this to get Org to reload it properly): </p>
<Highlight language={lisp} code={`#+property: header-args :tangle (org-header-exercise-title-racket)
					 :padline no :comments no :exports code :results output silent :lang sicp`} />
<p> Wait, but what's   <span class="hljs"> :tangle (org-header-exercise-title-racket)</span>? By default, tangling sends ALL source blocks in a given file to the same file. That's not what I wanted! I wanted the ability to easily look at each exercise independently. I also don't want to tangle non-exercise src blocks! If I'm taking notes on a given chapter, that shouldn't be exported at all. The following elisp function gives org a filename corresponding to each src block found directly under an org header named "Exercise [whatever]", and tells it to "abort mission" otheriwse. Make sure the subdirectory you're pointing it at exists (or modify the following to create it):</p>

<Highlight language={lisp} code={org_header_excercise_title_racket}/>

<p> While in our org file, running the function <span class="hljs">org-babel-tangle</span> (default C-c C-v t) will output all our "exercise" src blocks to the directory we specify, each named by their closest header. And due to the <span class="hljs">lang: sicp</span> in our  <span class="hljs">#+property</span> org tag, we also get the  <span class="hljs">#lang sicp</span> line that tells Racket to run this with SICP scheme. Nice!</p>
<div class="center-image-flex">
	<img
		src={tangle_success}
		alt="pic of my emacs frame showing successful tangle to separate file"
		id="tangled-success"
		class="desktop"
		/>
</div>
<h3>Cherry on top: Bookmarking the whole setup</h3>
<p>Emacs natively has the ability to bookmark specific places in files (including Info nodes) via <span class="hljs">bookmark-save</span>. It also has the ability to save "where you're at" in terms of buffers and windows via <span class="hljs">desktop-save</span>, which will drop you back where you were the next time you load emacs. Neither of these is exactly what I want. I want to save my full buffer/window/place setup (like desktop-save) but have a list of different setups I can go to on-demand and not have that overwritten or loaded every time I open/close emacs (like bookmark-save). For this - I think? - I need an external package. There are 1000s of options for this; I chose one that's extremely simple and has what I need, which is <RainbowLink href="https://github.com/minad/bookmark-view">bookmark-view</RainbowLink>.

<p>A basic config in my init file:</p>
<Highlight language={lisp} code={bookmark_save}/>
<p>When I'm done for the session, I hit <span class="hljs">C-c b s</span> and overwrite the existing SICP bookmark. When I want to go back, whether that be from the middle of another project or in a fresh session or what have you, I hit  <span class="hljs">C-c b o</span> and my beautiful setup is loaded for me. Notes and REPL on the left, SICP in Info mode on the right: </p>
<div class="center-image-flex">
	<img
		src={sicp_tada}
		alt="pic of my prefered buffers for reading SICP"
		id="sicp-tada"
		class="desktop"
		/>
</div>
<h3>Beautiful!</h3>
<p>An example .org file and emacs init file are available in <RainbowLink href="https://github.com/jmgisele/sicp-emacs-2026">this github repo</RainbowLink> for those who'd like to replicate my setup here. Happy lisping!</p>
<p>ps if you figure out racket-mode in eval-in-repl PLEASE reach out!</p>
<style>
	.desktop {

		padding: 3rem 0rem;
		max-width: 800px;
	}

	@media screen and (max-width: 768px) {
		.desktop {
			width:100%;
		}
	}
</style>
