"use client"

import { useQuery } from "@tanstack/react-query"
import { getCalls } from "@/lib/services/call.service"
import CallCard from "./CallCard"

interface CallListProps {
    currentUserId: string;
    onCallAgain: (
        userId: string,
        type: "audio" | "video"
    ) => void;
}

export default function CallList({
    currentUserId,
    onCallAgain
}: CallListProps) {
    const { data: calls = [], isLoading } = useQuery({
        queryKey: ["calls"],
        queryFn: getCalls
    })

    if (isLoading) {
        return <p>Loading..</p>
    }

    if (!calls.length) {
        return (
            <div className="flex h-full items-center justify-center text-gray-500">
                No Calls Yet
            </div>
        );
    }

    function getDateLabel(date: string) {
        const today = new Date();
        const callDate = new Date(date);

        const diff =
            today.setHours(0, 0, 0, 0) -
            callDate.setHours(0, 0, 0, 0);

        const oneDay = 24 * 60 * 60 * 1000;

        if (diff === 0) return "Today";

        if (diff === oneDay) return "Yesterday";

        return callDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
        });
    }

    return (
        <div className="flex flex-col">
            {
                calls.map((call: any, index: number) => {
                    const currentDate = getDateLabel(call.createdAt);

                    const previousDate =
                        index > 0
                            ? getDateLabel(calls[index - 1].createdAt)
                            : "";

                    return (
                        <div key={call._id}>
                            {currentDate !== previousDate && (
                                <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2 text-xs font-semibold text-gray-500">
                                    {currentDate}
                                </div>
                            )}

                            <CallCard
                                call={call}
                                currentUserId={currentUserId}
                                onCallAgain={onCallAgain}
                            />
                        </div>
                    );
                })
            }

        </div>
    )
}