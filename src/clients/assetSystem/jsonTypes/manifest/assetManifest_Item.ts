import { IAssetManifest } from "./assetManifest"

/**
 * Item Manifest.json
 * (https://docs.google.com/spreadsheets/d/1yqfSkIAjAIfqYmP8UW-Jx0_Ho-tsnAmr6tmKXOVkaiI/edit#gid=836007209)
 */

export interface IAssetManifest_Item extends IAssetManifest {
    format: number
    main:
    {
        type: string,

        child: IItemJsonChildData[],
        param: IItemJsonParamData[],
    }
}

//---------------------------------------------------------------------------------------
// Sub Data
//---------------------------------------------------------------------------------------
export interface IItemJsonChildData {
    id: string, //에셋 id
    t: string,  //에셋 타입 ("model", "item" ..)
    i: number,  //index (고유)
    n: string,  //노드이름
}

export interface IItemJsonParamData {
    n: string,  //param 이름 (AddClass_Space ...)
    i: string,  //index path
    v: any,     //param value
}