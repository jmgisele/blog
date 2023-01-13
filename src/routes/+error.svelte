<script>
  import {theme, toggleTheme} from '../stores/global_theme'
  import ThemeToggle from "../lib/ThemeToggle.svelte";
	import { page } from '$app/stores';

</script>

<div class="body-wrapper {$theme}">
  <div class="main-body">
    <ThemeToggle checked={$theme === "light-theme"} {toggleTheme} />
    <h1>{$page.status} {$page.error.message}</h1>

  </div>
</div>

<style>
  h1 {
    text-align: center;
  }
</style>