import { eAssetType } from "../definitions"

export interface ILoadedAsset {
    assetType: eAssetType
    assetId: string
    assetFile: string

    objectUrl: string
    lastAssetTime: number
}