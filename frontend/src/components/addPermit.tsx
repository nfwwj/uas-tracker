import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Spinner } from "@/components/ui/spinner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {type ParsedPermit} from "../types/permit"
import { useEffect, useState, useRef } from "react"
import { toast } from "@/components/ui/toast"
import { Mutation, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {parsePermit, addPermitandActivities} from '../api/permitAPI'

import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function AddPermitDialog() {
  const [parsedPermit, setparsedPermit] = useState<ParsedPermit | null>(null)
  const queryClient = useQueryClient()
  const textRef = useRef<HTMLTextAreaElement>(null)
  const coord_ref = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState<boolean>(false)

  const mutation = useMutation({
    mutationFn: parsePermit,
    onSuccess: (data) => {
    setparsedPermit(data)
  },
  onError: (error) => 
    {
    toast.add({
      title: "Could not parse the permit.",
      description: `Error ${error.response?.data.statusCode ?? "XXX"} (${error.response?.statusText ?? "Server error"}): ${error.response?.data.message ?? "Something went wrong."} `,
      type: "warning"
    })}
  })

  const submitMutation = useMutation({
    mutationFn: addPermitandActivities,
    onSuccess: (data) => {queryClient.invalidateQueries({ queryKey: ["permits"] })
    
     toast.add({
      title: `New permit ${parsedPermit?.permitNo} added!`,
      type: "success"
    })
    setparsedPermit(null)
  },
  onError: (error) => {
    toast.add({
      title: "Something went wrong.",
      description: `Error ${error.response?.data.statusCode ?? "XXX"} (${error.response?.statusText ?? "Server error"}): ${error.response?.data.message ?? "Something went wrong."} `,
      type: "warning"
    })
  }
  })

  function handleSubmit(){
    if (!parsedPermit){
      return
    }
    submitMutation.mutate(parsedPermit)
    
  }

  function handleParse(){
    const text = textRef.current?.value.trim() ?? ""
    // const coord = coord_ref.current?.value.trim() ?? ""

    const coord = "012345.43N 1034213.42E"
    if (!text || !coord){
      toast.add({
      title: "Missing details!",
      description: `Fill in the text and the coordinates!`,
      type: "warning"
    })
      return
    }
    const data = `${text}\n${coord}`

    mutation.mutate(data)
    

    // mutation.mutate(
    //   `Application No. : CAAS/AP1/2026/6969
    //     Permit No. : AP1/20260519/0001/UOP/6969
    //     Date : 18 May 2026
    //     Avetics Global Pte Ltd
    //     47 Ayer Rajah Crescent, #07-08
    //     Singapore 139947
    //     ATTN: Mr Steven Leong
        
    //     Activity Date Activity Time Operating Altitude
    //     24 May 2026 0000LT to 2359LT
    //     1200ft AMSL
    //     27 May 2026 0000LT to 2359LT
    //     012345.67N 1035634.89E`
    //   )
  }

    
  return (
    <>

    <AlertDialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) setparsedPermit(null) }}>
      <AlertDialogTrigger render={<Button variant="ghost">Add permit</Button>} />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add permit</AlertDialogTitle>
      
        </AlertDialogHeader>

        {parsedPermit ? (
          <Card className="animate-enter">

            <CardHeader>
              <CardTitle>{parsedPermit.permitNo}</CardTitle>
              <CardDescription>{parsedPermit.applicationNum}</CardDescription>
              <CardDescription>{parsedPermit.altitudeFt} ft · Class {parsedPermit.class}</CardDescription>
              <CardDescription>{parsedPermit.coordinates}</CardDescription>
            </CardHeader>
            <CardContent className="max-h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity Date</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedPermit.activities.map((activity, i) => (
                    <TableRow
    key={activity.activityDateTime + activity.activityDate}
    className="animate-enter"
    style={{ animationDelay: `${125 + i * 225}ms` }}   // starts after the card, 40ms apart
  >
                      <TableCell className="text-xs">{activity.activityDate}</TableCell>
                      <TableCell className="text-xs">{activity.activityTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <>
          <AlertDialogDescription>Paste the text copied from the permit PDF.</AlertDialogDescription>
            <Textarea ref={textRef}
id="permit-text"
placeholder="Application No. : CAAS/AP1/2026/1760
Permit No. : AP1/20260519/0001/UOP/0011
Date : 18 May 2026
Model Is Awesome Pte Ltd"
className="h-64 resize-none font-mono text-xs"
/>

            <Field>
              <FieldLabel htmlFor="coords-input">Coordinates</FieldLabel>
              <FieldDescription>
                Copy exactly as shown in permit.
              </FieldDescription>
              <Input ref={coord_ref} id="coords-input" type="text" placeholder="012345.30N 1032345.40E" />
            </Field>
          </>
        )}

        <AlertDialogFooter>
          {parsedPermit ? (
            <>       
            <AlertDialogCancel onClick={() => setparsedPermit(null)}>Cancel</AlertDialogCancel>
            <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
              {submitMutation.isPending && (<Spinner />)}
              Add Permit</Button>
             </>
          ) : (
            <>
             <AlertDialogCancel onClick={() => setparsedPermit(null)}>Cancel</AlertDialogCancel>
              <Button onClick={handleParse} disabled={mutation.isPending}>
                {mutation.isPending && (<Spinner />)}
                Parse
              </Button>
            </>
          )}
          
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    
    </>
  )
}