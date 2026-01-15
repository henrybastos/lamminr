import Operator from "src/operator";
import BaseOperation from "./base-operation";
import { Operation } from "src/events.gateway";

interface SetupOperationArgs {
  config?: {
    headless?: boolean;
    defaultTimeout?: number;
  };
}

class SetupOperation extends BaseOperation {
  constructor() {
    super({
      title: 'Setup',
      label: 'base/setup',
      description: 'Sets up the browser with configurations.',
    })
  }

  async action(props: Operation & { args: SetupOperationArgs }) {
    // if (!props.args?.config) { return; }
    console.log('[Operation::base/setup] Props:', props);

    return { next: props.connections?.[0]?.target };
  }
}

export default SetupOperation;