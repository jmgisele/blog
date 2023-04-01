<script>
	export let href;
	export let add_class = '';
	export let target = '';
	export let rel = '';
</script>

<a {href} class={add_class} {target} {rel}><slot /></a>

<style>
	/* custom classes */
	.main-email {
		color: var(--flamingo);
		text-decoration: none;
		font-style: normal;
		display: inline;
		font-size: 1rem;
		padding: 0px;
		margin: 0px;
	}

	.main-email:hover {
		color: var(--flamingo);
	}

	.entry-title {
		padding: 0px;
		margin: 0px;
		flex-basis: 70%;
	}

	@media screen and (max-width: 768px) {
		.entry-title {
			flex-basis: 80%;
		}
	}

	.external-links {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 40px;
		width: 40px;
		margin: 5px;
	}

	.external-links * {
		margin: 5px;
	}

	/* global rainbow link styling */
	* {
		box-sizing: border-box;
		padding: 0;
		margin: 0;
	}

	a,
	*:before,
	*:after {
		position: relative;
		outline: none;
	}

	a {
		display: inline-block;
		text-decoration: none;
	}

	a::before {
		content: '';
		position: absolute;
		visibility: hidden;
		width: 0%;
		height: 2px;
		bottom: -5px;
		left: 0;
	}

	a:hover::before,
	a:focus::before {
		visibility: visible;
		width: 100%;
		transition: visibility, width 0.5s ease-out;
	}

	a:hover::before,
	a:focus::before {
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
