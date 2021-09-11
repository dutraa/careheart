var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var Signal = require('../signal.js')
var Painter = require('../painter.js')
var Minter = require('../minter.js')

var secrets = require('../secrets.js')

var state = "index";
var counter = 0;
var tokenId
var signal = new Signal()
var timestamp
var username

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {  });
});

/* POST from home page. */
router.post('/reading', upload.single('portrait'), function(req, res, next) {
    username = req.body.name;
    const simulator = req.body.simulator;
    const port = req.body.port;
    const isSimulator = req.body.simulator
    var readingFromText = "ECG connected to " + port
    if (isSimulator)
    {
	readingFromText = "simulator"
    }
    state = "reading";
    counter = 0
    console.log(req.file)
    signal = new Signal()
    timestamp  = new Date().toJSON()
    const finished = (data) => {
	var p = new Painter()
	var img = p.paint(username,
			  timestamp,
			  req.file.path,
			  data)
	state = "show";
	counter = 0;
    }

    if (isSimulator)
    {
	var timer = setInterval(()=>{
	    counter += 1;
	    if (counter > Signal.length_samples) {
		finished(signal.simulate())
		clearInterval(timer)
	    }
	}, 10);
    }
    else
    {
	signal.readFromDevice(port, (c)=>{counter = c}, finished)
    }
    res.render('reading', { readingFrom: readingFromText });
});


/* GET reading page. */
router.get('/reading', function(req, res, next) {
  res.render('reading', {  });
});

/* GET show page. */
router.get('/show', function(req, res, next) {
    res.render('show', {  });
});


/* POST from show page. */
router.post('/minting', async function(req, res, next) {
    var minter = new Minter();
    state = "miniting"
    counter = 0
    res.render('minting', { contract: secrets.contract });
    const metadata = await minter.upload(secrets.apiKey
	,
	username,
	username + " heartbeat " + timestamp,
	"public/images/result.jpg")


    console.log(metadata);
    counter = 1
    const receipt = await minter.mint(secrets.privkey, secrets.contract, metadata.url)
    tokenId = secrets.contract
    console.log(`The transaction status is:`);
    console.log(receipt);
    state = "minted"
    

});


/* GET minted page. */
router.get('/minted', function(req, res, next) {
    res.render('minted', { tokenId: tokenId });
});


/* GET status. */
router.get('/status', function(req, res, next) {
    res.json({ 'state': state, 'counter': counter });

});


module.exports = router;
