"use client";

interface UseStatusProps {
  createStatus: any;
  queryClient: any;
}

export function useStatus({ createStatus, queryClient }: UseStatusProps) {
  async function handleStatusUpload(file: File) {
    try {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      const { uploadUrl, key } = await presignRes.json();

      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      createStatus.mutate(
        {
          mediaUrl: key,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["statuses"],
            });
          },
        },
      );
    } catch (error) {
      console.error("Status upload error:", error);
    }
  }

  return {
    handleStatusUpload,
  };
}
