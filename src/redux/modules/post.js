// post.js
// Action 과 Reducer를 편하게 사용하도록하는 함수
import { createAction, handleActions } from "redux-actions";
// 불변성 관리를 편한게 해주는 함수
import { produce } from "immer";
import moment from "moment";

import { firestore, storage } from "../../shared/firebase";
import { actionCreators as imageActions } from "./image";



// action type
// SET_POST - 목록을 가지고 오면 redux에 넣는것
const SET_POST = "SET_POST";
// ADD_POST - 이미 redux 데이터에 들어가 있는것에 무엇인가 하나를 추가해줄때 사용
const ADD_POST = "ADD_POST";
// EDIT_POST - 수정하기 
const EDIT_POST = "EDIT_POST";
// DELETE_POST - 삭제하기
const DELETE_POST = "DELETE_POST" 

// action creators
const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));
const deletePost = createAction(DELETE_POST, (post_id) => ({ post_id }));

// 초기값 셋팅
const initialState = {
  list: [],
};

// 게시글 하나에 있는 정보들
const initialPost = {
  // user 데이터는 리덕스 이미 들어있기때문에 리덕스에 있는 정보 사용할것
  //  user_info: {
  //     id: 0,
  //     user_name: "Anonymous",
  //     user_profile:
  //       "http://image.dongascience.com/Photo/2015/11/14478135982143[1].png",
  //   },
  image_url:
    "http://image.dongascience.com/Photo/2015/11/14478135982143[1].png",
  contents: "",
  comment_cnt: 10,
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
  
};

// post 삭제하기 
const deletePostFB = (post_id = null) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("게시물 정보가 없어요!");
      return;
    }
    const postDB = firestore.collection("post");
    postDB
      .doc(post_id)
      .delete()
      .then(() => {
        dispatch(deletePost(post_id));
        history.replace("/");
      })

      .catch((error) => {
        window.alert("게시물 삭제에 문제가 있어요!");
        console.log("게시물 삭제에 문제가 있어요!", error);
      });
  };
};


// post 수정하기
const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("게시물 정보가 없어요!");
      return;
    }

    const _image = getState().image.preview;

    // 게시글 정보 가져오기 
    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];

    console.log(_post);

    const postDB = firestore.collection("post");

    if (_image === _post.image_url) {
      postDB
        .doc(post_id)
        .update(post)
        .then((doc) => {
          dispatch(editPost(post_id, { ...post }));
          history.replace("/");
        });

      return;
    } else {
      const user_id = getState().user.user.uid;
      const _upload = storage
        // 파일 이름을 유저 id와 현재시간을 밀리초로 넣어주기 (중복방지)
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      _upload.then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            console.log(url);

            return url;
          })
          .then((url) => {
            postDB
              .doc(post_id)
              .update({ ...post, image_url: url })
              .then((doc) => {
                dispatch(editPost(post_id, { ...post, image_url: url }));
                history.replace("/");
              });
          })
          .catch((err) => {
            window.alert("이미지 업로드에 문제가 있어요!");
            console.log("이미지 업로드에 문제가 있어요!", err);
          });
      });
    }
  };
};

// 게시글 추가 함수
const addPostFB = (contents = "") => {
  return function (dispatch, getState, { history }) {
    // firestore에서 post라는 collection 선택
    const postDB = firestore.collection("post");

    // store에 있는 user 정보 가져오기
    const _user = getState().user.user;

    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };

    const _post = {
      ...initialPost,
      contents: contents,
      // 위에 있는데 여기다가 또 하는 이유? post가 만들어지는 시점을 생각해야함.
      // addPost가 불려오고 나면 그때 하나하나 실행이 되면서 insert_dt를 만들 거임
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };
    // 잘 만들어졌나 확인
    //console.log("1 : ",{...user_info, ..._post});

    // getState()로 store의 상태값에 접근할 수 있다.
    const _image = getState().image.preview;
    // _image type 확인
    console.log(typeof _image);

    // 중복된 파일명이 생기지 않도록 하기 위해서
    // 파일 이름은 유저의 id와 현재 시간을 밀리초로 넣어준다
    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    _upload
      .then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            // url 확인!
            console.log(url);
            //dispatch(imageActions.uploadImage(url));
            return url;
          })
          .then((url) => {
            // return으로 넘겨준 값이 잘 넘어왔는지 확인
            console.log(url);

            postDB
              .add({ ...user_info, ..._post, image_url: url })
              .then((doc) => {
                // 아이디 추가
                let post = { user_info, ..._post, id: doc.id, image_url: url };
                // 리덕스에 넣어주기
                dispatch(addPost(post));
                history.replace("/");

                dispatch(imageActions.setPreview(null));
              })
              .catch((err) => {
                window.alert("**포스트 작성에 문제가 있습니다!");
                console.log("post 작성 실패!", err);
              });
          })
          .catch((err) => {
            window.alert("**이미지 업로드에 문제가 있습니다!");
            console.log(err);
          });
      })
  };
};

// firebase에서 post 가지고오기
const getPostFB = () => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");

    postDB.get().then((docs) => {
      let post_list = [];

      docs.forEach((doc) => {
        // 잘 가져왔나 확인
        // DB에서 가져온 것하고 우리가 Post 컴포넌트에서 쓰는 데이터 모양새 다름
        // console.log(doc.id, doc.data());

        // 방법 #1
        // 데이터 모양을 맞춰주자!
        //   let _post = doc.data();
        //   let post = {
        //       id: doc.id,
        //       user_info: {
        //           user_name: _post.user_name,
        //           user_profile: _post.user_profile,
        //           user_id: _post.user_id,
        //       },
        //       contents: _post.contents,
        //       image_url: _post.image_url,
        //       comment_cnt: _post.comment_cnt,
        //       imsert_dt: _post.insert_dt
        //   }

        //   post_list.push(post);

        // 방법 #2
        // key 값을 배열로 만들기
        let _post = doc.data();

        // Object.keys(_post)
        // ->['comment_cnt', 'contents', ..]
        // reduce -> 누산 함수 (참고 -https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
        // 맨처음 acc에는 {id: doc.id} dictionary가 그대로 들어감
        // cur에는 'comment_cnt', 'contents', .. key 값이 하나씩 들어감
        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            // cur에 user_ 가 포함이 되면 {...} return
            if (cur.indexOf("user_") !== -1) {
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            // ...acc 에는 {id: doc.id} dictionary가 그대로 들어감
            // [cur] : key값 , _post[cur] : value값
            return { ...acc, [cur]: _post[cur] }; // [cur]: _post[cur] -> comment_cnt: 10
          },
          { id: doc.id, user_info: {} }
        );

        post_list.push(post);
      });

      // 리스트 확인하기!
      console.log("post_list : ", post_list);

      dispatch(setPost(post_list));
    });
  };
};

// reducer 작성
export default handleActions(
  {
    // action.payload.post_list에 넘어온 값으로 dreft.list에 저장
    [SET_POST]: (state, action) =>
      produce(state, (dreft) => {
        dreft.list = action.payload.post_list;
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        // unshift 는 배열 맨 앞에 데이터를 넣는다
        draft.list.unshift(action.payload.post);
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),
    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = draft.list.filter((p) => p.id !== action.payload.post_id);
      }),
  },
  initialState
);

// action creator export
const actionCreators = {
  setPost,
  addPost,
  editPost,
  getPostFB,
  addPostFB,
  editPostFB,
  deletePostFB,
};

export { actionCreators };
