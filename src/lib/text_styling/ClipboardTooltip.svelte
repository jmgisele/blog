<script>
	import clipboard from '../../assets/icons/clipboard.svg';
	import clipboardCheck from '../../assets/icons/clipboard-check.svg';
	import { onMount } from 'svelte';
	import RainbowOutline from './RainbowOutline.svelte';

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
		// document.getElementById(id).style.visibility = 'visible';
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

	const touchEnd = (e) => {
		// document.getElementById(id).style.visibility = 'hidden';
	};

	const reset = () => {
		isClicked = false;
	};

	onMount(() => {
		const el = document.getElementById(id);

		let toolRect = el.getBoundingClientRect();
		let iconRect = document.getElementById(`${id}-icon`).getBoundingClientRect();

		let tipX = iconRect.width / 2 + 5;

		if (toolRect.right > window.innerWidth) {
			tipX += 2 * (toolRect.width - window.innerWidth);
		}
		el.style.left = tipX + 'px';
	});

	export let addedClasses = '';
	export let textToCopy;
	export let tooltipText;
	export let id;
	export let icon;
</script>

<button
	class={`${addedClasses} rainbow`}
	on:click={(e) => clicked(e)}
	on:keypress={(e) => clicked(e)}
	on:touchstart={(e) => touched(e)}
	on:touchend={(e) => touchEnd(e)}
	on:mouseleave={reset}
	on:focusout={reset}
	tabindex="0"
>
	<div class="tooltip" {id}>
		{tooltipText} <br />
		<span>
			{#if isClicked}
				<img src={clipboardCheck} alt="" tabindex="-1" />
			{:else}
				double click!
				<img src={clipboard} alt="" tabindex="-1" />
			{/if}
		</span>
	</div>
	<img src={icon} alt="" class="icon" id="{id}-icon" width="30" height="30" tabindex="-1" />
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

	.tooltip img {
		display: inline-block;
		position: relative;
		height: 1rem;
		line-height: 1rem;
		top: 6px;
	}

	.tooltip {
		z-index: 1;
		box-sizing: border-box;
		position: absolute;
		visibility: hidden;
		background-color: var(--crust);
		border: 1px solid var(--green);
		width: fit-content;
		height: fit-content;
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

	button:focus .tooltip,
	button:hover .tooltip {
		visibility: visible;
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
