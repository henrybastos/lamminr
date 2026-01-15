import { Operation } from "src/events.gateway";
import Operator from "../operator";

export interface BaseOperationProps {
  title: string;
  label: string;
  description?: string;
}

class BaseOperation {
  title: string;
  label: string;
  description?: string;

  constructor({ title, label, description }: BaseOperationProps) {
    this.title = title;
    this.label = label;
    this.description = description;
  }

  async start() {
    console.log('[Operation::start] Starting operation:', this.label);
  }

  async run(operation: Operation) {
    try {
      console.log(`[Operation::${ this.label }] Running operation:`, operation);

      return await this.action(operation);
    } catch (error) {
      console.error(`[Operation::${ this.label }] [Error running operation]`, error);
    }
  }

  async action(args: any): Promise<any> {}
}

export default BaseOperation;
