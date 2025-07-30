import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Load default first

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
