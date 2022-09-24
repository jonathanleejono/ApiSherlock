import { landingRoute } from "constants/routes";
import { clearStore } from "features/user/userThunk";
import PropTypes, { InferProps } from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "state/hooks";

const propTypes = {
  children: PropTypes.element.isRequired,
};

type ProtectedRouteProps = InferProps<typeof propTypes>;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !user ||
      JSON.stringify(user) ===
        JSON.stringify({ name: "", email: "", timezoneGMT: 0 })
    ) {
      dispatch(clearStore());
      navigate(landingRoute);
    }
  }, [user, navigate, dispatch]);

  return children;
};

ProtectedRoute.propTypes = propTypes;

export default ProtectedRoute;
