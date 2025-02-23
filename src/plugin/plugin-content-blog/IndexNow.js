const axios = require('axios');

async function submitToIndexNow(urlList, { host, key }) {
  try {
    const response = await axios.post('https://api.indexnow.org/indexnow', {
      host,
      key,
      keyLocation: `https://${host}/${key}.txt`,
      urlList: urlList
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });

    console.log('IndexNow submission successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting to IndexNow:', error);
    throw error;
  }
}

module.exports = {
  submitToIndexNow
}; 