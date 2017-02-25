import GOOGLE_API_KEY from './config';

export default (locationArray, keyword, radius) => {
  const latitude = locationArray[0];
  const longitude = locationArray[1];
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=${keyword}&key=${GOOGLE_API_KEY}`;

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        resolve(responseJson);
      })
      .catch(error => reject(error));
  });
};
