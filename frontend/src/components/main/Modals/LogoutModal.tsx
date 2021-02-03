import { CloseOutlined } from '@ant-design/icons';
import Modal from 'react-modal';
import { IError } from '~/types/types';

interface IProps {
    isOpen: boolean;
    onAfterOpen?: () => void;
    closeModal: () => void;
    openModal: () => void;
    dispatchLogout: () => void;
    isLoggingOut: boolean;
    error: IError;
}

Modal.setAppElement('#root');

const LogoutModal: React.FC<IProps> = (props) => {
    const onCloseModal = () => {
        if (!props.isLoggingOut) {
            props.closeModal();
        }
    }

    return (
        <Modal
            isOpen={props.isOpen}
            onAfterOpen={props.onAfterOpen}
            onRequestClose={props.closeModal}
            contentLabel="Example Modal"
            className="modal"
            shouldCloseOnOverlayClick={!props.isLoggingOut}
            overlayClassName="modal-overlay"
        >
            <div className="relative">
                <div
                    className="absolute right-2 top-2 p-1 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-purple-1100"
                    onClick={onCloseModal}
                >
                    <CloseOutlined className="p-2  outline-none text-gray-500 dark:text-white" />
                </div>
                {props.error && (
                    <span className="p-4 bg-red-100 text-red-500 block">
                        {props.error?.error?.message || 'Unable to process your request.'}
                    </span>
                )}
                <div className="p-4 laptop:px-8">
                    <h2 className="dark:text-white">Confirm Logout</h2>
                    <p className="text-gray-600 my-4 dark:text-gray-400">Are you sure you want to logout?</p>
                    <div className="flex justify-between">
                        <button
                            className="button--danger !rounded-full dark:text-white dark:hover:text-white"
                            onClick={props.closeModal}
                            disabled={props.isLoggingOut}
                        >
                            Cancel
                        </button>
                        <button
                            className="button--muted !rounded-full"
                            disabled={props.isLoggingOut}
                            onClick={props.dispatchLogout}
                        >
                            {props.isLoggingOut ? 'Logging Out' : 'Logout'}
                        </button>
                    </div>
                </div>
            </div>

        </Modal>
    );
};

export default LogoutModal;
