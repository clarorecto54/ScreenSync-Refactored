"use client"
import { ButtonHTMLAttributes, HTMLAttributes, forwardRef } from "react";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";
import Image from "next/image";
import { classMerge } from "../utils";
/* ----- BUTTON VARIANTS ---- */
const ButtonVariants = cva(
    clsx( //* BASE STYLING
        "bg-[#DF2020] hover:bg-[#B21A1A]", //? Background Styling
        "h-full w-full min-h-max min-w-max", //? Button Size
        "relative flex flex-row justify-center items-center", //? Display Styling
        "text-white text-center", //? Text Styling
        "font-[500] font-[Montserrat]", //? Font Styling
    ), {
    variants: { //* CONDITIONAL STYLING
        textSize: {
            verySmall: "text-[8px] rounded-[8px] gap-[4px] p-[8px]",
            small: "text-[12px] rounded-[12px] gap-[8px] p-[12px]",
            default: "text-[16px] rounded-[16px] gap-[12px] p-[16px]",
            large: "text-[20px] rounded-[20px] gap-[16px] p-[20px]",
            veryLarge: "text-[24px] rounded-[24px] gap-[20px] p-[24px]"
        }
    },
    defaultVariants: { //* DEFAULT STYLING
        textSize: "default"
    }
})
const IconVariants = cva(
    clsx( //* BASE STYLING
        "relative aspect-square" //? Base Styling
    ), {
    variants: { //* CONDITIONAL STYLING
        textSize: {
            verySmall: "h-[calc(8px*1.5)]",
            small: "h-[calc(12px*1.5)]",
            default: "h-[calc(16px*1.5)]",
            large: "h-[calc(20px*1.5)]",
            veryLarge: "h-[calc(24px*1.5)]",
        }
    },
    defaultVariants: { //* DEFAULT STYLING
        textSize: "default"
    }
})
/* ---- BUTTON INTERFACE ---- */
interface ButtonProps extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants>,
    VariantProps<typeof IconVariants> {
    circle?: boolean //? Rounded Corners
    useIcon?: boolean //? Button Icon
    iconSrc?: string //? Icon Path
    iconOverlay?: boolean //? Icon Overlay
    customOverlay?: string //? Icon Custom Overlay
    useNotif?: boolean //? Button Notification
    containerClass?: HTMLAttributes<HTMLDivElement>["className"] //? Container Class
}
/* -------- COMPONENT ------- */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    circle, useIcon, iconSrc, iconOverlay, customOverlay, useNotif, containerClass, textSize, className, children, ...props
}, ref) => {
    /* -------- RENDERING ------- */
    return <div //* CONTAINER
        className={classMerge(
            "min-w-max min-h-max", //? Base
            containerClass //? Conditional
        )}>
        <button ref={ref} {...props} //* BUTTON
            className={classMerge(
                ButtonVariants({ className, textSize }), //? Base Style
                circle ? "rounded-full" : null, //? Conditional Styling
            )}>
            {useNotif && <div className={classMerge( //* NOTIFICATION
                "bg-[#D6D6D6] h-[40%] p-[4px]",
                "absolute aspect-square rounded-full",
                "flex justify-center items-center",
                "-top-[10%] -right-[10%]",
                "text-black text-center font-[Montserrat] font-[500]")}>!</div>}
            {useIcon && <div //* ICON CONTAINER
                className={classMerge(
                    IconVariants({ textSize }), //? Base Styling
                )}>
                <Image //* ICON
                    className={classMerge(
                        "aspect-square", //? Base Styling
                        iconOverlay ? customOverlay ? customOverlay : "whiteOverlay" : null, //? Conditional Styling
                    )}
                    src={iconSrc ? iconSrc : "/[Icon] Missing.png"}
                    alt=""
                    fill
                />
            </div>}
            {children}
        </button></div>
})
Button.displayName = "Button"
export default Button;