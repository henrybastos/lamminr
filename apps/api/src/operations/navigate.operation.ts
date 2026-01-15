import Operator from "src/operator";
import BaseOperation from "./base-operation";
import { Operation } from "src/events.gateway";

class NavigateOperation extends BaseOperation {
  constructor() {
    super({
      title: 'Navigate',
      label: 'navigation/navigate',
      description: 'Navigates the browser to the specified URL.',
    })
  }

  async action(props: Operation & { args: { url: string } }) {
    if (!Operator.page) { throw new Error('Operator page not initialized.'); }
    if (!props.args.url) { throw new Error('URL not provided.'); }

    console.log('[NavigateOperation::action] Navigating to URL:', props.args.url);
    await Operator.page.goto(props.args.url);
    console.log('[NavigateOperation::action] Props', props);
    return { next: props.connections?.[0]?.target };
  }
}

export default NavigateOperation;