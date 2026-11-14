import { Plane } from "lucide-react"
import { useRef } from "react"
import { useMutation } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { loginUser } from "@/api/authAPI"
import { useAuthStore } from "@/store/authStore"

// export function LoginPage() {
  // const emailRef = useRef<HTMLInputElement>(null)
  // const passwordRef = useRef<HTMLInputElement>(null)
  
  // const mutation = useMutation({
  //   mutationFn: loginUser,
  //   onSuccess: (user) => useAuthStore.getState().setUser(user),   // App swaps to the main page
  //   onError: (error) => toast.add({
  //     title: "Login failed",
  //     description: error.response?.data.message ?? "Something went wrong.",
  //     type: "error",
  //   }),
  // })

  // function handleSubmit() {
  //   mutation.mutate({ email: emailRef.current!.value, password: passwordRef.current!.value })
  // }

//   return (
//     // full-screen, centred column
//     <div className="flex min-h-svh items-center justify-center p-6 animate-enter">
//       <div className="flex w-full max-w-sm flex-col gap-6">
//           <FieldGroup>
//             <div className="flex flex-col items-center gap-2 text-center">
//               <div className="flex size-8 items-center justify-center rounded-md">
//                 <Plane className="size-6" />
//               </div>
//               <h1 className="text-xl font-bold">Welcome to AirTrack</h1>
//               <FieldDescription>Log in with your email and password.</FieldDescription>
//             </div>

//           //   <Field>
//           //     <FieldLabel htmlFor="email">Email</FieldLabel>
//           //     <Input id="email" type="email" placeholder="" required ref={emailRef} />
//           //   </Field>

//           //   <Field>
//           //     <FieldLabel htmlFor="password">Password</FieldLabel>
//           //     <Input id="password" type="password" required ref={passwordRef} />
//           //   </Field>

//           //   <Field>
//           //     <Button type="submit" disabled={mutation.isPending} onClick={handleSubmit} className="cursor-pointer">
//           //       {mutation.isPending && <Spinner />}
//           //       Login
//           //     </Button>
//           //   </Field>
//           // </FieldGroup>

// //       </div>
// //     </div>
//   )
// }


import { LoginForm } from "./ui/login-form"

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

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="fixed inset-0">
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
          fade={0.5}
          clickCascade
          intro
        />
      </div>

    <div className="absolute top-3 left-6 z-auto flex h-8 items-center">
      <Plane className="h-5 w-5" />
      <span className="text-lg font-semibold">AirTrack</span>
    </div>

    <div className="animate-enter relative z-auto w-full max-w-sm rounded-xl border bg-background/90 p-8 shadow-xl backdrop-blur animate-enter" >
        <FieldGroup>
             <div className="flex flex-col items-center gap-2 text-center">

              <h1 className="text-xl font-bold"><span></span>Welcome to AirTrack</h1>
              <FieldDescription>Log in with the provided email and password.</FieldDescription>
            </div>
              
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" required ref={emailRef} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" required ref={passwordRef} />
            </Field>

            <FieldDescription className="px-6 text-center">
              By clicking Log In, you agree that <span className="animate-rainbow font-semibold">Model is awesome.</span>
            </FieldDescription>

            <Field>
              <Button type="submit" disabled={mutation.isPending} className="cursor-pointer" onClick={handleSubmit}>
                {mutation.isPending && <Spinner />}
                Log In
              </Button>
            </Field>
          </FieldGroup>
 
       </div>
    </div>
  )
}

