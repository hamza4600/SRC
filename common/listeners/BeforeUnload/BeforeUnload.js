import useBeforeunload from "../../hooks/useBeforeUnload/useBeforeUnload";

const Beforeunload = ({ children = null, onBeforeunload }) => {
  useBeforeunload(onBeforeunload);
  return children;
};

export default Beforeunload;
