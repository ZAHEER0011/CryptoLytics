import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useState } from "react";
import Navbar from "../Navbar";
import ChatPanel from "../ChatPanel";
import { Outlet } from "react-router-dom";

function AppLayout() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg-dark)] text-white">

      <Navbar toggleChat={() => setChatOpen(!chatOpen)} />

      <div className="flex-1 overflow-hidden">
        {chatOpen ? (
          <ResizablePanelGroup direction="horizontal">
            
            <ResizablePanel defaultSize={75} minSize={50}>
              <div className="h-full overflow-auto">
                <Outlet />
              </div>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
              <ChatPanel />
            </ResizablePanel>

          </ResizablePanelGroup>
        ) : (
          <div className="h-full overflow-auto">
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
}

export default AppLayout;