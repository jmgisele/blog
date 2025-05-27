<script>
	export let id;
	export let isFocused = false;
</script>

<p>
	<a href="#{id}" id="foot-{id}" class="bottom {isFocused && 'pulse'}">^</a>
	<slot />
</p>

<style>
	p {
		color: var(--teal);
	}

	.bottom {
		display: inline-block;
	}

	p > a:first-child {
		color: var(--red);
		font-weight: bolder;
		position: relative;
		bottom: 0.5ex;
		text-decoration: none;
	}
</style>
