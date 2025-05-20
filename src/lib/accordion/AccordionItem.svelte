<script>
	import { getContext } from 'svelte';
	import { slide } from 'svelte/transition';
	import CaretToggle from '../icons/CaretToggle.svelte';

	export let title;
	export let id;

	const active = getContext('accordionState');

	$: open = $active === id;

	const onClickHandler = ({ target }) => {
		if (open) {
			$active = null;
		} else {
			$active = id;
		}
		const el = document.querySelector(target.getAttribute('data-scrollTo'));
		if (!el) return;
		el.scrollIntoView({
			behavior: 'smooth'
		});
	};

	let isHovered = false;
	let isFocused = false;
</script>

<li
	class="accordion-item"
	on:mouseenter={() => (isHovered = true)}
	on:mouseleave={() => (isHovered = false)}
	on:focus={() => (isFocused = true)}
	on:blur={() => (isFocused = false)}
>
	<button
		on:click={onClickHandler}
		data-scrollTo={'#item-' + id}
		class="accordion-header"
		class:hover-text={isHovered || isFocused}
		class:open-text={open}
		>{title}
		<CaretToggle expanded={open}></CaretToggle>
	</button>
	<div class="accordion-body" class:visible={open} id={'item-' + id} transition:slide>
		<slot name="body"></slot>
	</div>
</li>

<style>
	.accordion-item {
		padding: 1rem 0rem;
		list-style-type: none;
		width: 100%;
	}
	.accordion-header {
		background-color: transparent;
		width: 100%;
		text-align: left;
		color: var(--sky);
		border: none;
		font-size: 1.6rem;
	}
	.accordion-body {
		display: none;
		padding: 0rem 2rem;
	}
	.hover-text {
		color: var(--yellow);
	}
	.open-text {
		color: var(--peach);
	}
	.visible {
		display: block;
	}
</style>
