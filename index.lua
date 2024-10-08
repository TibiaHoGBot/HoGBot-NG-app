local home = os.getenv("HOME")
local launcher = require('webview-launcher')
local dialog = require("nvdialog")
local helpers = require("bot_modules/helpers")
local jsonLib = require("cjson")
local createBhTree = require("behaviourtree/init")

if home then
  package.cpath = package.cpath .. ";" .. home .. "/.luarocks/lib/lua/5.3/?.so"
end

dialog.init()

local state = {
  healer = {
    enabled = true,
    rules = {
      {
        id = "healer-rule-1"
      }
    },
  },
  persistences = {
    enabled = false,
    rules = {}
  },
  hp = 40,
  mp = 50,
  health_rule = nil
}

local bhtree = createBhTree(state, true)

if not bhtree then
  os.exit(0)
end


local url, wxOptions = helpers.parseArgs()

local saveFile = helpers.saveFile
local loadFile = helpers.loadFile
local updateState = helpers.updateState

local options = {
  expose = {
    saveFile = saveFile,
    loadFile = loadFile,
    update = updateState
  },
  context = {
    dialog = dialog,
    jsonLib = jsonLib,
    state = state
  }
}

launcher.launchWithOptions(url, wxOptions, options)
