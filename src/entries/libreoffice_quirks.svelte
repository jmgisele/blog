<script>
	import RainbowLink from "../lib/text_styling/RainbowLink.svelte";
</script>

<h1>LibreOffice on Arch doesn't install fallback fonts by default</h1>
<h3>aka 'No, page size and layout should and generally do not change between versions of LibreOffice or underlying platform'</h3>
<h4>a post in hopes I can save someone else some hours of fruitless googling</h4>
<p>Was getting involved in a new project which happens to generate .docx files this week and came across a conundrum. The file, as opened on my machine using a recent version of LibreOffice from the Arch official repos, had a single line on a new page. Basically, it looked like it was having that issue I always have on resumes: where no matter what I do, I have a single sentence on the next page.
</p>
<p>After checking with a main contributor, this seemed to be a "my machine" issue, not something the team had encountered before, and other contributors were using LibreOffice on Windows. We went down a few different potential routes before realizing that it was clearly a default fonts issue.
</p>
<p>On Windows, the default system fault is Calibri, so contributors who had created this document in LibreOffice on Windows had set the document's font to Calibri. Calibri is not a free font, so it does not get bundled with any Linux software. However, there is an alternative free font that was intended as a drop in alternative for Calibri, called <RainbowLink href="https://fonts.google.com/specimen/Carlito">Carlito.</RainbowLink>
</p>
<p> When a font is not available on a system, LibreOffice goes to a set of <RainbowLink href="https://help.libreoffice.org/latest/ar/text/shared/optionen/01010700.html?DbPAR=CALC&System=UNIX">user-defined fallbacks</RainbowLink>; essentially, users get to decide what graceful degradation looks like for themselves. This is pretty well documented, see above link. What is perhaps a little more difficult to determine via brief Google is that there's a set of built in fallback fonts that come pre-installed, hard-coded in the source <RainbowLink href="https://github.com/LibreOffice/core/blob/08874223db78571f75640aa2a4afc6d6cdd83d0f/vcl/source/font/PhysicalFontCollection.cxx#L1006">here.</RainbowLink>

</p>
<p>Ordinarily this shouldn't need documenting because these fonts all come bundled with LibreOffice! You should get this for free (har har). However, <RainbowLink href="https://wiki.archlinux.org/title/LibreOffice#Fonts"> on Arch,</RainbowLink> these are separate packages which the user must install separately and at their discretion.
<p>
<p> So, confusingly: if you don't have Carlito or Calibri in your system fonts, you'll likely see something very off-looking when opening a document generated from a Windows user's LibreOffice install. If you DO have Carlito installed, LibreOffice will silently use that as a hard-coded fallback font (alongside a few others) without any need to set this within your user-level fallback font preferences AND without any clear indication in preferences/settings that this fallback case is handled by default. If you have a keen enough eye and a distinct enough default font installed to tell your system font from Calibri/Carlito this is probably obvious immediately. But if all you see is an otherwise well-formatted page with a single line inexplicably-and-not-reproducible-between-machines-edly on the next page, perhaps it's a bit more of a headache :)
</p>
	<style>


	</style>
