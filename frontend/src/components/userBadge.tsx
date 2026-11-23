import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { useAuthStore } from "@/store/authStore"
import { useMutation } from "@tanstack/react-query"
import { logoutUser } from "@/api/authAPI"
import { toast } from "@/components/ui/toast"

export function UserBadge() {
  const user = useAuthStore((state) => state.user)


  const mutation = useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
    useAuthStore.getState().setUser(null)
  },

  })

  function handleLogout(){
    mutation.mutate()
  }

  if (!user) return null
  
  return (
    // w-fit replaces Item's w-full; min-w-0 removes Item's min-w-3xs (16rem floor), so it sizes to its contents
    <Item variant="outline" size="sm" className="fixed bottom-4 right-4 w-fit min-w-0">
      <ItemMedia>
        <Avatar>
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </ItemMedia>

      <ItemContent>
        
        <ItemTitle>{user.username} <span className="">(ID: {user.userId})</span></ItemTitle>
        <ItemDescription>Best SQN lololol</ItemDescription>
      </ItemContent>

      <ItemActions>
        {/* logout logic later */}
        <Button variant="ghost" size="icon" aria-label="Log out" className="cursor-pointer" onClick={handleLogout}>
          <LogOut />
        </Button>
      </ItemActions>
    </Item>
  )
}
