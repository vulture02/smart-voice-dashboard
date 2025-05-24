"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { CoachingExpert } from "@/services/Option";
import { UserButton } from "@stackframe/stack";
import { useQuery } from "convex/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import { RealtimeTranscriber } from "assemblyai";
import { getToken } from "@/services/GlobalServices";

const RecordRTC = dynamic(() => import("recordrtc"), { ssr: false });

function DiscussionRoom() {
  const { roomid } = useParams();
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });

  const [expert, setExpert] = useState(null);
  const [enableMic, setEnableMic] = useState(false);
  const recorder = useRef(null);
  const silenceTimeout = useRef(null);
  const realtimeTranscriber=useRef(null)
  useEffect(() => {
    if (DiscussionRoomData) {
      const Expert = CoachingExpert.find(
        (item) => item.name === DiscussionRoomData.expertName
      );
      setExpert(Expert);
    }
  }, [DiscussionRoomData]);

  const connectToServer = async() => {
    setEnableMic(true);

    realtimeTranscriber.current=new RealtimeTranscriber({
      token:await getToken(),
      sample_rate:16_000

    })
    realtimeTranscriber.current.on('transcript',async(transcript)=>{
      console.log(transcript);
      
    })
    await realtimeTranscriber.current.connect();
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(async (stream) => {
          const RecordRTCModule = (await import("recordrtc")).default;
          recorder.current = new RecordRTCModule(stream, {
            type: "audio",
            mimeType: "audio/webm;codecs=pcm",
            recorderType: (await import("recordrtc")).StereoAudioRecorder,
            timeSlice: 250,
            desiredSampRate: 16000,
            numberOfAudioChannels: 1,
            bufferSize: 4096,
            audioBitsPerSecond: 128000,
            ondataavailable: async (blob) => {
              if(!realtimeTranscriber.current) return;
              clearTimeout(silenceTimeout.current);

              const buffer = await blob.arrayBuffer();
              console.log(buffer);
              realtimeTranscriber.current.sendAudio(buffer);

              silenceTimeout.current = setTimeout(() => {
                console.log("User stopped talking");
              }, 2000);
            },
          });
          recorder.current.startRecording();
        })
        .catch((err) => console.error(err));
    }
  };

 const disconnect = async (e) => {
  e.preventDefault();
  if (realtimeTranscriber.current) {
    await realtimeTranscriber.current.close();
    realtimeTranscriber.current = null;
  }
  if (recorder.current) {
    recorder.current.pauseRecording();
    recorder.current = null;
  }
  setEnableMic(false);
};


  return (
    <div className="-mt-12">
      <h2 className="text-lg font-bold">{DiscussionRoomData?.coachingOption}</h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="lg:col-span-2 h-[60vh] bg-sidebar-border rounded-4xl flex flex-col items-center justify-center relative">
            {expert?.avatar ? (
              <Image
                src={expert.avatar}
                alt="Expert Avatar"
                width={80}
                height={80}
                className="h-[80px] w-[80px] rounded-full object-cover animate-pulse"
              />
            ) : (
              <div className="h-[80px] w-[80px] rounded-full bg-gray-300 animate-pulse" />
            )}
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
