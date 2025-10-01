import { z } from "zod";

const INFISICAL_PROJECT_ID = process.env.INFISICAL_PROJECT_ID ?? "";
const INFISICAL_ENV_SLUG = process.env.INFISICAL_ENV_SLUG ?? "";
const INFISICAL_UNIVERSAL_AUTH_CLIENT_ID =
  process.env.INFISICAL_UNIVERSAL_AUTH_CLIENT_ID ?? "";
const INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET =
  process.env.INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET ?? "";

const universalAuthResponse = z.object({
  accessToken: z.string(),
  expiresIn: z.number(),
  accessTokenMaxTTL: z.number(),
  tokenType: z.string(),
});

type UniversalAuthResponse = z.infer<typeof universalAuthResponse>;

const infisicalSecretSchema = z.object({
  secretKey: z.string(),
  secretValue: z.string(),
  secretPath: z.string(),
});

const listSecretsResponseSchema = z.object({
  secrets: z.array(infisicalSecretSchema),
});

export interface Secret {
  key: string;
  value: string;
  secretPath: string;
}

export class InfisicalClient {
  protected projectId: string;
  protected environment: string;
  protected accessToken: string;

  constructor(
    context: {
      projectId: string;
      environment: string;
    },
    accessToken: string
  ) {
    this.projectId = context.projectId;
    this.environment = context.environment;
    this.accessToken = accessToken;
  }

  static async init(): Promise<InfisicalClient> {
    const config = {
      projectId: INFISICAL_PROJECT_ID,
      environment: INFISICAL_ENV_SLUG,
    };

    // Attempt to connect via US region subdomain first
    try {
      const usResp = await InfisicalClient.authenticate({
        clientID: INFISICAL_UNIVERSAL_AUTH_CLIENT_ID,
        clientSecret: INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET,
        subdomain: "us",
      });
      return new InfisicalClient(config, usResp.accessToken);
    } catch (err) {
      console.error(
        "Failed to authenticate via US region, trying app region",
        err
      );
      // If US region fails, try the default `app` proxy subdomain
      const appResp = await InfisicalClient.authenticate({
        clientID: INFISICAL_UNIVERSAL_AUTH_CLIENT_ID,
        clientSecret: INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET,
        subdomain: "app",
      });
      return new InfisicalClient(config, appResp.accessToken);
    }
  }

  static async authenticate(args: {
    clientID: string;
    clientSecret: string;
    subdomain: "app" | "us";
  }): Promise<UniversalAuthResponse> {
    const response = await fetch(
      `https://${args.subdomain}.infisical.com/api/v1/auth/universal-auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          clientId: args.clientID,
          clientSecret: args.clientSecret,
        }).toString(),
      }
    );

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    return universalAuthResponse.parse(data);
  }

  async listAllSecrets(): Promise<Secret[]> {
    const response = await fetch(
      `https://us.infisical.com/api/v3/secrets/raw?` +
        new URLSearchParams({
          workspaceId: this.projectId,
          environment: this.environment,
          recursive: "true",
        }).toString(),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch secrets: ${response.statusText}`);
    }

    const data = await response.json();
    const parsed = listSecretsResponseSchema.parse(data);

    return parsed.secrets.map((secret) => ({
      key: secret.secretKey,
      value: secret.secretValue,
      secretPath: secret.secretPath,
    }));
  }
}
