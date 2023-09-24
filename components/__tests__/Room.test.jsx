import Room from '../Room/Room'
import ReactThreeTestRenderer from '@react-three/test-renderer'

jest.mock('scheduler', () => require('scheduler/unstable_mock'))

test('it should render with the proper scale', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Room />) 
    const mesh = renderer.scene.children[0]
    expect(mesh.props.scale).toStrictEqual([-1, 1, 1])
})

test('it should render with the proper children elements', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Room />) 
    const mesh = renderer.scene.children[0].allChildren
    expect(mesh.length).toBe(2)
})

test('renders room settings correctly', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Room texture='test'/>) 
    expect(renderer.toTree()).toStrictEqual([{"children": [{"children": [], "props": {"args": [500, 60, 40], "attach": "geometry"}, "type": "sphereGeometry"}, {"children": [], "props": {"attach": "material", "map": "test", "side": 1}, "type": "meshBasicMaterial"}], "props": {"scale": [-1, 1, 1]}, "type": "mesh"}])
})
