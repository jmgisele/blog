<script>
  export let checked;
  export let toggleTheme;
</script>

<label class="Toggle" for="toggle-theme">
  <!-- from  https://kittygiraudel.com/2021/04/05/an-accessible-toggle/#button-variant
thanks! -->
  <input
    type="checkbox"
    name="toggle-theme"
    id="toggle-theme"
    class="Toggle__input"
    {checked}
    on:change={toggleTheme}
  />
  <span class="Toggle__display" hidden>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="27"
      fill="currentColor"
      class="bi bi-cloud-sun-fill Toggle__icon Toggle__icon--sun"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M11.473 11a4.5 4.5 0 0 0-8.72-.99A3 3 0 0 0 3 16h8.5a2.5 2.5 0 0 0 0-5h-.027z"
      />
      <path
        d="M10.5 1.5a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0v-1zm3.743 1.964a.5.5 0 1 0-.707-.707l-.708.707a.5.5 0 0 0 .708.708l.707-.708zm-7.779-.707a.5.5 0 0 0-.707.707l.707.708a.5.5 0 1 0 .708-.708l-.708-.707zm1.734 3.374a2 2 0 1 1 3.296 2.198c.199.281.372.582.516.898a3 3 0 1 0-4.84-3.225c.352.011.696.055 1.028.129zm4.484 4.074c.6.215 1.125.59 1.522 1.072a.5.5 0 0 0 .039-.742l-.707-.707a.5.5 0 0 0-.854.377zM14.5 6.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"
      />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="27"
      fill="currentColor"
      class="bi bi-cloud-moon-fill Toggle__icon Toggle__icon--moon"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M11.473 11a4.5 4.5 0 0 0-8.72-.99A3 3 0 0 0 3 16h8.5a2.5 2.5 0 0 0 0-5h-.027z"
      />
      <path
        d="M11.286 1.778a.5.5 0 0 0-.565-.755 4.595 4.595 0 0 0-3.18 5.003 5.46 5.46 0 0 1 1.055.209A3.603 3.603 0 0 1 9.83 2.617a4.593 4.593 0 0 0 4.31 5.744 3.576 3.576 0 0 1-2.241.634c.162.317.295.652.394 1a4.59 4.59 0 0 0 3.624-2.04.5.5 0 0 0-.565-.755 3.593 3.593 0 0 1-4.065-5.422z"
      />
    </svg>
  </span>
</label>

<style>
  .Toggle {
    float: right;
    margin-right: 1ch;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    position: relative;
    margin-bottom: 1em;
    cursor: pointer;
    gap: 1ch;
  }

  .Toggle__input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
  }

  .Toggle__display {
    --offset: 0.25em;
    --diameter: 1.5em;

    display: inline-flex;
    align-items: center;
    justify-content: space-around;
    box-sizing: content-box;
    width: calc(var(--diameter) * 2 + var(--offset) * 2);
    height: calc(var(--diameter) + var(--offset) * 2);
    border: 0.1em solid var(--mauve);
    position: relative;
    border-radius: 100vw;
    background-color: var(--mantle);
    transition: 250ms;
  }

  .Toggle__display::before {
    content: "";
    z-index: 2;
    position: absolute;
    top: 50%;
    left: var(--offset);
    box-sizing: border-box;
    width: var(--diameter);
    height: var(--diameter);
    border: 0.1em solid var(--mauve);
    border-radius: 50%;
    background-color: var(--mauve);
    transform: translate(0, -50%);
    will-change: transform;
    transition: inherit;
  }

  .Toggle:focus .Toggle__display,
  .Toggle__input:focus + .Toggle__display {
    outline: 1px dotted var(--pink);
    outline: 1px auto -webkit-focus-ring-color;
    outline-offset: 2px;
  }

  .Toggle:focus,
  .Toggle:focus:not(:focus-visible) .Toggle__display,
  .Toggle__input:focus:not(:focus-visible) + .Toggle__display {
    outline: 0;
  }

  .Toggle__input:checked + .Toggle__display {
    background-color: var(--mantle);
  }

  .Toggle__input:checked + .Toggle__display::before {
    transform: translate(100%, -50%);
  }

  .Toggle__input:disabled + .Toggle__display {
    opacity: 0.6;
    filter: grayscale(40%);
    cursor: not-allowed;
  }

  .Toggle__icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    color: inherit;
    fill: currentcolor;
    vertical-align: middle;
    overflow: hidden;
  }

  .Toggle__icon--moon,
  .Toggle__icon--sun {
    color: var(--mauve);
  }

  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }
</style>
