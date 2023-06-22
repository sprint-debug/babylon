import EventEmitter from 'eventemitter3';

type ClientMessageOptions = {
  console?: boolean;
}

type AddListenerOptions = {
  once?: boolean;
}

type LogType = "Init" | "Send" | "Add" | "Remove" | "RemoveAll";

abstract class AbClientMessage {
  protected options?: ClientMessageOptions;

  constructor(options?: ClientMessageOptions) {
    this.options = options;

    //
    this.log("Init", "", options);
  }

  abstract postMessage<T>(type: string, payload?: T): void;
  abstract addListener(type: string, callback: (...args: any[]) => void, options?: AddListenerOptions): void;
  abstract removeListener(type: string, callback?: (...args: any[]) => void): void;
  abstract removeAllListeners(): void;

  protected log(logType: LogType, message: string, ...algs: any[]) {
    if (this.options && this.options.console) {
      console.info(`[${logType}] ${message}`, algs);
    }
  }
}

class WebGLClientMessage extends AbClientMessage {
  private core: EventEmitter<string | symbol, any>;

  constructor(core: EventEmitter<string | symbol, any>, options?: ClientMessageOptions) {
    super(options);
    this.core = core;
  }

  addListener(type: string, callback: (...args: any[]) => void, options?: AddListenerOptions): void {
    if (options && options.once) {
      this.core.once(type, callback);
    }
    else {
      this.core.on(type, callback);
    }

    //
    this.log("Add", "", type);
  }

  postMessage<T>(type: string, payload?: T): void {
    this.core.emit(type, payload);

    //
    this.log("Send", "", type, payload);
  }

  removeListener(type: string): void {
    this.core.removeListener(type);

    //
    this.log("Remove", "", type);
  }

  removeAllListeners(): void {
    this.core.removeAllListeners();

    //
    this.log("RemoveAll", "");
  }
}

const event = new EventEmitter();
export const messageClient = new WebGLClientMessage(event, { console: true });

