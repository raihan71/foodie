import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';
import logo from '~/images/logo-codevcast.png';

const Preloader = () => (
    <div className="w-full h-screen z-9999 flex flex-col justify-center items-center animate-fade">
        <img src={logo} alt="Codevcast Logo" className="w-48" />
        <span className="text-sm mt-4 text-gray-600">Social Network For Developers</span>
        <LoadingOutlined className="text-xl mt-4 flex items-center justify-center" />
    </div>
);

export default Preloader;
