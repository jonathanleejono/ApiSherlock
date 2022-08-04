import { landingRoute } from "constants/routes";
import PropTypes, { InferProps } from "prop-types";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "state/hooks";

const propTypes = {
  children: PropTypes.element.isRequired,
};

type ProtectedRouteProps = InferProps<typeof propTypes>;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAppSelector((store) => store.user);
  if (!user) {
    return <Navigate to={landingRoute} />;
  }
  return children;
};

ProtectedRoute.propTypes = propTypes;

export default ProtectedRoute;
