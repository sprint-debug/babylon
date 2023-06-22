import { Constants } from "../../constants"
import { IAssetPacakgeInfoQuery, eAssetType } from "../../definitions"
import { IAssetPackageInfo } from "../../jsonTypes/assetPackageInfo"
import * as _ from "lodash"

export class AssetVersionQuery_Colorverse implements IAssetPacakgeInfoQuery {
    getAssetInfo(assetType: eAssetType, assetId: string): Promise<IAssetPackageInfo | null> {
        console.log(assetType, assetId)
        throw new Error("Method not implemented.") //아래 코드로 다시 수정 필요~
    }

    private _cachedLandVersions = new Map<string, number>
    private _cachedAvatarVersions = new Map<string, number>
    private _cachedItemVersions = new Map<string, number>

    /**
     * 캐쉬된 land의 버젼을 넘겨주거나, api를 통해서 받아옵니다.
     */
    public async getLandVersion(landId: string): Promise<number> {
        if (this._cachedLandVersions.has(landId)) {
            return this._cachedLandVersions.get(landId)!
        }

        const url = this._makeVersionQueryUrl_Land(landId)

        let version = 1
        const res = await this._fetchVersion(url, true)
        if (!res.ok) {
            console.error("AssetVersionQuery.getLandVersion => failed")
            return version
        }

        const versionInfo: any = await res.json()
        if (versionInfo && versionInfo.data && versionInfo.data.option && versionInfo.data.option.publish_resource_version) {
            version = versionInfo.data.option.publish_resource_version
            this._cachedLandVersions.set(landId, version)
            //console.log(`getLandVersion() : ${landId} - version = ${version}`)
        }
        else {
            console.error("AssetVersionQuery.getLandVersion => invalid versionInfo")
        }


        return version
    }

    /**
    * 캐쉬된 아바타 버젼을 넘겨주거나, api를 통해서 구해옵니다.
    */
    public async getAvatarVersion(avatarId: string): Promise<number> {
        if (this._cachedAvatarVersions.has(avatarId)) {
            return this._cachedAvatarVersions.get(avatarId)!
        }

        const url = this._makeVersionQueryUrl_Avatar(avatarId)

        let version = 1
        const res = await this._fetchVersion(url, true)
        if (!res.ok) {
            console.error("AssetVersionQuery.getAvatarVersion => failed")
            return version
        }

        const versionInfo: any = await res.json()
        if (versionInfo && versionInfo.data && versionInfo.data.option && versionInfo.data.option.version) {
            version = versionInfo.data.option.version
            this._cachedAvatarVersions.set(avatarId, version)
            //console.log(`getAvatarVersion() : ${avatarId} - version = ${version}`)
        }
        else {
            console.error("AssetVersionQuery.getAvatarVersion => invalid versionInfo")
        }

        return version
    }

    /** 캐쉬된 아이템의 버젼을 넘겨주거나, api를 통해서 구해옵니다. */
    public async getItemVersion(itemId: string): Promise<number> {
        if (this._cachedItemVersions.has(itemId)) {
            return this._cachedItemVersions.get(itemId)!
        }

        const isAssetType = this._checkMetaAsset(itemId)
        const url = isAssetType ? this._makeVersionQueryUrl_MetaAsset(itemId) : this._makeVersionQueryUrl_MetaItem(itemId)

        let version = 1
        const res = await this._fetchVersion(url, false)
        if (!res.ok) {
            console.error("AssetVersionQuery.getItemVersion => failed")
            return version
        }

        const versionInfo: any = await res.json()
        if (versionInfo && versionInfo.data && versionInfo.data.option && versionInfo.data.option.version) {
            version = versionInfo.data.option.version
            this._cachedItemVersions.set(itemId, version)
            //console.log(`getItemVersion() : ${itemId} - version = ${version}`)
        }
        else {
            console.error("AssetVersionQuery.getAvatarVersion => invalid versionInfo")
        }

        return version
    }


    public async test() {
        const landId = "5eyeKtSccTJanf2qrX3Xk"
        const landVersion = await this.getLandVersion(landId)
        console.log(`land ${landId} - version ${landVersion}`)

        const avatarId = "wUlLsgehLeFCJ9c6oftjc"
        const avartaVersion = await this.getAvatarVersion(avatarId)
        console.log(`avatar ${avatarId} - version ${avartaVersion}`)

        const assetId = "1Sa5ZfVB9CCu1KGWpdScHQ"
        const assetVersion = await this.getItemVersion(assetId)
        console.log(`asset ${assetId} - version ${assetVersion}`)

        const itemId = "W4s0PCx0V6LyQMkWrZWuu"
        const itemVersion = await this.getItemVersion(itemId)
        console.log(`item ${itemId} - version ${itemVersion}`)
    }


    /** Server로 부터 version을 받아옵니다. */
    private async _fetchVersion(url: string, headerApiKey: boolean): Promise<Response> {

        const headers = new Headers()
        headers.append('Content-Type', 'application/json')
        if (headerApiKey) {
            headers.append('X-API-KEY', Constants.TEST_API_KEY)
        }

        return await fetch(url, {
            method: 'GET',
            headers,
            redirect: 'follow',
        })
    }


