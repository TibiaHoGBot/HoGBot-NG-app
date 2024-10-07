local _PACKAGE  = (...):match("^(.+)[%./][^%./]+"):gsub("[%./]?nodes", "")

local Task      = require(_PACKAGE .. '/node_types/node')
local Decorator = require(_PACKAGE .. '/node_types/decorator')

function Heal(config)
  local props = config.properties
  local rule = props.rule

  config.run = function(task, state)
    print(rule().name)
    task:success()
  end

  return Task:new(config)
end

function GetProperHealthRule(config)
  local props = config.properties

  local hp = props["hp"]()
  local mp = props["mp"]()
  local rules = props["rules"]()

  config.start = function(task, state)
    if not hp or not mp then
      return task:fail()
    end

    local rule = nil
    for i = #rules, 1, -1 do
      local r = rules[i]

      if (hp >= r.hpMin and hp <= r.hpMax) and (mp >= r.mpMin and mp <= r.mpMax) then
        rule = r
      end
    end

    if rule then
      state.health_rule = rule
    else
      task:fail()
    end
  end

  return Decorator:new(config)
end

local function registerHogNodes(reg)
  reg.register("Heal", Heal)
  reg.register("GetProperHealthRule", GetProperHealthRule)
end

return registerHogNodes
