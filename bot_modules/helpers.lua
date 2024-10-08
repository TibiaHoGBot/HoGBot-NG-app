local helpers = {}

function helpers.parseArgs()
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

  return url, wxOptions
end

function helpers.saveFile(value, _, context, _)
  local dialog = context["dialog"]

  if not dialog then
    print("saveFile: No dialog found.")
    return
  end
  local path = dialog.save_file_dialog_new("Save File", ".json", "script.json")

  if not path then
    print("saveFile:  No file path provided.")
    return
  end

  local file, err = io.open(path, "w")

  if not file then
    print("saveFile:  Error opening file - " .. err)
    return
  end

  file:write(value)
  file:close()
end

function helpers.loadFile(_, _, context, _)
  local dialog = context["dialog"]

  if not dialog then
    print("loadFile: No dialog found")
    return
  end

  local path = dialog.open_file_dialog_new("Open File", "json")

  if not path then
    print("loadFile: No file path provided")
    return
  end

  local file, err = io.open(path, "r")

  if not file then
    print("loadFile: Error opening file - " .. err)
    return
  end

  local val = file:read("*all")
  context.evalJs("window.loadData(" .. tostring(val) .. ")")
  file:close()
end

function helpers.updateState(value, _, context, _)
  local jsonLib = context["jsonLib"]
  local state = context["state"]

  local s, r = pcall(jsonLib.decode, value)

  if not s then
    print("updateState: failed to decode json")
  end

  local moduleName = r["moduleName"]
  local foundRule = false

  for i, rule in pairs(state[moduleName]["rules"]) do
    for k, v in pairs(rule) do
      if k == "id" and v == r["id"] then
        state[moduleName]["rules"][i] = r["value"]
        state[moduleName]["rules"][i]["id"] = r["id"]
        foundRule = true
        break
      end
    end
  end

  if not foundRule then
    print("updateState: Failed to find the rule")
    return
  end
end

return helpers
