const multer = require('multer');
const path = require('path')

const dest = path.join(__dirname + '../../uploads/')

const storage = multer.diskStorage({
  destination : dest,
  filename : (req, file, callback) => {
    callback(null, Date.now() + '.pdf')
  }
})

module.exports = multer({storage})