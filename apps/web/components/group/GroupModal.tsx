"use client";

interface GroupModalProps {
    show: boolean;

    groupName: string;
    setGroupName: React.Dispatch<React.SetStateAction<string>>;

    selectedMembers: string[];
    setSelectedMembers: React.Dispatch<
        React.SetStateAction<string[]>
    >;

    usersData: any;

    onClose: () => void;
    onCreate: () => void;
}

export default function GroupModal({
    show,
    groupName,
    setGroupName,
    selectedMembers,
    setSelectedMembers,
    usersData,
    onClose,
    onCreate,
}: GroupModalProps) {
    if (!show) return null;

    return (
        <>
            return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-full max-w-sm rounded-2xl bg-[#121D1C] p-6">
                    <h2 className="mb-4 text-lg font-bold text-[#EAF6F2]">
                        Create Group
                    </h2>

                    <input
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Group name"
                        className="mb-4 w-full rounded-lg border border-[#1E2E2C] bg-[#0B1414] px-3 py-2 text-[#EAF6F2]"
                    />

                    <div className="mb-4 max-h-48 space-y-2 overflow-y-auto">
                        {usersData?.users?.map((user: any) => (
                            <label
                                key={user._id}
                                className="flex items-center gap-2 text-[#EAF6F2]"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedMembers.includes(user._id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedMembers((prev) => [
                                                ...prev,
                                                user._id,
                                            ]);
                                        } else {
                                            setSelectedMembers((prev) =>
                                                prev.filter((id) => id !== user._id)
                                            );
                                        }
                                    }}
                                />

                                {user.name}
                            </label>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-lg bg-[#1E2E2C] py-2 text-[#EAF6F2]"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onCreate}
                            className="flex-1 rounded-lg bg-[#2DD4A7] py-2 font-medium text-[#0B1414]"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
            );
        </>
    );
}