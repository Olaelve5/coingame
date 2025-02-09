// app/page.tsx
import CreateGameButton from "@/components/host/CreateGameButton";
import JoinGameButton from "@/components/player/JoinGameButton";

export default function Home() {
  return (
    <div className="grid h-dvh content-center justify-items-center gap-40">
      <h1 className="text-5xl font-bold text-center">Title</h1>
      <div className="flex flex-col gap-14 w-full max-w-xs min-w-[300px]">
        <CreateGameButton />
        <JoinGameButton />
      </div>
    </div>
  );
}
