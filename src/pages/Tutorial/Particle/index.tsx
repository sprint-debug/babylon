import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
    SceneLoader,
    Animation,
    StandardMaterial,
    Texture,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Scene,
    ArcRotateCamera,
    Axis,
    Space,
    Tools,
    CubeTexture,
    Color3,
    SpriteManager,
    Sprite,
    Mesh,
    ParticleSystem,
    Color4,
    PointerEventTypes
} from '@babylonjs/core';
import { handleSceneSwitch } from '@/pages/Tutorial/subscribeMsgEvt';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';

const onSceneReady = (scene: Scene) => {
    // debug 용
    void Promise.all([
        import("@babylonjs/core/Debug/debugLayer"),
        import("@babylonjs/inspector"),
    ]).then((_values) => {
        scene.debugLayer.show({
            handleResize: true,
            overlay: false,
            // overlay: true, // inspector 대비 비율 화면
            globalRoot: document.getElementById("#root") || undefined,
        })
    })

    const canvas = scene.getEngine().getRenderingCanvas();
    canvas!.height = 800;
    canvas!.width = 1000;

    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 50, new Vector3(0, 2, 0), scene);
    camera.upperBetaLimit = Math.PI / 2.2;
    camera.attachControl(canvas, true)


    const light = new HemisphericLight("light", new Vector3(2, 1, 0), scene);

    // skybox
    const skybox = MeshBuilder.CreateBox('skyBox', { size: 150 }, scene);
    const skyboxMat = new StandardMaterial('skyBoxMat', scene);
    skyboxMat.backFaceCulling = false;
    skyboxMat.reflectionTexture = new CubeTexture('/src/assets/ex_tutorial/skyboxCube/skybox', scene);
    skyboxMat.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMat.diffuseColor = new Color3(0, 0, 0);
    skyboxMat.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMat;

    /** largeGround Layer */
    const largeGroundMat = new StandardMaterial('largeGroundMat');
    largeGroundMat.diffuseTexture = new Texture('/src/assets/ex_tutorial/valleygrass.png');
    const largeGround = MeshBuilder.CreateGroundFromHeightMap(
        'largeGround',
        '/src/assets/ex_tutorial/villageheightmap.png',
        { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 }
    );
    largeGround.material = largeGroundMat;

    /** villageGround Layer */
    const groundMat = new StandardMaterial('groundMat');
    groundMat.diffuseTexture = new Texture('/src/assets/ex_tutorial/villagegreen.png');
    groundMat.diffuseTexture.hasAlpha = true;
    const ground = MeshBuilder.CreateGround('ground', { width: 24, height: 24 });
    ground.material = groundMat;
    largeGround.position.y = -0.01;

    SceneLoader.ImportMeshAsync("", "/src/assets/ex_tutorial/", "village.glb").then(() => {
        const ground = scene.getMeshByName('villageGround');
        ground!.material = largeGroundMat;
        ground!.position.y = -0.01;
    });

    SceneLoader.ImportMeshAsync('', '/src/assets/ex_tutorial/', 'car.babylon').then(() => {
        const car = scene.getMeshByName('car');
        car!.rotation = new Vector3(-Math.PI / 2, 0, Math.PI / 2);
        car!.position = new Vector3(3, 0.16, 8);
        const animCar = new Animation('carAnimation', 'position.z', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        const carKeys = [];
        carKeys.push({ frame: 0, value: 10 });
        carKeys.push({ frame: 200, value: -15 });
        animCar.setKeys(carKeys);
        car!.animations = []
        car!.animations.push(animCar);

        scene.beginAnimation(car, 0, 200, true);

        const wheelRF = scene.getMeshByName('wheelRF');
        const wheelRB = scene.getMeshByName('wheelRB');
        const wheelLF = scene.getMeshByName('wheelLF');
        const wheelLB = scene.getMeshByName('wheelLB');
        console.log(wheelRB?.animations);
        scene.beginAnimation(wheelRF, 0, 30, true);
        scene.beginAnimation(wheelRB, 0, 30, true);
        scene.beginAnimation(wheelLF, 0, 30, true);
        scene.beginAnimation(wheelLB, 0, 30, true);
    });

    /** sprite section */
    const spriteManagerTrees = new SpriteManager('treesManager', '/src/assets/ex_tutorial/palmtree.png', 2000, { width: 512, height: 1024 }, scene);
    for (let i = 0; i < 500; i++) {
        const tree = new Sprite('tree', spriteManagerTrees);
        tree.position = new Vector3(Math.random() * (-30), 0.5, Math.random() * (20 + 8));
    }
    for (let i = 0; i < 500; i++) {
        const tree = new Sprite('tree', spriteManagerTrees);
        tree.position = new Vector3(Math.random() * (25) + 7, 0.5, Math.random() * -35 + 8);
    }

    const spriteManagerUFO = new SpriteManager('UFOManager', '/src/assets/ex_tutorial/ufo.png', 1, { width: 128, height: 76 }, scene);
    const ufo = new Sprite('ufo', spriteManagerUFO);
    ufo.playAnimation(0, 16, true, 125);
    ufo.position.y = 5;
    ufo.position.z = 0;
    ufo.width = 2;
    ufo.height = 1;

    let switched = false;
    const pointerDown = (mesh) => {
        logger.log('pointerDOWN ', mesh)
        if (mesh === fountain) {
            switched = !switched;
            if (switched) particleSystem.start();
            else particleSystem.stop();
        }
    }

    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case PointerEventTypes.POINTERDOWN:
                if (pointerInfo.pickInfo.hit) {
                    pointerDown(pointerInfo.pickInfo?.pickedMesh);
                }
                break;
        }
    });


    /** fountain section */
    const fountainOutline = [
        new Vector3(0, 0, 0),
        new Vector3(0.5, 0, 0),
        new Vector3(0.5, 0.2, 0),
        new Vector3(0.4, 0.2, 0),
        new Vector3(0.4, 0.05, 0),
        new Vector3(0.05, 0.1, 0),
        new Vector3(0.05, 0.8, 0),
        new Vector3(0.15, 0.9, 0)
    ]

    const fountain = MeshBuilder.CreateLathe('fountain', { shape: fountainOutline, sideOrientation: Mesh.DOUBLESIDE });
    fountain.position.x = -4;
    fountain.position.z = -6;

    /** particle section */
    const particleSystem = new ParticleSystem('particles', 5000, scene);
    // particle texture
    particleSystem.particleTexture = new Texture('/src/assets/ex_tutorial/flare.png');
    // particle direction
    particleSystem.emitter = new Vector3(-4, 0.8, -6);
    particleSystem.minEmitBox = new Vector3(-0.01, 0, -0.01);
    particleSystem.maxEmitBox = new Vector3(0.01, 0, 0.01);
    // particle color
    particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
    // particle size, random between
    particleSystem.minSize = 0.01;
    particleSystem.maxSize = 0.05;
    // particle life time, random between
    particleSystem.minLifeTime = 1;
    particleSystem.maxLifeTime = 3;
    // emission rate;
    particleSystem.emitRate = 1500;
    // BlendMode. oneone or standard
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
    // set particle gravity
    particleSystem.gravity = new Vector3(0, -100.81, 0);
    // particle direction after emitted
    particleSystem.direction1 = new Vector3(-1, 8, 1);
    particleSystem.direction2 = new Vector3(1, 8, 1);

    // Power and speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 5;
    particleSystem.updateSpeed = 0.01;












    /** scene 전환 시, inspector 종료작업 */
    handleSceneSwitch(scene, { enableScopeInfo: true });

};


const ParticleScene = () => {

    React.useEffect(() => {
        return () => {
            messageClient.removeListener('clear_inspector');
        }
    }, [])

    return (
        <SceneComponent
            antialias
            onSceneReady={onSceneReady}
            // onRender={onRender}
            id="my-canvas"
        />
    );
};

export default ParticleScene;
