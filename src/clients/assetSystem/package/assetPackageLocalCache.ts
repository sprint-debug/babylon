import { IAssetPackageLocalCache, IAssetPackageFileSystem, IAssetPacakgeInfoQuery, eAssetType } from "../definitions"
import { AssetUtils } from "../assetUtils"

export class AssetPackageLocalCache implements IAssetPackageLocalCache {
    private assetInfoQuery!: IAssetPacakgeInfoQuery
    private fileSystem!: IAssetPackageFileSystem

    /**
     * 생성자
     * @param assetInfoQuery
     */
    constructor(assetInfoQuery: IAssetPacakgeInfoQuery, fileSystem: IAssetPackageFileSystem) {
        this.assetInfoQuery = assetInfoQuery
        this.fileSystem = fileSystem
    }


    /**
     * 에셋이 캐쉬에 있는가 확인
     * @param assetType
     * @param assetId
     * @param version
     */
    public async isCachedAsset(assetType: eAssetType, assetId: string, version: number): Promise<boolean> {
        return await this.fileSystem.isAssetDirExists(assetType, assetId, version)
    }


    /**
     * CDN에 있는 Asset 파일들을 로칼 Cache에 저장
     * @param assetType
     * @param assetId
     * @param version
     */
    public async storeAssetToCache(assetType: eAssetType, assetId: string, version: number): Promise<void> {
        const isCached = await this.isCachedAsset(assetType, assetId, version)
        if (!isCached) {
            await this.removeAssetFromCache(assetType, assetId)
            const assetInfo = await this.assetInfoQuery.getAssetInfo(assetType, assetId)
            if (assetInfo) {
                const downloadList: string[] = []
                assetInfo.files.forEach(f => {
                    downloadList.push(f)
                })

                const successCreateDir = await this.fileSystem.createAssetDir(assetType, assetId, version)
                if (successCreateDir) {
                    for (let i = 0;i < downloadList.length;++i) {
                        const filename = downloadList[i]
                        const assetUrl = AssetUtils.makeAssetFileUrl(assetType, assetId, assetInfo.version, filename)
                        const response = await fetch(assetUrl)
                        if (response.ok) {
                            const data = await response.blob()
                            await this.fileSystem.createAssetFile(assetType, assetId, version, filename, data)
                        }
                        else {
                            console.error(`AssetCacheManager.storeAssetToCache() => fetch failed, url = ${assetUrl}`)
                        }
                    }
                }
                else {
                    console.error(`AssetCacheManager.storeAssetToCache() => creating dir failed`)
                }
            }
        }
    }


    /**
     * 에셋 캐쉬에서 제거
     * @param assetType
     * @param assetId
     * @param version
     */
    public async removeAssetFromCache(assetType: eAssetType, assetId: string): Promise<void> {
        await this.fileSystem.deleteAssetDir(assetType, assetId)
    }

    /**
     * 에셋 읽기
     * @param assetType
     * @param assetId
     * @param version
     * @param filename
     */
    public async readAssetFromCache(assetType: eAssetType, assetId: string, version: number, filename: string): Promise<Blob | null> {
        return await this.fileSystem.readAssetFile(assetType, assetId, version, filename)
    }

    /**
     * 캐쉬 클리어
     */
    public async clearAllCache(): Promise<void> {
        await this.fileSystem.clear()
    }
}