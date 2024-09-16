<script lang="ts">
  import Dropdown from "$lib/components/Dropdown.svelte";
  import healthRuleData from "$lib/data/healthRuleData.json";
  import { isHealthRuleNode, keyValToItems } from "$lib/helpers/functions";
  import { type IDropdownItem, type IHealthRuleNode, EHealthRuleExtraCondition } from "$lib/helpers/types";
  import { treeActions } from "$lib/stores";
  import { safeParse, array as varr, literal as vliteral, object as vobj, string as vstr, union as vunion } from 'valibot';
  
  type KEvent = KeyboardEvent & {
      currentTarget: EventTarget & HTMLInputElement;
  }
  type FEvent = FocusEvent & { currentTarget: EventTarget & HTMLInputElement }

  let {selectedNode, handleFocusIn, handleFocusOut, validateKeypress}: {
    selectedNode: IHealthRuleNode,
    handleFocusIn: (e: FEvent) => void,
    handleFocusOut: (e: FEvent) => void;
    validateKeypress: (e: KEvent) => void} = $props()

</script>


<div class="flex flex-col gap-1 mx-4 p-2 mt-2">
  <p class=" font-semibold">Method</p>
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
      onSelectItem: (itemId: string) => {
        if (!isHealthRuleNode(selectedNode) || !$treeActions.onUpdate) return;
        $treeActions.onUpdate(selectedNode, { ...selectedNode.value, method: itemId });
      },
    }}
  />
</div>

<div class="flex flex-col gap-1 mx-4 p-2">
  <p class="font-semibold">Health Range</p>
  <div class="grid grid-cols-[3fr_1fr_3fr] items-center w-full">
    <input
      onfocusin={handleFocusIn}
      onfocusout={handleFocusOut}
      onkeypress={validateKeypress}
      value={selectedNode.value.hpMin}
      type="text"
      class="w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:border-secondary-500 selection:bg-secondary-500"
    />
    <hr class="!mx-3 border-secondary-500/50" />
    <input
      onfocusin={handleFocusIn}
      onfocusout={handleFocusOut}
      onkeypress={validateKeypress}
      value={selectedNode.value.hpMax}
      type="text"
      class=" w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
    />
  </div>
</div>

<div class="flex flex-col gap-1 mx-4 p-2">
  <p class="font-semibold">Mana Range</p>
  <div class="grid grid-cols-[3fr_1fr_3fr] items-center w-full">
    <input
      onfocusin={handleFocusIn}
      onfocusout={handleFocusOut}
      onkeypress={validateKeypress}
      value={selectedNode.value.mpMin}
      type="text"
      class="w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
    />
    <hr class="!mx-3 border-secondary-500/50" />
    <input
      onfocusin={handleFocusIn}
      onfocusout={handleFocusOut}
      onkeypress={validateKeypress}
      value={selectedNode.value.mpMax}
      type="text"
      class=" w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
    />
  </div>
</div>

<div class="flex flex-col gap-1 mx-4 p-2">
  <p class=" font-semibold">Extra Condition</p>
  <Dropdown
    value={selectedNode.value.extraCondition}
    dropdownOptions={{
        options: keyValToItems({
          "0": "None",
          "1": "Bleeding",
          "2": "Burning",
          "3": "Cursed",
          "4": "Electrified",
          "5": "Paralyzed",
          "6": "Poisoned",
          }, "Status"),
        onSelectItem: (itemId: string) => {
          const id = itemId  as keyof typeof EHealthRuleExtraCondition 
          if (!isHealthRuleNode(selectedNode) || !$treeActions.onUpdate || !EHealthRuleExtraCondition[id]) return;
          $treeActions.onUpdate(selectedNode, { ...selectedNode.value, extraCondition: id });
        },
      }}
  />
</div>