local _PACKAGE        = "libs/behaviourtree"
local class           = require(_PACKAGE .. '/middleclass')
local Decorator       = require(_PACKAGE .. '/node_types/decorator')
local InvertDecorator = class('InvertDecorator', Decorator)

function InvertDecorator:success()
  Decorator.fail(self)
end

function InvertDecorator:fail()
  Decorator.success(self)
end

return InvertDecorator
