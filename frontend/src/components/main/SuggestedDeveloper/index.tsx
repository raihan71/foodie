import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "~/components/shared/Avatar";
import { UserLoader } from "~/components/shared/Loaders";
import Verified from "~/components/shared/Verified";
import { SUGGESTED_DEVELOPER } from "~/constants/routes";
import { getSuggestedDeveloper } from "~/services/api";
import { IError, IProfile } from "~/types/types";
import FollowButton from "../FollowButton";

const SuggestedDeveloper: React.FC = () => {
    const [developer, setDeveloper] = useState<IProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<IError | null>(null);

    useEffect(() => {
        (async function () {
            try {
                setIsLoading(true);
                const users = await getSuggestedDeveloper({ offset: 0, limit: 6 });

                setDeveloper(users);
                setIsLoading(false);
            } catch (e) {
                setIsLoading(false);
                setError(e);
            }
        })();
    }, []);

    return (
        <div className="w-full py-4 bg-white dark:bg-purple-1000 rounded-md shadow-lg overflow-hidden">
            <div className="px-4 flex justify-between mb-4">
                <h4 className="dark:text-white">Suggested Developer</h4>
                <Link to={SUGGESTED_DEVELOPER} className="text-xs underline dark:text-gray-500">See all</Link>
            </div>
            {isLoading && (
                <div className="min-h-10rem px-4">
                    <UserLoader />
                    <UserLoader />
                    <UserLoader />
                    <UserLoader />
                </div>
            )}
            {(!isLoading && error) && (
                <div className="flex min-h-10rem items-center justify-center">
                    <span className="text-gray-400 italic">
                        {(error as IError)?.error?.message || 'Something went wrong :('}
                    </span>
                </div>
            )}
            {!error && developer.map((user) => (
                <div className="mb-2" key={user.id || user._id}>
                    <div className="relative flex items-center justify-between px-4 py-2">
                        <Link to={`/user/${user.username}`}>
                            <div className="flex items-center">
                                <Avatar url={user.profilePicture} className="mr-2" />
                                <div className="flex items-center">
                                    <h6 className="mr-1 text-sm overflow-ellipsis overflow-hidden dark:text-white">{user.username}
                                    </h6>
                                    {user?.isVerified && (<Verified />)}
                                </div>
                            </div>
                        </Link>
                        <div className="absolute px-4 bg-white dark:bg-purple-1000 right-0 top-0 bottom-0 my-auto flex items-center">
                            <FollowButton
                                userID={user.id || user._id}
                                isFollowing={user.isFollowing}
                                size="sm"
                            />
                        </div>
                    </div>
                </div>
            )
            )}
        </div>
    );
};

export default SuggestedDeveloper;
