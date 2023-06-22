import { Nullable } from "@babylonjs/core"
import * as BABYLON from "@babylonjs/core"
import { Engine } from "@babylonjs/core/Engines/engine"
import { Scene } from "@babylonjs/core/scene"
import { CreateSceneClass } from "../createScene"

// required imports
import "@babylonjs/core/Loading/loadingScreen"
import "@babylonjs/loaders/glTF"
import "@babylonjs/core/Materials/standardMaterial"
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader"

import testroomEnvironment from "../../assets/environment/environmentSpecular.env"

/*
class FileDropDownHandler {
    private _scene: Nullable<BABYLON.Scene> = null
    private _elementToMonitor: Nullable<HTMLElement> = null

    private _dragEnterHandler: Nullable<(e: any) => void> = null
    private _dragOverHandler: Nullable<(e: any) => void> = null
    private _dropHandler: Nullable<(e: any) => void> = null

    constructor(scene: BABYLON.Scene) {
        this._scene = scene
    }

    public monitorElementForDragNDrop(elementToMonitor: HTMLElement): void {
        if (elementToMonitor) {
            this._elementToMonitor = elementToMonitor

            this._dragEnterHandler = (e) => {
                this._drag(e)
            }
            this._dragOverHandler = (e) => {
                this._drag(e)
            }
            this._dropHandler = (e) => {
                this._drop(e)
            }

            this._elementToMonitor.addEventListener("dragenter", this._dragEnterHandler, false)
            this._elementToMonitor.addEventListener("dragover", this._dragOverHandler, false)
            this._elementToMonitor.addEventListener("drop", this._dropHandler, false)
        }
    }

    private _drag(e: DragEvent): void {
        e.stopPropagation()
        e.preventDefault()
    }

    private _drop(eventDrop: DragEvent): void {
        eventDrop.stopPropagation()
        eventDrop.preventDefault()

        this._loadFiles(eventDrop)
    }

    private _loadFiles(event: any): void {
        // Handling data transfer via drag'n'drop
        if (event && event.dataTransfer && event.dataTransfer.files) {
            this._filesToLoad = event.dataTransfer.files;
        }

        // Handling files from input files
        if (event && event.target && event.target.files) {
            this._filesToLoad = event.target.files;
        }

        if (!this._filesToLoad || this._filesToLoad.length === 0) {
            return;
        }

        if (this._startingProcessingFilesCallback) {
            this._startingProcessingFilesCallback(this._filesToLoad);
        }

        if (this._filesToLoad && this._filesToLoad.length > 0) {
            const files = new Array<File>();
            const folders = [];
            const items = event.dataTransfer ? event.dataTransfer.items : null;

            for (let i = 0; i < this._filesToLoad.length; i++) {
                const fileToLoad: any = this._filesToLoad[i];
                const name = fileToLoad.name.toLowerCase();
                let entry;

                fileToLoad.correctName = name;

                if (items) {
                    const item = items[i];
                    if (item.getAsEntry) {
                        entry = item.getAsEntry();
                    } else if (item.webkitGetAsEntry) {
                        entry = item.webkitGetAsEntry();
                    }
                }

                if (!entry) {
                    files.push(fileToLoad);
                } else {
                    if (entry.isDirectory) {
                        folders.push(entry);
                    } else {
                        files.push(fileToLoad);
                    }
                }
            }

            if (folders.length === 0) {
                this._processFiles(files);
                this._processReload();
            } else {
                const remaining = { count: folders.length };
                for (const folder of folders) {
                    this._traverseFolder(folder, files, remaining, () => {
                        this._processFiles(files);

                        if (remaining.count === 0) {
                            this._processReload();
                        }
                    });
                }
            }
        }
    }
}
*/

export class SetupEnv implements CreateSceneClass {
    //private _fileInput: Nullable<BABYLON.FilesInput> = null
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine)

        // debug 용
        void Promise.all([
            import("@babylonjs/core/Debug/debugLayer"),
            import("@babylonjs/inspector"),
        ]).then((_values) => {
            scene.debugLayer.show({
                handleResize: true,
                overlay: true,
                globalRoot: document.getElementById("#root") || undefined,
            })
        })

        //환경설정 : ----------------------------------------------------------------------
        const camera = new BABYLON.ArcRotateCamera("camera", 1.567, 1.315, 11.0, new BABYLON.Vector3(0, 2.8, 0), scene)
        camera.wheelPrecision = 12
        camera.lowerRadiusLimit = 2.0
        camera.upperRadiusLimit = 23.0
        camera.useBouncingBehavior = true
        camera.attachControl()

        const hemiLight = new BABYLON.HemisphericLight("hemi sphere light", new BABYLON.Vector3(0.65, 0.66, 0.37), scene)
        hemiLight.intensity = 0.5

        const directionalLight = new BABYLON.DirectionalLight("directional light", new BABYLON.Vector3(-1.00, -1.00, -0.5), scene)
        directionalLight.intensity = 2.0

        const cubeTexture = new BABYLON.CubeTexture(testroomEnvironment, scene)
        scene.createDefaultSkybox(cubeTexture, true, 1000, 0.3, true)

        // PostProcess 설정 : -------------------------------------------------------------
        var defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera])
        defaultPipeline.bloomEnabled = true
        defaultPipeline.bloomWeight = 0.3
        defaultPipeline.glowLayerEnabled = false
        defaultPipeline.imageProcessing.colorCurvesEnabled = true
        defaultPipeline.imageProcessing.contrast = 1.3
        defaultPipeline.imageProcessing.exposure = 1.2

        //File Input : ------------------------------------------------------------------
        const filesInput = new BABYLON.FilesInput(
            engine,
            scene,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            true
        )

        filesInput.loadAsync = (sceneFile, onProgress) => {
            const filesToLoad = filesInput.filesToLoad
            if (filesToLoad.length === 1) {
                const fileName = (filesToLoad[0] as any).correctName
                // if (isTextureAsset(fileName)) {
                //     return Promise.resolve(this.loadTextureAsset(`file:${fileName}`));
                // }
            }

            scene.getEngine().clearInternalTexturesCache()

            return BABYLON.SceneLoader.LoadAsync("file:", sceneFile, engine, onProgress)
        }

        //this._fileInput = filesInput
        filesInput.monitorElementForDragNDrop(canvas)
        return scene
    };
}

export default new SetupEnv()
