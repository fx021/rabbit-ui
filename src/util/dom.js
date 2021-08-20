export function getParentNode(node, level) {
  while (level){
    node = node.parentNode;
    level--;
  }
  return node;
}
