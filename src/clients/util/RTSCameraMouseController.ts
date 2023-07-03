import { UniversalCamera, ICameraInput, Vector3, Matrix } from '@babylonjs/core'
import { Rectangle } from '@babylonjs/gui/2D/controls/rectangle';
import { AdvancedDynamicTexture, Control } from '@babylonjs/gui/2D';

const ECameraMovement = {
    KEYS: 0,
    MOUSE: 1,
}
const gui = AdvancedDynamicTexture.CreateFullscreenUI('ui');

/** todo - 마우스 외  휠, 키보드 클래스 만들어야함 */
export class RTSCameraMouseController implements ICameraInput<UniversalCamera>{
    public camera!: UniversalCamera;

    private _disableEdgeScroll: () => void;
    private _enabled: boolean;
    private _topEdgeScroll: boolean;
    private _rightEdgeScroll: boolean;
    private _bottomEdgeScroll: boolean;
    private _leftEdgeScroll: boolean;
    private _alphaEdgeScroll: number;
    private _widthEdgeScroll: number;
    private _heightEdgeScroll: number;
    public topEdge: Rectangle;
    public topRightCorner: Rectangle;
    public rightEdge: Rectangle;
    public bottomRightCorner: Rectangle;
    public bottomEdge: Rectangle;
    public bottomLeftCorner: Rectangle;
    public leftEdge: Rectangle;
    public topLeftCorner: Rectangle;

    constructor() {
        this._disableEdgeScroll = () => {
            this._topEdgeScroll = false;
            this._rightEdgeScroll = false;
            this._bottomEdgeScroll = false;
            this._leftEdgeScroll = false;
        };

        this._enabled = true;
        this._topEdgeScroll = false;
        this._rightEdgeScroll = false;
        this._bottomEdgeScroll = false;
        this._leftEdgeScroll = false;
        this._alphaEdgeScroll = 1.0;
        this._widthEdgeScroll = 0.05;
        this._heightEdgeScroll = 0.05;

        this.topEdge = new Rectangle();
        this.topRightCorner = new Rectangle();
        this.rightEdge = new Rectangle();
        this.bottomRightCorner = new Rectangle();
        this.bottomEdge = new Rectangle();
        this.bottomLeftCorner = new Rectangle();
        this.leftEdge = new Rectangle();
        this.topLeftCorner = new Rectangle();
    }

