import type { IHealthRuleNode, IPersistenceRuleNode, ITargetingRuleNode, ITargetingSettingsRuleNode, ITreeNode } from "./types";

export const generateShortUUID = () => {
  return Math.random().toString(36).substring(2, 10);
}

export const findParentNode = (
  treeData: ITreeNode[],
  targetParentId: string,
): ITreeNode | null => {
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

export const isHealthRuleNode = (node: any): node is IHealthRuleNode => {
  return node?.value && 'method' in node.value;
}

export const isPersistenceRuleNode = (node: any): node is IPersistenceRuleNode => {
  return node?.value && 'code' in node.value;
}

export const isTargetingSettingRuleNode = (node: any): node is ITargetingSettingsRuleNode => {
  return node?.value && 'attackMode' in node.value;
}

export const createTargetingRuleNode = (parentNodeId: string, nodeId: string, childrenNodeId: string): ITargetingRuleNode => {
  return {
    id: nodeId,
    label: `${nodeId} - Node`,
    children: [
      {
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
          syncSpells: false,
        }

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