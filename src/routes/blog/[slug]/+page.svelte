<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import BlogLayout from "./blog_layout.svelte";

  let entry_filename = $page.params.slug;
  let Main;

  onMount(async () => {
    Main = (await import(`../../../entries/${entry_filename}.svelte`)).default;
  });
</script>

<BlogLayout mainContent={Main} />
