<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="rainbow" tabindex="0">
	<slot />
</div>

<style>
	/* rainbow link styling */
	div.rainbow,
	*:before,
	*:after {
		position: relative;
		outline: none;
	}

	div.rainbow::before {
		content: '';
		position: absolute;
		visibility: hidden;
		width: 0%;
		height: 2px;
		bottom: -5px;
		left: 0;
	}

	div.rainbow:hover::before,
	div.rainbow:focus::before {
		visibility: visible;
		width: 100%;
		transition: visibility, width 0.5s ease-out;
	}

	div.rainbow:hover::before,
	div.rainbow:focus::before {
		background: linear-gradient(
			315deg,
			var(--rosewater) 0%,
			var(--flamingo) 5%,
			var(--pink) 10%,
			var(--mauve) 15%,
			var(--red) 20%,
			\var(--yellow)25%,
			var(--green) 30%,
			var(--teal) 35%,
			var(--sky) 40%,
			var(--blue) 45%,
			var(--lavender) 50%,
			var(--blue) 55%,
			var(--sky) 60%,
			var(--teal) 65%,
			var(--green) 70%,
			var(--yellow) 75%,
			var(--red) 80%,
			var(--mauve) 85%,
			var(--pink) 90%,
			var(--flamingo) 95%
		);
		animation: rain_bow 4s linear infinite;
		background-size: 400% 400%;
	}

	@keyframes rain_bow {
		0% {
			background-position: 0% 0%;
		}

		50% {
			background-position: 100% 100%;
		}

		100% {
			background-position: 0% 0%;
		}
	}
</style>
