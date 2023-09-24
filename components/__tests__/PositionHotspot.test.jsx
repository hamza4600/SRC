import PositionHotspot from "../PositionHotspot/PositionHotspot"
import play from '../../assets/hotspot-icons/play.png'
import ReactThreeTestRenderer from '@react-three/test-renderer'

jest.mock('scheduler', () => require('scheduler/unstable_mock'))

const createSubject = () => {
    const rotation = [0,0,0]
    const position = [0,0,0]
    const scale = 1;
    const onClick = jest.fn();
    
  
    return {
      rotation,
      position,
      scale,
      onClick
    }
  }

describe('media hotspot', () => {
    it('should render correctly', async () => {
        const { rotation, position, scale } = createSubject();
        const renderer = await ReactThreeTestRenderer.create(<PositionHotspot icon={play} position={position} rotation={rotation} scale={scale} />)
        const mesh = renderer.scene.allChildren[0].allChildren[0]
        expect(mesh.allChildren[1].props.map).toStrictEqual(play)
        expect(mesh.props.rotation).toStrictEqual(rotation)
        expect(mesh.props.position).toStrictEqual(position)
        expect(mesh.props.scale).toBe(scale)
    })

    it('should trigger the passed callback', async () => {
        const { rotation, position, scale, onClick } = createSubject();
        const renderer = await ReactThreeTestRenderer.create(<PositionHotspot icon={play} position={position} rotation={rotation} scale={scale} onClick={onClick}/>)
        const mesh = renderer.scene.allChildren[0].allChildren[0]
        await renderer.fireEvent(mesh, 'click')
        expect(onClick).toHaveBeenCalledTimes(1)
    })
})