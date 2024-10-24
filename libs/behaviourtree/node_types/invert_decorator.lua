local class           = require('libs/behaviourtree/middleclass')
local Decorator       = require('libs/behaviourtree/node_types/decorator')
local InvertDecorator = class('InvertDecorator', Decorator)

function InvertDecorator:success()
  Decorator.fail(self)
end

function InvertDecorator:fail()
  Decorator.success(self)
end

return InvertDecorator
