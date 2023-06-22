export class Constants {

    /** Asset Version API  */
    public static readonly URL_ASSET_VERSION_API = "https://dev.colorverseapis.com/v1"
    public static readonly TEST_API_KEY = "ood7yv2aExFpRIkqAcKIaLu29e+R9v9rLBBgzGdey2yDThzzNcHqP2n/d5JM7hjGvYohw4QBAAAAAQAm4E3hsygQ8olgD+Th"

    /** Asset Donwnload URL */
    public static readonly BASE_URL_ASSET_DOWNLOAD = "https://resource.dev.colorver.se"

    /** TestRoom Asset Resources URL */
    public static readonly BASE_URL_TESTROOM_DOWNLOAD = "https://test-myroom-assets.s3.ap-northeast-2.amazonaws.com"

    /** 에셋로더에서 Loading후 재 참조를 위해 보관하는 타입 (브라우저 상황에서는 짧게 잡는게 좋을듯) */
    public static readonly LOADED_ASSET_LIFETIME = 30000 //30초

    /** Asset Package Infomation File Name */
    public static readonly ASSET_PACKAGE_INFO_FILENAME = "package.json"

    /** Manifest File Name */
    public static readonly MANIFEST_FILENAME = "manifest.json"

    /** Item Index Path Sperator */
    public static readonly ITEM_INDEX_PATH_SEPERATOR = "/"
}