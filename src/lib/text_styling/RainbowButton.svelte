<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<button class="rainbow" tabindex="0" on:click on:keypress>
	<slot />
</button>

<style>
	button.rainbow {
		background-color: var(--surface0);
		outline: none;
		color: var(--yellow);
		border: 2px solid var(--surface1);
		border-radius: 3px;
		font-weight: bold;
	}

	/* rainbow link styling */
	.rainbow,
	*:before,
	*:after {
		position: relative;
		outline: none;
	}

	.rainbow::before {
		content: '';
		position: absolute;
		visibility: hidden;
		width: 0%;
		height: 2px;
		bottom: -8px;
		left: 0;
	}

	.rainbow:hover::before,
	.rainbow:focus::before {
		visibility: visible;
		width: 100%;
		transition: visibility, width 0.5s ease-out;
	}

	.rainbow:hover::before,
	.rainbow:focus::before {
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
