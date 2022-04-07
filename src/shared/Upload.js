import React from "react";

import { Button } from "../elements";
import { storage } from "./firebase";


import { useDispatch, useSelector } from "react-redux";
import { actionCreators as imageActions } from "../redux/modules/image";

const Upload = (props) => {
  const dispatch = useDispatch();
  const uploading = useSelector((state) => state.image.uploading);
  const fileInput = React.useRef();

  const selectFile = (e) => {
    // e.target은 input!
    // input이 가진 files 객체
    console.log(e.target.files);
    // 선택한 파일이 어떻게 저장되어 있나 확인
    console.log(e.target.files[0]);
    // ref로도 확인
    console.log(fileInput.current.files[0]);

    // Preview 만들기
    // FileReader 사용하기위해서 객체생성
    const reader = new FileReader();
    //const file = e.target.files[0];
    const file = fileInput.current.files[0];

    // 파일 내용을 읽어오기
    reader.readAsDataURL(file);

    // 읽기가 끝나면 발생하는 이벤트 핸들러
    reader.onloadend = () => {
      // reader.result -> 파일의 컨텐츠이다
      console.log("event : ",reader.result);
      dispatch(imageActions.setPreview(reader.result));
    };
  };

  const uploadFB = () => {
    let image = fileInput.current?.files[0];
    const _upload = storage.ref(`images/${image?.name}`).put(image);

    //업로드하는 부분
    _upload.then((snapshot) => {
      console.log(snapshot);

      // 업로드한 파일의 다운로드 경로 가져오기
      snapshot.ref.getDownloadURL().then((url) => {
        console.log(url);
      });
    });
  };

  return (
    <React.Fragment>
      <input type="file" ref={fileInput} onChange={selectFile} />
      <Button _onClick={uploadFB}>업로드하기</Button>
    </React.Fragment>
  );
};
// const uploadFB = () => {
//     if (!fileInput.current || fileInput.current.files.length === 0) {
//       window.alert("파일을 선택해주세요!");
//       return;
//     }

//     dispatch(imageActions.uploadImageFB(fileInput.current.files[0]));
//   };

//   return (
//     <React.Fragment>
//       <input
//         type="file"
//         ref={fileInput}
//         onChange={selectFile}
//         disabled={uploading}
//       />
//       <Button _onClick={uploadFB}>업로드하기</Button>
//     </React.Fragment>
//   );
// };

export default Upload;
