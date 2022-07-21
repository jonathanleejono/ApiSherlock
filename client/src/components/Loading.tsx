interface LoadingProps {
  center: boolean;
}

const Loading: React.FC<LoadingProps> = ({ center }) => (
  <div className={center ? "loading loading-center" : "loading"}></div>
);

export default Loading;
