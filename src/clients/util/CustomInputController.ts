import { Engine, FreeCamera, ICameraInput, IPointerEvent, KeyboardEventTypes, KeyboardInfo, Nullable, Observer, PointerEventTypes, PointerInfo, Scene, Vector3 } from '@babylonjs/core'
import { TKeyMap, ICustomInputOption, InputTypeEnum } from './CustomInputControllerType'

export class CustomInputController implements ICameraInput<FreeCamera>{
    public camera!: FreeCamera;

    private _keyMap: TKeyMap;

    private _keys = new Array<string>();
    private _onCanvasBlurObserver: Nullable<Observer<Engine>> | undefined;
    private _onKeyboardObserver: Nullable<Observer<KeyboardInfo>> | undefined;
    private _onPointerObserver: Nullable<Observer<PointerInfo>> | undefined;
    private _engine: Engine | undefined;
    private _scene: Scene | undefined;
    private _preventDefault: boolean;


    private previousPosition: { x: number; y: number; } | undefined;
    // private buttons = [0, 1, 2];
    private angularSensibility = 2000.0;
    private restrictionX = 100;
    private restrictionY = 60;


    constructor({ inputType, enablePreventDefault = false }: ICustomInputOption) {
        console.log('InputTypeEnum ', InputTypeEnum.WASD);
        const _inputType: boolean = InputTypeEnum.WASD === inputType;
        this._keyMap = {
            w: _inputType ? 'w' : '',
            a: _inputType ? 'a' : '',
            s: _inputType ? 's' : '',
            d: _inputType ? 'd' : '',
            ArrowUp: _inputType ? '' : 'ArrowUp',
            ArrowDown: _inputType ? '' : 'ArrowDown',
            ArrowLeft: _inputType ? '' : 'ArrowLeft',
            ArrowRight: _inputType ? '' : 'ArrowRight',
            CombinedTest: 'test'
        }
        this._preventDefault = enablePreventDefault;

    }

    // attachControl(element: HTMLElement, noPreventDefault?: boolean): void {
    attachControl(): void {
        if (this._onCanvasBlurObserver) {
            return;
        }

        this._scene = this.camera!.getScene();
        this._engine = this._scene!.getEngine();

        this._onCanvasBlurObserver = this._engine.onCanvasBlurObservable.add(() => {
            this._keys = [];
        });

        /** 키보드 제어 */
        this._onKeyboardObserver = this._scene!.onKeyboardObservable.add((info) => {
            let evt = info.event;
            if (!evt.metaKey) { // allow Command and Window key
                if (info.type === KeyboardEventTypes.KEYDOWN) {
                    if (this._keyMap[evt.key]) {
                        let index = this._keys.indexOf(evt.key);
                        if (index === -1) {
                            this._keys.push(evt.key);
                        }
                        if (this._preventDefault) {
                            evt.preventDefault();
                        }
                    } else {
                        console.log('this key is not assigned')
                    }


                } else {
                    // let index = this._keys.indexOf(evt.key);
                    /** 
                     * todo: 대소문자 변경 시, keyup 감지 안되서 변경
                     * 캐릭터 속도 설정 시 W, w 따로 대응필요
                     */
                    let index = this._keys.indexOf(evt.key.toLocaleLowerCase());
                    if (index >= 0) {
                        this._keys.splice(index, 1);
                    }
                    if (this._preventDefault) {
                        evt.preventDefault();
                    }

                    // if (this._keyMap[evt.key]) {
                    // let index = this._keys.indexOf(evt.key);

                    // let index = this._keys.indexOf(evt.key));
                    // if (index >= 0) {
                    //     this._keys.splice(index, 1);
                    // }
                    // if (this._preventDefault) {
                    //     evt.preventDefault();
                    // }
                    // }

                }
            }
        });

        /** 마우스 제어 */
        this._onPointerObserver = this._scene!.onPointerObservable.add((evtInfo, evtState) => {

            let evt = evtInfo.event;
            var _this = this;
            var angle = { x: 0, y: 0 };
            if (!evt.metaKey) {
                let evt = evtInfo.event as IPointerEvent; // 바빌론 내부 문제로 IMouseEvent 가 넘어오기 때문에 캐스팅

                if (evtInfo.type === PointerEventTypes.POINTERDOWN) {

                    try {
                        evt.target.setPointerCapture(evt.pointerId);
                    }
                    catch (e) {
                        //Nothing to do with the error. Execution will continue.
                    }
                    _this.previousPosition = {
                        x: evt.clientX,
                        y: evt.clientY
                    };
                    if (this._preventDefault) {
                        evt.preventDefault();
                        // element.focus();
                    }

                }
                else if (evtInfo.type === PointerEventTypes.POINTERUP) {
                    try {
                        evt.target.releasePointerCapture(evt.pointerId);
                    }
                    catch (e) {
                        //Nothing to do with the error.
                    }

                    _this.previousPosition = undefined;

                    if (this._preventDefault) {
                        evt.preventDefault();
                    }
                } else if (evtInfo.type === PointerEventTypes.POINTERMOVE) {

                    if (!_this.previousPosition || this._engine!.isPointerLock) {
                        return;
                    }
                    var offsetX = evt.clientX - _this.previousPosition.x;
                    var offsetY = evt.clientY - _this.previousPosition.y;
                    angle.x += offsetX;
                    angle.y -= offsetY;
                    if (Math.abs(angle.x) > _this.restrictionX) {
                        angle.x -= offsetX;
                    }
                    if (Math.abs(angle.y) > _this.restrictionX) {
                        angle.y += offsetY;
                    }
                    if (_this.camera.getScene().useRightHandedSystem) {
                        if (Math.abs(angle.x) < _this.restrictionX) {
                            _this.camera.cameraRotation.y -= offsetX / _this.angularSensibility;
                        }
                    }
                    else {
                        if (Math.abs(angle.x) < _this.restrictionX) {
                            _this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
                        }
                    }
                    if (Math.abs(angle.y) < _this.restrictionY) {
                        _this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
                    }
                    _this.previousPosition = {
                        x: evt.clientX,
                        y: evt.clientY
                    };

                    if (this._preventDefault) {
                        evt.preventDefault();
                    }
                }

                /** 크로스브라우징 관련 작업인듯함 비활성화 해도 현재 작동
                  this._onSearchMove = function (evt) {       
                    if (!engine.isPointerLock) {
                        return;
                    }       
                    var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
                    var offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
                    if (_this.camera.getScene().useRightHandedSystem) {
                        _this.camera.cameraRotation.y -= offsetX / _this.angularSensibility;
                    }
                    else {
                        _this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
                    }
                    _this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
                    _this.previousPosition = null;
                    if (this._preventDefault) {
                        evt.preventDefault();
                    }
                };
                element.addEventListener("mousemove", this._onSearchMove, false);       
                */
            }

        });


    }

