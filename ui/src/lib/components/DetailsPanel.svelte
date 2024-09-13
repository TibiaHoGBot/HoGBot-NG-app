<script lang="ts">
  import IconArrowsMaximize from "$lib/assets/arrows-maximize.svg?raw";
  import IconEdit from "$lib/assets/edit.svg?raw";
  import Dropdown from "$lib/components/Dropdown.svelte";
  import healthRuleData from "$lib/data/healthRuleData.json";
  import spellData from "$lib/data/spellData.json";
  import { isHealthRuleNode, isTargetingSettingRuleNode } from "$lib/helpers/functions";
  import {
    EAttackAvoidance,
    EAttackSettings,
    EDesiredDistance,
    EDesiredStance,
    EHealthRuleExtraCondition,
    type IDropdownItem
  } from "$lib/helpers/types";
  import { nodeContext, selectedNode, treeActions } from "$lib/stores";
  import { safeParse, array as varr, literal as vliteral, object as vobj, string as vstr, union as vunion } from 'valibot';
  import CodeEditor from "./CodeEditor.svelte";
  import SwitchSelect from "./SwitchSelect.svelte";
  import DoubleInput from "./DoubleInput.svelte";
  
  let {editorValue = $bindable()}: {editorValue: string;} = $props()
  
  let isEditingLabel = $state(false);
  let labelElement: HTMLInputElement | undefined = $state(undefined);

  let cNodeLabelBg = $derived.by(() => {
    if ($selectedNode && "value" in $selectedNode && "enabled" in $selectedNode.value) {
      if ($selectedNode.value.enabled === true) {
        return "bg-success-500 text-black";
      } else if ($selectedNode?.value?.enabled === false) {
        return "bg-error-500";
      }
    } else {
      return "bg-secondary-500";
    }
  });

  const handleFocusIn = (
    e: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    e.currentTarget.setSelectionRange(0, -1);
  };

  const handleFocusOut = (
    e: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    const num = parseInt(e.currentTarget.value);

    if (num == null || isNaN(num)) {
      e.preventDefault();
      return;
    }

    if (num < 0) {
      e.currentTarget.value = "0";
    } else if (num > 100) {
      e.currentTarget.value = "100";
    } else {
      e.currentTarget.value = num.toString();
    }
  };

  const validateKeypress = (
    e: KeyboardEvent & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) => {
    if (e.key === "Enter") e.currentTarget.blur();
    if (!/^\d*$/.test(e.key)) {
      console.log(e.key);
      e.preventDefault();
    }
  };
 
  $effect(() => {
    if (isEditingLabel && labelElement !== undefined) {
      labelElement.focus();
    }
  });
</script>

