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
        </div>
        : <div className="spinner-container">
          <Spinner />
        </div>
      }
    </main>
  );
};

export default Init;
