import { EAttackAvoidance, EAttackSettings, EDesiredDistance, EDesiredStance, EHealthRuleExtraCondition, ENodeTypes, type ICavebotRuleNode, type IHealthRuleNode, type IPersistenceRuleNode, type IScript, type ITargetingRuleNode, type ITargetingSettingsRuleNode, type IWaypointNode, type UModuleNames, type UNodeChildren, type UNodeRoots, type UNodes } from "./types";

export function keyValToItems<T extends Record<any, any>>(keyval: T, category: string): Array<{ id: T[keyof T]; label: keyof T, category: string }>;
export function keyValToItems<T extends Record<any, any>>(keyval: T): Array<{ id: T[keyof T]; label: keyof T }>;
export function keyValToItems<T extends Record<any, any>>(keyval: T, category?: string) {
  return Object.keys(keyval).map(key => {
    const k = key as keyof T;
    return category
      ? { id: keyval[k], label: k, category }
      : { id: keyval[k], label: k };
  });
}
export const generateShortUUID = () => {
  return Math.random().toString(36).substring(2, 10);
}

export const findParentNode = (
  treeData: UNodes[],
  targetParentId: string,
): UNodeRoots | ITargetingRuleNode | ICavebotRuleNode | null => {

  for (const node of treeData) {
    if ("children" in node && node.id === targetParentId) {
      return node;
    }

    if ("children" in node && node.children?.length > 0) {
      const result = findParentNode(node.children, targetParentId);
      if (result) {
        return result;
      }
    }
  }

  return null;
};

export const moveItemInArray = <T extends UNodeChildren>(
  arr: T,
  currentIndex: number,
  newPosition: number
): UNodeChildren => {
  if (currentIndex === -1) return arr;

  const newArr = arr.filter((_, index) => index !== currentIndex);

  newArr.splice(newPosition, 0, arr[currentIndex]);

  return newArr as T;
};

export const getModuleName = (type: typeof ENodeTypes[keyof typeof ENodeTypes]): UModuleNames => {
  switch (type) {
    case ENodeTypes["CavebotRootNode"]:
    case ENodeTypes["CavebotRuleNode"]:
    case ENodeTypes["WaypointNode"]:
      return "cavebot"
    case ENodeTypes["HealthRootNode"]:
    case ENodeTypes["HealthRuleNode"]:
      return "healer"
    case ENodeTypes["PersistenceRootNode"]:
    case ENodeTypes["PersistenceRuleNode"]:
      return "persistences"
    default:
      return "targeting"
  }
}

export const exhaustiveGuard = (_: never): never => {
  throw new Error("Switch exhaustive error")
}

export const isHealthRuleNode = (node: UNodes): node is IHealthRuleNode => {
  return node.type === ENodeTypes["HealthRuleNode"]
}

export const isPersistenceRuleNode = (node: UNodes): node is IPersistenceRuleNode => {
  return node.type === ENodeTypes["PersistenceRuleNode"]
}

export const isTargetingSettingRuleNode = (node: UNodes): node is ITargetingSettingsRuleNode => {
  return node.type === ENodeTypes["TargetingSettingsRuleNode"]
}

export const isCavebotRuleNode = (node: UNodes): node is ICavebotRuleNode => {
  return node.type === ENodeTypes["CavebotRuleNode"]
}

export const isWaypointNode = (node: UNodes): node is IWaypointNode => {
  return node.type === ENodeTypes["WaypointNode"]
}

export const hasEnabledField = (node: UNodes): node is Extract<UNodes, { value: { enabled: boolean } }> => {
  return "value" in node && "enabled" in node.value
}


export const createTargetingSettingsRuleNode = (parentNodeId: string, nodeId: string): ITargetingSettingsRuleNode => {
  return {
    type: ENodeTypes["TargetingSettingsRuleNode"],
    id: nodeId,
    label: `${nodeId} - Node`,
    value: {
      enabled: false,
      hpMin: 0,
      hpMax: 100,
      attackAvoidance: EAttackAvoidance["None"],
      attackMode: EAttackSettings["Offensive/Stand"],
      desiredDistance: EDesiredDistance["None"],
      desiredStance: EDesiredStance["Approach"],
      firstSpell: null,
      secondSpell: null,
      thirdSpell: null,
      lureSpell: null,
      syncSpells: false,
    },
    parentId: parentNodeId
  }
}

