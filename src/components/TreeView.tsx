import React, { useState } from "react";
import { TreeNode } from "../types";

interface TreeViewProps {
  node: TreeNode;
  level?: number;
  searchTerm?: string;
  projectId?: string;
  environment?: string;
  forceExpand?: boolean;
}

export const TreeView: React.FC<TreeViewProps> = ({
  node,
  level = 0,
  searchTerm = "",
  projectId = "",
  environment = "",
  forceExpand = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // Collapsed by default
  const [expandAll, setExpandAll] = useState(false); // Track if all children should be expanded
  const indent = level * 16;

  // Update expansion state when forceExpand changes
  React.useEffect(() => {
    if (forceExpand) {
      setIsExpanded(true);
    }
  }, [forceExpand]);

  // Generate Infisical UI URL
  const getInfisicalUrl = (path: string) => {
    const encodedPath = encodeURIComponent(path);
    return `https://app.infisical.com/projects/secret-management/${projectId}/secrets/${environment}?secretPath=${encodedPath}`;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleExpandAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(true);
    setExpandAll(true);
  };

  const handleCollapseAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
    setExpandAll(false);
  };

  // Filter children based on search
  const filteredChildren = node.children?.filter((child) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    if (child.type === "secret") {
      return (
        child.name.toLowerCase().includes(term) ||
        child.secretValue?.toLowerCase().includes(term)
      );
    }
    // For folders, check if any descendant matches
    const hasMatchingDescendant = (n: TreeNode): boolean => {
      if (n.type === "secret") {
        return (
          n.name.toLowerCase().includes(term) ||
          n.secretValue?.toLowerCase().includes(term)
        );
      }
      return n.children?.some(hasMatchingDescendant) ?? false;
    };
    return hasMatchingDescendant(child);
  });

  // Auto-expand if searching or expandAll is triggered
  const shouldBeExpanded = searchTerm ? true : isExpanded;

  if (node.type === "folder") {
    return (
      <div style={{ marginLeft: `${indent}px` }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 6px",
            borderRadius: "3px",
            transition: "background-color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f3f4f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <div
            onClick={toggleExpanded}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: "500",
              fontSize: "13px",
              color: "#2563eb",
            }}
          >
            <span style={{ fontSize: "11px", width: "12px" }}>
              {shouldBeExpanded ? "📂" : "📁"}
            </span>
            <span>{node.name}</span>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>
              ({filteredChildren?.length || 0})
            </span>
          </div>
          <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
            <button
              onClick={handleExpandAll}
              style={{
                fontSize: "10px",
                color: "#6b7280",
                backgroundColor: "transparent",
                border: "none",
                padding: "2px 5px",
                borderRadius: "3px",
                cursor: "pointer",
                transition: "all 0.15s",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e5e7eb";
                e.currentTarget.style.color = "#059669";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#6b7280";
              }}
              title="Expand all"
            >
              [+]
            </button>
            <button
              onClick={handleCollapseAll}
              style={{
                fontSize: "10px",
                color: "#6b7280",
                backgroundColor: "transparent",
                border: "none",
                padding: "2px 5px",
                borderRadius: "3px",
                cursor: "pointer",
                transition: "all 0.15s",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e5e7eb";
                e.currentTarget.style.color = "#dc2626";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#6b7280";
              }}
              title="Collapse all"
            >
              [-]
            </button>
            <a
              href={getInfisicalUrl(node.path)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                fontSize: "11px",
                color: "#6b7280",
                textDecoration: "none",
                padding: "2px 6px",
                borderRadius: "3px",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e5e7eb";
                e.currentTarget.style.color = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#6b7280";
              }}
              title="Open in Infisical"
            >
              ↗
            </a>
          </div>
        </div>
        {shouldBeExpanded &&
          filteredChildren &&
          filteredChildren.length > 0 && (
            <div>
              {filteredChildren.map((child, index) => (
                <TreeView
                  key={`${child.path}-${index}`}
                  node={child}
                  level={level + 1}
                  searchTerm={searchTerm}
                  projectId={projectId}
                  environment={environment}
                  forceExpand={expandAll}
                />
              ))}
            </div>
          )}
      </div>
    );
  }

  // Secret node - horizontal layout
  const highlightMatch = (text: string) => {
    if (!searchTerm) return text;
    const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.slice(0, index)}
        <span style={{ backgroundColor: "#fef08a", fontWeight: "600" }}>
          {text.slice(index, index + searchTerm.length)}
        </span>
        {text.slice(index + searchTerm.length)}
      </>
    );
  };

  return (
    <div
      style={{
        marginLeft: `${indent}px`,
        padding: "3px 6px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: "transparent",
        borderRadius: "3px",
        transition: "background-color 0.15s",
        fontSize: "12px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#fef3c7";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <span
        style={{
          fontWeight: "500",
          color: "#1f2937",
          minWidth: "120px",
          maxWidth: "200px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
        title={node.name}
      >
        {highlightMatch(node.name)}
      </span>
      <span style={{ color: "#9ca3af", flexShrink: 0 }}>:</span>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#374151",
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={node.secretValue}
      >
        {searchTerm ? highlightMatch(node.secretValue || "") : node.secretValue}
      </span>
    </div>
  );
};
