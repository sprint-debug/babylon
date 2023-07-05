import { UniversalCamera, ICameraInput, Vector3, Matrix, KeyboardInfo, Observer, Nullable, Scene, KeyboardEventTypes, Tools } from '@babylonjs/core'


// https://forum.babylonjs.com/t/rts-camera-wasd-move-eq-rotate-mousewheel-zoom-edge-scroll/29289/4
// https://playground.babylonjs.com/#8SZ28Q#12
const ECameraMovement = {
    KEYS: 0,
    MOUSE: 1,
}

/** todo - 마우스 외  휠, 키보드 클래스 만들어야함 */
export class RTSCameraKeyboardController implements ICameraInput<UniversalCamera>{
    public camera!: UniversalCamera;
    private _keys: number[] = [];
    public keysUp: number[] = [38, 87]; // arrowUp, w
    public keysDown: number[] = [40, 83]; // arrowDown, s
    public keysLeft: number[] = [37, 65]; // arrowLeft, a
    public keysRight: number[] = [39, 68]; // arrowRight, d
    public rotateKeysLeft: number[] = [81]; // q
    public rotateKeysRight: number[] = [69]; // e

    private _scene: Scene | undefined;
    private _onKeyboardObserver: Nullable<Observer<KeyboardInfo>> | undefined;


    constructor() {
    }



