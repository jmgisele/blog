<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import ThemeToggle from "../../../lib/ThemeToggle.svelte";

  let theme;

  onMount(() => {
    theme = writable(localStorage.getItem("theme") || "dark-theme");
    theme.subscribe((val) =>
      localStorage.setItem(
        "theme",
        val === "dark-theme" ? "dark-theme" : "light-theme"
      )
    );
  });

  function toggleTheme() {
    $theme === "light-theme"
      ? theme.set("dark-theme")
      : theme.set("light-theme");
  }

  export let mainContent;
</script>

<div class="body-wrapper {$theme}">
  <section class="main-body">
    <ThemeToggle checked={$theme === "light-theme"} {toggleTheme} />
    <a href="/">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        fill="currentColor"
        class="bi bi-box-arrow-up-left"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M7.364 3.5a.5.5 0 0 1 .5-.5H14.5A1.5 1.5 0 0 1 16 4.5v10a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 14.5V7.864a.5.5 0 1 1 1 0V14.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-.5-.5H7.864a.5.5 0 0 1-.5-.5z"
        />
        <path
          fill-rule="evenodd"
          d="M0 .5A.5.5 0 0 1 .5 0h5a.5.5 0 0 1 0 1H1.707l8.147 8.146a.5.5 0 0 1-.708.708L1 1.707V5.5a.5.5 0 0 1-1 0v-5z"
        />
      </svg>
    </a>
    <div class="blog-body">
      <svelte:component this={mainContent} />
    </div>
  </section>
</div>

<style>
  .blog-body {
    padding: 0 2em;
  }
</style>
