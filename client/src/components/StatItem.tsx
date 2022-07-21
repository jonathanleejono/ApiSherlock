import Wrapper from "../assets/wrappers/StatItem";
import React from "react";
import PropTypes, { InferProps } from "prop-types";

const propTypes = {
  count: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  bcgColor: PropTypes.string.isRequired,
};

type StatItemProps = InferProps<typeof propTypes>;

const StatsItem: React.FC<StatItemProps> = ({
  count,
  title,
  icon,
  color,
  bcgColor,
}) => (
  <Wrapper color={color} itemProp={bcgColor}>
    <header>
      <span className="count">{count}</span>
      <span className="icon">{icon}</span>
    </header>
    <h5 className="title">{title}</h5>
  </Wrapper>
);

StatsItem.propTypes = propTypes;

export default StatsItem;
