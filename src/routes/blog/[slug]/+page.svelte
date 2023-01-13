<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let entry_filename = $page.params.slug;
  let Main;

  onMount(async () => {
    Main = (await import(`../../../entries/${entry_filename}.svelte`)).default;
  });
</script>

<svelte:component this={Main} />