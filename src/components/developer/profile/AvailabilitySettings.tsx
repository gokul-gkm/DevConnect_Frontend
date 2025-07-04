import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AvailabilityManagement from "./AvailabilityManagement";
import DefaultAvailabilityManagement from "./DefaultAvailabilityManagement";
import { Calendar, Settings } from "lucide-react";

export default function AvailabilitySettings() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 ">
      
      
      <Tabs 
        defaultValue="daily" 
        className="w-full rounded-xl bg-black shadow-xl backdrop-blur-sm p-4"
      >
        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-gray-950/50 p-1 gap-1">
          <TabsTrigger 
            value="daily"
            className="rounded-md px-4 py-2.5 text-gray-400 
            data-[state=active]:bg-white/5 
            data-[state=active]:text-primary 
            data-[state=active]:shadow-[0_0_15px_rgba(59,130,246,0.15)] 
            data-[state=active]:border-gray-800/30
            data-[state=active]:font-medium 
            transition-all duration-300 ease-out
            hover:text-gray-200
            border border-transparent"
          >
            <div className="flex items-center space-x-2">
             <Calendar className="h-5 w-5"/>
              <span>Daily Availability</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="default"
            className="rounded-md px-4 py-2.5 text-gray-400 
            data-[state=active]:bg-white/5
            data-[state=active]:text-primary 
            data-[state=active]:shadow-[0_0_15px_rgba(59,130,246,0.15)] 
            data-[state=active]:border-gray-800/30
            data-[state=active]:font-medium 
            transition-all duration-300 ease-out
            hover:text-gray-200
            border border-transparent"
          >
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5"/>
              <span>Default Availability</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent 
            value="daily"
            className="animate-in slide-in-from-left-1 duration-300 ease-in-out"
          >
            <div className="rounded-xl bg-black p-3 border border-gray-800/50">
              <AvailabilityManagement />
            </div>
          </TabsContent>
          
          <TabsContent 
            value="default"
            className="animate-in slide-in-from-right-1 duration-300 ease-in-out"
          >
            <div className="rounded-xl bg-black p-3 border border-gray-800/50">
              <DefaultAvailabilityManagement />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
