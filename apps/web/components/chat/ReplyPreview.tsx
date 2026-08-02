"use client";

import { X } from "lucide-react";

interface ReplyPreviewProps {
    replyMessage: any;
    onCancel: () => void;
}

export default function ReplyPreview({
    replyMessage,
    onCancel,
}: ReplyPreviewProps) {
    if (!replyMessage) return null;

    return (
        <div className="mb-2 flex items-start justify-between rounded-lg border-l-4 border-[#2DD4A7] bg-[#121D1C] p-3">
            <div className="overflow-hidden">
                <p className="text-sm font-semibold text-[#2DD4A7]">
                    {replyMessage.sender?.name || "Unknown"}
                </p>

                <p className="truncate text-sm text-[#EAF6F2]">
                    {replyMessage.content}
                </p>
            </div>

            <button onClick={onCancel}>
                <X size={18} className="text-[#7FA69B]" />
            </button>
        </div>
    );
}