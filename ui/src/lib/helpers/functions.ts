import { ENodeTypes, type IHealthRuleNode, type IPersistenceRuleNode, type ITargetingRuleNode, type ITargetingSettingsRuleNode, type ITreeNode, type UNodeTypes } from "./types";

export function keyValToItems<T extends Record<any, any>>(keyval: T, category: string): Array<{ id: keyof T; label: T[keyof T], category: string }>;
export function keyValToItems<T extends Record<any, any>>(keyval: T): Array<{ id: keyof T; label: T[keyof T] }>;
export function keyValToItems<T extends Record<any, any>>(keyval: T, category?: string) {
  return Object.keys(keyval).map(key => {
    const k = key as keyof T;
    return category
      ? { id: k, label: keyval[k], category }
      : { id: k, label: keyval[k] };
  });
}
export const generateShortUUID = () => {
  return Math.random().toString(36).substring(2, 10);
}

export const findParentNode = (
  treeData: ITreeNode[],
  targetParentId: string,
): Extract<UNodeTypes, { children: any }> | null => {

  for (const node of treeData) {
    if (node.id === targetParentId) {
      return node;
    }

    if (node.children && node.children.length > 0) {
      const result = findParentNode(node.children, targetParentId);
      if (result) {
        return result;
      }
    }
  }

  return null;
};

export const moveItemInArray = (
  arr: (ITreeNode | IHealthRuleNode)[],
  currentIndex: number,
  newPosition: number
) => {
  if (currentIndex === -1) return arr;

  const newArr = arr.filter((_, index) => index !== currentIndex);

  newArr.splice(newPosition, 0, arr[currentIndex]);

  return newArr;
};

export const exhaustiveGuard = (_: never): never => {
  throw new Error("Switch exhaustive error")
}

export const isHealthRuleNode = (node: UNodeTypes): node is IHealthRuleNode => {
  return node.type === ENodeTypes["IHealthRuleNode"]
}

export const isPersistenceRuleNode = (node: UNodeTypes): node is IPersistenceRuleNode => {
  return node.type === ENodeTypes["IPersistenceRuleNode"]
}

export const isTargetingSettingRuleNode = (node: UNodeTypes): node is ITargetingSettingsRuleNode => {
  return node.type === ENodeTypes["ITargetingRuleNode"]
}

export const hasEnabledField = (node: UNodeTypes): node is Extract<UNodeTypes, { value: { enabled: boolean } }> => {
  return "value" in node && "enabled" in node.value
}

export const createTargetingRuleNode = (parentNodeId: string, nodeId: string, childrenNodeId: string): ITargetingRuleNode => {
  return {
    type: ENodeTypes["ITargetingRuleNode"],
    id: nodeId,
    label: `${nodeId} - Node`,
    childrenType: ENodeTypes["ITargetingSettingsRuleNode"],
    children: [
      {
        type: ENodeTypes["ITargetingSettingsRuleNode"],
        id: childrenNodeId,
        label: `${childrenNodeId} - Node`,
        value: {
          enabled: false,
          hpMin: 0,
          hpMax: 100,
          attackAvoidance: "0",
          attackMode: "0",
          desiredDistance: "0",
          desiredStance: "0",
          firstSpell: "0",
          secondSpell: "0",
          thirdSpell: "0",
          lureSpell: "0",
          syncSpells: false,
        },
        parentId: nodeId
      }
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
    type: ENodeTypes["IHealthRuleNode"],
    id: nodeId,
    label: `${nodeId} - Node`,
    value: {
      enabled: false,
      hpMin: 0,
      hpMax: 0,
      mpMin: 0,
      mpMax: 0,
      method: "266",
      extraCondition: "0"
    },

    parentId: parentNodeId,
  }
}

export const createPersistenceRuleNode = (parentNodeId: string, nodeId: string): IPersistenceRuleNode => {
  return {
    type: ENodeTypes["IPersistenceRuleNode"],
    id: nodeId,
    label: `${nodeId} - Node`,
    value: {
      enabled: false,
      code: "auto(1000)",
    },
    parentId: parentNodeId,
  }
}

export const createTargetingSettingsRuleNode = (parentNodeId: string, nodeId: string): ITargetingSettingsRuleNode => {
  return {
    type: ENodeTypes["ITargetingSettingsRuleNode"],
    id: nodeId,
    label: `${nodeId} - Node`,
    value: {
      enabled: false,
      hpMin: 0,
      hpMax: 100,
      attackAvoidance: "0",
      attackMode: "0",
      desiredDistance: "0",
      desiredStance: "0",
      firstSpell: "0",
      secondSpell: "0",
      thirdSpell: "0",
      lureSpell: "0",
      syncSpells: false,
    },
    parentId: parentNodeId
  }
}