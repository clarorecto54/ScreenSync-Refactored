import Button from "@/components/atom/button";

export default function ButtonPreview() {
    return <div //* VIEWPORT
        className="figmaViewport">
        <div //* COLUMN 1
            className="figmaElement">
            Main
            <Button>Test</Button>
            <Button circle>Test</Button>
        </div>
        <div //* COLUMN 2
            className="figmaElement">
            Text + Icon
            <Button useIcon iconOverlay>Test</Button>
            <Button circle useIcon iconOverlay>Test</Button>
        </div>
        <div //* COLUMN 3
            className="figmaElement">
            Icon
            <Button useIcon iconOverlay />
            <Button circle useIcon iconOverlay />
        </div>
        <div //* COLUMN 4
            className="figmaElement">
            Notification
            <Button useIcon iconOverlay useNotif />
            <Button circle useIcon iconOverlay useNotif />
        </div>
    </div>
}