<div class="h-full flex flex-col gap-1">
  {#if $selectedNode}
    <div
      class="flex justify-center items-center mx-4 mt-4 rounded-sm {cNodeLabelBg} "
    >
      <div
        role="button"
        tabindex="0"
        aria-label="Double click to rename node"
        class="relative flex w-full h-full cursor-default"
        ondblclick={(e) => (isEditingLabel = true)}
      >
        {#if isEditingLabel}
          <div class="absolute top-0 right-0 p-2">{@html IconEdit}</div>
          <input
            bind:this={labelElement}
            onkeydown={(e) => {
              if (e.key === "Escape") {
                isEditingLabel = false;
              } else if (
                e.key === "Enter" &&
                $treeActions.onRename &&
                labelElement
              ) {
                $treeActions.onRename($selectedNode, labelElement.value);
                isEditingLabel = false;
              }
            }}
            onfocusout={(e) => {
              isEditingLabel = false;
            }}
            class="text-xl text-center font-bold mx-auto p-2 w-full {cNodeLabelBg} selection:bg-primary-500 outline-none border border-secondary-400"
            value={$selectedNode.label}
          />
        {:else}
          <p class="text-xl font-bold mx-auto p-2">
            {$selectedNode.label}
          </p>
        {/if}
      </div>
    </div>
    {#if "value" in $selectedNode && "code" in $selectedNode.value}
    <div class="relative h-[600px] p-4 group">
      <button
      class="invisible group-hover:visible absolute  -translate-x-[4px] translate-y-[4px] right-0 top-0 z-[10]"
      onclick={(e) => {
     
        e.stopImmediatePropagation();
        nodeContext.set({
          context: "codeEditor",
        });
      }}
    >
      {@html IconArrowsMaximize}
    </button>
    <div class="h-3/4 bg-primary-600 overflow-y-scroll group-focus-within:border group-focus-within:border-secondary-500">
      {#if !$nodeContext}
        <CodeEditor bind:editorValue code={$selectedNode.value.code}/> 
      {/if}
    </div>
    <div class="flex items-center justify-center mt-4 ">    
      <button
          onclick={(_e) => {
            if (!$treeActions.onUpdate) return;
            $treeActions.onUpdate($selectedNode, {
              ...$selectedNode.value,
              code: editorValue,
            });
          }}
          disabled={editorValue === $selectedNode.value.code}
          class="p-2 btn font-semibold hover:bg-secondary-500/50 border border-secondary-600 w-full"
          >SAVE
      </button>
      </div>
    </div>
    {:else if "value" in $selectedNode && "method" in $selectedNode.value}
      {@const items = (() => {

      const schema = varr(vobj({
          id: vstr(),
          label: vstr(),
          category: vunion([vliteral("Potions"), vliteral("Spells"), vliteral("Runes")]),
      }))

      const result = safeParse(schema, healthRuleData);
      
      if (!result.success) return [];

      const parsed: IDropdownItem[] = result.output;

      return parsed;
      })()}
      <div class="flex flex-col gap-1 mx-4 p-2 mt-2">
        <p class=" font-semibold">Method</p>
        <Dropdown
          value={$selectedNode.value.method}
          dropdownOptions={{
            options: items,
            onSelectItem: (itemId: string) => {
              if (!isHealthRuleNode($selectedNode) || !$treeActions.onUpdate) return;
              $treeActions.onUpdate($selectedNode, { ...$selectedNode.value, method: itemId });
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
            value={$selectedNode?.value?.hpMin}
            type="text"
            class="w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:border-secondary-500 selection:bg-secondary-500"
          />
          <hr class="!mx-3 border-secondary-500/50" />
          <input
            onfocusin={handleFocusIn}
            onfocusout={handleFocusOut}
            onkeypress={validateKeypress}
            value={$selectedNode?.value?.hpMax}
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
            value={$selectedNode?.value?.mpMin}
            type="text"
            class="w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
          />
          <hr class="!mx-3 border-secondary-500/50" />
          <input
            onfocusin={handleFocusIn}
            onfocusout={handleFocusOut}
            onkeypress={validateKeypress}
            value={$selectedNode?.value?.mpMax}
            type="text"
            class=" w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
          />
        </div>
      </div>

      <div class="flex flex-col gap-1 mx-4 p-2">
        <p class=" font-semibold">Extra Condition</p>
        <Dropdown
        value={$selectedNode.value.extraCondition}
        dropdownOptions={{
            options: (() => {
              const options = {
              "0": "None",
              "1": "Bleeding",
              "2": "Burning",
              "3": "Cursed",
              "4": "Electrified",
              "5": "Paralyzed",
              "6": "Poisoned",
              }
              return Object.keys(options).map(key => {
                return {id: key, label: options[key as keyof typeof options], category: ["Status"]}
              })
            })(),
            onSelectItem: (itemId: string) => {
              const id = itemId  as keyof typeof EHealthRuleExtraCondition 
              if (!isHealthRuleNode($selectedNode) || !$treeActions.onUpdate || !EHealthRuleExtraCondition[id]) return;
              $treeActions.onUpdate($selectedNode, { ...$selectedNode.value, extraCondition: id });
            },
          }}
        />
      </div>
    {:else if "value" in $selectedNode && "name" in $selectedNode.value}
      <div class="flex flex-col gap-4 mx-4  mt-4">
        <div class="flex flex-col gap-2">
          <p class=" font-semibold">Monster Names</p>
          <input
            value={$selectedNode.value.name}
            class="w-full text-sm p-2 border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
          />
        </div>

        <div class="flex flex-col gap-2 w-full">
          <p class=" font-semibold">Count</p>
            <input
              type="number"
              value={$selectedNode.value.count}
              class="w-full text-sm p-2  border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
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
                value={$selectedNode.value.count}
                class="text-sm w-full p-2  border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
              />
            </div>
            <div class="flex flex-col gap-1">
              <p class="text-xs">Proximity</p>
              <input
                maxlength={2}
                type="text"
                value={$selectedNode.value.count}
                class="text-sm w-full p-2  border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
              />
            </div>
            <div class="flex flex-col gap-1">
              <p class="text-xs">Stickiness</p>
              <input
                maxlength={2}
                type="text"
                value={$selectedNode.value.count}
                class="text-sm w-full p-2  border-[1px] border-secondary-500/50 bg-primary-500 outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2 w-full">
          <p class=" font-semibold">Aux</p>
          <div class="flex items-center gap-2 ">
            <input
              class="relative bg-primary-500 w-4 h-4 text-xs border border-secondary-500/50 checked:before:content-['✓'] checked:before:absolute checked:before:left-1/2 checked:before:-translate-x-[50%] checked:before:top-0 appearance-none"
              type="checkbox"
              value={$selectedNode.value.mustAttackMe}
            />
            <p class="text-xs">Must attack me</p>
          </div>
          <div class="flex items-center gap-2">
            <input
              class="relative bg-primary-500 w-4 h-4 text-xs border border-secondary-500/50 checked:before:content-['✓'] checked:before:absolute checked:before:left-1/2 checked:before:-translate-x-[50%] checked:before:top-0 appearance-none"
              type="checkbox"
              value={$selectedNode.value.mustAttackMe}
            />
            <p class="text-xs">Only if trapped</p>
          </div>
        </div>
      </div>

      {:else if "value" in $selectedNode && "attackMode" in $selectedNode.value}   
       <div class="flex flex-col gap-2 mx-4 mt-4">
        <DoubleInput label="Health Min" labelTwo="Health Max">
          <input
              onfocusin={handleFocusIn}
              onfocusout={handleFocusOut}
              onkeypress={validateKeypress}
              value={$selectedNode.value.hpMin}
              type="text"
              class="w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:border-secondary-500 selection:bg-secondary-500"
            />
            <hr class="!mx-3 border-secondary-500/50" />
            <input
              onfocusin={handleFocusIn}
              onfocusout={handleFocusOut}
              onkeypress={validateKeypress}
              value={$selectedNode.value.hpMax}
              type="text"
              class=" w-full p-2 border-[1px] border-secondary-500/50 bg-primary-500 text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none focus:border-secondary-500 selection:bg-secondary-500"
            />
        </DoubleInput>

        <DoubleInput label={"Attack Mode"} labelTwo={"Attack Avoidance"}>
          <SwitchSelect 
              onSelectItem={(itemId: keyof typeof EAttackSettings) => {
                if (!isTargetingSettingRuleNode($selectedNode) || !$treeActions.onUpdate) return;
                $treeActions.onUpdate($selectedNode, {...$selectedNode.value, attackMode: itemId})
              }}
              value={$selectedNode.value.attackMode}
              items={(() => {
              return Object.keys(EAttackSettings).map(key=> {
                const k = key as keyof typeof EAttackSettings
                return {id: k, label: EAttackSettings[key as keyof typeof EAttackSettings]}
              })
            })()}
          />
          <hr class="!mx-3 border-secondary-500/50" />
          <SwitchSelect 
              onSelectItem={(itemId: keyof typeof EAttackAvoidance) => {
                if (!isTargetingSettingRuleNode($selectedNode) || !$treeActions.onUpdate) return;
                $treeActions.onUpdate($selectedNode, {...$selectedNode.value, attackAvoidance: itemId})
              }}
              value={$selectedNode.value.attackAvoidance}
              items={(() => {
              return Object.keys(EAttackAvoidance).map(key => {
                const k = key as keyof typeof EAttackAvoidance
                return {id: k, label: EAttackAvoidance[key as keyof typeof EAttackAvoidance]}
              })
            })()}
           />
        </DoubleInput>

        <DoubleInput label={"Desired Stance"} labelTwo={"Desired Distance"}>
          <SwitchSelect 
            onSelectItem={(itemId: keyof typeof EDesiredStance) => {
              if (!isTargetingSettingRuleNode($selectedNode) || !$treeActions.onUpdate) return;
              $treeActions.onUpdate($selectedNode, {...$selectedNode.value, desiredStance: itemId})
            }}
            value={$selectedNode.value.desiredStance}
            items={(() => {
            return Object.keys(EDesiredStance).map(key=> {
              const k = key as keyof typeof EDesiredStance
              return {id: k, label: EDesiredStance[key as keyof typeof EDesiredStance]}
            })
          })()}
          />
          <hr class="!mx-3 border-secondary-500/50" />
          <SwitchSelect 
            onSelectItem={(itemId: keyof typeof EDesiredDistance) => {
              if (!isTargetingSettingRuleNode($selectedNode) || !$treeActions.onUpdate) return;
                $treeActions.onUpdate($selectedNode, {...$selectedNode.value, desiredDistance: itemId})
              }}
            value={$selectedNode.value.desiredDistance}
            items={(() => {
              return Object.keys(EDesiredDistance).map(key => {
                const k = key as keyof typeof EDesiredDistance
                return {id: k, label: EDesiredDistance[key as keyof typeof EDesiredDistance]}
              })
            })()}
          />   
        </DoubleInput>

      
        {#each ["First Spell", "Second Spell", "Third Spell", "Lure Spell"] as label}
          <div class="flex flex-col gap-1">
            <p class=" font-semibold">{label}</p>         
            <Dropdown
            value={$selectedNode.value.firstSpell}
            dropdownOptions={{
                options: (() => {
                const schema = varr(vobj({
                    id: vstr(),
                    label: vstr(),
                    category: vstr(),
                }))

                const result = safeParse(schema, spellData);
                console.log(result)
                if (!result.success) return [];
              
                const parsed: IDropdownItem[] = result.output;
                return parsed;
                })(),
                onSelectItem: (itemId: string) => {
                  if (!isTargetingSettingRuleNode($selectedNode) || !$treeActions.onUpdate) return;
                  $treeActions.onUpdate($selectedNode, { ...$selectedNode.value, firstSpell: itemId });
                },
              }}
            />
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>
