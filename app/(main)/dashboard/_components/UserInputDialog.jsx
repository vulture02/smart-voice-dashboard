import React, { use, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CoachingExpert } from "@/services/Option";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

function UserInputDialog({ children, coachingOptions }) {
  const [selectedExpert, setSelectedExpert] = useState();
  const [topic, setTopic] = useState();
  const createDiscussionRoom= useMutation(api.DiscussionRoom.CreateNewRoom);
  const [loading,setLoading]=useState(false)
  const onClickNext = async() => {
    setLoading(true)
    const result=await createDiscussionRoom({
        topic:topic,
        coachingOption:coachingOptions?.name,
        expertName:selectedExpert,
    })
    console.log(result)
    setLoading(false)
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{coachingOptions.name}</DialogTitle>
            <DialogDescription asChild>
              <div className="mt-3">
                <h2 className="text-black">
                  Enter the topic to master your skills in {coachingOptions.name}
                </h2>
                <Textarea
                  placeholder="Enter Topic Name here..."
                  className="mt-2"
                  onChange={(e) => setTopic(e.target.value)}
                />

                <h2 className="text-black mt-5">
                  Choose an expert to guide you in {coachingOptions.name}
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-6 mt-3">
                  {CoachingExpert.map((expert, index) => (
                    <div key={index} onClick={() => setSelectedExpert(expert.name)}>
                      <Image
                        src={expert.avatar}
                        alt={expert.name}
                        width={100}
                        height={100}
                        className={`rounded-2xl h-[80px] w-[80px] object-cover hover:scale-105 transition-all cursor-pointer ${
                          selectedExpert === expert.name ? 'border-2 border-primary' : ''
                        } p-1`}
                      />
                      <h2 className="text-center">{expert.name}</h2>
                    </div>
                  ))}
                </div>
                <div className="flex gap-5 justify-end mt-5">
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button disabled={!topic || !selectedExpert||loading} onClick={onClickNext}>
                    {loading&&<LoaderCircle className="animate-spin"/>}Next</Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserInputDialog;
