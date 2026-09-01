"use client";

interface MessageContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onReply: () => void;
    onReact: () => void;
    onCopy: () => void;
    onForward: () => void;
    onDelete: () => void;
}

export default function MessageContextMenu({
    x,
    y,
    onClose,
    onReply,
    onReact,
    onCopy,
    onForward,
    onDelete,
}: MessageContextMenuProps) {
    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />

            {/* Menu */}
            <div
                className="fixed z-50 w-52 overflow-hidden rounded-xl border border-[#2DD4A7]/20 bg-[#121D1C] shadow-2xl"
                style={{
                    top: y,
                    left: x,
                }}
            >
                <button
                    onClick={() => {
                        onReact();
                        onClose();
                    }}
                    className="w-full px-4 py-3 text-left text-white hover:bg-[#1E2E2C]"
                >
                    😀 React
                </button>

                <button
                    onClick={onReply}
                    className="w-full px-4 py-3 text-left text-white hover:bg-[#1E2E2C]"
                >
                    ↩️ Reply
                </button>

                <button
                    onClick={onCopy}
                    className="w-full px-4 py-3 text-left text-white hover:bg-[#1E2E2C]"
                >
                    📋 Copy
                </button>

                <button
                    onClick={onForward}
                    className="w-full px-4 py-3 text-left text-white hover:bg-[#1E2E2C]"
                >
                    📤 Forward
                </button>

                <button
                    onClick={onDelete}
                    className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10"
                >
                    🗑️ Delete
                </button>
            </div>
        </>
    );
}