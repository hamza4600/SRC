import { Fragment, useEffect } from 'react';

const EventEmitterListener = ({ eventEmitter, event, callback }) => {
  useEffect(() => {
    eventEmitter.subscribe(event, callback);

    return () => eventEmitter.unsubscribe(event, callback)
  }, [eventEmitter, callback, event])

  return <Fragment />
}

export default EventEmitterListener;
