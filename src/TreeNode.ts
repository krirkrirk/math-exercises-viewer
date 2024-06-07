import { throws } from "assert";

export class TreeNode {
  node: string;
  childs: TreeNode[];

  constructor(node: string, childs: TreeNode[]) {
    this.node = node;
    this.childs = childs;
  }

  appendChild(child: TreeNode) {
    this.childs.push(child);
  }

  removeChild(child: TreeNode) {}
}
