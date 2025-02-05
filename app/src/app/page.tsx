// app/page.tsx
import CreateGameButton from "@/components/CreateGameButton";
import JoinGameForm from "@/components/JoinGameForm";

export default function Home() {
  return (
    <div className="grid h-dvh content-center justify-items-center p-8 pt-20 gap-16">
      <div className="flex flex-col gap-8 w-full max-w-md">
        <CreateGameButton />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>
        <JoinGameForm />
      </div>
    </div>
  );
}