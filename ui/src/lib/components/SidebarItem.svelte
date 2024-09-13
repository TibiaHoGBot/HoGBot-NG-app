<script lang="ts">
  let {
    currentTab = $bindable(),
    unselectNode,
    value,
    icon,
  }: {
    currentTab: number;
    unselectNode: () => void;
    value: number;
    icon: string;
  } = $props();
</script>

<button
  class:bg-secondary-500={currentTab === value}
  onclick={() => ((currentTab = value), unselectNode())}
  class={`flex items-center justify-center w-[60px] h-[60px] cursor-pointer ${currentTab !== value ? "hover:bg-secondary-400/50" : ""}`}
>
  {@html icon}
</button>
