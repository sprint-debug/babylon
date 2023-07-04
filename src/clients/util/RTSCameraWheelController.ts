import { UniversalCamera, ICameraInput, Vector3, Matrix, Observer, Nullable, Scene, PointerInfo, IPointerEvent, PointerEventTypes } from '@babylonjs/core'

const ECameraMovement = {
    KEYS: 0,
    MOUSE: 1,
}

/** todo - 마우스 외  휠, 키보드 클래스 만들어야함 */
export class RTSCameraWheelController implements ICameraInput<UniversalCamera>{
    public camera!: UniversalCamera;
    private _wheelDeltaY = 0;

    private _scene: Scene | undefined;
    private _onPointerObserver: Nullable<Observer<PointerInfo>> | undefined;
    constructor() {
    }


    /** 마우스 휠 제어 */
    attachControl(noPreventDefault: boolean) {

        const _wheel = (evtInfo: PointerInfo) => {
            let evt = evtInfo.event as WheelEvent; // 바빌론 내부 문제로 IMouseEvent 가 넘어오기 때문에 캐스팅
            if (!evt.metaKey) {
                if (evtInfo.type !== PointerEventTypes.POINTERWHEEL) return;

                console.log('TEST delta ', evt.deltaX);
                console.log('TEST delta ', evt.deltaY);

                // var event = pointer.event;
                if (evt.deltaY !== undefined) {
                    this._wheelDeltaY -= evt.deltaY;
                }
                if (evt.preventDefault) {
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }


            }
        }

        this._onPointerObserver = this._scene!.onPointerObservable.add(_wheel, PointerEventTypes.POINTERWHEEL)

        // (evtInfo, evtState) => {
        //     let evt = evtInfo.event as WheelEvent; // 바빌론 내부 문제로 IMouseEvent 가 넘어오기 때문에 캐스팅
        //     if (!evt.metaKey) {
        //         if (evtInfo.type !== PointerEventTypes.POINTERWHEEL) return;

        //         console.log('TEST delta ', evt.deltaX);
        //         console.log('TEST delta ', evt.deltaY);

        //         // var event = pointer.event;
        //         if (evt.deltaY !== undefined) {
        //             this._wheelDeltaY -= evt.deltaY;
        //         }
        //         if (evt.preventDefault) {
        //             if (!noPreventDefault) {
        //                 evt.preventDefault();
        //             }
        //         }
        //     }

    }

    detachControl = () => {
        if (this._scene) {
            if (this._onPointerObserver) {
                this._scene.onPointerObservable.remove(this._onPointerObserver);
            }
            this._onPointerObserver = null;
        }

    };

    checkInputs = () => {
        // todo : 휠감지 방법 확인필요
        // if (this._wheel) {
        const mdata = this.camera.metadata;
        // if mouse wheel was used, set target zoom
        if (this._wheelDeltaY < 0) {
            mdata.targetZoom += mdata.zoomSteps;
        }
        else if (this._wheelDeltaY > 0) {
            mdata.targetZoom -= mdata.zoomSteps;
        }
        this._wheelDeltaY = 0;

        // check max/min zoom
        if (mdata.targetZoom > mdata.maxZoom) mdata.targetZoom = mdata.maxZoom;
        if (mdata.targetZoom < mdata.minZoom) mdata.targetZoom = mdata.minZoom;

        const diff = this.camera.fov - mdata.targetZoom;
        if (Math.abs(diff) < mdata.zoom) this.camera.fov = mdata.targetZoom;

        // add/subtract value from camera fov, until targetZoom is reached
        if (this.camera.fov < mdata.targetZoom) {
            this.camera.fov += mdata.zoom;
        }
        else if (this.camera.fov > mdata.targetZoom) {
            this.camera.fov -= mdata.zoom;
        }
        // }

    }

    //Add the two required functions for the control Name
    getClassName = function () {
        return "FreeCameraMouseWheelInput";
    };

    getSimpleName = function () {
        return "mouseWheel";
    };

}

