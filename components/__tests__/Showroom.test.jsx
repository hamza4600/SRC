import { render } from '@testing-library/react'
import { Suspense } from 'react';

import Showroom, {selectRoom} from '../Showroom/Showroom'
import ShowroomProvider from '../../providers/ShowroomProvider/ShowroomProvider'

jest.mock('scheduler', () => require('scheduler/unstable_mock'))

jest.mock('react-three-fiber', () => ({
    ...jest.requireActual('react-three-fiber'),
    useLoader: () => ([{'data': 'test'}])
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        showroomId: 'test-gallery'
    }),
}))


test('it should render a showroom', () => {
    const showroomState = {
        state: 'dataLoaded',
        apiData: {
            staticShowrooms: {
                defaultRoom: "id1",
                "id1": {
                    "path": "some-path",
                    "label": "Some Room"
                }
            }
        }
    }
    render(
        <Suspense fallback={null}>
            <ShowroomProvider initContext={showroomState}>
                <Showroom />
            </ShowroomProvider>
        </Suspense>
    )
})



test('it should choose the correct room', () => {
    const textures = ['test-value1', 'test-value2']
    const showrooms = {
        "id1": {
            "path": "some-path",
            "label": "Some Room"
        },
        "id2": {
            "path": "some-path",
            "label": "Some Room"
        }
    }
    const roomId = "id2"
    const selectedRoom = [ "test-value2", { "path": "some-path", "label": "Some Room" }]
    expect(selectRoom(textures, showrooms, roomId)).toEqual(selectedRoom)
})