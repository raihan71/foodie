import { FormOutlined, InfoCircleOutlined, StarOutlined, TeamOutlined, UserAddOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface IProps {
    followersCount: number;
    followingCount: number;
    username: string;
    isOwnProfile: boolean;
}

const linkStyleName = `
    text-sm laptop:text-lg font-medium text-gray-500 hover:bg-gray-00
    hover:text-gray-800 rounded-t-md cursor-pointer px-2 laptop:px-4 py-2
    border-b-4 border-transparent hover:border-gray-800 dark:hover:bg-purple-1000 
    flex justify-center items-center space-x-2 dark:hover:text-white
`;

const Tabs: React.FC<IProps> = ({ username, isOwnProfile, followersCount, followingCount }) => {
    const { pathname } = useLocation();
    const [activeNav, setActiveNav] = useState('');

    useEffect(() => {
        const splitPath = pathname.split('/');
        const currentNav = splitPath[splitPath.length - 1];

        setActiveNav(currentNav);
    }, [pathname]);

    return (
        <ul className="flex items-center justify-between tablet:justify-evenly flex-wrap laptop:justify-start space-x-1 laptop:space-x-4 px-4 bg-gray-100 dark:bg-purple-1000 laptop:dark:bg-transparent laptop:bg-transparent laptop:p-0">
            <li>
                <Link
                    to={`/user/${username}/`}
                    className={`${linkStyleName} ${(activeNav === username || activeNav === '') && 'border-gray-700 dark:border-purple-400  border-b-4 text-gray-800 dark:text-white '}`}
                >
                    <span className="hidden laptop:inline-block">Posts</span>
                    <FormOutlined className="laptop:hidden flex items-center justify-center text-2xl" />
                </Link>
            </li>
            <li>
                <Link
                    to={`/user/${username}/info`}
                    className={`${linkStyleName} ${activeNav === 'info' && 'border-gray-700 dark:border-purple-400  border-b-4'}`}
                >
                    <span className="hidden laptop:inline-block">Info</span>
                    <InfoCircleOutlined className="laptop:hidden flex items-center justify-center text-2xl" />
                </Link>
            </li>
            <li>
                <Link
                    to={`/user/${username}/followers`}
                    className={`${linkStyleName} ${activeNav === 'followers' && 'border-gray-700 dark:border-purple-400 border-b-4'}`}
                >
                    <span className="laptop:text-lg text-gray-700 dark:text-gray-400">{followersCount}</span>
                    <span className="hidden laptop:inline-block">{followersCount > 1 ? 'Followers' : 'Follower'}</span>
                    <TeamOutlined className="laptop:hidden flex items-center justify-center text-2xl" />
                </Link>
            </li>
            <li>
                <Link
                    to={`/user/${username}/following`}
                    className={`${linkStyleName} ${activeNav === 'following' && 'border-gray-700 dark:border-purple-400 border-b-4'}`}
                >
                    <span className="laptop:text-lg text-gray-700 dark:text-gray-400">{followingCount}</span>
                    <span className="hidden laptop:inline-block">Following</span>
                    <UserAddOutlined className="laptop:hidden flex items-center justify-center text-2xl" />
                </Link>
            </li>
            {isOwnProfile && (
                <li>
                    <Link
                        to={`/user/${username}/bookmarks`}
                        className={`${linkStyleName} ${activeNav === 'bookmarks' && 'border-gray-700 dark:border-purple-400 border-b-4'}`}
                    >
                        <span className="hidden laptop:inline-block">Bookmarks</span>
                        <StarOutlined className="laptop:hidden flex items-center justify-center text-2xl" />
                    </Link>
                </li>
            )}
        </ul>
    );
};

export default Tabs;
