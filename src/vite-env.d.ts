declare namespace NodeJS {
  interface ProcessEnv {
    INFISICAL_UNIVERSAL_AUTH_CLIENT_ID?: string;
    INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET?: string;
    INFISICAL_PROJECT_ID?: string;
    INFISICAL_ENV_SLUG?: string;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};

