const Identicon = require('identicon.js');
const crypto = require('crypto');

function generateIdenticon(userId) {
  return new Promise((resolve, reject) => {
    try {
      const hash = crypto
        .createHash('sha256')
        .update(userId.toString())
        .digest('hex');
      console.log('Hash:', hash);

      const options = {
        size: 200, // 200x200 pixels
        format: 'png', // PNG format
      };

      const data = new Identicon(hash, options).toString();
      resolve(`data:image/png;base64,${data}`);
    } catch (error) {
      console.error('Identicon生成エラー:', error);
      reject(error);
    }
  });
}

module.exports = generateIdenticon;
