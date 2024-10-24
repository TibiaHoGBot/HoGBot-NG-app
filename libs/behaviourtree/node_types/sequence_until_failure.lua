local class                = require('libs/behaviourtree/middleclass')
local Sequence             = require('libs/behaviourtree/node_types/sequence')
local BranchNode           = require('libs/behaviourtree/node_types/branch_node')
local SequenceUntilFailure = class('SequenceUntilFailure', Sequence)

function SequenceUntilFailure:fail()
  BranchNode.fail(self)
end

function SequenceUntilFailure:success()
  self:switchToNextChild()
  if self.childNode then
    self.childNode:start()
  else
    -- Out of children, we are done
    BranchNode.success(self)
  end
end

return SequenceUntilFailure
