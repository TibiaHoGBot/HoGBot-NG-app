export const EHealthRuleExtraCondition = {
  "0": "None",
  "1": "Bleeding",
  "2": "Burning",
  "3": "Cursed",
  "4": "Electrified",
  "5": "Paralyzed",
  "6": "Poisoned"
} as const;

export const EAttackSettings = {
  "0": "None",
  "1": "Offensive/Stand",
  "2": "Offensive/Chase",
  "3": "Balanced/Stand",
  "4": "Balanced/Chase",
  "5": "Defensive/Stand",
  "6": "Defensive/Chase"
} as const

export const EAttackAvoidance = {
  "0": "None",
  "1": "Avoid Beams",
  "2": "Avoid Waves"
} as const

export const EDesiredStance = {
  "0": "None",
  "1": "Stand",
  "2": "Approach",
  "3": "Lure & Stand",
  "4": "Lure & Approach",
  "5": "Lure & Distance",
} as const

export const EDesiredDistance = {
  "0": "None",
  "1": "Short",
  "2": "Mid",
  "3": "Long"
} as const


export type INodeContext = {
  context: "nodeMenu" | "codeEditor" | "dropdownMenu",
  meta?: IDropdownMeta
}

// *** Dropdown Types *** //

export type IDropdownProps = {
  options: IDropdownItem[];
  onSelectItem: (itemId: IDropdownItem["id"]) => void;
};

export type IDropdownItem = {
  id: string;
  label: string;
  category: string;
  icon?: string;
}

export type IDropdownMeta = {
  options: IDropdownItem[];
  selectedId: string;
  onSelectItem: (itemId: IDropdownItem["id"]) => void;
}

// *** Switch Types *** //

export type UTargetingSettingKeys = keyof typeof EAttackSettings | keyof typeof EAttackAvoidance | keyof typeof EDesiredDistance | keyof typeof EDesiredStance

export type ISwitchSelectProps<T extends UTargetingSettingKeys> = {
  value: T;
  items: {
    id: T,
    label: string
  }[]
  onSelectItem: (itemId: T) => void;
};


// *** Node Types *** //

export type UNodeTypes = (ITreeNode | IHealthRuleNode | IPersistenceRuleNode | ITargetingRuleNode | ITargetingSettingsRuleNode)

export const ENodeTypes = {
  "ITreeNode": 0,
  "IHealthRuleNode": 1,
  "ICavebotRuleNode": 2,
  "IPersistenceRuleNode": 3,
  "ITargetingRuleNode": 4,
  "ITargetingSettingsRuleNode": 5
} as const

export type ITreeNode = {
  id: string;
  label: string;
  parentId?: string;
  expanded?: boolean;
  selected?: boolean;
  children: (IHealthRuleNode | IPersistenceRuleNode | ITargetingRuleNode | ITargetingSettingsRuleNode)[];
  childrenType: typeof ENodeTypes[keyof typeof ENodeTypes];
  type: typeof ENodeTypes["ITreeNode"];
}

export type IHealthRuleNode = Omit<ITreeNode, "children" | "childrenType" | "type"> & {
  type: typeof ENodeTypes["IHealthRuleNode"],
  value: {
    enabled: boolean;
    method: string,
    mpMin: number;
    mpMax: number;
    hpMin: number;
    hpMax: number;
    extraCondition: keyof typeof EHealthRuleExtraCondition
  }
}

export type IPersistenceRuleNode = Omit<ITreeNode, "children" | "childrenType" | "type"> & {
  type: typeof ENodeTypes["IPersistenceRuleNode"],
  value: {
    enabled: boolean;
    code: string
  }
}

export type ITargetingRuleNode = Omit<ITreeNode, "children" | "childrenType" | "type"> & {
  type: typeof ENodeTypes["ITargetingRuleNode"],
  children: ITargetingSettingsRuleNode[],
  childrenType: typeof ENodeTypes["ITargetingSettingsRuleNode"],
  value: {
    name: string;
    count: number;
    targetSelection: {
      health: number;
      proximity: number;
      stickiness: number;
    }
    mustAttackMe: boolean;
    onlyIfTrapped: boolean;
  }
}

export type ITargetingSettingsRuleNode = Omit<ITreeNode, "children" | "childrenType" | "expanded" | "type"> & {
  type: typeof ENodeTypes["ITargetingSettingsRuleNode"],
  value: {
    enabled: boolean;
    hpMin: number;
    hpMax: number;
    attackMode: keyof typeof EAttackSettings;
    attackAvoidance: keyof typeof EAttackAvoidance;
    desiredStance: keyof typeof EDesiredStance;
    desiredDistance: keyof typeof EDesiredDistance;
    syncSpells: boolean;
    firstSpell: string;
    secondSpell: string;
    thirdSpell: string;
    lureSpell: string;
  }
}

export type DropInfo = {
  dropBorder: string;
  dropBorderNodeId: string;
  dropableNodeId: string;
  startIdx: number;
  dropIdx: number;
}
