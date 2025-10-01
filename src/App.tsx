import { useEffect, useState } from "react";
import { TreeView } from "./components/TreeView";
import { InfisicalClient } from "./infisicalClient";
import { TreeNode } from "./types";
import { buildTree } from "./utils/buildTree";

function App() {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [secretCount, setSecretCount] = useState(0);

  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        setLoading(true);
        setError(null);

        const client = await InfisicalClient.init();
        const secrets = await client.listAllSecrets();

        setSecretCount(secrets.length);
        const treeData = buildTree(secrets);
        setTree(treeData);
      } catch (err) {
        console.error("Error fetching secrets:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch secrets"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSecrets();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "24px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "700",
              color: "#111827",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span>🔐</span>
            Infisical Secrets Browser
          </h1>
          {!loading && !error && (
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Loaded {secretCount} secret{secretCount !== 1 ? "s" : ""} from{" "}
              <span style={{ fontWeight: "500", color: "#374151" }}>
                {process.env.INFISICAL_ENV_SLUG || "dev"}
              </span>{" "}
              environment
            </p>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "24px" }}>
          {loading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  border: "4px solid #e5e7eb",
                  borderTopColor: "#2563eb",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p style={{ color: "#6b7280", fontSize: "14px" }}>
                Loading secrets...
              </p>
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "24px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                color: "#991b1b",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "20px" }}>⚠️</span>
                <strong style={{ fontSize: "16px" }}>Error</strong>
              </div>
              <p style={{ margin: 0, fontSize: "14px" }}>{error}</p>
              <p
                style={{
                  margin: "12px 0 0 0",
                  fontSize: "13px",
                  color: "#dc2626",
                }}
              >
                Please check your .env configuration and ensure your credentials
                are correct.
              </p>
            </div>
          )}

          {!loading && !error && tree && (
            <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
              {tree.children && tree.children.length > 0 ? (
                tree.children.map((child, index) => (
                  <TreeView key={`${child.path}-${index}`} node={child} />
                ))
              ) : (
                <div
                  style={{
                    padding: "48px",
                    textAlign: "center",
                    color: "#6b7280",
                  }}
                >
                  <p style={{ fontSize: "16px", margin: 0 }}>
                    No secrets found
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "16px auto 0",
          textAlign: "center",
          fontSize: "12px",
          color: "#9ca3af",
        }}
      >
        <p style={{ margin: 0 }}>
          Project: {process.env.INFISICAL_PROJECT_ID || "N/A"} | Environment:{" "}
          {process.env.INFISICAL_ENV_SLUG || "dev"}
        </p>
      </div>
    </div>
  );
}

export default App;
