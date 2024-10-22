local bt               = require('libs/behaviourtree/behaviour_tree')
local json             = require("cjson")
local projectFile      = "hog.b3"
local registerHogNodes = require("bot_modules/bt_nodes")

local function createTree(state, debug)
  if not state or type(state) ~= "table" then
    print("behaviour_tree: must be a valid state")
    return
  end

  local file, err = io.open(projectFile, "r")

  if err or not file then
    print("behaviour_tree: failed reading the project file - " .. err)
    return
  end

  local projectJsonTable = json.decode(file:read("*a"))

  file:close()

  registerHogNodes()

  local bTrees = bt.LoadBehavior3Project(projectJsonTable, state)

  if debug then
    bTrees.tree:setDebugLevel(1)
  end

  return bTrees.tree
end

return createTree
