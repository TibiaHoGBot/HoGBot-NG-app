local _PACKAGE         = (...):match("^(.+)[%./][^%./]+") or ""
local Registry         = require(_PACKAGE .. '/registry')
local bt               = require(_PACKAGE .. '/behaviour_tree')
local registerHogNodes = require(_PACKAGE .. "/nodes/hog_nodes")
local json             = require("cjson")
local projectFile      = _PACKAGE .. "/hog.b3"


local function createTree(state, debug)
  if not state or type(state) ~= "table" then
    print("behaviour_tree: must be a valid state")
    return
  end

  registerHogNodes(Registry)

  local file, err = io.open(projectFile, "r")

  if err or not file then
    print("behaviour_tree: failed reading the project file - " .. err)
    return
  end

  local projectJsonTable = json.decode(file:read("*a"))

  file:close()

  local bTrees = bt.LoadBehavior3Project(projectJsonTable, state)

  if debug then
    bTrees.tree:setDebugLevel(1)
  end

  return bTrees.tree
end

return createTree
