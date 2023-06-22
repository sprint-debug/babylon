import { Constants } from "../constants"
import { IAssetPackageInfo } from "../jsonTypes/assetPackageInfo"
import { IAssetPacakgeInfoQuery, eAssetType } from "../definitions"
import * as _ from "lodash"
import { AssetUtils } from "../assetUtils"

export class AssetPackageInfoQuery implements IAssetPacakgeInfoQuery {

    private _allAssetInfos: Array<Map<string, IAssetPackageInfo | null>> = []

    /**
     * 생성자
     */
    public constructor() {
        Object.keys(eAssetType).forEach(() => {
            this._allAssetInfos.push(new Map<string, IAssetPackageInfo | null>())
        })
    }


    /**
     * 에셋의 버젼을 구해온다
     * @param assetType
     * @param assetId
     * @returns
     */
    public async getAssetInfo(assetType: eAssetType, assetId: string): Promise<IAssetPackageInfo | null> {
        const versionMap = this._getVersionMap(assetType)
        if (versionMap.has(assetId)) {
            return versionMap.get(assetId)!
        }

        const url = this._makeVersionUrl(assetType, assetId)
        const info = await AssetUtils.readJsonFromUrl<IAssetPackageInfo>(url)
        if (info) {
            versionMap.set(assetId, info)
        }
        else {
            //반복 요청하지 않도록 여기서 null을 넣어준다
            console.error(`AssetVersionQuery.getAssetInfo() : failed!!, url = ${url}`)
            versionMap.set(assetId, null)
        }

        return versionMap.get(assetId)!
    }


    /**
     * _allAssetVersions에서 에셋 타입에 맞게 container를 받아온다
     * @param assetType
     * @returns
     */
    private _getVersionMap(assetType: eAssetType): Map<string, IAssetPackageInfo | null> {
        return this._allAssetInfos[assetType]
    }


    /**
     * 에셋타입과 아이템 별 버전파일의 url 경로를 만든다.
     * @param assetType
     * @param assetId
     * @returns
     */
    private _makeVersionUrl(assetType: eAssetType, assetId: string): string {
        if (assetType === eAssetType.Land) {
            return `${Constants.BASE_URL_TESTROOM_DOWNLOAD}/space/land/${assetId}/${Constants.ASSET_PACKAGE_INFO_FILENAME}?t=${Date.now()}`
        }
        else if (assetType === eAssetType.Avatar) {
            return `${Constants.BASE_URL_TESTROOM_DOWNLOAD}/space/avatar/${assetId}/${Constants.ASSET_PACKAGE_INFO_FILENAME}?t=${Date.now()}`
        }
        else {
            return `${Constants.BASE_URL_TESTROOM_DOWNLOAD}/meta/item/${assetId}/${Constants.ASSET_PACKAGE_INFO_FILENAME}?t=${Date.now()}`
        }

        return ""
    }

    // public async test() {
    //     // const landId = "5eyeKtSccTJanf2qrX3Xk"
    //     // const landVersion = await this.getLandVersion(landId)
    //     // console.log(`land ${landId} - version ${landVersion}`)

    //     // const avatarId = "wUlLsgehLeFCJ9c6oftjc"
    //     // const avartaVersion = await this.getAvatarVersion(avatarId)
    //     // console.log(`avatar ${avatarId} - version ${avartaVersion}`)

    //     // const assetId = "1Sa5ZfVB9CCu1KGWpdScHQ"
    //     // const assetVersion = await this.getItemVersion(assetId)
    //     // console.log(`asset ${assetId} - version ${assetVersion}`)

    //     const itemId = "1Sa5ZfVB9CCu1KGWpdScHQ"
    //     const itemVersion = await this.getAssetVersion(eAssetType.Item, itemId)
    //     console.log(`item ${itemId} - version ${itemVersion}`)
    // }

}