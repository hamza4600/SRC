import { act, renderHook } from "@testing-library/react-hooks";
import useBeforeUnload from "./useBeforeUnload";

const renderUseBeforeUnloadHook = (handler) => {
  renderHook(() => useBeforeUnload(handler));
};

const createEvent = () => new Event("beforeunload", { cancelable: true });

const dispatchEvent = async (event) => {
  await act(async() => window.dispatchEvent(event));
}

describe("useBeforeUnload", () => {
  it("should handle event when fired", async () => {
    const handler = jest.fn();
    renderUseBeforeUnloadHook(handler);

    const event = createEvent();
    await dispatchEvent(event);

    expect(handler).toHaveBeenCalledWith(event);
  });

  it("should call returnValue when preventDefault is called", async () => {
    renderUseBeforeUnloadHook((event) => {
      event.preventDefault();
    });

    const event = createEvent();
    const set = jest.fn();
  
    Object.defineProperty(event, 'returnValue', { set });
    await dispatchEvent(event);

    expect(set).toHaveBeenCalledWith('');
  })

  it('should call returnValue when string is passed by a handler', async () => {
    const strHandler = 'hello-world'
    renderUseBeforeUnloadHook(() => strHandler);
    const event = createEvent();
    const set = jest.fn();

    Object.defineProperty(event, 'returnValue', { set });
    await dispatchEvent(event);

    expect(set).toHaveBeenCalledWith(strHandler);
  });
});
