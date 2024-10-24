local class                  = require('libs/behaviourtree/middleclass')
local Decorator              = require('libs/behaviourtree/node_types/decorator')
local AlwaysSucceedDecorator = class('AlwaysSucceedDecorator', Decorator)

function AlwaysSucceedDecorator:fail()
  self:success()
end

return AlwaysSucceedDecorator
