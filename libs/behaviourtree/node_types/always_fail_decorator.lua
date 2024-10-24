local class               = require('libs/behaviourtree/middleclass')
local Decorator           = require('libs/behaviourtree/node_types/decorator')
local AlwaysFailDecorator = class('AlwaysFailDecorator', Decorator)

function AlwaysFailDecorator:success()
  self:fail()
end

return AlwaysFailDecorator
