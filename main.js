document.addEventListener('DOMContentLoaded', ()=>{
    console.log('hi');
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    const PADDING = 35
    const CANVAS_HEIGHT = canvas.clientHeight - 2 * PADDING
    const CANVAS_WIDTH = canvas.clientWidth - 2 * PADDING

    context.translate(PADDING, PADDING)
    context.font = "18px Arial";

    const premadeFunctions = [
        x => (Number(x) + 0.1) * (Number(x) - 0.3) - 0.3,
        x => Math.cos(x) - x,
        x => 0.5 - Math.sin(x),
    ]

    function drawFunction() {
        // Clear Canvas keeping previous state settings (font, color, trasnslations)
        context.save()
        context.setTransform(1, 0, 0, 1, 0, 0)
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.restore()

        // Add Axes
        context.beginPath()
        context.moveTo(1, 0)
        context.lineTo(1, CANVAS_HEIGHT)
        context.moveTo(0, CANVAS_HEIGHT / 2)
        context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2)    
        context.lineWidth = 2
        context.stroke()

        // Draw the function 
        const selectedFunction = document.getElementById('selectedFunction').value
        const f = premadeFunctions[selectedFunction]
        console.log(f , f(0));
        const a = document.getElementById('intervalLeft').value
        const b = document.getElementById('intervalRight').value

        // Draw the function's graph
        const values = []
        for (let i = 0; i < CANVAS_WIDTH; i++){
            values.push(f(a + (b - a) * i / CANVAS_WIDTH))
        }

        const maxValue = Math.max(...values)
        const minValue = Math.min(...values)
        if( maxValue < 0 || minValue > 0) {
            console.log('Your function is bad and you should feel bad');
            return 
        }
        const scalingFactor = (CANVAS_HEIGHT / 2 ) / Math.max( maxValue, -minValue)

        const scaledValues = values.map(v => v * scalingFactor)

        for (let i = 0; i < CANVAS_WIDTH; i++){
            x = i
            y = CANVAS_HEIGHT / 2 - scaledValues[i]
            context.fillRect(x, y, 1, 1);
        }

        // Points and labels
        {
            const x = 0
            const y = CANVAS_HEIGHT / 2 - scaledValues[0]
            const value = values[0].toFixed(2)

            context.beginPath()
            context.arc(x, y, 4, 0, 2 * Math.PI )
            context.fill()
            context.fillText(
                `(${a}, ${value})`,
                x + 10 ,
                value > 0 ? y - 10 : y + 30 
            );
        }
        {
            const x = CANVAS_WIDTH
            const y = CANVAS_HEIGHT / 2 - scaledValues[scaledValues.length - 1]
            const value = values[values.length - 1].toFixed(2)

            context.beginPath()
            context.arc(x, y, 4, 0, 2 * Math.PI )
            context.fill()
            context.fillText(
                `(${a}, ${value})`,
                x - 40 ,
                value > 0 ? y - 10 : y + 30
            );
        }
    }

    drawFunction()
    document.addEventListener('input', event => {
        drawFunction()
    })
})