export interface Secret {
  key: string;
  value: string;
  secretPath: string;
}

export interface TreeNode {
  name: string;
  path: string;
  type: "folder" | "secret";
  children?: TreeNode[];
  secretValue?: string;
}
