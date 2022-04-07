import React from "react";
// import Grid from "../elements/Grid";
// import Image from "../elements/Image";
// import Text from "../elements/Text";

import { Grid, Image, Text, Button } from "../elements";
import { history } from "../redux/configureStore";
import { useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";


const Post = (props) => {
  const dispatch = useDispatch();

  // 게시글 삭제하기 
  const deletePost = () =>{
    dispatch(postActions.deletePostFB(props.id));
  };

  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex padding="16px">
          <Grid is_flex width="auto">
            <Image shape="circle" src={props.src} />
            <Text bold="1">{props.user_info.user_name}</Text>
          </Grid>
          <Grid is_flex width="auto">
            <Text bold="1">{props.insert_dt}</Text>
            {props.is_me && (
              <Button
                width="auto"
                padding="4px"
                margin="4px"
                _onClick={() => {
                  history.push(`/write/${props.id}`);
                }}
              >
                수정
              </Button>
            )}
            {props.is_me && (
              <Button
                width="auto"
                padding="4px"
                margin="0px 5px"
                _onClick={deletePost}
              >
                삭제
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid padding="16px">
          <Text bold="1">{props.contents}</Text>
        </Grid>
        <Grid>
          <Image shape="rectangle" src={props.image_url} />
        </Grid>
        <Grid padding="16px">
          <Text margin="0px" bold="1">
            댓글 {props.comment_cnt}개
          </Text>
        </Grid>
        {/* 레이아웃이 right 일때 게시글 형태 */}
        {/* {props.layout === "right" && (
          <Grid is_flex padding="16px 0px">
            <Grid padding="16px">
              <Text textAlign bold>
                {props.contents}
              </Text>
            </Grid>
            <Image shape="rectangle" src={props.image_url} />
          </Grid>
        )} */}
        {/* 레이아웃이 left 일때 게시글 형태 */}
        {/* {props.layout === "left" && (
          <Grid is_flex padding="16px 0px">
            <Image shape="rectangle" src={props.image_url} />
            <Grid padding="16px">
              <Text textAlign bold>
                {props.contents}
              </Text>
            </Grid>
          </Grid>
        )} */}
        {/* 레이아웃이 bottom 일때 게시글 형태 */}
        {/* {props.layout === "bottom" && (
          <Grid padding="16px 0px">
            <Grid padding="5px 16px">
              <Text bold>{props.contents}</Text>
            </Grid>
            <Image shape="rectangle" src={props.image_url} />
          </Grid>
        )} */}
      </Grid>
    </React.Fragment>
  );
};

Post.defaultProps = {
  user_info: {
    user_name: "Anonymous",
    user_profile:
      "http://image.dongascience.com/Photo/2015/11/14478135982143[1].png",
  },
  image_url:
    "http://image.dongascience.com/Photo/2015/11/14478135982143[1].png",
  contents: "Anonymous group ",
  comment_cnt: 10,
  insert_dt: "2022-04-02 02:00:00",
  is_me: false,
};

export default Post;
