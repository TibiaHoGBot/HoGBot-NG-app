<script lang="ts">
  import type { ITargetingRuleNode } from "$lib/helpers/types";

  let { selectedNode }: { selectedNode: ITargetingRuleNode } = $props();
</script>

<div class="flex flex-col gap-4 mx-4 mt-4">
  <div class="flex flex-col gap-2">
    <p class=" font-semibold">Monster Names</p>
    <input
      value={selectedNode.value.name}
      class="w-full text-sm p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
    />
  </div>

  <div class="flex flex-col gap-2 w-full">
    <p class=" font-semibold">Count</p>
    <input
      type="number"
      value={selectedNode.value.count}
      class="w-full text-sm p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
    />
  </div>

  <div class="flex flex-col gap-2 w-full">
    <p class=" font-semibold">Target Selection</p>
    <div class="grid grid-cols-3 gap-4">
      <div class="flex flex-col gap-1">
        <p class="text-xs">Health</p>
        <input
          maxlength={2}
          type="text"
          value={selectedNode.value.count}
          class="text-sm w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
        />
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-xs">Proximity</p>
        <input
          maxlength={2}
          type="text"
          value={selectedNode.value.count}
          class="text-sm w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
        />
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-xs">Stickiness</p>
        <input
          maxlength={2}
          type="text"
          value={selectedNode.value.count}
          class="text-sm w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
        />
      </div>
    </div>
  </div>
  <div class="flex flex-col gap-2 w-full">
    <p class=" font-semibold">Aux</p>
    <div class="flex items-center gap-2">
      <input
        class="relative bg-primary-500 w-4 h-4 text-xs border border-secondary-500/50 checked:before:content-['✓'] checked:before:absolute checked:before:left-1/2 checked:before:-translate-x-[50%] checked:before:top-0 appearance-none"
        type="checkbox"
        value={selectedNode.value.mustAttackMe}
      />
      <p class="text-xs">Must attack me</p>
    </div>
    <div class="flex items-center gap-2">
      <input
        class="relative bg-primary-500 w-4 h-4 text-xs border border-secondary-500/50 checked:before:content-['✓'] checked:before:absolute checked:before:left-1/2 checked:before:-translate-x-[50%] checked:before:top-0 appearance-none"
        type="checkbox"
        value={selectedNode.value.mustAttackMe}
      />
      <p class="text-xs">Only if trapped</p>
    </div>
  </div>
</div>
