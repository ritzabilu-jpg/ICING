import treeData from './tree.json';

export type NodeType = 'message' | 'options' | 'end' | 'agent';

export interface TreeNode {
  id: string;
  type: NodeType;
  parentId: string | null;
  text: string;
  children: TreeNode[];
}

function buildMap(node: TreeNode, map = new Map<string, TreeNode>()): Map<string, TreeNode> {
  map.set(node.id, node);
  for (const child of node.children) buildMap(child, map);
  return map;
}

export const treeRoot: TreeNode = (treeData as { tree: TreeNode }).tree;
export const nodeMap = buildMap(treeRoot);
