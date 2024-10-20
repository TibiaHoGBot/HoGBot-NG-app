declare global {
  type LuaCallback = (status: boolean, result: string) => void

  const webview: {
    loadFile: (value: any, callback: LuaCallback) => void
    saveFile: (value: string, callback: LuaCallback) => void
    updateState: (value: string, callback: LuaCallback) => void
  }
}

export const EHealthRuleExtraCondition = {
  "None": 0,
  "Bleeding": 1,
  "Burning": 2,
  "Cursed": 3,
  "Electrified": 4,
  "Paralyzed": 5,
  "Poisoned": 6
} as const;

export const EAttackSettings = {
  "None": 0,
  "Offensive/Stand": 1,
  "Offensive/Chase": 2,
  "Balanced/Stand": 3,
  "Balanced/Chase": 4,
  "Defensive/Stand": 5,
  "Defensive/Chase": 6
} as const

export const EAttackAvoidance = {
  "None": 0,
  "Avoid Beams": 1,
  "Avoid Waves": 2
} as const

export const EDesiredStance = {
  "None": 0,
  "Stand": 1,
  "Approach": 2,
  "Lure & Stand": 3,
  "Lure & Approach": 4,
  "Lure & Distance": 5,
} as const

export const EDesiredDistance = {
  "None": 0,
  "Short": 1,
  "Mid": 2,
  "Long": 3
} as const

export const EWaypointType = {
  action: "action",
  stand: "stand",
  node: "node",
  lure: "lure",
  rope: "rope",
  shovel: "shovel",
  pick: "pick",
} as const

export type INodeContext = {
  context: "nodeMenu" | "codeEditor" | "dropdownMenu",
  meta?: IDropdownMeta
}

export type UItemTypes = "healthRule" | "persistenceRule" | "waypointGroup" | "waypoint" | "targetingRule" | "targetingSetting"

export type IUpdateStateParams = {
  action: "update",
  itemType: UItemTypes,
  id: string,
  value: Record<string, any>,
  parentId?: string
} | {
  action: "remove",
  itemType: UItemTypes,
  id: string,
  parentId: string,
} | {
  action: "create",
  itemType: UItemTypes,
  parentId: string,
  value: Record<string, any> & { id?: string },
} | {
  action: "reorder"
  itemType: UItemTypes,
  startIdx: number,
  dropIdx: number,
  id: string,
  parentId: string
} | {
  action: "enable",
  itemType: UItemTypes,
  id: string,
  value: boolean
} | {
  action: "load",
  itemType: "state",
  value: Record<string, any>
}

// *** Dropdown Types *** //

export type IDropdownProps = {
  options: IDropdownItem[];
  onSelectItem: (itemId: IDropdownItem["id"]) => void;
};

export type IDropdownItem = {
  id: string | number;
  label: string;
  category: string;
  icon?: string;
}

export type IDropdownMeta = {
  options: IDropdownItem[];
  selectedId: string | number;
  onSelectItem: (itemId: IDropdownItem["id"]) => void;
}

// *** Switch Types *** //

export type UTargetingSettingKeys = string | number

export type ISwitchSelectProps<T extends UTargetingSettingKeys> = {
  value: T;
  items: {
    id: T,
    label: string
  }[]
  onSelectItem: (itemId: T) => void;
};


// *** Node Types *** //

export type UNodeRoots = IHealthRootNode | ICavebotRootNode | IPersistenceRootNode | ITargetingRootNode
export type UNodeRules = IHealthRuleNode | ICavebotRuleNode | IPersistenceRuleNode | ITargetingRuleNode | ITargetingSettingsRuleNode | IWaypointNode
export type UNodes = UNodeRoots | UNodeRules
export type UNodeChildren = IHealthRuleNode[] | ICavebotRuleNode[] | IPersistenceRuleNode[] | ITargetingRuleNode[] | ITargetingSettingsRuleNode[] | IWaypointNode[]

