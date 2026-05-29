import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Stethoscope, PhoneCall, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/componentss/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Call Logs", url: "/call-logs", icon: PhoneCall },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (p: string) => currentPath === p;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-slate-100 mb-2">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-slate-800 tracking-tight">Biomed</span>
            <span className="text-xs font-medium text-slate-500">Clinic</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title} className="hover:bg-slate-100 text-slate-600 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700 data-[active=true]:font-medium transition-colors">
                    <Link to={item.url} className="flex items-center gap-3 py-2">
                      <item.icon className="h-4.5 w-4.5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
