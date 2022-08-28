import Resizer from 'react-image-file-resizer';
import axios from 'axios';

export const uploadImage = (file, token) => {
  return new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      file,
      720,
      720,
      'JPEG',
      100,
      0,
      async (uri) => {
        await axios
          .post(
            `${process.env.REACT_APP_API}/upload-image`,
            { image: uri },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      },
      'base64'
    );
  });
};

export const deleteImage = async (public_id, token) => {
  return await new Promise(async (resolve, reject) => {
    await axios
      .post(
        `${process.env.REACT_APP_API}/remove-image`,
        { public_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res);
        resolve(res.data.success);
      })
      .catch((err) => {
        console.log(err);
        reject(err.data);
      });
  });
};
