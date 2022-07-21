import PropTypes, { InferProps } from "prop-types";

const propTypes = {
  center: PropTypes.bool.isRequired,
};

type LoadingProps = InferProps<typeof propTypes>;

const Loading: React.FC<LoadingProps> = ({ center }) => (
  <div className={center ? "loading loading-center" : "loading"}></div>
);

Loading.propTypes = propTypes;

export default Loading;
