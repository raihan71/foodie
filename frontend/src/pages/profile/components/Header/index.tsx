import { CameraOutlined, EditOutlined, MessageOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import FollowButton from '~/components/main/FollowButton';
import CropProfileModal from '~/components/main/Modals/CropProfileModal';
import Loader from '~/components/shared/Loader';
import Verified from '~/components/shared/Verified';
import useFileHandler from '~/hooks/useFileHandler';
import useModal from '~/hooks/useModal';
import avatar_placeholder from '~/images/avatar_placeholder.png';
import image from '~/images/cover/bg-profil.jpg';
import { updateAuthPicture } from '~/redux/action/authActions';
import { initiateChat } from '~/redux/action/chatActions';
import { updateCoverPhoto, updateProfilePicture } from '~/redux/action/profileActions';
import { uploadPhoto } from '~/services/api';
import { IImage, IProfile, IUser } from "~/types/types";
import Tabs from '../Tabs';
import CoverPhotoOverlay from './CoverPhotoOverlay';
interface IProps {
    profile: IProfile,
    auth: IUser;
}

const initImageState = { id: '', file: null, url: '' };

const Header: React.FC<IProps> = ({ profile, auth }) => {
    const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
    const [isUploadingCoverPhoto, setIsUploadingCoverPhoto] = useState(false);
    const history = useHistory();
    const { isOpen, openModal, closeModal } = useModal();
    const dispatch = useDispatch();
    const coverPhotoOverlayRef = useRef<HTMLDivElement | null>(null);
    const coverPhotoRef = useRef<HTMLDivElement | null>(null);
    const coverPhoto = useFileHandler<IImage>('single', initImageState);
    const profilePicture = useFileHandler<IImage>('single', initImageState);

    useEffect(() => {
        const cp = coverPhotoRef.current;
        const cpo = coverPhotoOverlayRef.current;

        if (cp && cpo && profile.isOwnProfile && window.screen.width > 800) {
            cp.addEventListener('mouseover', overlayOnMouseOver);
            cp.addEventListener('mouseout', overlayOnMouseOut);
        }

        return () => {
            if (cp && cpo) {
                cp.removeEventListener('mouseover', overlayOnMouseOver);
                cp.removeEventListener('mouseout', overlayOnMouseOut);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coverPhoto.imageFile.file, isUploadingCoverPhoto, profile.isOwnProfile]);

    const overlayOnMouseOver = () => {
        if (!isUploadingCoverPhoto && coverPhotoOverlayRef.current) {
            coverPhotoOverlayRef.current.style.visibility = 'visible';
        }
    }

    const overlayOnMouseOut = () => {
        if (!isUploadingCoverPhoto && !coverPhoto.imageFile.file && coverPhotoOverlayRef.current) {
            coverPhotoOverlayRef.current.style.visibility = 'hidden';
        }
    }

    const handleProfilePictureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        profilePicture.onFileChange(e, () => {
            openModal();
        });
    };

    const onCropSuccessCallback = async (file: File) => {
        const formData = new FormData();
        formData.append('photo', file);

        try {
            setIsUploadingProfileImage(true);
            toast('Uploading...', { hideProgressBar: true, bodyStyle: { color: '#1a1a1a' } });

            const imageUrl = await uploadPhoto(formData, 'picture');

            dispatch(updateProfilePicture(imageUrl));
            dispatch(updateAuthPicture(imageUrl));
            setIsUploadingProfileImage(false);

            toast.dismiss();
            toast.dark('Profile picture successfully changed.', { hideProgressBar: true });
        } catch (e) {
            setIsUploadingProfileImage(false);
            toast.error(e.error.message);
        }
    };

    const handleSaveCoverPhoto = async () => {
        if (coverPhoto.imageFile.file) {
            const formData = new FormData();
            formData.append('photo', coverPhoto.imageFile.file);

            try {
                setIsUploadingCoverPhoto(true);
                toast('Uploading Cover Photo...', { hideProgressBar: true, bodyStyle: { color: '#1a1a1a' } });

                const imageUrl = await uploadPhoto(formData, 'cover');

                dispatch(updateCoverPhoto(imageUrl));
                setIsUploadingCoverPhoto(false);

                coverPhoto.clearFiles();
                toast.dismiss();
                toast.dark('Cover photo successfully changed.', { hideProgressBar: true });
            } catch (e) {
                setIsUploadingCoverPhoto(false);
                toast.error(e.error.message);
            }
        }
    }

    const onClickMessage = () => {
        dispatch(initiateChat({
            username: profile.username,
            id: profile.id,
            fullname: profile.fullname || '',
            profilePicture: profile.profilePicture || ''
        }));

        if (window.screen.width < 1024) {
            history.push(`/chat/${profile.username}`);
        }
    }

    return (
        <div>
            <CropProfileModal
                isOpen={isOpen}
                closeModal={closeModal}
                openModal={openModal}
                file={profilePicture.imageFile}
                onCropSuccessCallback={onCropSuccessCallback}
            />
            {/*  ----- COVER PHOTO ------- */}
            <div className="w-full h-60 mb-8 laptop:mb-0 laptop:h-80 bg-gray-200 dark:bg-gray-800 relative overflow-hidden" ref={coverPhotoRef}>
                {/* ---- OVERLAY FOR CHOOSING PHOTO AND SHOWING LOADER ----- */}
                <CoverPhotoOverlay
                    coverPhotoOverlayRef={coverPhotoOverlayRef}
                    coverPhoto={coverPhoto}
                    isUploadingCoverPhoto={isUploadingCoverPhoto}
                    isOwnProfile={profile.isOwnProfile}
                    handleSaveCoverPhoto={handleSaveCoverPhoto}
                />
                {/* ---- ACTUAL COVER PHOTO ---- */}
                <img
                    alt=""
                    className="w-full h-full object-cover"
                    src={coverPhoto.imageFile.url || profile.coverPhoto || image}
                />
            </div>
            <div className="laptop:px-6% w-full relative flex mt-2 laptop:transform laptop:-translate-y-2/4">
                {/* --- PROFILE PICTURE */}
                <div className="absolute left-0 right-0 mx-auto w-40 h-40 transform -translate-y-44 laptop:transform-none laptop:relative laptop:w-1/3 laptop:h-60 laptop:mr-2 flex justify-center">
                    {(!coverPhoto.imageFile.file) && (
                        <>
                            <div

                                className="w-full h-full laptop:w-60 laptop:h-60 !bg-cover !bg-no-repeat rounded-full border-4 border-white dark:border-purple-1000 overflow-hidden"
                                style={{
                                    background: `#f7f7f7 url(${profile.profilePicture || avatar_placeholder})`
                                }}
                            >
                                {isUploadingProfileImage && (
                                    <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                                        <Loader mode="light" />
                                    </div>
                                )}
                            </div>
                            {/* ---- UPDLOAD PROFILE PICTURE ---- */}
                            {profile.isOwnProfile && (
                                <div>
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleProfilePictureFileChange}
                                        readOnly={isUploadingProfileImage}
                                        id="picture"
                                    />
                                    <label
                                        htmlFor="picture"
                                    >
                                        <div className="flex items-center w-10 h-10 justify-center cursor-pointer p-4 bg-gray-700 rounded-full absolute -bottom-2 laptop:bottom-0 left-14 hover:bg-gray-800">
                                            <CameraOutlined className="text-xl flex items-center justify-center text-white" />
                                        </div>
                                    </label>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className="flex w-full  flex-col self-end">
                    <div className="px-4 laptop:px-0 w-full flex items-center flex-col laptop:flex-row justify-between mb-2 laptop:ml-2 laptop:mr-14">
                        {/* ---- NAME AND USERNAME */}
                        <div className="text-center laptop:text-left mb-4 laptop:mb-0">
                            <h2 className="text-3xl dark:text-white">
                                {profile.fullname || (
                                    <span className="mr-1">
                                    {`@${profile.username}`}{profile.isVerified && <Verified />}
                                    </span>
                                )}
                            </h2>
                            <span className="text-gray-700 dark:text-gray-400">
                                <span className="mr-1">{profile.fullname && `@${profile.username}`}</span>
                                {profile.isVerified && (<Verified />)}
                            </span>
                        </div>
                        {/* ---- FOLLOW/UNFOLLOW/MESSAGE BUTTON */}
                        {!profile.isOwnProfile ? (
                            <div className="flex justify-center laptop:justify-start space-x-4 items-start">
                                <FollowButton isFollowing={profile.isFollowing} userID={profile.id} />
                                <button
                                    className="button--muted !border-gray-400 !rounded-full flex items-center dark:bg-purple-1100 dark:text-white dark:hover:text-white dark:hover:bg-purple-900 dark:!border-gray-800"
                                    onClick={onClickMessage}
                                >
                                    <MessageOutlined className="flex items-center justify-center mr-2" />
                                    Message
                                </button>
                            </div>
                        ) : (
                                <button
                                    className="button--muted !rounded-full !border !border-gray-400 !focus:bg-gray-200 !py-2 flex items-center justify-center dark:bg-purple-1100 dark:text-white dark:hover:text-white dark:hover:bg-purple-900 dark:!border-gray-800"
                                    onClick={() => history.push(`/user/${profile.username}/edit`)}
                                >
                                    <EditOutlined className="text-xl mr-4" />
                                    Edit Profile
                                </button>
                            )}
                    </div>
                    {/* ---- PROFILE NAVS ----- */}
                    <Tabs
                        username={profile.username}
                        isOwnProfile={profile.id === auth.id}
                        followersCount={profile.followersCount}
                        followingCount={profile.followingCount}
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;
