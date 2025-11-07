import { useMemo } from 'react'
import { Outlet, useLocation } from 'react-router'
import { ArrowLeft } from 'lucide-react'

// Capitalize first letter and replace hyphens/underscores with spaces
const formatHeaderTitle = (text: string): string => {
  return text
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export default function StackLayout() {
  
  const location = useLocation()
  
  const headerTitle: string = useMemo((): string => {
    const segments: string[] = location.pathname.slice(1).split('/');
    
    if (segments.length === 0) return 'Home'
    
    const baseRoute: string = segments[0]
    const action: string | undefined = segments[1]
       
    if (action) {
      return `${formatHeaderTitle(action)} ${formatHeaderTitle(baseRoute).slice(0, -1)}`
    }
    
    return formatHeaderTitle(baseRoute)
  }, [location.pathname])

  return (
    <div className='flex flex-col w-full min-h-screen bg-white'>
      
      <header className='sticky top-0 z-50 h-14 border-b border-gray-200 bg-white/95 backdrop-blur'>
        <div className='flex h-full items-center px-4'>
          <button className='flex items-center justify-center w-8 h-8 -ml-2 rounded-full hover:bg-gray-100'>
            <ArrowLeft className='w-5 h-5 text-gray-700' />
          </button>
          <h1 className='flex-1 text-center font-medium text-gray-900 -ml-8'>{headerTitle}</h1>
        </div>
      </header>
      
      <main className='flex-1 overflow-auto'>
        <Outlet />
      </main>
    </div>
  )
}
