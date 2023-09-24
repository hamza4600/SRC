import { render, screen } from "@testing-library/react"
import BeforeUnload from './BeforeUnload'
import useBeforeUnload from '../../hooks/useBeforeUnload/useBeforeUnload'

jest.mock('../../hooks/useBeforeUnload/useBeforeUnload')

describe('BeforeUnload', () => {
  it("should render children correctly", () => {
    render(
      <BeforeUnload>
        <h1>Hello world</h1>
     </BeforeUnload>);

    expect(screen.getByRole('heading', { name: /hello world/i})).toBeInTheDocument();
  })

  it("should calls useBeforeUnload", () => {
    const onBeforeunload = jest.fn();
    
    render(
      <BeforeUnload onBeforeunload={onBeforeunload}>
        <h1>Hello world</h1>
      </BeforeUnload>
    )

    expect(useBeforeUnload).toHaveBeenCalledWith(onBeforeunload)
  })
})