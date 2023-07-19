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


  // const [activeTab, setActiveTab] = React.useState('tab1');
  // const [textAreaValue, setTextAreaValue] = React.useState('');
  // const [parsedString, setParsedString] = React.useState('');
  // const handleTabClick = (tab: string) => () => {
  //   if (tab === 'tab2') {
  //     try {
  //       const tmpStr: string = textAreaValue;
  //       const jsonString = JSON.parse(tmpStr);
  //       console.log('parsedString STRING ', tmpStr);
  //       console.log('jsonString STRING ', jsonString);
  //       setParsedString(jsonString)
  //     } catch (error) {
  //       console.log('ERR ', error);
  //       setParsedString('오류');

  //     }
  //   }
  //   setActiveTab(tab);
  // };
  // const handleTextAreaChange = (e: any) => {
  //   console.log('handleTEXTAREA ', e)
  //   setTextAreaValue(e.target.value);
  // };

  return (
    <main className="main-container">

      {isLoading ?
        <div className='btn-container '>
          <button onClick={routePage('/combat_test')} className="btn-main">combat_test</button>
          <button onClick={routePage('/sceneWithUI')} className="btn-main">scene-UI combined</button>
          <button onClick={routePage('/sceneSeparatedUI')} className="btn-main">sceneSeparatedUI</button>
          <button onClick={routePage('/sceneSeparatedUI/scenemode')} className="btn-main">scene-UI separated withUI</button>
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
          {/* <div style={{
            margin: '15px',
            padding: '15px',
            backgroundColor: 'white'
          }}>
            <div>
              <button onClick={handleTabClick('tab1')}>input JSON string</button>
              <button onClick={handleTabClick('tab2')}>view JSON string</button>
            </div>
            <div>
              {activeTab === 'tab1' ? (
                <div>
                  <h3>Tab 1 Content</h3>
                  <div>This is the content for Tab 1.</div>
                  <input
                    type="text"
                    style={{ width: '250px', height: '250px' }}
                    // value='test'
                    defaultValue={textAreaValue}
                    onChange={(e) => handleTextAreaChange(e)}
                  />
                </div>
              ) : (
                <div>
                  <h3>prettified JSON</h3>
                  <br />
                  <div>
                    <input
                      type="text"
                      style={{ width: '250px', height: '250px' }}
                      value={parsedString}
                    />
                  </div>
                </div>
              )}
            </div>
            <div>

            </div>
          </div> */}
        </div>
        : <div className="spinner-container">
          <Spinner />
        </div>
      }
    </main>
  );
};

export default Init;
