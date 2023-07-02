export type TKeyMap = {
    [key: string]: string;
}

export interface ICustomInputOption {
    inputType: number
    cameraSpeed?: number;
    enablePreventDefault?: boolean;
    mouseSensitivity?: number;
}

export enum DirectionEnum {
    W,
    A,
    S,
    D,
    Arrow
}

export enum InputTypeEnum {
    WASD,
    ARROW
}