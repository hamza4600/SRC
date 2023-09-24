import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";

const version = process.env.REACT_APP_VERSION;
const env = process.env.REACT_APP_NODE_ENV;

const GoogleAnalytics = ({ trackingIds }) => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (trackingIds && trackingIds.length > 0) {
      if (initialized) {
        console.log('sending', location.pathname + location.search)
        ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
      } else {
        ReactGA.initialize(trackingIds.map(trackingId => {
          return {
            trackingId,
          }
        }));
        ReactGA.set({
          env,
          version,
        })
        setInitialized(true);
      }
    }
  }, [initialized, trackingIds, location.pathname, location.search]);

  return null;
}

export default GoogleAnalytics;
