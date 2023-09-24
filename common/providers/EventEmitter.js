import { EventEmitter as EventsEventEmitter } from "events";

export class EventEmitter {
  static instance = null;

  eventEmitter;

  constructor() {
    this.eventEmitter = new EventsEventEmitter();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EventEmitter();
    }

    return this.instance;
  }

  subscribe(event, listener) {
    this.eventEmitter.on(event, listener);
  }

  unsubscribe(event, listener) {
    this.eventEmitter.removeListener(event, listener);
  }

  emit(event, ...args) {
    this.eventEmitter.emit(event, args);
  }

  unsubscribeToAll() {
    this.eventEmitter.removeAllListeners();
  }
}