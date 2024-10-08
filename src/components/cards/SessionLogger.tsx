import Button from "../button/Button";

const SessionTimeoutModal = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 p-5">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">Session Timeout</h2>
                <p className="mb-4">Your session has expired. Please Login to Continue</p>
                <div className="flex justify-end">
                    <Button
                        size="md"
                        theme="primary"
                        type="button"
                        >
                        <span>Login to continue</span>
                   </Button>

                </div>
            </div>
        </div>
    );
};

export default SessionTimeoutModal;
