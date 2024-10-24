local class                = require('libs/behaviourtree/middleclass')
local Sequence             = require('libs/behaviourtree/node_types/sequence')
local BranchNode           = require('libs/behaviourtree/node_types/branch_node')
local SequenceUntilSuccess = class('SequenceUntilSuccess', Sequence)

function SequenceUntilSuccess:fail()
  self:switchToNextChild()
  if self.childNode then
    self.childNode:start()
  else
    -- Out of children, we are done
    BranchNode.fail(self)
  end
end

function SequenceUntilSuccess:success()
  BranchNode.success(self)
end

return SequenceUntilSuccess
