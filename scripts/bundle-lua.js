import {
  bundle,
} from 'luabundle'

import {
	writeFileSync,
  existsSync,
	mkdirSync
} from 'fs'

const bundledLua = bundle('./index.lua', {
  ignoredModuleNames: ["webview", "cjson", "jls.lang.event", "jls.util.WebView", "jls.net.http.handler.FileHttpHandler"]
})


if (!existsSync("./dist")) {
  mkdirSync("./dist", {recursive: true})
}

writeFileSync("./dist/bundle.lua", bundledLua)
