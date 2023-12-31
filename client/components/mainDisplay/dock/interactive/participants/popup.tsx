import { classMerge } from "@/components/utils";
import InfoControlsTrigger from "./infoControls/trigger";
import Textbox from "@/components/atom/textbox";
import { useSession } from "@/components/hooks/useSession";
import { useState } from "react";

export default function ParticipantsPopup() {
    /* ----- STATES & HOOKS ----- */
    const { participantList } = useSession()
    const [search, setSearch] = useState<string>("")
    const [activePopup, setActivePopup] = useState<string>("")
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "h-[48vh] w-[16vw] rounded-[16px] p-[16px] px-[32px]", //? Sizing
            "min-h-[400px] max-h-[calc(400px*1.25)] min-w-[300px] max-w-[calc(300px*1.25)]", //? Limits
            "bg-white shadow", //? Background
            "flex flex-col gap-[16px]", //? Display
            "text-black text-[20px] font-[Montserrat] font-[500]", //? Font
        )}>
        Viewers
        <Textbox //* SEARCH PARTICIPANTS
            autoFocus textSize={"small"} value={search}
            useIcon iconSrc="/images/Search.svg"
            placeholder="Search participant here"
            containerClass="mb-[8px]"
            onChange={(thisElement) => setSearch(thisElement.target.value)} />
        <div //* PARTICIPANTS LIST
            onScroll={(thisElement) => {
                setActivePopup("") //? Close popups
            }}
            className={classMerge(
                "h-full w-full overflow-hidden overflow-y-scroll scroll-smooth", //? Sizing
                "flex flex-col gap-[8px]", //? Display
            )}>
            {participantList.map((client, index) => {
                if (client.name.toUpperCase().includes(search.toUpperCase())) {
                    return <InfoControlsTrigger
                        data={client}
                        activePopup={activePopup}
                        setActivePopup={setActivePopup}
                        key={index} />
                }
            })}
        </div>
    </div>
}