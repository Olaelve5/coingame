// app/page.tsx
import CreateGameButton from "@/components/host/CreateGameButton";
import JoinGameButton from "@/components/player/JoinGameButton";
import { IconDotsVertical } from "@tabler/icons-react";

export default function Home() {
  return (
    <div className="grid h-dvh content-center justify-items-center gap-40">
      <h1 className="bungee-font text-5xl font-bold text-center">Cashfall</h1>
      <div className="flex flex-col gap-6 w-full max-w-xs min-w-[300px] items-center">
        <CreateGameButton />
        <IconDotsVertical size={20} className="opacity-100" />
        <JoinGameButton />
      </div>
    </div>
  );
}
