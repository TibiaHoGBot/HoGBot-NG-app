<script lang="ts">
  import type {
    IDropdownProps,
    IDropdownItem,
    INodeContext,
  } from "$lib/helpers/types";
  import { nodeContext } from "$lib/stores";

  let {
    value,
    dropdownOptions,
  }: {
    value: IDropdownItem["id"];
    dropdownOptions: IDropdownProps;
  } = $props();

  const { options, onSelectItem } = dropdownOptions;

  let selectedOption:
    | {
        label: string;
        value: string;
      }
    | undefined = $state(undefined);

  const handleDropdownBtnClick = (
    event: MouseEvent & {
      currentTarget: EventTarget & HTMLButtonElement;
    }
  ) => {
    //otherwise sets the nodeConext to undefined
    event.stopPropagation();

    const d: INodeContext = {
      context: "dropdownMenu",
      meta: { options, onSelectItem, selectedId: value },
    };

    nodeContext.set(d);
  };

  $effect(() => {
    const label = options.find((obj) => obj["id"] === value)?.label;
    // console.log(
    //   "id: ",
    //   value,
    //   " label: ",
    //   label,
    //   " options: ",
    //   JSON.stringify(options)
    // );
    if (!label) return;

    selectedOption = {
      label: label,
      value: value,
    };
  });
</script>

<div class="custom-dropdown relative w-full">
  <button
    type="button"
    onclick={handleDropdownBtnClick}
    class="w-full p-2 text-left text-sm border-[1px] border-secondary-500/50 !bg-primary-500 !outline-none focus:border-secondary-500"
  >
    {selectedOption ? selectedOption.label : "None"}
    <span
      class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
    >
      <svg
        class="h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </span>
  </button>
</div>
