import PropTypes, { InferProps } from "prop-types";
import React from "react";
import Wrapper from "assets/wrappers/ApiStatus";

const propTypes = {
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
  apiStatus: PropTypes.string.isRequired,
};

type ApiStatusProps = InferProps<typeof propTypes>;

const ApiStatus: React.FC<ApiStatusProps> = ({ icon, text, apiStatus }) => (
  //combining the .status and ${status} classes together
  <Wrapper>
    <span className="icon">{icon}</span>
    <span className="text">{text}</span>
    <span className={`status ${apiStatus}`}>{apiStatus}</span>
  </Wrapper>
);

ApiStatus.propTypes = propTypes;

export default ApiStatus;
