import { render, screen } from "@testing-library/react";
import MediaVideo from "../MediaVideo/MediaVideo";

const createSubject = () => {
    const channel = 'mock-channel'
    const videoId = 'mock-id'
   
    return {
      channel,
      videoId
    }
  }

describe('MediaVideo', () => {
    it('should render properly', () => {
        const { channel, videoId } = createSubject();
        render(
            <MediaVideo channel={channel} videoId={videoId} />
        )
        const videoNode = screen.getByTitle(videoId)
        expect(videoNode.src).toBe(`https://${channel}.com/embed/${videoId}`)
    })
})