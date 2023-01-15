
type EventHandler<T> = (msg: { ok: boolean; body: T; error: string }) => void;

const MAX_FAIL = 4;

export interface EventSourceProducer {
    getSource(): Promise<WebSocket | EventSource>;
}

/**
 * Base abstract call to handle subsribing to an Event source
 */
export abstract class EventSourceHandler {
    private open = false;
    /**
     * TODO: move away from this public field
     */
    //   public snackbar: ReturnType<typeof useSnackbar>;
    public snackbar: (a: any, b: any) => {

    };
    protected eventSource?: WebSocket | EventSource;
    private opening: boolean;

    private failed: number = 0;
    private closed = false;
    protected setOpen: (open: boolean) => void;
    private eventSourceProvider: EventSourceProducer;

    // promisify the opening of the flux
    private resolve: (value?: unknown) => void;
    private reject: (value?: unknown) => void;
    private currentOpener: Promise<unknown>;


    constructor(eventSourceProvider: EventSourceProducer, onOpen: (open: boolean) => void) {
        // @ts-ignore
        this.snackbar = null;
        this.eventSourceProvider = eventSourceProvider;
        this.setOpen = onOpen;
        this.opening = false;

        this.resolve = () => {
            /*placeholder*/
        };
        this.reject = () => {
            /*placeholder*/
        };
        this.currentOpener = new Promise((resolve, reject) => {
            /*placeholder*/
        });
    }

    private onOpen = () => {
        this.snackbar("check", "Websocket open");
        this.open = true;
        this.setOpen(true);
        this.opening = false;
        this.resolve(this);
    };

    private onError = () => {
        console.log("error ws", this.snackbar);
        this.snackbar("error", "Websocket closed");
        this.opening = false;
        this.reject(this);
        this.failed++;
        if (!this.closed && this.failed < MAX_FAIL) {
            this._open();
        }
    };

    protected abstract onMessage: (ev: MessageEvent<any>) => void;

    private onClose = (e: any) => {
        this.snackbar("information", "Websocket closed");
        this.opening = false;
        console.log("closing", e);
        if (!this.closed && this.failed < MAX_FAIL) {
            this.failed++;
            this._open();
        }
    };

    private _open = async () => {
        this.opening = true;
        const p = new Promise<unknown>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this.currentOpener = p;
        try {
            this.eventSource = await this.eventSourceProvider.getSource();
        } catch (e) {
            this.snackbar("error", "Failed to open websocket");
            return p;
        }
        this.eventSource.onopen = this.onOpen;
        this.eventSource.onerror = this.onError;
        this.eventSource.onmessage = e => this.onMessage(e);
        if ("onclose" in this.eventSource) {
            this.eventSource.onclose = this.onClose;
        }
        return p;
    };

    /**
     * 
     * @returns A promise resolved on opening or failure of the EventSource
     */
    public ensureOpen = () => {
        if (this.open || this.opening) {
            return this.currentOpener;
        }
        return this._open();
    };

    public close = () => {
        this.eventSource?.close();
        this.closed = true;
        this.open = false;
        this.setOpen(false);
        this.opening = false;
    };
}

