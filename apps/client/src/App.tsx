import React, { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Panel, Controls, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { OperationNode } from './components/nodes/operation-node.tsx';
import { SetupNode } from './components/nodes/setup-node.tsx';
import { io } from 'socket.io-client';
import Button from './components/ui/button';
import { IconPlayerPlay } from '@tabler/icons-react';
import { convertToFlowPayload } from './utils/index.ts';



const socket = io('http://localhost:3001');
socket.on('connect', function() {
  console.log('Connected');

  // socket.emit('events', { test: 'test' });

  socket.emit('identity', 0, (response: any) =>
    console.log('Identity:', response),
  );
});

// socket.on('events', function(data) {
//   console.log('[ws:event] Number:', data);
// });

socket.on('operations:run', function(data) {
  console.log('[ws:server] Operation:', data);
});

socket.on('exception', function(data) {
  console.log('event', data);
});

socket.on('disconnect', function() {
  console.log('Disconnected');
});



// {
//   "flow": [
//     {
//       "id": "start-navigate:001",
//       "connections": [
//         { "source": "start", "target": "navigate:001" }
//       ],
//       "payload": {
//         "url": "https://www.google.com"
//       }
//     }
//   ]
// }



const nodeTypes = {
  setup: SetupNode,
  operation: OperationNode,
};
 
const initialNodes = [
  { id: 'setup', position: { x: 0, y: 100 }, data: { label: 'base/setup', config: {} }, type: 'setup' },
  { id: 'navigate:01', position: { x: 0, y: 200 }, data: { title: 'Navigate', label: 'navigation/navigate', args: { url: 'https://hytale.com/countdown' } }, type: 'operation' },
];

const initialEdges = [
  { id: 'setup-navigate:01', source: 'setup', target: 'navigate:01', type: 'smoothstep' }
];
 
export default function App() {
  const flow = useReactFlow();
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
 
  const onNodesChange = useCallback(
    (changes: any) => { setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)) },
    [],
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      console.log('[OnChange:Edges]', changes);
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));
    },
    [],
  );

  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  function playOperations () {
    const flowObject = flow.toObject();
    const operations = convertToFlowPayload(flowObject);
    console.log('Flow:', JSON.stringify(operations, null, 2));
    socket.emit('operations:run', { operations })
  }
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitViewOptions={{
          maxZoom: 1.25
        }}
        fitView
      >
        <Panel position="top-center" className="flex flex-row gap-3 bg-neutral-50 border border-solid border-neutral-300 rounded-sm w-2xl py-3 px-5">
          <Button size="icon:md" onClick={playOperations}>
            <IconPlayerPlay stroke={2} size={20}/>
          </Button>
        </Panel>

        <Controls showZoom={true} />
        <Background />
      </ReactFlow>
    </div>
  );
}