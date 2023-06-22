import { eAssetType } from "./definitions"
import { Constants } from "./constants"

export class AssetUtils {

    /**
    * 에셋의 Manifest url 생성
    * @param assetType
    * @param assetId
    * @returns
    */
    public static makeAssetManifestUrl(assetType: eAssetType, assetId: string, version: number): string {
        if (assetType === eAssetType.Land) {
            return `${Constants.BASE_URL_TESTROOM_DOWNLOAD}/space/land/${assetId}/${version}/manifest.json?t=${Date.now()}`
        }
        else if (assetType === eAssetType.Avatar) {
            return `${Constants.BASE_URL_TESTROOM_DOWNLOAD}/space/avatar/${assetId}/${version}/manifest.json?t=${Date.now()}`
        }
        else {
            return `${Constants.BASE_URL_TESTROOM_DOWNLOAD}/meta/item/${assetId}/${version}/manifest.json?t=${Date.now()}`
        }

        return ""
    }

    /**
    * 에셋파일을 url 생성
    * @param assetType
    * @param assetId
    * @returns
    */
    public static makeAssetFileUrl(assetType: eAssetType, assetId: string, version: number, assetFile: string): string {
        if (assetType === eAssetType.Land) {
            return `${Constants.BASE_URL_TESTROOM_DOWNLOAD}/space/land/${assetId}/${version}/${assetFile}?t=${Date.now()}`
        }
        else if (assetType === eAssetType.Avatar) {
            return `${Constants.BASE_URL_TESTROOM_DOWNLOAD}/space/avatar/${assetId}/${version}/${assetFile}?t=${Date.now()}`
        }
        else {
            return `${Constants.BASE_URL_TESTROOM_DOWNLOAD}/meta/item/${assetId}/${version}/${assetFile}?t=${Date.now()}`
        }

        return ""
    }


    /**
     * Url로 부터 Json 파일을 읽는다. (Object Url 포함)
     * @param url
     * @returns
     */
    public static async readJsonFromUrl<T>(url: string): Promise<T | null> {
        try {
            const response = await fetch(url)
            if (response.ok) {
                const manifest = await response.json()
                return manifest as T
            }
            return null
        }
        catch (ex) {
            console.error(`AssetUtils.readJsonFromUrl() => url ${url}\nexception: ${ex} `)
            return null
        }
    }

    /**
     * Url로 부터 Blob데이터를 얻어온다 (Object Url 포함)
     */
    public static async readBlobFromUrl(url: string): Promise<Blob | null> {
        const response = await fetch(url)
        if (response.ok) {
            return await response.blob()
        }
        return null
    }


    /**
     * 입력받은 str 값을 assetType으로 변환한다
     */
    public static convertStringToAssetType(str: string): eAssetType {
        if ("Item" === str) {
            return eAssetType.Item
        }
        else if ("Land" === str) {
            return eAssetType.Land
        }
        else if ("Avatar" === str) {
            return eAssetType.Avatar
        }
        else if ("Particle" === str) {
            return eAssetType.Particle
        }
        else if ("Model_glb" === str) {
            return eAssetType.Model_glb
        }

        return eAssetType.None
    }
}