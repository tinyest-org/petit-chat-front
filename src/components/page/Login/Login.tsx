import { Navigate, useLocation } from "@solidjs/router";
import { useKeycloak } from "../../../utils/lib/keycloak/web";


const LoginPage = () => {
  const location = useLocation<{ [key: string]: unknown }>();
  const currentLocationState = location.state || {
    from: { pathname: "/home" },
  };

  const keycloak = useKeycloak();

  if (keycloak().authClient.authenticated) {
    return <Navigate href={currentLocationState?.from as string} />;
  } else {
    keycloak().authClient.login();
    return <div></div>;
  }
};

export default LoginPage;
