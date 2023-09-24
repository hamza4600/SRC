import { Canvas, extend } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { Environment, Preload } from "@react-three/drei";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  useParams,
  useLocation,
} from "react-router-dom";
import { useCookies } from "react-cookie";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import PanoramaControl from "../../controls/PanoramaControl/PanoramaControl";
import Showroom from "../../components/Showroom/Showroom";
import PageSpinner from "../../components/PageSpinner";
import Snackbar from '../../components/Snackbar/Snackbar';
import GoogleAnalytics from "../../components/GoogleAnalytics/GoogleAnalytics";
import { showroom } from "../../services/ShowroomService";
import ShowroomProvider, {
  useShowroom,
} from "../../providers/ShowroomProvider/ShowroomProvider";
import { showroomStatusOptions } from "../../providers/ShowroomProvider/ShowroomStatusOptions";
import { useCurrentRoom } from "../../providers/CurrentRoomProvider/CurrentRoomProvider";
import { init as shopifyInit } from "../../services/Shopify/Shopify";
import urls from "../../constants/urls";
import { errorCodes } from "../../constants/ErrorCodes";
import Chat from '../../components/Chat/Chat'


extend({ OrbitControls });

const ShowroomPage = () => {
  let { showroomId, roomId } = useParams();
  const [authCookies] = useCookies();
  const [currentRoom, setCurrentRoom] = useCurrentRoom();
  const [showroomState, showroomDispatch] = useShowroom();
  const location = useLocation();

  const onRoomChange = (toSpotId) => {
    setCurrentRoom(toSpotId);
  };

  useEffect(() => {
    if (showroomState.status === showroomStatusOptions.notLoaded) {
      showroom(showroomId)
        .then((res) => {
          showroomDispatch({
            type: showroomStatusOptions.dataLoaded,
            payload: res,
          });
        })
        .catch((err) => {
          console.log("failed to load showroom info", err);
          showroomDispatch({
            type: showroomStatusOptions.error,
            payload: err,
          });
        });
    }
  }, [showroomId, roomId, showroomState, showroomDispatch]);

  useEffect(() => {
    if (showroomState.status === showroomStatusOptions.dataLoaded) {
      shopifyInit(showroomState.apiData.shopifyData);
    }
  }, [showroomState.apiData?.shopifyData, showroomState.status]);

  if (showroomState.status === showroomStatusOptions.notLoaded) return <PageSpinner />;

  if (
    showroomState.status === showroomStatusOptions.error &&
    showroomState.apiData.response.data.code === errorCodes.PRIVATE_ROOM_ERROR
  ) {
    if (!!authCookies) return <Redirect to="/forbidden" />;
    return (
      <Redirect
        to={{
          pathname: urls.signInPage.path,
          search: `?url=${location.pathname}`,
        }}
      />
    );
  }

  if (showroomState.status === showroomStatusOptions.error) {
    <Snackbar message="Signed out" durationInMilliseconds={3000}/>
    return <Redirect to="/" />;
  }

  if (roomId === undefined) {
    const roomId = showroomState.apiData.defaultRoom;
    return <Redirect to={`${showroomId}/${roomId}`} />;
  }

  if (!showroomState.apiData.staticShowrooms[roomId]) return <Redirect to="/" />;

  return (
    <div style={{ width: "100vw", height: "100vh", position:"absolute", top: "0", left: "0",}}>
      <Chat title={`${showroomState.apiData.title} chat`} />
      <Canvas camera={{ position: [0, 0, 0.1] }}>
        <PanoramaControl
          autoRotate={false}
          enableZoom={false}
          enablePan={false}
          flipY={true}
          enableDamping
          dampingFactor={0.2}
          rotateSpeed={0.4}
        />
        <Suspense fallback={null}>
          <Preload all />
          <ShowroomProvider initContext={showroomState}>
            <Router>
              <Route path={"/showrooms/:showroomId/:roomId?"}>
                <GoogleAnalytics
                  trackingIds={showroomState.apiData.trackingIds}
                />
                <Showroom
                  currentRoom={currentRoom}
                  onRoomChange={onRoomChange}
                />
              </Route>
            </Router>
          </ShowroomProvider>
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ShowroomPage;
