import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';
import logo from '~/images/logo-codevcast.png';

const Preloader = () => (
    <div className="w-full h-screen z-9999 flex flex-col justify-center items-center animate-fade">
        <img src={logo} alt="Codevcast Logo" className="w-50" />
        <code className="text-sm mt-4 text-gray-600">{`while(alive){ pray(); eat(); sleep(); code(); networking(); }`}</code>
        <LoadingOutlined className="text-xl mt-4 flex items-center justify-center" />
    </div>
);

export default Preloader;