    attachControl = (noPreventDefault: boolean) => {
        const _this = this;
        const engine = this.camera.getEngine();
        const element = engine.getInputElement();
        element && element.addEventListener("contextmenu", this.onContextMenu.bind(this), false);

        // top edge area
        this.topEdge.width = 1 - 2 * this._heightEdgeScroll;
        this.topEdge.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.topEdge.height = this._heightEdgeScroll;
        this.topEdge.background = "green";
        this.topEdge.isPointerBlocker = false;
        this.topEdge.alpha = this._alphaEdgeScroll;
        this.topEdge.isEnabled = this._enabled;
        this.topEdge.onPointerEnterObservable.add((eventData, eventState) => {
            _this._disableEdgeScroll();
            _this._topEdgeScroll = true;
            if (_this.camera.metadata.movedBy === null) {
                _this.camera.metadata.movedBy = ECameraMovement.MOUSE;
            }
        });
        this.topEdge.onPointerOutObservable.add((eventData, eventState) => {
            _this._disableEdgeScroll();
        });
        gui.addControl(this.topEdge);

        // top right corner area
        this.topRightCorner.height = this._heightEdgeScroll;
        this.topRightCorner.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.topRightCorner.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.topRightCorner.width = this._widthEdgeScroll;
        this.topRightCorner.background = "green";
        this.topRightCorner.isPointerBlocker = false;
        this.topRightCorner.alpha = this._alphaEdgeScroll;
        this.topRightCorner.isEnabled = this._enabled;
        this.topRightCorner.onPointerEnterObservable.add((eventData, eventState) => {
            _this._disableEdgeScroll();
            _this._topEdgeScroll = true;
            _this._rightEdgeScroll = true;
            if (_this.camera.metadata.movedBy === null) {
                _this.camera.metadata.movedBy = ECameraMovement.MOUSE;
            }
        });
        this.topRightCorner.onPointerOutObservable.add((eventData, eventState) => {
            _this._disableEdgeScroll();
        });
        gui.addControl(this.topRightCorner);

        // right edge area
        this.rightEdge.height = 1 - 2 * this._widthEdgeScroll;
        this.rightEdge.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.rightEdge.width = this._widthEdgeScroll;
        this.rightEdge.background = "green";
        this.rightEdge.isPointerBlocker = false;
        this.rightEdge.alpha = this._alphaEdgeScroll;
        this.rightEdge.isEnabled = this._enabled;
        this.rightEdge.onPointerEnterObservable.add((eventData, eventState) => {
            _this._disableEdgeScroll();
            _this._rightEdgeScroll = true;
            if (_this.camera.metadata.movedBy === null) {
                _this.camera.metadata.movedBy = ECameraMovement.MOUSE;
            }
        });
        this.rightEdge.onPointerOutObservable.add((eventData, eventState) => {
            _this._disableEdgeScroll();
        });
        gui.addControl(this.rightEdge);

        // bottom right corner area
        this.bottomRightCorner.height = this._heightEdgeScroll;
        this.bottomRightCorner.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.bottomRightCorner.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.bottomRightCorner.width = this._widthEdgeScroll;
        this.bottomRightCorner.background = "green";
        this.bottomRightCorner.isPointerBlocker = false;
        this.bottomRightCorner.alpha = this._alphaEdgeScroll;
        this.bottomRightCorner.isEnabled = this._enabled;
        this.bottomRightCorner.onPointerEnterObservable.add((eventData, eventState) => {
            _this._disableEdgeScroll();
            _this._bottomEdgeScroll = true;
            _this._rightEdgeScroll = true;
            if (_this.camera.metadata.movedBy === null) {
                _this.camera.metadata.movedBy = ECameraMovement.MOUSE;
            }
        });
        this.bottomRightCorner.onPointerOutObservable.add((eventData, eventState) => {
            _this._disableEdgeScroll();
        });
        gui.addControl(this.bottomRightCorner);

        // bottom edge area
        this.bottomEdge.width = 1 - 2 * this._heightEdgeScroll;
        this.bottomEdge.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.bottomEdge.height = this._heightEdgeScroll;
        this.bottomEdge.background = "green";
        this.bottomEdge.isPointerBlocker = false;
        this.bottomEdge.alpha = this._alphaEdgeScroll;
        this.bottomEdge.isEnabled = this._enabled;
        this.bottomEdge.onPointerEnterObservable.add((eventData, eventState) => {
            _this._disableEdgeScroll();
            _this._bottomEdgeScroll = true;
            if (_this.camera.metadata.movedBy === null) {
                _this.camera.metadata.movedBy = ECameraMovement.MOUSE;
            }
        });
        this.bottomEdge.onPointerOutObservable.add((eventData, eventState) => {
            _this._disableEdgeScroll();
        });
        gui.addControl(this.bottomEdge);

        // bottom left corner area
        this.bottomLeftCorner.height = this._heightEdgeScroll;
        this.bottomLeftCorner.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.bottomLeftCorner.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.bottomLeftCorner.width = this._widthEdgeScroll;
        this.bottomLeftCorner.background = "green";
        this.bottomLeftCorner.isPointerBlocker = false;
        this.bottomLeftCorner.alpha = this._alphaEdgeScroll;
        this.bottomLeftCorner.isEnabled = this._enabled;
        this.bottomLeftCorner.onPointerEnterObservable.add((eventData, eventState) => {
            _this._disableEdgeScroll();
            _this._bottomEdgeScroll = true;
            _this._leftEdgeScroll = true;
            if (_this.camera.metadata.movedBy === null) {
                _this.camera.metadata.movedBy = ECameraMovement.MOUSE;
            }
        });
        this.bottomLeftCorner.onPointerOutObservable.add((eventData, eventState) => {
            _this._disableEdgeScroll();
        });
        gui.addControl(this.bottomLeftCorner);

        // left edge area
        this.leftEdge.height = 1 - 2 * this._widthEdgeScroll;
        this.leftEdge.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.leftEdge.width = this._widthEdgeScroll;
        this.leftEdge.background = "green";
        this.leftEdge.isPointerBlocker = false;
        this.leftEdge.alpha = this._alphaEdgeScroll;
        this.leftEdge.isEnabled = this._enabled;
        this.leftEdge.onPointerEnterObservable.add((eventData, eventState) => {
            _this._disableEdgeScroll();
            _this._leftEdgeScroll = true;
            if (_this.camera.metadata.movedBy === null) {
                _this.camera.metadata.movedBy = ECameraMovement.MOUSE;
            }
        });
        this.leftEdge.onPointerOutObservable.add((eventData, eventState) => {
            _this._disableEdgeScroll();
        });
        gui.addControl(this.leftEdge);

        // top left corner area
        this.topLeftCorner.height = this._heightEdgeScroll;
        this.topLeftCorner.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.topLeftCorner.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.topLeftCorner.width = this._widthEdgeScroll;
        this.topLeftCorner.background = "green";
        this.topLeftCorner.isPointerBlocker = false;
        this.topLeftCorner.alpha = this._alphaEdgeScroll;
        this.topLeftCorner.isEnabled = this._enabled;
        this.topLeftCorner.onPointerEnterObservable.add((eventData, eventState) => {
            _this._disableEdgeScroll();
            _this._topEdgeScroll = true;
            _this._leftEdgeScroll = true;
            if (_this.camera.metadata.movedBy === null) {
                _this.camera.metadata.movedBy = ECameraMovement.MOUSE;
            }
        });
        this.topLeftCorner.onPointerOutObservable.add((eventData, eventState) => {
            _this._disableEdgeScroll();
        });
        gui.addControl(this.topLeftCorner);
    };

