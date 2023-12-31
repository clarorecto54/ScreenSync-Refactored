import MainDisplay from "@/components/mainDisplay/display/mainDisplay";
import AppDock from "@/components/mainDisplay/dock/appDock";
import Header from "@/components/mainDisplay/header";
import { SessionContextProvider } from "@/components/hooks/useSession";
import { classMerge } from "@/components/utils";
import PanelPopup from "@/components/mainDisplay/popups/panel";
import ContentPopup from "@/components/mainDisplay/popups/content";
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
        <PanelPopup>
            < ContentPopup />
        </PanelPopup>
    </SessionContextProvider>
}