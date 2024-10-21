<script lang="ts">
  import Dropdown from "$lib/components/Dropdown.svelte";
  import healthRuleData from "$lib/data/healthRuleData.json";
  import { isHealthRuleNode, keyValToItems } from "$lib/helpers/functions";
  import { type IDropdownItem, type IHealthRuleNode, EHealthRuleExtraCondition } from "$lib/helpers/types";
  import { selectedParentNode, treeActions } from "$lib/stores";
  import { safeParse, array as varr, literal as vliteral, object as vobj, string as vstr, union as vunion } from 'valibot';
  
  type KEvent = KeyboardEvent & {
      currentTarget: EventTarget & HTMLInputElement;
  }
  type FEvent = FocusEvent & { currentTarget: EventTarget & HTMLInputElement }

  let {selectedNode, handleFocusIn, handleFocusOut, validateKeypress}: {
    selectedNode: IHealthRuleNode,
    handleFocusIn: (e: FEvent) => void,
    handleFocusOut: (e: FEvent) => number | null;
    validateKeypress: (e: KEvent) => void} = $props()

  const disableDrag = (e: DragEvent & {
    currentTarget: EventTarget & HTMLInputElement;
  }) => {
    e.preventDefault()
  }
</script>

<div class="flex flex-col gap-4 mx-4 mt-4 p-4 border border-primary-500/50 rounded-lg">
  <div class="flex flex-col gap-1 mt-2">
    <p class="font-semibold text-sm">Method</p>
    <Dropdown
      value={selectedNode.value.method}
      dropdownOptions={{
        options: (() => {
          const schema = varr(vobj({
            id: vstr(),
            label: vstr(),
            category: vunion([vliteral("Potions"), vliteral("Spells"), vliteral("Runes")]),
            }))
          const result = safeParse(schema, healthRuleData);
          if (!result.success) return [];
          const parsed: IDropdownItem[] = result.output;
          return parsed;
        })(),
        onSelectItem: (itemId) => {
          if (!isHealthRuleNode(selectedNode) || !$treeActions.onUpdate || typeof itemId !== "string") return;
          $treeActions.onUpdate(selectedNode, { ...selectedNode.value, method: itemId }, "healthRule",  $selectedParentNode);
        },
      }}
    />
  </div>

  <div class="flex flex-col gap-1">
    <p class="font-semibold text-sm">Health Range</p>
    <div class="grid grid-cols-[3fr_1fr_3fr] items-center w-full">
      <input
        onfocusin={handleFocusIn}
        onfocusout={(e) => {
          const oldVal = selectedNode.value.hpMin;
          const newVal = handleFocusOut(e);
          if (!newVal) return
          e.currentTarget.value = newVal.toString()
          if (oldVal === newVal || !$treeActions?.onUpdate) return;
          $treeActions.onUpdate(selectedNode, {...selectedNode.value, hpMin: newVal}, "healthRule",  $selectedParentNode)
        }}
        onkeypress={validateKeypress}
        ondragstart={disableDrag}
        onmouseup={(e) => e.preventDefault()}
        draggable="false"
        value={selectedNode.value.hpMin}
        type="text"
        class="w-full p-2 border-[1px] border-secondary-500/50 drag bg-primary-500 text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:border-secondary-500 selection:bg-secondary-500"
      />
      <hr class="!mx-3 border-secondary-500/50" />
      <input
        onfocusin={handleFocusIn}
        onfocusout={(e) => {
          const oldVal = selectedNode.value.hpMax;
          const newVal = handleFocusOut(e);
          if (!newVal) return
          e.currentTarget.value = newVal.toString()
          if (oldVal === newVal || !$treeActions?.onUpdate) return;
          $treeActions.onUpdate(selectedNode, {...selectedNode.value, hpMax: newVal}, "healthRule",  $selectedParentNode)
        }}
        onkeypress={validateKeypress}
        ondragstart={disableDrag}
        onmouseup={(e) => e.preventDefault()}
        value={selectedNode.value.hpMax}
        type="text"
        class=" w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
      />
    </div>
  </div>
  
  <div class="flex flex-col gap-1">
    <p class="font-semibold text-sm">Mana Range</p>
    <div class="grid grid-cols-[3fr_1fr_3fr] items-center w-full">
      <input
        onfocusin={handleFocusIn}
        onfocusout={(e) => {
          const oldVal = selectedNode.value.mpMin;
          const newVal = handleFocusOut(e);
          if (!newVal) return
          e.currentTarget.value = newVal.toString()
          if (oldVal === newVal || !$treeActions?.onUpdate) return;
          $treeActions.onUpdate(selectedNode, {...selectedNode.value, mpMin: newVal}, "healthRule",  $selectedParentNode)
        }}
        onkeypress={validateKeypress}
        ondragstart={disableDrag}
        onmouseup={(e) => e.preventDefault()}
        value={selectedNode.value.mpMin}
        type="text"
        class="w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
      />
      <hr class="!mx-3 border-secondary-500/50" />
      <input
        onfocusin={handleFocusIn}
        onfocusout={(e) => {
      
          const oldVal = selectedNode.value.mpMax;
          const newVal = handleFocusOut(e);
          if (!newVal) return
          e.currentTarget.value = newVal.toString()
          if (oldVal === newVal || !$treeActions?.onUpdate) return;
          $treeActions.onUpdate(selectedNode, {...selectedNode.value, mpMax: newVal}, "healthRule",  $selectedParentNode)
        }}
        onkeypress={validateKeypress}
        ondragstart={disableDrag}
        onmouseup={(e) => e.preventDefault()}
        value={selectedNode.value.mpMax}
        type="text"
        class=" w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
      />
    </div>
  </div>
  
  <div class="flex flex-col gap-1">
    <p class="font-semibold text-sm">Extra Condition</p>
    <Dropdown
      value={selectedNode.value.extraCondition}
      dropdownOptions={{
          options: keyValToItems(EHealthRuleExtraCondition, "Status"),
          onSelectItem: (itemId) => {
            const id = itemId  as typeof EHealthRuleExtraCondition[keyof typeof EHealthRuleExtraCondition] 
            if (!isHealthRuleNode(selectedNode) || !$treeActions.onUpdate) return;
            $treeActions.onUpdate(selectedNode, { ...selectedNode.value, extraCondition: id }, "healthRule",  $selectedParentNode);
          },
        }}
    />
  </div>
</div>
