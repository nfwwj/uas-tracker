import { Plane } from "lucide-react"
import { useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { InputGroup } from "./ui/input-group"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { loginUser } from "@/api/authAPI"
import { useAuthStore } from "@/store/authStore"


import ShapeGrid from "./ui/ShapeGrid"   // the component (.jsx); it imports its own ShapeGrid.css

export function LoginPage() {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => useAuthStore.getState().setUser(user),   // App swaps to the main page
    onError: (error) => toast.add({
      title: "Login failed",
      description: error.response?.data.message ?? "Something went wrong.",
      type: "error",
    }),
  })

  function handleSubmit() {
    mutation.mutate({ email: emailRef.current!.value, password: passwordRef.current!.value })
  }

  // return (
  //   <div className="flex min-h-svh items-center justify-center">
      // <div className="fixed inset-0">
      //   <ShapeGrid
      //     shape="square"
      //     direction="diagonal"
      //     lineColor="#3f3f46"
      //     hoverColor="#ffffff"
      //     hoverFillColor="#ffffff"
      //     fillOpacity={0.1}
      //     cellSize={40}
      //     speed={0.5}
      //     radius={1.5}
      //     trail={0.2}
      //     glow={0.2}
      //     fade={10}
      //     clickCascade
      //     intro
      //   />
      // </div>

    // <div className="absolute top-3 left-6 z-auto flex h-8 items-center">
    //   <Plane className="h-5 w-5" />
    //   <span className="text-lg font-semibold">AirTrack</span>
    // </div>

    // <div className="animate-enter relative w-full max-w-sm rounded-2xl border bg-background/80 p-8 shadow-2xl ring-1 ring-black/5 backdrop-blur-md dark:ring-white/10">
    //     <FieldGroup className="gap-6">
    //       <div className="flex flex-col items-center gap-3 text-center">
    //         <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
    //           <Plane className="size-6" />
    //         </div>
    //         <div className="flex flex-col gap-1">
    //           <h1 className="text-2xl font-semibold tracking-tight">AirTrack</h1>
    //           <FieldDescription>Log in with the provided email and password.</FieldDescription>
    //         </div>
    //       </div>

    //       <div className="flex flex-col gap-4">
    //         <Field>
    //           <FieldLabel htmlFor="email">Email</FieldLabel>
    //           <Input id="email" type="email" required ref={emailRef} className="h-10" />
    //         </Field>

    //         <Field>
    //           <FieldLabel htmlFor="password">Password</FieldLabel>
    //           <Input id="password" type="password" required ref={passwordRef} className="h-10" />
    //         </Field>
    //       </div>

    //       <Field>
    //         <Button type="submit" disabled={mutation.isPending} className="h-10 w-full cursor-pointer" onClick={handleSubmit}>
    //           {mutation.isPending && <Spinner />}
    //           Log In
    //         </Button>
    //       </Field>

    //       <FieldDescription className="text-center text-xs">
    //         By clicking Log In, you agree that <span className="animate-rainbow font-semibold">Model is awesome.</span>
    //       </FieldDescription>
    //     </FieldGroup>
    //   </div>
  //   </div>
  // )

  return(
    <>
     <div className="grid min-h-svh lg:grid-cols-2">
      {/* relative z-10 lifts this column above the fixed grid; bg-background makes it solid black so the grid only shows on the right */}
      <div className="relative z-10 flex flex-col gap-4 bg-background p-6 md:p-10">
        <div className="absolute top-3 left-6 z-auto flex h-8 items-center">
      <Plane className="h-5 w-5" />
      <span className="text-lg font-semibold">AirTrack</span>
    </div>


    <div className="flex flex-1 items-center justify-center">
    <div className="animate-enter relative w-full max-w-sm bg-background/80 p-8">
        <FieldGroup className="gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Plane className="size-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold">AirTrack</h1>
              <FieldDescription>Log in with the provided email and password.</FieldDescription>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" required ref={emailRef} className="h-10" />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" required ref={passwordRef} className="h-10" />
            </Field>
          </div>

          <Field>
            <Button type="submit" disabled={mutation.isPending} className="h-10 w-full cursor-pointer" onClick={handleSubmit}>
              {mutation.isPending && <Spinner />}
              Log In
            </Button>
          </Field>

          <FieldDescription className="text-center text-xs">
            By clicking Log In, you agree that <span className="animate-rainbow font-semibold">Model is awesome.</span>
          </FieldDescription>
        </FieldGroup>
      </div>
        </div>
      </div>
     
      {/* right column: the grid's second cell. relative = the box absolute inset-0 fills; hidden below lg */}
      <div className="relative hidden lg:block">
         <div className="absolute inset-0">
        <ShapeGrid
          shape="square"
          direction="diagonal"
          lineColor="#3f3f46"
          hoverColor="#ffffff"
          hoverFillColor="#ffffff"
          fillOpacity={0.1}
          cellSize={40}
          speed={0.5}
          radius={1.5}
          trail={0.2}
          glow={0.2}
          fade={1}
          clickCascade
          intro
        />
      </div>
      </div>

    </div>
    
    
    
    
    </>
  )
}

