import { Secret } from "../infisicalClient";
import { TreeNode } from "../types";

export function buildTree(secrets: Secret[]): TreeNode {
  const root: TreeNode = {
    name: "/",
    path: "/",
    type: "folder",
    children: [],
  };

  // Sort secrets by path for consistent ordering
  const sortedSecrets = [...secrets].sort((a, b) =>
    a.secretPath.localeCompare(b.secretPath)
  );

  for (const secret of sortedSecrets) {
    const pathParts = secret.secretPath.split("/").filter(Boolean);
    let currentNode = root;

    // Navigate/create folder structure
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      const currentPath = "/" + pathParts.slice(0, i + 1).join("/");

      if (!currentNode.children) {
        currentNode.children = [];
      }

      let childNode = currentNode.children.find(
        (child) => child.name === part && child.type === "folder"
      );

      if (!childNode) {
        childNode = {
          name: part,
          path: currentPath,
          type: "folder",
          children: [],
        };
        currentNode.children.push(childNode);
      }

      currentNode = childNode;
    }

    // Add the secret to the current folder
    if (!currentNode.children) {
      currentNode.children = [];
    }

    currentNode.children.push({
      name: secret.key,
      path: `${secret.secretPath}/${secret.key}`,
      type: "secret",
      secretValue: secret.value,
    });
  }

  // Sort children recursively (folders first, then alphabetically)
  const sortChildren = (node: TreeNode) => {
    if (node.children) {
      node.children.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "folder" ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      node.children.forEach(sortChildren);
    }
  };

  sortChildren(root);

  return root;
}
