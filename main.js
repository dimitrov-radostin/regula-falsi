document.addEventListener('DOMContentLoaded', ()=>{
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    const PADDING = 35
    const CANVAS_HEIGHT = canvas.clientHeight - 2 * PADDING
    const CANVAS_WIDTH = canvas.clientWidth - 2 * PADDING

    context.translate(PADDING, PADDING)
    context.translate(0, CANVAS_HEIGHT / 2)
    context.scale(1, -1)
    context.font = "18px Arial";

    const premadeFunctions = [
        x => (x + 0.1) * (x - 0.3) - 0.3,
        x => Math.cos(x) - x,
        x => 0.5 - Math.sin(x),
        x => Math.pow(x, x) - 2,
        x => Math.pow((x - 0.5), 3)
    ]

    let a, b, initalA, initalB, intervalLength // the borders of the interval, also used for drawing the lines
    let f = () => {}
    let scalingFactor = 1

    function drawFunction() {
        // Remove previous approximations from the list
        const list = document.getElementById('listOfApproximations')
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        // Clear Canvas keeping previous state settings (font, color, trasnslations)
        context.save()
        context.setTransform(1, 0, 0, 1, 0, 0)
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.restore()

        // Add Axes
        context.beginPath()
        context.moveTo(1, CANVAS_HEIGHT / 2)
        context.lineTo(1, - CANVAS_HEIGHT / 2)
        context.moveTo(0, 0)
        context.lineTo(CANVAS_WIDTH, 0)    
        context.lineWidth = 2
        context.stroke()

        // Get values
        const selectedFunction = document.getElementById('selectedFunction').value
        f = premadeFunctions[selectedFunction]
        a = Number(document.getElementById('intervalLeft').value)
        b = Number(document.getElementById('intervalRight').value)
        initalA = a
        initalB = b
        intervalLength = b - a

        // Draw the function's graph
        const values = []
        for (let i = 0; i < CANVAS_WIDTH; i++){
            values.push(f(a + (b - a) * i / CANVAS_WIDTH))
        }

        const maxValue = Math.max(...values)
        const minValue = Math.min(...values)
        if( maxValue < 0 || minValue > 0) {
            context.save()
            context.scale(1, -1)
            context.fillText(
                'Function contains odd number of zeros in the interval',
                20,
                -CANVAS_HEIGHT / 2,
                CANVAS_WIDTH
            )
            context.restore()
            return 
        }
//  move the avalidation elsewhere

        scalingFactor = (CANVAS_HEIGHT / 2 ) / Math.max(maxValue, - minValue)

        const scaledValues = values.map(v => v * scalingFactor)

        for (let i = 0; i < CANVAS_WIDTH; i++){
            x = i
            y = scaledValues[i]
            context.fillRect(x, y, 1, 1);
        }

        // Points and labels
        context.save()
        context.scale(1, -1)
        {
            const x = 0
            const y = - scaledValues[0]
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
            const y = - scaledValues[scaledValues.length - 1]
            const value = values[values.length - 1].toFixed(2)

            context.beginPath()
            context.arc(x, y, 4, 0, 2 * Math.PI )
            context.fill()
            context.fillText(
                `(${b}, ${value})`,
                x - 60 ,
                value > 0 ? y - 10 : y + 30
            );
        }
        context.restore()
    }

    function drawNextLine () {
        context.save()
        context.strokeStyle = '#AA0000'
        context.setLineDash([])
        context.lineWidth = 1
        context.beginPath()
        context.moveTo((a - initalA) * CANVAS_WIDTH / intervalLength, scalingFactor * f(a) )
        context.lineTo((b - initalA)* CANVAS_WIDTH / intervalLength, scalingFactor * f(b))
        context.stroke()

        const intersectionWithAbscissa = (b * f(a) - a * f(b)) / (f(a) - f(b))
        if (f(intersectionWithAbscissa) * f(a) < 0){
            b = intersectionWithAbscissa
        } else {
            a = intersectionWithAbscissa
        }
        
        context.beginPath()
        context.setLineDash([2, 3])
        context.moveTo((intersectionWithAbscissa - initalA) * CANVAS_WIDTH / intervalLength, f(intersectionWithAbscissa) * scalingFactor)
        context.lineTo((intersectionWithAbscissa - initalA)* CANVAS_WIDTH / intervalLength, 0)
        context.stroke()
        context.restore()
        return intersectionWithAbscissa
    }

    drawFunction()

    const button = document.getElementById('getApproximation')
    button.addEventListener('click', event => {
        let node = document.createElement('li')
        node.textContent = drawNextLine()
        document.getElementById('listOfApproximations').appendChild(node)
    })

    document.addEventListener('input', event => {
        drawFunction()
    })
})