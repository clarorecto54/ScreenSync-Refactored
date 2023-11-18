import { LobbyContextProvider } from "@/components/hooks/useLobby";
import MenuPanel from "@/components/menuPanel/menuPanel";
import { classMerge } from "@/components/utils";
import Image from "next/image";
/* ------ LANDING PAGE ------ */
export default function Home() {
  /* -------- RENDERING ------- */
  return <LobbyContextProvider>
    <div //* VIEWPORT
      // "relative h-[100vh] w-[100vw] flex justify-center items-center"
      className={classMerge(
        "relative h-[100vh] w-[100vw]", //? Sizing
        "flex justify-center items-center", //? Display
      )}>
      <Image //* BACKGROUND IMAGE
        className="absolute object-cover -z-[1]"
        src="/[Image] Background.png"
        alt=""
        fill
        sizes="(max-wdth: 3194px) 100vw" />
      <div //* BACKDROP
        className={classMerge(
          "h-full w-full", //? Sizing
          "flex justify-center items-center", //? Display
          "focus-within:backdrop-blur-md focus-within:backdrop-brightness-75", //? Backdrop
          "transition-all duration-500"
        )}>
        <MenuPanel />
      </div>
    </div>
  </LobbyContextProvider>
}