import { Injectable } from "@nestjs/common";
import { Operation } from "./events.gateway";
import BaseOperation from "./operations/base-operation";
import NavigateOperation from "./operations/navigate.operation";
import SetupOperation from "./operations/setup.operation";

@Injectable()
export class OperationsService {
  private readonly operations: Record<string, BaseOperation> = {
    'base/setup': new SetupOperation(),
    'navigation/navigate': new NavigateOperation(),
  }

  async runOperation(operation: Operation) {
    console.log('[OperationsService] Running operation:', operation.label, 'args:', operation.args);
    console.log('Operations:', this.operations);
    
    const op = this.operations[operation.label];
    if (!op?.run) { return; }
    return await op.run(operation);
  }
}