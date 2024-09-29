local home = os.getenv("HOME")
local launcher = require('webview-launcher')
local dialog = require("nvdialog")

if home then
  package.cpath = package.cpath .. ";" .. home .. "/.luarocks/lib/lua/5.3/?.so"
end

dialog.init()

local url = nil
local urlArg = arg[1]

if urlArg and urlArg ~= '' then
  if urlArg == '-h' or urlArg == '/?' or urlArg == '--help' then
    print('Opens a WebView using the specified URL')
    print('Optional arguments: url title width height resizable')
    os.exit(0)
  end
  local protocol = string.match(urlArg, '^([^:]+):.+$')
  if protocol == 'http' or protocol == 'https' or protocol == 'file' or protocol == 'data' then
    url = urlArg
  elseif string.match(urlArg, '^.:\\.+$') or string.match(urlArg, '^/.+$') then
    url = 'file://' .. tostring(urlArg)
  else
    print('Invalid URL, to open a file please use an absolute path')
    os.exit(22)
  end
end

local title = arg[2] or 'Web View'
local width = arg[3] or 800
local height = arg[4] or 600
local resizable = arg[5] ~= 'false'

local wxOptions = {
  title = title,
  width = width,
  height = height,
  resizable = resizable,
  debug = true
}


local function saveFile(value)
  local path = dialog.save_file_dialog_new("Save File", ".json", "script.json")

  if not path then
    print("No file path provided.")
    return
  end

  local file, err = io.open(path, "w")

  if not file then
    print("Error opening file: " .. err)
    return
  end

  file:write(value)
  file:close()
end

local function loadFile(_, _, context, _)
  local path = dialog.open_file_dialog_new("Open File", "json")

  if not path then
    print("No file path provided.")
    return
  end

  local file, err = io.open(path, "r")

  if not file then
    print("Error opening file: " .. err)
    return
  end

  local val = file:read("*all")
  context.evalJs("window.loadData(" .. tostring(val) .. ")")
  file:close()
end

local options = {
  expose = {
    saveFile = saveFile,
    loadFile = loadFile,
  }
}

launcher.launchWithOptions(url, wxOptions, options)
