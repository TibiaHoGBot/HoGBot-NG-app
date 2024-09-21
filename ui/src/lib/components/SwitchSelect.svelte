<script lang="ts" generics="T extends UTargetingSettingKeys">
  import type {
    ISwitchSelectProps,
    UTargetingSettingKeys,
  } from "$lib/helpers/types";

  let { items, value, onSelectItem }: ISwitchSelectProps<T> = $props();

  let selectedItem:
    | {
        label: string;
        value: UTargetingSettingKeys;
      }
    | undefined = $state(undefined);

  $effect(() => {
    const label = items.find((obj) => obj["id"] === value)?.label;
    if (!label) return;
    selectedItem = {
      label: label,
      value: value,
    };
  });
</script>

<div class="relative flex items-center gap-2 w-full">
  <div
    class="w-full p-2 text-left text-sm border-[1px] border-secondary-500/50 !bg-primary-500 !outline-none focus:border-secondary-500"
  >
    {selectedItem ? selectedItem?.label : "None"}
  </div>
  <div class="absolute right-2 flex flex-col font-bold gap-3">
    <button
      onclick={() => {
        const currIdx = items.findIndex((i) => i.id === selectedItem?.value);

        if (currIdx === undefined) return;

        if (currIdx === items.length - 1) {
          onSelectItem(items[0].id);
        } else {
          onSelectItem(items[currIdx + 1].id);
        }
      }}
      class="w-2 h-2 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-white"
    ></button>
    <button
      onclick={() => {
        const currIdx = items.findIndex((i) => i.id === selectedItem?.value);
        if (currIdx === undefined) return;

        if (currIdx === 0) {
          onSelectItem(items[items.length - 1].id);
        } else {
          onSelectItem(items[currIdx - 1].id);
        }
      }}
      class="w-2 h-2 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white"
    ></button>
  </div>
</div>
