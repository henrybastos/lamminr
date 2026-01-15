import { ContextMenu } from '@base-ui/react/context-menu';
import Button from './ui/button';
import { IconChevronRight } from '@tabler/icons-react';

interface CanvasContextMenuProps {
  children: React.ReactNode;
  updateNewNodeCoords: (screenCoords: { x: number, y: number }) => void;
  addNode: (nodeLabel: string) => void;
}

export const CanvasContextMenu = ({ children, updateNewNodeCoords, addNode }: CanvasContextMenuProps) => {
  return (
    <ContextMenu.Root onOpenChange={(open, coords) => { if (open) updateNewNodeCoords({ x: (coords.event as MouseEvent).clientX, y: (coords.event as MouseEvent).clientY }) }}>
      <ContextMenu.Trigger className="w-screen h-screen">
        { children }
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
                  <ContextMenu.Item><Button variant="ghost" onClick={() => addNode('navigation/navigate')}>Navigate</Button></ContextMenu.Item>
                  <ContextMenu.Item><Button variant="ghost" onClick={() => addNode('base/setup')}>Setup</Button></ContextMenu.Item>
                  <ContextMenu.Item><Button variant="ghost" onClick={() => addNode('control/wait')}>Wait</Button></ContextMenu.Item>
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
  )
}