    /** 버젼쿼리 Url를 만듭니다. (랜드) */
    private _makeVersionQueryUrl_Land(landId: string): string {
        const url = `${Constants.URL_ASSET_VERSION_API}/space/land/-/${landId}/version`
        return url
    }

    /** 버젼쿼리 Url를 만듭니다. (아바타) */
    private _makeVersionQueryUrl_Avatar(avatarId: string): string {
        const url = `${Constants.URL_ASSET_VERSION_API}/space/avatar/${avatarId}/version`
        return url
    }

    /** 버젼쿼리 Url를 만듭니다. (아이템) */
    private _makeVersionQueryUrl_MetaItem(itemId: string): string {
        const url = `${Constants.URL_ASSET_VERSION_API}/meta/item/-/${itemId}`
        return url
    }

    /** 버젼쿼리 Url를 만듭니다. (에셋) */
    private _makeVersionQueryUrl_MetaAsset(assetId: string): string {
        const url = `${Constants.URL_ASSET_VERSION_API}/meta/asset/-/${assetId}`
        return url
    }

    /** 버전 체크 api가 asset과 item이 분할 되어 있다. itemId를 통해서 asset인지 item인지 먼저 구분해야한다. uuid.cs : Uuid.ParseByBase62() */
    private _checkMetaAsset(itemId: string): boolean {

        try {

            const bytes = this._fromBase62(itemId)

            // ccid rule bytes reverse
            bytes.reverse()
            if (bytes.length != 16) {
                console.error("AssetVersionQuery._checkAssetType() => invalid uuid length!!!")
                return false
            }

            // domainType만 체크한다
            const domainType = (bytes[1] << 8 | bytes[2])
            const SvcDomainType_MetaAsset = (4 << 8)            //unity project SvcDomainType.cs 참조 할것
            const SvcDomainType_MetaUserAsset = (4 << 8) | 5    //unity project SvcDomainType.cs 참조 할것

            return domainType === SvcDomainType_MetaAsset || domainType === SvcDomainType_MetaUserAsset
        }
        catch {
            console.error("AssetVersionQuery._checkAssetType() => exception!!!")
        }

        return false
    }


    /** ---------------------------------------------------------------------------------
     * @internal
     *  item id를 통해서 asset인지 item인지 구분하기
     *  colorverse unity 프로젝트 serverapi / uuid.cs 참조
     * ---------------------------------------------------------------------------------
    */


    /**
     * @internal
     * colorverse unity 프로젝트 참조할 것! (Base62convert.cs : Base62Convert.FromBase62())
     */
    private _fromBase62(itemId: string): Uint8Array {

        const arr = this._convertAllIntArray(itemId)
        //console.log(`arr=${arr}`)
        const converted = this._baseConvert(arr, 62, 256, true)
        //console.log(`converted=${converted}`)
        const bytes = this._convertIntArrayToBytes(converted)
        //console.log(`bytes=${bytes}`)

        return bytes
    }


    /**
     * @internal
     * colorverse unity 프로젝트 참조할 것! (Base62convert.cs : Base62Convert.FromBase62())
     */
    private _convertAllIntArray(itemId: string): number[] {
        const DefaultCharacterSet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        const arr: number[] = []
        for (var i = 0;i < itemId.length;++i) {
            const idx = DefaultCharacterSet.indexOf(itemId.charAt(i))
            // if (idx < 0) {
            //     console.error(`AssetVersionQuery._convertBase62ToByteArray() => not registed char.. ${itemId.charAt(i)}`)
            //     return null
            // }
            arr.push(idx)
        }

        return arr
    }

    /**
     * @internal
     * colorverse unity 프로젝트 참조할 것! (base62Converter.cs : Base62Convert.BaseConvert())
     */
    private _baseConvert(source: number[], sourceBase: number, targetBase: number, zeroFlag: boolean): number[] {
        let result: number[] = []
        let leadingZeroCount = Math.trunc(Math.min(_.takeWhile(source, (x => x == 0)).length, source.length - 1))

        let count: number
        while ((count = source.length)) {
            const quotient: number[] = []
            let remainder = 0
            for (let i = 0;i != count;i++) {
                let accumulator = Math.trunc(Math.trunc(source[i]) + Math.trunc(remainder * sourceBase))
                var digit = Math.trunc(accumulator / targetBase)
                remainder = accumulator % targetBase
                if (quotient.length > 0 || digit > 0) {
                    quotient.push(Math.trunc(digit))
                }
            }

            result.unshift(Math.trunc(remainder))
            source = quotient
        }

        if (zeroFlag) {
            for (let i = 0;i < leadingZeroCount;i++) {
                result.unshift(0)
            }
            if (result.length < 16) {
                let c = 16 - result.length
                for (let i = 0;i < c;i++) {
                    result.unshift(0)
                }
            }
        }

        return result
    }

    /**
     * @internal
     * colorverse unity 프로젝트 참조할 것! (Base62convert.cs : Base62Convert.FromBase62())
     */
    private _convertIntArrayToBytes(source: number[]): Uint8Array {
        return new Uint8Array(source)
    }
}