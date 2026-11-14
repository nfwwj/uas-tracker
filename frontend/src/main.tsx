import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import './index.css'

import { ThreeDCardDemo } from './components/alreadyOpen'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

navigator.locks.request("uas-tracker-tab", { ifAvailable: true }, (lock) => {
  const root = createRoot(document.getElementById("root")!)

  if (!lock) {
    root.render(<p>This app is already open in another tab.</p>)
    root.render(<ThreeDCardDemo></ThreeDCardDemo>)
    return
  }

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider> 
    </StrictMode>
  )
  return new Promise(() => {})
})
