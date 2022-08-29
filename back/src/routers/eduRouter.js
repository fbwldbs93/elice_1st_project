import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { eduService } from "../services/eduService";

const eduRouter = Router();

/*------Controller------- */

/*-- CREATE --*/
const createNewEdus = async (req, res, next) => {
  try {
    /* --checking: is the req.body acceptable data?--*/
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
    /*-distributing data from req-*/
    /* -req.currentUserId from login-requires -*/
    const user_id = req.currentUserId;
    /* must be same with schema!*/
    const { school, major, degree } = req.body;
    const newInput = { user_id, school, major, degree };

    const newEdu = await eduService.createEdus(newInput);

    if (newEdu.errorMessage) {
      throw new Error(newEdu.errorMessage);
    }
    res.status(201).json(newEdu);
  } catch (error) {
    next(error);
  }
};

/*-- UPDATE --*/
const updateNewEdu = async (req, res, next) => {
  try {
    //obj_id(comes from req.body._id) means objectID, which assigned automatically and can be used as primary key(RDBMS) in MongoDB. A req.body will possess it to distinct which data is updated.
    const obj_id = req.body._id;
    const school = req.body.school ?? null;
    const major = req.body.major ?? null;
    const degree = req.body.degree ?? null;
    //changed Input
    const newInput = { school, major, degree };
    const edu = await eduService.updateEdu(obj_id, newInput);

    res.status(201).send(edu);
  } catch (error) {
    next(error);
  }
};

/* -- GET --*/
///users/:id/education
const getEdus = async (req, res, next) => {
  try {
    //to get all docs of the user by user's id
    const user_id = req.params.id;
    const edus = await eduService.getEdus(user_id);
    res.status(201).send(edus);
  } catch (error) {
    next(error);
  }
};

/*--DELETE--*/
const deleteEdu = async (req, res, next) => {
  try {
    //use params id to delete
    const obj_id = req.params.id;
    const user_id = req.currentUserId;
    await eduService.deleteEdu(obj_id, user_id);
    return res.status(201).json({ message: "Education Deleted" });
  } catch (error) {
    next(error);
  }
};

/*-------Router-------*/
eduRouter.post("/users/education", login_required, createNewEdus);
eduRouter.put("/users/education", login_required, updateNewEdu);
eduRouter.get("/users/:id/education", login_required, getEdus);
eduRouter.delete("/users/education/:id", login_required, deleteEdu);

export { eduRouter };