    attachControl(noPreventDefault: boolean) {
        const engine = this.camera.getEngine();
        const element = engine.getInputElement();
        this._scene = this.camera!.getScene();

        /** 키보드 제어 */
        this._onKeyboardObserver = this._scene!.onKeyboardObservable.add((info) => {
            let evt = info.event;
            if (!evt.metaKey) {
                if (info.type === KeyboardEventTypes.KEYDOWN) {
                    if (
                        this.keysUp.indexOf(evt.keyCode) !== -1 ||
                        this.keysDown.indexOf(evt.keyCode) !== -1 ||
                        this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        this.rotateKeysLeft.indexOf(evt.keyCode) !== -1 ||
                        this.rotateKeysRight.indexOf(evt.keyCode) !== -1 ||
                        this.keysRight.indexOf(evt.keyCode) !== -1
                    ) {
                        const index = this._keys.indexOf(evt.keyCode);
                        if (index === -1) {
                            this._keys.push(evt.keyCode);
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                        if (this.camera.metadata.movedBy === null) {
                            this.camera.metadata.movedBy = ECameraMovement.KEYS;
                        }
                    }


                } else {
                    if (
                        this.keysUp.indexOf(evt.keyCode) !== -1 ||
                        this.keysDown.indexOf(evt.keyCode) !== -1 ||
                        this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        this.rotateKeysLeft.indexOf(evt.keyCode) !== -1 ||
                        this.rotateKeysRight.indexOf(evt.keyCode) !== -1 ||
                        this.keysRight.indexOf(evt.keyCode) !== -1
                    ) {
                        const index = this._keys.indexOf(evt.keyCode);
                        if (index >= 0) {
                            this._keys.splice(index, 1);
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }

                    // let index = this._keys.indexOf(evt.key);
                    /** 
                     * todo: 대소문자 변경 시, keyup 감지 안되서 변경
                     * 캐릭터 속도 설정 시 W, w 따로 대응필요
                     */
                    // let index = this._keys.indexOf(evt.key.toLocaleLowerCase());
                    // if (index >= 0) {
                    //     this._keys.splice(index, 1);
                    // }
                    // if (this._preventDefault) {
                    //     evt.preventDefault();
                    // }

                }

                // element.addEventListener("keydown", this._onKeyDown, false);
                // element.addEventListener("keyup", this._onKeyUp, false);
            }
        })

    }

    detachControl = () => {
        // var engine = this.camera.getEngine();
        // var element = engine.getInputElement();
        // if (this._onKeyDown) {
        //     element!.removeEventListener("keydown", this._onKeyDown);
        //     element!.removeEventListener("keyup", this._onKeyUp);
        //     Tools.UnregisterTopRootEvents([
        //         { name: "blur", handler: this._onLostFocus }
        //     ]);
        //     this._keys = [];
        //     this._onKeyDown = null;
        //     this._onKeyUp = null;
        // }

        if (this._scene) {
            if (this._onKeyboardObserver) {
                this._scene.onKeyboardObservable.remove(this._onKeyboardObserver);
            }
            this._onKeyboardObserver = null;

            // Tools.UnregisterTopRootEvents([
            //     { name: "blur", handler: this._onLostFocus }
            // ]);

            // if (this._onCanvasBlurObserver) {
            //     this._engine!.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
            // }

            // if (this._onPointerObserver) {
            //     this._scene.onPointerObservable.remove(this._onPointerObserver);
            // }
            // this._onPointerObserver = null;
            // this._onCanvasBlurObserver = null;

            // element.removeEventListener("mousemove", this._onSearchMove);
        }
        this._keys = [];

    };

    checkInputs = () => {

        let camera = this.camera;
        var speed = camera.speed;
        var mdata = camera.metadata;
        for (let index = 0; index < this._keys.length; index++) {
            var keyCode = this._keys[index];
            // move target camera position depending of pressed key
            if (this.keysLeft.indexOf(keyCode) !== -1) {
                mdata.targetPosition.addInPlace(Vector3.TransformCoordinates(new Vector3(-speed, 0, 0), Matrix.RotationY(camera.rotation.y)));
            }
            else if (this.keysUp.indexOf(keyCode) !== -1) {
                mdata.targetPosition.addInPlace(Vector3.TransformCoordinates(new Vector3(0, 0, speed), Matrix.RotationY(camera.rotation.y)));
            }
            else if (this.keysRight.indexOf(keyCode) !== -1) {
                mdata.targetPosition.addInPlace(Vector3.TransformCoordinates(new Vector3(speed, 0, 0), Matrix.RotationY(camera.rotation.y)));
            }
            else if (this.keysDown.indexOf(keyCode) !== -1) {
                mdata.targetPosition.addInPlace(Vector3.TransformCoordinates(new Vector3(0, 0, -speed), Matrix.RotationY(camera.rotation.y)));
            }
            // rotating is bit different. While moving the camera is done by lerp, 
            // rotating calculates the new position, set the target and sets the target camera position
            // to the actual camera position. Camera rotation is done by setTarget.
            else if (this.rotateKeysLeft.indexOf(keyCode) !== -1) {
                mdata.rotation += mdata.rotationSpeed;
                const tx = camera.target.x;
                const tz = camera.target.z;
                const x = tx + mdata.radius * Math.sin(mdata.rotation);
                const z = tz + mdata.radius * Math.cos(mdata.rotation);
                camera.position = new Vector3(x, camera.position.y, z);
                camera.setTarget(new Vector3(tx, 0, tz));
                mdata.targetPosition = new Vector3(camera.position.x, camera.position.y, camera.position.z);
            }
            else if (this.rotateKeysRight.indexOf(keyCode) !== -1) {
                mdata.rotation -= mdata.rotationSpeed;
                const tx = camera.target.x;
                const tz = camera.target.z;
                const x = tx + mdata.radius * Math.sin(mdata.rotation);
                const z = tz + mdata.radius * Math.cos(mdata.rotation);
                camera.position = new Vector3(x, camera.position.y, z);
                camera.setTarget(new Vector3(tx, 0, tz));
                mdata.targetPosition = new Vector3(camera.position.x, camera.position.y, camera.position.z);
            }
        }


        // x/z limit check
        if (mdata.targetPosition.x < mdata.minX) mdata.targetPosition.x = mdata.minX;
        if (mdata.targetPosition.x > mdata.maxX) mdata.targetPosition.x = mdata.maxX;
        if (mdata.targetPosition.z < mdata.minZ) mdata.targetPosition.z = mdata.minZ;
        if (mdata.targetPosition.z > mdata.maxZ) mdata.targetPosition.z = mdata.maxZ;

        // distance check
        var lengthDiff = (mdata.targetPosition.subtract(camera.position)).length();
        // moving
        if (lengthDiff > 0 && mdata.movedBy === ECameraMovement.KEYS) {
            var t = lengthDiff < 0.01 ? 1.0 : 0.1; //( f값 -> mouse controller.checkInput에서 동일하게 변경 필요 구조변경 TBD)//
            camera.position = Vector3.Lerp(camera.position, mdata.targetPosition, t);
            if (t === 1.0) {
                mdata.movedBy = null;
            }
        }

        // if (this._onKeyDown) {
        //     var camera = this.camera;
        //     var speed = camera.speed;
        //     var mdata = camera.metadata;
        //     // move camera for all pressed keys
        //     for (var index = 0; index < this._keys.length; index++) {
        //         var keyCode = this._keys[index];
        //         // move target camera position depending of pressed key
        //         if (this.keysLeft.indexOf(keyCode) !== -1) {
        //             mdata.targetPosition.addInPlace(Vector3.TransformCoordinates(new Vector3(-speed, 0, 0), Matrix.RotationY(camera.rotation.y)));
        //         }
        //         else if (this.keysUp.indexOf(keyCode) !== -1) {
        //             mdata.targetPosition.addInPlace(Vector3.TransformCoordinates(new Vector3(0, 0, speed), Matrix.RotationY(camera.rotation.y)));
        //         }
        //         else if (this.keysRight.indexOf(keyCode) !== -1) {
        //             mdata.targetPosition.addInPlace(Vector3.TransformCoordinates(new Vector3(speed, 0, 0), Matrix.RotationY(camera.rotation.y)));
        //         }
        //         else if (this.keysDown.indexOf(keyCode) !== -1) {
        //             mdata.targetPosition.addInPlace(Vector3.TransformCoordinates(new Vector3(0, 0, -speed), Matrix.RotationY(camera.rotation.y)));
        //         }
        //         // rotating is bit different. While moving the camera is done by lerp, 
        //         // rotating calculates the new position, set the target and sets the target camera position
        //         // to the actual camera position. Camera rotation is done by setTarget.
        //         else if (this.rotateKeysLeft.indexOf(keyCode) !== -1) {
        //             mdata.rotation += mdata.rotationSpeed;
        //             const tx = camera.target.x;
        //             const tz = camera.target.z;
        //             const x = tx + mdata.radius * Math.sin(mdata.rotation);
        //             const z = tz + mdata.radius * Math.cos(mdata.rotation);
        //             camera.position = new Vector3(x, camera.position.y, z);
        //             camera.setTarget(new Vector3(tx, 0, tz));
        //             mdata.targetPosition = new Vector3(camera.position.x, camera.position.y, camera.position.z);
        //         }
        //         else if (this.rotateKeysRight.indexOf(keyCode) !== -1) {
        //             mdata.rotation -= mdata.rotationSpeed;
        //             const tx = camera.target.x;
        //             const tz = camera.target.z;
        //             const x = tx + mdata.radius * Math.sin(mdata.rotation);
        //             const z = tz + mdata.radius * Math.cos(mdata.rotation);
        //             camera.position = new Vector3(x, camera.position.y, z);
        //             camera.setTarget(new Vector3(tx, 0, tz));
        //             mdata.targetPosition = new Vector3(camera.position.x, camera.position.y, camera.position.z);
        //         }
        //     }

        //     // x/z limit check
        //     if (mdata.targetPosition.x < mdata.minX) mdata.targetPosition.x = mdata.minX;
        //     if (mdata.targetPosition.x > mdata.maxX) mdata.targetPosition.x = mdata.maxX;
        //     if (mdata.targetPosition.z < mdata.minZ) mdata.targetPosition.z = mdata.minZ;
        //     if (mdata.targetPosition.z > mdata.maxZ) mdata.targetPosition.z = mdata.maxZ;

        //     // distance check
        //     var lengthDiff = (mdata.targetPosition.subtract(camera.position)).length();

        //     // moving
        //     if (lengthDiff > 0 && mdata.movedBy === ECameraMovement.KEYS) {
        //         var t = lengthDiff < 0.01 ? 1.0 : 0.02;
        //         camera.position = Vector3.Lerp(camera.position, mdata.targetPosition, t);
        //         if (t === 1.0) {
        //             mdata.movedBy = null;
        //         }
        //     }
        // }
    }

    //Add the onLostFocus function
    _onLostFocus = () => {
        this._keys = [];
    };

    //Add the two required functions for the control Name
    getClassName = function () {
        return "FreeCameraKeyboardWalkInput";
    };

    getSimpleName = function () {
        return "keyboard";
    };

}