export const ENodeTypes = {
  "HealthRootNode": 0,
  "CavebotRootNode": 1,
  "PersistenceRootNode": 2,
  "TargetingRootNode": 3,
  "HealthRuleNode": 10,
  "CavebotRuleNode": 11,
  "PersistenceRuleNode": 12,
  "TargetingRuleNode": 13,
  "TargetingSettingsRuleNode": 14,
  "WaypointNode": 15
} as const

export type ITreeNode = {
  id: string;
  label: string;
}

export type IScript = {
  hogSettings: {
    healer: IHealthRootNode[],
    cavebot: ICavebotRootNode[],
    persistences: IPersistenceRootNode[],
    targeting: ITargetingRootNode[]
  }
}

export type IHealthRootNode = ITreeNode & {
  expanded: boolean;
  childrenType: typeof ENodeTypes["HealthRuleNode"];
  children: IHealthRuleNode[]
  type: typeof ENodeTypes["HealthRootNode"]
}

export type ICavebotRootNode = ITreeNode & {
  expanded: boolean;
  childrenType: typeof ENodeTypes["CavebotRuleNode"];
  children: ICavebotRuleNode[]
  type: typeof ENodeTypes["CavebotRootNode"],
}

export type IPersistenceRootNode = ITreeNode & {
  expanded: boolean;
  childrenType: typeof ENodeTypes["PersistenceRuleNode"];
  children: IPersistenceRuleNode[]
  type: typeof ENodeTypes["PersistenceRootNode"]
}

export type ITargetingRootNode = ITreeNode & {
  expanded: boolean;
  childrenType: typeof ENodeTypes["TargetingRuleNode"];
  children: ITargetingRuleNode[]
  type: typeof ENodeTypes["TargetingRootNode"]
}

export type IHealthRuleNode = ITreeNode & {
  parentId: string;
  value: {
    enabled: boolean;
    method: string,
    mpMin: number;
    mpMax: number;
    hpMin: number;
    hpMax: number;
    extraCondition: typeof EHealthRuleExtraCondition[keyof typeof EHealthRuleExtraCondition]
  }
  type: typeof ENodeTypes["HealthRuleNode"],
}

export type ICavebotRuleNode = ITreeNode & {
  parentId: string;
  type: typeof ENodeTypes["CavebotRuleNode"];
  expanded: boolean;
  childrenType: typeof ENodeTypes["WaypointNode"];
  children: IWaypointNode[]
}

export type IWaypointNode = ITreeNode & {
  parentId: string;
  type: typeof ENodeTypes["WaypointNode"];
  value: {
    position: {
      x: number,
      y: number,
      z: number,
      range?: {
        x: number,
        y: number
      }
    },
    waypointType: typeof EWaypointType[keyof typeof EWaypointType]
  }
}

export type IPersistenceRuleNode = ITreeNode & {
  parentId: string;
  type: typeof ENodeTypes["PersistenceRuleNode"],
  value: {
    enabled: boolean;
    code: string
  }
}

export type ITargetingRuleNode = ITreeNode & {
  expanded: boolean;
  parentId: string;
  type: typeof ENodeTypes["TargetingRuleNode"],
  childrenType: typeof ENodeTypes["TargetingSettingsRuleNode"],
  children: ITargetingSettingsRuleNode[],
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

export type ITargetingSettingsRuleNode = ITreeNode & {
  parentId: string;
  type: typeof ENodeTypes["TargetingSettingsRuleNode"],
  value: {
    enabled: boolean;
    hpMin: number;
    hpMax: number;
    attackMode: typeof EAttackSettings[keyof typeof EAttackSettings];
    attackAvoidance: typeof EAttackAvoidance[keyof typeof EAttackAvoidance];
    desiredStance: typeof EDesiredStance[keyof typeof EDesiredStance];
    desiredDistance: typeof EDesiredDistance[keyof typeof EDesiredDistance];
    syncSpells: boolean;
    firstSpell: string | null;
    secondSpell: string | null;
    thirdSpell: string | null;
    lureSpell: string | null;
  }
}

export type DropInfo = {
  dropBorder: string;
  dropBorderNodeId: string;
  dropableNodeId: string;
  startIdx: number;
  dropIdx: number;
}
