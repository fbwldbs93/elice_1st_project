import { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import ProjectForm from "./ProjectForm"
import { TYPES } from "../../util/util";

const ProjectInfo = ({ projects, index, handler }) => {
    const [ isEditing, setIsEditing ] = useState(false);
    const { project_id, title, detail, date } = projects[index];

    const handleForm = () => {
        setIsEditing((current) => !current);
    }

    if (isEditing) {
        return (
            <ProjectForm projects={projects} index={index} handler={handler} type={TYPES.edit} handleForm={handleForm} />
        );
    }

    return (
        <Card.Text as="div">
            <Row className="justify-content-between align-items-center mb-2">
                <Col>
                    {title}
                    <br />
                    <span className="text-muted">{detail}</span>
                    <br />
                    <span className="text-muted">{date}</span>
                </Col>
                <Col className="col-lg-1">
                    <Button size="sm" variant="outline-info" onClick={handleForm}>편집</Button>
                    <div className="mb-2"/>
                    <Button size="sm" variant="outline-danger" onClick={() => handler.remove(project_id, title)}>삭제</Button>
                </Col>
            </Row>
        </Card.Text>
    );
}

export default ProjectInfo;