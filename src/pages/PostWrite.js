import React from "react";
import { Grid, Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as imageActions } from "../redux/modules/image";

const PostWrite = (props) => {

  const dispatch = useDispatch();
  // 로그인 후에만 /write에 접근하기위한 로그인 체크
  const is_login = useSelector((state) => state.user.is_login);
  const preview = useSelector((state) => state.image.preview);
  const post_list = useSelector((state) => state.post.list);

  const post_id = props.match.params.id;
  const is_edit = post_id ? true : false;

  // 로그인 하지 않았다면 로그인하러 가기 버튼 보여주기
  // props에서 history 가지고 오기 
  const {history} = props;
  //console.log(is_login);

  let _post = is_edit ? post_list.find((p) => p.id === post_id) : null;
  console.log("_post : ",_post);
  // 게시글 작성 페이지에서 텍스트 내용 저장하기 
  const [contents, setContents] = React.useState(_post ? _post.contents : "");

  React.useEffect(() => {
    if (is_edit && !_post) {
      console.log("포스트 정보가 없어요!");
      history.goBack();

      return;
    }

    if (is_edit) {
      dispatch(imageActions.setPreview(_post.image_url));
    }
  }, []);
  // e 이벤트 받아서 setContents 해주기 
  const ChangeConstents = (e) => {
    setContents(e.target.value);

    // console.log(e.target.value);
  }
  //console.log(contents);

  // 게시글 작성버튼과 연동 할때 사용함 
  const addPost = () => {
    dispatch(postActions.addPostFB(contents));
  }

  const editPost = () => {
    dispatch(postActions.editPostFB(post_id, {contents: contents}));
  }

  if(!is_login){
    return (
      <Grid margin="100px 0px" padding="16px" center>
        <Text size="32px" bold="1">
          Let me check here!
        </Text>
        <Text size="16px">
          Well, please sign here
        </Text>
        <Button
          _onClick={() => {
            history.replace("/login");
          }}        
        >
          let me login
        </Button>
      </Grid>
    )
  }

  return (
    <React.Fragment>
      <Grid padding="16px">
        <Text margin="0px" size="36px" bold="1">
          게시글 작성
        </Text>
        <Upload />
      </Grid>

      <Grid>
        <Grid padding="16px">
          <Text margin="0px" size="24px" bold="1">
            미리보기
          </Text>
        </Grid>
        {/* 미리보기 이미지 넣어주기 */}
        <Image
          shape="rectangle"
          src={preview ? preview : "http://via.placeholder.com/400x300"}
        />
      </Grid>

      <Grid padding="16px">
        {/* Input 앨리먼트에 넘겨주기 */}
        <Input
          value={contents}
          _onChange={ChangeConstents}
          label="게시글 내용"
          placeholder="게시글 작성"
          multiLine
        />
      </Grid>

      <Grid padding="16px">
        {is_edit ? (
          <Button text="게시글 수정" _onClick={editPost}></Button>
        ) : (
          <Button text="게시글 작성" _onClick={addPost}></Button>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default PostWrite;
