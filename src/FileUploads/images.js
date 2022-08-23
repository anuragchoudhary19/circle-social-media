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
// export const uploadVideo = (file, token) => {
//   const fileReader = new FileReader();
//   fileReader.onload = async (ev) => {
//     const CHUNK_SIZE = 5000;
//     const chunkCount = Math.floor(ev.target.result.byteLength / CHUNK_SIZE);
//     const remainder = ev.target.result.byteLength % CHUNK_SIZE === 0 ? 0 : 1;
//     // console.log(chunkCount + remainder);
//     const fileName = Math.random() * 100 + file.name;
//     for (let chunkId = 0; chunkId < chunkCount + remainder; chunkId++) {
//       const chunk = ev.target.result.slice(chunkId * CHUNK_SIZE, chunkId * CHUNK_SIZE + CHUNK_SIZE);
//       await await axios
//         .post(
//           `${process.env.REACT_APP_API}/upload-image`,
//           { image: uri },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         )
//         .then((res) => {
//           resolve(res.data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//       await fetch('http://localhost:8080/upload', {
//         method: 'POST',
//         headers: {
//           'content-type': 'application/octet-stream',
//           'content-length': chunk.length,
//           'file-name': fileName,
//         },
//         body: chunk,
//       });
//       //  progress.textContent = Math.round((chunkId * 100) / (chunkCount + remainder), 0);
//     }
//   };
//   fileReader.readAsArrayBuffer(file);
//   return new Promise((resolve, reject) => {
//     Resizer.imageFileResizer(
//       file,
//       720,
//       720,
//       'JPEG',
//       100,
//       0,
//       async (uri) => {
//         await axios
//           .post(
//             `${process.env.REACT_APP_API}/upload-image`,
//             { image: uri },
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           )
//           .then((res) => {
//             resolve(res.data);
//           })
//           .catch((err) => {
//             reject(err);
//           });
//       },
//       'base64'
//     );
//   });
// };

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
