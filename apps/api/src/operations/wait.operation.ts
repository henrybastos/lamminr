import Operator from "src/operator";
import BaseOperation from "./base-operation";
import { Operation } from "src/events.gateway";

class WaitOperation extends BaseOperation {
  constructor() {
    super({
      title: 'Wait',
      label: 'control/wait',
      description: 'Waits for the specified duration.',
    })
  }

  async action(props: Operation & { args: { duration: number } }) {
    if (!Operator.page) { throw new Error('Operator page not initialized.'); }
    if (!props.args.duration) { throw new Error('Duration not provided.'); }

    console.log('[WaitOperation::action] Waiting for duration:', props.args.duration);
    await new Promise(resolve => setTimeout(resolve, props.args.duration));
    return { next: props.connections?.[0]?.target };
  }
}

export default WaitOperation;
