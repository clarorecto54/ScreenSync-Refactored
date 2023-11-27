"use client"
import { HTMLAttributes, InputHTMLAttributes, forwardRef } from "react";
import { cva, VariantProps } from "class-variance-authority"
import clsx from "clsx";
import Image from "next/image";
import { classMerge } from "../utils";
/* ---- TEXTBOX VARIANTS ---- */
const TextboxVariants = cva(
    clsx( //* BASE STYLING
        "min-h-max", //? Resizing Limit
        "h-full w-full", //? Textbox Size
        "bg-white", //? Background Styling
        "text-black font-[Gotham] font-[400]", //? Text & Font Styling
    ), { //* CONDITIONAL STYLING
    variants: {
        textSize: {
            verySmall: "text-[8px] p-[8px]",
            small: "text-[12px] p-[12px]",
            default: "text-[16px] p-[16px]",
            large: "text-[20px] p-[20px]",
            veryLarge: "text-[24px] p-[24px]",
        }
    }, //* DEFAULT STYLING
    defaultVariants: {
        textSize: "default"
    }
})
const ContainerVariants = cva(
    clsx( //* BASE STYLING
        "min-h-max min-w-max", //? Sizing
        "flex flex-row justify-center items-center", //? Display Styling
        "bg-white overflow-hidden shadow", //? Background Styling
        "focus-within:border-[1px] focus-within:border-blue-600", //? Border Styling
    ), { //* CONDITIONAL STYLING
    variants: {
        textSize: {
            verySmall: "rounded-[8px]",
            small: "rounded-[12px]",
            default: "rounded-[16px]",
            large: "rounded-[20px]",
            veryLarge: "rounded-[24px]",
        }
    }, //* DEFAULT STYLING
    defaultVariants: {
        textSize: "default"
    }
})
const IconContainerVariants = cva(
    clsx(
        "aspect-square", //? Ratio
        "flex justify-center items-center", //? Display Styling
    ), {
    variants: {
        textSize: {
            verySmall: "w-[calc(8*4.4px)]",
            small: "w-[calc(12*4.4px)]",
            default: "w-[calc(16*4.4px)]",
            large: "w-[calc(20*4.4px)]",
            veryLarge: "w-[calc(24*4.4px)]",
        }
    },
    defaultVariants: {
        textSize: "default"
    }
}
)
/* ---- TEXTBOX INTERFACE --- */
interface TextboxProps extends
    InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof ContainerVariants>,
    VariantProps<typeof TextboxVariants>,
    VariantProps<typeof IconContainerVariants> {
    circle?: boolean //? Rounded Corners
    password?: boolean //? Password type
    useIcon?: boolean //? Icon
    iconSrc?: string //? Icon Path
    iconOverlay?: boolean //? Icon Overlay
    customOverlay?: string //? Icon Custom Overlay
    useSubmit?: boolean //? Submit Button
    SubmitSrc?: string //? Button Icon
    containerClass?: HTMLAttributes<HTMLDivElement>["className"] //? Container Class
    iconClass?: HTMLAttributes<HTMLDivElement>["className"] //? Icon Class
}
/* -------- COMPONENT ------- */
const Textbox = forwardRef<HTMLInputElement, TextboxProps>(({
    circle, password, useIcon, iconSrc, iconOverlay, customOverlay, useSubmit, SubmitSrc, containerClass, iconClass, textSize, className, children, placeholder, ...props
}, ref) => {
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            ContainerVariants({ className: containerClass, textSize }), //? Base Styling
            circle ? "rounded-full" : null, //? Conditional Styling
            ""
        )}>
        {useIcon && <div //* ICON CONTAINER
            className={classMerge(
                IconContainerVariants({ className: iconClass, textSize }), //? Base Styling
            )}>
            <div //* ICON
                className="relative aspect-square h-[40%]">
                <Image
                    className={classMerge(
                        "aspect-square", //? Base Styling
                        iconOverlay ? customOverlay ? customOverlay : "whiteOverlay" : null, //? Conditional Styling
                    )}
                    src={iconSrc ? iconSrc : "/images/Missing.svg"}
                    alt=""
                    fill
                    sizes={'100vw'} />
            </div>
        </div>}
        <input //* TEXTBOX
            ref={ref} {...props} type={password ? "password" : "text"}
            placeholder={placeholder ? placeholder : "Put your text here"}
            className={classMerge(
                TextboxVariants({ className, textSize }), //? Base Styling
            )} />
        {useSubmit && <button //* SUBMIT CONTAINER
            type="submit"
            className={classMerge(
                IconContainerVariants({ textSize }), "bg-white hover:bg-[#52525250]" //? Base Styling
            )} >
            <div //* ICON
                className="relative aspect-square h-[30%]">
                <Image
                    className={classMerge(
                        "aspect-square", //? Base Styling
                        iconOverlay ? customOverlay ? customOverlay : "whiteOverlay" : null, //? Conditional Styling
                    )}
                    src={iconSrc ? iconSrc : "/images/Send.svg"}
                    alt=""
                    fill
                    sizes={'100vw'} />
            </div></button>}
    </div>
})
Textbox.displayName = "Textbox"
export default Textbox;