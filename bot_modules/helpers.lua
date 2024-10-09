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

function helpers.loadState(value, _, context, _)
  local jsonLib = context["jsonLib"]
  local state = context["state"]

  if not state then
    print("updateState: failed to provide state")
  end

  local s, parsed = pcall(jsonLib.decode, value)

  if not s then
    print("updateState: failed to decode json")
  end

  state = parsed

  print(helpers.dump(state))
end

function helpers.updateState(value, _, context, _)
  print("updateState")
  local jsonLib = context["jsonLib"]
  local state = context["state"]


  if not state then
    print("updateState: failed to provide state")
  end

  local s, parsed = pcall(jsonLib.decode, value)

  if not s then
    print("updateState: failed to decode json")
  end

  local action = parsed["action"]

  if not action or (action ~= "update" and action ~= "remove" and action ~= "create" and action ~= "reorder" and action ~= "enable") then
    print("updateState: action is absent or invalid")
  end

  local moduleName = parsed["moduleName"]
  print("module: " .. moduleName .. " - id: " .. parsed["id"])
  print(type(parsed["id"]))
  if action == "create" then
    local rule = parsed["value"]
    rule["id"] = parsed["id"]
    table.insert(state[moduleName]["rules"], #state[moduleName]["rules"] + 1, rule)
  elseif action == "reorder" then
    local item = table.remove(state[moduleName]["rules"], parsed["startIdx"] + 1)
    table.insert(state[moduleName]["rules"], parsed["dropIdx"] + 1, item)
  else
    local foundRule = false
    print(#state[moduleName]["rules"])
    for i, rule in pairs(state[moduleName]["rules"]) do
      for k, v in pairs(rule) do
        print("rule - " .. k .. v)
        if k == "id" and v == parsed["id"] then
          if action == "update" then
            for field, val in pairs(parsed["value"]) do state[moduleName]["rules"][i][field] = val end
          elseif action == "remove" then
            table.remove(state[moduleName]["rules"], i)
          elseif action == "enable" then
            state[moduleName]["rules"][i]["enabled"] = parsed["value"]
          end

          foundRule = true
          break
        end
      end
    end

    if not foundRule then
      print("updateState: Failed to find the rule")
    end
  end

  print(helpers.dump(state[moduleName]["rules"]))
end

function helpers.dump(o)
  if type(o) == 'table' then
    local s = '{ '
    for k, v in pairs(o) do
      if type(k) ~= 'number' then k = '"' .. k .. '"' end
      s = s .. '[' .. k .. '] = ' .. helpers.dump(v) .. ','
    end
    return s .. '} '
  else
    return tostring(o)
  end
end

return helpers
