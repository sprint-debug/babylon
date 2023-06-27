import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthAPI } from '@/apis/User';
import Spinner from '@/components/Spinner';
import './style.scss';

const Init = () => {
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

  const navigate = useNavigate();

  React.useEffect(() => {
    // autoSignin();
    setTimeout(() => {
      navigate('/tutorial');
    }, 1000)
  }, []);

  /** todo : 초기화 작업 */

  return (
    <React.Fragment>
      <div className="spinner_container">
        <Spinner />
      </div>
    </React.Fragment>
  );
};

export default Init;
