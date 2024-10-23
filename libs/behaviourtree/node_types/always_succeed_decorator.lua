local _PACKAGE               = "libs/behaviourtree"
local class                  = require(_PACKAGE .. '/middleclass')
local Decorator              = require(_PACKAGE .. '/node_types/decorator')
local AlwaysSucceedDecorator = class('AlwaysSucceedDecorator', Decorator)

function AlwaysSucceedDecorator:fail()
  self:success()
end

return AlwaysSucceedDecorator
