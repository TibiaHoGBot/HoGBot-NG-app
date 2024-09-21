<script lang="ts">
  import type { IDropdownItem, IHealthRuleNode } from "$lib/helpers/types";
  import { nodeContext, selectedNode } from "$lib/stores";
  import { onMount } from "svelte";
  let {
    items,
    selectedItemId,
    onSelectItem,
  }: {
    items: IDropdownItem[];
    selectedItemId: string | number;
    onSelectItem: (itemId: string | number) => void;
  } = $props();

  let searchPhrase = $state("");
  let searchBarElement: HTMLInputElement | undefined = $state(undefined);

  let shownItems = $derived.by(() => {
    return items.filter((item) =>
      item.label.toLowerCase().includes(searchPhrase.toLowerCase())
    );
  });

  let node = $selectedNode as IHealthRuleNode;

  onMount(() => {
    searchBarElement?.focus();
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  onclick={(e) => {
    e.stopPropagation();
  }}
  class="absolute left-0 top-5 ml-[160px] w-[calc((100%-60px)-200px)] h-full max-h-[86%] rounded-md"
>
  <div class="bg-primary-500 rounded-lg h-full">
    <form class="flex items-center w-full mx-auto bg-primary-500 rounded-lg">
      <label for="simple-search" class="sr-only">Search</label>
      <div class="relative w-full">
        <div
          class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
        >
          <svg
            class="w-4 h-4 text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          bind:this={searchBarElement}
          bind:value={searchPhrase}
          type="text"
          id="simple-search"
          class="bg-primary-500 selection:bg-secondary-500 block w-full ps-10 p-2.5 ring-0 border-0 focus-within:outline-none rounded-md"
          placeholder="Search for a method..."
          required
        />
      </div>

      <span
        class="px-2 pt-1 pb-2 mr-1 rounded-md bg-primary-700 text-[8px] font-bold xl:inline-flex text-center"
        >ESC</span
      >
    </form>
    <div
      class="flex flex-col gap-2 p-2 bg-primary-500 rounded-b-lg h-full overflow-y-scroll"
    >
      {#each shownItems as { category, label, id, icon }}
        <div
          onclick={(_e) => {
            onSelectItem(id);
            nodeContext.set(undefined);
          }}
          class:bg-secondary-500={selectedItemId === id}
          class:hover:bg-secondary-500={selectedItemId === id}
          class="flex items-center gap-4 bg-primary-600 rounded-md p-2 hover:bg-secondary-400/50 cursor-pointer group"
        >
          {#if icon}
            <div
              class="p-1 rounded-lg bg-primary-700 font-bold group-hover:bg-secondary-400"
            >
              {@html icon}
            </div>
          {/if}

          <div class="flex flex-col">
            <span
              class="py-1 px-2 rounded-lg bg-primary-700 text-xs font-bold w-fit group-hover:bg-secondary-400"
              >{category}</span
            >
            <span>{label}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
