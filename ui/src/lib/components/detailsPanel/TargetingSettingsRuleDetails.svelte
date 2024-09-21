<script lang="ts">
  import spellData from "$lib/data/spellData.json";
  import { isTargetingSettingRuleNode, keyValToItems } from "$lib/helpers/functions";
  import { EAttackAvoidance, EAttackSettings, EDesiredDistance, EDesiredStance, type IDropdownItem, type ITargetingSettingsRuleNode } from "$lib/helpers/types";
  import { treeActions } from "$lib/stores";
  import { safeParse, array as varr, object as vobj, string as vstr } from 'valibot';

  import DoubleInput from "$lib/components/DoubleInput.svelte";
  import Dropdown from "$lib/components/Dropdown.svelte";
  import SwitchSelect from "$lib/components/SwitchSelect.svelte";
  
  type KEvent = KeyboardEvent & {
      currentTarget: EventTarget & HTMLInputElement;
  }
  type FEvent = FocusEvent & { currentTarget: EventTarget & HTMLInputElement }

  let {selectedNode, handleFocusIn, handleFocusOut, validateKeypress}: {
    selectedNode: ITargetingSettingsRuleNode,
    handleFocusIn: (e: FEvent) => void,
    handleFocusOut: (e: FEvent) => void;
    validateKeypress: (e: KEvent) => void} = $props()


  let dropdowns: Array<{label: string, fieldName: keyof Pick<ITargetingSettingsRuleNode["value"], "firstSpell" | "secondSpell" | "thirdSpell" | "lureSpell">}> = [
  {label: "First Spell", fieldName: "firstSpell"},
  {label: "Second Spell", fieldName: "secondSpell"},
  {label: "Third Spell", fieldName: "thirdSpell"},
  {label: "Lure Spell", fieldName: "lureSpell"}]

  let spellList = (() => {
    const schema = varr(vobj({
              id: vstr(),
              label: vstr(),
              category: vstr(),
          }))

    const result = safeParse(schema, spellData);
    if (!result.success) return [];
    const parsed: IDropdownItem[] = [{id: "-1", label: "None", category: "None"}, ...result.output];
    return parsed;}
        )()

</script>
 <div class="flex flex-col gap-2 mx-4 mt-4">
  <DoubleInput label="Health Min" labelTwo="Health Max">
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
  </DoubleInput>

  <DoubleInput label={"Attack Mode"} labelTwo={"Attack Avoidance"}>
    <SwitchSelect 
        onSelectItem={(itemId: typeof EAttackSettings[keyof typeof EAttackSettings]) => {
          if (!isTargetingSettingRuleNode(selectedNode) || !$treeActions.onUpdate) return;
          $treeActions.onUpdate(selectedNode, {...selectedNode.value, attackMode: itemId})
         
        }}
        value={selectedNode.value.attackMode}
        items={keyValToItems(EAttackSettings)}
    />
    <hr class="!mx-3 border-secondary-500/50" />
    <SwitchSelect 
        onSelectItem={(itemId: typeof EAttackAvoidance[keyof typeof EAttackAvoidance]) => {
          if (!isTargetingSettingRuleNode(selectedNode) || !$treeActions.onUpdate) return;
          $treeActions.onUpdate(selectedNode, {...selectedNode.value, attackAvoidance: itemId})
        }}
        value={selectedNode.value.attackAvoidance}
        items={keyValToItems(EAttackAvoidance)}
     />
  </DoubleInput>

  <DoubleInput label={"Desired Stance"} labelTwo={"Desired Distance"}>
    <SwitchSelect 
      onSelectItem={(itemId: typeof EDesiredStance[keyof typeof EDesiredStance]) => {
        if (!isTargetingSettingRuleNode(selectedNode) || !$treeActions.onUpdate) return;
        $treeActions.onUpdate(selectedNode, {...selectedNode.value, desiredStance: itemId})
      }}
      value={selectedNode.value.desiredStance}
      items={keyValToItems(EDesiredStance)}
    />
    <hr class="!mx-3 border-secondary-500/50" />
    <SwitchSelect 
      onSelectItem={(itemId: typeof EDesiredDistance[keyof typeof EDesiredDistance]) => {
        if (!isTargetingSettingRuleNode(selectedNode) || !$treeActions.onUpdate) return;
          $treeActions.onUpdate(selectedNode, {...selectedNode.value, desiredDistance: itemId})
        }}
      value={selectedNode.value.desiredDistance}
      items={keyValToItems(EDesiredDistance)}
    />   
  </DoubleInput>


  {#each dropdowns as {label, fieldName}}
    <div class="flex flex-col gap-1">
      <p class=" font-semibold">{label}</p>         
      <Dropdown
        value={selectedNode.value[fieldName] ?? "None"}
        dropdownOptions={{
          options: spellList,
          onSelectItem: (itemId: string) => {
            if (!isTargetingSettingRuleNode(selectedNode) || !$treeActions.onUpdate) return;
            $treeActions.onUpdate(selectedNode, { ...selectedNode.value, [fieldName]: itemId });
          },
        }}
      />
    </div>
  {/each}
</div>