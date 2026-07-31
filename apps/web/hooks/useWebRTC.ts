import { useRef, useState } from "react";

export function useWebRTC() {
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [isMicEnabled, setIsMicEnabled] = useState(true);

  const toggleMicrophone = () => {
    if (!localStream) return;

    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsMicEnabled(track.enabled);
    });
  };

  const [isCameraEnabled, setIsCameraEnabled] = useState(true);

  const toggleCamera = () => {
    if (!localStream) return;

    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsCameraEnabled(track.enabled);
    });
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    peerConnection.current = pc;

    return pc;
  };

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(() => {});
      }

      return stream;
    } catch (error) {
      console.error("Failed to access camera/microphone:", error);
      throw error;
    }
  };

  const addLocalTracks = (stream: MediaStream) => {
    if (!peerConnection.current) {
      throw new Error("Peer connection is not initialized");
    }

    stream.getTracks().forEach((track) => {
      peerConnection.current!.addTrack(track, stream);
    });
  };

  const createOffer = async () => {
    if (!peerConnection.current) {
      throw new Error("Peer conncetion is not initialized");
    }
    const offer = await peerConnection.current.createOffer();

    await peerConnection.current.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnection.current) {
      throw new Error("Peer connection not initialized");
    }
    await peerConnection.current.setRemoteDescription(offer);
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnection.current) {
      throw new Error("Peer connection not initialized");
    }

    await peerConnection.current.setRemoteDescription(answer);
  };

  const registerIceCandidateHandler = (
    sendCandidate: (candidate: RTCIceCandidate) => void,
  ) => {
    if (!peerConnection.current) return;

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        sendCandidate(event.candidate);
      }
    };
  };

  const addIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnection.current) return;

    await peerConnection.current.addIceCandidate(
      new RTCIceCandidate(candidate),
    );
  };

  const registerTrackHandler = () => {
    if (!peerConnection.current) return;
    peerConnection.current.ontrack = (event) => {
      console.log("Remote stream received", event.streams);
      const stream = event.streams[0];

      setRemoteStream(stream);

      if (remoteVideoRef.current) {
        if (remoteVideoRef.current.srcObject !== stream) {
          remoteVideoRef.current.srcObject = stream;
        }
      }
    };
  };

  const closeConnection = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };
  return {
    peerConnection,
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    isMicEnabled,
    isCameraEnabled,
    startLocalStream,
    addLocalTracks,
    createOffer,
    createAnswer,
    registerIceCandidateHandler,
    addIceCandidate,
    registerTrackHandler,
    closeConnection,
    toggleMicrophone,
    toggleCamera,
    createPeerConnection,
    setRemoteAnswer,
  };
}
