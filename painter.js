var Jimp = require('jimp');
var fs = require('fs');
const { createCanvas } = require('canvas')

class Painter {
    static width = 2280
    static height = 1620
    static margin = 80
    static textSize = Math.floor(Painter.height / 4)
    static photoWidth = Math.floor(Painter.width / 3)
    static ecgWidth = Math.floor(Painter.width / 2)
    static ecgHeight = Math.floor(Painter.height / 2)
    
    static background = 'images/background.png'
    static result = "public/images/result.jpg"
    static chartPath = 'uploads/chart.png';
    
    constructor() {
    }

    paint(name, date, photo, data) {

	Jimp.read(Painter.background, (err, bg) => {
	    if (err)
	    {
		console.log(err)
		throw err;
	    }
	    var composed  = bg.resize(Painter.width, Painter.height) 
	    Jimp.read(photo, (err, por) => {
		if (err)
		{
		    console.log(err)
		    throw err;
		}
		const h = Math.floor(por.bitmap.height/por.bitmap.width*Painter.photoWidth);
		var ph = por.resize(Painter.photoWidth, h)
		var x0 = Painter.width - Painter.margin - Painter.photoWidth
		var y0 = Painter.margin
		console.log(x0)
		console.log(y0)
		composed.composite(ph, x0, y0,
					     {
						 mode: Jimp.BLEND_SOURCE_OVER,
						 opacityDest: 1,
						 opacitySource: 1
					     })
		Jimp.loadFont(Jimp.FONT_SANS_128_BLACK).then( (font) => {
		    composed.print(font, Painter.margin, Painter.margin, name);
		    Jimp.loadFont(Jimp.FONT_SANS_64_BLACK).then( (font) => {
			composed.print(font, Painter.margin, Painter.margin*4, date);


			const canvas = createCanvas(Painter.ecgWidth, Painter.ecgHeight)
			const ctx = canvas.getContext('2d')

			const mi = Math.min(...data)
			const mx = Math.max(...data)
			console.log(mi)
			console.log(mx)

			ctx.beginPath()
			ctx.moveTo(0, 0)
			ctx.strokeStyle = '#ff0000'
			ctx.lineWidth = 5
			
			for (var i = 0; i < data.length; i++) {
			    const y = Math.floor(i * Painter.ecgWidth / data.length)
			    const x = Math.floor((data[i]-mi)*Painter.ecgHeight / (mx - mi))
			    ctx.lineTo(y, x);
			}
			
	
			ctx.stroke();
			const buffer = canvas.toBuffer('image/png')
			fs.writeFileSync(Painter.chartPath, buffer)
			Jimp.read(Painter.chartPath, (err, cha) => {
			    if (err)
			    {
				console.log(err)
				throw err;
			    }
			    composed.composite(cha, Painter.margin, Painter.height- Painter.margin - Painter.ecgHeight,
					       {
						   mode: Jimp.BLEND_SOURCE_OVER,
						   opacityDest: 1,
						   opacitySource: 1
					       })

			    
			    composed.write(Painter.result);
			})			
		    })
		})
	    })

		      
	});
	return Painter.result
    }
    
}

module.exports = Painter


/*
console.log("Painter test")
var p = new Painter()
var Signal = require('./signal.js')
var signal = new Signal()

var img = p.paint("Jane Doe", "2021-03-26 16:23:10",  'uploads/0a1ace5fb60b80a3db201065c6dd3413', signal.simulate())
console.log(img)
*/
