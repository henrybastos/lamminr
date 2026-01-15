import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { useCallback } from 'react';
import Input from '../ui/input';

type OperationNodeProps = Node<{
  title: string;
  args: {
    url: string;
  }
}>

export const OperationNode = ({ data }: NodeProps<OperationNodeProps>) => {
  const onChange = useCallback((evt: any) => {
    data.args.url = evt.target.value;
  }, []);
  
  return (
    <div className="flex flex-col gap-3 bg-neutral-50 border border-neutral-300 rounded-sm p-3 w-sm">
      <div>
        <h3 className="text-lg text-neutral-900 font-semibold leading-tight">{ data.title }</h3>
        {/* <span className="text-neutral-400 text-xs font-medium tracking-wider h-fit w-fit">operation/navigation</span> */}
        <span className="text-neutral-600 text-sm h-fit w-fit">Navigates to an URL</span>
      </div>

      {/* <input type="text" onChange={onChange} className="nodrag border border-neutral-300 rounded-xs"/> */}
      
      <Input onChange={onChange} />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};