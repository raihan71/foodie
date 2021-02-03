import { CheckOutlined, UserAddOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import useDidMount from "~/hooks/useDidMount";
import { followUser, unfollowUser } from "~/services/api";

interface IProps {
    isFollowing: boolean;
    userID: string;
    size?: string;
}

const FollowButton: React.FC<IProps> = (props) => {
    const [isFollowing, setIsFollowing] = useState(props.isFollowing);
    const [isLoading, setLoading] = useState(false);
    const didMount = useDidMount();

    useEffect(() => {
        setIsFollowing(props.isFollowing);
    }, [props.isFollowing])

    const dispatchFollow = async () => {
        try {
            setLoading(true);
            if (isFollowing) {
                const result = await unfollowUser(props.userID);
                didMount && setIsFollowing(result.state);
            } else {
                const result = await followUser(props.userID);
                didMount && setIsFollowing(result.state);
            }

            didMount && setLoading(false);
        } catch (e) {
            didMount && setLoading(false);
            
        }
    };

    return (
        <button
            className={`${isFollowing && 'bg-gray-100 hover:bg-gray-200 !border !border-gray-500 text-gray-700 dark:bg-purple-500 dark:text-white dark:hover:bg-purple-600 dark:hover:text-white'} ${!isFollowing && 'bg-gray-700 hover:bg-gray-800 !border !border-gray-500 text-white dark:bg-purple-500 dark:hover:bg-purple-600'} flex items-center ${props.size === 'sm' && '!py-2 !px-3 !text-sm'}`}
            disabled={isLoading}
            onClick={dispatchFollow}
        >
            {isFollowing ? <CheckOutlined /> : <UserAddOutlined />}
                &nbsp;&nbsp;
            <span className={`${props.size === 'sm' && 'text-sm'}`}>
                {isLoading
                    ? 'Following'
                    : !isLoading && !isFollowing
                        ? 'Follow'
                        : 'Following'}
            </span>
        </button>
    );
};

export default FollowButton;
