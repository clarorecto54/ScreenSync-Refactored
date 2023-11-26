import Button from "@/components/atom/button";
import { useSession } from "@/components/hooks/useSession";
import { classMerge } from "@/components/utils";
import { RefObject, useState, useEffect } from "react"
import { SketchPicker, ColorResult } from "react-color"
export default function ColorTrigger({ containerWidth }: { containerWidth: number }) {
    /* ----- STATES & HOOKS ----- */
    const { brushColor, setBrushColor } = useSession()
    const [refWidth, setRefWidth] = useState<number>(0)
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false)
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "w-full", //? Sizing
            "flex justify-center items-center", //? Display
        )}>
        {showColorPicker && <div //* COLOR PICKER CONTAINER
            style={{
                translate: `${containerWidth * 2.25}px -${containerWidth * 0.5}px`
            }}
            className={classMerge(
                "rounded-[16px] scale-75", //? Sizing
                "absolute flex justify-center items-center overflow-hidden", //? Display
            )}>
            <SketchPicker
                className="text-black"
                color={brushColor}
                disableAlpha
                onChange={(color: ColorResult) => setBrushColor(color.hex)}
                styles={{
                    default: {
                        saturation: { borderRadius: 16 }
                    }
                }} />
        </div>}
        <Button //* COLOR BUTTON
            circle textSize={"small"}
            onClick={() => setShowColorPicker(!showColorPicker)}
            containerClass="w-full rounded-full"
            className={classMerge(
                "bg-[#525252]", //? Background
                "hover:bg-[#646464]", //? Hover
            )} >
            <div //* COLOR ICON
                style={{
                    backgroundColor: brushColor
                }}
                className={classMerge(
                    "h-[20px] aspect-square rounded-full", //? Sizing
                    "border-[2px] border-black", //? Border
                )} />
            Set Color
        </Button>
    </div>
}