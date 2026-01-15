import React, { useState, useCallback } from 'react';
import { ContextMenu } from '@base-ui/react/context-menu';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Panel, Controls, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { OperationNode } from './components/nodes/operation-node.tsx';
import { SetupNode } from './components/nodes/setup-node.tsx';
import { io } from 'socket.io-client';
import Button from './components/ui/button';
import { IconChevronRight, IconPlayerPlay } from '@tabler/icons-react';
import { convertToFlowPayload } from './utils/index.ts';
import { nanoid } from 'nanoid';



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
    args: { url: 'https://hytale.com/countdown' },
    type: 'operation',
  },
  'base/setup': {
    title: 'Setup',
    args: { config: {} },
    type: 'setup',
  },
}

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
  const [screenCoords, setScreenCoords] = useState({ x: 0, y: 0 });
 
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
    (params: any) => setEdges((edgesSnapshot) => addEdge({ ...params, type: 'smoothstep'  }, edgesSnapshot)),
    [],
  );

  function playOperations () {
    const flowObject = flow.toObject();
    const operations = convertToFlowPayload(flowObject);
    console.log('Flow:', JSON.stringify(operations, null, 2));
    socket.emit('operations:run', { operations })
  }

  function addNode(nodeLabel: string) {
    const newNode = nodesShelf[nodeLabel as keyof typeof nodesShelf];
    flow.addNodes([{ id: nanoid(), position: screenCoords, data: { title: newNode.title, ...newNode.args }, type: newNode.type }]);
  }

  function updateNewNodeCoords(screenCoords: { x: number, y: number }) {
    setScreenCoords(flow.screenToFlowPosition(screenCoords));
  }
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
        <ContextMenu.Root onOpenChange={(open, coords) => { if (open) updateNewNodeCoords({ x: (coords.event as MouseEvent).clientX, y: (coords.event as MouseEvent).clientY }) }}>
          <ContextMenu.Trigger className="w-screen h-screen">
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
          </ContextMenu.Trigger>

          <ContextMenu.Portal>
            <ContextMenu.Positioner>
              <ContextMenu.Popup className="flex flex-col gap-1.5 p-1.5 bg-neutral-50 border border-neutral-300 rounded-sm *:whitespace-nowrap">
                <ContextMenu.SubmenuRoot>
                  <ContextMenu.SubmenuTrigger>
                    <Button variant="ghost">
                      Add node
                      <IconChevronRight />
                    </Button>
                  </ContextMenu.SubmenuTrigger>
                  {/* <Button variant="ghost">Node 1</Button> */}
                  <ContextMenu.Positioner>
                    <ContextMenu.Popup className="flex flex-col gap-1.5 p-1.5 bg-neutral-50 border border-neutral-300 rounded-sm *:whitespace-nowrap">
                      <ContextMenu.Item>
                        <Button variant="ghost" onClick={() => addNode('navigation/navigate')}>Navigate</Button>
                      </ContextMenu.Item>

                      <ContextMenu.Item>
                        <Button variant="ghost" onClick={() => addNode('base/setup')}>Setup</Button>
                      </ContextMenu.Item>
                    </ContextMenu.Popup>
                  </ContextMenu.Positioner>
                </ContextMenu.SubmenuRoot>

                <ContextMenu.Separator className="h-px mx-1.5 shrink bg-neutral-200"/>

                <ContextMenu.Item>
                  <Button variant="ghost" disabled>WIP</Button>
                </ContextMenu.Item>
              </ContextMenu.Popup>
            </ContextMenu.Positioner>
          </ContextMenu.Portal>
        </ContextMenu.Root>
    </div>
  );
}