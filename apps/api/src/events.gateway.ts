import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { OperationsService } from './operations.service';
import BaseOperation from './operations/base-operation';

export interface Operation {
  id: string;
  label: string;
  connections: Array<Record<'source' | 'target', string>>;
  args: any;
  config?: any;
}

export interface RunOperationRequest {
  operations: Array<Operation>
}

@WebSocketGateway({
  cors: { origin: '*', },
})
export class EventsGateway {
  constructor(private operationsService: OperationsService) { }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage('operations:run')
  async runOperations(@MessageBody() data: RunOperationRequest): Promise<any> {
    console.log('Data', JSON.stringify(data, null, 2));
    
    const setupOperation = data.operations[0];

    const run = async (operation: Operation) => {
      console.log(`[WS Server] Running operation:`, operation);
      const { next } = await this.operationsService.runOperation(operation);

      if (next) {
        console.log('[WS Server] Operations:', data.operations);
        const nextOperation = data.operations.find(op => op.id === next);
        if (nextOperation) { run(nextOperation); }
      }
    }

    await run(setupOperation);
  }
}