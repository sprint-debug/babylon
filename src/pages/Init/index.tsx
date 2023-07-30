import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthAPI } from '@/apis/User';
import Spinner from '@/components/Spinner';
import './style.scss';

const Init = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  // const { mutationAuthSignupEmail } = useAuthAPI();
  // const autoSignin = async () => {
  //   await mutationAuthSignupEmail.mutateAsync({
  //     data: {
  //       email: '',
  //       id: '',
  //       password: '',
  //     },
  //     params: {},
  //   });
  // };

  const pageData = [
    { path: '/combat_test', name: 'combat_test' },
    { path: '/sceneWithUI', name: 'scene-UI combined' },
    { path: '/ui-example', name: 'canvas-ui in same page' },
    { path: '/ui-example/scenemode', name: 'canvas-ui separated from router' },
    { path: '/practice', name: 'Practice' },
    { path: '/tutorial', name: 'Go to Basic Tutorials' },
  ]

  const todoData = [
    { name: '기본 튜토리얼 적용', isChecked: true },
    { name: '커스텀 마우스/키보드 컨트롤러', isChecked: true },
    { name: 'isometric 카메라', isChecked: true },
    { name: 'RotationQuaternion 테스트 https://playground.babylonjs.com/#R1F8YU#47', isChecked: false },
    { name: 'NavMesh 테스트', isChecked: true },
    { name: '2D Sprite, 3D 모델 리깅 TBD', isChecked: true },
    { name: 'Scene 정리', isChecked: true },
    { name: 'react-babylon test', isChecked: false },
    { name: 'UI 구성', isChecked: false },
  ]

  const routePage = (path: string) => () => {
    navigate(path);
  }

  React.useEffect(() => {
    // autoSignin();
    setTimeout(() => {
      // navigate('/tutorial');
      setIsLoading(true);
    }, 500)
  }, []);


  return (
    <main className="main-container">

      {isLoading ?
        <div className='content-wrapper' >
          <div className='page-list'>
            {pageData.map((data) => <button onClick={routePage(data.path)} className="btn-main">{data.name}</button>)}
          </div>
          <div >
            <ul className='todo-list'>
              {todoData.map((data, idx) => <li>
                <input type="checkbox" id={`item${idx}`} checked={data.isChecked} />
                <label htmlFor={`item${idx}`}>{data.name}</label>
              </li>)}
            </ul>
          </div>
        </div>
        : <div className="spinner-container">
          <Spinner />
        </div>
      }
    </main>
  );
};

export default Init;
