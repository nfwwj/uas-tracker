"use client";

import { CardBody, CardContainer, CardItem } from "./ui/3d-card";

import {X} from "lucide-react"

export function ThreeDCardDemo() {
  return (
    // containerClassName styles the outer (centring) div; min-h-svh gives it the screen height to centre within
    <CardContainer className="inter-var" containerClassName="min-h-svh py-0">
      <CardBody className="relative group/card w-auto sm:w-[30rem] h-auto rounded-2xl p-8 border border-white/[0.15] bg-gradient-to-br from-zinc-900 via-black to-zinc-900 shadow-2xl hover:shadow-amber-500/20">

        {/* CardItem is w-fit, so mx-auto centres it */}
        <CardItem translateZ="100" className="mx-auto mb-6 bg-destructive/10 p-5 dark:bg-destructive/20">
          <X className="size-16 text-destructive" />
   
        </CardItem>
         

        <CardItem
          translateZ="100"
          className="text-5xl font-bold text-neutral-600 dark:text-white"
        >
          This app is already open in another tab.
        </CardItem>

        <CardItem
          as="p"
          translateZ="50"
          className="mt-3 max-w-sm text-sm text-neutral-400"
        >
          Close this tab and switch back to the other one.
        </CardItem>

        <CardItem
          as="p"
          translateZ="50"
          className="mt-3 max-w-sm text-sm text-neutral-400"
        >
          Model is awesome.
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
