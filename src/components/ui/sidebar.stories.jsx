import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./sidebar";
import { Home, Settings, User, FileText, Search, Bell } from "lucide-react";

export default {
  title: "UI/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <Story />
        </div>
      </SidebarProvider>
    ),
  ],
};

const menuItems = [
  {
    title: "Início",
    icon: Home,
    url: "#",
  },
  {
    title: "Documentos",
    icon: FileText,
    url: "#",
  },
  {
    title: "Buscar",
    icon: Search,
    url: "#",
  },
  {
    title: "Notificações",
    icon: Bell,
    url: "#",
  },
  {
    title: "Configurações",
    icon: Settings,
    url: "#",
  },
];

export const Default = {
  render: () => (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Home className="h-4 w-4" />
            </div>
            <span className="font-semibold">OrBee</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <User className="h-4 w-4" />
                <span>Perfil</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50 p-4">
              <h3 className="font-medium">Card 1</h3>
              <p className="text-sm text-muted-foreground">Conteúdo do card</p>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 p-4">
              <h3 className="font-medium">Card 2</h3>
              <p className="text-sm text-muted-foreground">Conteúdo do card</p>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 p-4">
              <h3 className="font-medium">Card 3</h3>
              <p className="text-sm text-muted-foreground">Conteúdo do card</p>
            </div>
          </div>

          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4">
            <h2 className="text-xl font-semibold mb-4">Conteúdo Principal</h2>
            <p className="text-muted-foreground">
              Esta é a área principal do conteúdo. A sidebar pode ser recolhida
              clicando no botão de toggle no header.
            </p>
          </div>
        </div>
      </SidebarInset>
    </>
  ),
};

export const WithGroups = {
  render: () => (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Home className="h-4 w-4" />
            </div>
            <span className="font-semibold">OrBee</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegação</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Search className="h-4 w-4" />
                    <span>Buscar</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Ferramentas</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <FileText className="h-4 w-4" />
                    <span>Documentos</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Bell className="h-4 w-4" />
                    <span>Notificações</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Sistema</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <User className="h-4 w-4" />
                <span>João Silva</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto">
            <h1 className="text-lg font-semibold">Sidebar com Grupos</h1>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4">
            <h2 className="text-xl font-semibold mb-4">Sidebar Organizada</h2>
            <p className="text-muted-foreground">
              Esta sidebar demonstra como organizar itens em grupos com labels.
            </p>
          </div>
        </div>
      </SidebarInset>
    </>
  ),
};

export const Minimal = {
  render: () => (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.slice(0, 3).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto">
            <h1 className="text-lg font-semibold">Sidebar Minimal</h1>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4">
            <h2 className="text-xl font-semibold mb-4">Layout Simples</h2>
            <p className="text-muted-foreground">
              Sidebar minimalista sem header ou footer.
            </p>
          </div>
        </div>
      </SidebarInset>
    </>
  ),
};
