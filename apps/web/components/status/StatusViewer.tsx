"use client";

import { formatDistanceToNow } from "date-fns";

interface StatusViewerProps {
    viewingStatus: any;
    setViewingStatus: (status: any) => void;
}

export default function StatusViewer({
    viewingStatus,
    setViewingStatus,
}: StatusViewerProps) {
    if (!viewingStatus) return null;
    console.log(viewingStatus)
    return (
        <>
            {(
                <div
                    className="fixed inset-0 bg-black flex items-center justify-center z-50"
                    onClick={() => setViewingStatus(null)}
                >
                    <div className="max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 rounded-full bg-[#2DD4A7] flex items-center justify-center text-black font-bold">
                                {viewingStatus.userId.name || "Unknown".charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                                <p className="text-[#EAF6F2] font-medium">{viewingStatus.userId.name}</p>
                                <p className="text-xs text-[#7FA69B]">
                                    {formatDistanceToNow(new Date(viewingStatus.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                        <img
                            src={`https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${viewingStatus.mediaUrl}`}
                            alt="status"
                            className="w-full rounded-lg"
                        />
                        {viewingStatus.caption && (
                            <p className="text-[#EAF6F2] text-center mt-3">{viewingStatus.caption}</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}