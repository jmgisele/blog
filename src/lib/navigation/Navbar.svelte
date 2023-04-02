<script>
	import { base } from '$app/paths';
</script>

<nav class="navbar">
	<a href={`${base}/`}>Feed</a>
	<a href={`${base}/projects`}>Projects</a>
	<a href={`${base}/resume`}>Resume</a>
	<a href={`${base}/thoughts`}>Thoughts</a>
</nav>

<style>
	.navbar {
		display: flex;
		flex-direction: row;
		align-items: start;
		margin-top: 1em;
	}

	.navbar > :first-child {
		margin-left: 0px;
	}

	/* rainbow underline */

	a,
	*:before,
	*:after {
		position: relative;
		outline: none;
	}

	a {
		display: inline-block;
		font-size: 1.5rem;
		margin: 10px 20px;
		text-decoration: none;
		color: var(--peach);
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

	/* media queries */
	@media screen and (max-width: 768px) {
		.navbar {
			flex-direction: column;
			align-items: flex-end;
			width: 100%;
		}
	}
</style>
