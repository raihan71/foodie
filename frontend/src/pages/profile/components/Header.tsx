import { CameraOutlined, EditOutlined, MessageOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import FollowButton from '~/components/main/FollowButton';
import CropProfileModal from '~/components/main/Modals/CropProfileModal';
import Loader from '~/components/shared/Loader';
import useFileHandler from '~/hooks/useFileHandler';
import useModal from '~/hooks/useModal';
import avatar_placeholder from '~/images/avatar_placeholder.png';
import { updateAuthPicture } from '~/redux/action/authActions';
import { initiateChat } from '~/redux/action/chatActions';
import { updateCoverPhoto, updateProfilePicture } from '~/redux/action/profileActions';
import { uploadPhoto } from '~/services/api';
import { IImage, IProfile, IUser } from "~/types/types";
import Tabs from './Tabs';

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
            console.log(e);
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
                console.log(e);
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
            <div className="w-full h-60 mb-8 laptop:mb-0 laptop:h-80 bg-gray-200 relative overflow-hidden" ref={coverPhotoRef}>
                {/* ---- OVERLAY FOR CHOOSING PHOTO AND SHOWING LOADER ----- */}
                <div
                    className="w-full h-full laptop:bg-black bg-opacity-50 absolute flex items-center justify-center laptop:invisible transition-all"
                    ref={coverPhotoOverlayRef}
                >
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={coverPhoto.onFileChange}
                        readOnly={isUploadingCoverPhoto}
                        id="cover"
                    />
                    {profile.isOwnProfile && (
                        <>
                            {isUploadingCoverPhoto ? <Loader mode="light" /> : (
                                <>
                                    {coverPhoto.imageFile.file ? (
                                        <div className="flex">
                                            <label
                                                className="button--muted !rounded-full cursor-pointer"
                                                htmlFor="cover"
                                            >
                                                Choose another photo
                                    </label>
                                    &nbsp;
                                            <button onClick={handleSaveCoverPhoto}>Save Cover Photo</button>
                                        </div>
                                    ) : (
                                            <label
                                                className="p-3 laptop:p-4 bg-indigo-700 absolute right-4 top-4  laptop:relative text-white font-medium rounded-full cursor-pointer hover:bg-indigo-800"
                                                htmlFor="cover"
                                            >
                                                {window.screen.width > 800 ? 'Change Cover Photo' : (
                                                    <CameraOutlined className="text-xl flex items-center justify-center text-white" />
                                                )}
                                            </label>

                                        )}
                                </>
                            )}
                        </>
                    )}

                </div>
                {/* ---- ACTUAL COVER PHOTO ---- */}
                <img
                    alt=""
                    className="w-full h-full object-cover"
                    src={coverPhoto.imageFile.url || profile.coverPhoto || `https://source.unsplash.com/1400x900/?nature`}
                />
            </div>
            <div className="contain w-full relative flex laptop:transform laptop:-translate-y-2/4">
                {/* --- PROFILE PICTURE */}
                {!coverPhoto.imageFile.file && (
                    <div className="absolute left-0 right-0 mx-auto w-40 h-40 transform -translate-y-44 laptop:transform-none laptop:relative laptop:w-1/3 laptop:h-60 laptop:mr-2 flex justify-center">
                        <div

                            className="w-full h-full laptop:w-60 laptop:h-60 !bg-cover !bg-no-repeat rounded-full border-4 border-white overflow-hidden"
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
                                    <div className="flex items-center w-10 h-10 justify-center cursor-pointer p-4 bg-indigo-700 rounded-full absolute -bottom-2 laptop:bottom-0 left-14 hover:bg-indigo-800">
                                        <CameraOutlined className="text-xl flex items-center justify-center text-white" />
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>
                )}
                <div className="flex w-full  flex-col self-end">
                    <div className="w-full flex items-center flex-col laptop:flex-row justify-between mb-2 laptop:ml-2 laptop:mr-14">
                        {/* ---- NAME AND USERNAME */}
                        <div className="text-center laptop:text-left mb-4 laptop:mb-0">
                            <h2 className="text-3xl">{profile.fullname || `@${profile.username}`}</h2>
                            <span className="text-indigo-700">{profile.fullname && `@${profile.username}`}</span>
                        </div>
                        {/* ---- FOLLOW/UNFOLLOW/MESSAGE BUTTON */}
                        {!profile.isOwnProfile ? (
                            <div className="flex justify-center laptop:justify-start space-x-4 items-start">
                                <FollowButton isFollowing={profile.isFollowing} userID={profile.id} />
                                <button
                                    className="button--muted !border-gray-400 !rounded-full flex items-center"
                                    onClick={onClickMessage}
                                >
                                    <MessageOutlined className="flex items-center justify-center mr-2" />
                                    Message
                                </button>
                            </div>
                        ) : (
                                <button
                                    className="button--muted !rounded-full !border !border-gray-400 !focus:bg-gray-200 !py-2 flex items-center justify-center"
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
