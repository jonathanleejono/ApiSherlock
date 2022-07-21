import { Navigate } from "react-router-dom";
import { useAppSelector } from "src/hooks";
import PropTypes, { InferProps } from "prop-types";

const propTypes = {
  children: PropTypes.element.isRequired,
};

type ProtectedRouteProps = InferProps<typeof propTypes>;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAppSelector((store) => store.user);
  if (!user) {
    return <Navigate to="/landing" />;
  }
  return children;
};

ProtectedRoute.propTypes = propTypes;

export default ProtectedRoute;
