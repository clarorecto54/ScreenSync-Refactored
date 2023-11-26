import Button from "@/components/atom/button";
import { useSession } from "@/components/hooks/useSession";
import { classMerge } from "@/components/utils";
import { useState, useRef, useEffect } from "react";
import ColorTrigger from "./colorTrigger";
export default function AnnotationTrigger() {
    /* ------ STATE & HOOKS ----- */
    const {
        isAnnotating, setIsAnnotating,
        brushSize, setBrushSize,
    } = useSession()
    const containerRef = useRef<HTMLDivElement>(null)
    const [refHeight, setRefHeight] = useState<number>(0)
    const [refWdith, setRefWidth] = useState<number>(0)
    const [showSettings, setShowSettings] = useState<boolean>(false)
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        if (containerRef.current) {
            setRefHeight(containerRef.current.getBoundingClientRect().height)
            setRefWidth(containerRef.current.getBoundingClientRect().width)
            containerRef.current.addEventListener("mouseenter", () => {
                containerRef.current?.addEventListener("wheel", (scroll) => {
                    if (scroll.deltaY > 0) { //? DOWN
                        setBrushSize((prevSize) => prevSize > 1 ? prevSize -= 0.5 : 1)
                    } else { //? UP
                        setBrushSize((prevSize) => prevSize += 0.5)
                    }
                })
            })
            containerRef.current.addEventListener("mouseleave", () => {
                containerRef.current?.removeEventListener("wheel", (scroll) => {
                    if (scroll.deltaY > 0) { //? DOWN
                        setBrushSize((prevSize) => prevSize > 1 ? prevSize -= 0.5 : 1)
                    } else { //? UP
                        setBrushSize((prevSize) => prevSize += 0.5)
                    }
                })
            })
        }
        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener("mouseenter", () => {
                    containerRef.current?.addEventListener("wheel", (scroll) => {
                        if (scroll.deltaY > 0) { //? DOWN
                            setBrushSize((prevSize) => prevSize > 1 ? prevSize -= 0.5 : 1)
                        } else { //? UP
                            setBrushSize((prevSize) => prevSize += 0.5)
                        }
                    })
                })
                containerRef.current.removeEventListener("mouseleave", () => {
                    containerRef.current?.removeEventListener("wheel", (scroll) => {
                        if (scroll.deltaY > 0) { //? DOWN
                            setBrushSize((prevSize) => prevSize > 1 ? prevSize -= 0.5 : 1)
                        } else { //? UP
                            setBrushSize((prevSize) => prevSize += 0.5)
                        }
                    })
                })
            }
        }
    }, [containerRef])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        ref={containerRef}
        className={classMerge(
            "p-[8px]", //? Sizing
            "flex justify-center items-center", //? Display
            "backdrop-blur-md", //? Background
        )}>
        {showSettings && <div //* SETTINGS CONTAINER
            style={{
                translate: `0 -${refHeight + 60}px`
            }}
            className={classMerge(
                "absolute flex flex-col justify-center items-center gap-[8px]", //? Display
            )}>
            <Button //* BRUSH SIZE
                circle useIcon iconSrc="/[Icon] Paint.png" iconOverlay textSize={"small"}
                containerClass="w-full rounded-full"
                onClick={() => setIsAnnotating(!isAnnotating)}
                className={classMerge(
                    isAnnotating ? "bg-[#335897]" : "bg-[#525252]", //? Background
                    isAnnotating ? "hover:bg-[#4069b2]" : "hover:bg-[#646464]", //? Hover
                )} >
                Size: {brushSize}px
            </Button>
            <ColorTrigger
                containerWidth={refWdith} />
            <Button //* CLEAR CANVAS
                circle useIcon iconSrc="/[Icon] Erase.png" iconOverlay textSize={"small"}
                containerClass="w-full rounded-full"
                className={classMerge(
                    "bg-[#525252]", //? Background
                    "hover:bg-[#646464]", //? Hover
                )} >
                Clear Canvas
            </Button>
        </div>}
        <Button //* ANNOTATION
            circle useIcon iconSrc="/[Icon] Annotations.png" iconOverlay
            customOverlay={isAnnotating ? "blueOverlay" : ""}
            onClick={() => setShowSettings(!showSettings)}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
    </div>
}