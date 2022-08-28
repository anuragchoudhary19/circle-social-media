import axios from 'axios';

export const uploadVideo = async (file, token, setProgress) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = async (ev) => {
      //   console.log(ev);
      const CHUNK_SIZE = 5000;
      const chunkCount = Math.floor(ev.target.result.byteLength / CHUNK_SIZE);
      const remainder = ev.target.result.byteLength % CHUNK_SIZE === 0 ? 0 : 1;
      const fileName = Date.now() + file.name;
      for (let chunkId = 0; chunkId < chunkCount + remainder; chunkId++) {
        const chunk = ev.target.result.slice(chunkId * CHUNK_SIZE, chunkId * CHUNK_SIZE + CHUNK_SIZE);
        setProgress(Math.round((chunkId * 100) / (chunkCount + remainder), 0));
        let isLastChunk = chunkId === chunkCount + remainder - 1 ? true : false;
        const data = await axios
          .post(`${process.env.REACT_APP_API}/upload-video`, chunk, {
            headers: {
              Authorization: `Bearer ${token}`,
              'content-type': 'application/octet-stream',
              'file-name': fileName,
              'last-chunk': isLastChunk,
            },
          })
          .then((res) => {
            console.log(res);
            return res.data;
          })
          .catch((err) => {
            reject(err);
          });
        if (data?.url) resolve(data);
      }
    };
    fileReader.readAsArrayBuffer(file);
  });
};
