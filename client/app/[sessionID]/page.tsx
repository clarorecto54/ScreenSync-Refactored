import MainDisplay from "@/components/mainDisplay/mainDisplay";
import AppDock from "@/components/dock/appDock";
import Header from "@/components/header";
import { SessionContextProvider } from "@/components/hooks/useSession";
import { classMerge } from "@/components/utils";
/* ------ MEETING PAGE ------ */
export default function SessionPage() {
    /* -------- RENDERING ------- */
    return <SessionContextProvider>
        <div //* VIEWPORT
            className={classMerge(
                "h-[100vh] w-[100vw] p-[16px] py-[8px]", //? Sizing
                "flex flex-col gap-[8px] justify-center items-start", //? Display
                "bg-black", //? Background
                "text-white font-[600] font-[Gotham]", //? Font Styling
            )}>
            <Header />
            <MainDisplay />
            <AppDock />
        </div>
    </SessionContextProvider>
}