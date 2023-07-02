


// const cameraPointer = MeshBuilder.CreateBox('cameraPointer', { size: 1 }, scene);
// cameraPointer.position = Vector3.Zero();
// // followCam.lockedTarget = cameraPointer;

// const followCam = new ArcFollowCamera('followCam', Math.PI, Math.PI / 4, 150, cameraPointer, scene);
// // followCam.radius = 30;
// // followCam.heightOffset = 10;
// // followCam.rotationOffset = 0;
// // followCam.cameraAcceleration = 0.005;
// // followCam.maxCameraSpeed = 10;
// // followCam.attachControl(canvas, true);

// const testc = new FreeCamera('freeCam', new Vector3())
// // testc.ang


// window.addEventListener("keydown", function (event) {
//   canvas!.focus();
// })
// scene.onKeyboardObservable.add((kbEvt) => {
//   console.log(kbEvt.type, kbEvt.event)
//   if (kbEvt.type > 1) return;
//   switch (kbEvt.event.key) {
//     case 'w':
//       logger.log('w')
//       cameraPointer.movePOV(0, 0.1, 0);
//       break;
//     case 'a':
//       logger.log('a')
//       break;
//     case 's':
//       logger.log('s')
//       break;
//     case 'd':
//       logger.log('d')
//       break;

//     default:
//       break;
//   }
// })