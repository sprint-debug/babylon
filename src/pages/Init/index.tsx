import { useAuthAPI } from '@/apis/User';
import Spinner from '@/components/Spinner';
import React from 'react';

const Init = () => {
  const { mutationAuthSignupEmail } = useAuthAPI();

  const autoSignin = async () => {
    await mutationAuthSignupEmail.mutateAsync({
      data: {
        email: '',
        id: '',
        password: '',
      },
      params: {},
    });
  };

  React.useEffect(() => {
    autoSignin();

    setTimeout(() => {
      //naviage('/demo');
    }, 1500);
  }, []);

  return (
    <React.Fragment>
      <Spinner />
    </React.Fragment>
  );
};

export default Init;