export const createTargetingRuleNode = (parentNodeId: string, nodeId: string, childrenNodeId: string): ITargetingRuleNode => {
  return {
    type: ENodeTypes["TargetingRuleNode"],
    id: nodeId,
    label: `${nodeId} - Node`,
    expanded: true,
    childrenType: ENodeTypes["TargetingSettingsRuleNode"],
    children: [
      createTargetingSettingsRuleNode(nodeId, childrenNodeId)
    ],
    value: {
      name: "",
      count: 0,
      targetSelection: {
        health: 1,
        proximity: 1,
        stickiness: 1,
      },
      mustAttackMe: false,
      onlyIfTrapped: false
    },

    parentId: parentNodeId,
  };
}

export const createHealthRuleNode = (parentNodeId: string, nodeId: string): IHealthRuleNode => {
  return {
    type: ENodeTypes["HealthRuleNode"],
    id: nodeId,
    label: `${nodeId} - Node`,
    value: {
      enabled: false,
      hpMin: 0,
      hpMax: 0,
      mpMin: 0,
      mpMax: 0,
      method: "266",
      extraCondition: EHealthRuleExtraCondition["None"]
    },

    parentId: parentNodeId,
  }
}

export const createPersistenceRuleNode = (parentNodeId: string, nodeId: string): IPersistenceRuleNode => {
  return {
    type: ENodeTypes["PersistenceRuleNode"],
    id: nodeId,
    label: `${nodeId} - Node`,
    value: {
      enabled: false,
      code: "auto(1000)",
    },
    parentId: parentNodeId,
  }
}

export const createCavebotRuleNode = (parentNodeId: string, nodeId: string, childNodeId: string): ICavebotRuleNode => {
  return {
    type: ENodeTypes["CavebotRuleNode"],
    id: nodeId,
    label: `Waypoint Group - ${nodeId}`,
    parentId: parentNodeId,
    childrenType: ENodeTypes["WaypointNode"],
    children: [
      createWaypointNode(nodeId, childNodeId)
    ],
    expanded: true
  }
}

export const createWaypointNode = (parentNodeId: string, nodeId: string): IWaypointNode => {
  return {
    type: ENodeTypes["WaypointNode"],
    id: nodeId,
    label: `action - ${nodeId}`,
    parentId: parentNodeId,
    value: {
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      waypointType: "action"
    },
  }
}


export const createDefaultAppState = (): IScript => {
  return {
    hogSettings: {
      healer: [
        {
          id: "healer-root-1",
          label: "Health Rules",
          expanded: true,
          childrenType: ENodeTypes["HealthRuleNode"],
          children: [
            {
              id: "healer-rule-1",
              label: "Health Rule",
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
          expanded: true,
          childrenType: ENodeTypes["CavebotRuleNode"],
          children: [

          ],
          type: ENodeTypes["CavebotRootNode"]

        }
      ],
      persistences: [
        {
          id: "persistence-root-1",
          label: "Persistence Rules",
          expanded: true,
          childrenType: ENodeTypes["PersistenceRuleNode"],
          children: [
            {
              id: "persistence-rule-1",
              label: "Persistence Rule",
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
          expanded: true,
          type: ENodeTypes["TargetingRootNode"],
          childrenType: ENodeTypes["TargetingRuleNode"],
          children: [
            {
              id: "targeting-rule-1",
              label: "Targeting Rule",
              expanded: true,
              parentId: "targeting-root-1",
              type: ENodeTypes["TargetingRuleNode"],
              childrenType: ENodeTypes["TargetingSettingsRuleNode"],
              children: [
                {
                  id: "targeting-settings-rule-1",
                  label: "Targeting Settings Rule",
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
    }
  }
}