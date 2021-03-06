import { StarOutlined, TeamOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Avatar from "~/components/shared/Avatar";

interface IProps {
    username: string;
    profilePicture?: string;
}

const SideMenu: React.FC<IProps> = ({ username, profilePicture }) => {
    return (
        <ul className="overflow-hidden">
            <li className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-purple-900">
                <Link to={`/user/${username}`} className="flex items-center text-black">
                    <Avatar url={profilePicture} className="mr-4" />
                    <h6 className="text-sm dark:text-white">My Profile</h6>
                </Link>
            </li>
            <li className="px-4 py-3 cursor-pointer mt-4 hover:bg-gray-100  dark:hover:bg-purple-900">
                <Link to={`/user/${username}/following`} className="flex items-center text-black">
                    <TeamOutlined className="text-gray-700 dark:text-gray-400" style={{ fontSize: '30px', marginRight: '25px' }} />
                    <h6 className="text-sm dark:text-white">Following</h6>
                </Link>
            </li>
            <li className="px-4 py-3 cursor-pointer mt-4 hover:bg-gray-100  dark:hover:bg-purple-900">
                <Link to={`/user/${username}/followers`} className="flex items-center text-black">
                    <TeamOutlined className="text-gray-700 dark:text-gray-400" style={{ fontSize: '30px', marginRight: '25px' }} />
                    <h6 className="text-sm dark:text-white">Followers</h6>
                </Link>
            </li>
            <li className="px-4 py-3 cursor-pointer mt-4 hover:bg-gray-100  dark:hover:bg-purple-900">
                <Link to={`/user/${username}/bookmarks`} className="flex items-center text-black">
                    <StarOutlined className="text-gray-700 dark:text-gray-400" style={{ fontSize: '30px', marginRight: '25px' }} />
                    <h6 className="text-sm dark:text-white">Bookmarks</h6>
                </Link>
            </li>
            <li className="px-4 py-3 cursor-pointer mt-4 hover:bg-gray-100  dark:hover:bg-purple-900">
                <Link to={{ pathname: "http://codevcast.com/" }} target="_blank" className="flex items-center text-black">
                    <PlayCircleOutlined className="text-gray-700 dark:text-gray-400" style={{ fontSize: '30px', marginRight: '25px' }} />
                    <h6 className="text-sm dark:text-white">Podcast</h6>
                </Link>
            </li>
        </ul>
    )
};

export default SideMenu;
