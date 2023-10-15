import MenuForm from "@/components/menu_form";
import { classMerge } from "@/components/utils";

export default function MenuPreview() {
    return <div //* VIEWPORT
        className="figmaViewport">
        <div //* MENU
            className="figmaElement">
            Menu Form
            <div //* MENU CONTAINER
                className={classMerge(
                    "h-[60vh] w-[20vw] p-[32px]", //? Sizing
                    "bg-white rounded-[32px]", //? Background Styling
                )}>
                <MenuForm />
            </div>
        </div>
    </div>
}