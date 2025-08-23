import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false });

export default function ProgressBar() {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return null;
}
