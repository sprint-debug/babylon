/**
 * Asset은 여러가지 관점을 가지고 있다. 약간의 용어 정의 한다.
 *
 * AssetPackage : Asset을 구성하는 여러 파일의 모임
 * AssetPackageLocalCache : s3와 같은 remote storage에 존재하는 파일을 빠른 로딩을 위해 로칼 파일로 저장하는 방식
 * AssetPackageFileSystem : Web 브라우저 위해서는 LocalCache를 위한 동작방식이 제한적이며, 브라우저 마다 상황이 다르다. 실행환경과 관계없이 동작하기 위한 Interface
 * AssetPackageFileLoader : 에셋 패키지의 특정 파일을 로드한다
 *
 * AssetLoader : 실제적으로 Asset을 Instance화 한다.
 */

import { ISceneLoaderAsyncResult } from "@babylonjs/core"
import { IAssetPackageInfo } from "./jsonTypes/assetPackageInfo"
//---------------------------------------------------------------------------------------
// enum 정의부
//---------------------------------------------------------------------------------------
export enum eAssetType {
    None,
    Land,
    Avatar,
    Item,
    Particle,
    Model_glb,
}

//---------------------------------------------------------------------------------------
// AssetPackage 관련
//---------------------------------------------------------------------------------------
export interface IAssetPacakgeInfoQuery {
    getAssetInfo(assetType: eAssetType, assetId: string): Promise<IAssetPackageInfo | null>
}

export interface IAssetPackageLocalCache {
    isCachedAsset(assetType: eAssetType, assetId: string, version: number): Promise<boolean>
    storeAssetToCache(assetType: eAssetType, assetId: string, version: number): Promise<void>
    removeAssetFromCache(assetType: eAssetType, assetId: string): Promise<void>
    readAssetFromCache(assetType: eAssetType, assetId: string, version: number, filename: string): Promise<Blob | null>
    clearAllCache(): Promise<void>
}


export interface IAssetPackageFileSystem {
    isAssetDirExists(assetType: eAssetType, assetId: string, version: number): Promise<boolean>
    createAssetDir(assetType: eAssetType, assetId: string, version: number): Promise<boolean>
    deleteAssetDir(assetType: eAssetType, assetId: string): Promise<boolean>
    createAssetFile(assetType: eAssetType, assetId: string, version: number, fileName: string, blob: Blob): Promise<boolean>
    readAssetFile(assetType: eAssetType, assetId: string, version: number, fileName: string): Promise<Blob | null>
    clear(): Promise<void>
}


export interface IAssetPackageFileLoader {
    loadFile(assetType: eAssetType, assetId: string, filename: string): Promise<string> //return => objectUrl , URL.createObjectURL 참조 할것
    clearCache(): Promise<void>
}

//---------------------------------------------------------------------------------------
// AssetLoader 관련
//---------------------------------------------------------------------------------------
export interface IAssetLoadingResult {
    errors: string[]
    loadedObjects: ISceneLoaderAsyncResult
}

export interface IAssetLoader {
    loadAssetIntoScene(assetType: eAssetType, assetId: string): Promise<IAssetLoadingResult>
    clearCache(): Promise<void>
}