    // detachControl(element: Nullable<HTMLElement>): void {
    detachControl(): void {
        if (this._scene) {
            if (this._onKeyboardObserver) {
                this._scene.onKeyboardObservable.remove(this._onKeyboardObserver);
            }

            if (this._onCanvasBlurObserver) {
                this._engine!.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
            }

            if (this._onPointerObserver) {
                this._scene.onPointerObservable.remove(this._onPointerObserver);
            }

            this._onKeyboardObserver = null;
            this._onPointerObserver = null;
            this._onCanvasBlurObserver = null;

            // element.removeEventListener("mousemove", this._onSearchMove);
        }
        this._keys = [];
    }

    /** 키보드 제어, 프레임마다 작동 */
    public checkInputs(): void {

        let camera = this.camera;
        for (let index = 0; index < this._keys.length; index++) {
            let keyCode = this._keys[index];
            let speed = camera.speed;
            if (this._keyMap.a.indexOf(keyCode) !== -1) {
                // camera.rotation.y -= camera.angularSpeed; camera.speed
                camera._localDirection.copyFromFloats(-speed, 0, 0);
            }
            else if (this._keyMap.w.indexOf(keyCode) !== -1) {
                camera._localDirection.copyFromFloats(0, 0, speed);
            }
            else if (this._keyMap.d.indexOf(keyCode) !== -1) {
                // camera.rotation.y += camera.angularSpeed;
                camera._localDirection.copyFromFloats(speed, 0, 0);
            }
            else if (this._keyMap.s.indexOf(keyCode) !== -1) {
                camera._localDirection.copyFromFloats(0, 0, -speed);
            }
            else if (this._keyMap.ArrowUp.indexOf(keyCode) !== -1) {
                camera._localDirection.copyFromFloats(0, 0, speed);
            }
            else if (this._keyMap.ArrowDown.indexOf(keyCode) !== -1) {
                camera._localDirection.copyFromFloats(0, 0, -speed);
            }
            else if (this._keyMap.ArrowLeft.indexOf(keyCode) !== -1) {
                camera._localDirection.copyFromFloats(-speed, 0, 0);
            }
            else if (this._keyMap.ArrowRight.indexOf(keyCode) !== -1) {
                camera._localDirection.copyFromFloats(speed, 0, 0);
            }

            if (camera.getScene().useRightHandedSystem) {
                camera._localDirection.z *= -1;
            }
            camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
            Vector3.TransformNormalToRef(camera._localDirection, camera._cameraTransformMatrix, camera._transformedDirection);
            camera.cameraDirection.addInPlace(camera._transformedDirection);
        }

    }

    public getClassName(): string {
        return 'FreecameraKeyboardWalkInput2'
    }

    public _onLostFocus(): void {
        this._keys = [];
    }

    public getSimpleName(): string {
        return 'keyboard'
    }





}