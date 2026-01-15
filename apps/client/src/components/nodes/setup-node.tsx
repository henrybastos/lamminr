import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { useCallback } from 'react';
import Input from '../ui/input';

type SetupNodeProps = Node<{
  config: Record<string, any>;
}>

export const SetupNode = ({ data }: NodeProps<SetupNodeProps>) => {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);
  
  return (
    <div className="flex flex-col gap-3 bg-neutral-50 border border-neutral-300 rounded-sm p-3 w-sm">
      <h3 className="text-lg text-neutral-900 font-semibold leading-tight">Setup</h3>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};