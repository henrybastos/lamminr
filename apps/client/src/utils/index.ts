import { ReactFlowJsonObject } from "@xyflow/react";

export interface FlowPayload {
  flow: Array<OperationData>
}

export interface OperationData {
  id: string,
  label?: string;
  connections: Array<{ source: string, target: string }>,
  args?: any;
}

/**
 * Converts a standard flow object into the custom FlowPayload schema.
 * @param {Object} data - Object A containing nodes and edges.
 * @returns {Object} - The formatted FlowPayload.
 */
export function convertToFlowPayload(data: ReactFlowJsonObject) {
  const { nodes, edges } = data;

  const flow = nodes.map((node) => {
    // 1. Filter edges where the current node is the source
    const connections = edges
      .filter((edge) => edge.source === node.id)
      .map((edge) => ({
        source: edge.source,
        target: edge.target,
      }));

    // 2. Build the OperationData object
    const operation: OperationData = {
      id: node.id,
      label: node.data?.label as string,
      connections: connections,
    };

    // 3. Include payload if data exists (mapping React Flow 'data' to 'payload')
    if (node.data && Object.keys(node.data).length > 0) {
      operation.args = node.data.args;
    }

    return operation;
  });

  return flow;
}