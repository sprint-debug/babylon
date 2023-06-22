import { Constants } from "../constants"
import * as BABYLON from "@babylonjs/core"

import { IAssetPackageLocalCache, IAssetPacakgeInfoQuery, IAssetPackageFileLoader, eAssetType } from "../definitions"
import { ILoadedAsset } from "../jsonTypes/loadedAsset"
import { AssetUtils } from "../assetUtils"
import { AssetPackageLocalCache } from "./assetPackageLocalCache"
import { AssetPackageInfoQuery } from "./assetPackageInfoQuery"
import { AssetPackageFileSystem_OPFS } from "./assetPackageFileSystem_OPFS"

import { AssetPackageFileSystem_IDB } from "./assetPackageFileSystem_IDB";




export class AssetPackageFileLoader implements IAssetPackageFileLoader {
    private _assetInfoQuery!: IAssetPacakgeInfoQuery
    private _localCache: IAssetPackageLocalCache | null = null
    private _loadedAssets: Map<string, ILoadedAsset> = new Map<string, ILoadedAsset>()

    public constructor(scene: BABYLON.Scene) {
        this._assetInfoQuery = new AssetPackageInfoQuery()
        this._localCache = new AssetPackageLocalCache(this._assetInfoQuery, new AssetPackageFileSystem_IDB())
        // this._localCache = new AssetPackageLocalCache(this._assetInfoQuery, new AssetPackageFileSystem_OPFS())
        scene.onBeforeRenderObservable.add(() => {
            this._removeLifetimeOverAssets()
        })
    }

    public async loadFile(assetType: eAssetType, assetId: string, filename: string): Promise<string> {
        const loadedAssetKey = this._makeLoaddedAssetKey(assetType, assetId, filename)
        if (this._loadedAssets.has(loadedAssetKey)) {
            const loadedAsset = this._loadedAssets.get(loadedAssetKey)
            return loadedAsset!.objectUrl
        }

        const assetInfo = await this._assetInfoQuery.getAssetInfo(assetType, assetId)
        if (assetInfo == null) {
            return ""
        }

        if (this._localCache) {
            return await this._loadAsset_UsingAssetCache(assetType, assetId, assetInfo.version, filename)
        }

        return await this._loadAsset_FromUrl(assetType, assetId, assetInfo.version, filename)
    }

    public async clearCache(): Promise<void> {
        if (this._localCache) {
            await this._localCache.clearAllCache()
        }
    }

    private _removeLifetimeOverAssets(): void {
        const curTime: number = new Date().getTime()

        const willRemoveItems: string[] = []
        this._loadedAssets.forEach((v, k) => {
            if ((curTime - v.lastAssetTime) > Constants.LOADED_ASSET_LIFETIME) {
                willRemoveItems.push(k)
            }
        })

        willRemoveItems.forEach(k => {
            const objUrl = this._loadedAssets.get(k)?.objectUrl
            if (objUrl) {
                //console.log(`AssetPackageFileLoader._removeLifetimeOverAssets() => remove obj ${objUrl}`)
                URL.revokeObjectURL(objUrl)
            }
            this._loadedAssets.delete(k)
        })
    }

    private async _loadAsset_UsingAssetCache(assetType: eAssetType, assetId: string, version: number, filename: string): Promise<string> {
        console.log('####### _loadAsset_UsingAssetCache 1')
        if (this._localCache) {
            console.log('####### _loadAsset_UsingAssetCache 2')
            const isCached = await this._localCache.isCachedAsset(assetType, assetId, version)
            console.log('####### _loadAsset_UsingAssetCache 3')
            console.log('FileLoader isCached ', isCached)
            if (true) {
                console.log('####### _loadAsset_UsingAssetCache 4')
                // if (!isCached) {
                await this._localCache.storeAssetToCache(assetType, assetId, version)
            }
            console.log('####### _loadAsset_UsingAssetCache 5')
            const data = await this._localCache.readAssetFromCache(assetType, assetId, version, filename)
            console.log('####### _loadAsset_UsingAssetCache 6 ', data)
            console.log('####### _loadAsset_UsingAssetCache 6 null != data ', null != data)
            console.log('####### _loadAsset_UsingAssetCache 6 data instanceof Blob ', data instanceof Blob)
            if (null != data && data instanceof Blob) {
                const objUrl = URL.createObjectURL(data)
                console.log('####### _loadAsset_UsingAssetCache 7 ', assetType, assetId, filename, objUrl)
                this._addLoadedAsset(assetType, assetId, filename, objUrl)
                return objUrl
            }
        }

        console.error(`AssetLoader._loadAsset_UsingAssetCache() : failed!! assetType=${eAssetType[assetType]} assetId=${assetId} filename=${filename}`)
        return ""
    }

    private async _loadAsset_FromUrl(assetType: eAssetType, assetId: string, version: number, filename: string): Promise<string> {

        const url = AssetUtils.makeAssetFileUrl(assetType, assetId, version, filename)
        const response = await fetch(url)
        if (response.ok) {
            const data = await response.blob()
            const objUrl = URL.createObjectURL(data)
            this._addLoadedAsset(assetType, assetId, filename, objUrl)
            return objUrl
        }

        console.error(`AssetLoader._loadAsset_FromUrl() : failed!! assetType=${eAssetType[assetType]} assetId=${assetId} filename=${filename}`)
        return ""
    }


    private _makeLoaddedAssetKey(assetType: eAssetType, assetId: string, filename: string): string {
        return `${assetType}.${assetId}.${filename}`
    }

    private _addLoadedAsset(assetType: eAssetType, assetId: string, filename: string, objUrl: string): void {
        const key = this._makeLoaddedAssetKey(assetType, assetId, filename)
        console.log('_addLoadedAsset ', key, assetType, assetId, filename, objUrl)
        this._loadedAssets.set(key, {
            assetType: assetType,
            assetId: assetId,
            assetFile: filename,
            objectUrl: objUrl,
            lastAssetTime: new Date().getTime()
        })
        console.log('_addLoadedAsset ', this._loadedAssets, {
            assetType: assetType,
            assetId: assetId,
            assetFile: filename,
            objectUrl: objUrl,
            lastAssetTime: new Date().getTime()
        })
    }
}