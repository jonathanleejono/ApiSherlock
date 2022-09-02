import Wrapper from "assets/wrappers/ApiInfo";
import PropTypes, { InferProps } from "prop-types";
import React from "react";

const propTypes = {
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
};

type ApiInfoProps = InferProps<typeof propTypes>;

const ApiInfo: React.FC<ApiInfoProps> = ({ icon, text }) => (
  <Wrapper>
    <span className="icon">{icon}</span>
    <span data-testid="ApiInfoText" className="text">
      {text}
    </span>
  </Wrapper>
);

ApiInfo.propTypes = propTypes;

export default ApiInfo;
