import React from 'react'
import Sidebar from '@/components/Dashboard/slidebar' 
import { 
  Plus, 
  Maximize, 
  Bell, 
  Settings, 
  ChevronDown 
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const logoSrc = "/TechNova.svg";

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
    
      <nav className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-50 w-full">
        
 
        <div className="flex items-center gap-3">
          <div className="h-16 w-72 flex items-center justify-start overflow-hidden">
            {logoSrc ? (
              <img 
                src={logoSrc} 
                alt="TechNova Logo" 
                className="h-full w-auto object-contain"
              />
            ) : (
              <div className="text-[#025148] font-bold text-2xl tracking-tighter flex items-center">
                <span className="text-3xl font-black">TN</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          
          <div className="flex flex-col">
            <label className="text-[11px] text-gray-500 font-medium mb-0.5">Branch</label>
            <div className="relative">
              <select className="appearance-none bg-white border border-[#025148]/40 text-gray-800 text-sm rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:border-[#025148] cursor-pointer w-40">
                <option>Branch 1</option>
                <option>Branch 2</option>
                <option>Branch 3</option>
              </select>
              <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

        
          <button className="flex items-center gap-1.5 border border-[#025148] text-[#025148] hover:bg-[#025148]/5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Plus size={16} />
            <span>Add</span>
          </button>

          
          <button className="p-2 border border-gray-200 text-gray-600 hover:text-[#025148] hover:border-[#025148] rounded-lg transition-colors shadow-sm">
            <Maximize size={18} />
          </button>

         
          <button className="p-2 border border-gray-200 text-gray-600 hover:text-[#025148] hover:border-[#025148] rounded-lg transition-colors shadow-sm relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="p-2 border border-gray-200 text-gray-600 hover:text-[#025148] hover:border-[#025148] rounded-lg transition-colors shadow-sm">
            <Settings size={18} />
          </button>

        
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 ml-1 cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
              alt="User Profile" 
              className="w-full h-full object-cover"
            />
          </div>

        </div>

      </nav>

      
      <div className="flex flex-1">
        
      
        <aside className="w-72 shrink-0 border-r border-gray-200 bg-white p-4 hidden md:block">
          <Sidebar />
        </aside>

        <main className="flex-1 bg-gray-50/30 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  )
}