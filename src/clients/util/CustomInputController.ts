import { Engine, FreeCamera, ICameraInput, KeyboardEventTypes, KeyboardInfo, Nullable, Observer, Scene, Vector3 } from '@babylonjs/core'

export class FreeCameraKeyboardWalkInput implements ICameraInput<FreeCamera>{
    public camera!: FreeCamera;
    // public keysUp = [38]
    // public keysDown = [40]
    // public keysLeft = [37]
    // public keysRight = [39]
    public keysUp = [87]
    public keysDown = [83]
    public keysLeft = [65]
    public keysRight = [68]

    private _keys = new Array<number>();
    private _onCanvasBlurObserver: Nullable<Observer<Engine>> | undefined;
    private _onKeyboardObserver: Nullable<Observer<KeyboardInfo>> | undefined;
    private _engine: Engine | undefined;
    private _scene: Scene | undefined;

    // attachControl(element: HTMLElement, noPreventDefault?: boolean): void {
    attachControl(noPreventDefault?: boolean): void {
        if (this._onCanvasBlurObserver) {
            return;
        }

        this._scene = this.camera!.getScene();
        this._engine = this._scene!.getEngine();

        this._onCanvasBlurObserver = this._engine.onCanvasBlurObservable.add(() => {
            this._keys = [];
        });

        this._onKeyboardObserver = this._scene!.onKeyboardObservable.add((info) => {
            let evt = info.event;
            if (!evt.metaKey) {
                if (info.type === KeyboardEventTypes.KEYDOWN) {
                    if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                        this.keysDown.indexOf(evt.keyCode) !== -1 ||
                        this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        this.keysRight.indexOf(evt.keyCode) !== -1) {
                        var index = this._keys.indexOf(evt.keyCode);
                        if (index === -1) {
                            this._keys.push(evt.keyCode);
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }


                } else {
                    if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                        this.keysDown.indexOf(evt.keyCode) !== -1 ||
                        this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                        this.keysRight.indexOf(evt.keyCode) !== -1) {
                        var index = this._keys.indexOf(evt.keyCode);

                        if (index >= 0) {
                            this._keys.splice(index, 1);
                        }
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                }
            }
        });

    }

    detachControl(): void {
        // detachControl(element: Nullable<HTMLElement>): void {
        if (this._scene) {
            if (this._onKeyboardObserver) {
                this._scene.onKeyboardObservable.remove(this._onKeyboardObserver);
            }

            if (this._onCanvasBlurObserver) {
                this._engine!.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
            }
            this._onKeyboardObserver = null;
            this._onCanvasBlurObserver = null;
        }
        this._keys = [];
    }

    public checkInputs(): void {


        const _camera = this.camera;
        // Keyboard
        for (let index = 0; index < this._keys.length; index++) {
            let keyCode = this._keys[index];
            let moveAmount = _camera._computeLocalCameraSpeed() / 2;
            if (this.keysUp.indexOf(keyCode) !== -1) {
                _camera._localDirection.copyFromFloats(0, 0, -moveAmount);
                // _camera.rotation.x = -0.7
                // this.camera.rotationQuaternion.x -= _camera.angu
                // _camera.cameraDirection.copyFromFloats(0.0, -0.01, 0);
                const direction = new Vector3(0, moveAmount, 0);
                // direction.rotateByQuaternionToRef(_camera.rotationQuaternion);
            } else if (this.keysDown.indexOf(keyCode) !== -1) {
                _camera._localDirection.copyFromFloats(0, 0, moveAmount);
                // _camera._localDirection.copyFromFloats(0, moveAmount, 0);
            } else if (this.keysLeft.indexOf(keyCode) !== -1) {
                // _camera.rotation.y -= moveAmount; 카메라 회전시 사용
                _camera._localDirection.copyFromFloats(-moveAmount, 0, 0);
            } else if (this.keysRight.indexOf(keyCode) !== -1) {
                // _camera.rotation.y += moveAmount; 
                _camera._localDirection.copyFromFloats(moveAmount, 0, 0);
            }

            if (_camera.getScene().useRightHandedSystem) {
                _camera._localDirection.z *= -1;
            }

            _camera.getViewMatrix().invertToRef(_camera._cameraTransformMatrix);
            Vector3.TransformNormalToRef(_camera._localDirection, _camera._cameraTransformMatrix, _camera._transformedDirection);
            _camera.cameraDirection.addInPlace(_camera._transformedDirection);
        }

        // if (this._onKeyboardObserver) {
        //     const _camera = this.camera;
        //     // Keyboard
        //     for (var index = 0; index < this._keys.length; index++) {
        //         var keyCode = this._keys[index];
        //         var speed = _camera._computeLocalCameraSpeed() / 2;
        //         if (this.keysLeft.indexOf(keyCode) !== -1) {
        //             _camera.rotation.y -= speed;
        //             _camera._localDirection.copyFromFloats(0, 0, 0);
        //         }
        //         else if (this.keysUp.indexOf(keyCode) !== -1) {
        //             _camera._localDirection.copyFromFloats(0, 0, speed);
        //         } else if (this.keysRight.indexOf(keyCode) !== -1) {
        //             _camera.rotation.y += speed;
        //             _camera._localDirection.copyFromFloats(0, 0, 0);
        //         } else if (this.keysDown.indexOf(keyCode) !== -1) {
        //             _camera._localDirection.copyFromFloats(0, 0, -speed);
        //         }

        //         if (_camera.getScene().useRightHandedSystem) {
        //             _camera._localDirection.z *= -1;
        //         }

        //         _camera.getViewMatrix().invertToRef(_camera._cameraTransformMatrix);
        //         Vector3.TransformNormalToRef(_camera._localDirection, _camera._cameraTransformMatrix, _camera._transformedDirection);
        //         _camera.cameraDirection.addInPlace(_camera._transformedDirection);
        //     }
        // }
    }

    public getClassName(): string {
        return 'Freecamera!KeyboardWalkInput'
    }

    public _onLostFocus(): void {
        this._keys = [];
    }

    public getSimpleName(): string {
        return 'keyboard'
    }
}