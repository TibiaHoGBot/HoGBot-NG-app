<script lang="ts">
  import { safeParse, array as varr, boolean as vbool, nullish as vnullish, number as vnum, object as vobj, optional as voptional, picklist as vpicklist, pipe as vpipe, string as vstr, value as vval } from 'valibot';
  
  import TestScript from "$lib/data/script.json";
  import "./app.postcss";

  import { moveItemInArray } from '$lib/helpers/functions';
  import { EAttackAvoidance, EAttackSettings, EDesiredDistance, EDesiredStance, EHealthRuleExtraCondition, ENodeTypes, type IScript } from '$lib/helpers/types';
  import { draggedNodeInfo, dragTimer, dropInfo, nodeContext, treeActions } from '$lib/stores';
 
  import MainFrame from '$lib/components/MainFrame.svelte';

  let data: IScript = $state({
    hogSettings: {
      healer: [
        {
          id: "healer-root-1",
          label: "Health Rules",
          selected: false,
          expanded: true,
          childrenType: ENodeTypes["HealthRuleNode"],
          children: [
            {
              id: "healer-rule-1",
              label: "Health Rule",
              selected: false,
              parentId: "healer-root-1",
              value: {
                enabled: false,
                method: "266",
                hpMin: 0,
                hpMax: 100,
                mpMin: 0,
                mpMax: 100,
                extraCondition: 0
              },
              type: ENodeTypes["HealthRuleNode"]
            }
          ],
          type: ENodeTypes["HealthRootNode"]
        }
      ],
      cavebot: [
        { 
          id: "cavebot-root-1",
          label: "Cavebot Rules",
          selected: false,
          expanded: true,
          childrenType: ENodeTypes["CavebotRuleNode"],
          children: [
            {
              id: "cavebot-rule-1",
              label: "Cavebot Rule",
              selected: false,
              parentId: "cavebot-root-1",
              type: ENodeTypes["CavebotRuleNode"],
              value: {
                
              }
            }
          ],
          type: ENodeTypes["CavebotRootNode"]

        }
      ],
      persistences: [
        {
          id: "persistence-root-1",
          label: "Persistence Rules",
          selected: false,
          expanded: true,
          childrenType: ENodeTypes["PersistenceRuleNode"],
          children: [
            {
              id: "persistence-rule-1",
              label: "Persistence Rule",
              selected: false,
              parentId: "persistence-root-1",
              value: {
                enabled: false,
                code: "auto (10000)"
              },
              type: ENodeTypes["PersistenceRuleNode"]
            }
          ],

          type: ENodeTypes["PersistenceRootNode"]
        }
      ],
      targeting: [
        {
          id: "targeting-root-1",
          label: "Targeting Rules",
          selected: false,
          expanded: true,
          type: ENodeTypes["TargetingRootNode"],
          childrenType: ENodeTypes["TargetingRuleNode"],
          children: [
            {
              id: "targeting-rule-1",
              label: "Targeting Rule",
              selected: false,
              expanded: true,
              parentId: "targeting-root-1",
              type: ENodeTypes["TargetingRuleNode"],
              childrenType: ENodeTypes["TargetingSettingsRuleNode"],
              children: [
                {
                    id: "targeting-settings-rule-1",
                    label: "Targeting Settings Rule",
                    selected: false,
                    parentId: "targeting-rule-1",
                    type: ENodeTypes["TargetingSettingsRuleNode"],
                    value: {
                      enabled: false,
                      hpMin: 0,
                      hpMax: 100,
                      attackMode: EAttackSettings["Offensive/Stand"],
                      attackAvoidance: EAttackAvoidance["None"],
                      desiredStance: EDesiredStance["Approach"],
                      desiredDistance: EDesiredDistance["None"],
                      syncSpells: false,
                      firstSpell: null,
                      secondSpell: null,
                      thirdSpell: null,
                      lureSpell: null
                    }
                }
              ],
              value: {
                name: "",
                count: 0,
                targetSelection: {
                  health: 1,
                  proximity: 1,
                  stickiness: 1
                },
                mustAttackMe: false,
                onlyIfTrapped: false
              }
              
            }
          ],
        }
      ]
  }})

  const schemaTreeNode = vobj({
    id: vstr(),
    label: vstr(),
    selected: voptional(vbool()), 
  })

  const schemaHealthRootNode = vobj({
    ...schemaTreeNode.entries,
    expanded: vbool(),
    childrenType: vpipe(vnum(), vval(ENodeTypes["HealthRuleNode"], "childrenType must be equal to HealthRuleNode")),
    children: varr(
      vobj({
        ...schemaTreeNode.entries,
        parentId: vstr(),
        type: vpipe(vnum(), vval(ENodeTypes["HealthRuleNode"])),
        value: vobj({
          enabled: vbool(),
          method: vstr(),
          mpMin: vnum(),
          mpMax: vnum(),
          hpMin: vnum(),
          hpMax: vnum(),
          extraCondition: vpicklist(Object.values(EHealthRuleExtraCondition) as Array<(typeof EHealthRuleExtraCondition[keyof typeof EHealthRuleExtraCondition])>)
        })
      })
    ),
    type: vpipe(vnum(), vval(ENodeTypes["HealthRootNode"]))
  })

  const schemaCavebotRootNode = vobj({
    ...schemaTreeNode.entries,
    expanded: vbool(),
    childrenType: vpipe(vnum(), vval(ENodeTypes["CavebotRuleNode"], "childrenType must be equal to CavebotRuleNode")),
    children: varr(vobj({
      ...schemaTreeNode.entries,
      parentId: vstr(),
      type: vpipe(vnum(), vval(ENodeTypes["CavebotRuleNode"], "type must be equal to CavebotRuleNode"))
    })),
    type: vpipe(vnum(), vval(ENodeTypes["CavebotRootNode"]))
  })

  const schemaPersistenceRootNode = vobj({
    ...schemaTreeNode.entries,
    expanded: vbool(),
    childrenType: vpipe(vnum(), vval(ENodeTypes["PersistenceRuleNode"], "childrenType must be equal to PersistenceRuleNode")),
    children: varr(vobj({
      ...schemaTreeNode.entries,
      parentId: vstr(),
      type: vpipe(vnum(), vval(ENodeTypes["PersistenceRuleNode"], "type must be equal to PersistenceRuleNode")),
      value: vobj({
        enabled: vbool(),
        code: vstr(),
      })
    })),
    type: vpipe(vnum(), vval(ENodeTypes["PersistenceRootNode"]))
  })

  const schemaTargetingRootNode = vobj({
    ...schemaTreeNode.entries,
    expanded: vbool(),
    childrenType: vpipe(vnum(), vval(ENodeTypes["TargetingRuleNode"], "childrenType must be equal to TargetingRuleNode")),
    children: varr(vobj({
      ...schemaTreeNode.entries,
      expanded: vbool(),
      parentId: vstr(),
      type: vpipe(vnum(), vval(ENodeTypes["TargetingRuleNode"], "type must be equal to TargetingRuleNode")),
      childrenType: vpipe(vnum(), vval(ENodeTypes["TargetingSettingsRuleNode"], "childrenType must be equal to TargetingSettingsRuleNode")),
      children: varr(vobj({
        ...schemaTreeNode.entries,
        parentId: vstr(),
        type: vpipe(vnum(), vval(ENodeTypes["TargetingSettingsRuleNode"], "type must be equal to TargetingSettingsRuleNode")),
        value: vobj({
          enabled: vbool(),
          hpMin: vnum(),
          hpMax: vnum(),
          attackMode: vpicklist(Object.values(EAttackSettings) as Array<(typeof EAttackSettings[keyof typeof EAttackSettings])>),
          attackAvoidance: vpicklist(Object.values(EAttackAvoidance) as Array<(typeof EAttackAvoidance[keyof typeof EAttackAvoidance])>),
          desiredStance: vpicklist(Object.values(EDesiredStance) as Array<(typeof EDesiredStance[keyof typeof EDesiredStance])>),
          desiredDistance: vpicklist(Object.values(EDesiredDistance) as Array<(typeof EDesiredDistance[keyof typeof EDesiredDistance])>),
          syncSpells: vbool(),
          firstSpell: vnullish(vstr()),
          secondSpell: vnullish(vstr()),
          thirdSpell: vnullish(vstr()),
          lureSpell: vnullish(vstr())
        })
      }

      )),
      value: vobj({
        name: vstr(),
        count: vnum(),
        targetSelection: vobj({
          health: vnum(),
          proximity: vnum(),
          stickiness: vnum()
        }),
        mustAttackMe: vbool(),
        onlyIfTrapped: vbool()
      })
    })),
    type: vpipe(vnum(), vval(ENodeTypes["TargetingRootNode"]))
  })
  


  const schema = vobj({
    hogSettings: vobj({
      healer: varr(
        vobj({
        ...schemaHealthRootNode.entries
        })
      ),
      cavebot: varr(
        vobj({
        ...schemaCavebotRootNode.entries
        })
      ),
      persistences: varr(
        vobj({
        ...schemaPersistenceRootNode.entries
        })
      ),
      targeting: varr(
        vobj({
        ...schemaTargetingRootNode.entries
        })
      ),
    })
  })
  
  const res = safeParse(schema, TestScript)

  if (res.success) {
    data = res.output as IScript
  } else {
    console.error(res.issues)
  }


</script>

<svelte:window
  onmouseup={(e) => {
    if (!$draggedNodeInfo) {
      clearTimeout($dragTimer);
      return;
    }

    if ($treeActions.onDrag && $dropInfo) {
        const newChildren = moveItemInArray(
        $draggedNodeInfo.parentNode.children,
         $dropInfo.startIdx,
         $dropInfo.dropIdx
        );
        $treeActions.onDrag($draggedNodeInfo.parentNode, newChildren);
        e.preventDefault();
    }

    draggedNodeInfo.set(undefined);
    dropInfo.set(undefined);
  }}
  onkeydown={(e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
  
    nodeContext.set(undefined);
    clearTimeout($dragTimer);
    draggedNodeInfo.set(undefined);
    dropInfo.set(undefined);
  }}
/>



<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class:!cursor-grabbing={$draggedNodeInfo}
  onclick={(_e) => {
    nodeContext.set(undefined);
  }}
  class="flex  items-center justify-center bg-gradient-to-br from-surface-500 to-surface-600 w-full h-screen text-white"
>
  <MainFrame {data} />
</div>

