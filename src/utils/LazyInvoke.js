import { AppConstants } from "@/common/AppConstants";

const LazyInvoke = ({ callback = () => {}, timeout = null } = {}) => {
  setTimeout(() => {
    if (typeof callback === "function") {
      callback();
    }
  }, timeout || AppConstants.TIME_TO_STOP_BUTTON_LOADING); // Simulate a delay for loading state
};

export default LazyInvoke;
