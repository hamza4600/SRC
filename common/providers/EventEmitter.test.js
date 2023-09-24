import { EventEmitter } from "./EventEmitter"

const FAKE_EVENT = "FAKE_EVENT"

describe("EventEmitter", () => {
  afterEach(() => {
    EventEmitter.getInstance().unsubscribeToAll();
  })

  it("should have an instance of event emitter", () => {
    const eventEmitter = EventEmitter.getInstance();

    expect(eventEmitter).toBeInstanceOf(EventEmitter);
  })

  it("should subscribe from events", () => {
    const eventEmitter = EventEmitter.getInstance();
    const subscriber = () => eventEmitter.subscribe(FAKE_EVENT, jest.fn());

    expect(subscriber).not.toThrow();
  })

  it("should unsubscribe from events", () => {
    const eventEmitter = EventEmitter.getInstance();
    const unsubscriber = () => eventEmitter.unsubscribe(FAKE_EVENT, jest.fn());

    expect(unsubscriber).not.toThrow();
  })


  it("should be able to emit events", () => {
    const eventEmitter = EventEmitter.getInstance();
    const emitter = () => eventEmitter.emit(FAKE_EVENT, jest.fn());

    expect(emitter).not.toThrow();
  });

  it("should unsubscribe from all events", () => {
    const eventEmitter = EventEmitter.getInstance();
    const unsubscriber = () => eventEmitter.unsubscribeToAll();

    expect(unsubscriber).not.toThrow();
  });
})
