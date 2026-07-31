"use client";

import Image from "next/image";
import { formatCallTime } from "@/lib/utils/formatCallTime";
import {
    Phone,
    Video,
    ArrowDownLeft,
    ArrowUpRight,
} from "lucide-react";

interface Props {
    call: any;
    currentUserId: string;
    onCallAgain: (userId: string, type: "audio" | "video") => void
}

export default function CallCard({
    call,
    currentUserId,
    onCallAgain
}: Props) {
    const outgoing = call.caller._id === currentUserId;

    const otherUser = outgoing
        ? call.receiver
        : call.caller;

    return (
        <div className="flex items-center justify-between rounded-xl p-4 transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer">
            <div className="flex items-center gap-3">

                <Image
                    src={otherUser.image || "/avatar.png"}
                    alt={otherUser.name}
                    width={52}
                    height={52}
                    className="h-13 w-13 rounded-full border object-cover"
                />

                <div>

                    <h2 className="text-[15px] font-semibold">
                        {otherUser.name}
                    </h2>

                    <div className="mt-1 flex items-center gap-1.5 text-xs">
                        {
                            call.status === "missed" ? (
                                <ArrowDownLeft
                                    size={16}
                                    className="text-red-500"
                                />
                            ) : outgoing ? (
                                <ArrowUpRight
                                    size={16}
                                    className="text-green-500"
                                />
                            ) : (
                                <ArrowDownLeft
                                    size={16}
                                    className="text-blue-500"
                                />
                            )
                        }
                        <span
                            className={
                                call.status === "missed"
                                    ? "text-red-500"
                                    : call.status === "answered"
                                        ? "text-green-500"
                                        : "text-orange-500"
                            }
                        >
                            {call.status}
                        </span>

                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">

                <div className="text-right">
                    <p className="text-xs text-gray-500">
                        {formatCallTime(call.createdAt)}
                    </p>

                    <p className="text-xs text-gray-400">
                        {call.duration >= 60
                            ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s`
                            : `${call.duration}s`}
                    </p>
                </div>
                <button
                    className="rounded-full p-2 transition hover:bg-green-100 dark:hover:bg-zinc-800"
                    onClick={() =>
                        onCallAgain(otherUser._id, call.type)
                    }
                >
                    {call.type === "video" ? (
                        <Video
                            className="text-green-600"
                            size={20}
                        />
                    ) : (
                        <Phone
                            className="text-green-600"
                            size={20}
                        />
                    )}
                </button>
            </div>
        </div>
    );
}