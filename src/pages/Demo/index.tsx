import { ChangeEvent } from 'react';
import { babylonInit } from '@/clients';
import style from './styles.module.scss';
import Select from '@/components/Select';
import TextCore from '@/components/_core/TextCore';
import { Engine } from "@babylonjs/core"

setTimeout(() => {
  babylonInit('myRoom').then(() => {
    // scene started rendering, everything is initialized
  });
}, 500);

const Demo = () => {
  const handleChangeScene = (e: ChangeEvent<HTMLSelectElement>) => {
    Engine.LastCreatedEngine?.dispose()
    babylonInit(e.currentTarget.value).then(() => {
      // scene started rendering, everything is initialized
    });
  };

  return (
    <>
      <Select
        className={style.selectScene}
        onChange={handleChangeScene}
        items={[
          {
            value: 'myRoom',
            children: <TextCore text={'myRoom'} />,
          },
          {
            value: 'setupEnv',
            children: <TextCore text={'setupEnv'} />,
          },
        ]}
      />
      <canvas
        id="renderCanvas"
        className={style.renderCanvas}
        touch-action="none"
      ></canvas>
      {/* <BottomSheet /> */}
    </>
  );
};

export default Demo;
