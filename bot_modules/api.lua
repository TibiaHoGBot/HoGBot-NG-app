local state_manager = require("bot_modules/state_manager")
local helpers = require("bot_modules/helpers")

local api = {
  updateState = state_manager.updateState,
  loadFile = helpers.loadFile,
  saveFile = helpers.saveFile
}

return api
