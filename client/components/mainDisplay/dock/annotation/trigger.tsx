import Button from "@/components/atom/button";
import { useSession } from "@/components/hooks/useSession";
import { classMerge } from "@/components/utils";
import { useState, useRef, useEffect } from "react";
import ColorTrigger from "./colorTrigger";
export default function AnnotationTrigger() {
    /* ------ STATE & HOOKS ----- */
    const {
        clearCanvas, setClearCanvas,
        isAnnotating, setIsAnnotating,
        brushSize, setBrushSize,
    } = useSession()
    const containerRef = useRef<HTMLDivElement>(null)
    const [refHeight, setRefHeight] = useState<number>(0)
    const [refWdith, setRefWidth] = useState<number>(0)
    const [showSettings, setShowSettings] = useState<boolean>(false)
    /* ------ EVENT HANDLER ----- */
    useEffect(() => {
        const targetRef = containerRef.current
        if (targetRef) {
            setRefHeight(targetRef.getBoundingClientRect().height)
            setRefWidth(targetRef.getBoundingClientRect().width)
            targetRef.addEventListener("mouseenter", () => {
                targetRef.addEventListener("wheel", (scroll) => {
                    if (scroll.deltaY > 0) { //? DOWN
                        setBrushSize((prevSize) => prevSize > 1 ? prevSize -= 0.5 : 1)
                    } else { //? UP
                        setBrushSize((prevSize) => prevSize += 0.5)
                    }
                })
            })
            targetRef.addEventListener("mouseleave", () => {
                targetRef.removeEventListener("wheel", (scroll) => {
                    if (scroll.deltaY > 0) { //? DOWN
                        setBrushSize((prevSize) => prevSize > 1 ? prevSize -= 0.5 : 1)
                    } else { //? UP
                        setBrushSize((prevSize) => prevSize += 0.5)
                    }
                })
            })
        }
        return () => {
            if (targetRef) {
                targetRef.removeEventListener("mouseenter", () => {
                    targetRef.addEventListener("wheel", (scroll) => {
                        if (scroll.deltaY > 0) { //? DOWN
                            setBrushSize((prevSize) => prevSize > 1 ? prevSize -= 0.5 : 1)
                        } else { //? UP
                            setBrushSize((prevSize) => prevSize += 0.5)
                        }
                    })
                })
                targetRef.removeEventListener("mouseleave", () => {
                    targetRef.removeEventListener("wheel", (scroll) => {
                        if (scroll.deltaY > 0) { //? DOWN
                            setBrushSize((prevSize) => prevSize > 1 ? prevSize -= 0.5 : 1)
                        } else { //? UP
                            setBrushSize((prevSize) => prevSize += 0.5)
                        }
                    })
                })
            }
        }
    }, [containerRef, setBrushSize])
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        ref={containerRef}
        className={classMerge(
            "p-[8px]", //? Sizing
            "flex justify-center items-center z-[3]", //? Display
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
                circle useIcon iconSrc="/images/Paint.svg" iconOverlay textSize={"small"}
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
                circle useIcon iconSrc="/images/Erase.svg" iconOverlay textSize={"small"}
                containerClass="w-full rounded-full"
                onClick={() => !clearCanvas ? setClearCanvas(true) : setClearCanvas(false)}
                className={classMerge(
                    "bg-[#525252]", //? Background
                    "hover:bg-[#646464]", //? Hover
                )} >
                Clear Canvas
            </Button>
        </div>}
        <Button //* ANNOTATION
            circle useIcon iconSrc="/images/Annotations.svg" iconOverlay
            customOverlay={isAnnotating ? "blueOverlay" : ""}
            onClick={() => setShowSettings(!showSettings)}
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} />
    </div>
}