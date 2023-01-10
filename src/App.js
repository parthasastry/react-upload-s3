import React, { useState, useEffect } from "react";
import { Storage } from "aws-amplify";

const App = () => {
  const [images, setImages] = useState([]);
  const [singleImage, setSingleImage] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    let imageKeys = await Storage.list("folder/"); // You can add /filder inside
    // console.log("imageKeys: ", imageKeys.results);
    let imageKeysUrl = await Promise.all(
      imageKeys.results.map(async (k) => {
        const signedUrl = await Storage.get(k.key);
        return signedUrl;
      })
    );
    // console.log("imageKeysUrl: ", imageKeysUrl);
    setImages(imageKeysUrl);

    let Key = "folder/DL.jpeg";
    let keyUrl = await Storage.get(Key);
    // console.log(keyUrl);
    setSingleImage(keyUrl);
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    const files = [...e.target.files];
    const folder = "folder/";
    // const fileName = folder + file.name;
    // const result = await Storage.put(fileName, file);

    const res = files.map(async (file) => {
      const fileName = folder + file.name;
      const result = await Storage.put(fileName, file);
      console.log(result);
      fetchImages();
    });
    // console.log("result: ", result);
    console.log(files);

    console.log("multiple files: ", multipleFiles);
    // fetchImages();
  };

  return (
    <>
      <div>Storage Example (S3)</div>
      <div>
        <input
          type="file"
          accept=".png, .jpeg, .jpg"
          multiple
          onChange={onChange}
        />
      </div>
      {/* <div>
        <p>Single file</p>
        <img
          src={singleImage}
          key={singleImage}
          style={{ width: 300, height: 200, marginBottom: 10 }}
        />
      </div> */}
      {images.map((image) => {
        return (
          <img
            src={image}
            key={image}
            style={{ width: 300, height: 200, marginBottom: 10 }}
          />
        );
      })}
    </>
  );
};

export default App;
