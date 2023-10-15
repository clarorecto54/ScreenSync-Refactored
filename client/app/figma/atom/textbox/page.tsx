import Textbox from "@/components/atom/textbox";

export default function TextboxPreview() {
    return <div //* VIEWPORT
        className="figmaViewport">
        <div //* COLUMN 1
            className="figmaElement">
            Main
            <Textbox />
            <Textbox circle />
        </div>
        <div //* COLUMN 2
            className="figmaElement">
            Textbox + Icon
            <Textbox useIcon iconOverlay />
            <Textbox circle useIcon iconOverlay />
        </div>
        <div //* COLUMN 3
            className="figmaElement">
            Textbox + Button
            <Textbox useSubmit SubmitSrc="" />
            <Textbox circle useSubmit SubmitSrc="" />
        </div>
        <div //* COLUMN 4
            className="figmaElement">
            Textbox + Button + Icon
            <Textbox useIcon iconSrc="" useSubmit SubmitSrc="" />
            <Textbox circle useIcon iconSrc="" useSubmit SubmitSrc="" />
        </div>
    </div>
}