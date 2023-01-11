import { SecurityProvider } from "./apiUtils";
import Keycloak from "keycloak-js";

/**
 * Does nothing
 */
export class NoopSecurityProvider implements SecurityProvider {
  constructor() { }

  login(): void {

  }

  async refresh(): Promise<boolean> {
    return true;
  }

  getToken(): string {
    return "";
  }

  isExpired(): boolean {
    return false;

  }

  async prepareHeaders(headers: Headers) {

  }
  async makeHeaderFields(): Promise<{ [key: string]: string }> {
    return {};
  }
}


export class KeycloakSecurityProvider implements SecurityProvider {
  constructor(private readonly keycloak: Keycloak) { }

  login(): void {
    this.keycloak.login();
  }

  refresh(): Promise<boolean> {
    return this.keycloak.updateToken(0);
  }

  getToken(): string {
    return this.keycloak.token || "";
  }

  isExpired(): boolean {
    try {
      return this.keycloak.isTokenExpired();
    } catch {
      this.login();
      return true;
    }

  }

  async prepareHeaders(headers: Headers) {
    const fields = await this.makeHeaderFields();
    Object.keys(fields).forEach(k => {
      headers.append(k, fields[k]);
    });

  }
  async makeHeaderFields(): Promise<{ [key: string]: string }> {
    if (this.isExpired()) {
      await this.refresh();
    }

    return {
      "Authorization": `Bearer ${this.getToken()}`
    }
  }
}
