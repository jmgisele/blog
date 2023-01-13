<script>
  import BackArrow from "../../../lib/back_arrow.svelte";
  import ThemeToggle from "../../../lib/ThemeToggle.svelte";
  import {theme, toggleTheme} from '../../../stores/global_theme'
</script>

<div class="body-wrapper {$theme}">
  <section class="main-body">
    <ThemeToggle checked={$theme === "light-theme"} {toggleTheme} />
    <BackArrow />
    <div class="blog-body">
      <slot />
    </div>
  </section>
</div>

<style>
  .main-body {
    padding: 1rem;

  }
  .blog-body {
    padding: 0 2em;
  }
</style>
