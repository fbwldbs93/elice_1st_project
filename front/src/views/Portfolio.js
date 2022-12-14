import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";

import { UserStateContext } from "../App";
import * as Api from "../api";
import User from "../components/user/User";
import Project from "../components/userpage/project/Project";
import Certificate from "../components/userpage/certificate/Certificate";
import Education from "../components/userpage/education/Education";
import Award from "../components/userpage/award/Award";
import Loading from "./Loading";
import Intro from "../components/userpage/intro/Intro";

function loadData(ownerId) {
  return Promise.all([
    Api.get(`users/${ownerId}`),
    Api.get(`users/${ownerId}/education`),
    Api.get(`users/${ownerId}/award`),
    Api.get(`users/${ownerId}/project`),
    Api.get(`users/${ownerId}/certificate`),
  ]);
}

function Portfolio() {
  const navigate = useNavigate();
  const params = useParams();
  // useState 훅을 통해 portfolioOwner 상태를 생성함.
  const [portfolioOwner, setPortfolioOwner] = useState(null);
  // const portfolioData = useRef();
  const [ portfolioData, setPortFolioData ] = useState();

  // fetchPorfolioOwner 함수가 완료된 이후에만 (isFetchCompleted가 true여야) 컴포넌트가 구현되도록 함.
  // 아래 코드를 보면, isFetchCompleted가 false이면 "loading..."만 반환되어서, 화면에 이 로딩 문구만 뜨게 됨.
  const [isFetchCompleted, setIsFetchCompleted] = useState(false);
  const userState = useContext(UserStateContext);

  const fetchPorfolioOwner = async (ownerId) => {
    // 유저 id를 가지고 "/users/유저id" 엔드포인트로 요청해 사용자 정보를 불러옴.
    const owner = await Api.get("users", ownerId);
    // 사용자 정보는 response의 data임.
    const ownerData = owner.data;
    // portfolioOwner을 해당 사용자 정보로 세팅함.
    setPortfolioOwner(ownerData);

    const dataList = await loadData(ownerId);
    // portfolioData.current = {
    //   intro: dataList[0],
    //   education: dataList[1],
    //   award: dataList[2],
    //   project: dataList[3],
    //   certificate: dataList[4],
    // };

    setPortFolioData({
      intro: dataList[0],
      education: dataList[1],
      award: dataList[2],
      project: dataList[3],
      certificate: dataList[4],
    });

    // fetchPorfolioOwner 과정이 끝났으므로, isFetchCompleted를 true로 바꿈.
    setIsFetchCompleted(true);
  };

  useEffect(() => {
    // 전역 상태의 user가 null이라면 로그인이 안 된 상태이므로, 로그인 페이지로 돌림.
    if (!userState.user) {
      navigate("/login", { replace: true });
      return;
    }

    setPortFolioData(null);

    if (params.userId) {

      // 만약 현재 URL이 "/users/:userId" 라면, 이 userId를 유저 id로 설정함.
      const ownerId = params.userId;
      // 해당 유저 id로 fetchPorfolioOwner 함수를 실행함.
      fetchPorfolioOwner(ownerId);
    } else {

      // 이외의 경우, 즉 URL이 "/" 라면, 전역 상태의 user.id를 유저 id로 설정함.
      const ownerId = userState.user.user_id;
      // 해당 유저 id로 fetchPorfolioOwner 함수를 실행함.
      fetchPorfolioOwner(ownerId);
    }
  }, [userState, params, navigate]);

  if (portfolioData === null) {
    return null;
  }

  if (!isFetchCompleted) {
    return <Loading />;
  }

  return (
    <Container fluid>
      <Row>
        <Col md="3" lg="3">
          <User
            portfolioOwnerId={portfolioOwner.user_id}
            isEditable={portfolioOwner.user_id === userState.user?.user_id}
          />
        </Col>
        <Col>
          <Intro
            initialData={portfolioData.intro}
            isEditable={portfolioOwner.user_id === userState.user?.user_id}
            test={portfolioData}
          />
          <div className="mb-2" />
          <Education
            initialData={portfolioData.education}
            isEditable={portfolioOwner.user_id === userState.user?.user_id}
          />
          <div className="mb-2" />
          <Award
            initialData={portfolioData.award}
            isEditable={portfolioOwner.user_id === userState.user?.user_id}
          />
          <div className="mb-2" />
          <Project
            initialData={portfolioData.project}
            isEditable={portfolioOwner.user_id === userState.user?.user_id}
          />
          <div className="mb-2" />
          <Certificate
            initialData={portfolioData.certificate}
            isEditable={portfolioOwner.user_id === userState.user?.user_id}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Portfolio;
