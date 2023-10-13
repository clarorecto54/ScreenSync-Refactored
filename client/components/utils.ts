import clsx from "clsx"
import { ClassValue } from "clsx"
import { twMerge } from "tw-merge"
/* -- TAILWIND CLASS MERGE -- */
function classMerge(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs)) //? This is used to combine multiple classes in one classname
}
/* -------- DRAW LINE ------- */
// function drawLine({ context, currentPoint, prevPoint, color }: DrawLineProps) {
//     const { x: currentX, y: currentY } = currentPoint
//     const lineColor = color //? Line color
//     const lineWidth = 8     //? Line width
//     //! Without this the lines will not be smooth
//     //* Every time the mouse moves it would create a circle(point)
//     //* then it would create a line with the same size of the circles
//     //* to connect the two points so there will be no gap between the
//     //* two points
//     var startPoint = prevPoint ?? currentPoint      //? Determine the starting point (If prevPoint does not exist currentPoint will be used)
//     context.beginPath()     //? Creates a new path
//     context.lineWidth = lineWidth       //? Set the line width for the gap-filling line
//     context.strokeStyle = lineColor     //? Set the stroke color for the line connecting the points
//     context.moveTo(startPoint.x, startPoint.y)      //? Move the path to the starting point
//     context.lineTo(currentX, currentY)      //? Add a line segment to the current point
//     context.stroke()    //? Stroke the path with the specified line width
//     context.fillStyle = lineColor   //? Set the fill color for the point
//     context.beginPath()     //? Begin a new path to avoid overlapping
//     context.arc(startPoint.x, startPoint.y, lineWidth / 2, 0, 2 * Math.PI)  //? Create a circle (point) at the starting point
//     context.fill()      //? Fill the circle with the specified color
// }
export { classMerge }