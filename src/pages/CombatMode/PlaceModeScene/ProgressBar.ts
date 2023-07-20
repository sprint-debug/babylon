// @ts-nocheck1
//https://playground.babylonjs.com/#P3XLK9
import { Animatable, EasingFunction } from "@babylonjs/core/Animations";
import { Scene, Color3, Vector2, Vector3, Quaternion } from "@babylonjs/core";
import { AdvancedDynamicTexture, Container, Control, Rectangle, TextBlock } from "@babylonjs/gui/2D";


export interface ProgressBarOptions {
    showText?: boolean,
    fontSize?: number | string,
    fontFamily?: string,
    width?: number | string,
    height?: number | string,
    cornerRadiusProgressBar?: number,
    cornerRadiusBackgroundBar?: number,
    colorProgressBar?: string,
    colorBackgroundBar?: string,
    borderProgressBar?: number,
    borderBackgroundBar?: number,
    vAlignment?: number,
    hAlignment?: number,
    hMargin?: number,
    vMargin?: number
}

export class ProgressBar {
    private progressRectangle: Rectangle;
    private backgroundRectangle: Rectangle;
    private textBlock: TextBlock;
    private _progress: number = 0;
    get progress(): number {
        return this._progress;
    }
    set progress(value: number) {
        this._progress = value;
        this.updateProgressDisplay();
    }
    total: number;
    parent: Container | AdvancedDynamicTexture;

    constructor(name: string, currentProgress: number, totalProgress: number, position: [number | string, number | string],
        parent: Container | AdvancedDynamicTexture, options: ProgressBarOptions) {
        this.parent = parent;

        this.backgroundRectangle = new Rectangle('ProgressBar(' + name + ').backgroundRectangle');
        this.backgroundRectangle.left = position[0];
        this.backgroundRectangle.top = position[1];
        this.parent.addControl(this.backgroundRectangle);

        let progressContainer = new Container('ProgressBar(' + name + ').progressContainer');
        this.progressRectangle = new Rectangle('ProgressBar(' + name + ').progressRectangle');
        this.backgroundRectangle.addControl(progressContainer);
        progressContainer.addControl(this.progressRectangle);

        this.textBlock = new TextBlock('ProgressBar(' + name + ').textBlock', 'NA');
        this.textBlock.text = 0 + ' / ' + 0;
        this.backgroundRectangle.addControl(this.textBlock);

        this.textBlock.isVisible = options.showText ? options.showText : true;
        this.textBlock.fontSize = options.fontSize ? options.fontSize : 20;
        this.textBlock.fontFamily = options.fontFamily ? options.fontFamily : 'Arial';

        this.backgroundRectangle.width = options.width ? options.width : 1;
        this.backgroundRectangle.height = options.height ? options.height : 0.5;
        this.backgroundRectangle.verticalAlignment = options.vAlignment ? options.vAlignment : Control.VERTICAL_ALIGNMENT_CENTER;
        this.backgroundRectangle.horizontalAlignment = options.hAlignment ? options.hAlignment : Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.backgroundRectangle.background = options.colorBackgroundBar ? options.colorBackgroundBar : '#596877';
        this.backgroundRectangle.cornerRadius = options.cornerRadiusBackgroundBar ? options.cornerRadiusBackgroundBar : 0;
        this.backgroundRectangle.thickness = options.borderBackgroundBar ? options.borderBackgroundBar : 0;

        let HMargin = options.hMargin ? options.hMargin : 0.02;
        let VMargin = options.vMargin ? options.vMargin : 0.1;
        progressContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        progressContainer.width = 1 - HMargin;
        progressContainer.left = (HMargin / 2 * 100) + '%';
        progressContainer.height = (1 - VMargin * 2) * 100 + "%";
        this.progressRectangle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.progressRectangle.width = 0;
        this.progressRectangle.background = options.colorProgressBar ? options.colorProgressBar : '#7BC14E';
        this.progressRectangle.cornerRadius = options.cornerRadiusProgressBar ? options.cornerRadiusProgressBar : 0;
        this.progressRectangle.thickness = options.borderProgressBar ? options.borderProgressBar : 0;

        this.total = totalProgress; // WARNING: total needs to be defined before progress                             
        this.progress = currentProgress;
    }

    updateProgressDisplay() {
        this.textBlock.text = this.progress.toFixed(0) + ' / ' + this.total;
        this.progressRectangle.width = this.progress / this.total;
    }
}


export class Tween {
    public static frameRate: number = 30;

    static createTween(scene: Scene, target: any, targetProperty: string, startValue: any, endValue: any, duration: number, loop: boolean, easingFunction?: EasingFunction, easingMode: number = EasingFunction.EASINGMODE_EASEIN) {

        let totalFrame = this.frameRate * duration; // redundant
        let animation = this.createAnimation(target, targetProperty, startValue, endValue, duration, Animation.ANIMATIONLOOPMODE_CYCLE, easingFunction, easingMode);
        let animTable = new Animatable(scene, target, 0, totalFrame, loop, 1, () => { }, [animation]);
        animTable.pause();
        return animTable;
    }

    static addTween(animManager: Animatable, target: any, targetProperty: string, startValue: any, endValue: any, duration: number, easingFunction?: EasingFunction, easingMode: number = EasingFunction.EASINGMODE_EASEIN) {

        let animation = this.createAnimation(target, targetProperty, startValue, endValue, duration, Animation.ANIMATIONLOOPMODE_CYCLE, easingFunction, easingMode);

        animManager.appendAnimations(target, [animation]);

    }

    private static createAnimation(target: any, targetProperty: string,
        startValue: any, endValue: any,
        duration: number, loopMode: number, easingFunction?: EasingFunction, easingMode: number = EasingFunction.EASINGMODE_EASEIN): Animation {

        if (startValue.constructor !== endValue.constructor) {
            throw new Error("Tween: start and end values should be of the same type! type of: " + startValue.constructor + ", " + endValue.constructor);
        }
        let animation_type = this.inferAnimationType(startValue);
        if (animation_type === null)
            throw new Error("Tween: the value type (endValue/startValue) is not supported!")

        let totalFrame = this.frameRate * duration;
        let animation = new Animation("Tween." + target.name + "." + targetProperty,
            targetProperty, this.frameRate,
            animation_type, loopMode);

        let keyFrames = [];

        keyFrames.push({
            frame: 0,
            value: startValue,
        });

        keyFrames.push({
            frame: totalFrame,
            value: endValue,
        });

        animation.setKeys(keyFrames);

        if (easingFunction) {
            easingFunction.setEasingMode(easingMode);
            animation.setEasingFunction(easingFunction);
        }

        return animation
    }

    public static inferAnimationType(variable: any): number | null {
        // could add MATRIX, SIZE, etc...
        if (variable instanceof Vector3) {
            return Animation.ANIMATIONTYPE_VECTOR3;
        }
        else if (variable instanceof Color3) {
            return Animation.ANIMATIONTYPE_COLOR3;
        }
        else if (variable instanceof Vector2) {
            return Animation.ANIMATIONTYPE_VECTOR2;
        }
        else if (variable instanceof Quaternion) {
            return Animation.ANIMATIONTYPE_QUATERNION;
        }
        else if ((typeof variable == 'number')) {
            return Animation.ANIMATIONTYPE_FLOAT;
        }
        else {
            return null
        }
    }

}