    onContextMenu = (evt: any) => {
        evt.preventDefault();
    };

    checkInputs = () => {
        if (this._enabled) {
            const speed = this.camera.speed;
            const mdata = this.camera.metadata;

            // if mouse is in an area, move the camera in that direction
            if (this._topEdgeScroll) mdata.targetPosition.addInPlace(Vector3.TransformCoordinates(new Vector3(0, 0, speed), Matrix.RotationY(this.camera.rotation.y)));
            if (this._bottomEdgeScroll) mdata.targetPosition.addInPlace(Vector3.TransformCoordinates(new Vector3(0, 0, -speed), Matrix.RotationY(this.camera.rotation.y)));
            if (this._leftEdgeScroll) mdata.targetPosition.addInPlace(Vector3.TransformCoordinates(new Vector3(-speed, 0, 0), Matrix.RotationY(this.camera.rotation.y)));
            if (this._rightEdgeScroll) mdata.targetPosition.addInPlace(Vector3.TransformCoordinates(new Vector3(speed, 0, 0), Matrix.RotationY(this.camera.rotation.y)));

            // if limit x/z is reached, set position to max/min value
            if (mdata.targetPosition.x < mdata.minX) mdata.targetPosition.x = mdata.minX;
            if (mdata.targetPosition.x > mdata.maxX) mdata.targetPosition.x = mdata.maxX;
            if (mdata.targetPosition.z < mdata.minZ) mdata.targetPosition.z = mdata.minZ;
            if (mdata.targetPosition.z > mdata.maxZ) mdata.targetPosition.z = mdata.maxZ;

            // calculate distance between actual camera position and targeted camera position
            var lengthDiff = (mdata.targetPosition.subtract(this.camera.position)).length();
            // movedBy prevent moving camera by keys and mouse simultaneously
            if (lengthDiff > 0 && mdata.movedBy === ECameraMovement.MOUSE) {
                var t = lengthDiff < 0.01 ? 1.0 : 0.02;
                this.camera.position = Vector3.Lerp(this.camera.position, mdata.targetPosition, t);
                if (t === 1.0) {
                    mdata.movedBy = null;
                }
            }
        }
    }

    // detachControl = (ignored: any) => {
    detachControl = () => {
        if (this.onContextMenu) {
            var engine = this.camera.getEngine();
            var element = engine.getInputElement();
            element && element.removeEventListener("contextmenu", this.onContextMenu);
        }
        gui.removeControl(this.topEdge);
        gui.removeControl(this.topRightCorner);
        gui.removeControl(this.rightEdge);
        gui.removeControl(this.bottomRightCorner);
        gui.removeControl(this.bottomEdge);
        gui.removeControl(this.bottomLeftCorner);
        gui.removeControl(this.leftEdge);
        gui.removeControl(this.topLeftCorner);
        // gui.remove(this.topEdge);
        // gui.remove(this.topRightCorner);
        // gui.remove(this.rightEdge);
        // gui.remove(this.bottomRightCorner);
        // gui.remove(this.bottomEdge);
        // gui.remove(this.bottomLeftCorner);
        // gui.remove(this.leftEdge);
        // gui.remove(this.topLeftCorner);

    };

    public getClassName = function () {
        return "FreeCameraMouseInput";
    };

    public getSimpleName = function () {
        return "mouse";
    };

    public _onLostFocus(): void {
        // this._keys = [];
    }
}
