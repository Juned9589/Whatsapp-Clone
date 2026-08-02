"use client";

interface NewChatModalProps {
    open: boolean;
    onClose: () => void;
    users: any[];
    onSelectUser: (user: any) => void;
    currentUser: any
}

export default function NewChatModal({
    open,
    onClose,
    users,
    onSelectUser,
    currentUser
}: NewChatModalProps) {
    if (!open) return null;
    console.log("Current User:", currentUser);
    console.log("Users:", users);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-[#121D1C] p-5">

                <h2 className="mb-4 text-xl font-semibold text-white">
                    Start New Chat
                </h2>

                <div className="max-h-96 overflow-y-auto">
                    {users.filter((user) => user._id !== currentUser?._id).map((user) => (

                        <button
                            key={user._id}
                            onClick={() => onSelectUser(user)}
                            className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-[#1E2E2C]"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-black font-bold">
                                {user.name.charAt(0)}
                            </div>

                            <span className="text-white">
                                {user.name}
                            </span>
                        </button>

                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 w-full rounded-lg bg-[#25D366] py-2 font-medium text-black"
                >
                    Close
                </button>

            </div>
        </div>
    );
}