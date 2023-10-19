import Header from "@/components/header";
import { classMerge } from "@/components/utils";

export default function SessionPage() {
    return <div //* VIEWPORT
        className={classMerge(
            "h-[100vh] w-[100vw] p-[16px] py-[8px]", //? Sizing
            "flex justify-center items-start", //? Display
            "bg-black", //? Background
            "text-white font-[600] font-[Gotham]", //? Font Styling
        )}>
        <Header />
    </div>
}