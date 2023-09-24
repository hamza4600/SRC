import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from 'react';
import { Preload } from "@react-three/drei";
import { Redirect, useParams, Router, Route, useHistory } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { Layers } from 'three'
import { showroom } from "../../../services/ShowroomService";
import DynamicPanoramaControl from "../../../controls/DynamicPanoramaControl/DynamicPanoramaControl";
import DynamicShowroom from "../../../components/DynamicShowroom/DynamicShowroom";
import DynamicShowroomProvider, { useDynamicShowroom } from "../../../providers/DynamicShowrooomProvider/DynamicShowroomProvider";
import { showroomStatusOptions } from "../../../providers/ShowroomProvider/ShowroomStatusOptions"
import MainModal from "./components/MainModal/MainModal";
import Snackbar from '../../../components/Snackbar/Snackbar';
import PageSpinner from "../../../components/PageSpinner";

const layers = new Layers();
layers.disableAll();

const DynamicShowroomPage = () => {
  const { showroomId, roomId } = useParams();
  const history = useHistory();
  const [ dynamicShowroomState, dynamicShowroomDispatch ] = useDynamicShowroom();
  const { apiData } = dynamicShowroomState;
  console.log(dynamicShowroomState)

  useEffect(() => {
    if (dynamicShowroomState.status === showroomStatusOptions.notLoaded) {
      async function callShowroom() {
        await showroom(showroomId)
        .then((res) => {
          dynamicShowroomDispatch({
            type: showroomStatusOptions.dataLoaded,
            payload: res,
          });
        })
        .catch((err) => {
          console.log("failed to load showroom info", err);
          dynamicShowroomDispatch({
            type: showroomStatusOptions.error,
            payload: err,
          });
        });
      }
      callShowroom()
    }
      
  }, [showroomId, roomId, dynamicShowroomState, dynamicShowroomDispatch]);


  if (dynamicShowroomState.status === showroomStatusOptions.notLoaded) return <PageSpinner />;

  if (dynamicShowroomState.status === showroomStatusOptions.error) {
    <Snackbar message="Signed out" durationInMilliseconds={3000}/>
    return <Redirect to="/" />;
  }

  if (roomId === undefined) {
    const roomId = apiData.defaultRoom;
    return <Redirect to={`/dynamic-showrooms/${showroomId}/${roomId}`} />;
  }

  return (
    <>
      <MainModal />
      <div style={{ width: '100vw', height: '100vh' }}>
        <Canvas
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            precision: isMobile ? 'lowp' : 'mediump'
          }}
          raycaster={{ layers }}
          dpr={window.devicePixelRatio || 1}
        >
          <ambientLight intensity={0.3} />
          
            <Preload all />
            <DynamicShowroomProvider reducer={[dynamicShowroomState, dynamicShowroomDispatch]}>
            <Suspense fallback={null}>
                <Router history={history}>
                  <Route path="/dynamic-showrooms/:showroomId/:roomId?">
                    <DynamicPanoramaControl />
                    <DynamicShowroom apiData={apiData} />
                  </Route>
                </Router>
              </Suspense>
            </DynamicShowroomProvider>
        </Canvas>
      </div>
    </>
  )
}

export default DynamicShowroomPage;
