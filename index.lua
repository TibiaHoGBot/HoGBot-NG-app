local home = os.getenv("HOME")
local launcher = require('webview-launcher')
local dialog = require("nvdialog")
local helpers = require("bot_modules/helpers")
local createBhTree = require("behaviourtree/init")

if home then
  package.cpath = package.cpath .. ";" .. home .. "/.luarocks/lib/lua/5.3/?.so"
end

dialog.init()

local health_rules = { {
  hpMin = 30,
  hpMax = 80,
  mpMin = 30,
  mpMax = 80,
  name = "Light Healing"
} }

local persistences = {
  {
    time = 5000,
    value = "haste"
  },
  {
    time = 3000,
    value = "exiva"
  },
}

local state = {
  healer = {
    enabled = true,
    rules = health_rules,
  },
  persistences = {
    enabled = false,
    rules = persistences
  },
  hp = 40,
  mp = 50,
  health_rule = nil
}

local bhtree = createBhTree(state, true)

if not bhtree then
  os.exit(0)
end

bhtree:run()


local url, wxOptions = helpers.parseArgs()

local saveFile = helpers.saveFile
local loadFile = helpers.loadFile

local options = {
  expose = {
    saveFile = saveFile,
    loadFile = loadFile,
  },
  context = {
    dialog = dialog
  }
}

launcher.launchWithOptions(url, wxOptions, options)
