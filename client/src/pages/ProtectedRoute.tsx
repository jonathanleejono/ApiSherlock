import { landingRoute } from "constants/routes";
import { getToken } from "constants/token";
import PropTypes, { InferProps } from "prop-types";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "state/hooks";

const propTypes = {
  children: PropTypes.element.isRequired,
};

type ProtectedRouteProps = InferProps<typeof propTypes>;

let accessToken: string;

getToken()
  .then((res) => (accessToken = res))
  .catch((err) => console.log(err));

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { userAuthenticated } = useAppSelector((store) => store.user);

  if (!userAuthenticated && !accessToken) {
    return <Navigate to={landingRoute} />;
  }

  return children;
};

ProtectedRoute.propTypes = propTypes;

export default ProtectedRoute;
