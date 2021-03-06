import { ArrowLeftOutlined, ArrowRightOutlined, CloseOutlined, LogoutOutlined, MenuOutlined, SearchOutlined, StarOutlined, TeamOutlined, UsergroupAddOutlined, PlayCircleOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { LOGIN, REGISTER, SUGGESTED_DEVELOPER } from "~/constants/routes";
import Footer from '~/components/shared/Footer';
import logo from '~/images/logo-codevcast.png';
import logo_dark from '~/images/logo-codevcast-dark.png';
import { IUser } from "~/types/types";
import Messages from "../main/Messages";
import Notification from "../main/Notification";
import Avatar from "./Avatar";
import SearchInput from "./SearchInput";
import ThemeToggler from "./ThemeToggler";

interface IProps {
    isAuth: boolean;
    theme: string;
    auth: IUser;
    openModal: () => void;
}

const NavBarMobile: React.FC<IProps> = ({ theme, isAuth, auth, openModal }) => {
    const [isOpenSearch, setOpenSearch] = useState(false);
    const [isOpenMenu, setOpenMenu] = useState(false);
    const { pathname } = useLocation();
    const history = useHistory();

    const onClickMenuItem = () => {
        setOpenMenu(false);
    }

    const clickSearchItemCallback = (user: IUser) => {
        setOpenSearch(false);
        history.push(`/user/${user.username}`);
    }

    return isOpenSearch ? (
        <div className="fixed top-0 left-0 flex w-full items-center bg-gray-700 z-9999 py-2 pr-2 shadow-xl">
            <div
                className="p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-500"
                onClick={() => setOpenSearch(false)}
            >
                <ArrowLeftOutlined className="text-white" style={{ fontSize: '18px' }} />
            </div>
            <SearchInput
                clickItemCallback={clickSearchItemCallback}
                inputClassName="w-full"
            />
        </div>
    ) : (
            <nav className="contain flex justify-between z-9999 align-center w-100 border-b border-transparent bg-white dark:bg-purple-1000 text-gray-700 h-60px py-2 fixed top-0 left-0 w-full shadow-md laptop:shadow-sm dark:border-gray-800">
                <div className="flex items-center space-x-8">
                    {/* ---- LOGO -------- */}
                    <Link
                        to={{
                            pathname: '/',
                            state: { from: pathname }
                        }}
                    >
                        {theme === 'dark' ? (
                            <img
                                src={logo_dark}
                                alt=""
                                className="w-24"
                            />
                        ) : <img
                        src={logo}
                        alt=""
                        className="w-24"
                    /> }
                    </Link>
                </div>
                {/* ---- NAVICONS FOR MOBILE ---- */}
                <div className="flex items-center space-x-4 laptop:hidden">
                    {isAuth && (
                        <>
                            <div
                                className="p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200  dark:hover:bg-purple-1100"
                            >
                                <Messages isAuth={isAuth} />
                            </div>
                            <div
                                className="p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200  dark:hover:bg-purple-1100"
                            >
                                <Notification isAuth={isAuth} />
                            </div>
                        </>
                    )}
                    <div
                        className="p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-purple-1100"
                        onClick={() => setOpenSearch(true)}
                    >
                        <SearchOutlined style={{ fontSize: '20px' }} />
                    </div>
                    <div
                        className="p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200  dark:text-white dark:hover:bg-purple-1100"
                        onClick={() => setOpenMenu(true)}
                    >
                        <MenuOutlined style={{ fontSize: '20px' }} />
                    </div>
                </div>
                {/* ---- NAV DRAWER FOR MOBILE --- */}
                <div className={`flex  flex-col w-full h-screen fixed top-0 right-0 transition-transform  transform ${isOpenMenu ? 'translate-x-0' : 'translate-x-full'} bg-white dark:bg-purple-1000 laptop:hidden`}>
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="dark:text-white">Menu</h1>
                            <ThemeToggler />
                        </div>
                        <div
                            className="p-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-purple-1100"
                            onClick={() => setOpenMenu(false)}
                        >
                            <CloseOutlined style={{ fontSize: '20px' }} />
                        </div>
                    </div>
                    {isAuth ? (
                        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                            <li className="px-4 py-3 pb-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-purple-1100">
                                <Link
                                    className="flex font-medium dark:text-gray-400"
                                    onClick={onClickMenuItem}
                                    to={`/user/${auth.username}`}
                                >
                                    <Avatar url={auth.profilePicture} size="lg" className="mr-2" />
                                    <div className="flex flex-col">
                                        <span>{auth.username}</span>
                                        <span className="text-gray-400 text-xs">View Profile</span>
                                    </div>
                                </Link>
                            </li>
                            <li className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-purple-1100">
                                <Link
                                    className="flex items-center text-black dark:text-white"
                                    onClick={onClickMenuItem}
                                    to={`/user/${auth.username}/following`}
                                >
                                    <TeamOutlined className="text-gray-700 dark:text-gray-400" style={{ fontSize: '30px', marginRight: '25px' }} />
                                    <h6 className="text-sm">Following</h6>
                                </Link>
                            </li>
                            <li className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-purple-1100">
                                <Link
                                    className="flex items-center text-black dark:text-white"
                                    onClick={onClickMenuItem}
                                    to={`/user/${auth.username}/followers`}
                                >
                                    <TeamOutlined className="text-gray-700 dark:text-gray-400" style={{ fontSize: '30px', marginRight: '25px' }} />
                                    <h6 className="text-sm">Followers</h6>
                                </Link>
                            </li>
                            <li className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-purple-1100">
                                <Link
                                    className="flex items-center text-black dark:text-white"
                                    onClick={onClickMenuItem}
                                    to={`/user/${auth.username}/bookmarks`}
                                >
                                    <StarOutlined className="text-gray-700 dark:text-gray-400" style={{ fontSize: '30px', marginRight: '25px' }} />
                                    <h6 className="text-sm">Bookmarks</h6>
                                </Link>
                            </li>
                            <li className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-purple-1100">
                                <Link
                                    className="flex items-center text-black dark:text-white"
                                    onClick={onClickMenuItem}
                                    to={SUGGESTED_DEVELOPER}
                                >
                                    <UsergroupAddOutlined className="text-gray-700 dark:text-gray-400" style={{ fontSize: '30px', marginRight: '25px' }} />
                                    <h6 className="text-sm">Suggested Developer</h6>
                                </Link>
                            </li>
                            <li className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-purple-1100">
                                <Link
                                    className="flex items-center text-black dark:text-white"
                                    onClick={onClickMenuItem}
                                    to={{ pathname: "http://codevcast.com/" }} target="_blank"
                                >
                                    <PlayCircleOutlined className="text-gray-700 dark:text-gray-400" style={{ fontSize: '30px', marginRight: '25px' }} />
                                    <h6 className="text-sm">Podcast</h6>
                                </Link>
                            </li>
                            <li className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-purple-1100">
                                <div
                                    className="flex items-center text-black dark:text-white"
                                    onClick={() => {
                                        openModal();
                                        setOpenMenu(false);
                                    }}
                                >
                                    <LogoutOutlined className="text-red-500" style={{ fontSize: '30px', marginRight: '25px' }} />
                                    <h6 className="text-sm text-red-500">Logout</h6>
                                </div>
                            </li>
                        </ul>
                    ) : (
                            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                                <li className="px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-purple-1100 flex items-center justify-start">
                                    <ArrowRightOutlined className="flex items-center justify-center dark:text-white" />
                                    <Link
                                        className="p-4 font-medium dark:text-gray-400 flex-grow"
                                        to={LOGIN}
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li className="px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-purple-1100 flex items-center justify-start">
                                    <ArrowRightOutlined className="flex items-center justify-center dark:text-white" />
                                    <Link
                                        className="p-4 font-medium dark:text-gray-400 flex-grow"
                                        to={REGISTER}
                                    >
                                        Register
                                    </Link>
                                </li>
                            </ul>
                        )}
                    {/* --- COPYRIGHT -- */}
                    <Footer />
                </div>
            </nav>
        )
};

export default NavBarMobile;
