import { SecurityProvider } from "./apiUtils";
import Keycloak from "keycloak-js";

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
    return this.keycloak.isTokenExpired();
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
