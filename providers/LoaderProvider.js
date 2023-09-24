import { createContext, useContext, useReducer } from "react";
import { Card, Spinner } from "react-bootstrap";
import { CircleFill } from "react-bootstrap-icons";

const LoadingStates = {
    pending: 'PENDING',
    loading: 'LOADING',
    loaded: 'LOADED',
}

const initialState = {
    status: LoadingStates.loading,
    steps: []
}

const LoaderStateContext = createContext();
const LoaderDispatchContext = createContext();

export const useLoaderState = () => {
    const context = useContext(LoaderStateContext);
    if (!context) {
        throw new Error('useLoaderState must be within LoaderProvider')
    }

    return context;
}

export const useLoaderDispatch = () => {
    const context = useContext(LoaderDispatchContext);
    if (!context) {
        throw new Error('useLoaderDispatch must be within LoaderProvider')
    }

    return context;
}

const PageSpinner = ({steps}) => {

    // let items = [
    //     <CircleFill size='12px' className="m-1" color='grey' />,
    //     <CircleFill size='12px' className="m-1" color='grey' />
    // ]
    // for (const [key, value] of Object.entries(steps)) {
    //     console.log(`${key}: ${value}`);
    // }

    return (
        <Card style={{ width: '18rem', margin: '5px' }}>
            <Card.Title className="text-center">
                <Spinner animation='border' variant="secondary" role='status' className='m-2'>
                    <span className="visually-hidden">.. Loading ..</span>
                </Spinner>
            </Card.Title>
            <Card.Body className="text-center">
                <Card.Text>
                    Loading
                </Card.Text>
                <Card.Text>
                    {Object.entries(steps).map(step => {
                        const [label, status] = step;
                        const key = Buffer.from(label, 'utf8').toString('base64');

                        let color;
                        switch(status) {
                            case LoadingStates.pending:
                                color = 'grey';
                                break
                            case LoadingStates.loading:
                                color = 'royalblue';
                                break
                            case LoadingStates.loaded:
                                color = 'green';
                                break
                            default:
                                throw new Error(`invalid status: ${status}`);
                        }

                        return <CircleFill key={key} size='12px' className="m-1" color={color} />;
                    })}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export const LoaderReducer = (initialState, action) => {
    switch (action.type) {
        case 'step_configure':
            action.payload.steps.forEach(step => {
                initialState.steps[step] = LoadingStates.pending;
            });
            return {
                ...initialState,
            }
        case 'step_loading':
            console.log('loading', action, initialState);
            initialState.steps[action.payload.step] = LoadingStates.loading;
            return {
                ...initialState,
            }
        case 'step_loaded':
            initialState.steps[action.payload.step] = LoadingStates.loaded;
            return {
                ...initialState,
            }
        default:
            throw new Error(`Invalid action type: ${action.type}`);
    }
}

const LoaderProvider = ({ children }) => {

    const [LoaderState, dispatch] = useReducer(LoaderReducer, initialState);

    return (
        <LoaderStateContext.Provider value={LoaderState}>
            <LoaderDispatchContext.Provider value={dispatch}>
                <PageSpinner steps={initialState.steps} />
                {children}
            </LoaderDispatchContext.Provider>
        </LoaderStateContext.Provider>
    );
};

export default LoaderProvider;