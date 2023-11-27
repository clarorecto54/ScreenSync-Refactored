export interface DrawLineProps {
    context: CanvasRenderingContext2D
    currentPoint: Point
    prevPoint: Point | null
    lineWidth: number
    color: string
}
export interface Point {
    x: number
    y: number
}
export interface HostLineProps {
    currentPoint: Point
    prevPoint: Point | null
    lineWidth: number
    color: string
}