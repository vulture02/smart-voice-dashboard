"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { CoachingExpert } from "@/services/Option";
import { UserButton } from "@stackframe/stack";
import { useQuery } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

let RecordRTC = null;
if (typeof window !== "undefined") {
  RecordRTC = require("recordrtc");
}

function DiscussionRoom() {
  const { roomid } = useParams();
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });

  const [expert, setExpert] = useState();
  const [enableMic, setEnableMiC] = useState(false);
  const recorder = useRef(null);
  const silenceTimeout = useRef(null);

  useEffect(() => {
    if (DiscussionRoomData) {
      const Expert = CoachingExpert.find(
        (item) => item.name === DiscussionRoomData.expertName
      );
      setExpert(Expert);
    }
  }, [DiscussionRoomData]);

  const connectToServer = () => {
    if (!RecordRTC) return;

    setEnableMiC(true);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        recorder.current = new RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/webm",
          recorderType: RecordRTC.StereoAudioRecorder,
          timeSlice: 250,
          desiredSampRate: 16000,
          numberOfAudioChannels: 1,
          bufferSize: 4096,
          audioBitsPerSecond: 128000,
          ondataavailable: async (blob) => {
            clearTimeout(silenceTimeout.current);

            const buffer = await blob.arrayBuffer();
            console.log("Audio Buffer:", buffer);

            silenceTimeout.current = setTimeout(() => {
              console.log("User stopped talking");
            }, 2000);
          },
        });

        recorder.current.startRecording();
        console.log("Recorder started:", recorder.current);
      })
      .catch((err) => console.error("Microphone access error:", err));
  };

  const disconnect = () => {
    if (recorder.current && recorder.current.pauseRecording) {
      recorder.current.pauseRecording();
      recorder.current = null;
    }
    setEnableMiC(false);
  };

  return (
    <div className="-mt-12">
      <h2 className="text-lg font-bold">
        {DiscussionRoomData?.coachingOption}
      </h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="lg:col-span-2 h-[60vh] bg-sidebar-border rounded-4xl flex flex-col items-center justify-center relative">
            <Image
              src={expert?.avatar}
              alt="Avatar"
              width={200}
              height={200}
              className="h-[80px] w-[80px] rounded-full object-cover animate-pulse"
            />
            <h2 className="text-gray-500">{expert?.name}</h2>
            <div className="p-5 bg-gray-300 px-10 rounded-lg absolute bottom-10 right-10">
              <UserButton />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center">
            {!enableMic ? (
              <Button onClick={connectToServer}>Connect</Button>
            ) : (
              <Button variant="destructive" onClick={disconnect}>
                Disconnect
              </Button>
            )}
          </div>
        </div>
        <div>
          <div className="h-[60vh] bg-sidebar-border rounded-4xl flex flex-col items-center justify-center relative">
            <h2>chat</h2>
          </div>
          <h2 className="mt-5 text-gray-400 text-sm">
            At the end of your converstion we will automatically generate
            feedback/notes from your conversastion
          </h2>
        </div>
      </div>
    </div>
  );
}

export default DiscussionRoom;
