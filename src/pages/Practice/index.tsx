import React from 'react';
import { messageClient } from '@/clients/events';
import Button from '@/components/Button';
import { Outlet, NavLink } from 'react-router-dom';
import { logger } from '@/common/utils/logger';
import Text from '@/components/Text';
import FixedView from '../_shared/Layouts/FixedView';
import './style.scss';

const Practice = () => {

    const handleSceneSwitch = () => {
        // scene 전환 시 inspector 종료 통신한다.
        messageClient.postMessage('clear_inspector');
    }

    React.useEffect(() => {
        // Todo: 이벤트 리스너 클린업이 안되서 전환 시마다 증가하고 있음
        messageClient.addListener('alert', (payload: any) => {
            alert(payload.text);
        });

        return () => {
            messageClient.removeListener('alert');
            messageClient.removeListener('clear_inspector');
        };
    }, []);

    return (
        <FixedView className='container'>
            {/* Outlet is required to show nested child route */}

            <div className='menu_area'>
                <Button
                    onClick={() => {
                        messageClient.postMessage('clear_inspector', { 2: 2 });
                    }}
                >
                    <>Box</>
                </Button>
                <nav id='sidebar' onClick={handleSceneSwitch} className='sidebar'>
                    <NavLink to='1' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
                        scene01
                    </NavLink>
                    <NavLink to='2' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
                        AssetTest
                    </NavLink>
                    <NavLink to='3' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
                        ReactBabylonTest
                    </NavLink>
                </nav>

            </div>
            <div className='scene_area'>
                <Outlet />
            </div>
        </FixedView>
    );
};

export default Practice;


// import React from 'react';
// import FixedView from '../_shared/Layouts/FixedView';

// const Play01 = () => {
//   React.useEffect(() => { }, []);

//   return <FixedView>Play01!</FixedView>;
// };

// export default Play01;
