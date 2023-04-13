<script>
	import { computePosition, flip, shift } from '@floating-ui/dom';
	import { onMount } from 'svelte';

	let tappedTwice = false;
	let isClicked = false;

	const clicked = (e) => {
		if (e.detail == 2 || e.code === 'Enter') {
			// double click
			isClicked = true;
			navigator.clipboard.writeText(textToCopy);
		}
	};

	const touched = (e) => {
		if (!tappedTwice) {
			tappedTwice = true;
			setTimeout(function () {
				tappedTwice = false;
			}, 300);
			return false;
		}
		isClicked = true;

		navigator.clipboard.writeText(textToCopy);
	};

	const reset = () => {
		document.getElementById(id).style.visibility = 'hidden';
		isClicked = false;
	};

	let tooltipPositioner = () => {
		const tooltips = document.querySelectorAll('.tooltip');

		tooltips.forEach((tip) => {
			let tooltip = document.getElementById(tip.id);
			let icon = document.getElementById(`${tip.id}-icon`);

			computePosition(icon, tooltip, {
				placement: 'bottom',
				middleware: [flip(), shift()]
			}).then(({ x, y }) => {
				Object.assign(tooltip.style, {
					left: `${x}px`,
					top: `${y}px`
				});
			});

			tooltip.style.display = 'block';
		});
	};

	onMount(() => {
		tooltipPositioner();
		window.addEventListener('resize', tooltipPositioner);
		return () => {
			window.removeEventListener('resize', tooltipPositioner);
		};
	});

	export let addedClasses = '';
	export let textToCopy;
	export let tooltipText;
	export let id;
</script>

<button
	class={`${addedClasses} rainbow`}
	on:click={(e) => clicked(e)}
	on:keypress={(e) => clicked(e)}
	on:touchstart={(e) => touched(e)}
	on:focusin={() => (document.getElementById(id).style.visibility = 'visible')}
	on:mouseenter={() => (document.getElementById(id).style.visibility = 'visible')}
	on:mouseleave={reset}
	on:focusout={reset}
	tabindex="0"
>
	<div class="tooltip" {id}>
		{tooltipText} <br />
		<span>
			{#if isClicked}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-clipboard-check"
					viewBox="0 0 16 16"
				>
					<path
						fill-rule="evenodd"
						d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"
					/>
					<path
						d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"
					/>
					<path
						d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"
					/>
				</svg>
			{:else}
				double click!
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-clipboard"
					viewBox="0 0 16 16"
				>
					<path
						d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"
					/>
					<path
						d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"
					/>
				</svg>
			{/if}
		</span>
	</div>
	<slot />
</button>

<style>
	* {
		margin: 0px;
		padding: 0px;
	}

	button {
		background-color: transparent;
		border: none;
		position: relative;
		display: inline-block;
		height: 40px;
		width: 40px;
		margin: 5px;
	}

	.tooltip svg {
		display: inline-block;
		position: relative;
		height: 1rem;
		line-height: 1rem;
	}

	.tooltip {
		display: none;
		width: max-content;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		box-sizing: border-box;
		visibility: hidden;
		background-color: var(--crust);
		border: 1px solid var(--green);
		padding: 10px;
		margin: 0px;
		line-height: 1rem;
		text-align: center;
		top: 100%;
		left: 50%;
		transition: all 0.1s linear;
	}

	.marg {
		margin: 5px;
	}

	/* rainbow */

	button.rainbow,
	*:before,
	*:after {
		position: relative;
		outline: none;
	}

	button.rainbow::before {
		content: '';
		position: absolute;
		visibility: hidden;
		width: 0%;
		height: 2px;
		bottom: -5px;
		left: 0;
	}

	button.rainbow:hover::before,
	button.rainbow:focus::before {
		visibility: visible;
		width: 100%;
		transition: visibility, width 0.5s ease-out;
	}

	button.rainbow:hover::before,
	button.rainbow:focus::before {
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
