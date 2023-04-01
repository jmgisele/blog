<script>
	import github from '../../assets/icons/github.svg';
	import linkedin from '../../assets/icons/linkedin.svg';
	import email from '../../assets/icons/email.svg';
	import rss from '../../assets/icons/rss-fill.svg';
	import phone from '../../assets/icons/phone.svg';
	import ClipboardTooltip from '../text_styling/ClipboardTooltip.svelte';
	import RainbowLink from '../text_styling/RainbowLink.svelte';
</script>

<ul>
	<li>
		<RainbowLink
			href="https://www.blog.jamesgisele.com/blog/rss"
			add_class="external-links"
			target="_blank"
			rel="noopener noreferrer"
		>
			<img src={rss} alt="" width="30" height="30" tabindex="-1" />
		</RainbowLink>
	</li>
	<li>
		<RainbowLink
			href="https://github.com/jmgisele/"
			add_class="external-links"
			target="_blank"
			rel="noopener noreferrer"
		>
			<img src={github} alt="" width="30" height="30" tabindex="-1" />
		</RainbowLink>
	</li>
	<li>
		<RainbowLink
			href="https://www.linkedin.com/in/james-gisele/"
			add_class="external-links"
			target="_blank"
			rel="noopener noreferrer"
		>
			<img src={linkedin} alt="" width="30" height="30" tabindex="-1" />
		</RainbowLink>
	</li>

	<li>
		<ClipboardTooltip
			textToCopy="503-708-4217"
			tooltipText="503-708-4217"
			id="phone"
			icon={phone}
		/>
	</li>
	<li>
		<ClipboardTooltip
			textToCopy="james.may.gisele@protonmail.com"
			tooltipText="james.may.gisele@protonmail.com"
			id="email"
			icon={email}
		/>
	</li>
</ul>

<style>
	* {
		margin: 0px;
		padding: 0px;
	}

	ul {
		list-style-type: none;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
	}
</style>
