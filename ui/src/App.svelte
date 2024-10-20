<script lang="ts">
  import { safeParse, array as varr, boolean as vbool, nullish as vnullish, number as vnum, object as vobj, optional as voptional, picklist as vpicklist, pipe as vpipe, string as vstr, value as vval } from 'valibot';

  import "./app.postcss";

  import { createDefaultAppState, getitemType, moveItemInArray } from '$lib/helpers/functions';
  import { EAttackAvoidance, EAttackSettings, EDesiredDistance, EDesiredStance, EHealthRuleExtraCondition, ENodeTypes, EWaypointType, type IScript, type IUpdateStateParams } from '$lib/helpers/types';
  import { draggedNodeInfo, dragTimer, dropInfo, nodeContext, selectedNode, selectedParentNode, treeActions } from '$lib/stores';
 
  import MainFrame from '$lib/components/MainFrame.svelte';

  let data: IScript = $state(createDefaultAppState())

  const schemaTreeNode = vobj({
    id: vstr(),
    label: vstr(),
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
      type: vpipe(vnum(), vval(ENodeTypes["CavebotRuleNode"], "type must be equal to CavebotRuleNode")),
      expanded: vbool(),
      childrenType: vpipe(vnum(), vval(ENodeTypes["WaypointNode"], "childrenType must be equal to WaypointNode")),
      children:  varr(vobj({
        ...schemaTreeNode.entries,
        parentId: vstr(),
        type: vpipe(vnum(), vval(ENodeTypes["WaypointNode"], "type must be equal to CavebotRuleNode")),
        value: vobj({
          position: vobj({
            x: vnum(),
            y: vnum(),
            z: vnum(),
            range: voptional(vobj({
              x: vnum(),
              y: vnum(),
            }))
          }),
          waypointType: vpicklist(Object.values(EWaypointType) as Array<(typeof EWaypointType[keyof typeof EWaypointType])>)
        })
    })),
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
  


  const loadData = (newData: Record<string, any>) => {
    const res = safeParse(schema, newData)

    if (res.success) {
      selectedNode.set(undefined)
      selectedParentNode.set(undefined)
      data = res.output as IScript;

      const params: IUpdateStateParams = {
        action: "load",
        itemType: "state",
        value: {
          healer: {
          enabled: false,
          rules: data["hogSettings"]["healer"][0].children.map(child => {
            return {id: child.id, ...child.value}
          })
          },
          cavebot: {
            enabled: false,
            waypoints: 
              data["hogSettings"]["cavebot"][0].children.map(parent => {
                return {[parent.id]: parent.children.map(child => {return {id: child.id, ...child.value}}
                )}
              })
            
          },
          persistences: {
            enabled: false,
            rules: data["hogSettings"]["persistences"][0].children.map(child => {
            return {id: child.id, ...child.value}
          })
          },
          targeting: {
            enabled: false,
            rules: 
              data["hogSettings"]["targeting"][0].children.map(parent => {
                return {...parent.value, id: parent.id, settings: parent.children.map(child => {return {id: child.id, ...child.value}}
                )}
              })
          }
        }
      }
      //@ts-ignore
      webview.updateState(JSON.stringify(params), (status, res) => {
        if (status) {
        } else {
          console.error(status, res)
        }
      })
    } else {
      console.error(res.issues)
    }
  }

  //@ts-ignore
  loadData(data)
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

      if ($selectedNode && "value" in $selectedNode) {
        const itemType = getitemType($selectedNode.type)

        if (!itemType) {
          console.error("invalid item type");
          return;
        }
        
        const params: IUpdateStateParams = {
          action: "reorder",
          itemType: itemType,
          id: $selectedNode.id,
          startIdx: $dropInfo.startIdx,
          dropIdx: $dropInfo.dropIdx,
          parentId: $draggedNodeInfo.parentNode.id
        }

        webview.updateState(JSON.stringify(params), (status, res) => {
        if (status) {     
        } else {
          console.error(status, res);
          return
        }});
      }
      
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
  <MainFrame bind:data {loadData} />
</div>

