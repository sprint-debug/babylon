import * as BABYLON from "@babylonjs/core"

export interface IVideoPlayOptions {
    mediaUrl: string,
}

export class VideoPlayBehavior implements BABYLON.Behavior<BABYLON.AbstractMesh>{
    public static BEHAVIOR_NAME = "VideoPlay"
    public static DEFAULT_OPTIONS: IVideoPlayOptions = {
        mediaUrl: ""
    }

    private _options: IVideoPlayOptions

    constructor(options?: IVideoPlayOptions) {
        this._options = options ? options : VideoPlayBehavior.DEFAULT_OPTIONS
        console.log(this._options)
    }

    public get name(): string {
        return VideoPlayBehavior.BEHAVIOR_NAME
    }

    init(): void {
        console.log("?????????????")
    }

    attach(target: BABYLON.AbstractMesh): void {
        console.log(target)
    }

    detach(): void {
        console.log("?????????????")
    }
}
