import PropTypes, { InferProps } from "prop-types";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "state/store";

// the react-toastify css files needs to be here or in index.tsx
// (or wherever app is rendered) for toastify to work

const propTypes = {
  children: PropTypes.node.isRequired,
};

export type AppProvidersProps = InferProps<typeof propTypes>;

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <HelmetProvider>
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar
      transition={Slide}
    />
    <Provider store={store}>{children}</Provider>
  </HelmetProvider>
);

AppProviders.propTypes = propTypes;

export default AppProviders;
