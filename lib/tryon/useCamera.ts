"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CameraStatus = "idle" | "requesting" | "live" | "denied" | "unsupported";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(
    async (mode: "user" | "environment" = facingMode) => {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setStatus("unsupported");
        return;
      }
      setStatus("requesting");
      stop();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setFacingMode(mode);
        setStatus("live");
      } catch {
        setStatus("denied");
      }
    },
    [facingMode, stop],
  );

  const flip = useCallback(() => {
    start(facingMode === "user" ? "environment" : "user");
  }, [facingMode, start]);

  useEffect(() => () => stop(), [stop]);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas;
  }, [facingMode]);

  return { videoRef, status, facingMode, start, stop, flip, captureFrame };
}
