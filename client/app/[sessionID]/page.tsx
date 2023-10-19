import MainDisplay from "@/components/display";
import Header from "@/components/header";
import { SessionContextProvider } from "@/components/hooks/useSession";
import { classMerge } from "@/components/utils";

export default function SessionPage() {
    return <div //* VIEWPORT
        className={classMerge(
            "h-[100vh] w-[100vw] p-[16px] py-[8px]", //? Sizing
            "flex flex-col gap-[16px] justify-center items-start", //? Display
            "bg-black", //? Background
            "text-white font-[600] font-[Gotham]", //? Font Styling
        )}>
        <SessionContextProvider>
            <Header />
            <MainDisplay />
        </SessionContextProvider>
    </div>
}