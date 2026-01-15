import React, { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Panel, Controls, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NavigateNode } from './components/nodes/navigate-node.tsx';
import { SetupNode } from './components/nodes/setup-node.tsx';
import { io } from 'socket.io-client';
import Button from './components/ui/button';
import { IconChevronRight, IconPlayerPlay } from '@tabler/icons-react';
import { convertToFlowPayload } from './utils/index.ts';
import { nanoid } from 'nanoid';
import { CanvasContextMenu } from './components/canvas-context-menu.tsx';
import { WaitNode } from './components/nodes/wait-node.tsx';



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



const nodesShelf = {
  'navigation/navigate': {
    title: 'Navigate',
    label: 'navigation/navigate',
    args: { url: 'https://hytale.com/countdown' },
    type: 'navigate',
  },
  'base/setup': {
    title: 'Setup',
    label: 'base/setup',
    args: { config: {} },
    type: 'setup',
  },
  'control/wait': {
    title: 'Wait',
    label: 'control/wait',
    args: { duration: 1000 },
    type: 'wait',
  },
}

const nodeTypes = {
  setup: SetupNode,
  navigate: NavigateNode,
  wait: WaitNode,
};
 
const initialNodes = [
  { id: 'setup', position: { x: 0, y: 100 }, data: { label: 'base/setup', config: {} }, type: 'setup' },
  { id: 'navigate:01', position: { x: 0, y: 200 }, data: { title: 'Navigate', label: 'navigation/navigate', args: { url: 'https://hytale.com/countdown' } }, type: 'navigate' },
];

const initialEdges = [
  { id: 'setup-navigate:01', source: 'setup', target: 'navigate:01', type: 'smoothstep' }
];


 
export default function App() {
  const flow = useReactFlow();
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [screenCoords, setScreenCoords] = useState({ x: 0, y: 0 });
 
  const onNodesChange = useCallback(
    (changes: any) => { console.log('Changes nodes'); setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)) },
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
    (params: any) => setEdges((edgesSnapshot) => addEdge({ ...params, type: 'smoothstep'  }, edgesSnapshot)),
    [],
  );

  function playOperations () {
    const flowObject = flow.toObject();
    const operations = convertToFlowPayload(flowObject);
    console.log('Running operations:', operations);
    socket.emit('operations:run', { operations })
  }

  function addNode(nodeLabel: string) {
    const newNode = nodesShelf[nodeLabel as keyof typeof nodesShelf];
    flow.addNodes([{ id: nanoid(), position: screenCoords, data: { title: newNode.title, args: newNode.args, label: newNode.label }, type: newNode.type }]);
  }

  function updateNewNodeCoords(screenCoords: { x: number, y: number }) {
    setScreenCoords(flow.screenToFlowPosition(screenCoords));
  }
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <CanvasContextMenu updateNewNodeCoords={updateNewNodeCoords} addNode={addNode}>
        <ReactFlow
          className="relative"
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
          <Panel position="top-center" className="flex flex-row items-center justify-between gap-3 bg-neutral-50 border border-solid border-neutral-300 rounded-sm w-2xl py-3 px-5">
            <h1 className="font-display text-xl font-bold">lamminr</h1>

            <div className="flex flex-row items-center h-full w-fit gap-3">
              <Button size="icon:md" onClick={playOperations}>
                <IconPlayerPlay stroke={2} size={20}/>
              </Button>
            </div>
          </Panel>

          <Controls showZoom={true} />
          <Background />
        </ReactFlow>
      </CanvasContextMenu>
    </div>
  );
}