import Textbox from "../../atom/textbox";
import { useLobby } from "../../hooks/useLobby";
import { classMerge } from "../../utils";
import Room from "./room";

export default function SessionsPanel() {
    /* ----- STATES & HOOKS ----- */
    const { //* LOBBY CONTEXT HOOK
        roomList,
        searchRoom, setSearchRoom
    } = useLobby()
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "h-full w-full max-h-[400px]", //? Sizing
            "flex flex-col gap-[8px] justify-center items-center", //? Display
            "font-[Montserrat] font-[500]", //? Font
        )}>
        <label>{roomList.length} Active {roomList.length > 1 && "Sessions"} {roomList.length === 1 && "Session"}</label>
        <div //* SEARCH BOX
            className="pb-[16px]">
            <Textbox
                textSize={"small"} placeholder="Find room here"
                useIcon iconSrc="/[Icon] Search.png"
                value={searchRoom}
                onChange={(thisElement) => {
                    setSearchRoom(thisElement.target.value)
                }} />
        </div>
        <div //* ROOM LIST CONTAINER
            className={classMerge(
                "h-full w-full", //? Sizing
                "flex flex-col gap-[8px]", //? Display
                "overflow-y-scroll scroll-smooth", //? Overflow
            )}>
            {roomList.map(({ //* ROOM INFO
                hostID, hostname, meetingCode, meetingKey, participants
            }, roomIndex) => {
                if (hostname.toUpperCase().includes(searchRoom.toUpperCase()) || meetingCode.toUpperCase().includes(searchRoom.toUpperCase())) {
                    return <Room
                        key={roomIndex}
                        hostID={hostID}
                        hostname={hostname}
                        meetingCode={meetingCode}
                        meetingKey={meetingKey}
                        participants={participants.length} />
                }
            })}
        </div>
    </div>
}