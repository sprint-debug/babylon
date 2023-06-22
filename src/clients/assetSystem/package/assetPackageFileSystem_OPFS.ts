import { IAssetPackageFileSystem, eAssetType } from "../definitions"

/**
 * OPFS (origin private file system ) API를 사용한 구현
 * 주의 webview는 지원하지 않는다
 */
export class AssetPackageFileSystem_OPFS implements IAssetPackageFileSystem {
    private _root: FileSystemDirectoryHandle | null = null
    private _rootLand: FileSystemDirectoryHandle | null = null
    private _rootAvatar: FileSystemDirectoryHandle | null = null
    private _rootAsset: FileSystemDirectoryHandle | null = null

    private _isInit: boolean = false
    private _isInitFailed: boolean = false

    /**
     * 해당 에셋의 Directory가 존재여부를 반환
     * @param assetType
     * @param assetId
     * @param version
     * @returns
     */
    async isAssetDirExists(assetType: eAssetType, assetId: string, version: number): Promise<boolean> {
        const isInitalized = await this._initialize()
        if (!isInitalized) {
            return false
        }

        const dir = this._getRootDirByAssetType(assetType)
        if (dir) {
            try {
                const assetDir = await dir.getDirectoryHandle(assetId)
                await assetDir.getDirectoryHandle(`${version}`)
                return true
            }
            catch (ex) {
                return false
            }
        }

        console.error("AssetFileSystem_OPFS.isAssetDirExists() => not found root dir")
        return false
    }

    /**
     * 해당 에셋에 해당하는 디렉토리를 생성
     * @param assetType
     * @param assetId
     * @param version
     */
    async createAssetDir(assetType: eAssetType, assetId: string, version: number): Promise<boolean> {
        const isInitalized = await this._initialize()
        if (!isInitalized) {
            return false
        }

        const dir = this._getRootDirByAssetType(assetType)
        if (dir) {
            try {
                const assetDir = await dir.getDirectoryHandle(assetId, { create: true })
                await assetDir.getDirectoryHandle(`${version}`, { create: true })
                return true
            }
            catch (ex) {
                console.error(`AssetFileSystem_OPFS.createAssetDir() => exception = ${ex}`)
                return false
            }
        }
        console.error("AssetFileSystem_OPFS.createAssetDir() => not found root dir")
        return false
    }

    /**
     * 에셋 폴더 제거
     * @param assetType
     * @param assetId
     * @returns
     */
    async deleteAssetDir(assetType: eAssetType, assetId: string): Promise<boolean> {
        const isInitalized = await this._initialize()
        if (!isInitalized) {
            return false
        }

        const dir = this._getRootDirByAssetType(assetType)
        if (dir) {
            try {
                await dir.getDirectoryHandle(assetId) //없을경우 NotFoundError
                await dir.removeEntry(assetId, { recursive: true })
                return true
            }
            catch (ex) {
                if (ex instanceof Error) {
                    if (ex.name != 'NotFoundError') {
                        console.error(`AssetFileSystem_OPFS.deleteAssetDir() => exception = ${ex}`)
                    }
                }

                return false
            }
        }

        console.error("AssetFileSystem_OPFS.deleteAssetDir() => not found root dir")
        return false
    }

    /**
     * 해당 에셋에 파일을 생성
     * @param assetType
     * @param assetId
     * @param version
     * @param fileName
     * @param data
     * @returns
     */
    async createAssetFile(assetType: eAssetType, assetId: string, version: number, fileName: string, data: Blob): Promise<boolean> {
        const isInitalized = await this._initialize()
        if (!isInitalized) {
            return false
        }

        const dir = this._getRootDirByAssetType(assetType)
        if (dir) {
            try {
                const assetDir = await dir.getDirectoryHandle(assetId, { create: true })
                const versionDir = await assetDir.getDirectoryHandle(`${version}`, { create: true })
                const fileHandle = await versionDir.getFileHandle(fileName, { create: true })
                const writableStream = await fileHandle.createWritable()

                await writableStream.write(data)
                await writableStream.close()
                return true
            }
            catch (ex) {
                console.error(`AssetFileSystem_OPFS.createAssetFile() => exception = ${ex}`)
                return false
            }
        }

        console.error("AssetFileSystem_OPFS.createAssetFile() => not found root dir")
        return false
    }


    /**
     * 해당 에셋에서 파일을 읽음
     * @param assetType
     * @param assetId
     * @param filename
     * @returns
     */
    async readAssetFile(assetType: eAssetType, assetId: string, version: number, filename: string): Promise<Blob | null> {
        const isInitalized = await this._initialize()
        if (!isInitalized) {
            return null
        }

        const dir = this._getRootDirByAssetType(assetType)
        if (dir) {
            try {
                const assetDir = await dir.getDirectoryHandle(assetId)
                const versionDir = await assetDir.getDirectoryHandle(`${version}`)
                const fileHandle = await versionDir.getFileHandle(filename)
                console.log('OPFS assetDir ', assetDir);
                console.log('OPFS versionDir ', versionDir);
                console.log('OPFS fileHandle ', fileHandle);
                const file = await fileHandle.getFile()
                console.log('OPFS file ', file);
                return file //바로 넘겨도 되는가? (return)
            }
            catch (ex) {
                console.error(`AssetFileSystem_OPFS.readAssetFile() => exception = ${ex}`)
                return null
            }
        }

        console.error("AssetFileSystem_OPFS.readAssetFile() => not found root dir")
        return null
    }


    /**
     * 캐쉬를 비웁니다.
     */
    async clear(): Promise<void> {
        const isInitalized = await this._initialize()
        if (!isInitalized) {
            return
        }


        await this._root?.removeEntry("space", { recursive: true })
        await this._root?.removeEntry("meta", { recursive: true })

        const spaceDir = await this._root!.getDirectoryHandle("space", { create: true })
        const metaDir = await this._root!.getDirectoryHandle("meta", { create: true })
        this._rootLand = await spaceDir.getDirectoryHandle("land", { create: true })
        this._rootAvatar = await spaceDir.getDirectoryHandle("avatar", { create: true })
        this._rootAsset = await metaDir.getDirectoryHandle("item", { create: true })
    }


    /**
     * 에셋 타입에 따른 Root Directory Handle 반환
     * @param assetType
     * @returns
     */
    private _getRootDirByAssetType(assetType: eAssetType): FileSystemDirectoryHandle | null {
        if (eAssetType.Land === assetType) {
            return this._rootLand
        }
        else if (eAssetType.Avatar === assetType) {
            return this._rootAvatar
        }

        return this._rootAsset
    }

    /**
     * 파일 시스템을 초기화
     * @returns
     */
    private async _initialize(): Promise<boolean> {
        if (this._isInit || this._isInitFailed) {
            return this._isInit
        }

        try {
            this._root = await navigator.storage.getDirectory()

            const spaceDir = await this._root?.getDirectoryHandle("space", { create: true })
            const metaDir = await this._root?.getDirectoryHandle("meta", { create: true })
            this._rootLand = await spaceDir.getDirectoryHandle("land", { create: true })
            this._rootAvatar = await spaceDir.getDirectoryHandle("avatar", { create: true })
            this._rootAsset = await metaDir.getDirectoryHandle("item", { create: true })
            this._isInit = true
            return true
        }
        catch (ex) {
            console.error(`AssetFileSystem._initialize() => ex ${ex}`)
            this._isInitFailed = true
            return false
        }
    }
}