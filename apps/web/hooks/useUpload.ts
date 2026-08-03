"use client";

interface UseUploadProps {
  socketRef: any;
  selectedChat: any;
}

export function useUpload({ socketRef, selectedChat }: UseUploadProps) {
  async function handleFileUpload(file: File) {
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

      const fileType = file.type.startsWith("image/") ? "image" : "document";

      socketRef.current?.emit("message:send", {
        chatId: selectedChat._id,
        content: key,
        type: fileType,
      });
    } catch (error) {
      console.error("File upload error:", error);
    }
  }

  return {
    handleFileUpload,
  };
}
