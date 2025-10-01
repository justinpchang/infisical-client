import React, { useState } from "react";
import { TreeNode } from "../types";

interface TreeViewProps {
  node: TreeNode;
  level?: number;
}

export const TreeView: React.FC<TreeViewProps> = ({ node, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const indent = level * 20;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (node.type === "folder") {
    return (
      <div style={{ marginLeft: `${indent}px` }}>
        <div
          onClick={toggleExpanded}
          style={{
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "500",
            color: "#2563eb",
            backgroundColor: "transparent",
            borderRadius: "4px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f3f4f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <span style={{ fontSize: "14px" }}>{isExpanded ? "📂" : "📁"}</span>
          <span>{node.name}</span>
          <span style={{ fontSize: "12px", color: "#6b7280" }}>
            ({node.children?.length || 0})
          </span>
        </div>
        {isExpanded && node.children && (
          <div>
            {node.children.map((child, index) => (
              <TreeView
                key={`${child.path}-${index}`}
                node={child}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Secret node
  return (
    <div
      style={{
        marginLeft: `${indent}px`,
        padding: "8px",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        backgroundColor: "transparent",
        borderRadius: "4px",
        transition: "background-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#fef3c7";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <span style={{ fontSize: "14px", marginTop: "2px" }}>🔑</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{ fontWeight: "500", color: "#1f2937", marginBottom: "4px" }}
        >
          {node.name}
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "13px",
            color: "#374151",
            backgroundColor: "#f9fafb",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #e5e7eb",
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
          }}
        >
          {node.secretValue}
        </div>
      </div>
    </div>
  );
};
