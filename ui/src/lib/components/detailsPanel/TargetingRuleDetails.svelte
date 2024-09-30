<script lang="ts">
  import type { ITargetingRuleNode } from "$lib/helpers/types";
  import { treeActions } from "$lib/stores";
  type KEvent = KeyboardEvent & {
    currentTarget: EventTarget & HTMLInputElement;
  };
  type FEvent = FocusEvent & { currentTarget: EventTarget & HTMLInputElement };

  let {
    selectedNode,
    handleFocusIn,
    handleFocusOut,
    validateKeypress,
  }: {
    selectedNode: ITargetingRuleNode;
    handleFocusIn: (e: FEvent) => void;
    handleFocusOut: (e: FEvent) => void;
    validateKeypress: (e: KEvent) => void;
  } = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  draggable="false"
  onmouseup={(e) => e.preventDefault()}
  ondragstart={(e) => e.preventDefault()}
  class="flex flex-col gap-4 mx-4 mt-4 p-4 border border-primary-500/50 rounded-lg"
>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <p class="font-semibold text-sm">Monster Names</p>
      <input
        onkeypress={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        onfocusout={(e) => {
          if (!$treeActions.onUpdate) return;
          $treeActions.onUpdate(selectedNode, {
            ...selectedNode.value,
            name: e.currentTarget.value,
          });
        }}
        value={selectedNode.value.name}
        class="w-full text-sm p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
      />
    </div>

    <div class="flex flex-col gap-2 w-full">
      <p class="font-semibold text-sm">Count</p>
      <input
        onfocusin={handleFocusIn}
        onfocusout={(e) => {
          handleFocusOut(e);
          if (!$treeActions.onUpdate) return;
          $treeActions.onUpdate(selectedNode, {
            ...selectedNode.value,
            count: parseInt(e.currentTarget.value),
          });
        }}
        onkeypress={validateKeypress}
        type="text"
        value={selectedNode.value.count}
        class="w-full text-sm p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
      />
    </div>

    <div class="flex flex-col gap-2 w-full">
      <p class="font-semibold text-sm">Target Selection</p>
      <div class="grid grid-cols-3 gap-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs">Health</p>
          <input
            onfocusin={handleFocusIn}
            onfocusout={(e) => {
              handleFocusOut(e);
              if (!$treeActions.onUpdate) return;
              $treeActions.onUpdate(selectedNode, {
                ...selectedNode.value,
                targetSelection: {
                  ...selectedNode.value.targetSelection,
                  health: parseInt(e.currentTarget.value),
                },
              });
            }}
            onkeypress={validateKeypress}
            maxlength={2}
            type="text"
            value={selectedNode.value.count}
            class="text-sm w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="text-xs">Proximity</p>
          <input
            onfocusin={handleFocusIn}
            onfocusout={(e) => {
              handleFocusOut(e);
              if (!$treeActions.onUpdate) return;
              $treeActions.onUpdate(selectedNode, {
                ...selectedNode.value,
                targetSelection: {
                  ...selectedNode.value.targetSelection,
                  proximity: parseInt(e.currentTarget.value),
                },
              });
            }}
            onkeypress={validateKeypress}
            maxlength={2}
            type="text"
            value={selectedNode.value.count}
            class="text-sm w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="text-xs">Stickiness</p>
          <input
            onfocusin={handleFocusIn}
            onfocusout={(e) => {
              handleFocusOut(e);
              if (!$treeActions.onUpdate) return;
              $treeActions.onUpdate(selectedNode, {
                ...selectedNode.value,
                targetSelection: {
                  ...selectedNode.value.targetSelection,
                  stickiness: parseInt(e.currentTarget.value),
                },
              });
            }}
            onkeypress={validateKeypress}
            maxlength={2}
            type="text"
            value={selectedNode.value.count}
            class="text-sm w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2 w-full">
      <p class="font-semibold text-sm">Aux</p>
      <div class="flex items-center gap-2">
        <input
          class="relative bg-primary-500 w-4 h-4 text-xs border border-secondary-500/50 checked:before:content-['✓'] checked:before:absolute checked:before:left-1/2 checked:before:-translate-x-[50%] checked:before:top-0 appearance-none"
          type="checkbox"
          value={selectedNode.value.mustAttackMe}
          onchange={(e) => {
            if (!$treeActions.onUpdate) return;
            $treeActions.onUpdate(selectedNode, {
              ...selectedNode.value,
              mustAttackMe: e.currentTarget.checked,
            });
          }}
        />
        <p class="text-xs">Must attack me</p>
      </div>
      <div class="flex items-center gap-2">
        <input
          class="relative bg-primary-500 w-4 h-4 text-xs border border-secondary-500/50 checked:before:content-['✓'] checked:before:absolute checked:before:left-1/2 checked:before:-translate-x-[50%] checked:before:top-0 appearance-none"
          type="checkbox"
          value={selectedNode.value.mustAttackMe}
          onchange={(e) => {
            if (!$treeActions.onUpdate) return;
            $treeActions.onUpdate(selectedNode, {
              ...selectedNode.value,
              onlyIfTrapped: e.currentTarget.checked,
            });
          }}
        />
        <p class="text-xs">Only if trapped</p>
      </div>
    </div>
  </div>
</div>
