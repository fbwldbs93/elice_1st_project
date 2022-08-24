import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";

function AwardAddForm({ portfolioOwnerId, setAwards, setIsAdding }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Form 제출 시 실행
  const handleSubmit = (e) => {
    e.preventDefault();

    if (title === "") {
      alert("수상내역이 비어있습니다!");

      return;
    }

    if (description === "") {
      alert("상세내역이 비어있습니다!");

      return;
    }

    // post
    // get
    // setAwards() 로 award 갱신
    setIsAdding(false); // Form 숨기기
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="awardAddTitle">
        <Form.Control
          type="text"
          placeholder="수상내역"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="awardAddDescription" className="mt-3">
        <Form.Control
          type="text"
          placeholder="상세내역"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mt-3 text-center">
        <Row className="mt-3 text-center">
          <Col sm={{ span: 20 }}>
            <Button className="me-3" variant="primary" type="submit">
              확인
            </Button>
            <Button variant="secondary" onClick={() => setIsAdding(false)}>
              취소
            </Button>
          </Col>
        </Row>
      </Form.Group>
    </Form>
  );
}

export default AwardAddForm;
