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

  /** todo : 초기화 작업 */

  return (
    <main className="main-container">

      {isLoading ?
        <div className='btn-container '>
          <button onClick={routePage('/practice')} className="btn-main">Practice</button>
          <button onClick={routePage('/tutorial')} className="btn-main">Go to Basic Tutorials</button>
          <ul className='todo-list'>
            <li>
              <input type="checkbox" id="item1" checked />
              <label htmlFor="item1">기본 튜토리얼 적용</label>
            </li>
            <li>
              <input type="checkbox" id="item1" checked />
              <label htmlFor="item1">커스텀 마우스/키보드 컨트롤러</label>
            </li>
            <li>
              <input type="checkbox" id="item2" />
              <label htmlFor="item2">isometric 카메라</label>
            </li>
            <li>
              <input type="checkbox" id="item2" />
              <label htmlFor="item2"><a href='https://playground.babylonjs.com/#R1F8YU#47' target='_blank'>RotationQuaternion 테스트</a></label>
            </li>
            <li>
              <input type="checkbox" id="item2" />
              <label htmlFor="item2">NavMesh 테스트</label>
            </li>
            <li>
              <input type="checkbox" id="item2" />
              <label htmlFor="item2">2D Sprite, 3D 모델 리깅 TBD</label>
            </li>
          </ul>
        </div>
        : <div className="spinner-container">
          <Spinner />
        </div>
      }
    </main>
  );
};

export default Init;
